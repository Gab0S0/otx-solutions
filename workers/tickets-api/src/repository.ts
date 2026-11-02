import type {
  D1DatabaseLike,
  NotificationStatus,
  TicketRecord,
  ValidatedTicketInput,
} from './types.ts';
import { generatePublicTicketNumber } from './security.ts';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 segundos
const RATE_LIMIT_MAX_REQUESTS = 3; // Máximo 3 tickets por minuto por IP
const DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 minutos para idempotencia de doble envío

export interface RateLimitCheckResult {
  allowed: boolean;
}

/**
 * Verifica el límite de solicitudes por hash de IP usando consultas SQL parametrizadas en D1.
 */
export async function checkAndRecordRateLimit(
  db: D1DatabaseLike,
  ipHash: string,
  nowMs: number = Date.now()
): Promise<RateLimitCheckResult> {
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;

  // Limpiar registros antiguos (> 10 min) de esa IP para mantener liviana la tabla
  await db
    .prepare('DELETE FROM ticket_rate_limits WHERE ip_hash = ?1 AND requested_at < ?2')
    .bind(ipHash, nowMs - DEDUP_WINDOW_MS)
    .run();

  const countRow = await db
    .prepare(
      'SELECT COUNT(*) AS count FROM ticket_rate_limits WHERE ip_hash = ?1 AND requested_at >= ?2'
    )
    .bind(ipHash, windowStart)
    .first<{ count: number }>();

  const currentCount = Number(countRow?.count ?? 0);
  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false };
  }

  await db
    .prepare('INSERT INTO ticket_rate_limits (ip_hash, requested_at) VALUES (?1, ?2)')
    .bind(ipHash, nowMs)
    .run();

  return { allowed: true };
}

/**
 * Busca si el mismo envío (fingerprint) ya fue registrado recientemente (idempotencia).
 */
export async function findRecentDuplicateTicket(
  db: D1DatabaseLike,
  fingerprint: string,
  nowMs: number = Date.now()
): Promise<{ id: string; ticket_number: string; created_at: string } | null> {
  const minCreatedIso = new Date(nowMs - DEDUP_WINDOW_MS).toISOString();

  const existing = await db
    .prepare(
      `SELECT id, ticket_number, created_at
       FROM tickets
       WHERE submission_fingerprint = ?1 AND created_at >= ?2
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(fingerprint, minCreatedIso)
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
  now: Date = new Date()
): Promise<TicketRecord> {
  const isoNow = now.toISOString();
  const maxAttempts = 3;

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
            'Nuevo', 'Normal', ?13, 'PENDING', 0, NULL, ?14, ?15
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
        notification_status: 'PENDING',
        notification_attempts: 0,
        notification_last_error: null,
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
