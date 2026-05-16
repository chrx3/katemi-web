'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';
import PageHeader from '~/components/shared/PageHeader';
import ScrollReveal from '~/components/shared/ScrollReveal';
import { pb } from '~/lib/pocketbase';

function generateId(prefix: string = ''): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < 15; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const contactSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(6, 'Ingresa un número de teléfono válido'),
  company: z.string().optional(),
  email: z.string().email('Ingresa un correo electrónico válido'),
  subject: z.string().min(1, 'Selecciona un assunto'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder los 1000 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SUBJECTS = [
  'Proyecto de ingeniería',
  'Instalación eléctrica',
  'Automatización y control',
  'Certificación SEC',
  'Consulta general',
  'Cotización',
  'Otro',
];

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await pb.collection('contacts').create({
        id: generateId('cnt'),
        nombre: `${data.firstName} ${data.lastName}`,
        telefono: data.phone,
        email: data.email,
        asunto: data.subject,
        mensaje: data.message,
      });
      toast.success('Mensaje enviado correctamente', {
        description: 'Nos pondremos en contacto contigo a la brevedad.',
      });
      reset();
    } catch {
      toast.error('Error al enviar el mensaje', {
        description: 'Por favor intenta nuevamente o contáctanos por teléfono.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Contacto"
        subtitle="Estamos listos para ayudarte"
        eyebrow="Escríbenos"
      />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 space-y-10">
              <ScrollReveal direction="left">
                <div>
                  <h2 className="text-2xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-4">
                    Conoce más sobre Katemi
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Estamos ubicados en Santiago y prestamos servicios en todo Chile. 
                    Contáctanos para discutir tu próximo proyecto eléctrico.
                  </p>
                </div>
              </ScrollReveal>

              {/* Contact details */}
              <div className="space-y-6">
                {[
                  {
                    icon: Phone,
                    label: 'Teléfono',
                    value: '+56 9 1234 5678',
                    href: 'tel:+56912345678',
                  },
                  {
                    icon: Mail,
                    label: 'Correo electrónico',
                    value: 'contacto@katemi.chrsx3.com',
                    href: 'mailto:contacto@katemi.chrsx3.com',
                  },
                  {
                    icon: MapPin,
                    label: 'Dirección',
                    value: 'Av. Providencia 1650, Of. 501\nSantiago, Chile',
                    href: null,
                  },
                  {
                    icon: Clock,
                    label: 'Horario de atención',
                    value: 'Lunes a Viernes: 8:30 – 18:30',
                    href: null,
                  },
                ].map((item, i) => (
                  <ScrollReveal key={item.label} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#00A896]/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-[#00A896]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-[#0B1D3A] font-medium hover:text-[#00A896] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[#0B1D3A] font-medium whitespace-pre-line">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Google Maps Embed */}
              <ScrollReveal delay={0.3}>
                <div className="rounded-2xl overflow-hidden h-52 bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.8369663730655!2d-70.642367!3d-33.456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI3JzE2LjYiUyA3MMKwMzgnMzUuOCJX!5e0!3m2!1sen!2scl!4v1600000000000!5m2!1sen!2scl"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Katemi Ubicación"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.15}>
                <div className="bg-[#F5F5F5] rounded-2xl p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-2">
                    Envíanos un mensaje
                  </h2>
                  <p className="text-gray-500 text-sm mb-8">
                    Completa el formulario y te responderemos dentro de 24 horas hábiles.
                  </p>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName">
                          Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          {...register('firstName')}
                          className={
                            errors.firstName
                              ? 'border-red-400 focus:border-red-400'
                              : ''
                          }
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName">
                          Apellido <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          {...register('lastName')}
                          className={
                            errors.lastName
                              ? 'border-red-400 focus:border-red-400'
                              : ''
                          }
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone + Company */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">
                          Teléfono <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          {...register('phone')}
                          className={
                            errors.phone
                              ? 'border-red-400 focus:border-red-400'
                              : ''
                          }
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          placeholder="Nombre de tu empresa (opcional)"
                          {...register('company')}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email">
                        Correo electrónico <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@empresa.cl"
                        {...register('email')}
                        className={
                          errors.email
                            ? 'border-red-400 focus:border-red-400'
                            : ''
                        }
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <Label htmlFor="subject">
                        Asunto <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(val) => setValue('subject', val as string)}
                      >
                        <SelectTrigger
                          id="subject"
                          className={
                            errors.subject ? 'border-red-400' : ''
                          }
                        >
                          <SelectValue placeholder="Selecciona un assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-xs text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message">
                        Mensaje <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Cuéntanos sobre tu proyecto o consulta..."
                        {...register('message')}
                        className={
                          errors.message
                            ? 'border-red-400 focus:border-red-400 resize-none'
                            : 'resize-none'
                        }
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-[#00A896] hover:bg-[#008f7f] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar mensaje
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}