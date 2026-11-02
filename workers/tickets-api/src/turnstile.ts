import type { Env } from './types.ts';
import { isDevOrTestEnv, resolveEnvironment } from './security.ts';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Claves secretas oficiales de prueba de Cloudflare Turnstile (SOLO permitidas en development/test)
export const TURNSTILE_TEST_SECRET_PASS = '1x0000000000000000000000000000000AA';
export const TURNSTILE_TEST_SECRET_FAIL = '2x0000000000000000000000000000000AA';

export const EXPECTED_TURNSTILE_ACTION = 'ticket_submit';

const DEFAULT_HOSTNAMES_BY_ENV: Record<string, string[]> = {
  development: ['localhost', '127.0.0.1'],
  test: ['localhost', '127.0.0.1'],
  staging: ['staging.otxsolutions.com.ar', '*.otx-solutions.pages.dev'],
  production: ['otxsolutions.com.ar', 'www.otxsolutions.com.ar'],
};

export interface TurnstileSiteverifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

export interface TurnstileVerifyOutcome {
  ok: boolean;
  resetRequired: boolean;
  errorMessage?: string;
  errorCodes?: string[];
}

export type FetchLike = typeof fetch;

/**
 * Obtiene la lista de hostnames permitidos para Siteverify según el entorno
 * (development/test, staging o production), manteniendo separación estricta.
 */
export function getAllowedTurnstileHostnames(env: Env): string[] {
  const configured = (env.TURNSTILE_ALLOWED_HOSTNAMES || '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (configured.length > 0) {
    return configured;
  }

  const mode = resolveEnvironment(env);
  return DEFAULT_HOSTNAMES_BY_ENV[mode] || DEFAULT_HOSTNAMES_BY_ENV.production;
}

/**
 * Valida que el hostname devuelto por Cloudflare Turnstile Siteverify coincida
 * con la lista permitida para el entorno actual.
 */
export function isTurnstileHostnameAllowed(
  hostname: string | undefined | null,
  env: Env
): boolean {
  const normalized = (hostname || '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const allowedPatterns = getAllowedTurnstileHostnames(env);
  for (const pattern of allowedPatterns) {
    if (pattern === normalized) {
      return true;
    }
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1); // ej. ".otx-solutions.pages.dev"
      if (normalized.endsWith(suffix) && normalized.length > suffix.length) {
        const subLabel = normalized.slice(0, normalized.length - suffix.length);
        if (/^[a-z0-9-]+$/i.test(subLabel)) {
          return true;
        }
      }
    }
  }

  return false;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
  env: Env,
  fetchImpl: FetchLike = fetch
): Promise<TurnstileVerifyOutcome> {
  const cleanToken = (token || '').trim();
  if (!cleanToken) {
    return {
      ok: false,
      resetRequired: true,
      errorMessage: 'Por favor completá la verificación de seguridad antes de enviar.',
      errorCodes: ['missing-input-response'],
    };
  }

  const secretKey = (env.TURNSTILE_SECRET_KEY || '').trim();
  const isDevOrTest = isDevOrTestEnv(env);

  if (!secretKey) {
    return {
      ok: false,
      resetRequired: false,
      errorMessage:
        'El servicio de verificación de seguridad no está configurado en el servidor. Podés continuar por WhatsApp o correo electrónico.',
      errorCodes: ['missing-input-secret'],
    };
  }

  // En staging y production, rechazar el uso accidental de las claves dummy de prueba de Cloudflare
  if (
    !isDevOrTest &&
    (secretKey === TURNSTILE_TEST_SECRET_PASS || secretKey === TURNSTILE_TEST_SECRET_FAIL)
  ) {
    return {
      ok: false,
      resetRequired: false,
      errorMessage:
        'Configuración de seguridad inválida para este entorno. Por favor contactanos por WhatsApp.',
      errorCodes: ['invalid-test-secret-in-non-dev'],
    };
  }

  const formData = new URLSearchParams();
  formData.set('secret', secretKey);
  formData.set('response', cleanToken);
  if (remoteIp && remoteIp !== 'unknown') {
    formData.set('remoteip', remoteIp);
  }
  formData.set('idempotency_key', crypto.randomUUID());

  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      return {
        ok: false,
        resetRequired: true,
        errorMessage:
          'No se pudo validar el desafío de seguridad en este momento. Intentá nuevamente o continuá por WhatsApp.',
        errorCodes: [`http-${response.status}`],
      };
    }

    const payload = (await response.json()) as TurnstileSiteverifyResponse;
    const errorCodes = Array.isArray(payload?.['error-codes']) ? payload['error-codes'] : [];

    if (payload?.success !== true) {
      const isExpiredOrDuplicate = errorCodes.includes('timeout-or-duplicate');
      return {
        ok: false,
        resetRequired: true,
        errorMessage: isExpiredOrDuplicate
          ? 'La verificación de seguridad venció o ya fue utilizada. Por favor volvé a marcar la casilla e intentá de nuevo.'
          : 'No se pudo verificar el desafío antibots. Por favor reintentá o escribinos por WhatsApp.',
        errorCodes,
      };
    }

    // Validar que el hostname devuelto por Siteverify pertenezca al entorno actual
    if (!isTurnstileHostnameAllowed(payload.hostname, env)) {
      return {
        ok: false,
        resetRequired: true,
        errorMessage:
          'No se pudo validar el origen del desafío de seguridad. Por favor recargá la página o escribinos por WhatsApp.',
        errorCodes: [payload.hostname ? 'invalid-hostname' : 'missing-hostname'],
      };
    }

    // Validar que la acción del widget coincida exactamente con la esperada (ticket_submit)
    const expectedAction = (env.TURNSTILE_EXPECTED_ACTION || EXPECTED_TURNSTILE_ACTION).trim();
    const actualAction = (payload.action || '').trim();
    if (actualAction !== expectedAction) {
      return {
        ok: false,
        resetRequired: true,
        errorMessage:
          'No se pudo validar la acción de seguridad del formulario. Por favor reintentá o continuá por WhatsApp.',
        errorCodes: [actualAction ? 'invalid-action' : 'missing-action'],
      };
    }

    return {
      ok: true,
      resetRequired: false,
    };
  } catch {
    return {
      ok: false,
      resetRequired: true,
      errorMessage:
        'Error de comunicación al validar la protección antibots. Tus datos siguen cargados: podés intentar de nuevo o continuar por WhatsApp.',
      errorCodes: ['siteverify-network-error'],
    };
  }
}
