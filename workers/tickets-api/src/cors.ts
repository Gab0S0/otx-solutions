import type { Env } from './types.ts';

const DEFAULT_PROD_ORIGINS = [
  'https://otxsolutions.com.ar',
  'https://www.otxsolutions.com.ar',
];

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8788',
];

export function parseAllowedOrigins(env: Env): string[] {
  const configured = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const isDev = (env.ENVIRONMENT || '').toLowerCase() === 'development' ||
                (env.ENVIRONMENT || '').toLowerCase() === 'test';

  const base = configured.length > 0 ? configured : DEFAULT_PROD_ORIGINS;
  return isDev ? Array.from(new Set([...base, ...DEFAULT_DEV_ORIGINS])) : base;
}

export function isOriginAllowed(originHeader: string | null, env: Env): boolean {
  if (!originHeader) {
    // Allow same-origin or server-side checks only in development/test
    const isDev = (env.ENVIRONMENT || '').toLowerCase() === 'development' ||
                  (env.ENVIRONMENT || '').toLowerCase() === 'test';
    return isDev;
  }

  const normalized = originHeader.trim().replace(/\/+$/, '');
  const allowed = parseAllowedOrigins(env);

  if (allowed.includes(normalized)) {
    return true;
  }

  // Support explicit wildcard pattern for Cloudflare Pages preview subdomains if configured (e.g. https://*.otx-solutions.pages.dev)
  for (const pattern of allowed) {
    if (pattern.startsWith('https://*.')) {
      const suffix = pattern.slice('https://*'.length); // e.g. ".otx-solutions.pages.dev"
      if (normalized.startsWith('https://') && normalized.endsWith(suffix)) {
        const hostPart = normalized.slice('https://'.length, normalized.length - suffix.length);
        if (/^[a-z0-9-]+$/i.test(hostPart)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function buildCorsHeaders(originHeader: string | null, env: Env): Record<string, string> {
  const allowedOrigin =
    originHeader && isOriginAllowed(originHeader, env)
      ? originHeader.trim().replace(/\/+$/, '')
      : parseAllowedOrigins(env)[0] || 'https://otxsolutions.com.ar';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function jsonResponse(
  body: unknown,
  status: number,
  originHeader: string | null,
  env: Env,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      ...buildCorsHeaders(originHeader, env),
      ...extraHeaders,
    },
  });
}
