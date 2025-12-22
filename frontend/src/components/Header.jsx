import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { companyInfo, whatsappMessage } from '../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#planes', label: 'Planes' },
    { href: '#como-funciona', label: 'Cómo Funciona' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' }
  ];

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-otx-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-otx-bordo rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">OTX</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-semibold text-lg">OTX Solutions</span>
              <p className="text-otx-gray-light text-xs -mt-1">Soporte IT Remoto</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-otx-gray-light hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-otx-bordo hover:bg-otx-bordo-light text-white gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-otx-bordo/30">
                <Phone size={18} />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-otx-dark/95 backdrop-blur-md border-t border-white/10 py-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-otx-gray-light hover:text-white hover:bg-white/5 px-4 py-3 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-otx-bordo hover:bg-otx-bordo-light text-white gap-2">
                    <Phone size={18} />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
