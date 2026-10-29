import React from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo, services } from '../data/mock';
import { scrollToContact } from '../lib/offer-catalog';
import './PremiumOffer.css';

const supportColumns = [
  {
    heading: 'Cuando algo falla',
    items: [
      {
        title: 'Asistencia remota',
        detail: 'Windows, Office, correo, programas y configuración general.',
        serviceId: 1,
      },
      {
        title: 'Visitas coordinadas',
        detail: 'Domicilio u oficina, con zona, traslado y presupuesto confirmados.',
        serviceId: 1,
      },
      {
        title: 'Impresoras, redes y Wi‑Fi',
        detail: 'Instalación, configuración y diagnóstico de conexión en el lugar o a distancia.',
        serviceId: 1,
      },
    ],
  },
  {
    heading: 'Para que no vuelva a pasar',
    items: [
      {
        title: 'Mantenimiento',
        detail: 'Rendimiento, inicio del sistema, actualizaciones y revisión periódica de equipos.',
        serviceId: 2,
      },
      {
        title: 'Seguridad y respaldo',
        detail: 'Protección de cuentas y dispositivos, copias de seguridad y prevención.',
        serviceId: 2,
      },
      {
        title: 'Soporte mensual para empresas',
        detail: 'Asistencias por mes para los puestos de trabajo registrados de tu negocio.',
        serviceId: 5,
      },
    ],
  },
  {
    heading: 'Cuando hay que equipar',
    items: [
      {
        title: 'Asesoramiento de compra',
        detail: 'Notebooks, PC de escritorio y gamer según uso real y presupuesto.',
        serviceId: 3,
      },
      {
        title: 'Armado y mejoras',
        detail: 'Equipos a medida, discos SSD, memoria RAM y reparaciones según evaluación.',
        serviceId: 3,
      },
      {
        title: 'Oficinas y capacitación',
        detail: 'Puestos completos, monitores, periféricos y capacitación práctica a medida.',
        serviceId: 4,
      },
    ],
  },
];

const projectCapabilities = [
  {
    title: 'Microsoft 365',
    detail: 'Correo profesional, Teams, OneDrive y SharePoint. Cuentas, permisos y seguridad MFA.',
    serviceId: 5,
    tipo: 'pyme',
  },
  {
    title: 'Organización de la información',
    detail: 'Carpetas, planillas y documentos compartidos con un criterio claro que se sostiene.',
    serviceId: 5,
    tipo: 'pyme',
  },
  {
    title: 'Integraciones',
    detail: 'Formularios, correo, planillas y avisos conectados entre sí sin carga duplicada.',
    serviceId: 6,
    tipo: 'pyme',
  },
  {
    title: 'Automatización de tareas',
    detail: 'Registro, clasificación y notificaciones automáticas cuando el proceso lo justifica.',
    serviceId: 7,
    tipo: 'pyme',
  },
  {
    title: 'Sitios web y formularios',
    detail: 'Presencia comercial profesional y consultas que llegan ordenadas a tu equipo.',
    serviceId: 8,
    tipo: 'particular',
  },
  {
    title: 'Inteligencia artificial aplicada',
    detail: 'Asistentes y herramientas de IA (Claude, Copilot o flujos propios) sobre procesos reales.',
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
          tipo: customTipo || (/empresa|Microsoft 365|Optimización|Automatización/i.test(target.title) ? 'pyme' : 'particular'),
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
    'Hola, quiero solicitar asistencia técnica de OTX Solutions. Mi consulta es:'
  )}`;

  return (
    <section id="servicios" className="otx-offer offer-services" aria-labelledby="offer-services-title">
      {/* 1 · Posicionamiento editorial */}
      <div className="a-position">
        <div className="offer-container a-grid">
          <p className="offer-eyebrow a-full">OTX Solutions</p>
          <h2 id="offer-services-title" className="a-statement">
            Primero entendemos cómo trabajás.{' '}
            <span>Después elegimos la tecnología.</span>
          </h2>
          <div className="a-position-foot">
            <p>
              Soporte técnico y proyectos tecnológicos para personas, profesionales y empresas.
              Atención remota inmediata y visitas coordinadas desde CABA.
            </p>
            <nav className="a-chapters" aria-label="Áreas de servicio">
              <a href="#soporte-continuidad">
                <span>01</span>
                <span>Soporte y continuidad</span>
                <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a href="#optimizacion-proyectos">
                <span>02</span>
                <span>Optimización y proyectos</span>
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* 2 · Capítulo 01: Soporte y continuidad (protagonismo comercial) */}
      <div id="soporte-continuidad" className="a-support">
        <div className="offer-container">
          <div className="a-support-head">
            <p className="a-index">
              <span>01</span> Soporte y continuidad
            </p>
            <h3 className="a-display">
              Cuando algo deja de funcionar, lo resolvemos.{' '}
              <em>A distancia o en el lugar.</em>
            </h3>
            <aside className="a-support-cta" aria-label="Solicitar soporte técnico">
              <p>
                Asistencia remota en el día para equipos personales y de oficina. Si el problema requiere
                presencia física, coordinamos la visita con alcance y presupuesto confirmados antes.
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
              <dl className="a-anchor">
                <div>
                  <dt>Asistencia remota</dt>
                  <dd>desde $20.000</dd>
                </div>
                <div>
                  <dt>Abonos para empresas</dt>
                  <dd>desde $120.000/mes</dd>
                </div>
              </dl>
            </aside>
          </div>

          <div className="a-support-index">
            {supportColumns.map((col) => (
              <div className="a-col" key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.items.map((item) => (
                    <li key={item.title}>
                      <button
                        type="button"
                        className="a-item-trigger"
                        onClick={() => handleConsultService(item.serviceId, item.title)}
                      >
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 · Capítulo 02: Optimización, herramientas y proyectos */}
      <div id="optimizacion-proyectos" className="a-opt">
        <div className="offer-container a-grid">
          <p className="a-index a-full">
            <span>02</span> Optimización, herramientas y proyectos
          </p>
          <h3 className="a-question">
            ¿Estás utilizando las <span>herramientas adecuadas</span> para tu trabajo?
          </h3>
          <p className="a-opt-lead">
            Revisamos cómo trabaja tu equipo, qué aplicaciones usa y dónde se pierde tiempo. Con ese
            diagnóstico recomendamos alternativas, las configuramos, las integramos y automatizamos solo
            cuando el proceso lo justifica.
          </p>
          <ol className="a-method">
            <li>
              <span>01</span>Analizamos herramientas y procesos
            </li>
            <li>
              <span>02</span>Recomendamos alternativas concretas
            </li>
            <li>
              <span>03</span>Configuramos e integramos
            </li>
            <li>
              <span>04</span>
              <em>Automatizamos cuando corresponde</em>
            </li>
          </ol>

          <dl className="a-capabilities">
            {projectCapabilities.map((cap) => (
              <div key={cap.title}>
                <dt>
                  <button
                    type="button"
                    className="a-cap-trigger"
                    onClick={() => handleConsultService(cap.serviceId, cap.title, cap.tipo)}
                  >
                    <span>{cap.title}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </dt>
                <dd>{cap.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 4 · Demostración visual de Automatización */}
      <div id="automatizacion" className="a-auto">
        <div className="offer-container">
          <div className="a-auto-head">
            <p className="offer-eyebrow">Automatización</p>
            <h3>
              De horas de trabajo manual <span>a minutos de ejecución.</span>
            </h3>
            <p>
              Un proceso habitual: las consultas llegan por correo, alguien las copia a una planilla y
              avisa a cada responsable. El resultado depende de cada proceso y su viabilidad; por eso
              evaluamos el caso antes de proponer una automatización.
            </p>
          </div>

          <figure className="a-flow" aria-label="Comparación de proceso manual frente a flujo automatizado">
            <div className="a-lane is-manual">
              <p className="a-lane-label">
                Hoy<small>4 pasos, 3 manuales</small>
              </p>
              <ol>
                <li>
                  <span className="a-tag">Llega la consulta</span>
                  <div className="a-art">
                    <b>De</b> consulta entrante
                    <br />
                    <b>Asunto</b> Presupuesto para 3 equipos
                  </div>
                </li>
                <li>
                  <span className="a-tag">Manual</span>
                  <div className="a-art a-art-sheet">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Contacto</th>
                          <th>Pedido</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>—</td>
                          <td>—</td>
                          <td>—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>Alguien copia nombre, contacto y pedido a la planilla.</p>
                </li>
                <li>
                  <span className="a-tag">Manual</span>
                  <div className="a-art a-art-check">
                    <span>Reenviar a Ventas</span>
                    <span>Avisar a Administración</span>
                  </div>
                  <p>Se reenvía el correo y se avisa por separado a cada área.</p>
                </li>
                <li>
                  <span className="a-tag">Manual</span>
                  <p>El seguimiento depende de quién lo recuerde.</p>
                </li>
              </ol>
            </div>

            <div className="a-lane is-auto">
              <p className="a-lane-label">
                Con un flujo automatizado<small>El equipo solo revisa y responde</small>
              </p>
              <ol>
                <li>
                  <span className="a-tag">Llega la consulta</span>
                  <div className="a-art">
                    <b>De</b> consulta entrante
                    <br />
                    <b>Asunto</b> Presupuesto para 3 equipos
                  </div>
                </li>
                <li>
                  <span className="a-tag is-auto">Automático</span>
                  <div className="a-art a-art-sheet">
                    <table>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Contacto</th>
                          <th>Pedido</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="a-dot">10:42</td>
                          <td>consulta@…</td>
                          <td>Presupuesto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>Se registra en la planilla con fecha, contacto y tipo de pedido.</p>
                </li>
                <li>
                  <span className="a-tag is-auto">Automático</span>
                  <div className="a-art a-art-note">Ventas · Nueva consulta de presupuesto</div>
                  <p>El responsable recibe el aviso según el tipo de consulta.</p>
                </li>
                <li>
                  <span className="a-tag is-auto">Automático</span>
                  <div className="a-art a-art-states">
                    <span>Nueva</span>
                    <span className="on">Asignada</span>
                    <span>Respondida</span>
                  </div>
                  <p>Cada consulta queda con estado visible para el equipo.</p>
                </li>
              </ol>
            </div>
            <figcaption>
              Ejemplo ilustrativo de un proceso frecuente. No corresponde a un cliente ni a resultados
              medidos.
            </figcaption>
          </figure>

          <div className="a-auto-foot">
            <button
              type="button"
              className="a-editorial-link"
              onClick={() => {
                prefillByService(automationService, 'Consulta sobre: Automatización de proceso', 'pyme');
                scrollToContact();
              }}
            >
              Contanos qué proceso querés simplificar <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p>Evaluamos la viabilidad y te proponemos un alcance antes de presupuestar.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
