import React from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import { companyInfo, whatsappMessage } from '../data/mock';
import './PremiumIntro.css';

// Original decorative vector: no stock imagery, video or third-party assets.
const ConnectionSculpture = () => (
  <div className="otx-sculpture" aria-hidden="true">
    <svg viewBox="0 0 600 600" fill="none" focusable="false">
      <defs>
        <linearGradient id="otx-metal" x1="140" y1="80" x2="440" y2="530" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CFE4F7" /><stop offset=".25" stopColor="#253B4D" />
          <stop offset=".49" stopColor="#8FE3C0" /><stop offset=".6" stopColor="#14232F" />
          <stop offset=".85" stopColor="#CFE4F7" /><stop offset="1" stopColor="#3C5668" />
        </linearGradient>
        <linearGradient id="otx-edge" x1="200" y1="100" x2="400" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F1F8FF" /><stop offset=".5" stopColor="#CFE4F7" stopOpacity=".1" /><stop offset="1" stopColor="#8FE3C0" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="300" r="248" stroke="#CFE4F7" strokeOpacity=".1" />
      <path d="M300 24v18M300 558v18M24 300h18M558 300h18" stroke="#CFE4F7" strokeOpacity=".45" />
      <g transform="rotate(-32 300 300)">
        <ellipse cx="300" cy="300" rx="147" ry="224" stroke="url(#otx-metal)" strokeWidth="44" />
        <ellipse cx="300" cy="300" rx="170" ry="246" stroke="url(#otx-edge)" />
        <ellipse cx="300" cy="300" rx="123" ry="201" stroke="url(#otx-edge)" />
        <path d="M153 300c0 124 66 224 147 224" stroke="#04070C" strokeOpacity=".4" strokeWidth="12" />
      </g>
      <g transform="rotate(48 300 300)">
        <ellipse cx="300" cy="300" rx="223" ry="74" stroke="url(#otx-metal)" strokeWidth="25" />
        <ellipse cx="300" cy="300" rx="236" ry="87" stroke="url(#otx-edge)" />
      </g>
      <circle cx="300" cy="300" r="5" fill="#8FE3C0" />
      <path d="M292 300h-36M308 300h36" stroke="#8FE3C0" strokeOpacity=".6" />
    </svg>
    <span className="otx-sculpture-caption">CONEXIÓN HUMANA. SOLUCIONES TÉCNICAS.</span>
  </div>
);

const Hero = () => {
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;
  return (
    <section className="otx-premium-hero" aria-labelledby="intro-title">
      <ConnectionSculpture />
      <div className="otx-intro-grid">
        <div className="otx-intro-copy">
          <p className="otx-eyebrow"><span aria-hidden="true" /> SOPORTE REMOTO · PERSONAS Y PYMES</p>
          <h1 id="intro-title" tabIndex={-1}>Tu tecnología,<br />en buenas <em>manos.</em></h1>
          <p className="otx-intro-description">Menos trabas técnicas. Más espacio para lo tuyo. Te ayudamos con tu PC, correo y herramientas de trabajo, estés donde estés.</p>
          <div className="otx-intro-actions">
            <a className="otx-primary-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={19} aria-hidden="true" /> Consultar por WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
              <span className="sr-only">(abre otra pestaña)</span>
            </a>
            <a className="otx-ticket-link" href="/ticket">Abrir un ticket <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <p className="otx-intro-note">Coordinamos el horario. Confirmamos el alcance antes de empezar.</p>
        </div>
      </div>
      <div className="otx-intro-bottom">
        <a className="otx-price" href="#planes"><span>Soporte remoto</span><strong>Desde ARS 20.000</strong></a>
        <a className="otx-price" href="#planes"><span>5 asistencias</span><strong>ARS 90.000</strong></a>
        <a className="otx-explore" href="#servicios"><span>Ver servicios</span><ArrowDown size={22} aria-hidden="true" /></a>
      </div>
    </section>
  );
};
export default Hero;
