import React from 'react';
import { Link } from 'react-router-dom';
import { companyInfo, whatsappMessage } from '../data/mock';
import './PremiumIntro.css';
import './PremiumSections.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#planes', label: 'Precios' },
    { href: '#como-funciona', label: 'Cómo trabajamos' },
    { href: '#por-que-elegirnos', label: 'Por qué elegirnos' },
    { href: '#faq', label: 'Preguntas frecuentes' },
    { href: '#contacto', label: 'Contacto' }
  ];

  return (
    <footer className="otx-footer">
      <div className="otx-footer-grid">
        <div className="otx-footer-brand">
          <a className="otx-wordmark" href="/" aria-label="otx. — OTXSolutions, inicio">
            otx<span>.</span>
          </a>
          <p>
            Soporte técnico remoto y presencial, capacitación, equipos y soluciones para personas y empresas.
          </p>
        </div>

        <div className="otx-footer-nav-cols">
          <div className="otx-footer-col">
            <h3>Secciones</h3>
            <ul className="otx-footer-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <Link to="/ticket">Abrir ticket</Link>
              </li>
            </ul>
          </div>

          <div className="otx-footer-col">
            <h3>Contacto</h3>
            <ul className="otx-footer-links">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp: +54 9 {companyInfo.whatsapp.slice(3, 5)} {companyInfo.whatsapp.slice(5, 9)}-{companyInfo.whatsapp.slice(9)}
                </a>
              </li>
              <li>
                <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
              </li>
              <li>{companyInfo.location}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="otx-footer-bottom">
        <p>© {currentYear} {companyInfo.name}.</p>
        <p>{companyInfo.location}</p>
      </div>
    </footer>
  );
};

export default Footer;
