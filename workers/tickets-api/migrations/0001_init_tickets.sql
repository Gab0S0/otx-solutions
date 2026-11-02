-- =============================================================================
-- Migración D1: 0001_init_tickets.sql
-- Esquema inicial del sistema de tickets de OTX Solutions en Cloudflare D1
-- =============================================================================

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_type TEXT NOT NULL CHECK (client_type IN ('particular', 'pyme')),
  service_name TEXT,
  plan_name TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Nuevo' CHECK (status IN ('Nuevo', 'En proceso', 'Pendiente', 'Resuelto')),
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Baja', 'Normal', 'Alta', 'Urgente')),
  channel TEXT NOT NULL DEFAULT 'TicketWeb' CHECK (channel IN ('Landing', 'TicketWeb', 'WhatsApp')),
  notification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (notification_status IN ('PENDING', 'SENT', 'FAILED', 'SKIPPED_UNCONFIGURED')),
  notification_attempts INTEGER NOT NULL DEFAULT 0,
  notification_last_error TEXT,
  submission_fingerprint TEXT NOT NULL,
  client_ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at
  ON tickets (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_status_priority
  ON tickets (status, priority, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_fingerprint_created
  ON tickets (submission_fingerprint, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_notification_status
  ON tickets (notification_status, created_at ASC);

-- Tabla auxiliar liviana para control de límite de solicitudes por hash de IP
CREATE TABLE IF NOT EXISTS ticket_rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  requested_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_time
  ON ticket_rate_limits (ip_hash, requested_at DESC);
