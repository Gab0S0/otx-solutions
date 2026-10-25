import React from 'react';
import { Check } from 'lucide-react';
import { whyUs } from '../data/mock';
import './PremiumSections.css';

const commitments = [
  'Alcance y presupuesto confirmados antes de avanzar.',
  'Conexión remota únicamente con autorización y en pantalla.',
  'Revisión sin cargo dentro de las 48 hs sobre el mismo incidente remoto.',
  'Asesoramiento objetivo en hardware, armado y proyectos digitales a medida.',
];

const WhyUs = () => {
  return (
    <section id="por-que-elegirnos" className="otx-section" aria-labelledby="why-us-title">
      <div className="otx-section-container">
        <div className="otx-why-layout">
          <div>
            <p className="otx-eyebrow">Por qué elegirnos</p>
            <h2 id="why-us-title">Criterio técnico y alcance claro.</h2>
            <p className="otx-section-lead">
              Trabajamos con particulares, profesionales y empresas que buscan resolver problemas técnicos reales, elegir bien su equipamiento o modernizar su operación digital sin vueltas.
            </p>

            <div className="otx-scope-card">
              <h3>Condiciones de trabajo transparentes</h3>
              <ul className="otx-scope-list">
                {commitments.map((text) => (
                  <li key={text}>
                    <Check size={16} aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
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
