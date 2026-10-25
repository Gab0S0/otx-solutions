import { planesParticulares, planesPymes, planesM365 } from '../data/mock';

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
