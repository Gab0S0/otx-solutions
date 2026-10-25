import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { companyInfo } from '../data/mock';
import './PremiumIntro.css';

const Hero = () => {
  const message = encodeURIComponent('Hola, quiero solicitar asistencia de OTXSolutions. Mi consulta es:');
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${message}`;
  return (
    <section className="otx-premium-hero" aria-labelledby="intro-title">
      <div className="otx-cinema" aria-hidden="true"><div className="otx-cinema-floor" /></div>
      <div className="otx-intro-copy">
        <h1 id="intro-title" tabIndex={-1}><span>Tecnología</span>{' '}<span>sin complicaciones.</span></h1>
        <p className="otx-intro-description">Soporte e infraestructura para personas y empresas.</p>
        <a className="otx-primary-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Solicitar asistencia <ArrowUpRight size={19} aria-hidden="true" />
          <span className="sr-only">por WhatsApp (abre otra pestaña)</span>
        </a>
        <p className="otx-starting-price">Atención remota desde <strong>$20.000</strong></p>
      </div>
      <div className="otx-intro-bottom">
        <a className="otx-pack-link" href="#planes"><span>Pack de 5 asistencias</span><strong>$90.000 <small>ARS</small></strong></a>
        <a className="otx-explore" href="#servicios">Explorar servicios <ArrowDown size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
};
export default Hero;
