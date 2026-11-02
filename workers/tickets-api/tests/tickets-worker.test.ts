import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import { handleWorkerRequest } from '../src/index.ts';
import { escapeHtml, buildNotificationEmailHtml } from '../src/notifications.ts';
import { TURNSTILE_TEST_SECRET_PASS } from '../src/turnstile.ts';
import type { D1DatabaseLike, D1PreparedStatement, D1Result, Env, TicketRecord } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATION_PATH = path.resolve(__dirname, '../migrations/0001_init_tickets.sql');

/**
 * Adaptador de Cloudflare D1 sobre `node:sqlite` (mismo motor SQLite real que usa D1)
 * para ejecutar la migración SQL real `0001_init_tickets.sql` y las consultas parametrizadas.
 */
class SqliteD1Adapter implements D1DatabaseLike {
  private db: DatabaseSync;
  public simulateWriteFailure = false;

  constructor(migrationSql: string) {
    this.db = new DatabaseSync(':memory:');
    this.db.exec(migrationSql);
  }

  prepare(query: string): D1PreparedStatement {
    // Convertir parámetros posicionales `?1, ?2` de D1 a `?` estándar manteniendo el orden
    const normalizedSql = query.replace(/\?(\d+)/g, '?');
    const self = this;

    const createBound = (boundValues: unknown[]): D1PreparedStatement => ({
      bind(...values: unknown[]) {
        return createBound(values);
      },
      async first<T = Record<string, unknown>>(): Promise<T | null> {
        const stmt = self.db.prepare(normalizedSql);
        const row = stmt.get(...(boundValues as (string | number | null)[])) as T | undefined;
        return row ?? null;
      },
      async run<T = unknown>(): Promise<D1Result<T>> {
        if (self.simulateWriteFailure && /^\s*INSERT\s+INTO\s+tickets/i.test(normalizedSql)) {
          return { success: false, meta: { changes: 0 } };
        }
        const stmt = self.db.prepare(normalizedSql);
        const info = stmt.run(...(boundValues as (string | number | null)[]));
        return {
          success: true,
          meta: {
            changes: Number(info.changes),
            last_row_id: Number(info.lastInsertRowid),
          },
        };
      },
      async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
        const stmt = self.db.prepare(normalizedSql);
        const rows = stmt.all(...(boundValues as (string | number | null)[])) as T[];
        return {
          success: true,
          results: rows,
        };
      },
    });

    return createBound([]);
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
    TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_PASS,
    IP_HASH_SALT: 'test-salt-2026',
    RESEND_API_KEY: '',
    NOTIFICATION_FROM_EMAIL: 'OTX Solutions <notificaciones@otxsolutions.com.ar>',
    NOTIFICATION_TO_EMAIL: 'solutionsotx@gmail.com',
    ...overrides,
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
  // 1. CREACIÓN CORRECTA DE TICKET + PERSISTENCIA D1 + CONTRATO FRONTEND
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);
    const mockFetch: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes('siteverify')) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      throw new Error(`Unexpected fetch to ${url}`);
    };

    const res = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: mockFetch,
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
    assert.notEqual(savedRows[0].client_ip_hash, '190.19.120.45'); // IP anonimizada con SHA-256

    report.push({
      test: '1. Creación correcta de ticket en D1 y cumplimiento del contrato { success, ticket_id, message }',
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
  // 2. VALIDACIÓN ESTRICTA DE DATOS EN SERVIDOR + HONEYPOT + CORS
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    // 2a. Nombre corto
    const resShortName = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, nombre: 'A' }),
      env
    );
    assert.equal(resShortName.status, 422);

    // 2b. Email inválido
    const resBadEmail = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, email: 'correo-sin-dominio' }),
      env
    );
    assert.equal(resBadEmail.status, 422);

    // 2c. Mensaje de solo espacios
    const resWhitespaceMsg = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, mensaje: '               ' }),
      env
    );
    assert.equal(resWhitespaceMsg.status, 422);

    // 2d. Honeypot relleno (bot) -> HTTP 400 y 0 filas en D1
    const resHoneypot = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, website: 'https://spambot.example' }),
      env
    );
    assert.equal(resHoneypot.status, 400);
    const bodyHoneypot = (await resHoneypot.json()) as Record<string, unknown>;
    assert.equal(bodyHoneypot.success, false);
    assert.equal(bodyHoneypot.ticket_id, undefined);

    // 2e. Origen CORS no autorizado -> HTTP 403
    const resBadOrigin = await handleWorkerRequest(
      makeTicketRequest(validPayload, { Origin: 'https://sitio-malicioso.example.com' }),
      env
    );
    assert.equal(resBadOrigin.status, 403);

    assert.equal(db.queryAllTickets().length, 0);

    report.push({
      test: '2. Validación de datos en servidor (nombre, email, mensaje vacío, honeypot y CORS)',
      passed: true,
      details: {
        shortNameStatus: resShortName.status,
        badEmailStatus: resBadEmail.status,
        whitespaceMsgStatus: resWhitespaceMsg.status,
        honeypotStatus: resHoneypot.status,
        unauthorizedCorsStatus: resBadOrigin.status,
        persistedTickets: db.queryAllTickets().length,
      },
    });
  }

  // =========================================================================
  // 3. TURNSTILE VÁLIDO, INVÁLIDO, VENCIDO Y BLOQUEO DE CLAVE TEST EN PRODUCCIÓN
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    // 3a. Token rechazado o vencido (timeout-or-duplicate)
    const mockExpiredTurnstile: typeof fetch = async () =>
      new Response(
        JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
        { status: 200 }
      );

    const resExpired = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, turnstileToken: 'tok_expired' }),
      env,
      { fetchImpl: mockExpiredTurnstile }
    );
    assert.equal(resExpired.status, 400);
    const expiredBody = (await resExpired.json()) as Record<string, unknown>;
    assert.equal(expiredBody.success, false);
    assert.equal(expiredBody.turnstile_reset, true);
    assert.ok(String(expiredBody.detail).includes('venció'));

    // 3b. Intento de usar la clave secreta dummy de prueba en ENVIRONMENT="production"
    const prodEnvWithTestSecret = createTestEnv(db, {
      ENVIRONMENT: 'production',
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_PASS,
    });
    const resProdMisconfig = await handleWorkerRequest(
      makeTicketRequest(validPayload),
      prodEnvWithTestSecret
    );
    assert.equal(resProdMisconfig.status, 400);
    assert.equal(db.queryAllTickets().length, 0);

    report.push({
      test: '3. Verificación Turnstile (token inválido/vencido fuerza turnstile_reset y bloqueo de clave dummy en producción)',
      passed: true,
      details: {
        expiredTokenStatus: resExpired.status,
        turnstileResetFlag: expiredBody.turnstile_reset,
        prodDummySecretBlockedStatus: resProdMisconfig.status,
      },
    });
  }

  // =========================================================================
  // 4. AUSENCIA DE TOKEN TURNSTILE
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    const resNoToken = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, turnstileToken: '' }),
      env
    );
    assert.equal(resNoToken.status, 422);
    const body = (await resNoToken.json()) as Record<string, unknown>;
    assert.equal(body.success, false);
    assert.equal(body.turnstile_reset, true);
    assert.equal(db.queryAllTickets().length, 0);

    report.push({
      test: '4. Ausencia de token Turnstile rechazada con HTTP 422 y turnstile_reset: true',
      passed: true,
      details: { status: resNoToken.status, turnstileReset: body.turnstile_reset },
    });
  }

  // =========================================================================
  // 5. SOLICITUDES DUPLICADAS (IDEMPOTENCIA) Y RATE LIMITING POR IP
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);
    const mockOkTurnstile: typeof fetch = async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 });

    // Primer envío -> 201 Created
    const res1 = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: mockOkTurnstile,
    });
    assert.equal(res1.status, 201);
    const body1 = (await res1.json()) as Record<string, unknown>;

    // Segundo envío idéntico inmediato -> 200 OK con el mismo ticket_id y sin duplicar fila en D1
    const res2 = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: mockOkTurnstile,
    });
    assert.equal(res2.status, 200);
    const body2 = (await res2.json()) as Record<string, unknown>;
    assert.equal(body2.duplicate, true);
    assert.equal(body2.ticket_id, body1.ticket_id);
    assert.equal(db.queryAllTickets().length, 1);

    // Tercer envío desde la misma IP -> consume el 3er cupo del rate limit
    const res3 = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, mensaje: 'Otra consulta diferente para la misma IP.' }),
      env,
      { fetchImpl: mockOkTurnstile }
    );
    assert.equal(res3.status, 201);

    // Cuarto envío dentro del mismo minuto desde la misma IP -> 429 Too Many Requests
    const res4 = await handleWorkerRequest(
      makeTicketRequest({ ...validPayload, mensaje: 'Cuarta consulta seguida en menos de 60s.' }),
      env,
      { fetchImpl: mockOkTurnstile }
    );
    assert.equal(res4.status, 429);

    report.push({
      test: '5. Prevención de duplicados (idempotencia devuelve mismo ticket_id sin duplicar fila) y rate-limit (HTTP 429 al 4to intento)',
      passed: true,
      details: {
        firstStatus: res1.status,
        duplicateStatus: res2.status,
        sameTicketIdReturned: body1.ticket_id === body2.ticket_id,
        rateLimit4thStatus: res4.status,
      },
    });
  }

  // =========================================================================
  // 6. ERRORES DE D1 Y GARANTÍA DE NO EMITIR ÉXITO SIN PERSISTENCIA
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    db.simulateWriteFailure = true; // Simular fallo de escritura en D1
    const env = createTestEnv(db);
    const mockOkTurnstile: typeof fetch = async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 });

    const resD1Fail = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: mockOkTurnstile,
    });
    assert.equal(resD1Fail.status, 500);
    const bodyD1Fail = (await resD1Fail.json()) as Record<string, unknown>;
    assert.equal(bodyD1Fail.success, false);
    assert.equal(bodyD1Fail.ticket_id, undefined);
    assert.equal(db.queryAllTickets().length, 0);

    // También probar sin binding DB disponible -> HTTP 503
    const envNoDb = createTestEnv(undefined as unknown as D1DatabaseLike);
    const resNoDb = await handleWorkerRequest(makeTicketRequest(validPayload), envNoDb);
    assert.equal(resNoDb.status, 503);

    report.push({
      test: '6. Errores de D1 y ausencia de binding nunca devuelven confirmación falsa de ticket',
      passed: true,
      details: {
        writeFailureStatus: resD1Fail.status,
        missingDbBindingStatus: resNoDb.status,
        ticketIdEmittedOnFailure: false,
      },
    });
  }

  // =========================================================================
  // 7. NOTIFICACIONES RESEND (ÉXITO, FALLO DESACOPLADO Y ESCAPE HTML ANTI-XSS)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const envWithResend = createTestEnv(db, {
      RESEND_API_KEY: 're_test_key_simulated',
    });

    let capturedResendHeaders: Record<string, string> = {};

    // 7a. Resend falla con HTTP 500 -> el ticket IGUAL queda creado (HTTP 201) y registrado como FAILED en D1
    const mockResendFail: typeof fetch = async (input, init) => {
      const url = String(input);
      if (url.includes('siteverify')) {
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
      if (url.includes('api.resend.com')) {
        const hdrs = new Headers(init?.headers);
        capturedResendHeaders = {
          idempotencyKey: hdrs.get('Idempotency-Key') || '',
        };
        return new Response('Resend upstream error', { status: 500 });
      }
      throw new Error(`Unexpected URL ${url}`);
    };

    const resTicketDespiteEmailFail = await handleWorkerRequest(
      makeTicketRequest({
        ...validPayload,
        nombre: 'Martín <script>alert(1)</script>',
      }),
      envWithResend,
      { fetchImpl: mockResendFail }
    );

    assert.equal(resTicketDespiteEmailFail.status, 201);
    const body = (await resTicketDespiteEmailFail.json()) as Record<string, unknown>;
    assert.equal(body.success, true);

    const rows = db.queryAllTickets();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].notification_status, 'FAILED');
    assert.equal(rows[0].notification_attempts, 1);
    assert.ok(capturedResendHeaders.idempotencyKey.startsWith('ticket-notify-'));

    // 7b. Verificar escape HTML estricto contra inyección en el correo
    const htmlEmail = buildNotificationEmailHtml(rows[0]);
    assert.ok(!htmlEmail.includes('<script>alert(1)</script>'));
    assert.ok(htmlEmail.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.equal(escapeHtml('<img src=x onerror="steal()">'), '&lt;img src=x onerror=&quot;steal()&quot;&gt;');

    report.push({
      test: '7. Fallo de notificación Resend no impide persistir el ticket (HTTP 201), guarda estado FAILED, envía Idempotency-Key y escapa HTML',
      passed: true,
      details: {
        httpStatusWhenResendFails: resTicketDespiteEmailFail.status,
        d1NotificationStatus: rows[0].notification_status,
        resendIdempotencyHeaderSent: Boolean(capturedResendHeaders.idempotencyKey),
        xssPayloadEscaped: true,
      },
    });
  }

  // =========================================================================
  // 8. FALLO DE RED EN SITEVERIFY Y COMPATIBILIDAD CON CONTACTO (Landing) Y /ticket (TicketWeb)
  // =========================================================================
  {
    const db = new SqliteD1Adapter(migrationSql);
    const env = createTestEnv(db);

    const mockNetworkError: typeof fetch = async () => {
      throw new Error('Network socket hang up');
    };

    const resNetErr = await handleWorkerRequest(makeTicketRequest(validPayload), env, {
      fetchImpl: mockNetworkError,
    });
    assert.equal(resNetErr.status, 400);
    const netErrBody = (await resNetErr.json()) as Record<string, unknown>;
    assert.equal(netErrBody.success, false);
    assert.equal(netErrBody.turnstile_reset, true);
    assert.equal(db.queryAllTickets().length, 0);

    // Envío desde Contact.jsx (canal: 'Landing', sin asunto manual -> autogenerado por plan)
    const mockOk: typeof fetch = async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 });

    const resLanding = await handleWorkerRequest(
      makeTicketRequest({
        nombre: 'Sofía Castro',
        email: 'sofia@castro.com.ar',
        telefono: '',
        tipo: 'particular',
        plan: 'Pack 5 Asistencias - $90.000',
        servicio: '',
        asunto: '',
        mensaje: 'Hola, quiero contratar el Pack de 5 asistencias remotas.',
        canal: 'Landing',
        website: '',
        turnstileToken: 'tok_landing_ok',
      }),
      env,
      { fetchImpl: mockOk }
    );
    assert.equal(resLanding.status, 201);
    const landingBody = (await resLanding.json()) as Record<string, unknown>;
    assert.equal(landingBody.success, true);

    const saved = db.queryAllTickets();
    assert.equal(saved.length, 1);
    assert.equal(saved[0].channel, 'Landing');
    assert.equal(saved[0].subject, 'Interesado en: Pack 5 Asistencias - $90.000');

    report.push({
      test: '8. Fallo de red en Siteverify manejado sin crear ticket y compatibilidad completa con Contacto (Landing) y /ticket (TicketWeb)',
      passed: true,
      details: {
        siteverifyNetworkErrorStatus: resNetErr.status,
        landingSubmissionStatus: resLanding.status,
        autoGeneratedSubject: saved[0].subject,
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
