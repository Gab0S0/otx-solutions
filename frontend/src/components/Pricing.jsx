import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { companyInfo, condicionesGenerales } from '../data/mock';
import { offerCategories, planValue, paymentLink, scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const PAYMENT_LINK = paymentLink(process.env.REACT_APP_MERCADOPAGO_PAYMENT_LINK);

const notes = {
  particulares:
    'Cada asistencia incluye diagnóstico y resolución remota de un caso principal de hasta 1 hora. Si requiere más tiempo, se informa el avance y se cotiza una extensión antes de continuar. Las tareas distintas se coordinan como una nueva asistencia o extensión.',
  pymes:
    'Las asistencias no utilizadas no se acumulan. Los planes cubren puestos de trabajo registrados. Cada período mensual equivale a 30 días desde la activación.',
  m365:
    'Más de 10 usuarios se cotiza a medida. No incluye licencias Microsoft; puede adquirirlas el cliente o podemos acompañar la gestión.',
};

const modeMeta = {
  particulares: {
    index: '01',
    title: 'Soporte puntual',
    meta: 'Personas y profesionales',
  },
  pymes: {
    index: '02',
    title: 'Abonos mensuales',
    meta: 'Empresas · Desde $120.000/mes',
  },
  m365: {
    index: '03',
    title: 'Proyectos y Microsoft 365',
    meta: 'Desde $85.000 · A cotizar',
  },
};

const planKicker = (categoryValue, planId) => {
  if (categoryValue === 'particulares') {
    return planId === 1 ? 'Intervención puntual · 1 sesión' : 'Pack Ahorro · 5 asistencias remotas';
  }
  if (categoryValue === 'pymes') {
    if (planId === 1) return 'Hasta 3 puestos de trabajo';
    if (planId === 2) return 'Hasta 6 puestos · Prioridad operativa';
    return 'Más de 6 puestos · Alcance a medida';
  }
  if (planId === 1) return 'Puesta en marcha · Hasta 10 usuarios';
  if (planId === 2) return 'Administración continua · Hasta 10 usuarios';
  return 'Archivos y permisos · Pago único';
};

const PriceFigure = ({ plan, from = false, isChampagne = false }) => {
  const numeric = plan.price.includes('$');
  const startsFrom = from || plan.price.startsWith('Desde ');
  const monthly = plan.period || (plan.price.endsWith('/mes') ? '/mes' : '');
  const number = plan.price.replace('Desde ', '').replace('$', '').replace('/mes', '');

  return (
    <span className={`offer-price-figure ${isChampagne ? 'is-champagne' : ''}`}>
      {numeric && <small>{startsFrom ? 'Desde ARS' : 'ARS'}</small>}
      <strong>{number}</strong>
      {monthly && <span>{monthly}</span>}
    </span>
  );
};

const Pricing = () => {
  const [category, setCategory] = useState('particulares');

  useEffect(() => {
    const selectCategory = ({ detail }) => {
      if (offerCategories.some((item) => item.value === detail)) setCategory(detail);
    };
    window.addEventListener('otx:select-plan-category', selectCategory);
    return () => window.removeEventListener('otx:select-plan-category', selectCategory);
  }, []);

  const prefill = (value, plan) =>
    window.dispatchEvent(
      new CustomEvent('prefillContactForm', {
        detail: {
          plan: planValue(value, plan),
          asunto: `Interesado en: ${planValue(value, plan)}`,
          tipo: value === 'particulares' ? 'particular' : 'pyme',
        },
      })
    );

  return (
    <section id="planes" className="otx-offer offer-pricing" aria-labelledby="offer-pricing-title">
      <div className="offer-container">
        <div className="offer-price-heading">
          <div>
            <p className="offer-eyebrow">Precios en ARS</p>
            <h2 id="offer-pricing-title">
              Modalidades <span>y precios.</span>
            </h2>
          </div>
          <p>
            Elegí entre una asistencia puntual, un abono mensual para los puestos de tu negocio o un
            proyecto con alcance definido antes de empezar.
          </p>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="offer-price-root">
          <TabsList className="offer-segmented-nav" aria-label="Modalidades de contratación">
            {offerCategories.map((item) => {
              const meta = modeMeta[item.value];
              return (
                <TabsTrigger className="offer-seg-tab" key={item.value} value={item.value}>
                  <span className="offer-seg-left">
                    <span className="offer-seg-num">{meta.index}</span>
                    <span className="offer-seg-label">{meta.title}</span>
                  </span>
                  <span className="offer-seg-meta">{meta.meta}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {offerCategories.map((item) => {
            const isParticulares = item.value === 'particulares';

            return (
              <TabsContent value={item.value} key={item.value} className="offer-category-panel">
                <div className={isParticulares ? 'offer-diptych-grid' : 'offer-triptych-grid'}>
                  {item.plans.map((option) => {
                    const isPackAhorro = isParticulares && option.id === 2;
                    const isMiddleTier =
                      (item.value === 'pymes' && option.id === 2) ||
                      (item.value === 'm365' && option.id === 1);
                    const value = planValue(item.value, option);
                    const whatsapp = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
                      `Hola, quiero consultar por ${value}. Me gustaría confirmar disponibilidad y alcance.`
                    )}`;
                    const kicker = planKicker(item.value, option.id);

                    if (isPackAhorro) {
                      return (
                        <article key={option.id} className="offer-plan-card is-champagne-card">
                          <div className="offer-champagne-strip">
                            <span className="offer-champagne-kicker">{kicker}</span>
                            <span className="offer-champagne-badge">Ahorrás $10.000</span>
                          </div>

                          <div className="offer-champagne-body">
                            <div>
                              <div className="offer-card-title-row">
                                <h3>{option.name}</h3>
                                <span className="offer-validity-tag">Válido por 3 meses</span>
                              </div>
                              <p className="offer-card-desc">{option.description}</p>

                              <div className="offer-price-box is-champagne-box">
                                <PriceFigure plan={option} isChampagne />
                                <p className="offer-price-equivalence">
                                  <strong>Equivale a $18.000 por asistencia</strong>
                                  <span>Ahorrás $10.000 frente a contratarlas por separado</span>
                                </p>
                              </div>

                              <ul className="offer-card-features is-two-col">
                                {option.features.map((feature) => (
                                  <li key={feature}>
                                    <Check size={15} aria-hidden="true" className="is-champagne-check" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="offer-card-actions is-champagne-actions">
                              <a
                                className="offer-btn-champagne"
                                href={whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => prefill(item.value, option)}
                              >
                                Consultar Pack 5 por WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
                                <span className="sr-only"> (abre otra pestaña)</span>
                              </a>
                              <div className="offer-card-sublinks">
                                <button
                                  type="button"
                                  className="offer-text-link"
                                  onClick={() => {
                                    prefill(item.value, option);
                                    scrollToContact();
                                  }}
                                >
                                  Continuar en Contacto
                                </button>
                                <Link
                                  className="offer-text-link"
                                  to={`/ticket?${new URLSearchParams({ plan: value })}`}
                                >
                                  Abrir ticket
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    }

                    return (
                      <article
                        key={option.id}
                        className={`offer-plan-card ${isMiddleTier ? 'is-middle-tier' : ''}`}
                      >
                        <div>
                          <p className={`offer-card-kicker ${isMiddleTier ? 'is-green' : ''}`}>
                            {kicker}
                          </p>
                          <div className="offer-card-title-row">
                            <h3>{option.name}</h3>
                          </div>

                          {(option.asistencias || option.puestos) && (
                            <div className="offer-scope-badges">
                              {option.asistencias && (
                                <span className="offer-scope-badge">{option.asistencias}</span>
                              )}
                              {option.puestos && (
                                <span className="offer-scope-badge">{option.puestos}</span>
                              )}
                            </div>
                          )}

                          <p className="offer-card-desc">{option.description}</p>

                          <div className="offer-price-box">
                            <PriceFigure
                              plan={option}
                              from={isParticulares && option.id === 1}
                            />
                            {isParticulares && option.id === 1 && (
                              <p className="offer-price-equivalence">
                                <span>1 caso principal</span>
                                <small>Hasta 1 hora de trabajo remoto</small>
                              </p>
                            )}
                          </div>

                          <ul className="offer-card-features">
                            {option.features.map((feature) => (
                              <li key={feature}>
                                <Check size={15} aria-hidden="true" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="offer-card-actions">
                          <a
                            className={`offer-btn-card ${isMiddleTier ? 'is-solid-green' : ''}`}
                            href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => prefill(item.value, option)}
                          >
                            Consultar por WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
                            <span className="sr-only"> (abre otra pestaña)</span>
                          </a>
                          <div className="offer-card-sublinks">
                            <button
                              type="button"
                              className="offer-text-link"
                              onClick={() => {
                                prefill(item.value, option);
                                scrollToContact();
                              }}
                            >
                              Continuar en Contacto
                            </button>
                            <Link
                              className="offer-text-link"
                              to={`/ticket?${new URLSearchParams({ plan: value })}`}
                            >
                              Abrir ticket
                            </Link>
                            {isParticulares && option.id === 1 && PAYMENT_LINK && (
                              <a
                                className="offer-text-link"
                                href={PAYMENT_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Pagar con Mercado Pago
                                <span className="sr-only"> (abre otra pestaña)</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <details className="offer-conditions">
                  <summary>
                    <span>
                      <strong>Alcance, extras y condiciones</strong> ·{' '}
                      {isParticulares
                        ? 'Cada asistencia cubre 1 caso principal de hasta 1 hora remota.'
                        : item.value === 'pymes'
                        ? 'Las asistencias no utilizadas no se acumulan. Períodos de 30 días.'
                        : 'Más de 10 usuarios se cotiza a medida. No incluye licencias Microsoft.'}
                    </span>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <div>
                    <p>{notes[item.value]}</p>
                    {item.extras.length > 0 && (
                      <dl>
                        {item.extras.map((extra) => (
                          <div key={extra.concepto}>
                            <dt>{extra.concepto}</dt>
                            <dd>{extra.precio}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <p>{condicionesGenerales}</p>
                  </div>
                </details>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
