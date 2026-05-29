'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/pb-admin';
import { Plus, Edit2, Trash2, Star, X, Upload } from 'lucide-react';
import type { RecordModel } from 'pocketbase';

const CATEGORIES = [
  { value: 'transmission', label: 'Transmisión' },
  { value: 'distribution', label: 'Distribución' },
  { value: 'photovoltaic', label: 'Fotovoltaico' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residencial' },
];

interface ProjectFormData {
  title: string;
  slug: string;
  clientName: string;
  location: string;
  description: string;
  servicesProvided: string;
  images: string[];
  category: string;
  year: string;
  isFeatured: boolean;
  isActive: boolean;
}

const emptyForm: ProjectFormData = {
  title: '',
  slug: '',
  clientName: '',
  location: '',
  description: '',
  servicesProvided: '',
  images: [],
  category: 'photovoltaic',
  year: new Date().getFullYear().toString(),
  isFeatured: false,
  isActive: true,
};

export default function AdminProyectosPage() {
  const [projects, setProjects] = useState<RecordModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<RecordModel | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      showToast('Error al cargar proyectos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (project: RecordModel) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      clientName: project.clientName || '',
      location: project.location || '',
      description: project.description || '',
      servicesProvided: Array.isArray(project.servicesProvided)
        ? project.servicesProvided.join('\n')
        : (project.servicesProvided || ''),
      images: Array.isArray(project.images) ? project.images : [],
      category: project.category || 'photovoltaic',
      year: project.year?.toString() || new Date().getFullYear().toString(),
      isFeatured: project.isFeatured || false,
      isActive: project.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setFormData(emptyForm);
  };

  const handleSlugBlur = () => {
    if (!formData.slug && formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug: generated }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.clientName.trim()) {
      showToast('Título y cliente son requeridos', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('La descripción es requerida', 'error');
      return;
    }
    if (!formData.slug.trim()) {
      showToast('El slug es requerido', 'error');
      return;
    }

    setSaving(true);
    try {
      const servicesArray = formData.servicesProvided
        ? formData.servicesProvided.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload: Record<string, any> = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        clientName: formData.clientName,
        location: formData.location,
        description: formData.description,
        servicesProvided: servicesArray,
        images: formData.images,
        category: formData.category,
        year: parseInt(formData.year) || new Date().getFullYear(),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
        showToast('Proyecto actualizado', 'success');
      } else {
        await createProject(payload);
        showToast('Proyecto creado', 'success');
      }

      closeModal();
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('Error al guardar proyecto', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      showToast('Proyecto eliminado', 'success');
      setDeleteConfirm(null);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      showToast('Error al eliminar proyecto', 'error');
    }
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Proyectos" />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === 'success' ? 'bg-[#00A896]' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#00A896] hover:bg-[#008f7f] text-white font-medium px-4 py-2.5 rounded-lg transition text-sm"
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Cargando...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No hay proyectos aún</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Título</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Cliente</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Categoría</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Año</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Destacado</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{project.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{project.clientName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {getCategoryLabel(project.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{project.year}</span>
                    </td>
                    <td className="px-6 py-4">
                      {project.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
                          <Star size={12} fill="currentColor" />
                          Destacado
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.isActive !== false
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {project.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 text-gray-400 hover:text-[#00A896] hover:bg-[#00A896]/5 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(project.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  onBlur={handleSlugBlur}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                  placeholder="Nombre del proyecto"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                  placeholder="slug-del-proyecto"
                />
                <p className="text-xs text-gray-400 mt-1">Se genera automáticamente del título si se deja vacío</p>
              </div>

              {/* Cliente + Ubicación */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent resize-none"
                  placeholder="Descripción del proyecto"
                />
              </div>

              {/* Servicios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicios proporcionados
                </label>
                <textarea
                  value={formData.servicesProvided}
                  onChange={(e) => setFormData((p) => ({ ...p, servicesProvided: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent resize-none"
                  placeholder="Un servicio por línea"
                />
                <p className="text-xs text-gray-400 mt-1">Un servicio por línea. Se guardará como JSON array.</p>
              </div>

              {/* Categoría + Año */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                    min="2000"
                    max="2100"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-[#00A896]"
                  />
                  <span className="text-sm text-gray-700">Proyecto destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-[#00A896]"
                  />
                  <span className="text-sm text-gray-700">Activo</span>
                </label>
              </div>

              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URLs de imágenes
                </label>
                <textarea
                  value={formData.images.join('\n')}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#00A896] focus:border-transparent resize-none"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">Una URL por línea</p>

                {/* Image previews */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${i + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholders/generic.svg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              images: p.images.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#00A896] hover:bg-[#008f7f] text-white text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : editingProject ? 'Actualizar' : 'Crear proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar proyecto?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}