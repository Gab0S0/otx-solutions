import React, { useState } from 'react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo, services } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const groups = [
  { name: 'Soporte y operación IT', note: 'Para equipos personales y entornos de trabajo.', ids: [1, 2, 5] },
  { name: 'Equipamiento y hardware', note: 'Compra inteligente, actualización y diagnóstico físico.', ids: [3, 4] },
  { name: 'Web, formularios e IA', note: 'Sitios comerciales y procesos automatizados.', ids: [6, 7] },
];
const hints = {
  1: 'Servicio principal para particulares y empresas.',
  2: 'Rendimiento, limpieza, inicio de Windows y respaldos.',
  3: 'Notebooks, PC gamer, oficinas completas, monitores y periféricos.',
  4: 'Ensamblado a medida, mejoras de SSD/RAM y servicio técnico.',
  5: 'Correo corporativo, usuarios, seguridad MFA y colaboración.',
  6: 'Sitios rápidos, presentación comercial y captación de consultas.',
  7: 'Asistentes, flujos de trabajo e integraciones a medida.',
};

const Services = () => {
  const [openId, setOpenId] = useState(null);
  const prefill = (service) => window.dispatchEvent(new CustomEvent('prefillContactForm', {
    detail: {
      servicio: service.title,
      asunto: `Consulta sobre: ${service.title}`,
      tipo: service.id === 5 ? 'pyme' : 'particular',
    },
  }));

  return (
    <section id="servicios" className="otx-offer offer-services" aria-labelledby="offer-services-title">
      <div className="offer-container">
        <div className="offer-section-heading">
          <p className="offer-eyebrow">Servicios</p>
          <h2 id="offer-services-title">¿Qué necesitás resolver?</h2>
          <p>Atención remota inmediata y soluciones técnicas a medida.</p>
        </div>
        {groups.map(group => (
          <div className="offer-service-group" key={group.name}>
            <div className="offer-group-intro"><h3>{group.name}</h3><p>{group.note}</p></div>
            <div className="offer-service-list">
              {services.filter(service => group.ids.includes(service.id)).map(service => {
                const open = openId === service.id;
                const whatsapp = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar por ${service.title}. Mi consulta es:`)}`;
                return (
                  <div className="offer-service" key={service.id}>
                    <h4><button type="button" id={`service-trigger-${service.id}`} aria-expanded={open}
                      aria-controls={`service-panel-${service.id}`} onClick={() => setOpenId(open ? null : service.id)}>
                      <span><span className="offer-service-name">{service.title}</span><span className="offer-service-hint">{hints[service.id]}</span></span>
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
