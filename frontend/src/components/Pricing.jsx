import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { companyInfo, condicionesGenerales } from '../data/mock';
import { offerCategories, planValue, paymentLink, scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const PAYMENT_LINK = paymentLink(process.env.REACT_APP_MERCADOPAGO_PAYMENT_LINK);
const notes = {
  particulares: 'Cada asistencia incluye diagnóstico y resolución remota de un caso principal de hasta 1 hora. Si requiere más tiempo, se informa el avance y se cotiza una extensión antes de continuar. Las tareas distintas se coordinan como una nueva asistencia o extensión.',
  pymes: 'Las asistencias no utilizadas no se acumulan. Los planes cubren puestos de trabajo registrados. Cada período mensual equivale a 30 días desde la activación.',
  m365: 'Más de 10 usuarios se cotiza a medida. No incluye licencias Microsoft; puede adquirirlas el cliente o podemos acompañar la gestión.',
};

const Price = ({ plan, from = false }) => {
  const numeric = plan.price.includes('$');
  const startsFrom = from || plan.price.startsWith('Desde ');
  const monthly = plan.period || (plan.price.endsWith('/mes') ? '/mes' : '');
  const number = plan.price.replace('Desde ', '').replace('$', '').replace('/mes', '');
  return <span className="offer-price">{numeric && <small>{startsFrom ? 'Desde ARS' : 'ARS'}</small>}<strong>{number}</strong>{monthly && <span>{monthly}</span>}</span>;
};

const Pricing = () => {
  const [category, setCategory] = useState('particulares');
  const [selection, setSelection] = useState({ particulares: 1, pymes: 1, m365: 1 });
  const selectorRef = useRef(null);

  useEffect(() => {
    const selectCategory = ({ detail }) => { if (offerCategories.some(item => item.value === detail)) setCategory(detail); };
    window.addEventListener('otx:select-plan-category', selectCategory);
    return () => window.removeEventListener('otx:select-plan-category', selectCategory);
  }, []);

  const chooseMode = (nextCategory, planId = null) => {
    setCategory(nextCategory);
    if (planId) {
      setSelection(prev => ({ ...prev, [nextCategory]: planId }));
    }
    const el = selectorRef.current;
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const headerHeight = document.querySelector('.otx-premium-header')?.getBoundingClientRect().height || 0;
      window.scrollTo({
        top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - headerHeight - 24),
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  };

  const prefill = (value, plan) => window.dispatchEvent(new CustomEvent('prefillContactForm', {
    detail: { plan: planValue(value, plan), asunto: `Interesado en: ${planValue(value, plan)}` },
  }));

  return (
    <section id="planes" className="otx-offer offer-pricing" aria-labelledby="offer-pricing-title">
      <div className="offer-container">
        {/* Transición editorial hacia Precios: tres formas de trabajar */}
        <div className="a-modes-head">
          <p className="offer-eyebrow">Precios en ARS</p>
          <h2 id="offer-pricing-title">Tres formas de trabajar con OTX.</h2>
          <p>
            Un problema puntual, soporte continuo para tu negocio o un proyecto con alcance definido.
            Siempre confirmamos el alcance antes de empezar.
          </p>
        </div>

        <div className="a-modes-grid" aria-label="Modalidades de trabajo">
          <article className={`a-mode-card is-lead ${category === 'particulares' ? 'is-active' : ''}`}>
            <p className="a-mode-k">
              Soporte puntual<small>Personas y profesionales</small>
            </p>
            <p className="a-mode-price">
              <small>Desde ARS</small>20.000
            </p>
            <p>Un problema concreto, resuelto en una sesión remota de hasta 1 hora.</p>
            <button
              type="button"
              className="a-pack"
              onClick={() => chooseMode('particulares', 2)}
            >
              <span>Pack Ahorro · 5 asistencias</span>
              <strong>$90.000</strong>
            </button>
            <button
              type="button"
              className="a-editorial-link"
              onClick={() => chooseMode('particulares', 1)}
            >
              Ver opciones <ArrowRight size={15} aria-hidden="true" />
            </button>
          </article>

          <article className={`a-mode-card ${category === 'pymes' ? 'is-active' : ''}`}>
            <p className="a-mode-k">
              Abono mensual<small>Empresas y comercios</small>
            </p>
            <p className="a-mode-price">
              <small>Desde ARS</small>120.000<span>/mes</span>
            </p>
            <p>Asistencias remotas cada mes para los puestos de trabajo registrados de tu negocio.</p>
            <button
              type="button"
              className="a-editorial-link"
              onClick={() => chooseMode('pymes', 1)}
            >
              Comparar planes <ArrowRight size={15} aria-hidden="true" />
            </button>
          </article>

          <article className={`a-mode-card ${category === 'm365' ? 'is-active' : ''}`}>
            <p className="a-mode-k">
              Proyectos a medida<small>Microsoft 365, web, integraciones e IA</small>
            </p>
            <p className="a-mode-price is-text">A cotizar</p>
            <p>
              Alcance y presupuesto definidos antes de empezar. Implementación de Microsoft 365 desde
              $85.000.
            </p>
            <button
              type="button"
              className="a-editorial-link"
              onClick={() => chooseMode('m365', 1)}
            >
              Ver referencias y cotizar <ArrowRight size={15} aria-hidden="true" />
            </button>
          </article>
        </div>

        <div ref={selectorRef} className="a-selector-wrap">
          <Tabs value={category} onValueChange={setCategory} className="offer-price-root">
            <TabsList className="offer-tabs" aria-label="Precios por categoría">
              {offerCategories.map(item => <TabsTrigger className="offer-tab" key={item.value} value={item.value}>{item.label}</TabsTrigger>)}
            </TabsList>
            {offerCategories.map(item => {
              const plan = item.plans.find(p => p.id === selection[item.value]);
              const value = planValue(item.value, plan);
              const whatsapp = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por ${value}. Me gustaría confirmar disponibilidad y alcance.`)}`;
              return (
                <TabsContent value={item.value} key={item.value} className="offer-category-panel">
                  <div className="offer-plan-layout">
                    <fieldset className="offer-plan-options"><legend className="sr-only">Elegí una opción para {item.label}</legend>
                      {item.plans.map(option => {
                        const isPackAhorro = item.value === 'particulares' && option.id === 2;
                        return (
                          <label
                            className={`offer-plan-option ${option.id === plan.id ? 'is-selected' : ''} ${isPackAhorro ? 'is-pack-ahorro' : ''}`}
                            key={option.id}
                          >
                            <input type="radio" name={`offer-plan-${item.value}`} value={option.id} checked={option.id === plan.id}
                              onChange={() => setSelection(previous => ({ ...previous, [item.value]: option.id }))} />
                            <span className="offer-option-body">
                              <span className="offer-option-header">
                                <span className="offer-option-name">{option.name}</span>
                                {isPackAhorro && (
                                  <span className="offer-pack-badge">Pack Ahorro · Ahorrás $10.000</span>
                                )}
                              </span>
                              <Price plan={option} from={item.value === 'particulares' && option.id === 1} />
                              <span className="offer-option-description">{option.description}</span>
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                    <div className="offer-plan-detail">
                      <p className="offer-eyebrow">Qué incluye</p>
                      <h3>{plan.name}</h3>
                      {(plan.asistencias || plan.puestos) && <p className="offer-coverage">{plan.asistencias} · {plan.puestos}</p>}
                      <ul>{plan.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
                    </div>
                  </div>
                  <div className="offer-selection-bar">
                    <p role="status" aria-live="polite"><span>Tu elección</span><strong>{value}</strong></p>
                    <div className="offer-plan-actions">
                      <a className="offer-primary" href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => prefill(item.value, plan)}>Consultar por WhatsApp <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(abre otra pestaña)</span></a>
                      <button type="button" className="offer-text-link" onClick={() => { prefill(item.value, plan); scrollToContact(); }}>Continuar en Contacto</button>
                      <Link className="offer-text-link" to={`/ticket?${new URLSearchParams({ plan: value })}`}>Abrir ticket</Link>
                      {item.value === 'particulares' && plan.id === 1 && PAYMENT_LINK && <a className="offer-text-link" href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">Pagar con Mercado Pago<span className="sr-only"> (abre otra pestaña)</span></a>}
                    </div>
                  </div>
                  <details className="offer-conditions">
                    <summary>Alcance, extras y condiciones <ChevronDown size={18} aria-hidden="true" /></summary>
                    <div><p>{notes[item.value]}</p>
                      {item.extras.length > 0 && <dl>{item.extras.map(extra => <div key={extra.concepto}><dt>{extra.concepto}</dt><dd>{extra.precio}</dd></div>)}</dl>}
                      <p>{condicionesGenerales}</p>
                    </div>
                  </details>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
};
export default Pricing;
