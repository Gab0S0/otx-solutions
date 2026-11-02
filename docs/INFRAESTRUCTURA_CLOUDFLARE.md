# Infraestructura Cloudflare — OTX Solutions (`feat/cloudflare-tickets`)

Este documento detalla la arquitectura moderna del sistema de tickets de **OTX Solutions** utilizando **Cloudflare Pages**, **Cloudflare Workers (TypeScript)**, **Cloudflare D1 (SQLite)**, **Cloudflare Turnstile** y **Resend**.

---

## 1. Arquitectura y Separación de Responsabilidades

```text
otx-solutions/
├── frontend/                              # Aplicación React (CRACO -> genera frontend/build)
│   ├── public/
│   │   ├── _redirects                     # Regla SPA para Cloudflare Pages (/* /index.html 200)
│   │   └── _headers                       # Cabeceras de seguridad HTTP
│   ├── src/
│   │   ├── components/
│   │   │   ├── TurnstileWidget.jsx        # Widget discreto de Cloudflare Turnstile (modo oscuro, action="ticket_submit")
│   │   │   ├── Contact.jsx                # Formulario de portada (canal: "Landing")
│   │   │   └── TicketPage.jsx             # Formulario dedicado /ticket (canal: "TicketWeb")
│   │   └── lib/
│   │       └── offer-catalog.js           # Validación cliente, URLs de WhatsApp/Email y helpers de entorno
│   └── .env.cloudflare.example            # Plantilla de variables públicas para Cloudflare Pages
│
└── workers/
    └── tickets-api/                       # Backend API en Cloudflare Workers (TypeScript)
        ├── migrations/
        │   └── 0001_init_tickets.sql      # Esquema versionado D1 (tablas `tickets` y `ticket_rate_limits`)
        ├── src/
        │   ├── index.ts                   # Entrypoint del Worker (POST /api/tickets, GET /api/health, GET /api/health/live, scheduled)
        │   ├── types.ts                   # Tipos de dominio, ExecutionContext y bindings D1 / Env
        │   ├── cors.ts                    # Lista blanca estricta de orígenes permitidos (ALLOWED_ORIGINS)
        │   ├── validation.ts              # Validación estricta del lado del servidor + Honeypot
        │   ├── security.ts                # Generador CSPRNG (OTX-AA-XXXXXX), fingerprint SHA-256 por IP y sal obligatoria
        │   ├── turnstile.ts               # Verificación Siteverify (success, hostname por entorno y action="ticket_submit")
        │   ├── repository.ts              # Consultas parametrizadas D1, rate-limit atómico, idempotencia y salud de D1
        │   ├── notifications.ts           # Integración Resend con escape HTML, saneamiento de errores y recuperación automática
        │   └── payments-future.ts         # Contrato desacoplado para futura integración con Mercado Pago
        ├── tests/
        │   ├── tickets-worker.test.ts     # Suite automatizada sobre SQLite real (`node:sqlite`)
        │   ├── wrangler-d1-integration.test.ts # Prueba de integración real con Wrangler (`getPlatformProxy` + workerd D1)
        │   └── node-builtins.d.ts         # Declaraciones de tipos para chequeo estático `tsc --noEmit`
        ├── wrangler.toml                  # Configuración del Worker, entorno staging, Cron Trigger y binding D1
        ├── tsconfig.json                  # Configuración estricta de TypeScript
        ├── package.json                   # Scripts de desarrollo, typecheck, migración y pruebas
        └── .dev.vars.example              # Plantilla de variables secretas para entorno local
```

---

## 2. Flujo de Seguridad, Concurrencia y Persistencia (`POST /api/tickets`)

El orden de ejecución en [`workers/tickets-api/src/index.ts`](file:///C:/Users/Usuario/.gemini/antigravity/scratch/otx-solutions/workers/tickets-api/src/index.ts) garantiza que ninguna solicitud obtenga confirmación ni identificadores sin superar antes todos los controles de seguridad:

1. **Verificación de Origen (CORS):** Solo acepta peticiones desde los orígenes configurados en `ALLOWED_ORIGINS` (`https://otxsolutions.com.ar`, `https://www.otxsolutions.com.ar` en producción; `https://staging.otxsolutions.com.ar` y `https://*.otx-solutions.pages.dev` en staging; `http://localhost:3000` en desarrollo).
2. **Verificación de Binding D1 y `IP_HASH_SALT` (`security.ts`):**
   - Comprueba la disponibilidad de `env.DB`.
   - En `staging` y `production`, exige que `IP_HASH_SALT` esté configurado como secreto de al menos 16 caracteres y rechaza valores por defecto o de ejemplo con `HTTP 503` (sin revelar nombres de secretos internos).
3. **Límite de Tamaño de Cuerpo JSON (`MAX_JSON_BODY_BYTES = 16 KB`):**
   - Verifica tanto la cabecera `Content-Length` como el tamaño real en bytes UTF-8 del cuerpo antes de ejecutar `JSON.parse()`. Si supera 16 KB, devuelve `HTTP 413 Payload Too Large`.
4. **Validación en Servidor y Honeypot (`validation.ts`):** Valida tipos, longitudes, formato de correo, presencia de `turnstileToken` y que el campo oculto `website` esté vacío. Los mensajes de error nunca reflejan datos personales ingresados por el usuario.
5. **Rate Limiting Atómico en D1 (`repository.ts`):**
   - Hashea la IP (`CF-Connecting-IP`) con `SHA-256` + `IP_HASH_SALT`.
   - En lugar de depender de una secuencia no atómica `SELECT + INSERT`, ejecuta una sentencia condicional única `INSERT INTO ticket_rate_limits (ip_hash, requested_at) SELECT ?1, ?2 WHERE (SELECT COUNT(*) FROM ticket_rate_limits WHERE ip_hash = ?3 AND requested_at >= ?4) < ?5` (junto con `db.batch()` transaccional de D1). Si se superan las **3 solicitudes cada 60 segundos**, devuelve `HTTP 429`.
6. **Verificación Antibots Turnstile Obligatoria Antes de Idempotencia (`turnstile.ts`):**
   - Valida el token contra `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
   - Comprueba:
     - `payload.success === true`.
     - `payload.hostname` contra la lista permitida por entorno (`development`/`test`: `localhost, 127.0.0.1`; `staging`: `staging.otxsolutions.com.ar, *.otx-solutions.pages.dev`; `production`: `otxsolutions.com.ar, www.otxsolutions.com.ar`).
     - `payload.action === "ticket_submit"`.
   - En `staging` y `production` bloquea explícitamente las claves secretas dummy de prueba de Cloudflare.
7. **Idempotencia contra Envíos Duplicados Post-Siteverify (`security.ts` + `repository.ts`):**
   - Solo se ejecuta **después** de que Turnstile Siteverify fue aprobado.
   - Calcula `submission_fingerprint` vinculando criptográficamente el `ipHash` del remitente, el contenido normalizado del formulario y el encabezado opcional `Idempotency-Key`.
   - Consulta en D1 exigiendo coincidencia simultánea de `submission_fingerprint` y `client_ip_hash` dentro de la ventana de **10 minutos**. Así conserva reintentos legítimos del mismo usuario sin permitir bypass de Turnstile ni exposición de `ticket_number` entre distintos usuarios/IPs.
8. **Generación de ID y Escritura en D1 (`repository.ts`):**
   - `id`: UUIDv4 interno (`crypto.randomUUID()`).
   - `ticket_number`: Código público `OTX-AA-XXXXXX` generado con `crypto.getRandomValues` sobre alfabeto Crockford Base32 sin caracteres ambiguos (`0/O/1/I/L`).
   - El Worker solo responde éxito (`HTTP 201`) después de que D1 confirma `insertRes.success === true` y `changes >= 1`.

---

## 3. Endpoints de Salud (`GET /api/health` y `GET /api/health/live`)

- **`GET /api/health/live` (Liveness del Worker):** Comprueba únicamente que el runtime del Worker está activo (`HTTP 200`, `{ ok: true, service: "otx-tickets-api", worker: "up" }`).
- **`GET /api/health` (Readiness integral Worker + D1):** Ejecuta una consulta parametrizada real sobre D1 (`checkDatabaseHealth`) verificando conectividad y existencia de la tabla `tickets`. Devuelve `HTTP 200` (`database: "up"`) cuando D1 está operativo y migrado, o `HTTP 503` (`database: "down"`) si falla, sin exponer secretos ni errores SQL.

---

## 4. Notificaciones por Correo (Resend), `ctx.waitUntil()` y Recuperación de Fallos

- **Ejecución no bloqueante con `ctx.waitUntil()`:** Una vez que el ticket fue insertado en D1 con `notification_status = 'PENDING'` (o `'SKIPPED_UNCONFIGURED'` si `RESEND_API_KEY` está vacía), el Worker despacha `dispatchTicketNotification` mediante `ctx.waitUntil(notificationPromise)` y devuelve inmediatamente `HTTP 201` al navegador sin bloquear al usuario esperando la red de Resend.
- **Límites documentados de `ctx.waitUntil()`:** En Cloudflare Workers, `ctx.waitUntil()` extiende el ciclo de vida de la invocación tras enviar la respuesta HTTP (hasta ~30 segundos), pero no sustituye a una cola persistente si el aislamiento se interrumpe abruptamente o si el proveedor externo cae por varios minutos.
- **Estrategia verificable de recuperación (`retryPendingOrFailedNotifications` + Cron Trigger):**
  - El Worker exporta `scheduled()` configurado en `wrangler.toml` (`crons = ["*/10 * * * *"]`) y la función verificable `retryPendingOrFailedNotifications(env)`.
  - Esta rutina busca en D1 los tickets con `notification_status = 'FAILED'` o `notification_status = 'PENDING'` estancados (`updated_at` anterior a 2 minutos) con `notification_attempts < 5`.
  - Reintenta el envío hacia Resend enviando `Idempotency-Key: ticket-notify-${ticket.id}` para evitar correos duplicados y sanea cualquier mensaje de error (`sanitizeNotificationError`) para nunca guardar tokens ni claves API en `notification_last_error`.

---

## 5. Configuración de Cloudflare Pages (Frontend CRACO)

El frontend utiliza **Create React App + CRACO** (`frontend/package.json`) y genera la carpeta **`frontend/build`**.

- **Framework preset:** `Create React App`
- **Root directory:** `frontend`
- **Build command:** `npm run build`
- **Build output directory:** `build`
- **Variables de entorno en Cloudflare Pages (`Production` y `Preview`):**
  - `NODE_VERSION`: `24`
  - `REACT_APP_TICKETS_API_URL`: URL pública del Worker
  - `REACT_APP_TURNSTILE_SITE_KEY`: Sitekey pública de Turnstile

---

## 6. Preparación para Mercado Pago (Etapa Futura)

En [`workers/tickets-api/src/payments-future.ts`](file:///C:/Users/Usuario/.gemini/antigravity/scratch/otx-solutions/workers/tickets-api/src/payments-future.ts) queda definida la frontera para futuros cobros (`FutureTicketPaymentRecord`), separando estados de soporte y estados financieros, y exigiendo validación `HMAC-SHA256` (`x-signature`) e idempotencia en futuros webhooks.
