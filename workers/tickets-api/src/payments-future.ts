// =============================================================================
// Arquitectura Preparada para Futura Integración con Mercado Pago (ETAPA FUTURA)
// IMPORTANTE: No expone endpoints ni procesa pagos reales en esta etapa.
// =============================================================================

export type PaymentLifecycleStatus =
  | 'NOT_APPLICABLE'
  | 'PREFERENCE_CREATED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REFUNDED';

/**
 * Contrato de desacoplamiento entre un Ticket (`tickets.id`) y una futura orden/cobro.
 * Cuando se active Mercado Pago en una etapa posterior, se agregará una migración
 * `0002_init_payments.sql` con la tabla `ticket_payments` vinculada por `ticket_id`,
 * manteniendo `tickets` completamente independiente de la pasarela de cobro.
 */
export interface FutureTicketPaymentRecord {
  id: string;
  ticket_id: string;
  provider: 'mercadopago';
  external_reference: string;
  preference_id: string | null;
  mp_payment_id: string | null;
  amount_ars: number;
  status: PaymentLifecycleStatus;
  webhook_idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Requisitos de seguridad obligatorios para cuando se implemente el Webhook de Mercado Pago:
 * 1. Verificar firma criptográfica HMAC-SHA256 del header `x-signature` y `x-request-id`
 *    usando `MP_WEBHOOK_SECRET` (nunca confiar solo en el body del webhook).
 * 2. Consultar el estado real del pago en `GET https://api.mercadopago.com/v1/payments/{id}`
 *    con `MP_ACCESS_TOKEN` privado desde el Worker.
 * 3. Garantizar idempotencia registrando `mp_payment_id` + `status` antes de emitir
 *    notificaciones para evitar procesar dos veces el mismo evento de webhook.
 */
export interface FuturePaymentGatewayPort {
  verifyWebhookSignature(signatureHeader: string | null, requestId: string | null, dataId: string): Promise<boolean>;
}
