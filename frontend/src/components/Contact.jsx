import { contactPlanOptions } from '../lib/offer-catalog';
import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

const resolveClientType = (plan, servicio, currentTipo) => {
  if (plan && /Empresa|Microsoft 365/i.test(plan)) return 'pyme';
  if (servicio && /empresa|Microsoft 365|Optimización|Automatización/i.test(servicio)) return 'pyme';
  return currentTipo || 'particular';
};

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'particular',
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
      const { plan, servicio, asunto, tipo } = event.detail || {};

      setFormData((prev) => {
        const nextPlan = plan !== undefined ? plan : prev.plan;
        const nextServicio = servicio !== undefined ? servicio : prev.servicio;
        return {
          ...prev,
          plan: nextPlan,
          servicio: nextServicio,
          asunto: asunto || (nextPlan ? `Interesado en: ${nextPlan}` : nextServicio ? `Consulta sobre: ${nextServicio}` : prev.asunto),
          tipo: tipo || resolveClientType(nextPlan, nextServicio, prev.tipo)
        };
      });
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
      msg += `Plan: ${formData.plan}%0A`;
    }

    if (formData.servicio) {
      msg += `Servicio: ${formData.servicio}%0A`;
    }

    msg += `%0AMi consulta es: [DESCRIBIR BREVEMENTE]%0A%0AGracias.`;

    return msg;
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage()}`;

  const ticketLinkParams = new URLSearchParams();
  if (formData.plan) ticketLinkParams.set('plan', formData.plan);
  if (formData.servicio) ticketLinkParams.set('servicio', formData.servicio);
  const ticketHref = ticketLinkParams.toString() ? `/ticket?${ticketLinkParams.toString()}` : '/ticket';

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
    setFormData((prev) => {
      const next = { ...prev, [name]: finalValue };
      if (name === 'plan' && finalValue) {
        next.asunto = `Interesado en: ${finalValue}`;
        next.tipo = resolveClientType(finalValue, next.servicio, next.tipo);
      } else if (name === 'servicio' && finalValue) {
        next.asunto = `Consulta sobre: ${finalValue}`;
        next.tipo = resolveClientType(next.plan, finalValue, next.tipo);
      }
      return next;
    });
    setError(null);
  };

  const clearPrefill = () => {
    setFormData((prev) => ({
      ...prev,
      plan: '',
      servicio: '',
      asunto: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const resolvedAsunto =
      (formData.asunto || '').trim() ||
      (formData.plan ? `Interesado en: ${formData.plan}` : '') ||
      (formData.servicio ? `Consulta sobre: ${formData.servicio}` : '') ||
      `Consulta web: ${formData.mensaje.trim().slice(0, 60)}`;

    const resolvedTipo = resolveClientType(formData.plan, formData.servicio, formData.tipo);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/tickets`, {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || null,
        tipo: resolvedTipo,
        asunto: resolvedAsunto.slice(0, 200),
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

        toast.success('¡Consulta enviada!');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        'Error al enviar la consulta. Por favor intentá de nuevo o escribinos por WhatsApp.';

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
      tipo: 'particular',
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
            <h2 id="contact-title">Hablemos.</h2>
            <p className="otx-section-lead">
              Escribinos por WhatsApp para resolver un problema en el día, coordinar una visita o pedir presupuesto sin compromiso.
            </p>

            <div className="otx-contact-direct">
              <div className="otx-contact-direct-actions">
                <a
                  className="otx-btn-primary"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribir por WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                  <span className="sr-only">(abre otra pestaña)</span>
                </a>
                <Link className="otx-inline-link" to={ticketHref}>
                  Abrir ticket detallado
                </Link>
              </div>
            </div>

            <dl className="otx-contact-meta">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                </dd>
              </div>
              <div>
                <dt>Ubicación</dt>
                <dd>{companyInfo.location}</dd>
              </div>
            </dl>
          </div>

          <div className="otx-form-shell">
            {ticketCreated ? (
              <div className="otx-ticket-success">
                <span className="otx-ticket-badge">
                  <CheckCircle size={16} aria-hidden="true" /> Solicitud registrada
                </span>
                <h3>Consulta recibida</h3>
                <div className="otx-ticket-id-box">
                  <span>Número de ticket</span>
                  <strong>{ticketCreated.id}</strong>
                </div>
                <p className="otx-form-subtitle">
                  Podés continuar por WhatsApp con este número para coordinar más rápido.
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
                    Nueva consulta
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>Dejanos tu mensaje</h3>
                <p className="otx-form-subtitle">
                  Completá tus datos y te respondemos con el alcance o presupuesto.
                </p>

                {(formData.plan || formData.servicio) && (
                  <div className="otx-prefill-pill" role="status" aria-live="polite">
                    <span>
                      <strong>Seleccionado:</strong>
                      {formData.plan || formData.servicio}
                    </span>
                    <button type="button" className="otx-prefill-clear" onClick={clearPrefill}>
                      Quitar
                    </button>
                  </div>
                )}

                {error && (
                  <div className="otx-form-error" role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      <Label htmlFor="nombre" className="otx-label">Nombre *</Label>
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
                        placeholder="11 1234-5678 (opcional)"
                        className="otx-input"
                      />
                    </div>

                    <div className="otx-field">
                      <Label htmlFor="asunto" className="otx-label">Asunto</Label>
                      <Input
                        id="asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        placeholder="Se completa automáticamente o escribilo"
                        className="otx-input"
                      />
                    </div>
                  </div>

                  <div className="otx-field">
                    <Label htmlFor="mensaje" className="otx-label">¿En qué te ayudamos? *</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Contanos brevemente el problema, el equipo que buscás o tu proyecto..."
                      required
                      minLength={10}
                      rows={4}
                      className="otx-textarea"
                    />
                  </div>

                  <details className="otx-form-optional">
                    <summary>
                      Elegir servicio, plan o perfil (opcional) <ChevronDown size={15} aria-hidden="true" />
                    </summary>
                    <div className="otx-form-optional-body space-y-4">
                      <div className="otx-form-grid">
                        <div className="otx-field">
                          <Label htmlFor="servicio" className="otx-label">Servicio</Label>
                          <Select
                            value={formData.servicio || '__empty__'}
                            onValueChange={(value) => handleSelectChange('servicio', value)}
                          >
                            <SelectTrigger id="servicio" aria-label="Servicio" className="otx-select-trigger min-w-0">
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
                          <Label htmlFor="plan" className="otx-label">Plan</Label>
                          <Select
                            value={formData.plan || '__empty__'}
                            onValueChange={(value) => handleSelectChange('plan', value)}
                          >
                            <SelectTrigger id="plan" aria-label="Plan" className="otx-select-trigger min-w-0">
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
                        <Label htmlFor="tipo" className="otx-label">Perfil</Label>
                        <Select
                          value={formData.tipo}
                          onValueChange={(value) => handleSelectChange('tipo', value)}
                        >
                          <SelectTrigger id="tipo" aria-label="Perfil" className="otx-select-trigger">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>

                          <SelectContent className="otx-select-content">
                            <SelectItem className="otx-select-item" value="particular">
                              Particular / Profesional
                            </SelectItem>
                            <SelectItem className="otx-select-item" value="pyme">
                              Empresa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </details>

                  <div className="otx-form-footer">
                    <p className="otx-form-note">
                      Confirmamos alcance antes de avanzar.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="otx-btn-primary"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
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
