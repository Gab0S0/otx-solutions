import type {
  Env,
  ExecutionContextLike,
  HealthCheckResponse,
  ScheduledControllerLike,
  TicketApiResponse,
} from './types.ts';
import type { FetchLike } from './turnstile.ts';
import { buildCorsHeaders, isOriginAllowed, jsonResponse } from './cors.ts';
import { validateTicketPayload } from './validation.ts';
import { verifyTurnstileToken } from './turnstile.ts';
import {
  computeSubmissionFingerprint,
  hashClientIp,
  resolveIpHashSalt,
} from './security.ts';
import {
  checkAndRecordRateLimit,
  checkDatabaseHealth,
  createTicketInD1,
  findRecentDuplicateTicket,
} from './repository.ts';
import {
  dispatchTicketNotification,
  retryPendingOrFailedNotifications,
} from './notifications.ts';

export const MAX_JSON_BODY_BYTES = 16 * 1024; // 16 KB máximo para evitar abuso de memoria/payloads

export interface WorkerDependencies {
  fetchImpl?: FetchLike;
  now?: () => Date;
  ctx?: ExecutionContextLike;
}

export async function handleWorkerRequest(
  request: Request,
  env: Env,
  deps: WorkerDependencies = {}
): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const fetchImpl = deps.fetchImpl || fetch;
  const nowFn = deps.now || (() => new Date());
  const ctx = deps.ctx;

  // 1. Preflight CORS
  if (request.method === 'OPTIONS') {
    if (origin && !isOriginAllowed(origin, env)) {
      return new Response(null, { status: 403 });
    }
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(origin, env),
    });
  }

  // 2a. Comprobación exclusiva de disponibilidad del Worker (Liveness)
  if (url.pathname === '/api/health/live' && request.method === 'GET') {
    const liveBody: HealthCheckResponse = {
      ok: true,
      service: 'otx-tickets-api',
      worker: 'up',
    };
    return jsonResponse(liveBody, 200, origin, env);
  }

  // 2b. Comprobación integral de disponibilidad del Worker + estado real de D1 (Readiness)
  if (url.pathname === '/api/health' && request.method === 'GET') {
    const dbHealthy = await checkDatabaseHealth(env.DB);
    const healthBody: HealthCheckResponse = {
      ok: dbHealthy,
      service: 'otx-tickets-api',
      worker: 'up',
      database: dbHealthy ? 'up' : 'down',
    };
    return jsonResponse(healthBody, dbHealthy ? 200 : 503, origin, env);
  }

  // 3. Solo se expone públicamente POST /api/tickets (sin endpoints administrativos abiertos)
  if (url.pathname !== '/api/tickets') {
    return jsonResponse(
      { success: false, message: 'Ruta no encontrada.', detail: 'Ruta no encontrada.' },
      404,
      origin,
      env
    );
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      { success: false, message: 'Método no permitido.', detail: 'Método no permitido.' },
      405,
      origin,
      env
    );
  }

  // 4. Verificación estricta de origen CORS
  if (!isOriginAllowed(origin, env)) {
    return jsonResponse(
      {
        success: false,
        message: 'Origen no autorizado.',
        detail: 'Origen no autorizado para enviar solicitudes.',
      },
      403,
      origin,
      env
    );
  }

  // 5. Verificar disponibilidad del binding D1 y sal criptográfica de IP en staging/producción
  if (!env.DB || typeof env.DB.prepare !== 'function') {
    const body: TicketApiResponse = {
      success: false,
      message: 'Servicio de base de datos no disponible.',
      detail:
        'El servicio de registro de tickets no está disponible en este momento. Podés continuar directamente por WhatsApp o correo electrónico.',
    };
    return jsonResponse(body, 503, origin, env);
  }

  const saltResolution = resolveIpHashSalt(env);
  if (!saltResolution.ok) {
    const body: TicketApiResponse = {
      success: false,
      message: 'Servicio temporalmente no disponible.',
      detail:
        'El servicio de registro de tickets requiere completar su configuración de seguridad. Podés continuar directamente por WhatsApp o correo electrónico.',
    };
    return jsonResponse(body, 503, origin, env);
  }

  // 6. Limitar tamaño máximo del cuerpo JSON (cabecera Content-Length y lectura real en bytes)
  const contentLengthHeader = request.headers.get('Content-Length');
  if (contentLengthHeader !== null) {
    const declaredBytes = Number(contentLengthHeader);
    if (!Number.isFinite(declaredBytes) || declaredBytes > MAX_JSON_BODY_BYTES) {
      const body: TicketApiResponse = {
        success: false,
        message: 'Solicitud demasiado grande.',
        detail: 'El tamaño de los datos enviados supera el límite máximo permitido (16 KB).',
      };
      return jsonResponse(body, 413, origin, env);
    }
  }

  let rawPayload: unknown;
  try {
    const rawText = await request.text();
    const actualBytes = new TextEncoder().encode(rawText).byteLength;
    if (actualBytes > MAX_JSON_BODY_BYTES) {
      const body: TicketApiResponse = {
        success: false,
        message: 'Solicitud demasiado grande.',
        detail: 'El tamaño de los datos enviados supera el límite máximo permitido (16 KB).',
      };
      return jsonResponse(body, 413, origin, env);
    }
    rawPayload = JSON.parse(rawText);
  } catch {
    const body: TicketApiResponse = {
      success: false,
      message: 'Solicitud inválida.',
      detail: 'El formato de los datos enviados no es válido.',
    };
    return jsonResponse(body, 400, origin, env);
  }

  // 7. Validación estricta de campos desde el servidor (incluyendo honeypot y presencia de token)
  const validation = validateTicketPayload(rawPayload);
  if (!validation.valid || !validation.data) {
    const status = validation.honeypotTriggered ? 400 : 422;
    const body: TicketApiResponse = {
      success: false,
      message: validation.error || 'Datos inválidos.',
      detail: validation.error || 'Por favor revisá los campos del formulario.',
      turnstile_reset: Boolean(validation.missingTurnstile),
    };
    return jsonResponse(body, status, origin, env);
  }

  const input = validation.data;
  const now = nowFn();

  // 8. Obtener IP del cliente y calcular su hash anónimo con sal secreta verificada
  const rawIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';
  const ipHash = await hashClientIp(rawIp, saltResolution.salt);

  try {
    // 9. Control atómico de límite de solicitudes por IP en D1 (mitigación de abuso)
    const rateCheck = await checkAndRecordRateLimit(env.DB, ipHash, now.getTime());
    if (!rateCheck.allowed) {
      const body: TicketApiResponse = {
        success: false,
        message: 'Demasiadas solicitudes.',
        detail:
          'Recibimos demasiadas solicitudes desde tu conexión. Por favor esperá un minuto o escribinos directamente por WhatsApp.',
        turnstile_reset: true,
      };
      return jsonResponse(body, 429, origin, env);
    }

    // 10. Verificación obligatoria de Cloudflare Turnstile mediante Siteverify
    // IMPORTANTE: Ocurre ANTES de cualquier consulta de idempotencia/duplicados para impedir
    // que solicitudes sin validación antibots superada obtengan confirmaciones o ticket_id.
    const turnstileOutcome = await verifyTurnstileToken(
      input.turnstileToken,
      rawIp,
      env,
      fetchImpl
    );

    if (!turnstileOutcome.ok) {
      const body: TicketApiResponse = {
        success: false,
        message: turnstileOutcome.errorMessage || 'Error de verificación antibots.',
        detail:
          turnstileOutcome.errorMessage ||
          'No se pudo verificar la protección antibots. Por favor reintentá o continuá por WhatsApp.',
        turnstile_reset: turnstileOutcome.resetRequired,
      };
      return jsonResponse(body, 400, origin, env);
    }

    // 11. Protección contra envíos duplicados (idempotencia en ventana de 10 min)
    // Solo se evalúa tras superar Turnstile y exige coincidencia de `submission_fingerprint`
    // (vinculado a ipHash) y `client_ip_hash` en D1.
    const idempotencyHeader = request.headers.get('Idempotency-Key');
    const fingerprint = await computeSubmissionFingerprint(input, ipHash, idempotencyHeader);
    const existingDuplicate = await findRecentDuplicateTicket(
      env.DB,
      fingerprint,
      ipHash,
      now.getTime()
    );

    if (existingDuplicate) {
      const body: TicketApiResponse = {
        success: true,
        ticket_id: existingDuplicate.ticket_number,
        duplicate: true,
        message: `Tu solicitud ya quedó registrada con el ticket #${existingDuplicate.ticket_number}.`,
      };
      return jsonResponse(body, 200, origin, env);
    }

    // 12. Persistir el ticket en Cloudflare D1 (solo responder éxito si D1 confirma la escritura)
    const hasResendConfigured = Boolean((env.RESEND_API_KEY || '').trim());
    const createdTicket = await createTicketInD1(
      env.DB,
      input,
      fingerprint,
      ipHash,
      now,
      hasResendConfigured ? 'PENDING' : 'SKIPPED_UNCONFIGURED'
    );

    // 13. Despachar notificación secundaria por correo (Resend):
    // Si `ctx.waitUntil` está disponible en el runtime del Worker, se ejecuta en segundo plano
    // sin bloquear la respuesta HTTP 201 del ticket ya persistido en D1.
    if (hasResendConfigured) {
      const notificationPromise = dispatchTicketNotification(createdTicket, env, fetchImpl, now);
      if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(notificationPromise);
      } else {
        await notificationPromise;
      }
    }

    const responseBody: TicketApiResponse = {
      success: true,
      ticket_id: createdTicket.ticket_number,
      message: `¡Ticket #${createdTicket.ticket_number} creado! Te responderemos a la brevedad.`,
    };

    return jsonResponse(responseBody, 201, origin, env);
  } catch {
    // Nunca exponer trazas internas, secretos ni datos personales en errores públicos
    const body: TicketApiResponse = {
      success: false,
      message: 'No se pudo registrar el ticket.',
      detail:
        'Ocurrió un problema al guardar la solicitud en este momento. Tus datos siguen cargados: podés continuar directamente por WhatsApp o correo electrónico.',
      turnstile_reset: true,
    };
    return jsonResponse(body, 500, origin, env);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx?: ExecutionContextLike): Promise<Response> {
    return handleWorkerRequest(request, env, { ctx });
  },
  async scheduled(
    _controller: ScheduledControllerLike,
    env: Env,
    ctx?: ExecutionContextLike
  ): Promise<void> {
    const recoveryPromise = retryPendingOrFailedNotifications(env);
    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(recoveryPromise);
    } else {
      await recoveryPromise;
    }
  },
};
