import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
    website: '' // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Listen for custom events to prefill form
  useEffect(() => {
    const handlePrefill = (event) => {
      const { plan, servicio, asunto } = event.detail;
      setFormData(prev => ({
        ...prev,
        plan: plan || prev.plan,
        servicio: servicio || prev.servicio,
        asunto: asunto || prev.asunto
      }));
    };

    window.addEventListener('prefillContactForm', handlePrefill);
    return () => window.removeEventListener('prefillContactForm', handlePrefill);
  }, []);

  const generateWhatsAppMessage = () => {
    let msg = `Hola, necesito soporte técnico remoto.%0A%0A`;
    if (formData.plan) {
      msg += `Plan interesado: ${formData.plan}%0A`;
    }
    if (formData.servicio) {
      msg += `Servicio: ${formData.servicio}%0A`;
    }
    msg += `%0AMi problema es: [DESCRIBIR BREVEMENTE]%0ATipo de equipo: [PC / Notebook / Mac]%0ASistema operativo: [Windows / macOS / Otro]%0ASoy: [Particular / Pyme]%0A%0A¡Gracias!`;
    return msg;
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        website: formData.website // Honeypot
      });

      if (response.data.success) {
        toast.success('¡Ticket enviado correctamente!', {
          description: response.data.message
        });

        // Reset form
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
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al enviar el ticket. Por favor intentá de nuevo o contactanos por WhatsApp.';
      setError(errorMessage);
      toast.error('Error al enviar', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Service options for dropdown
  const serviceOptions = services.map(s => ({
    value: s.title,
    label: s.title
  }));

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">Contacto</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            ¿Necesitás ayuda?
          </h2>
          <p className="text-otx-text/70 text-lg">
            Contactanos por WhatsApp para respuesta inmediata o abrí un ticket y te respondemos por email.
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
                  <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                  <p className="text-otx-gray-light mb-4">
                    La forma más rápida de contactarnos. Respuesta en menos de 30 minutos en horario laboral.
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
                  <Mail className="text-otx-bordo group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-otx-text mb-1">Email</h4>
                  <a href={`mailto:${companyInfo.email}`} className="text-otx-text/70 hover:text-otx-bordo transition-colors">
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors">
                  <MapPin className="text-otx-bordo group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-otx-text mb-1">Ubicación</h4>
                  <p className="text-otx-text/70">{companyInfo.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-otx-bordo/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors">
                  <Clock className="text-otx-bordo group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-otx-text mb-1">Horario de atención</h4>
                  <p className="text-otx-text/70">Lunes a Viernes de 9 a 18 hs</p>
                  <p className="text-otx-text/50 text-sm">Urgencias fuera de horario: consultar disponibilidad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Form */}
          <div className="bg-otx-gray rounded-2xl p-8">
            <h3 className="text-xl font-bold text-otx-text mb-6">Abrir un Ticket</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot - hidden from users */}
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
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange('tipo', value)} required>
                    <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="particular">Particular</SelectItem>
                      <SelectItem value="pyme">Pyme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servicio">Servicio (opcional)</Label>
                  <Select value={formData.servicio} onValueChange={(value) => handleSelectChange('servicio', value)}>
                    <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                      <SelectValue placeholder="Seleccionar servicio..." />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan interesado (opcional)</Label>
                  <Select value={formData.plan} onValueChange={(value) => handleSelectChange('plan', value)}>
                    <SelectTrigger className="bg-white border-otx-gray focus:border-otx-bordo">
                      <SelectValue placeholder="Seleccionar plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asistencia Única - $15.000">Asistencia Única - $15.000</SelectItem>
                      <SelectItem value="Pack 5 Intervenciones - $65.000">Pack 5 Intervenciones - $65.000</SelectItem>
                      <SelectItem value="Plan Mensual - $25.000/mes">Plan Mensual - $25.000/mes</SelectItem>
                      <SelectItem value="Pyme Basic - $70.000/mes">Pyme Basic - $70.000/mes</SelectItem>
                      <SelectItem value="Pyme Pro - $120.000/mes">Pyme Pro - $120.000/mes</SelectItem>
                      <SelectItem value="Microsoft 365 - Consultar">Microsoft 365 - Consultar</SelectItem>
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
                    Enviar Ticket
                  </>
                )}
              </Button>

              <p className="text-otx-text/50 text-xs text-center">
                Te responderemos a la brevedad por email. Para urgencias, contactanos por WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
