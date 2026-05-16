'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/admin/Header';
import { getClients, createClient, updateClient, deleteClient } from '@/lib/pb-admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Globe, GripVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Client {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  order?: number;
  isActive: boolean;
  created?: string;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formValues, setFormValues] = useState<{name: string; logo: string | File; website: string; order: number; isActive: boolean}>({ name: '', logo: '', website: '', order: 0, isActive: true });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data as unknown as Client[]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openNewModal = () => {
    setEditingClient(null);
    setFormValues({ name: '', logo: '', website: '', order: 0, isActive: true });
    setLogoPreview(null);
    setFormOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormValues({
      name: client.name || '',
      logo: client.logo || '',
      website: client.website || '',
      order: client.order || 0,
      isActive: client.isActive ?? true,
    });
    setLogoPreview(client.logo || null);
    setFormOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormValues((prev) => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formValues.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', formValues.name.trim());
      formData.append('website', formValues.website.trim());
      formData.append('order', String(formValues.order));
      formData.append('isActive', String(formValues.isActive));
      if (formValues.logo && typeof formValues.logo !== 'string') {
        formData.append('logo', formValues.logo);
      }

      if (editingClient) {
        await updateClient(editingClient.id, formData);
      } else {
        await createClient(formData);
      }
      await fetchClients();
      setFormOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      await fetchClients();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Clientes" />

      <div className="mt-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Clientes</h2>
          <Button onClick={openNewModal} size="sm">
            <Plus size={16} className="mr-1" />
            Nuevo cliente
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-sm">No hay clientes registrados.</p>
              <Button variant="ghost" size="sm" onClick={openNewModal} className="mt-2">
                <Plus size={14} className="mr-1" />
                Agregar el primero
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left font-medium text-gray-500 px-4 py-3 w-10">
                      <GripVertical size={14} className="text-gray-300" />
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Nombre</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Logo</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Website</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3 w-20">Orden</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3 w-24">Estado</th>
                    <th className="text-right font-medium text-gray-500 px-4 py-3 w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-300">
                        <GripVertical size={14} />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{client.name}</td>
                      <td className="px-4 py-3">
                        {client.logo ? (
                          <img
                            src={typeof client.logo === 'string' ? client.logo : ''}
                            alt={client.name}
                            className="h-8 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-gray-300 text-xs">Sin logo</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {client.website ? (
                          <a
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00A896] hover:underline text-xs flex items-center gap-1"
                          >
                            <Globe size={12} />
                            {client.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{client.order ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            client.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {client.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openEditModal(client)}
                            title="Editar"
                          >
                            <Pencil size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setDeleteTarget(client)}
                            title="Eliminar"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Save / Create Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Actualiza los datos del cliente.' : 'Completa los datos para crear un nuevo cliente.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="client-name">Nombre *</Label>
              <Input
                id="client-name"
                placeholder="Nombre del cliente"
                value={formValues.name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Logo */}
            <div className="space-y-1.5">
              <Label htmlFor="client-logo">Logo</Label>
              <Input
                id="client-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="file:mr-2 file:text-xs"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="h-12 w-auto object-contain border rounded-md p-1 bg-gray-50"
                  />
                </div>
              )}
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <Label htmlFor="client-website">Website</Label>
              <Input
                id="client-website"
                type="url"
                placeholder="https://"
                value={formValues.website}
                onChange={(e) => setFormValues((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <Label htmlFor="client-order">Orden</Label>
              <Input
                id="client-order"
                type="number"
                min={0}
                value={formValues.order}
                onChange={(e) => setFormValues((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              />
            </div>

            {/* isActive */}
            <div className="flex items-center gap-2">
              <input
                id="client-active"
                type="checkbox"
                checked={formValues.isActive}
                onChange={(e) => setFormValues((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="accent-[#00A896] w-4 h-4"
              />
              <Label htmlFor="client-active" className="text-sm cursor-pointer">
                Cliente activo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !formValues.name.trim()}>
              {saving ? 'Guardando…' : editingClient ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar cliente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}