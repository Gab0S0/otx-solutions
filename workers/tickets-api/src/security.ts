import type { DeployEnvironment, Env, ValidatedTicketInput } from './types.ts';

// Crockford Base32 sin caracteres ambiguos (sin 0, O, 1, I, L)
const SAFE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

const DEV_FALLBACK_IP_SALT = 'dev-only-ip-hash-salt-otx-2026';
const FORBIDDEN_PROD_SALTS = new Set([
  '',
  'otx-default-salt',
  DEV_FALLBACK_IP_SALT,
  'replace_with_random_32_byte_hex_salt',
  'changeme',
  'default',
]);

export function resolveEnvironment(env: Env): DeployEnvironment {
  const raw = (env.ENVIRONMENT || 'production').trim().toLowerCase();
  if (raw === 'development' || raw === 'dev') return 'development';
  if (raw === 'test') return 'test';
  if (raw === 'staging' || raw === 'preview') return 'staging';
  return 'production';
}

export function isDevOrTestEnv(env: Env): boolean {
  const mode = resolveEnvironment(env);
  return mode === 'development' || mode === 'test';
}

/**
 * Valida y obtiene la sal criptográfica para anonimizar direcciones IP.
 * En `production` y `staging` exige un secreto explícito de al menos 16 caracteres
 * y rechaza valores por defecto o marcadores de ejemplo.
 */
export function resolveIpHashSalt(
  env: Env
): { ok: true; salt: string } | { ok: false; errorCode: string } {
  const configured = (env.IP_HASH_SALT || '').trim();

  if (isDevOrTestEnv(env)) {
    return {
      ok: true,
      salt: configured.length >= 8 ? configured : DEV_FALLBACK_IP_SALT,
    };
  }

  if (
    configured.length < 16 ||
    FORBIDDEN_PROD_SALTS.has(configured.toLowerCase())
  ) {
    return {
      ok: false,
      errorCode: 'missing-or-weak-ip-hash-salt',
    };
  }

  return { ok: true, salt: configured };
}

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
 * Calcula una huella de idempotencia vinculada tanto al contenido normalizado
 * de la solicitud como al hash de IP del remitente (y opcionalmente Idempotency-Key).
 * Esto permite reintentos legítimos del mismo cliente tras superar Turnstile,
 * impidiendo que terceros desde otra conexión descubran identificadores ajenos
 * enviando textos o claves similares.
 */
export async function computeSubmissionFingerprint(
  data: ValidatedTicketInput,
  ipHash: string,
  idempotencyHeader?: string | null
): Promise<string> {
  const cleanIpHash = (ipHash || '').trim();
  if (!cleanIpHash) {
    throw new Error('ipHash es requerido para calcular submission_fingerprint');
  }

  const normalizedPayload = [
    data.email.toLowerCase().trim(),
    data.tipo,
    (data.plan || '').toLowerCase().trim(),
    (data.servicio || '').toLowerCase().trim(),
    data.asunto.toLowerCase().replace(/\s+/g, ' ').trim(),
    data.mensaje.toLowerCase().replace(/\s+/g, ' ').trim(),
  ].join('|');

  const cleanHeader = (idempotencyHeader || '').trim();
  if (cleanHeader.length >= 8 && cleanHeader.length <= 128) {
    return sha256Hex(`idemp:${cleanIpHash}:${cleanHeader}:${normalizedPayload}`);
  }

  return sha256Hex(`fp:${cleanIpHash}:${normalizedPayload}`);
}

/**
 * Anonimiza la dirección IP del cliente antes de almacenarla en D1 para rate-limiting,
 * exigiendo una sal explícita (sin valores por defecto inseguros).
 */
export async function hashClientIp(ip: string, salt: string): Promise<string> {
  const cleanSalt = (salt || '').trim();
  if (!cleanSalt) {
    throw new Error('Se requiere IP_HASH_SALT no vacío para hashear la IP del cliente.');
  }
  const normalizedIp = (ip || 'unknown').trim().toLowerCase();
  return sha256Hex(`ip:${cleanSalt}:${normalizedIp}`);
}
