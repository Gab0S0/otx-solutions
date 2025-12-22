import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { companyInfo, whatsappMessage } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#planes', label: 'Planes' },
    { href: '#como-funciona', label: 'Cómo Funciona' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contacto', label: 'Contacto' }
  ];

  return (
    <footer className="bg-otx-dark">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-otx-bordo rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">OTX</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">OTX Solutions</h3>
                <p className="text-otx-gray-light text-sm">{companyInfo.tagline}</p>
              </div>
            </div>
            <p className="text-otx-gray-light mb-6 max-w-md">
              Soporte IT remoto profesional para particulares y pymes en Buenos Aires. 
              Más de 10 años de experiencia resolviendo problemas tecnológicos.
            </p>
            <div className="flex gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-otx-bordo rounded-lg flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="text-white" size={20} />
              </a>
              <a
                href={`mailto:${companyInfo.email}`}
                className="w-10 h-10 bg-white/10 hover:bg-otx-bordo rounded-lg flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="text-white" size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-otx-gray-light hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="text-otx-bordo flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white">WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-otx-gray-light hover:text-white transition-colors text-sm"
                  >
                    +54 9 {companyInfo.whatsapp.slice(3, 5)} {companyInfo.whatsapp.slice(5, 9)}-{companyInfo.whatsapp.slice(9)}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-otx-bordo flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white">Email</p>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-otx-gray-light hover:text-white transition-colors text-sm"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-otx-bordo flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-white">Ubicación</p>
                  <p className="text-otx-gray-light text-sm">{companyInfo.location}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-otx-gray-light text-sm">
              © {currentYear} OTX Solutions. Todos los derechos reservados.
            </p>
            <p className="text-otx-gray-light text-sm">
              Soporte IT Remoto en CABA, Buenos Aires
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
