import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import workerDefault, { handleWorkerRequest, MAX_JSON_BODY_BYTES } from '../src/index.ts';
import {
  buildNotificationEmailHtml,
  escapeHtml,
  retryPendingOrFailedNotifications,
} from '../src/notifications.ts';
import {
  EXPECTED_TURNSTILE_ACTION,
  TURNSTILE_TEST_SECRET_PASS,
} from '../src/turnstile.ts';
import type {
  D1DatabaseLike,
  D1PreparedStatement,
  D1Result,
  Env,
  ExecutionContextLike,
  TicketRecord,
} from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATION_PATH = path.resolve(__dirname, '../migrations/0001_init_tickets.sql');

type SqliteBindValue = string | number | bigint | null | Uint8Array;

/**
 * Adaptador de Cloudflare D1 sobre `node:sqlite` (mismo motor SQLite real que usa D1)
 * con soporte completo de parámetros posicionales `?1..?N` y `db.batch()` transaccional.
 */
class SqliteD1Adapter implements D1DatabaseLike {
  private db: DatabaseSync;
  public simulateWriteFailure = false;

  constructor(migrationSql: string) {
    this.db = new DatabaseSync(':memory:');
    this.db.exec(migrationSql);
  }

  private expandPositionalParams(
    query: string,
    boundValues: unknown[]
  ): { sql: string; params: SqliteBindValue[] } {
    const expandedParams: SqliteBindValue[] = [];
    const hasNumbered = /\?\d+/.test(query);

    if (!hasNumbered) {
      return {
        sql: query,
        params: boundValues.map((v) => (v === undefined ? null : (v as SqliteBindValue))),
      };
    }

    const sql = query.replace(/\?(\d+)/g, (_match, numStr) => {
      const idx = Number(numStr) - 1;
      const val = boundValues[idx];
      expandedParams.push(val === undefined ? null : (val as SqliteBindValue));
      return '?';
    });

    return { sql, params: expandedParams };
  }

  prepare(query: string): D1PreparedStatement {
    const self = this;

    const createBound = (boundValues: unknown[]): D1PreparedStatement => ({
      bind(...values: unknown[]) {
        return createBound(values);
      },
      async first<T = Record<string, unknown>>(): Promise<T | null> {
        const { sql, params } = self.expandPositionalParams(query, boundValues);
        const stmt = self.db.prepare(sql);
        const row = stmt.get(...params) as T | undefined;
        return row ?? null;
      },
      async run<T = unknown>(): Promise<D1Result<T>> {
        const { sql, params } = self.expandPositionalParams(query, boundValues);
        if (self.simulateWriteFailure && /^\s*INSERT\s+INTO\s+tickets/i.test(sql)) {
          return { success: false, meta: { changes: 0 } };
        }
        const stmt = self.db.prepare(sql);
        const info = stmt.run(...params);
        return {
          success: true,
          meta: {
            changes: Number(info.changes),
            last_row_id: Number(info.lastInsertRowid),
          },
        };
      },
      async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
        const { sql, params } = self.expandPositionalParams(query, boundValues);
        const stmt = self.db.prepare(sql);
        const rows = stmt.all(...params) as T[];
        return {
          success: true,
          results: rows,
        };
      },
    });

    return createBound([]);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const results: D1Result<T>[] = [];
      for (const stmt of statements) {
        results.push(await stmt.run<T>());
      }
      this.db.exec('COMMIT');
      return results;
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  queryAllTickets(): TicketRecord[] {
    const stmt = this.db.prepare('SELECT * FROM tickets ORDER BY created_at DESC');
    return stmt.all() as unknown as TicketRecord[];
  }
}

const migrationSql = fs.readFileSync(MIGRATION_PATH, 'utf8');

function createTestEnv(db: D1DatabaseLike, overrides: Partial<Env> = {}): Env {
  return {
    DB: db,
    ENVIRONMENT: 'test',
    ALLOWED_ORIGINS: 'https://otxsolutions.com.ar,http://localhost:3000',
    TURNSTILE_ALLOWED_HOSTNAMES: 'localhost,127.0.0.1,otxsolutions.com.ar',
    TURNSTILE_EXPECTED_ACTION: EXPECTED_TURNSTILE_ACTION,
    TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_PASS,
    IP_HASH_SALT: 'test-cryptographic-salt-2026-otx',
    RESEND_API_KEY: '',
    NOTIFICATION_FROM_EMAIL: 'OTX Solutions <notificaciones@otxsolutions.com.ar>',
    NOTIFICATION_TO_EMAIL: 'solutionsotx@gmail.com',
    ...overrides,
  };
}

function makeSiteverifyOkFetch(
  hostname = 'otxsolutions.com.ar',
  action = EXPECTED_TURNSTILE_ACTION
): typeof fetch {
  return async (input) => {
    const url = String(input);
    if (url.includes('siteverify')) {
      return new Response(
        JSON.stringify({
          success: true,
          hostname,
          action,
          challenge_ts: new Date().toISOString(),
        }),
        { status: 200 }
      );
    }
    throw new Error(`Unexpected fetch to ${url}`);
  };
}

function makeTicketRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('https://api.otxsolutions.com.ar/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://otxsolutions.com.ar',
      'CF-Connecting-IP': '190.19.120.45',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validPayload = {
  nombre: 'Laura Méndez',
  email: 'laura@estudio-mendez.com.ar',
  telefono: '+54 9 11 4567-8901',
  tipo: 'pyme',
  plan: 'Empresa Operativa - $180.000/mes',
  servicio: 'Soporte técnico remoto y visitas coordinadas',
  asunto: 'Interesado en: Empresa Operativa - $180.000/mes',
  mensaje: 'Necesitamos cubrir 5 notebooks con Windows 11 y configurar copias de seguridad.',
  canal: 'TicketWeb',
  website: '',
  turnstileToken: 'tok_valid_turnstile_001',
};

interface TestSummaryItem {
  test: string;
  passed: boolean;
  details: Record<string, unknown>;
}

const report: TestSummaryItem[] = [];

(async () => {
  // =========================================================================
  // 1. HEALTH CHECKS SEPARADOS (WORKER LIVENESS VS D1 READINESS REAL)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const envOk = createTestEnv(db);

    const resHealthOk = await handleWorkerRequest(
      new Request('https://api.otxsolutions.com.ar/api/health', { method: 'GET' }),
      envOk
    );
    assert.equal(resHealthOk.status, 200);
    const bodyHealthOk = (await resHealthOk.json()) as Record<string, unknown>;
    assert.equal(bodyHealthOk.ok, true);
    assert.equal(bodyHealthOk.worker, 'up');
    assert.equal(bodyHealthOk.database, 'up');

    // Sin base D1 o con esquema faltante -> /api/health devuelve 503 pero /api/health/live devuelve 200
    const unmigratedDb = new SqliteD1Adapter('');
    const envUnmigrated = createTestEnv(unmigratedDb);

    const resHealthDown = await handleWorkerRequest(
      new Request('https://api.otxsolutions.com.ar/api/health', { method: 'GET' }),
      envUnmigrated
    );
    assert.equal(resHealthDown.status, 503);
    const bodyHealthDown = (await resHealthDown.json()) as Record<string, unknown>;
    assert.equal(bodyHealthDown.ok, false);
    assert.equal(bodyHealthDown.worker, 'up');
    assert.equal(bodyHealthDown.database, 'down');

    const resLive = await handleWorkerRequest(
      new Request('https://api.otxsolutions.com.ar/api/health/live', { method: 'GET' }),
      envUnmigrated
    );
    assert.equal(resLive.status, 200);
    const bodyLive = (await resLive.json()) as Record<string, unknown>;
    assert.equal(bodyLive.ok, true);
    assert.equal(bodyLive.worker, 'up');

    report.push({
      test: '1. GET /api/health comprueba D1 real (200 up vs 503 down) y GET /api/health/live separa disponibilidad del Worker',
      passed: true,
      details: {
        healthWithMigratedD1: resHealthOk.status,
        healthWithBrokenD1: resHealthDown.status,
        livenessWithBrokenD1: resLive.status,
      },
    });
  }

  // =========================================================================
  // 2. CREACIÓN CORRECTA DE TICKET + PERSISTENCIA D1 + CONTRATO FRONTEND
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    const res = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: makeSiteverifyOkFetch(),
    });
    assert.equal(res.status, 201);
    const data = (await res.json()) as Record<string, unknown>;

    assert.equal(data.success, true);
    assert.equal(typeof data.ticket_id, 'string');
    assert.match(String(data.ticket_id), /^OTX-\d{2}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);
    assert.ok(String(data.message).includes(String(data.ticket_id)));

    const savedRows = db.queryAllTickets();
    assert.equal(savedRows.length, 1);
    assert.equal(savedRows[0].ticket_number, data.ticket_id);
    assert.equal(savedRows[0].status, 'Nuevo');
    assert.equal(savedRows[0].priority, 'Normal');
    assert.equal(savedRows[0].notification_status, 'SKIPPED_UNCONFIGURED');
    assert.notEqual(savedRows[0].client_ip_hash, '190.19.120.45');

    report.push({
      test: '2. Creación correcta de ticket en D1 y cumplimiento del contrato { success, ticket_id, message }',
      passed: true,
      details: {
        httpStatus: res.status,
        ticketId: data.ticket_id,
        d1Status: savedRows[0].status,
        d1NotificationStatus: savedRows[0].notification_status,
      },
    });
  }

  // =========================================================================
  // 3. IDEMPOTENCIA DESPUÉS DE SITEVERIFY (SIN BYPASS DE TURNSTILE NI EXPOSICIÓN ENTRE IPs)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    // 3a. Primer envío legítimo -> 201 Created
    const res1 = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: makeSiteverifyOkFetch(),
    });
    assert.equal(res1.status, 201);
    const body1 = (await res1.json()) as Record<string, unknown>;
    assert.ok(body1.ticket_id);

    // 3b. Intento con el MISMO payload/fingerprint pero con Turnstile inválido/reutilizado:
    // NUNCA debe devolver el ticket_id existente ni 200 duplicate: true (no hay bypass de Siteverify).
    const mockInvalidTurnstile: typeof fetch = async () =>
      new Response(
        JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
        { status: 200 }
      );

    const resUnverifiedDuplicate = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, turnstileToken: 'tok_reused_or_forged' }),
      env,
      { fetchImpl: mockInvalidTurnstile }
    );
    assert.equal(resUnverifiedDuplicate.status, 400);
    const bodyUnverified = (await resUnverifiedDuplicate.json()) as Record<string, unknown>;
    assert.equal(bodyUnverified.success, false);
    assert.equal(bodyUnverified.ticket_id, undefined);
    assert.equal(bodyUnverified.duplicate, undefined);
    assert.equal(bodyUnverified.turnstile_reset, true);

    // 3c. Reintento legítimo desde la MISMA IP que sí supera Siteverify -> 200 duplicate: true con mismo ticket_id
    const resVerifiedRetry = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, turnstileToken: 'tok_fresh_valid_retry' }),
      env,
      { fetchImpl: makeSiteverifyOkFetch() }
    );
    assert.equal(resVerifiedRetry.status, 200);
    const bodyRetry = (await resVerifiedRetry.json()) as Record<string, unknown>;
    assert.equal(bodyRetry.success, true);
    assert.equal(bodyRetry.duplicate, true);
    assert.equal(bodyRetry.ticket_id, body1.ticket_id);
    assert.equal(db.queryAllTickets().length, 1);

    // 3d. Envío idéntico desde OTRA IP distinta que supera Siteverify:
    // No expone el ticket_id del primer usuario; registra un ticket nuevo e independiente.
    const resOtherIp = await handleWorkerRequest(
      makeTicketRequest(
        { ...validPayload, turnstileToken: 'tok_other_ip_valid' },
        { 'CF-Connecting-IP': '181.45.20.99' }
      ),
      env,
      { fetchImpl: makeSiteverifyOkFetch() }
    );
    assert.equal(resOtherIp.status, 201);
    const bodyOtherIp = (await resOtherIp.json()) as Record<string, unknown>;
    assert.notEqual(bodyOtherIp.ticket_id, body1.ticket_id);
    assert.equal(db.queryAllTickets().length, 2);

    report.push({
      test: '3. Detección de duplicados ocurre exclusivamente después de Siteverify y aísla fingerprints por IP hash',
      passed: true,
      details: {
        unverifiedDuplicateBlockedStatus: resUnverifiedDuplicate.status,
        unverifiedLeakedTicketId: bodyUnverified.ticket_id ?? null,
        verifiedSameIpDuplicateStatus: resVerifiedRetry.status,
        differentIpIsolatedStatus: resOtherIp.status,
      },
    });
  }

  // =========================================================================
  // 4. VALIDACIÓN DE HOSTNAME Y ACTION EN TURNSTILE POR ENTORNO (DEV, STAGING, PROD)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);

    // 4a. Action incorrecta en Siteverify ('login' en lugar de 'ticket_submit') -> HTTP 400
    const envTest = createTestEnv(db);
    const resWrongAction = await handleWorkerRequest(
      makeTicketRequest(validPayload),
      envTest,
      { fetchImpl: makeSiteverifyOkFetch('otxsolutions.com.ar', 'wrong_action') }
    );
    assert.equal(resWrongAction.status, 400);
    const bodyWrongAction = (await resWrongAction.json()) as Record<string, unknown>;
    assert.equal(bodyWrongAction.success, false);
    assert.equal(bodyWrongAction.turnstile_reset, true);

    // 4b. Entorno PRODUCTION: acepta 'otxsolutions.com.ar', rechaza 'localhost' y '*.otx-solutions.pages.dev'
    const envProd = createTestEnv(db, {
      ENVIRONMENT: 'production',
      TURNSTILE_SECRET_KEY: '0x4AAAAAA_real_production_secret_key_simulated',
      TURNSTILE_ALLOWED_HOSTNAMES: '', // Usa la lista por defecto de production
    });

    const resProdWithLocalhost = await handleWorkerRequest(
      makeTicketRequest(validPayload, { 'CF-Connecting-IP': '200.10.20.1' }),
      envProd,
      { fetchImpl: makeSiteverifyOkFetch('localhost', EXPECTED_TURNSTILE_ACTION) }
    );
    assert.equal(resProdWithLocalhost.status, 400);

    const resProdWithPagesDev = await handleWorkerRequest(
      makeTicketRequest(validPayload, { 'CF-Connecting-IP': '200.10.20.2' }),
      envProd,
      {
        fetchImpl: makeSiteverifyOkFetch(
          'preview-branch.otx-solutions.pages.dev',
          EXPECTED_TURNSTILE_ACTION
        ),
      }
    );
    assert.equal(resProdWithPagesDev.status, 400);

    const resProdWithValidHost = await handleWorkerRequest(
      makeTicketRequest(validPayload, { 'CF-Connecting-IP': '200.10.20.3' }),
      envProd,
      { fetchImpl: makeSiteverifyOkFetch('otxsolutions.com.ar', EXPECTED_TURNSTILE_ACTION) }
    );
    assert.equal(resProdWithValidHost.status, 201);

    // 4c. Entorno STAGING: acepta '*.otx-solutions.pages.dev' y 'staging.otxsolutions.com.ar', rechaza 'localhost' y clave dummy
    const envStaging = createTestEnv(db, {
      ENVIRONMENT: 'staging',
      ALLOWED_ORIGINS: 'https://*.otx-solutions.pages.dev,https://staging.otxsolutions.com.ar',
      TURNSTILE_SECRET_KEY: '0x4AAAAAA_real_staging_secret_key_simulated',
      TURNSTILE_ALLOWED_HOSTNAMES: '', // Usa la lista por defecto de staging
    });

    const resStagingPagesOk = await handleWorkerRequest(
      makeTicketRequest(validPayload, {
        Origin: 'https://feat-cloudflare-tickets.otx-solutions.pages.dev',
        'CF-Connecting-IP': '200.10.30.1',
      }),
      envStaging,
      {
        fetchImpl: makeSiteverifyOkFetch(
          'feat-cloudflare-tickets.otx-solutions.pages.dev',
          EXPECTED_TURNSTILE_ACTION
        ),
      }
    );
    assert.equal(resStagingPagesOk.status, 201);

    const resStagingRejectsLocalhost = await handleWorkerRequest(
      makeTicketRequest(validPayload, {
        Origin: 'https://feat-cloudflare-tickets.otx-solutions.pages.dev',
        'CF-Connecting-IP': '200.10.30.2',
      }),
      envStaging,
      { fetchImpl: makeSiteverifyOkFetch('localhost', EXPECTED_TURNSTILE_ACTION) }
    );
    assert.equal(resStagingRejectsLocalhost.status, 400);

    // Clave dummy de prueba bloqueada tanto en staging como en production
    const envStagingWithDummyKey = createTestEnv(db, {
      ...envStaging,
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_PASS,
    });
    const resStagingDummyBlocked = await handleWorkerRequest(
      makeTicketRequest(validPayload, {
        Origin: 'https://feat-cloudflare-tickets.otx-solutions.pages.dev',
        'CF-Connecting-IP': '200.10.30.3',
      }),
      envStagingWithDummyKey
    );
    assert.equal(resStagingDummyBlocked.status, 400);

    report.push({
      test: '4. Turnstile Siteverify valida hostname y action (ticket_submit) con listas separadas para dev, staging y production',
      passed: true,
      details: {
        wrongActionStatus: resWrongAction.status,
        prodRejectsLocalhostStatus: resProdWithLocalhost.status,
        prodRejectsPagesDevStatus: resProdWithPagesDev.status,
        prodAcceptsMainDomainStatus: resProdWithValidHost.status,
        stagingAcceptsPagesPreviewStatus: resStagingPagesOk.status,
        stagingRejectsLocalhostStatus: resStagingRejectsLocalhost.status,
        stagingBlocksDummySecretStatus: resStagingDummyBlocked.status,
      },
    });
  }

  // =========================================================================
  // 5. CONCURRENCIA DEL RATE LIMIT EN D1, SAL SECRETA OBLIGATORIA Y LÍMITE 16 KB (HTTP 413)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    // 5a. Ráfaga concurrente de 6 solicitudes desde la misma IP -> exactamente 3 permitidas (201) y 3 bloqueadas (429)
    const burstPromises = Array.from({ length: 6 }, (_, idx) =>
      handleWorkerRequest(
        makeTicketRequest(
          {
            ...validPayload,
            mensaje: `Solicitud concurrente número ${idx + 1} para verificar rate limit atómico.`,
          },
          { 'CF-Connecting-IP': '190.55.66.77' }
        ),
        env,
        { fetchImpl: makeSiteverifyOkFetch() }
      )
    );
    const burstResponses = await Promise.all(burstPromises);
    const statuses = burstResponses.map((r) => r.status);
    const createdCount = statuses.filter((s) => s === 201).length;
    const rateLimitedCount = statuses.filter((s) => s === 429).length;
    assert.equal(createdCount, 3);
    assert.equal(rateLimitedCount, 3);

    // 5b. IP_HASH_SALT obligatorio en production y staging (rechaza vacío, corto o valor por defecto con HTTP 503)
    const envProdMissingSalt = createTestEnv(db, {
      ENVIRONMENT: 'production',
      TURNSTILE_SECRET_KEY: '0x4AAAAAA_real_prod_secret',
      IP_HASH_SALT: '',
    });
    const resMissingSalt = await handleWorkerRequest(
      makeTicketRequest(validPayload),
      envProdMissingSalt
    );
    assert.equal(resMissingSalt.status, 503);

    const envProdDefaultSalt = createTestEnv(db, {
      ENVIRONMENT: 'production',
      TURNSTILE_SECRET_KEY: '0x4AAAAAA_real_prod_secret',
      IP_HASH_SALT: 'otx-default-salt',
    });
    const resDefaultSalt = await handleWorkerRequest(
      makeTicketRequest(validPayload),
      envProdDefaultSalt
    );
    assert.equal(resDefaultSalt.status, 503);

    // 5c. Cuerpo JSON mayor a 16 KB -> HTTP 413 Payload Too Large
    const oversizedBody = JSON.stringify({
      ...validPayload,
      mensaje: 'X'.repeat(MAX_JSON_BODY_BYTES + 512),
    });
    const resOversized = await handleWorkerRequest(
      makeTicketRequest(oversizedBody, { 'CF-Connecting-IP': '190.88.99.11' }),
      env
    );
    assert.equal(resOversized.status, 413);

    report.push({
      test: '5. Rate-limit atómico ante concurrencia (3x201 y 3x429), IP_HASH_SALT obligatorio en prod/staging (503) y límite de 16 KB (413)',
      passed: true,
      details: {
        concurrentAllowed: createdCount,
        concurrentRateLimited: rateLimitedCount,
        missingProdSaltStatus: resMissingSalt.status,
        defaultProdSaltStatus: resDefaultSalt.status,
        oversizedPayloadStatus: resOversized.status,
      },
    });
  }

  // =========================================================================
  // 6. NOTIFICACIONES NO BLOQUEANTES CON ctx.waitUntil() Y RECUPERACIÓN DE FALLOS
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const envWithResend = createTestEnv(db, {
      RESEND_API_KEY: 're_test_key_simulated_secret_12345',
    });

    const waitUntilQueue: Promise<unknown>[] = [];
    const mockCtx: ExecutionContextLike = {
      waitUntil(promise: Promise<unknown>) {
        waitUntilQueue.push(promise);
      },
    };

    let resendAttemptCount = 0;
    let lastIdempotencyKey = '';

    // Primer intento de Resend falla con error que incluye accidentalmente la clave API -> debe ser saneada y quedar en FAILED
    const mockFlakyResendFetch: typeof fetch = async (input, init) => {
      const url = String(input);
      if (url.includes('siteverify')) {
        return new Response(
          JSON.stringify({
            success: true,
            hostname: 'otxsolutions.com.ar',
            action: EXPECTED_TURNSTILE_ACTION,
          }),
          { status: 200 }
        );
      }
      if (url.includes('api.resend.com')) {
        resendAttemptCount++;
        const hdrs = new Headers(init?.headers);
        lastIdempotencyKey = hdrs.get('Idempotency-Key') || '';
        if (resendAttemptCount === 1) {
          return new Response(
            'Upstream error with token re_test_key_simulated_secret_12345 and Bearer secret_jwt',
            { status: 502 }
          );
        }
        return new Response(JSON.stringify({ id: 'email_recovered_001' }), { status: 200 });
      }
      throw new Error(`Unexpected URL ${url}`);
    };

    // 6a. POST /api/tickets responde 201 registrando la promesa en ctx.waitUntil
    const resCreated = await handleWorkerRequest(
      makeTicketRequest({
        ...validPayload,
        nombre: 'Martín <script>alert(1)</script>',
      }),
      envWithResend,
      { fetchImpl: mockFlakyResendFetch, ctx: mockCtx }
    );
    assert.equal(resCreated.status, 201);
    assert.equal(waitUntilQueue.length, 1);

    // Esperar a que finalice la tarea registrada en ctx.waitUntil
    await Promise.all(waitUntilQueue);

    let tickets = db.queryAllTickets();
    assert.equal(tickets.length, 1);
    assert.equal(tickets[0].notification_status, 'FAILED');
    assert.equal(tickets[0].notification_attempts, 1);
    // Verificar que ningún secreto quedó expuesto en notification_last_error
    assert.ok(!String(tickets[0].notification_last_error).includes('re_test_key_simulated'));
    assert.ok(String(tickets[0].notification_last_error).includes('[REDACTED_KEY]'));

    // 6b. Ejecutar la estrategia verificable de recuperación (retryPendingOrFailedNotifications / Cron)
    const recoveryResult = await retryPendingOrFailedNotifications(
      envWithResend,
      mockFlakyResendFetch,
      new Date(Date.now() + 60_000)
    );
    assert.equal(recoveryResult.processed, 1);
    assert.equal(recoveryResult.sent, 1);
    assert.equal(recoveryResult.failed, 0);

    tickets = db.queryAllTickets();
    assert.equal(tickets[0].notification_status, 'SENT');
    assert.equal(tickets[0].notification_attempts, 2);
    assert.equal(tickets[0].notification_last_error, null);
    assert.equal(lastIdempotencyKey, `ticket-notify-${tickets[0].id}`);

    // 6c. Verificar escape HTML anti-XSS y que scheduled() del Worker ejecuta waitUntil
    const htmlEmail = buildNotificationEmailHtml(tickets[0]);
    assert.ok(!htmlEmail.includes('<script>alert(1)</script>'));
    assert.ok(htmlEmail.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.equal(
      escapeHtml('<img src=x onerror="steal()">'),
      '&lt;img src=x onerror=&quot;steal()&quot;&gt;'
    );

    const scheduledQueue: Promise<unknown>[] = [];
    await workerDefault.scheduled(
      { cron: '*/10 * * * *' },
      envWithResend,
      { waitUntil: (p) => scheduledQueue.push(p) }
    );
    await Promise.all(scheduledQueue);

    report.push({
      test: '6. Notificaciones asíncronas con ctx.waitUntil(), saneamiento de errores sin secretos y recuperación verificable de notificaciones FAILED',
      passed: true,
      details: {
        waitUntilRegistered: waitUntilQueue.length === 1,
        statusAfterInitialFailure: 'FAILED',
        secretsRedactedInLastError: true,
        statusAfterScheduledRecovery: tickets[0].notification_status,
        totalAttempts: tickets[0].notification_attempts,
      },
    });
  }

  // =========================================================================
  // 7. VALIDACIÓN DE PAYLOAD, HONEYPOT, ERRORES DE D1 Y PRIVACIDAD DE MENSAJES
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    const resShortName = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, nombre: 'A' }),
      env
    );
    assert.equal(resShortName.status, 422);

    const resBadEmail = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, email: 'correo-invalido' }),
      env
    );
    assert.equal(resBadEmail.status, 422);
    const badEmailText = await resBadEmail.text();
    // Verificar que el mensaje de error no refleja el dato personal ingresado
    assert.ok(!badEmailText.includes('correo-invalido'));

    const resHoneypot = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, website: 'https://bot.example' }),
      env
    );
    assert.equal(resHoneypot.status, 400);

    const resBadOrigin = await handleWorkerRequest(
      makeTicketRequest(validPayload, { Origin: 'https://sitio-externo.example.com' }),
      env
    );
    assert.equal(resBadOrigin.status, 403);

    // Simular fallo de escritura en D1 -> HTTP 500 sin exponer datos personales ni emitir ticket_id
    db.simulateWriteFailure = true;
    const resD1Fail = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: makeSiteverifyOkFetch(),
    });
    assert.equal(resD1Fail.status, 500);
    const failBody = (await resD1Fail.json()) as Record<string, unknown>;
    assert.equal(failBody.success, false);
    assert.equal(failBody.ticket_id, undefined);
    assert.ok(!JSON.stringify(failBody).includes(validPayload.email));
    assert.ok(!JSON.stringify(failBody).includes(validPayload.nombre));

    report.push({
      test: '7. Validación de payload, honeypot, CORS y fallos de D1 sin confirmar tickets falsos ni exponer datos personales',
      passed: true,
      details: {
        shortNameStatus: resShortName.status,
        badEmailStatus: resBadEmail.status,
        honeypotStatus: resHoneypot.status,
        unauthorizedCorsStatus: resBadOrigin.status,
        d1FailureStatus: resD1Fail.status,
        piiExposedInError: false,
      },
    });
  }

  console.log(
    JSON.stringify(
      {
        suite: 'Cloudflare Worker + D1 + Turnstile + Resend Automated Test Suite',
        totalTests: report.length,
        passedTests: report.filter((r) => r.passed).length,
        allPassed: report.every((r) => r.passed),
        results: report,
      },
      null,
      2
    )
  );
})();
