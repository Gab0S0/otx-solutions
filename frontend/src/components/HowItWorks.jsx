import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo, howItWorks, whatsappMessage } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumSections.css';

const HowItWorks = () => {
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  return (
    <section id="como-funciona" className="otx-section" aria-labelledby="how-it-works-title">
      <div className="otx-section-container">
        <div className="otx-steps-header">
          <div>
            <p className="otx-eyebrow">Proceso</p>
            <h2 id="how-it-works-title">Cómo trabajamos.</h2>
          </div>
          <p className="otx-section-lead">
            Tres pasos claros desde tu consulta hasta la solución.
          </p>
        </div>

        <ol className="otx-steps-grid">
          {howItWorks.map((item) => (
            <li key={item.step} className="otx-step-item">
              <span className="otx-step-number">0{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>

        <div className="otx-steps-bar">
          <div className="otx-steps-actions">
            <a className="otx-btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only">(abre otra pestaña)</span>
            </a>
            <button type="button" className="otx-inline-link" onClick={scrollToContact}>
              Ir a Contacto
            </button>
            <Link className="otx-inline-link" to="/ticket">
              Abrir ticket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
