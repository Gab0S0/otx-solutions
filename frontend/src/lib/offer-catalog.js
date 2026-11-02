import { planesParticulares, planesPymes, planesM365, services } from '../data/mock';

export const offerCategories = [
  { value: 'particulares', label: 'Personas', plans: planesParticulares.planes, extras: planesParticulares.extras },
  { value: 'pymes', label: 'Empresas', plans: planesPymes.planes, extras: planesPymes.extras },
  { value: 'm365', label: 'Microsoft 365', plans: planesM365, extras: [] },
];

export const planValue = (category, plan) => `${category === 'm365' ? 'Microsoft 365 - ' : ''}${plan.name} - ${plan.price}${plan.period || ''}`;

// Keep existing values, including the legacy generic Microsoft 365 option.
export const contactPlanOptions = [
  ...offerCategories.flatMap(({ value, plans }) => plans.map(plan => planValue(value, plan))),
  'Microsoft 365 - Consultar',
];

export const normalizeServiceParam = (raw) => {
  const cleaned = (raw || '').trim();
  if (!cleaned) return '';
  const lower = cleaned.toLowerCase();
  const exact = services.find((s) => s.title.toLowerCase() === lower);
  if (exact) return exact.title;
  const partial = services.find(
    (s) => lower.includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(lower)
  );
  return partial ? partial.title : cleaned;
};

export const normalizePlanParam = (raw) => {
  const cleaned = (raw || '').trim();
  if (!cleaned) return '';
  const lower = cleaned.toLowerCase();
  const exact = contactPlanOptions.find((opt) => opt.toLowerCase() === lower);
  if (exact) return exact;
  const partial = contactPlanOptions.find(
    (opt) => opt.toLowerCase().includes(lower) || lower.includes(opt.toLowerCase())
  );
  return partial || cleaned;
};

export const resolveClientType = (plan, servicio, currentTipo = 'particular') => {
  if (plan && /Empresa|Microsoft 365/i.test(plan)) return 'pyme';
  if (servicio && /empresa|Microsoft 365|Optimización|Automatiz/i.test(servicio)) return 'pyme';
  return currentTipo || 'particular';
};

export const isValidTicketId = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length < 4 || trimmed.length > 64) return false;
  if (/^(n\/a|na|none|null|undefined|false|blocked|error|test|0)$/i.test(trimmed)) return false;
  return /^[A-Z0-9][A-Z0-9-_]{3,63}$/i.test(trimmed);
};

export const buildWhatsAppTicketMessage = (formData = {}, ticketId = null) => {
  const validId = isValidTicketId(ticketId) ? ticketId.trim() : null;
  const lines = [
    validId
      ? `Hola, acabo de registrar el ticket ${validId} en OTX Solutions.`
      : 'Hola, quiero realizar una consulta a OTX Solutions.',
  ];

  const details = [];
  const nombre = (formData.nombre || '').trim();
  const email = (formData.email || '').trim();
  const telefono = (formData.telefono || '').trim();
  const servicio = (formData.servicio || '').trim();
  const plan = (formData.plan || '').trim();
  const asunto = (formData.asunto || '').trim();
  const mensaje = (formData.mensaje || '').trim();

  if (nombre) details.push(`Nombre: ${nombre}`);
  if (email) details.push(`Email: ${email}`);
  if (telefono) details.push(`Teléfono: ${telefono}`);
  if (servicio) details.push(`Servicio: ${servicio}`);
  if (plan) details.push(`Plan: ${plan}`);
  if (asunto) details.push(`Asunto: ${asunto}`);
  if (mensaje) details.push(`Consulta: ${mensaje}`);

  if (details.length > 0) {
    lines.push('', ...details);
  }

  lines.push('', 'Gracias.');
  return lines.join('\n');
};

export const buildWhatsAppUrl = (whatsappNumber, formData = {}, ticketId = null) => {
  const text = buildWhatsAppTicketMessage(formData, ticketId);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
};

export const buildMailtoUrl = (emailAddress, formData = {}) => {
  const plan = (formData.plan || '').trim();
  const servicio = (formData.servicio || '').trim();
  const asunto =
    (formData.asunto || '').trim() ||
    (plan ? `Interesado en: ${plan}` : '') ||
    (servicio ? `Consulta sobre: ${servicio}` : '') ||
    'Consulta web — OTX Solutions';

  const body = buildWhatsAppTicketMessage(formData, null);
  return `mailto:${emailAddress}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(body)}`;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TURNSTILE_DEV_TEST_SITE_KEY = '1x00000000000000000000AA';

export const getTicketsApiBaseUrl = (env = process.env) =>
  ((env?.REACT_APP_TICKETS_API_URL || env?.REACT_APP_BACKEND_URL || '').trim().replace(/\/+$/, ''));

export const getTurnstileSiteKey = (env = process.env) => {
  const configured = (env?.REACT_APP_TURNSTILE_SITE_KEY || '').trim();
  if (configured) return configured;
  return env?.NODE_ENV !== 'production' ? TURNSTILE_DEV_TEST_SITE_KEY : '';
};

export const validateTicketFormData = (
  formData = {},
  { requireSubject = false, requireTurnstile = false, canal = 'TicketWeb' } = {}
) => {
  const nombre = (formData.nombre || '').trim();
  const email = (formData.email || '').trim();
  const telefono = (formData.telefono || '').trim();
  const plan = (formData.plan || '').trim();
  const servicio = (formData.servicio || '').trim();
  const rawAsunto = (formData.asunto || '').trim();
  const mensaje = (formData.mensaje || '').trim();
  const turnstileToken = (formData.turnstileToken || '').trim();

  if (nombre.length < 2) {
    return { valid: false, error: 'Por favor ingresá tu nombre (mínimo 2 caracteres).' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Por favor ingresá un correo electrónico válido.' };
  }

  const resolvedAsunto =
    rawAsunto ||
    (plan ? `Interesado en: ${plan}` : '') ||
    (servicio ? `Consulta sobre: ${servicio}` : '') ||
    (requireSubject ? '' : `Consulta web: ${mensaje.slice(0, 60)}`);

  if (resolvedAsunto.length < 3) {
    return { valid: false, error: 'Por favor ingresá el asunto o motivo de la solicitud (mínimo 3 caracteres).' };
  }

  if (mensaje.length < 10) {
    return { valid: false, error: 'Por favor describí tu consulta con al menos 10 caracteres.' };
  }

  if (requireTurnstile && !turnstileToken) {
    return {
      valid: false,
      error: 'Por favor completá la verificación de seguridad antes de enviar.',
    };
  }

  const resolvedTipo = resolveClientType(plan, servicio, formData.tipo);

  return {
    valid: true,
    payload: {
      nombre: nombre.slice(0, 100),
      email,
      telefono: telefono ? telefono.slice(0, 30) : null,
      tipo: resolvedTipo,
      asunto: resolvedAsunto.slice(0, 200),
      mensaje: mensaje.slice(0, 2000),
      plan: plan ? plan.slice(0, 150) : null,
      servicio: servicio ? servicio.slice(0, 150) : null,
      website: formData.website || '',
      canal,
      turnstileToken: turnstileToken || undefined,
    },
  };
};

export const paymentLink = (value) => {
  try {
    const url = new URL((value || '').trim());
    return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
      /^(?:www\.)?(?:mercadopago\.com\.[a-z]{2}|mpago\.la)$/.test(url.hostname)
      ? url.href : null;
  } catch { return null; }
};

export const scrollToContact = () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const section = document.getElementById('contacto');
  const name = section?.querySelector('input[name="nombre"]');
  const target = name?.closest('form') || section;
  if (target) {
    const headerHeight = document.querySelector('.otx-premium-header')?.getBoundingClientRect().height || 0;
    window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerHeight - 24), behavior: reduce ? 'auto' : 'smooth' });
    name?.focus({ preventScroll: true });
  }
};
