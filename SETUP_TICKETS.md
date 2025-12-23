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

### Paso 4: Configurar el Backend

1. Editar el archivo `/app/backend/.env`:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Reiniciar el backend:
   ```bash
   sudo supervisorctl restart backend
   ```

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

### Error "Error de configuración del servidor"
- La variable `GOOGLE_APPS_SCRIPT_URL` está vacía o no configurada
- Reiniciar backend después de modificar `.env`

---

## Archivos del Sistema

- `/app/backend/routers/tickets.py` - Endpoint de tickets
- `/app/backend/google_apps_script.js` - Script para Google (copiar a Apps Script)
- `/app/frontend/src/components/Contact.jsx` - Formulario de contacto
