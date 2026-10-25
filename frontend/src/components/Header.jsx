import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import './PremiumIntro.css';

const links = [
  ['#planes', 'Personas', 'particulares'], ['#planes', 'Empresas', 'pymes'],
  ['#planes', 'Microsoft 365', 'm365'], ['#planes', 'Precios'],
  ['#contacto', 'Contacto'], ['/ticket', 'Tickets'],
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const header = useRef(null);
  const navigate = (tab) => {
    if (tab) window.dispatchEvent(new CustomEvent('otx:select-plan-category', { detail: tab }));
    setOpen(false);
  };

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
    const desktop = window.matchMedia('(min-width: 1150px)');
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
        <a className="otx-wordmark" href="/" aria-label="otx. — OTXSolutions, inicio">otx<span>.</span></a>
        <nav className="otx-desktop-nav" aria-label="Navegación principal">
          {links.map(([href, label, tab]) => <a key={label} href={href} onClick={() => navigate(tab)}>{label}</a>)}
        </nav>
        <button ref={toggle} type="button" className="otx-menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}
          aria-controls="otx-mobile-nav" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav id="otx-mobile-nav" className="otx-mobile-nav" aria-label="Navegación móvil" hidden={!open}>
        {links.map(([href, label, tab]) => <a key={label} href={href} onClick={() => navigate(tab)}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
      </nav>
    </header>
  );
};
export default Header;
