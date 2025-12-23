/**
 * GOOGLE APPS SCRIPT - OTX Solutions Ticket System
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 
 * 1. Crear una Google Sheet nueva en tu cuenta de Google
 *    - Nombrarla "OTX Tickets" (o como prefieras)
 *    - En la primera fila (encabezados), poner:
 *      A1: Ticket ID | B1: Timestamp | C1: Nombre | D1: Email | E1: Teléfono
 *      F1: Tipo | G1: Asunto | H1: Mensaje | I1: Plan | J1: Servicio | K1: IP | L1: Estado
 * 
 * 2. En la Sheet, ir a Extensiones > Apps Script
 * 
 * 3. Borrar el código por defecto y pegar TODO este archivo
 * 
 * 4. Modificar las variables de configuración abajo:
 *    - SHEET_ID: El ID de tu Google Sheet (está en la URL entre /d/ y /edit)
 *    - EMAIL_RECIPIENT: Tu email donde querés recibir los tickets
 * 
 * 5. Guardar el proyecto (Ctrl+S o Cmd+S)
 * 
 * 6. Deployar:
 *    - Click en "Implementar" > "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona"
 *    - Click en "Implementar"
 *    - Autorizar cuando lo pida (revisar permisos)
 *    - COPIAR la URL de la aplicación web
 * 
 * 7. Pegar esa URL en el archivo .env del backend:
 *    GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/xxx/exec
 * 
 * 8. Reiniciar el backend: sudo supervisorctl restart backend
 */

// ==================== CONFIGURACIÓN ====================
const SHEET_ID = 'TU_SHEET_ID_AQUI';  // Reemplazar con el ID de tu Sheet
const EMAIL_RECIPIENT = 'otame.drive@gmail.com';
const SHEET_NAME = 'Tickets';  // Nombre de la hoja (pestaña)
// =======================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Abrir la spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Si no existe la hoja, crearla con encabezados
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Ticket ID', 'Timestamp', 'Nombre', 'Email', 'Teléfono',
        'Tipo', 'Asunto', 'Mensaje', 'Plan', 'Servicio', 'IP', 'Estado'
      ]);
      // Formato de encabezados
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#7A0D1A').setFontColor('white');
    }
    
    // Generar ID de ticket (año + número secuencial)
    const lastRow = sheet.getLastRow();
    const year = new Date().getFullYear().toString().slice(-2);
    const ticketNumber = lastRow.toString().padStart(4, '0');
    const ticketId = `OTX-${year}-${ticketNumber}`;
    
    // Agregar fila
    sheet.appendRow([
      ticketId,
      data.timestamp,
      data.nombre,
      data.email,
      data.telefono,
      data.tipo,
      data.asunto,
      data.mensaje,
      data.plan || '',
      data.servicio || '',
      data.ip || '',
      'Nuevo'
    ]);
    
    // Enviar email
    sendTicketEmail(ticketId, data);
    
    // Responder con éxito
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, ticketId: ticketId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTicketEmail(ticketId, data) {
  const tipoLabel = data.tipo === 'particular' ? 'Particular' : 'Pyme';
  
  const subject = `🎫 Nuevo Ticket ${ticketId}: ${data.asunto}`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #7A0D1A; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">OTX Solutions</h1>
        <p style="margin: 5px 0 0 0;">Nuevo Ticket de Soporte</p>
      </div>
      
      <div style="padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h2 style="color: #7A0D1A; margin-top: 0;">Ticket #${ticketId}</h2>
          <p><strong>Fecha:</strong> ${data.timestamp}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="color: #333; margin-top: 0;">Datos del Cliente</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.nombre}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.telefono}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Tipo:</strong></td>
              <td style="padding: 8px 0;">${tipoLabel}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
          <h3 style="color: #333; margin-top: 0;">Detalle del Ticket</h3>
          <p><strong>Asunto:</strong> ${data.asunto}</p>
          ${data.plan ? `<p><strong>Plan interesado:</strong> ${data.plan}</p>` : ''}
          ${data.servicio ? `<p><strong>Servicio:</strong> ${data.servicio}</p>` : ''}
          <p><strong>Mensaje:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${data.mensaje}</div>
        </div>
        
        <div style="text-align: center; padding: 20px;">
          <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}" 
             style="background: #7A0D1A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver en Google Sheets
          </a>
        </div>
      </div>
      
      <div style="background: #0B0B0F; color: #999; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">OTX Solutions - Soporte IT Remoto</p>
        <p style="margin: 5px 0 0 0;">CABA, Buenos Aires, Argentina</p>
      </div>
    </div>
  `;
  
  const plainBody = `
Nuevo Ticket de Soporte - OTX Solutions
========================================

Ticket: #${ticketId}
Fecha: ${data.timestamp}

DATOS DEL CLIENTE
-----------------
Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono}
Tipo: ${tipoLabel}

DETALLE
-------
Asunto: ${data.asunto}
${data.plan ? `Plan: ${data.plan}` : ''}
${data.servicio ? `Servicio: ${data.servicio}` : ''}

Mensaje:
${data.mensaje}

========================================
Ver todos los tickets: https://docs.google.com/spreadsheets/d/${SHEET_ID}
  `;
  
  MailApp.sendEmail({
    to: EMAIL_RECIPIENT,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody
  });
}

// Función de prueba (ejecutar manualmente para verificar)
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        nombre: 'Test Usuario',
        email: 'test@test.com',
        telefono: '11 1234-5678',
        tipo: 'particular',
        asunto: 'Prueba de ticket',
        mensaje: 'Este es un mensaje de prueba para verificar que el sistema funciona correctamente.',
        plan: 'Plan Mensual',
        servicio: 'Soporte Técnico Remoto',
        ip: '127.0.0.1'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}
