import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { companyInfo, whatsappMessage } from '../data/mock';
import './PremiumIntro.css';

const links = [
  ['#servicios', 'Servicios'], ['#planes', 'Precios'],
  ['#faq', 'FAQ'], ['#contacto', 'Contacto'], ['/ticket', 'Tickets'],
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const header = useRef(null);
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onOutside = (event) => {
      if (!header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  return (
    <header className="otx-premium-header" ref={header}>
      <a className="otx-skip" href="#intro-title">Saltar al contenido</a>
      <div className="otx-header-inner">
        <a className="otx-wordmark" href="/">
          <span className="otx-monogram">otx<ArrowUpRight size={25} aria-hidden="true" /></span>
          <span className="otx-wordmark-sub">SOLUTIONS<br /><span>Soporte IT remoto</span></span>
        </a>
        <nav className="otx-desktop-nav" aria-label="Navegación principal">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="otx-header-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Hablemos <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">por WhatsApp (abre otra pestaña)</span>
        </a>
        <button ref={toggle} type="button" className="otx-menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}
          aria-controls="otx-mobile-nav" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav id="otx-mobile-nav" className="otx-mobile-nav" aria-label="Navegación móvil" hidden={!open}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Consultar por WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></a>
      </nav>
    </header>
  );
};
export default Header;
