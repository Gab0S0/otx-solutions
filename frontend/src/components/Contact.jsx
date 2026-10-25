import { contactPlanOptions } from '../lib/offer-catalog';
import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { companyInfo, services } from '../data/mock';
import { toast } from 'sonner';
import axios from 'axios';
import './PremiumSections.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
    asunto: '',
    mensaje: '',
    plan: '',
    servicio: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(null);

  useEffect(() => {
    const handlePrefill = (event) => {
      const { plan, servicio, asunto } = event.detail;

      setFormData((prev) => ({
        ...prev,
        plan: plan || prev.plan,
        servicio: servicio || prev.servicio,
        asunto: asunto || prev.asunto
      }));
    };

    window.addEventListener('prefillContactForm', handlePrefill);
    return () => window.removeEventListener('prefillContactForm', handlePrefill);
  }, []);

  const generateWhatsAppMessage = (ticketId = null) => {
    let msg = 'Hola, ';

    if (ticketId) {
      msg += `acabo de crear el ticket ${ticketId}.%0A%0A`;
    } else {
      msg += 'quiero realizar una consulta a OTX Solutions.%0A%0A';
    }

    if (formData.plan) {
      msg += `Plan interesado: ${formData.plan}%0A`;
    }

    if (formData.servicio) {
      msg += `Servicio: ${formData.servicio}%0A`;
    }

    msg += `%0AMi consulta o necesidad: [DESCRIBIR BREVEMENTE]%0A`;
    msg += `Soy: [Particular / Profesional independiente / Empresa]%0A%0A`;
    msg += `Gracias.`;

    return msg;
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError(null);
  };

  const handleSelectChange = (name, value) => {
    const finalValue = value === '__empty__' ? '' : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue
    }));

    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/tickets`, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || null,
        tipo: formData.tipo || 'particular',
        asunto: formData.asunto,
        mensaje: formData.mensaje,
        plan: formData.plan || null,
        servicio: formData.servicio || null,
        website: formData.website,
        canal: 'Landing'
      });

      if (response.data.success) {
        setTicketCreated({
          id: response.data.ticket_id,
          message: response.data.message
        });

        toast.success('¡Ticket creado!');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        'Error al enviar el ticket. Por favor intentá de nuevo o contactanos por WhatsApp.';

      setError(errorMessage);

      toast.error('Error al enviar', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      tipo: '',
      asunto: '',
      mensaje: '',
      plan: '',
      servicio: '',
      website: ''
    });

    setTicketCreated(null);
  };

  const serviceOptions = services.map((service) => ({
    value: service.title,
    label: service.title
  }));

  return (
    <section id="contacto" className="otx-section" aria-labelledby="contact-title">
      <div className="otx-section-container">
        <div className="otx-contact-layout">
          <div>
            <p className="otx-eyebrow">Contacto</p>
            <h2 id="contact-title">Coordinemos tu consulta.</h2>
            <p className="otx-section-lead">
              Escribinos por WhatsApp para una respuesta directa o dejá registrado un ticket con el detalle de lo que necesitás resolver o cotizar.
            </p>

            <div className="otx-contact-direct">
              <h3>Atención directa por WhatsApp</h3>
              <p>
                Ideal para coordinar asistencias remotas en el día, pedir presupuestos de equipos o consultar por desarrollos a medida.
              </p>
              <a
                className="otx-btn-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                <span className="sr-only">(abre otra pestaña)</span>
              </a>
            </div>

            <dl className="otx-contact-meta">
              <div>
                <dt>Correo electrónico</dt>
                <dd>
                  <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                </dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>{companyInfo.location}</dd>
              </div>
              <div>
                <dt>Modalidad de atención</dt>
                <dd>Soporte remoto con coordinación previa · Evaluación de equipos y proyectos a medida</dd>
              </div>
            </dl>
          </div>

          <div className="otx-form-shell">
            {ticketCreated ? (
              <div className="otx-ticket-success">
                <span className="otx-ticket-badge">
                  <CheckCircle size={16} aria-hidden="true" /> Solicitud registrada
                </span>
                <h3>Ticket creado correctamente</h3>
                <div className="otx-ticket-id-box">
                  <span>Número de ticket</span>
                  <strong>{ticketCreated.id}</strong>
                </div>
                <p className="otx-form-subtitle">
                  Recibimos tu consulta. Si querés agilizar la coordinación, podés continuar por WhatsApp indicando este número.
                </p>
                <div className="otx-steps-actions">
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage(ticketCreated.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="otx-btn-primary"
                  >
                    Continuar por WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                    <span className="sr-only">(abre otra pestaña)</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="otx-btn-secondary"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>Abrir un ticket o solicitar presupuesto</h3>
                <p className="otx-form-subtitle">
                  Completá los datos y te responderemos por correo o WhatsApp con los pasos a seguir.
                </p>

                {error && (
                  <div className="otx-form-error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <Input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="otx-form-grid">
                    <div className="otx-field">
                      <Label htmlFor="nombre" className="otx-label">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        required
                        className="otx-input"
                      />
                    </div>

                    <div className="otx-field">
                      <Label htmlFor="email" className="otx-label">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="juan@email.com"
                        required
                        className="otx-input"
                      />
                    </div>
                  </div>

                  <div className="otx-form-grid">
                    <div className="otx-field">
                      <Label htmlFor="telefono" className="otx-label">Teléfono / WhatsApp</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="11 1234-5678"
                        className="otx-input"
                      />
                    </div>

                    <div className="otx-field">
                      <Label htmlFor="tipo" className="otx-label">Tipo de cliente *</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => handleSelectChange('tipo', value)}
                        required
                      >
                        <SelectTrigger id="tipo" aria-label="Tipo de cliente" className="otx-select-trigger">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>

                        <SelectContent className="otx-select-content">
                          <SelectItem className="otx-select-item" value="particular">
                            Persona / Profesional independiente
                          </SelectItem>
                          <SelectItem className="otx-select-item" value="pyme">
                            Empresa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="otx-form-grid">
                    <div className="otx-field">
                      <Label htmlFor="servicio" className="otx-label">Servicio de interés</Label>
                      <Select
                        value={formData.servicio || '__empty__'}
                        onValueChange={(value) => handleSelectChange('servicio', value)}
                      >
                        <SelectTrigger id="servicio" aria-label="Servicio de interés" className="otx-select-trigger min-w-0 [&>span]:min-w-0">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>

                        <SelectContent className="otx-select-content">
                          <SelectItem className="otx-select-item" value="__empty__">— Ninguno —</SelectItem>
                          {serviceOptions.map((option) => (
                            <SelectItem className="otx-select-item whitespace-normal break-words" key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="otx-field">
                      <Label htmlFor="plan" className="otx-label">Plan interesado</Label>
                      <Select
                        value={formData.plan || '__empty__'}
                        onValueChange={(value) => handleSelectChange('plan', value)}
                      >
                        <SelectTrigger id="plan" aria-label="Plan interesado" className="otx-select-trigger min-w-0 [&>span]:min-w-0">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>

                        <SelectContent className="otx-select-content">
                          <SelectItem className="otx-select-item" value="__empty__">— Ninguno —</SelectItem>
                          {contactPlanOptions.map((option) => (
                            <SelectItem className="otx-select-item whitespace-normal break-words" key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="otx-field">
                    <Label htmlFor="asunto" className="otx-label">Asunto *</Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      placeholder="Ej.: Soporte remoto / Presupuesto de notebook / Página web"
                      required
                      className="otx-input"
                    />
                  </div>

                  <div className="otx-field">
                    <Label htmlFor="mensaje" className="otx-label">Descripción de la consulta *</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Contanos brevemente el problema técnico, el equipo que buscás o el proyecto que querés desarrollar..."
                      required
                      minLength={10}
                      rows={5}
                      className="otx-textarea"
                    />
                  </div>

                  <div className="otx-form-footer">
                    <p className="otx-form-note">
                      El alcance y cualquier costo se confirman antes de iniciar.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="otx-btn-primary"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar ticket'}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
