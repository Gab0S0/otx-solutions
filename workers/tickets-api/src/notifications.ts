import type { Env, NotificationStatus, TicketRecord } from './types.ts';
import type { FetchLike } from './turnstile.ts';
import { updateTicketNotificationStatus } from './repository.ts';

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Escapa estrictamente cualquier carácter especial HTML de los datos enviados por el usuario
 * para prevenir inyección HTML/XSS en clientes de correo.
 */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildNotificationEmailHtml(ticket: TicketRecord): string {
  const tipoLabel = ticket.client_type === 'pyme' ? 'Empresa / PyME' : 'Particular / Profesional';
  const phone = escapeHtml(ticket.client_phone || 'No proporcionado');
  const serviceRow = ticket.service_name
    ? `<tr><td style="padding:6px 0;color:#8fa3b8;">Servicio:</td><td style="padding:6px 0;color:#ffffff;">${escapeHtml(ticket.service_name)}</td></tr>`
    : '';
  const planRow = ticket.plan_name
    ? `<tr><td style="padding:6px 0;color:#8fa3b8;">Plan:</td><td style="padding:6px 0;color:#dac6a0;">${escapeHtml(ticket.plan_name)}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#04070c;color:#e6eef8;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#080d16;border:1px solid rgba(207,228,247,0.16);padding:28px;">
    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8fe3c0;">OTX Solutions · Nuevo Ticket</p>
    <h1 style="margin:0 0 18px;font-size:22px;color:#ffffff;">Ticket ${escapeHtml(ticket.ticket_number)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#8fa3b8;width:130px;">Fecha (UTC):</td><td style="padding:6px 0;color:#ffffff;">${escapeHtml(ticket.created_at)}</td></tr>
      <tr><td style="padding:6px 0;color:#8fa3b8;">Canal:</td><td style="padding:6px 0;color:#ffffff;">${escapeHtml(ticket.channel)}</td></tr>
      <tr><td style="padding:6px 0;color:#8fa3b8;">Cliente:</td><td style="padding:6px 0;color:#ffffff;">${escapeHtml(ticket.client_name)}</td></tr>
      <tr><td style="padding:6px 0;color:#8fa3b8;">Email:</td><td style="padding:6px 0;color:#8fe3c0;">${escapeHtml(ticket.client_email)}</td></tr>
      <tr><td style="padding:6px 0;color:#8fa3b8;">Teléfono:</td><td style="padding:6px 0;color:#ffffff;">${phone}</td></tr>
      <tr><td style="padding:6px 0;color:#8fa3b8;">Perfil:</td><td style="padding:6px 0;color:#ffffff;">${escapeHtml(tipoLabel)}</td></tr>
      ${serviceRow}
      ${planRow}
      <tr><td style="padding:6px 0;color:#8fa3b8;">Asunto:</td><td style="padding:6px 0;color:#ffffff;font-weight:600;">${escapeHtml(ticket.subject)}</td></tr>
    </table>
    <div style="padding:16px;background:#04070c;border:1px solid rgba(207,228,247,0.12);white-space:pre-wrap;font-size:14px;line-height:1.6;color:#e6eef8;">${escapeHtml(ticket.description)}</div>
  </div>
</body>
</html>`;
}

export function buildNotificationEmailText(ticket: TicketRecord): string {
  const lines = [
    `Nuevo Ticket OTX Solutions: ${ticket.ticket_number}`,
    `Fecha (UTC): ${ticket.created_at}`,
    `Canal: ${ticket.channel}`,
    `Cliente: ${ticket.client_name}`,
    `Email: ${ticket.client_email}`,
    `Teléfono: ${ticket.client_phone || 'No proporcionado'}`,
    `Perfil: ${ticket.client_type}`,
  ];
  if (ticket.service_name) lines.push(`Servicio: ${ticket.service_name}`);
  if (ticket.plan_name) lines.push(`Plan: ${ticket.plan_name}`);
  lines.push(`Asunto: ${ticket.subject}`, '', 'Descripción:', ticket.description);
  return lines.join('\n');
}

export interface NotificationResult {
  status: NotificationStatus;
  attempts: number;
  error?: string;
}

/**
 * Envía la notificación por correo mediante Resend y registra el estado en D1.
 * El registro del ticket en D1 es 100% independiente del éxito de esta función.
 * Usa `Idempotency-Key: ticket-notify-${ticket.id}` para evitar correos duplicados en reintentos.
 */
export async function dispatchTicketNotification(
  ticket: TicketRecord,
  env: Env,
  fetchImpl: FetchLike = fetch
): Promise<NotificationResult> {
  const apiKey = (env.RESEND_API_KEY || '').trim();
  const fromEmail = (env.NOTIFICATION_FROM_EMAIL || 'OTX Solutions <notificaciones@otxsolutions.com.ar>').trim();
  const toEmail = (env.NOTIFICATION_TO_EMAIL || 'solutionsotx@gmail.com').trim();

  if (!apiKey) {
    try {
      await updateTicketNotificationStatus(
        env.DB,
        ticket.id,
        'SKIPPED_UNCONFIGURED',
        0,
        'RESEND_API_KEY not configured'
      );
    } catch {
      // No interrumpir flujo principal si falla la actualización de estado secundario
    }
    return { status: 'SKIPPED_UNCONFIGURED', attempts: 0 };
  }

  const attempts = ticket.notification_attempts + 1;

  try {
    const response = await fetchImpl(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `ticket-notify-${ticket.id}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: ticket.client_email,
        subject: `[${ticket.ticket_number}] ${ticket.subject}`,
        html: buildNotificationEmailHtml(ticket),
        text: buildNotificationEmailText(ticket),
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      const errMsg = `Resend HTTP ${response.status}: ${errBody.slice(0, 240)}`;
      try {
        await updateTicketNotificationStatus(env.DB, ticket.id, 'FAILED', attempts, errMsg);
      } catch {
        // Ignorar error secundario
      }
      return { status: 'FAILED', attempts, error: errMsg };
    }

    try {
      await updateTicketNotificationStatus(env.DB, ticket.id, 'SENT', attempts, null);
    } catch {
      // Ignorar error secundario
    }
    return { status: 'SENT', attempts };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    try {
      await updateTicketNotificationStatus(env.DB, ticket.id, 'FAILED', attempts, errMsg);
    } catch {
      // Ignorar error secundario
    }
    return { status: 'FAILED', attempts, error: errMsg };
  }
}
