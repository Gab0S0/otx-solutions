import type { Env } from './types.ts';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Clave secreta oficial de prueba de Cloudflare Turnstile (solo permitida en development/test)
export const TURNSTILE_TEST_SECRET_PASS = '1x0000000000000000000000000000000AA';
export const TURNSTILE_TEST_SECRET_FAIL = '2x0000000000000000000000000000000AA';

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
  const isDevOrTest =
    (env.ENVIRONMENT || '').toLowerCase() === 'development' ||
    (env.ENVIRONMENT || '').toLowerCase() === 'test';

  if (!secretKey) {
    return {
      ok: false,
      resetRequired: false,
      errorMessage:
        'El servicio de verificación de seguridad no está configurado en el servidor. Podés continuar por WhatsApp o correo electrónico.',
      errorCodes: ['missing-input-secret'],
    };
  }

  // En producción, rechazar el uso accidental de la clave dummy de prueba de Cloudflare
  if (!isDevOrTest && secretKey === TURNSTILE_TEST_SECRET_PASS) {
    return {
      ok: false,
      resetRequired: false,
      errorMessage:
        'Configuración de seguridad inválida en producción. Por favor contactanos por WhatsApp.',
      errorCodes: ['invalid-test-secret-in-production'],
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
