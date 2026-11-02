import type { ClientType, TicketChannel, ValidatedTicketInput } from './types.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_CLIENT_TYPES = new Set<ClientType>(['particular', 'pyme']);
const VALID_CHANNELS = new Set<TicketChannel>(['Landing', 'TicketWeb', 'WhatsApp']);

export interface ValidationOutcome {
  valid: boolean;
  error?: string;
  honeypotTriggered?: boolean;
  missingTurnstile?: boolean;
  data?: ValidatedTicketInput;
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateTicketPayload(raw: unknown): ValidationOutcome {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, error: 'El formato de la solicitud no es válido.' };
  }

  const body = raw as Record<string, unknown>;

  // 1. Honeypot check (debe estar vacío)
  const website = cleanString(body.website);
  if (website.length > 0) {
    return {
      valid: false,
      honeypotTriggered: true,
      error: 'No se pudo validar el envío del formulario. Por favor contactanos por WhatsApp.',
    };
  }

  // 2. Nombre
  const nombre = cleanString(body.nombre);
  if (nombre.length < 2 || nombre.length > 100) {
    return {
      valid: false,
      error: 'Por favor ingresá tu nombre (entre 2 y 100 caracteres).',
    };
  }

  // 3. Email
  const email = cleanString(body.email).toLowerCase();
  if (!email || email.length > 160 || !EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      error: 'Por favor ingresá un correo electrónico válido.',
    };
  }

  // 4. Teléfono (opcional)
  const rawPhone = cleanString(body.telefono);
  if (rawPhone.length > 30) {
    return {
      valid: false,
      error: 'El teléfono ingresado excede el largo máximo permitido (30 caracteres).',
    };
  }
  const telefono = rawPhone.length > 0 ? rawPhone : null;

  // 5. Tipo de cliente
  const rawTipo = cleanString(body.tipo).toLowerCase() as ClientType;
  const tipo: ClientType = VALID_CLIENT_TYPES.has(rawTipo) ? rawTipo : 'particular';

  // 6. Plan y Servicio (opcionales)
  const rawPlan = cleanString(body.plan);
  const rawServicio = cleanString(body.servicio);
  if (rawPlan.length > 150 || rawServicio.length > 150) {
    return {
      valid: false,
      error: 'El nombre del plan o servicio seleccionado no es válido.',
    };
  }
  const plan = rawPlan.length > 0 ? rawPlan : null;
  const servicio = rawServicio.length > 0 ? rawServicio : null;

  // 7. Asunto y Mensaje
  const mensaje = cleanString(body.mensaje);
  if (mensaje.length < 10 || mensaje.length > 2000) {
    return {
      valid: false,
      error: 'Por favor describí tu consulta con al menos 10 caracteres (máximo 2000).',
    };
  }

  let asunto = cleanString(body.asunto);
  if (!asunto) {
    if (plan) asunto = `Interesado en: ${plan}`;
    else if (servicio) asunto = `Consulta sobre: ${servicio}`;
    else asunto = `Consulta web: ${mensaje.slice(0, 60)}`;
  }

  if (asunto.length < 3 || asunto.length > 200) {
    return {
      valid: false,
      error: 'Por favor ingresá el asunto o motivo de la solicitud (entre 3 y 200 caracteres).',
    };
  }

  // 8. Canal
  const rawCanal = cleanString(body.canal) as TicketChannel;
  const canal: TicketChannel = VALID_CHANNELS.has(rawCanal) ? rawCanal : 'TicketWeb';

  // 9. Token de Cloudflare Turnstile
  const turnstileToken = cleanString(body.turnstileToken || body.cf_turnstile_response);
  if (!turnstileToken || turnstileToken.length > 2048) {
    return {
      valid: false,
      missingTurnstile: true,
      error: 'Por favor completá la verificación de seguridad (Turnstile) antes de enviar.',
    };
  }

  return {
    valid: true,
    data: {
      nombre,
      email,
      telefono,
      tipo,
      asunto,
      mensaje,
      plan,
      servicio,
      canal,
      website: '',
      turnstileToken,
    },
  };
}
