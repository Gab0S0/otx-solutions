import React from 'react';
import { Award, CheckCircle, Clock, FileText, Wifi } from 'lucide-react';
import { whyUs } from '../data/mock';

const iconMap = {
  Award,
  CheckCircle,
  Clock,
  FileText,
  Wifi
};

const WhyUs = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">Por qué elegirnos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-6">
              ¿Por qué confiar en nosotros?
            </h2>
            <p className="text-otx-text/70 text-lg mb-8">
              No somos una empresa más de soporte. Somos tu socio tecnológico, 
              comprometidos con resolver tus problemas de forma rápida, transparente y profesional.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {whyUs.map((item) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <div key={item.id} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors duration-300">
                      {IconComponent && (
                        <IconComponent className="text-otx-bordo group-hover:text-white transition-colors" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-otx-text mb-1 group-hover:text-otx-bordo transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-otx-text/70">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Stats Card */}
              <div className="bg-otx-dark rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-otx-bordo mb-2">+10</p>
                    <p className="text-otx-gray-light">Años de experiencia</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-otx-bordo mb-2">+1.000</p>
                    <p className="text-otx-gray-light">Casos resueltos</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-otx-gray-light">Satisfacción del cliente</span>
                    <span className="text-white font-semibold">98%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-otx-bordo rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-otx-gray-light">Tiempo promedio de respuesta</span>
                    <span className="text-white font-semibold">&lt;30 min</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-otx-gray">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-otx-text">100% Remoto</p>
                    <p className="text-otx-text/60 text-sm">Sin salir de tu casa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -top-8 -left-8 w-full h-full bg-otx-bordo/10 rounded-2xl -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
