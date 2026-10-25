import React from 'react';
import { Monitor, Sparkles, Settings, HardDrive, Home, Lightbulb, Cloud } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = {
  Monitor,
  Sparkles,
  Settings,
  HardDrive,
  Home,
  Lightbulb,
  Cloud
};

const Services = () => {
  const handleServiceClick = (serviceName) => {
    // Dispatch event to prefill contact form
    window.dispatchEvent(new CustomEvent('prefillContactForm', {
      detail: {
        servicio: serviceName,
        asunto: `Consulta sobre: ${serviceName}`
      }
    }));

    // Scroll to contact section
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servicios" className="py-24 bg-otx-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">Servicios</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            ¿Qué podemos resolver?
          </h2>
          <p className="text-otx-text/70 text-lg">
            Cubrimos todas las necesidades técnicas de particulares y empresas, 
            siempre de forma remota, rápida y segura.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];
            const isLarge = service.id === 7; // M365 gets special treatment
            
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.title)}
                className={`group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-otx-bordo/20 text-left w-full ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-otx-bordo/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-otx-bordo group-hover:scale-110 transition-all duration-300">
                  {IconComponent && (
                    <IconComponent className="text-otx-bordo group-hover:text-white transition-colors" size={28} />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-otx-text mb-3 group-hover:text-otx-bordo transition-colors">
                  {service.title}
                </h3>
                <p className="text-otx-text/70 leading-relaxed">
                  {service.description}
                </p>

                {/* CTA hint */}
                <span className="inline-block mt-4 text-sm text-otx-bordo opacity-0 group-hover:opacity-100 transition-opacity">
                  Click para consultar →
                </span>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-otx-bordo rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            );
          })}
        </div>

        {/* M365 CTA */}
        <div className="mt-12 bg-gradient-to-r from-otx-dark to-otx-dark/90 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-otx-bordo rounded-2xl flex items-center justify-center flex-shrink-0">
                <Cloud className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Microsoft 365 para Empresas</h3>
                <p className="text-otx-gray-light">
                  Implementación, gestión mensual y configuración de SharePoint/OneDrive.
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                // Scroll to M365 tab in pricing
                const planesSection = document.getElementById('planes');
                if (planesSection) {
                  planesSection.scrollIntoView({ behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('otx:select-plan-category', { detail: 'm365' }));
                }
              }}
              className="flex-shrink-0 bg-otx-bordo hover:bg-otx-bordo-light text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-otx-bordo/30"
            >
              Ver planes M365
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
