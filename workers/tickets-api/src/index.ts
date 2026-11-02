import type { Env, TicketApiResponse } from './types.ts';
import type { FetchLike } from './turnstile.ts';
import { buildCorsHeaders, isOriginAllowed, jsonResponse } from './cors.ts';
import { validateTicketPayload } from './validation.ts';
import { verifyTurnstileToken } from './turnstile.ts';
import { computeSubmissionFingerprint, hashClientIp } from './security.ts';
import {
  checkAndRecordRateLimit,
  createTicketInD1,
  findRecentDuplicateTicket,
} from './repository.ts';
import { dispatchTicketNotification } from './notifications.ts';

export interface WorkerDependencies {
  fetchImpl?: FetchLike;
  now?: () => Date;
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

  // 2. Endpoint de salud mínimo (sin exponer configuración ni datos sensibles)
  if (url.pathname === '/api/health' && request.method === 'GET') {
    return jsonResponse({ ok: true, service: 'otx-tickets-api' }, 200, origin, env);
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

  // 5. Verificar disponibilidad del binding D1
  if (!env.DB || typeof env.DB.prepare !== 'function') {
    const body: TicketApiResponse = {
      success: false,
      message: 'Servicio de base de datos no disponible.',
      detail:
        'El servicio de registro de tickets no está disponible en este momento. Podés continuar directamente por WhatsApp o correo electrónico.',
    };
    return jsonResponse(body, 503, origin, env);
  }

  // 6. Parseo seguro de JSON
  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    const body: TicketApiResponse = {
      success: false,
      message: 'Solicitud inválida.',
      detail: 'El formato de los datos enviados no es válido.',
    };
    return jsonResponse(body, 400, origin, env);
  }

  // 7. Validación estricta de campos desde el servidor
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

  // 8. Obtener IP del cliente y calcular su hash anónimo para rate-limit
  const rawIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';
  const ipHash = await hashClientIp(rawIp, env.IP_HASH_SALT || 'otx-default-salt');

  try {
    // 9. Control de límite de solicitudes por IP (mitigación de abuso)
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

    // 10. Protección contra envíos duplicados (idempotencia en ventana de 10 min)
    const idempotencyHeader = request.headers.get('Idempotency-Key');
    const fingerprint = await computeSubmissionFingerprint(input, idempotencyHeader);
    const existingDuplicate = await findRecentDuplicateTicket(
      env.DB,
      fingerprint,
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

    // 11. Verificación de Cloudflare Turnstile mediante Siteverify (uso único y vigencia)
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

    // 12. Persistir el ticket en Cloudflare D1 (solo responder éxito si D1 confirma la escritura)
    const createdTicket = await createTicketInD1(
      env.DB,
      input,
      fingerprint,
      ipHash,
      now
    );

    // 13. Despachar notificación por correo (Resend) de manera desacoplada:
    // Si el correo falla o Resend aún no está configurado, el ticket YA quedó guardado en D1.
    await dispatchTicketNotification(createdTicket, env, fetchImpl);

    const responseBody: TicketApiResponse = {
      success: true,
      ticket_id: createdTicket.ticket_number,
      message: `¡Ticket #${createdTicket.ticket_number} creado! Te responderemos a la brevedad.`,
    };

    return jsonResponse(responseBody, 201, origin, env);
  } catch {
    // No exponer trazas internas ni datos personales en errores públicos
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
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleWorkerRequest(request, env);
  },
};
