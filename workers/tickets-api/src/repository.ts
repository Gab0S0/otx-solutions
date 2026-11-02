import type {
  D1DatabaseLike,
  NotificationStatus,
  TicketRecord,
  ValidatedTicketInput,
} from './types.ts';
import { generatePublicTicketNumber } from './security.ts';

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 segundos
export const RATE_LIMIT_MAX_REQUESTS = 3; // Máximo 3 solicitudes por minuto por IP
export const DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 minutos para idempotencia de reintentos
export const MAX_NOTIFICATION_ATTEMPTS = 5; // Máximo de intentos de envío de correo por ticket
export const STALE_PENDING_NOTIFICATION_MS = 2 * 60 * 1000; // 2 minutos para recuperar waitUntil interrumpidos

export interface RateLimitCheckResult {
  allowed: boolean;
}

/**
 * Comprueba la conectividad real de Cloudflare D1 y que la tabla `tickets` exista.
 * Nunca expone detalles internos de SQL ni credenciales.
 */
export async function checkDatabaseHealth(db: D1DatabaseLike | undefined): Promise<boolean> {
  if (!db || typeof db.prepare !== 'function') {
    return false;
  }

  try {
    const row = await db
      .prepare(
        "SELECT COUNT(*) AS table_ok FROM sqlite_master WHERE type = 'table' AND name = ?1"
      )
      .bind('tickets')
      .first<{ table_ok: number }>();

    return Number(row?.table_ok ?? 0) === 1;
  } catch {
    return false;
  }
}

/**
 * Controla el límite de solicitudes por hash de IP en D1 de forma atómica.
 * En lugar de depender de un SELECT seguido de un INSERT separado, utiliza una única
 * sentencia condicional `INSERT INTO ... SELECT ... WHERE (SELECT COUNT(*) ...) < ?5`
 * (y `db.batch` transaccional cuando está disponible en D1), garantizando que bajo
 * concurrencia SQLite evalúe el conteo e inserte dentro de la misma transacción de escritura.
 */
export async function checkAndRecordRateLimit(
  db: D1DatabaseLike,
  ipHash: string,
  nowMs: number = Date.now()
): Promise<RateLimitCheckResult> {
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;
  const cleanupThreshold = nowMs - DEDUP_WINDOW_MS;

  const cleanupStmt = db
    .prepare('DELETE FROM ticket_rate_limits WHERE ip_hash = ?1 AND requested_at < ?2')
    .bind(ipHash, cleanupThreshold);

  const conditionalInsertStmt = db
    .prepare(
      `INSERT INTO ticket_rate_limits (ip_hash, requested_at)
       SELECT ?1, ?2
       WHERE (
         SELECT COUNT(*)
         FROM ticket_rate_limits
         WHERE ip_hash = ?3 AND requested_at >= ?4
       ) < ?5`
    )
    .bind(ipHash, nowMs, ipHash, windowStart, RATE_LIMIT_MAX_REQUESTS);

  if (typeof db.batch === 'function') {
    const batchResults = await db.batch([cleanupStmt, conditionalInsertStmt]);
    const insertRes = batchResults[1];
    const changes = Number(insertRes?.meta?.changes ?? 0);
    return { allowed: Boolean(insertRes?.success) && changes === 1 };
  }

  await cleanupStmt.run();
  const insertRes = await conditionalInsertStmt.run();
  const changes = Number(insertRes?.meta?.changes ?? 0);

  return { allowed: Boolean(insertRes?.success) && changes === 1 };
}

/**
 * Busca si el mismo envío (fingerprint + ip_hash) ya fue registrado recientemente.
 * IMPORTANTE: Solo debe invocarse DESPUÉS de haber superado la validación de Turnstile
 * y el control de rate-limit, y exige coincidencia tanto de `submission_fingerprint`
 * como de `client_ip_hash` para impedir exposición de identificadores entre usuarios.
 */
export async function findRecentDuplicateTicket(
  db: D1DatabaseLike,
  fingerprint: string,
  ipHash: string,
  nowMs: number = Date.now()
): Promise<{ id: string; ticket_number: string; created_at: string } | null> {
  const minCreatedIso = new Date(nowMs - DEDUP_WINDOW_MS).toISOString();

  const existing = await db
    .prepare(
      `SELECT id, ticket_number, created_at
       FROM tickets
       WHERE submission_fingerprint = ?1
         AND client_ip_hash = ?2
         AND created_at >= ?3
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(fingerprint, ipHash, minCreatedIso)
    .first<{ id: string; ticket_number: string; created_at: string }>();

  return existing || null;
}

/**
 * Persiste un nuevo ticket en D1 con reintento ante colisión de código público.
 * Nunca utiliza MAX(id) + 1. Solo confirma éxito cuando D1 persiste efectivamente la fila.
 */
export async function createTicketInD1(
  db: D1DatabaseLike,
  input: ValidatedTicketInput,
  fingerprint: string,
  ipHash: string,
  now: Date = new Date(),
  initialNotificationStatus: NotificationStatus = 'PENDING'
): Promise<TicketRecord> {
  const isoNow = now.toISOString();
  const maxAttempts = 3;
  const initialLastError =
    initialNotificationStatus === 'SKIPPED_UNCONFIGURED'
      ? 'RESEND_API_KEY not configured'
      : null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const id = crypto.randomUUID();
    const ticketNumber = generatePublicTicketNumber(now);

    try {
      const insertRes = await db
        .prepare(
          `INSERT INTO tickets (
            id,
            ticket_number,
            created_at,
            updated_at,
            client_name,
            client_email,
            client_phone,
            client_type,
            service_name,
            plan_name,
            subject,
            description,
            status,
            priority,
            channel,
            notification_status,
            notification_attempts,
            notification_last_error,
            submission_fingerprint,
            client_ip_hash
          ) VALUES (
            ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12,
            'Nuevo', 'Normal', ?13, ?14, 0, ?15, ?16, ?17
          )`
        )
        .bind(
          id,
          ticketNumber,
          isoNow,
          isoNow,
          input.nombre,
          input.email,
          input.telefono,
          input.tipo,
          input.servicio,
          input.plan,
          input.asunto,
          input.mensaje,
          input.canal,
          initialNotificationStatus,
          initialLastError,
          fingerprint,
          ipHash
        )
        .run();

      const changes = Number(insertRes?.meta?.changes ?? (insertRes?.success ? 1 : 0));
      if (!insertRes?.success || changes < 1) {
        throw new Error('D1 no confirmó la escritura del ticket');
      }

      return {
        id,
        ticket_number: ticketNumber,
        created_at: isoNow,
        updated_at: isoNow,
        client_name: input.nombre,
        client_email: input.email,
        client_phone: input.telefono,
        client_type: input.tipo,
        service_name: input.servicio,
        plan_name: input.plan,
        subject: input.asunto,
        description: input.mensaje,
        status: 'Nuevo',
        priority: 'Normal',
        channel: input.canal,
        notification_status: initialNotificationStatus,
        notification_attempts: 0,
        notification_last_error: initialLastError,
        submission_fingerprint: fingerprint,
        client_ip_hash: ipHash,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isUniqueCollision = /UNIQUE constraint failed: tickets\.ticket_number/i.test(message);
      if (isUniqueCollision && attempt < maxAttempts) {
        continue;
      }
      throw err;
    }
  }

  throw new Error('No se pudo generar un identificador único para el ticket.');
}

/**
 * Actualiza el estado de la notificación por correo sin afectar el registro del ticket.
 */
export async function updateTicketNotificationStatus(
  db: D1DatabaseLike,
  ticketId: string,
  status: NotificationStatus,
  attempts: number,
  lastError: string | null = null,
  now: Date = new Date()
): Promise<void> {
  await db
    .prepare(
      `UPDATE tickets
       SET notification_status = ?1,
           notification_attempts = ?2,
           notification_last_error = ?3,
           updated_at = ?4
       WHERE id = ?5`
    )
    .bind(status, attempts, lastError ? lastError.slice(0, 500) : null, now.toISOString(), ticketId)
    .run();
}

/**
 * Obtiene los tickets cuya notificación por correo quedó en estado `FAILED`
 * o `PENDING` estancado (por ejemplo si un `ctx.waitUntil` previo se interrumpió),
 * permitiendo su recuperación verificable mediante tarea programada (Cron) o proceso de reintento.
 */
export async function findRetryableNotificationTickets(
  db: D1DatabaseLike,
  nowMs: number = Date.now(),
  limit: number = 10
): Promise<TicketRecord[]> {
  const staleThresholdIso = new Date(nowMs - STALE_PENDING_NOTIFICATION_MS).toISOString();
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const res = await db
    .prepare(
      `SELECT
         id,
         ticket_number,
         created_at,
         updated_at,
         client_name,
         client_email,
         client_phone,
         client_type,
         service_name,
         plan_name,
         subject,
         description,
         status,
         priority,
         channel,
         notification_status,
         notification_attempts,
         notification_last_error,
         submission_fingerprint,
         client_ip_hash
       FROM tickets
       WHERE (
         notification_status = 'FAILED'
         OR (notification_status = 'PENDING' AND updated_at <= ?1)
       )
       AND notification_attempts < ?2
       ORDER BY created_at ASC
       LIMIT ?3`
    )
    .bind(staleThresholdIso, MAX_NOTIFICATION_ATTEMPTS, safeLimit)
    .all<TicketRecord>();

  return Array.isArray(res?.results) ? res.results : [];
}
