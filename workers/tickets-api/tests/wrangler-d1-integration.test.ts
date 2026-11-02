import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';

import { handleWorkerRequest } from '../src/index.ts';
import { EXPECTED_TURNSTILE_ACTION } from '../src/turnstile.ts';
import type { D1DatabaseLike, Env } from '../src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKER_ROOT = path.resolve(__dirname, '..');
const WRANGLER_TOML_PATH = path.resolve(WORKER_ROOT, 'wrangler.toml');
const MIGRATION_PATH = path.resolve(WORKER_ROOT, 'migrations/0001_init_tickets.sql');

(async () => {
  const tempPersistDir = fs.mkdtempSync(path.join(os.tmpdir(), 'otx-wrangler-d1-test-'));
  process.env.WRANGLER_LOG_PATH = path.join(tempPersistDir, 'logs');
  process.env.WRANGLER_SEND_METRICS = 'false';

  const platform = await getPlatformProxy<{ DB: D1DatabaseLike }>({
    configPath: WRANGLER_TOML_PATH,
    persist: { path: tempPersistDir },
  });

  try {
    const d1 = platform.env.DB;
    assert.ok(d1 && typeof d1.prepare === 'function', 'Wrangler D1 binding must be initialized');

    const env: Env = {
      DB: d1,
      ENVIRONMENT: 'production',
      ALLOWED_ORIGINS: 'https://otxsolutions.com.ar,https://www.otxsolutions.com.ar',
      TURNSTILE_ALLOWED_HOSTNAMES: 'otxsolutions.com.ar,www.otxsolutions.com.ar',
      TURNSTILE_EXPECTED_ACTION: EXPECTED_TURNSTILE_ACTION,
      TURNSTILE_SECRET_KEY: '0x4AAAAAA_real_secret_for_wrangler_d1_integration',
      IP_HASH_SALT: 'prod-wrangler-integration-salt-32-chars-ok',
      RESEND_API_KEY: '',
      NOTIFICATION_FROM_EMAIL: 'OTX Solutions <notificaciones@otxsolutions.com.ar>',
      NOTIFICATION_TO_EMAIL: 'solutionsotx@gmail.com',
    };

    // 1. Antes de aplicar la migración 0001_init_tickets.sql, GET /api/health debe detectar DB down (503)
    const healthBefore = await handleWorkerRequest(
      new Request('https://api.otxsolutions.com.ar/api/health', { method: 'GET' }),
      env,
      { ctx: platform.ctx }
    );
    assert.equal(healthBefore.status, 503);
    const healthBeforeBody = (await healthBefore.json()) as Record<string, unknown>;
    assert.equal(healthBeforeBody.ok, false);
    assert.equal(healthBeforeBody.worker, 'up');
    assert.equal(healthBeforeBody.database, 'down');

    // 2. Aplicar la migración real 0001_init_tickets.sql sobre el binding D1 local de Wrangler
    const migrationSql = fs.readFileSync(MIGRATION_PATH, 'utf8');
    const statements = migrationSql
      .split(';')
      .map((s) =>
        s
          .split('\n')
          .filter((line) => !line.trim().startsWith('--'))
          .join('\n')
          .trim()
      )
      .filter(Boolean);

    if (typeof d1.batch !== 'function') {
      throw new Error('Wrangler D1 must provide atomic batch()');
    }
    await d1.batch(statements.map((sql) => d1.prepare(sql)));

    // 3. Después de aplicar la migración, GET /api/health debe devolver 200 OK con database: 'up'
    const healthAfter = await handleWorkerRequest(
      new Request('https://api.otxsolutions.com.ar/api/health', { method: 'GET' }),
      env,
      { ctx: platform.ctx }
    );
    assert.equal(healthAfter.status, 200);
    const healthAfterBody = (await healthAfter.json()) as Record<string, unknown>;
    assert.equal(healthAfterBody.ok, true);
    assert.equal(healthAfterBody.worker, 'up');
    assert.equal(healthAfterBody.database, 'up');

    // 4. Crear ticket real en D1 local de Wrangler validando Siteverify (hostname + action)
    const mockSiteverifyOk: typeof fetch = async (input) => {
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
      throw new Error(`Unexpected fetch to ${url}`);
    };

    const ticketPayload = {
      nombre: 'Carlos Pellegrini',
      email: 'carlos@pyme-industrial.com.ar',
      telefono: '+54 9 11 5555-0199',
      tipo: 'pyme',
      plan: 'Empresa Inicial - $120.000/mes',
      servicio: 'Soporte técnico remoto y visitas coordinadas',
      asunto: 'Alta de soporte mensual para 3 puestos',
      mensaje: 'Queremos iniciar con el plan Empresa Inicial para 3 puestos de administración.',
      canal: 'TicketWeb',
      website: '',
      turnstileToken: 'tok_wrangler_d1_001',
    };

    const createReq = new Request('https://api.otxsolutions.com.ar/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://otxsolutions.com.ar',
        'CF-Connecting-IP': '190.210.44.12',
      },
      body: JSON.stringify(ticketPayload),
    });

    const createRes = await handleWorkerRequest(createReq, env, {
      fetchImpl: mockSiteverifyOk,
      ctx: platform.ctx,
    });
    assert.equal(createRes.status, 201);
    const createBody = (await createRes.json()) as Record<string, unknown>;
    assert.equal(createBody.success, true);
    assert.match(String(createBody.ticket_id), /^OTX-\d{2}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6}$/);

    // 5. Verificar que un intento duplicado sin superar Siteverify es bloqueado (400) sin filtrar ticket_id
    const mockSiteverifyFail: typeof fetch = async () =>
      new Response(
        JSON.stringify({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
        { status: 200 }
      );

    const unverifiedDupReq = new Request('https://api.otxsolutions.com.ar/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://otxsolutions.com.ar',
        'CF-Connecting-IP': '190.210.44.12',
      },
      body: JSON.stringify({ ...ticketPayload, turnstileToken: 'tok_reused' }),
    });

    const unverifiedDupRes = await handleWorkerRequest(unverifiedDupReq, env, {
      fetchImpl: mockSiteverifyFail,
      ctx: platform.ctx,
    });
    assert.equal(unverifiedDupRes.status, 400);
    const unverifiedDupBody = (await unverifiedDupRes.json()) as Record<string, unknown>;
    assert.equal(unverifiedDupBody.ticket_id, undefined);

    // 6. Verificar que un reintento legítimo (superando Siteverify) devuelve 200 duplicate: true con el mismo ticket_id
    const verifiedDupReq = new Request('https://api.otxsolutions.com.ar/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://otxsolutions.com.ar',
        'CF-Connecting-IP': '190.210.44.12',
      },
      body: JSON.stringify({ ...ticketPayload, turnstileToken: 'tok_fresh_002' }),
    });

    const verifiedDupRes = await handleWorkerRequest(verifiedDupReq, env, {
      fetchImpl: mockSiteverifyOk,
      ctx: platform.ctx,
    });
    assert.equal(verifiedDupRes.status, 200);
    const verifiedDupBody = (await verifiedDupRes.json()) as Record<string, unknown>;
    assert.equal(verifiedDupBody.duplicate, true);
    assert.equal(verifiedDupBody.ticket_id, createBody.ticket_id);

    // 7. Consultar directamente el motor D1 local de Wrangler para confirmar que existe exactamente 1 fila
    const d1Rows = await d1.prepare('SELECT * FROM tickets').all<Record<string, unknown>>();
    assert.equal(d1Rows.results?.length, 1);
    assert.equal(d1Rows.results?.[0]?.ticket_number, createBody.ticket_id);

    console.log(
      JSON.stringify(
        {
          suite: 'Wrangler Real Local D1 Integration Test (Miniflare / workerd D1 Binding)',
          passed: true,
          details: {
            healthBeforeMigration: healthBefore.status,
            healthAfterMigration: healthAfter.status,
            createdTicketStatus: createRes.status,
            createdTicketId: createBody.ticket_id,
            unverifiedDuplicateBlockedStatus: unverifiedDupRes.status,
            verifiedDuplicateStatus: verifiedDupRes.status,
            persistedRowsInWranglerD1: d1Rows.results?.length,
          },
        },
        null,
        2
      )
    );
  } finally {
    await platform.dispose();
    fs.rmSync(tempPersistDir, { recursive: true, force: true });
  }
})();
