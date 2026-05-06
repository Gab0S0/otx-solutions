import React from 'react';
import { Check, User, Building2, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  planesParticulares,
  planesPymes,
  planesM365,
  condicionesGenerales,
  companyInfo
} from '../data/mock';

const Pricing = () => {
  const scrollToContactWithPlan = (planName, openWhatsApp = false) => {
    window.dispatchEvent(
      new CustomEvent('prefillContactForm', {
        detail: {
          plan: planName,
          asunto: `Interesado en: ${planName}`
        }
      })
    );

    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (openWhatsApp) {
      const msg = `Hola, estoy interesado en el ${planName}.%0A%0AMe gustaría recibir más información.%0A%0AGracias.`;
      const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${msg}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 300);
    }
  };

  return (
    <section id="planes" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">
            Planes y Precios
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            Elegí el plan que mejor se adapte
          </h2>

          <p className="text-otx-text/70 text-lg">
            Soporte IT remoto para personas, profesionales independientes y pymes.
            Sin letra chica.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="particulares" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-otx-gray p-1 rounded-xl">
            <TabsTrigger
              value="particulares"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-otx-bordo rounded-lg"
            >
              <User size={18} />
              <span className="hidden sm:inline">Personas</span>
            </TabsTrigger>

            <TabsTrigger
              value="pymes"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-otx-bordo rounded-lg"
            >
              <Building2 size={18} />
              <span className="hidden sm:inline">Pymes</span>
            </TabsTrigger>

            <TabsTrigger
              value="m365"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-otx-bordo rounded-lg"
            >
              <Cloud size={18} />
              <span className="hidden sm:inline">M365</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="particulares">
            <PlanesParticulares onSelectPlan={scrollToContactWithPlan} />
          </TabsContent>

          <TabsContent value="pymes">
            <PlanesPymes onSelectPlan={scrollToContactWithPlan} />
          </TabsContent>

          <TabsContent value="m365" id="planes-m365">
            <PlanesM365 onSelectPlan={scrollToContactWithPlan} />
          </TabsContent>
        </Tabs>

        {/* Condiciones Generales */}
        <div className="mt-12 bg-otx-gray rounded-xl p-6">
          <p className="text-sm text-otx-text/70 text-center">
            {condicionesGenerales}
          </p>
        </div>
      </div>
    </section>
  );
};

const PlanesParticulares = ({ onSelectPlan }) => {
  return (
    <div className="space-y-12">
      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {planesParticulares.planes.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular
                ? 'border-otx-bordo shadow-lg md:scale-105'
                : 'border-otx-gray hover:border-otx-bordo/30'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-otx-bordo text-white text-sm font-medium px-4 py-1 rounded-full">
                Más elegido
              </div>
            )}

            <h3 className="text-xl font-bold text-otx-text mb-2">
              {plan.name}
            </h3>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-otx-bordo">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-otx-text/60">{plan.period}</span>
              )}
            </div>

            <p className="text-otx-text/70 text-sm mb-6">
              {plan.description}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    className="text-otx-bordo flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-otx-text/80 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                onSelectPlan(`${plan.name} - ${plan.price}${plan.period}`)
              }
              className={`w-full ${
                plan.popular
                  ? 'bg-otx-bordo hover:bg-otx-bordo-light text-white'
                  : 'bg-otx-gray hover:bg-otx-bordo hover:text-white text-otx-text'
              }`}
            >
              Contratar
            </Button>
          </div>
        ))}
      </div>

      {/* Alcance */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-otx-text mb-3">
          Alcance de las asistencias
        </h4>

        <p className="text-sm text-otx-text/70 leading-relaxed">
          Cada asistencia incluye diagnóstico y resolución remota de problemas
          comunes dentro de una intervención de hasta 1 hora. Si el caso requiere
          más tiempo, se informa el avance y se cotiza una extensión antes de
          continuar.
        </p>
      </div>

      {/* Extras */}
      <div className="bg-otx-gray rounded-xl p-6 max-w-4xl mx-auto">
        <h4 className="font-semibold text-otx-text mb-4">Extras</h4>

        <div className="grid sm:grid-cols-3 gap-4">
          {planesParticulares.extras.map((extra, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white rounded-lg p-4"
            >
              <span className="text-otx-text/80 text-sm">
                {extra.concepto}
              </span>
              <span className="font-semibold text-otx-bordo">
                {extra.precio}
              </span>
            </div>
          ))}
        </div>

        <p className="text-otx-text/60 text-xs mt-4">
          La asistencia remota cubre un incidente o tarea principal. Si durante
          la sesión surge una tarea distinta, se coordina como una nueva
          asistencia o extensión.
        </p>
      </div>
    </div>
  );
};

const PlanesPymes = ({ onSelectPlan }) => {
  return (
    <div className="space-y-12">
      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {planesPymes.planes.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
              plan.popular
                ? 'border-otx-bordo shadow-lg'
                : 'border-otx-gray hover:border-otx-bordo/30'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-otx-bordo text-white text-sm font-medium px-4 py-1 rounded-full">
                Recomendado
              </div>
            )}

            <h3 className="text-2xl font-bold text-otx-text mb-2">
              {plan.name}
            </h3>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-otx-bordo">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-otx-text/60">{plan.period}</span>
              )}
            </div>

            <p className="text-otx-text/70 text-sm mb-5">
              {plan.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-otx-bordo/10 text-otx-bordo text-sm px-3 py-1 rounded-full">
                {plan.asistencias}
              </span>
              <span className="bg-otx-gray text-otx-text/70 text-sm px-3 py-1 rounded-full">
                {plan.puestos}
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    className="text-otx-bordo flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <span className="text-otx-text/80 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                onSelectPlan(`${plan.name} - ${plan.price}${plan.period}`)
              }
              className={`w-full ${
                plan.popular
                  ? 'bg-otx-bordo hover:bg-otx-bordo-light text-white'
                  : 'bg-otx-gray hover:bg-otx-bordo hover:text-white text-otx-text'
              }`}
            >
              Solicitar información
            </Button>
          </div>
        ))}
      </div>

      {/* Extras */}
      <div className="bg-otx-gray rounded-xl p-6 max-w-6xl mx-auto">
        <h4 className="font-semibold text-otx-text mb-4">Excedentes</h4>

        <div className="grid sm:grid-cols-3 gap-4">
          {planesPymes.extras.map((extra, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white rounded-lg p-4"
            >
              <span className="text-otx-text/80 text-sm">
                {extra.concepto}
              </span>
              <span className="font-semibold text-otx-bordo">
                {extra.precio}
              </span>
            </div>
          ))}
        </div>

        <p className="text-otx-text/60 text-xs mt-4">
          Las asistencias no utilizadas no se acumulan. Los planes pyme cubren
          puestos de trabajo registrados. El mes equivale a 30 días desde la
          fecha de activación.
        </p>
      </div>
    </div>
  );
};

const PlanesM365 = ({ onSelectPlan }) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {planesM365.map((plan) => (
          <div
            key={plan.id}
            className="bg-gradient-to-br from-otx-dark to-otx-dark/90 rounded-2xl p-8 border border-white/10 hover:border-otx-bordo/50 transition-all duration-300 hover:shadow-xl"
          >
            <div className="w-12 h-12 bg-otx-bordo/20 rounded-xl flex items-center justify-center mb-6">
              <Cloud className="text-otx-bordo" size={24} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {plan.name}
            </h3>

            <p className="text-2xl font-bold text-otx-bordo mb-4">
              {plan.price}
            </p>

            <p className="text-otx-gray-light text-sm mb-6">
              {plan.description}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check
                    className="text-otx-bordo flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <span className="text-otx-gray-light text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSelectPlan(`Microsoft 365 - ${plan.name}`)}
              className="w-full bg-otx-bordo hover:bg-otx-bordo-light text-white"
            >
              Consultar
            </Button>
          </div>
        ))}
      </div>

      <p className="text-center text-otx-text/60 text-sm">
        Más de 10 usuarios se cotiza a medida. No incluye licencias Microsoft;
        puede adquirirlas el cliente o podemos acompañar la gestión.
      </p>
    </div>
  );
};

export default Pricing;
