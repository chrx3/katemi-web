'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getServices, createService, updateService, deleteService } from '@/lib/pb-admin';
import Header from '@/components/admin/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  features: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface ServiceFormData {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  features: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const defaultFormData: ServiceFormData = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  features: '',
  icon: 'Settings',
  image: '',
  order: 0,
  isActive: true,
};

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data as any);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        title: service.title || '',
        slug: service.slug || '',
        shortDescription: service.shortDescription || '',
        fullDescription: service.fullDescription || '',
        features: service.features || '',
        icon: service.icon || 'Settings',
        image: service.image || '',
        order: service.order || 0,
        isActive: service.isActive ?? true,
      });
    } else {
      setEditingId(null);
      setFormData(defaultFormData);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData(defaultFormData);
  };

  const handleSlugifyFromTitle = () => {
    setFormData((prev) => ({ ...prev, slug: slugify(prev.title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('El slug es requerido');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (editingId) {
        await updateService(editingId, payload);
        toast.success('Servicio actualizado correctamente');
      } else {
        await createService(payload);
        toast.success('Servicio creado correctamente');
      }
      closeModal();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Error al guardar el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar el servicio "${title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteService(id);
      toast.success('Servicio eliminado correctamente');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Servicios" />

      <div className="mt-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Todos los servicios</h2>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-[#00A896] hover:bg-[#008f7f] text-white font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            <Plus size={16} />
            Nuevo
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-48">Título</TableHead>
                <TableHead className="w-40">Slug</TableHead>
                <TableHead className="w-20">Orden</TableHead>
                <TableHead className="w-28">Estado</TableHead>
                <TableHead className="w-28 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No hay servicios todavía. Crea el primero.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium text-gray-900">{service.title}</TableCell>
                    <TableCell className="text-gray-500 text-sm font-mono">{service.slug}</TableCell>
                    <TableCell className="text-gray-500">{service.order}</TableCell>
                    <TableCell>
                      {service.isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(service)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-[#00A896]"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.title)}
                          className="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          {/* Card */}
          <div className="relative bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar servicio' : 'Nuevo servicio'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  onBlur={handleSlugifyFromTitle}
                  placeholder="Diseño UX/UI"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: slugify(e.target.value) }))}
                  placeholder="diseno-ux-ui"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción corta
                </label>
                <Textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="Breve descripción del servicio..."
                  rows={2}
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción completa
                </label>
                <Textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, fullDescription: e.target.value }))}
                  placeholder="Descripción detallada del servicio..."
                  rows={3}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData((p) => ({ ...p, features: e.target.value }))}
                  placeholder='["Característica 1", "Característica 2"]'
                  rows={2}
                />
                <p className="mt-1 text-xs text-gray-400">Array JSON: [&quot;feature1&quot;, &quot;feature2&quot;]</p>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono (nombre Lucide)
                </label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                  placeholder="Settings"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen (URL)
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                  type="url"
                />
                {formData.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 w-24 h-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>

              {/* isActive */}
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#00A896] focus:ring-[#00A896]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Servicio activo
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#00A896] hover:bg-[#008f7f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition text-sm"
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}