import React from 'react';
import { Phone, FileText, Shield, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { companyInfo, whatsappMessage } from '../data/mock';

const Hero = () => {
  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${whatsappMessage}`;

  return (
    <section className="relative min-h-screen flex items-center bg-otx-dark overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #7A0D1A 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-otx-bordo/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-otx-bordo/20 border border-otx-bordo/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-otx-gray-light text-sm">
                Asistencia remota con coordinación previa
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
  Soporte IT remoto para que un{' '}
  <span className="text-otx-bordo">problema técnico no te detenga</span>
</h1>

<p className="text-xl text-otx-gray-light max-w-xl">
  Diagnóstico, configuración y resolución remota de problemas técnicos en
  computadoras, cuentas, correo, programas, impresoras y entornos de trabajo.
  Atención clara, coordinada y profesional.
</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Award className="text-otx-bordo" size={24} />
                <span className="text-white font-semibold">
                  {companyInfo.experience} años
                </span>
                <span className="text-otx-gray-light">de experiencia</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="text-otx-bordo" size={24} />
                <span className="text-white font-semibold">
                  {companyInfo.casesResolved}
                </span>
                <span className="text-otx-gray-light">casos resueltos</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-otx-bordo hover:bg-otx-bordo-light text-white gap-2 text-lg px-8 py-6 transition-all duration-300 hover:shadow-xl hover:shadow-otx-bordo/30 hover:-translate-y-1"
                >
                  <Phone size={22} />
                  Contactanos por WhatsApp
                </Button>
              </a>

              <a href="#contacto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 gap-2 text-lg px-8 py-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <FileText size={22} />
                  Abrir un ticket
                </Button>
              </a>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-otx-bordo rounded-xl flex items-center justify-center">
                    <Shield className="text-white" size={24} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Conexión segura
                    </h3>
                    <p className="text-otx-gray-light text-sm">
                      Acceso remoto solo con tu autorización
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-otx-bordo/20 rounded-xl flex items-center justify-center">
                    <Clock className="text-otx-bordo" size={24} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Atención coordinada
                    </h3>
                    <p className="text-otx-gray-light text-sm">
                      Revisamos el caso y coordinamos la asistencia
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-otx-gray-light text-sm">
  Soporte remoto claro y coordinado
</span>

                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-otx-bordo/30 border-2 border-otx-dark rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-medium">
                            {String.fromCharCode(64 + i)}
                          </span>
                        </div>
                      ))}

                      <div className="w-8 h-8 bg-otx-bordo border-2 border-otx-dark rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">+99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                Consultas abiertas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F5F6F8"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
