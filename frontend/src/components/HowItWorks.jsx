import React from 'react';
import { MessageSquare, Search, Wrench, ArrowRight } from 'lucide-react';
import { howItWorks } from '../data/mock';

const iconMap = {
  1: MessageSquare,
  2: Search,
  3: Wrench
};

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-otx-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">Proceso</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            Solucionamos tu problema en 3 pasos
          </h2>
          <p className="text-otx-text/70 text-lg">
            Simple, rápido y sin complicaciones. Así trabajamos.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-otx-bordo/20 -translate-y-1/2" />
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {howItWorks.map((step, index) => {
              const IconComponent = iconMap[step.step];
              const isLast = index === howItWorks.length - 1;
              
              return (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-8">
                      <div className="w-8 h-8 bg-otx-bordo rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-otx-bordo/10 rounded-2xl flex items-center justify-center mb-6 mt-2">
                      {IconComponent && (
                        <IconComponent className="text-otx-bordo" size={32} />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-otx-text mb-3">{step.title}</h3>
                    <p className="text-otx-text/70 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Arrow - Desktop */}
                  {!isLast && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 z-20 -translate-y-1/2">
                      <div className="w-8 h-8 bg-otx-bordo rounded-full flex items-center justify-center">
                        <ArrowRight className="text-white" size={18} />
                      </div>
                    </div>
                  )}

                  {/* Arrow - Mobile */}
                  {!isLast && (
                    <div className="md:hidden flex justify-center my-4">
                      <div className="w-8 h-8 bg-otx-bordo/20 rounded-full flex items-center justify-center rotate-90">
                        <ArrowRight className="text-otx-bordo" size={18} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-otx-text/70 mb-4">¿Listo para empezar?</p>
          <a href="#contacto">
            <button className="bg-otx-bordo hover:bg-otx-bordo-light text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-otx-bordo/30 hover:-translate-y-1">
              Contactanos ahora
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
