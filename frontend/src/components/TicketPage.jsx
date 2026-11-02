import {
  contactPlanOptions,
  normalizeServiceParam,
  normalizePlanParam,
  resolveClientType,
  isValidTicketId,
  buildWhatsAppUrl,
  buildMailtoUrl,
  validateTicketFormData,
} from '../lib/offer-catalog';
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { companyInfo, services } from '../data/mock';
import { toast } from 'sonner';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PremiumIntro.css';
import './PremiumSections.css';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').trim();

const resolveErrorDetail = (err, fallbackMessage) => {
  if (err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message || '')) {
    return 'El servidor tardó demasiado en responder. Tus datos siguen cargados: podés intentar de nuevo o continuar directamente por WhatsApp.';
  }
  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string' && detail.trim()) {
    return detail.trim();
  }
  if (Array.isArray(detail) && detail.length > 0) {
    return 'Revisá los campos completados (nombre, correo electrónico válido, asunto y descripción de al menos 10 caracteres).';
  }
  return fallbackMessage;
};

const TicketPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'particular',
    asunto: '',
    mensaje: '',
    plan: '',
    servicio: '',
    website: '' // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(null);

  // Check URL params for prefill and scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const rawPlan = params.get('plan') || '';
    const rawServicio = params.get('servicio') || '';
    const plan = normalizePlanParam(rawPlan);
    const servicio = normalizeServiceParam(rawServicio);
    if (plan || servicio) {
      setFormData(prev => ({
        ...prev,
        plan,
        servicio,
        tipo: resolveClientType(plan, servicio, prev.tipo),
        asunto: plan ? `Interesado en: ${plan}` : servicio ? `Consulta sobre: ${servicio}` : ''
      }));
    }
  }, []);

  const whatsappUrl = buildWhatsAppUrl(companyInfo.whatsapp, formData);
  const mailtoUrl = buildMailtoUrl(companyInfo.email, formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name, value) => {
    const finalValue = value === '__empty__' ? '' : value;
    setFormData(prev => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) return;

    const validation = validateTicketFormData(formData, {
      requireSubject: true,
      canal: 'TicketWeb',
    });

    if (!validation.valid) {
      setError(validation.error);
      toast.error('Revisá los datos del formulario', {
        description: validation.error,
      });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      if (!BACKEND_URL) {
        throw new Error('Backend no configurado');
      }

      const response = await axios.post(`${BACKEND_URL}/api/tickets`, validation.payload, {
        timeout: 15000,
      });

      const returnedId = response.data?.ticket_id;
      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.success === true &&
        isValidTicketId(returnedId)
      ) {
        setTicketCreated({
          id: returnedId.trim(),
          message: response.data.message
        });
        toast.success('Solicitud registrada');
      } else {
        throw new Error('Respuesta sin confirmación válida de ticket');
      }
    } catch (err) {
      const errorMessage = resolveErrorDetail(
        err,
        'No pudimos registrar el ticket automáticamente en este momento. Tus datos siguen cargados: podés continuar ahora mismo por WhatsApp o correo electrónico.'
      );
      setError(errorMessage);
      toast.error('No se pudo enviar', { description: errorMessage });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const serviceOptions = services.map(s => ({
    value: s.title,
    label: s.title
  }));

  return (
    <div className="otx-ticket-page">
      <header className="otx-ticket-topbar">
        <div className="otx-ticket-topbar-inner">
          <Link className="otx-wordmark" to="/" aria-label="otx. — OTXSolutions, volver al inicio">
            otx<span>.</span>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="otx-btn-primary">
            WhatsApp <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">(abre otra pestaña)</span>
          </a>
        </div>
      </header>

      <main className="otx-ticket-main">
        <div className="otx-ticket-back">
          <Link to="/" className="otx-inline-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>

        {ticketCreated ? (
          <div className="otx-form-shell">
            <div className="otx-ticket-success">
              <span className="otx-ticket-badge">
                <CheckCircle size={16} aria-hidden="true" /> Solicitud registrada
              </span>
              <h1>Ticket creado.</h1>
              <div className="otx-ticket-id-box">
                <span>Tu número de ticket es</span>
                <strong>{ticketCreated.id}</strong>
              </div>
              <p className="otx-form-subtitle">
                Te responderemos por correo electrónico. Si querés coordinar más rápido, podés continuar por WhatsApp.
              </p>
              <div className="otx-steps-actions">
                <a
                  href={buildWhatsAppUrl(companyInfo.whatsapp, formData, ticketCreated.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="otx-btn-primary"
                >
                  Abrir WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                  <span className="sr-only">(abre otra pestaña)</span>
                </a>
                <Link to="/" className="otx-btn-secondary">
                  <ArrowLeft size={16} aria-hidden="true" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="otx-ticket-intro">
              <p className="otx-eyebrow">Tickets</p>
              <h1>Abrir un ticket.</h1>
              <p className="otx-section-lead">
                Contanos con tus palabras qué problema tenés, qué equipo buscás o qué proyecto querés cotizar.
              </p>
            </div>

            <div className="otx-form-shell">
              {error && (
                <div className="otx-form-error" role="alert">
                  <AlertCircle size={18} aria-hidden="true" />
                  <div className="otx-form-error-content">
                    <span>{error}</span>
                    <div className="otx-form-error-actions">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="otx-inline-link"
                      >
                        Continuar por WhatsApp con mis datos <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                      <a href={mailtoUrl} className="otx-inline-link">
                        Enviar por correo electrónico
                      </a>
                    </div>
                  </div>
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
                    <Label htmlFor="ticket-nombre" className="otx-label">Nombre *</Label>
                    <Input
                      id="ticket-nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="otx-input"
                    />
                  </div>
                  <div className="otx-field">
                    <Label htmlFor="ticket-email" className="otx-label">Email *</Label>
                    <Input
                      id="ticket-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Correo electrónico"
                      required
                      className="otx-input"
                    />
                  </div>
                </div>

                <div className="otx-form-grid">
                  <div className="otx-field">
                    <Label htmlFor="ticket-telefono" className="otx-label">Teléfono / WhatsApp</Label>
                    <Input
                      id="ticket-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Teléfono o WhatsApp (opcional)"
                      className="otx-input"
                    />
                  </div>
                  <div className="otx-field">
                    <Label htmlFor="ticket-tipo" className="otx-label">Tipo de cliente *</Label>
                    <Select value={formData.tipo} onValueChange={(v) => handleSelectChange('tipo', v)} required>
                      <SelectTrigger id="ticket-tipo" aria-label="Tipo de cliente" className="otx-select-trigger">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent className="otx-select-content">
                        <SelectItem className="otx-select-item" value="particular">Particular / Profesional</SelectItem>
                        <SelectItem className="otx-select-item" value="pyme">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="otx-form-grid">
                  <div className="otx-field">
                    <Label htmlFor="ticket-servicio" className="otx-label">Servicio</Label>
                    <Select value={formData.servicio || '__empty__'} onValueChange={(v) => handleSelectChange('servicio', v)}>
                      <SelectTrigger id="ticket-servicio" aria-label="Servicio" className="otx-select-trigger min-w-0">
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                      <SelectContent className="otx-select-content">
                        <SelectItem className="otx-select-item" value="__empty__">— Ninguno —</SelectItem>
                        {serviceOptions.map(opt => (
                          <SelectItem className="otx-select-item whitespace-normal break-words" key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="otx-field">
                    <Label htmlFor="ticket-plan" className="otx-label">Plan interesado</Label>
                    <Select value={formData.plan || '__empty__'} onValueChange={(v) => handleSelectChange('plan', v)}>
                      <SelectTrigger id="ticket-plan" aria-label="Plan interesado" className="otx-select-trigger min-w-0">
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                      <SelectContent className="otx-select-content">
                        <SelectItem className="otx-select-item" value="__empty__">— Ninguno —</SelectItem>
                        {contactPlanOptions.map(option => (
                          <SelectItem className="otx-select-item whitespace-normal break-words" key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="otx-field">
                  <Label htmlFor="ticket-asunto" className="otx-label">Asunto *</Label>
                  <Input
                    id="ticket-asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="Motivo de la solicitud"
                    required
                    className="otx-input"
                  />
                </div>

                <div className="otx-field">
                  <Label htmlFor="ticket-mensaje" className="otx-label">Descripción *</Label>
                  <Textarea
                    id="ticket-mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Contanos qué necesitás"
                    required
                    minLength={10}
                    rows={4}
                    className="otx-textarea"
                  />
                </div>

                <div className="otx-form-footer">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="otx-inline-link">
                    ¿Preferís trato directo? Abrir WhatsApp
                  </a>
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
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TicketPage;
