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
│   │   │   ├── TurnstileWidget.jsx        # Widget discreto de Cloudflare Turnstile (modo oscuro)
│   │   │   ├── Contact.jsx                # Formulario de portada (canal: "Landing")
│   │   │   └── TicketPage.jsx             # Formulario dedicado /ticket (canal: "TicketWeb")
│   │   └── lib/
│   │       └── offer-catalog.js           # Validación cliente, URLs de WhatsApp/Email y helpers de entorno
│   └── .env.cloudflare.example            # Plantilla de variables públicas para Cloudflare Pages
│
└── workers/
    └── tickets-api/                       # Backend API en Cloudflare Workers (TypeScript sin dependencias externas)
        ├── migrations/
        │   └── 0001_init_tickets.sql      # Esquema versionado D1 (tablas `tickets` y `ticket_rate_limits`)
        ├── src/
        │   ├── index.ts                   # Entrypoint del Worker y ruteo seguro (POST /api/tickets, GET /api/health)
        │   ├── types.ts                   # Tipos de dominio y bindings D1 / Env
        │   ├── cors.ts                    # Lista blanca estricta de orígenes permitidos (ALLOWED_ORIGINS)
        │   ├── validation.ts              # Validación estricta del lado del servidor + Honeypot
        │   ├── security.ts                # Generador CSPRNG (OTX-AA-XXXXXX), fingerprint SHA-256 e IP hash
        │   ├── turnstile.ts               # Verificación Siteverify de uso único y vigencia
        │   ├── repository.ts              # Consultas parametrizadas D1, rate-limit e idempotencia
        │   ├── notifications.ts           # Integración Resend con escape HTML anti-XSS e Idempotency-Key
        │   └── payments-future.ts         # Contrato desacoplado para futura integración con Mercado Pago
        ├── tests/
        │   └── tickets-worker.test.ts     # Suite automatizada sobre SQLite real (`node:sqlite`)
        ├── wrangler.toml                  # Configuración del Worker y binding D1
        ├── tsconfig.json                  # Configuración estricta de TypeScript
        ├── package.json                   # Scripts de desarrollo, migración y pruebas
        └── .dev.vars.example              # Plantilla de variables secretas para entorno local
```

---

## 2. Flujo de Seguridad y Persistencia en `POST /api/tickets`

1. **Verificación de Origen (CORS):** Solo acepta peticiones desde los orígenes configurados en `ALLOWED_ORIGINS` (`https://otxsolutions.com.ar`, `https://www.otxsolutions.com.ar` y en desarrollo `http://localhost:3000`).
2. **Validación en Servidor (`validation.ts`):** Valida tipos, longitudes, formato de correo, presencia de `turnstileToken` y que el campo honeypot `website` esté vacío.
3. **Mitigación de Spam / Rate Limiting (`repository.ts`):** Hashea la IP (`CF-Connecting-IP`) con `SHA-256` + `IP_HASH_SALT` (sin guardar IPs crudas) y permite un máximo de **3 solicitudes cada 60 segundos** por IP en `ticket_rate_limits`.
4. **Idempotencia contra Envíos Duplicados (`security.ts` + `repository.ts`):** Calcula una huella `SHA-256` de los datos normalizados (o del header `Idempotency-Key`). Si el mismo ticket ya se registró en los últimos **10 minutos**, devuelve `HTTP 200` con el `ticket_number` existente sin duplicar filas en D1.
5. **Verificación Antibots Turnstile (`turnstile.ts`):** Valida el token contra `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Si el token venció o ya fue utilizado, devuelve `turnstile_reset: true` para que el frontend reinicie automáticamente el widget. En `ENVIRONMENT = "production"` bloquea explícitamente las claves dummy de prueba de Cloudflare.
6. **Generación de ID y Escritura en D1 (`repository.ts`):**
   - `id`: UUIDv4 interno (`crypto.randomUUID()`).
   - `ticket_number`: Código público `OTX-AA-XXXXXX` generado con `crypto.getRandomValues` sobre alfabeto Crockford Base32 sin caracteres ambiguos (`0/O/1/I/L`), evitando el antipatrón `MAX(id) + 1`.
   - **Garantía de confirmación real:** El Worker solo responde éxito (`HTTP 201`) después de que D1 confirma `insertRes.success === true` y `changes >= 1`.

---

## 3. Notificaciones por Correo (Resend) — Gestión de Fallos y Reintentos

- **Independencia del registro:** Si `RESEND_API_KEY` aún no está configurada, el ticket se guarda en D1 con `notification_status = 'SKIPPED_UNCONFIGURED'`. Si Resend falla o vence el tiempo de espera, el ticket se guarda con `notification_status = 'FAILED'`, se incrementa `notification_attempts` y se registra el error en `notification_last_error`, devolviendo igualmente `HTTP 201` al cliente porque su ticket ya está persistido en D1.
- **Prevención de correos duplicados:** Cada llamada a `https://api.resend.com/emails` incluye el header `Idempotency-Key: ticket-notify-${ticket.id}`. Si un proceso de reintento vuelve a enviar la notificación para el mismo `ticket.id`, Resend garantiza que no se duplique el correo.
- **Seguridad HTML:** Todos los campos enviados por el usuario (`nombre`, `email`, `telefono`, `servicio`, `plan`, `asunto`, `mensaje`) pasan por `escapeHtml()` antes de construir el cuerpo HTML.

---

## 4. Configuración de Cloudflare Pages (Frontend CRACO)

El frontend actual utiliza **Create React App + CRACO** (`frontend/package.json`) y genera la carpeta **`frontend/build`** (no utiliza Vite ni genera `dist`).

Parámetros exactos para vincular el repositorio en **Cloudflare Pages** (sin desconectar Vercel ni cambiar DNS hasta autorizar el corte a producción):

- **Framework preset:** `Create React App`
- **Root directory (directorio raíz):** `frontend`
- **Build command:** `npm run build`
- **Build output directory:** `build`
- **Variables de entorno en Cloudflare Pages (`Production` y `Preview`):**
  - `NODE_VERSION`: `24`
  - `REACT_APP_TICKETS_API_URL`: URL pública del Worker (ej. `https://otx-tickets-api.<subdominio>.workers.dev` o `https://api.otxsolutions.com.ar`)
  - `REACT_APP_TURNSTILE_SITE_KEY`: Sitekey pública de Turnstile generada en Cloudflare Dashboard.

---

## 5. Preparación para Mercado Pago (Etapa Futura)

En [`workers/tickets-api/src/payments-future.ts`](file:///C:/Users/Usuario/.gemini/antigravity/scratch/otx-solutions/workers/tickets-api/src/payments-future.ts) quedó definida la separación entre `tickets` y futuros cobros (`FutureTicketPaymentRecord`):

1. **Separación de tablas:** Los pagos se registrarán en una futura migración `0002_init_payments.sql` (`ticket_payments`), referenciando `tickets.id` sin mezclar estados de soporte (`Nuevo`, `En proceso`, `Pendiente`, `Resuelto`) con estados financieros (`PENDING`, `APPROVED`, `REJECTED`).
2. **Verificación de Webhooks:** El futuro endpoint `POST /api/webhooks/mercadopago` deberá validar la firma `HMAC-SHA256` del header `x-signature` con `MP_WEBHOOK_SECRET` y consultar el estado real en la API de Mercado Pago antes de dar por acreditado un pago.
3. **Idempotencia de Webhooks:** Se almacenará `mp_payment_id` + `webhook_idempotency_key` con restricción `UNIQUE` en D1 para ignorar notificaciones repetidas de Mercado Pago.
