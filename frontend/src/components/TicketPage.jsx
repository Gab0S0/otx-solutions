import React, { useState, useEffect } from 'react';
import { Phone, Send, AlertCircle, CheckCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { companyInfo, services } from '../data/mock';
import { toast } from 'sonner';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TicketPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo: '',
    asunto: '',
    mensaje: '',
    plan: '',
    servicio: '',
    website: '' // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(null);

  // Check URL params for prefill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    const servicio = params.get('servicio');
    if (plan || servicio) {
      setFormData(prev => ({
        ...prev,
        plan: plan || '',
        servicio: servicio || '',
        asunto: plan ? `Interesado en: ${plan}` : servicio ? `Consulta sobre: ${servicio}` : ''
      }));
    }
  }, []);

  const generateWhatsAppMessage = (ticketId = null) => {
    let msg = `Hola, `;
    if (ticketId) {
      msg += `acabo de crear el ticket ${ticketId}.%0A%0A`;
    } else {
      msg += `necesito soporte técnico remoto.%0A%0A`;
    }
    if (formData.plan) {
      msg += `Plan interesado: ${formData.plan}%0A`;
    }
    if (formData.servicio) {
      msg += `Servicio: ${formData.servicio}%0A`;
    }
    if (formData.asunto && !ticketId) {
      msg += `Asunto: ${formData.asunto}%0A`;
    }
    msg += `%0A¡Gracias!`;
    return msg;
  };

  const whatsappUrl = `https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage()}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name, value) => {
    // Si el valor es el placeholder, guardamos string vacío
    const finalValue = value === '__empty__' ? '' : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
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
        canal: 'TicketWeb'
      });

      if (response.data.success) {
        setTicketCreated({
          id: response.data.ticket_id,
          message: response.data.message
        });
        toast.success('¡Ticket creado!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al enviar el ticket.';
      setError(errorMessage);
      toast.error('Error', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = services.map(s => ({
    value: s.title,
    label: s.title
  }));

  // Success view after ticket creation
  if (ticketCreated) {
    const whatsappWithTicket = `https://wa.me/${companyInfo.whatsapp}?text=${generateWhatsAppMessage(ticketCreated.id)}`;
    
    return (
      <div className="min-h-screen bg-otx-gray flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-otx-text mb-2">¡Ticket Creado!</h1>
          
          <div className="bg-otx-gray rounded-xl p-4 mb-6">
            <p className="text-sm text-otx-text/70 mb-1">Tu número de ticket es:</p>
            <p className="text-3xl font-bold text-otx-bordo">{ticketCreated.id}</p>
          </div>
          
          <p className="text-otx-text/70 mb-6">
            Te responderemos a la brevedad por email. Para una respuesta más rápida, contactanos por WhatsApp.
          </p>
          
          <div className="space-y-3">
            <a href={whatsappWithTicket} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2 py-6">
                <MessageSquare size={20} />
                Abrir WhatsApp
              </Button>
            </a>
            
            <Link to="/">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft size={18} />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-otx-gray">
      {/* Header */}
      <header className="bg-otx-dark py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-otx-bordo rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">OTX</span>
            </div>
            <span className="text-white font-semibold">OTX Solutions</span>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white gap-2">
              <Phone size={16} />
              WhatsApp
            </Button>
          </a>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-otx-text mb-2">Abrir un Ticket</h1>
          <p className="text-otx-text/70">
            Completá el formulario y te respondemos a la brevedad.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de cliente *</Label>
                <Select value={formData.tipo} onValueChange={(v) => handleSelectChange('tipo', v)} required>
                  <SelectTrigger>
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
                <Label htmlFor="servicio">Servicio</Label>
                <Select value={formData.servicio || '__empty__'} onValueChange={(v) => handleSelectChange('servicio', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">— Ninguno —</SelectItem>
                    {serviceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan interesado</Label>
                <Select value={formData.plan || '__empty__'} onValueChange={(v) => handleSelectChange('plan', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">— Ninguno —</SelectItem>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje">Descripción *</Label>
              <Textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Describí tu problema o consulta con el mayor detalle posible..."
                required
                minLength={10}
                rows={5}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-otx-bordo hover:bg-otx-bordo-light text-white gap-2 py-6"
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
          </form>

          {/* WhatsApp alternative */}
          <div className="mt-6 pt-6 border-t border-otx-gray text-center">
            <p className="text-otx-text/60 text-sm mb-3">¿Preferís contacto directo?</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 text-green-600 border-green-600 hover:bg-green-50">
                <Phone size={18} />
                Abrir WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
