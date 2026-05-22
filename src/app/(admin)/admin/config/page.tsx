'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import { getSiteConfig, setSiteConfig } from '@/lib/pb-admin';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SiteConfig {
  [key: string]: string;
}

const configFields = [
  { key: 'contactEmail', label: 'Email de contacto', type: 'text' },
  { key: 'contactPhone', label: 'Teléfono', type: 'text' },
  { key: 'contactAddress', label: 'Dirección', type: 'text' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
  { key: 'instagramUrl', label: 'Instagram URL', type: 'text' },
  { key: 'companyName', label: 'Nombre de la empresa', type: 'text' },
  { key: 'companyTagline', label: 'Tagline', type: 'text' },
];

export default function ConfigPage() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getSiteConfig();
        const configMap: SiteConfig = {};
        data.forEach((item: any) => {
          configMap[item.key] = item.value;
        });
        setConfig(configMap);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const field of configFields) {
        const value = config[field.key];
        if (value === undefined || value === null) continue;
        await setSiteConfig(field.key, value);
      }
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Header title="Configuración" />

      <div className="mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-6">
            Edita la información general del sitio
          </p>

          <div className="space-y-5">
            {configFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : field.type === 'textarea' ? (
                  <Textarea
                    value={config[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    type="text"
                    value={config[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 bg-[#00A896] hover:bg-[#008f7a] text-white"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
