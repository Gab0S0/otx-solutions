import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
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
      msg += 'quiero consultar por soporte IT remoto de OTX Solutions.%0A%0A';
    }

    if (formData.plan) {
      msg += `Plan interesado: ${formData.plan}%0A`;
    }

    if (formData.servicio) {
      msg += `Servicio: ${formData.servicio}%0A`;
    }

    msg += `%0AMi problema es: [DESCRIBIR BREVEMENTE]%0A`;
    msg += `Tipo de equipo: [PC / Notebook / Mac]%0A`;
    msg += `Soy: [Persona / Profesional independiente / Pyme]%0A%0A`;
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
        tipo: formData.tipo,
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
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">
            Contacto
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            ¿Necesitás ayuda?
          </h2>

          <p className="text-otx-text/70 text-lg">
            Contactanos por WhatsApp o abrí un ticket para contarnos el problema
            y coordinar la asistencia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* WhatsApp CTA */}
            <div className="bg-otx-dark rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="text-white" size={28} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    WhatsApp
                  </h3>

                  <p className="text-otx-gray-light mb-4">
                    La forma más directa de contactarnos. Contanos brevemente el
                    problema y coordinamos la asistencia.
                  </p>

                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-500 hover:bg-green-600 text-white gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30">
                      <Phone size={18} />
                      Abrir WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors">
                  <Mail
                    className="text-otx-bordo group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-otx-text mb-1">Email</h4>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-otx-text/70 hover:text-otx-bordo transition-colors"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors">
                  <MapPin
                    className="text-otx-bordo group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-otx-text mb-1">
                    Ubicación
                  </h4>
                  <p className="text-otx-text/70">{companyInfo.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors">
                  <Clock
                    className="text-otx-bordo group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-otx-text mb-1">
                    Atención
                  </h4>
                  <p className="text-otx-text/60">
                    Asistencia remota con coordinación previa
                  </p>
                  <p className="text-otx-text/50 text-sm">
                    Las consultas se responden según disponibilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Form or Success */}
          <div className="bg-otx-gray rounded-2xl p-8">
            {ticketCreated ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={32} />
                </div>

                <h3 className="text-2xl font-bold text-otx-text mb-2">
                  ¡Ticket creado!
                </h3>

                <div className="bg-white rounded-xl p-4 mb-6 inline-block">
                  <p className="text-sm text-otx-text/70 mb-1">
                    Tu número de ticket:
                  </p>
                  <p className="text-3xl font-bold text-otx-bordo">
                    {ticketCreated.id}
                  </p>
                </div>

                <p className="text-otx-text/70 mb-6">
                  Gracias por contactarnos. Podés continuar la conversación por
                  WhatsApp para coordinar la asistencia.
                </p>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage(ticketCreated.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2">
                      <MessageSquare size={18} />
                      Abrir WhatsApp
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="w-full gap-2"
                  >
                    <ArrowLeft size={18} />
                    Enviar otro ticket
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-otx-text mb-6">
                  Abrir un ticket
                </h3>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle
                      className="text-red-500 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <p className="text-red-700 text-sm">{error}</p>
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        required
                        className="bg-white border-otx-gray focus:border-otx-bordo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="juan@email.com"
                        required
                        className="bg-white border-otx-gray focus:border-otx-bordo"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="11 1234-5678"
                        className="bg-white border-otx-gray focus:border-otx-bordo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de cliente *</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) =>
                          handleSelectChange('tipo', value)
                        }
                        required
                      >
                        <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="persona">
                            Persona / Profesional independiente
                          </SelectItem>
                          <SelectItem value="pyme">Pyme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select
                        value={formData.servicio || '__empty__'}
                        onValueChange={(value) =>
                          handleSelectChange('servicio', value)
                        }
                      >
                        <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__empty__">— Ninguno —</SelectItem>
                          {serviceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan interesado</Label>
                      <Select
                        value={formData.plan || '__empty__'}
                        onValueChange={(value) =>
                          handleSelectChange('plan', value)
                        }
                      >
                        <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__empty__">— Ninguno —</SelectItem>
                          <SelectItem value="Asistencia Remota - $50.000">
                            Asistencia Remota - $50.000
                          </SelectItem>
                          <SelectItem value="Pack 5 Asistencias - $220.000">
                            Pack 5 Asistencias - $220.000
                          </SelectItem>
                          <SelectItem value="Pyme Inicial - $120.000/mes">
                            Pyme Inicial - $120.000/mes
                          </SelectItem>
                          <SelectItem value="Pyme Operativo - $180.000/mes">
                            Pyme Operativo - $180.000/mes
                          </SelectItem>
                          <SelectItem value="Pyme Plus - A cotizar">
                            Pyme Plus - A cotizar
                          </SelectItem>
                          <SelectItem value="Microsoft 365 - Consultar">
                            Microsoft 365 - Consultar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      placeholder="Problema con mi PC / Consulta sobre planes / etc."
                      required
                      className="bg-white border-otx-gray focus:border-otx-bordo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Descripción del problema *</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Describí tu problema o consulta con el mayor detalle posible..."
                      required
                      minLength={10}
                      rows={5}
                      className="bg-white border-otx-gray focus:border-otx-bordo resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-otx-bordo hover:bg-otx-bordo-light text-white gap-2 py-6 transition-all duration-300 hover:shadow-lg hover:shadow-otx-bordo/30"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar ticket
                      </>
                    )}
                  </Button>

                  <p className="text-otx-text/50 text-xs text-center">
                    Te responderemos según disponibilidad. Para coordinar más
                    rápido, también podés contactarnos por WhatsApp.
                  </p>
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
