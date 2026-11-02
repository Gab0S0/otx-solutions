import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo, services } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const supportSecondary = [
  {
    tag: 'Prevención',
    title: 'Mantenimiento, seguridad y respaldo',
    detail: 'Optimización de inicio y rendimiento en Windows, actualizaciones críticas, protección de cuentas y copias de seguridad.',
    serviceId: 2,
  },
  {
    tag: 'Hardware y puestos',
    title: 'Equipamiento, armado y oficinas',
    detail: 'Selección de notebooks, PC gamer, monitores y periféricos según presupuesto. Armado a medida, mejoras SSD/RAM y reparaciones según evaluación.',
    serviceId: 3,
  },
  {
    tag: 'Continuidad B2B',
    title: 'Soporte mensual para empresas',
    detail: 'Abonos mensuales de asistencia remota para cubrir los puestos registrados de tu negocio, estudio o comercio.',
    serviceId: 5,
    tipo: 'pyme',
  },
];

const optimizationBlocks = [
  {
    index: '02.1',
    title: 'Asesoramiento tecnológico y productividad',
    detail: 'Analizamos qué herramientas utilizás, recomendamos alternativas, las configuramos, organizamos la información y enseñamos el uso práctico de aplicaciones (Windows, Excel, correo e IA) cuando sea necesario.',
    serviceId: 4,
    featured: true,
    tipo: 'particular',
  },
  {
    index: '02.2',
    title: 'Microsoft 365 y entorno empresarial',
    detail: 'Correo corporativo, Teams, OneDrive y SharePoint. Cuentas, permisos por área y seguridad (Entra, Defender e Intune) según licencias y alcance.',
    serviceId: 5,
    tipo: 'pyme',
  },
  {
    index: '02.3',
    title: 'Desarrollo web y formularios',
    detail: 'Páginas web comerciales rápidas y formularios claros que derivan cada consulta a tu WhatsApp, correo o sistema de gestión.',
    serviceId: 8,
    tipo: 'particular',
  },
  {
    index: '02.4',
    title: 'Integraciones, automatización e IA',
    detail: 'Conexión entre aplicaciones, flujos automáticos y asistentes de inteligencia artificial diseñados a medida según la viabilidad del proceso.',
    serviceId: 7,
    tipo: 'pyme',
  },
];

const Services = () => {
  const supportService = services[0];
  const automationService = services[6];

  const prefillByService = (serviceObj, customSubject = null, customTipo = null) => {
    const target = serviceObj || supportService;
    window.dispatchEvent(
      new CustomEvent('prefillContactForm', {
        detail: {
          servicio: target.title,
          asunto: customSubject || `Consulta sobre: ${target.title}`,
          tipo: customTipo || (/empresa|Microsoft 365|Optimización|Automatiz/i.test(target.title) ? 'pyme' : 'particular'),
        },
      })
    );
  };

  const handleConsultService = (serviceId, itemTitle, customTipo = null) => {
    const found = services.find((s) => s.id === serviceId) || supportService;
    prefillByService(found, `Consulta sobre: ${itemTitle || found.title}`, customTipo);
    scrollToContact();
  };

  const supportWhatsapp = `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(
    'Hola, quiero consultar por asistencia técnica en OTX Solutions. Mi consulta es:'
  )}`;

  return (
    <section id="servicios" className="otx-offer offer-services" aria-labelledby="offer-services-title">
      <div className="otx-ambient-texture" aria-hidden="true" />

      {/* 1 · Área 01: Soporte y continuidad tecnológica (Protagonista comercial) */}
      <div id="soporte-continuidad" className="a-support">
        <div className="offer-container">
          <div className="a-support-top">
            <div className="a-support-intro">
              <p className="a-index">
                <span>01</span> Soporte y continuidad tecnológica
              </p>
              <h2 id="offer-services-title" className="a-display">
                Resolvemos incidentes técnicos y mantenemos tus equipos operativos.{' '}
                <em>A distancia o con visitas coordinadas.</em>
              </h2>
            </div>

            <aside className="a-support-cta-box" aria-label="Canal directo de soporte">
              <p className="a-cta-lead">
                Primero entendemos el problema y confirmamos el alcance antes de intervenir.
                Asistencia remota con tu autorización y visitas presenciales según disponibilidad.
              </p>
              <div className="a-support-actions">
                <a
                  className="offer-primary"
                  href={supportWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => prefillByService(supportService)}
                >
                  Solicitar asistencia <ArrowUpRight size={17} aria-hidden="true" />
                  <span className="sr-only">(abre otra pestaña)</span>
                </a>
                <div className="a-support-sublinks">
                  <button
                    type="button"
                    className="offer-text-link"
                    onClick={() => {
                      prefillByService(supportService);
                      scrollToContact();
                    }}
                  >
                    Continuar en Contacto
                  </button>
                  <Link
                    className="offer-text-link"
                    to={`/ticket?${new URLSearchParams({ servicio: supportService.title })}`}
                  >
                    Abrir ticket
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Jerarquía por importancia: bloque protagonista + 3 bloques complementarios */}
          <div className="a-support-bento">
            <article className="a-bento-lead">
              <div className="a-bento-meta">
                <span className="a-pill-green">Servicio principal</span>
                <span className="a-mono-tag">Remoto · Visita a coordinar</span>
              </div>
              <h3>Soporte técnico para particulares, profesionales y oficinas</h3>
              <p>
                Diagnóstico y resolución de fallas en Windows, Office, correo electrónico, impresoras,
                conectividad Wi‑Fi, redes y programas de trabajo. Cuando el caso requiere presencia
                física —instalaciones, cableado o configuración en el lugar—, coordinamos una visita a
                domicilio u oficina confirmando previamente zona, traslado y presupuesto.
              </p>
              <button
                type="button"
                className="a-editorial-link"
                onClick={() => handleConsultService(1, 'Soporte técnico remoto y visitas coordinadas')}
              >
                Coordinar asistencia <ArrowRight size={15} aria-hidden="true" />
              </button>
            </article>

            <div className="a-bento-side">
              {supportSecondary.map((item) => (
                <article className="a-bento-card" key={item.title}>
                  <span className="a-mono-tag">{item.tag}</span>
                  <h4>
                    <button
                      type="button"
                      className="a-card-trigger"
                      onClick={() => handleConsultService(item.serviceId, item.title, item.tipo)}
                    >
                      <span>{item.title}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </h4>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2 · Área 02: Optimización, herramientas y proyectos + Demostración compacta */}
      <div id="optimizacion-proyectos" className="a-opt-slab">
        <div className="offer-container">
          <div className="a-opt-header">
            <p className="a-index">
              <span>02</span> Optimización, herramientas y proyectos
            </p>
            <h2 className="a-question">
              ¿Estás utilizando las <span>herramientas adecuadas</span> para tu trabajo?
            </h2>
            <p className="a-opt-lead">
              No vendemos tecnología por moda: primero analizamos cómo trabajás, recomendamos
              alternativas concretas, las configuramos e integramos para reducir errores manuales y
              mejorar la eficiencia de tu operación.
            </p>
          </div>

          <div className="a-opt-grid">
            {optimizationBlocks.map((block) => (
              <article
                key={block.title}
                className={`a-opt-card ${block.featured ? 'is-featured' : ''}`}
              >
                <span className="a-mono-tag">{block.index}</span>
                <h3>
                  <button
                    type="button"
                    className="a-card-trigger"
                    onClick={() => handleConsultService(block.serviceId, block.title, block.tipo)}
                  >
                    <span>{block.title}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </h3>
                <p>{block.detail}</p>
              </article>
            ))}
          </div>

          {/* 3 · Demostración editorial compacta de Automatización */}
          <div id="automatizacion" className="a-auto-showcase">
            <div className="a-auto-showcase-head">
              <div>
                <p className="offer-eyebrow">Automatización de procesos</p>
                <h3>
                  De horas de trabajo manual <span>a minutos de ejecución.</span>
                </h3>
              </div>
              <p>
                El alcance depende de cada proceso y su viabilidad técnica. Antes de desarrollar,
                evaluamos si la operación justifica automatizarse.
              </p>
            </div>

            <figure
              className="a-auto-board"
              aria-label="Ejemplo ilustrativo de automatización de consultas comerciales"
            >
              <div className="a-board-bar">
                <span>Caso frecuente: recepción y derivación de consultas por correo</span>
                <span className="a-mono-tag">Ejemplo ilustrativo</span>
              </div>

              <div className="a-board-flow" aria-hidden="true">
                <div className="a-flow-node">
                  <span className="a-node-k">Entrada</span>
                  <strong>Correo o formulario</strong>
                </div>
                <span className="a-flow-connector">Registro automático</span>
                <div className="a-flow-node is-active">
                  <span className="a-node-k">Orden</span>
                  <strong>Fila en planilla con fecha y motivo</strong>
                </div>
                <span className="a-flow-connector">Regla de derivación</span>
                <div className="a-flow-node is-active">
                  <span className="a-node-k">Acción</span>
                  <strong>Aviso al responsable asignado</strong>
                </div>
              </div>

              <div className="a-board-matrix">
                <div className="a-matrix-col">
                  <span className="a-mono-tag">01 · Problema habitual</span>
                  <h4>Carga manual duplicada</h4>
                  <p>
                    Alguien lee cada correo, copia nombre, contacto y pedido a una planilla y reenvía
                    mensajes por separado a distintas personas.
                  </p>
                </div>
                <div className="a-matrix-col is-highlight">
                  <span className="a-mono-tag is-green">02 · Qué se automatiza</span>
                  <h4>Registro, clasificación y aviso</h4>
                  <p>
                    La consulta entrante se vuelca sola en la planilla compartida, se clasifica según el
                    asunto y notifica al área que corresponde.
                  </p>
                </div>
                <div className="a-matrix-col">
                  <span className="a-mono-tag">03 · Beneficio concreto</span>
                  <h4>Intervención solo donde aporta valor</h4>
                  <p>
                    Se evita transcribir datos a mano y olvidar seguimientos; el equipo interviene
                    directamente para responder al cliente.
                  </p>
                </div>
              </div>

              <figcaption className="a-board-foot">
                <span>
                  Ejemplo ilustrativo de un flujo administrativo habitual. No representa métricas de un
                  cliente ni promete un resultado idéntico en todos los proyectos.
                </span>
                <button
                  type="button"
                  className="a-editorial-link"
                  onClick={() => {
                    prefillByService(
                      automationService,
                      'Consulta sobre: Evaluación de proceso para automatizar',
                      'pyme'
                    );
                    scrollToContact();
                  }}
                >
                  Evaluar un proceso de mi trabajo <ArrowRight size={15} aria-hidden="true" />
                </button>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
