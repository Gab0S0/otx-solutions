import type { ValidatedTicketInput } from './types.ts';

// Crockford Base32 sin caracteres ambiguos (sin 0, O, 1, I, L)
const SAFE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Genera un identificador público único y no secuencial para el ticket.
 * Ejemplo: OTX-26-8F4K9M
 * Evita por completo el antipatrón MAX(id) + 1 que sufre condiciones de carrera.
 */
export function generatePublicTicketNumber(now: Date = new Date()): string {
  const yearSuffix = now.getUTCFullYear().toString().slice(-2);
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);

  let code = '';
  for (let i = 0; i < randomBytes.length; i++) {
    code += SAFE_ALPHABET[randomBytes[i] % SAFE_ALPHABET.length];
  }

  return `OTX-${yearSuffix}-${code}`;
}

/**
 * Calcula un hash SHA-256 en formato hexadecimal usando Web Crypto API.
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Calcula una huella de idempotencia del contenido de la solicitud para prevenir
 * envíos duplicados accidentales (doble clic o reintento de red).
 */
export async function computeSubmissionFingerprint(
  data: ValidatedTicketInput,
  idempotencyHeader?: string | null
): Promise<string> {
  const cleanHeader = (idempotencyHeader || '').trim();
  if (cleanHeader.length >= 8 && cleanHeader.length <= 128) {
    return sha256Hex(`idemp:${data.email.toLowerCase()}:${cleanHeader}`);
  }

  const normalizedPayload = [
    data.email.toLowerCase().trim(),
    data.tipo,
    (data.plan || '').toLowerCase().trim(),
    (data.servicio || '').toLowerCase().trim(),
    data.asunto.toLowerCase().replace(/\s+/g, ' ').trim(),
    data.mensaje.toLowerCase().replace(/\s+/g, ' ').trim(),
  ].join('|');

  return sha256Hex(`fp:${normalizedPayload}`);
}

/**
 * Anonimiza la dirección IP del cliente antes de almacenarla en D1 para rate-limiting,
 * cumpliendo con el principio de no exponer ni guardar IPs crudas innecesariamente.
 */
export async function hashClientIp(ip: string, salt: string = 'otx-default-salt'): Promise<string> {
  const normalizedIp = (ip || 'unknown').trim().toLowerCase();
  return sha256Hex(`ip:${salt}:${normalizedIp}`);
}
