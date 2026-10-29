import React, { useState } from 'react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { companyInfo, faqData, whatsappMessage } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumSections.css';

const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  return (
    <section id="faq" className="otx-section" aria-labelledby="faq-title">
      <div className="otx-section-container">
        <div className="otx-faq-layout">
          <div>
            <p className="otx-eyebrow">Preguntas frecuentes</p>
            <h2 id="faq-title">Dudas habituales.</h2>
            <p className="otx-section-lead">
              Respuestas claras sobre asistencia a distancia, visitas, clases, equipos y soluciones para negocios.
            </p>
            <div className="otx-faq-aside-actions">
              <a className="otx-btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                <span className="sr-only">(abre otra pestaña)</span>
              </a>
              <button type="button" className="otx-inline-link" onClick={scrollToContact}>
                Ir a Contacto
              </button>
            </div>
          </div>

          <div className="otx-faq-list">
            {faqData.map((item) => {
              const open = openId === item.id;
              return (
                <div className="otx-faq-item" key={item.id}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-trigger-${item.id}`}
                      className="otx-faq-trigger"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => setOpenId(open ? null : item.id)}
                    >
                      <span className="otx-faq-question">{item.question}</span>
                      {open ? <Minus size={19} aria-hidden="true" /> : <Plus size={19} aria-hidden="true" />}
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${item.id}`}
                    className="otx-faq-panel"
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    hidden={!open}
                  >
                    {open && <p>{item.answer}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
