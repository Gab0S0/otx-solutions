// =============================================================================
// Tipos e Interfaces del Dominio de Tickets y Bindings de Cloudflare Worker
// =============================================================================

export interface D1Meta {
  changes?: number;
  last_row_id?: number;
  duration?: number;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: D1Meta;
  error?: string;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
  batch?<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException?(): void;
}

export interface ScheduledControllerLike {
  scheduledTime?: number;
  cron?: string;
}

export type DeployEnvironment = 'development' | 'test' | 'staging' | 'production';

export interface Env {
  DB: D1DatabaseLike;
  ENVIRONMENT?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_ALLOWED_HOSTNAMES?: string;
  TURNSTILE_EXPECTED_ACTION?: string;
  IP_HASH_SALT?: string;
  RESEND_API_KEY?: string;
  NOTIFICATION_FROM_EMAIL?: string;
  NOTIFICATION_TO_EMAIL?: string;
}

export type ClientType = 'particular' | 'pyme';
export type TicketStatus = 'Nuevo' | 'En proceso' | 'Pendiente' | 'Resuelto';
export type TicketPriority = 'Baja' | 'Normal' | 'Alta' | 'Urgente';
export type TicketChannel = 'Landing' | 'TicketWeb' | 'WhatsApp';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED_UNCONFIGURED';

export interface ValidatedTicketInput {
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: ClientType;
  asunto: string;
  mensaje: string;
  plan: string | null;
  servicio: string | null;
  canal: TicketChannel;
  website: string;
  turnstileToken: string;
}

export interface TicketRecord {
  id: string;
  ticket_number: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_type: ClientType;
  service_name: string | null;
  plan_name: string | null;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  notification_status: NotificationStatus;
  notification_attempts: number;
  notification_last_error: string | null;
  submission_fingerprint: string;
  client_ip_hash: string;
}

export interface TicketApiResponse {
  success: boolean;
  ticket_id?: string;
  message: string;
  detail?: string;
  turnstile_reset?: boolean;
  duplicate?: boolean;
}

export interface HealthCheckResponse {
  ok: boolean;
  service: 'otx-tickets-api';
  worker: 'up';
  database?: 'up' | 'down';
}
