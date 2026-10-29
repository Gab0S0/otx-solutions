import React, { useState } from 'react';
import {
  ArrowUpRight,
  Plus,
  Minus,
  Monitor,
  ShieldCheck,
  GraduationCap,
  Laptop,
  Wrench,
  Building2,
  Globe,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo, services } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const serviceIcons = {
  Monitor,
  ShieldCheck,
  GraduationCap,
  Laptop,
  Wrench,
  Building2,
  Globe,
  Sparkles,
};

const groups = [
  {
    name: 'Asistencia y aprendizaje',
    note: 'Resolvemos problemas en el día, a distancia o en tu domicilio, y te enseñamos a aprovechar tus programas.',
    ids: [1, 2, 3],
  },
  {
    name: 'Equipos, mejoras y reparaciones',
    note: 'Te ayudamos a elegir bien qué comprar y a mejorar o reparar tu computadora actual.',
    ids: [4, 5],
  },
  {
    name: 'Soluciones para negocios y profesionales',
    note: 'Organización del trabajo en equipo, seguridad, páginas web e inteligencia artificial explicadas sin tecnicismos.',
    ids: [6, 7, 8],
  },
];

const Services = () => {
  const [openId, setOpenId] = useState(null);
  const prefill = (service) => window.dispatchEvent(new CustomEvent('prefillContactForm', {
    detail: {
      servicio: service.title,
      asunto: `Consulta sobre: ${service.title}`,
      tipo: service.id === 6 ? 'pyme' : 'particular',
    },
  }));

  return (
    <section id="servicios" className="otx-offer offer-services" aria-labelledby="offer-services-title">
      <div className="offer-container">
        <div className="offer-section-heading">
          <p className="offer-eyebrow">Servicios</p>
          <h2 id="offer-services-title">¿En qué te podemos ayudar hoy?</h2>
          <p>Soluciones explicadas en simple para tu casa, tu estudio o tu negocio.</p>
        </div>
        {groups.map(group => (
          <div className="offer-service-group" key={group.name}>
            <div className="offer-group-intro"><h3>{group.name}</h3><p>{group.note}</p></div>
            <div className="offer-service-list">
              {services.filter(service => group.ids.includes(service.id)).map(service => {
                const open = openId === service.id;
                const Icon = serviceIcons[service.icon] || Monitor;
                const whatsapp = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por ${service.title}. Mi consulta es:`)}`;
                return (
                  <div className="offer-service" key={service.id}>
                    <h4><button type="button" id={`service-trigger-${service.id}`} aria-expanded={open}
                      aria-controls={`service-panel-${service.id}`} onClick={() => setOpenId(open ? null : service.id)}>
                      <span className="offer-service-main">
                        <span className="offer-service-icon" aria-hidden="true">
                          <Icon size={17} strokeWidth={1.75} />
                        </span>
                        <span className="offer-service-copy">
                          <span className="offer-service-title-row">
                            <span className="offer-service-name">{service.title}</span>
                            {service.id === 1 && <span className="offer-service-pill">Principal</span>}
                          </span>
                          <span className="offer-service-hint">{service.hint}</span>
                        </span>
                      </span>
                      {open ? <Minus size={19} aria-hidden="true" /> : <Plus size={19} aria-hidden="true" />}
                    </button></h4>
                    <div id={`service-panel-${service.id}`} className="offer-service-panel" role="region" aria-labelledby={`service-trigger-${service.id}`} hidden={!open}>
                      {open && <>
                      <p>{service.description}</p>
                      <div className="offer-service-actions">
                        <a className="offer-primary" href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => prefill(service)}>Consultar por WhatsApp <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(abre otra pestaña)</span></a>
                        <button className="offer-text-link" type="button" onClick={() => { prefill(service); scrollToContact(); }}>Continuar en Contacto</button>
                        <Link className="offer-text-link" to={`/ticket?${new URLSearchParams({ servicio: service.title })}`}>Abrir ticket</Link>
                      </div>
                      </>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Services;
