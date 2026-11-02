# Configuración del Sistema de Tickets - OTX Solutions

## Resumen del Sistema

El sistema de tickets permite:
1. ✅ Guardar cada ticket en Google Sheets (obligatorio)
2. ✅ Enviar email de notificación a otame.drive@gmail.com
3. ✅ Mostrar confirmación al usuario
4. ✅ Protección anti-spam (honeypot + rate limit)

## Pasos para Activar el Sistema

### Paso 1: Crear la Google Sheet

1. Ir a [Google Sheets](https://sheets.google.com)
2. Crear una nueva hoja de cálculo
3. Nombrarla **"OTX Tickets"** (o el nombre que prefieras)
4. Copiar el **ID de la Sheet** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

### Paso 2: Crear el Google Apps Script

1. En la Google Sheet, ir a **Extensiones > Apps Script**
2. Borrar el código por defecto
3. Copiar y pegar TODO el contenido del archivo `/app/backend/google_apps_script.js`
4. **IMPORTANTE**: Modificar estas líneas al inicio:
   ```javascript
   const SHEET_ID = 'TU_SHEET_ID_AQUI';  // Pegar el ID del paso 1
   const EMAIL_RECIPIENT = 'otame.drive@gmail.com';  // Ya está configurado
   ```
5. Guardar el proyecto (Ctrl+S)

### Paso 3: Deployar como Web App

1. Click en **"Implementar"** > **"Nueva implementación"**
2. Configurar:
   - **Tipo**: Aplicación web
   - **Ejecutar como**: Yo (tu cuenta de Google)
   - **Quién tiene acceso**: Cualquier persona
3. Click en **"Implementar"**
4. **Autorizar** cuando lo pida (revisar permisos de Gmail y Sheets)
5. **COPIAR** la URL de la aplicación web que aparece

La URL se verá así:
```
https://script.google.com/macros/s/AKfycbx.../exec
```

### Paso 4: Configurar el Backend y el Frontend

1. En el entorno del backend (`backend/.env` o variables del servidor donde corra FastAPI), configurar:
   ```env
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx.../exec
   CORS_ORIGINS=https://otxsolutions.com.ar,https://www.otxsolutions.com.ar
   ```
   *(Nota: `MONGO_URL` y `DB_NAME` en `backend/server.py` son opcionales y solo se utilizan para las rutas heredadas `/api/status`; el circuito `/api/tickets` persiste directamente en Google Sheets mediante `GOOGLE_APPS_SCRIPT_URL`).*
2. En el entorno del frontend (Vercel / `frontend/.env`), configurar la URL pública del backend FastAPI:
   ```env
   REACT_APP_BACKEND_URL=https://api.otxsolutions.com.ar
   ```
   *(Opcional: `REACT_APP_MERCADOPAGO_PAYMENT_LINK` si se desea habilitar el enlace de pago HTTPS de Mercado Pago en Asistencia Remota).*
3. Reiniciar el backend después de actualizar las variables de entorno.

### Paso 5: Probar el Sistema

1. Ir a la web y enviar un ticket de prueba
2. Verificar que:
   - ✅ Aparece mensaje de éxito con número de ticket
   - ✅ El ticket aparece en la Google Sheet
   - ✅ Llega el email a otame.drive@gmail.com

---

## Estructura de la Google Sheet

La hoja tendrá estas columnas (se crean automáticamente):

| Columna | Descripción |
|---------|-------------|
| Ticket ID | Ej: OTX-25-0001 |
| Timestamp | Fecha y hora |
| Nombre | Nombre del cliente |
| Email | Email del cliente |
| Teléfono | Teléfono (si lo proporciona) |
| Tipo | Particular / Pyme |
| Asunto | Asunto del ticket |
| Mensaje | Descripción completa |
| Plan | Plan de interés (opcional) |
| Servicio | Servicio consultado (opcional) |
| IP | IP del cliente |
| Estado | Nuevo / En proceso / Resuelto |

---

## Protección Anti-Spam

El sistema incluye:

1. **Honeypot**: Campo oculto que los bots llenan automáticamente
2. **Rate Limit**: Máximo 3 tickets por IP cada 60 segundos

---

## Troubleshooting

### El ticket no se envía
- Verificar que la URL del Apps Script esté correcta en `.env`
- Verificar logs: `tail -f /var/log/supervisor/backend.err.log`

### No llega el email
- Verificar que el Apps Script tenga permisos de Gmail
- Revisar la carpeta de spam

### Error "El servicio de registro de tickets no está disponible" (HTTP 503) o "No recibimos un número de ticket válido" (HTTP 502)
- La variable `GOOGLE_APPS_SCRIPT_URL` está vacía/no configurada en el backend, o el Web App de Google Apps Script no devolvió `{ "success": true, "ticketId": "OTX-..." }`.
- El backend y el frontend rechazan explícitamente respuestas sin `ticketId` real (incluyendo `"N/A"`, `"BLOCKED"`, `null` o respuestas HTML) y ofrecen continuar por WhatsApp o correo electrónico conservando los datos que el cliente ya escribió.

---

## Archivos del Sistema

- `backend/routers/tickets.py` - Endpoint `POST /api/tickets` (validación, rate-limit y reenvío a Google Apps Script)
- `backend/google_apps_script.js` - Script para Google Sheets + `MailApp.sendEmail` (copiar a Apps Script)
- `frontend/src/lib/offer-catalog.js` - Validación compartida (`isValidTicketId`, `validateTicketFormData`, `buildWhatsAppUrl`, `buildMailtoUrl`)
- `frontend/src/components/Contact.jsx` - Formulario de contacto en la portada (`canal: "Landing"`)
- `frontend/src/components/TicketPage.jsx` - Página dedicada `/ticket` (`canal: "TicketWeb"`)
