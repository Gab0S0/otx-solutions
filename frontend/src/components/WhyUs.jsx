import React from 'react';
import { whyUs } from '../data/mock';
import './PremiumSections.css';

const WhyUs = () => {
  return (
    <section id="por-que-elegirnos" className="otx-section" aria-labelledby="why-us-title">
      <div className="otx-section-container">
        <div className="otx-why-layout">
          <div>
            <p className="otx-eyebrow">Por qué elegirnos</p>
            <h2 id="why-us-title">Criterio técnico y alcance claro.</h2>
            <p className="otx-section-lead">
              Entendemos el problema antes de proponer herramientas, equipos o desarrollos.
            </p>
          </div>

          <div className="otx-pillars-list">
            {whyUs.map((item, idx) => (
              <div key={item.id} className="otx-pillar-row">
                <span className="otx-pillar-index">0{idx + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
