'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Smartphone, Monitor } from 'lucide-react';
import Header from '@/components/admin/Header';
import { getSiteConfig, setSiteConfig } from '@/lib/pb-admin';
import { landingTemplateDefaults } from '@/lib/template-config';
import { companyInfo } from '@/lib/company-content';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ContactContent = {
  contactInfoTitle: string;
  contactInfoDescription: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
};

const defaults: ContactContent = {
  contactInfoTitle: landingTemplateDefaults.contactInfoTitle,
  contactInfoDescription: landingTemplateDefaults.contactInfoDescription,
  contactPhone: companyInfo.phone,
  contactEmail: companyInfo.email,
  contactAddress: companyInfo.address,
  contactHours: companyInfo.hours,
};

const fields: Array<{ key: keyof ContactContent; label: string; multiline?: boolean }> = [
  { key: 'contactInfoTitle', label: 'Título bloque contacto' },
  { key: 'contactInfoDescription', label: 'Descripción bloque contacto', multiline: true },
  { key: 'contactPhone', label: 'Teléfono' },
  { key: 'contactEmail', label: 'Correo' },
  { key: 'contactAddress', label: 'Dirección', multiline: true },
  { key: 'contactHours', label: 'Horario' },
];

function buildMailto(email: string) {
  return `mailto:${email.trim()}`;
}

function buildTel(phone: string) {
  const normalized = phone.replace(/\s+/g, '').replace(/[^+\d]/g, '');
  return `tel:${normalized}`;
}

export default function ContactPreviewEditorPage() {
  const [content, setContent] = useState<ContactContent>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<keyof ContactContent | null>(null);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getSiteConfig();
        const next = { ...defaults };

        data.forEach((item: unknown) => {
          if (typeof item !== 'object' || item === null) return;
          const record = item as { key?: unknown; value?: unknown };
          if (typeof record.key !== 'string' || typeof record.value !== 'string') return;

          if (record.key in next) {
            const targetKey = record.key as keyof ContactContent;
            next[targetKey] = record.value;
          }
        });

        setContent(next);
      } catch (error) {
        console.error('Error loading contact visual config:', error);
        toast.error('No se pudo cargar la configuración visual de contacto');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const hasChanges = useMemo(() => {
    return fields.some(({ key }) => content[key] !== defaults[key]);
  }, [content]);

  const updateField = (key: keyof ContactContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      for (const { key } of fields) {
        await setSiteConfig(key, content[key] || '');
      }
      toast.success('Contenido de contacto guardado');
    } catch (error) {
      console.error('Error saving contact visual config:', error);
      toast.error('No se pudo guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const renderEditableText = (key: keyof ContactContent, className: string, isLink = false) => {
    const value = content[key] || '';

    if (editingKey === key) {
      if (key === 'contactAddress' || key === 'contactInfoDescription') {
        return (
          <Textarea
            autoFocus
            rows={key === 'contactAddress' ? 3 : 4}
            value={value}
            onChange={(e) => updateField(key, e.target.value)}
            onBlur={() => setEditingKey(null)}
            className="text-sm"
          />
        );
      }

      return (
        <Input
          autoFocus
          value={value}
          onChange={(e) => updateField(key, e.target.value)}
          onBlur={() => setEditingKey(null)}
          className="text-sm"
        />
      );
    }

    if (isLink) {
      return (
        <button
          type="button"
          onClick={() => setEditingKey(key)}
          className={`${className} text-left hover:text-[#00A896] transition-colors underline-offset-2 hover:underline`}
          title="Click para editar"
        >
          {value}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setEditingKey(key)}
        className={`${className} text-left w-full hover:text-[#00A896] transition-colors`}
        title="Click para editar"
      >
        {value}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header title="Editor visual: Contacto" />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#0B1D3A]">Contenido editable</h2>
              <p className="text-xs text-gray-500">Edita aquí o tocando el texto en la previsualización.</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/contactos" className="text-sm text-gray-500 hover:text-[#0B1D3A]">Volver</Link>
              <Button onClick={saveChanges} disabled={saving || loading} className="bg-[#00A896] hover:bg-[#008f7a] text-white">
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Cargando configuración...</p>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{field.label}</label>
                  {field.multiline ? (
                    <Textarea
                      rows={field.key === 'contactInfoDescription' ? 4 : 3}
                      value={content[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={content[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {hasChanges && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Tienes cambios locales. Recuerda hacer click en "Guardar".
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#0B1D3A]">Vista previa interactiva</p>
            <button
              type="button"
              onClick={() => setMobileView((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              {mobileView ? <Monitor size={14} /> : <Smartphone size={14} />}
              {mobileView ? 'Ver escritorio' : 'Ver móvil'}
            </button>
          </div>

          <div className="bg-gray-100 rounded-xl p-4">
            <div className={`mx-auto bg-white rounded-xl border border-gray-100 p-6 ${mobileView ? 'max-w-[390px]' : ''}`}>
              <h3 className="text-2xl font-bold text-[#0B1D3A] uppercase tracking-tight mb-3">
                {renderEditableText('contactInfoTitle', 'text-2xl font-bold text-[#0B1D3A] uppercase tracking-tight')}
              </h3>
              <div className="mb-6 text-gray-600 leading-relaxed">
                {renderEditableText('contactInfoDescription', 'text-gray-600 leading-relaxed')}
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00A896]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#00A896]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Teléfono</p>
                    <a href={buildTel(content.contactPhone)} className="hidden" aria-hidden />
                    {renderEditableText('contactPhone', 'text-[#0B1D3A] font-medium', true)}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00A896]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#00A896]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Correo electrónico</p>
                    <a href={buildMailto(content.contactEmail)} className="hidden" aria-hidden />
                    {renderEditableText('contactEmail', 'text-[#0B1D3A] font-medium', true)}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00A896]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#00A896]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Dirección</p>
                    <div className="whitespace-pre-line">
                      {renderEditableText('contactAddress', 'text-[#0B1D3A] font-medium whitespace-pre-line')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00A896]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#00A896]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">Horario de atención</p>
                    {renderEditableText('contactHours', 'text-[#0B1D3A] font-medium')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Tip: haz click directamente sobre teléfono, correo, dirección o horario para editar inline.
          </p>
        </div>
      </div>
    </div>
  );
}
