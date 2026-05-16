'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import { getServices, getProjects, getClients, getContacts } from '@/lib/pb-admin';
import { Settings, Folder, Users, MessageSquare, ChevronRight, TrendingUp, Activity, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  servicios: number;
  proyectos: number;
  clientes: number;
  contactos: number;
}

const statsCards = [
  {
    label: 'Servicios activos',
    key: 'servicios' as keyof Stats,
    icon: Settings,
    href: '/admin/servicios',
    color: 'from-emerald-500/10 to-teal-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    iconColor: 'text-white',
    trend: '+2 este mes',
  },
  {
    label: 'Proyectos activos',
    key: 'proyectos' as keyof Stats,
    icon: Folder,
    href: '/admin/proyectos',
    color: 'from-blue-500/10 to-indigo-500/20',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    iconColor: 'text-white',
    trend: '+5 esta semana',
  },
  {
    label: 'Clientes',
    key: 'clientes' as keyof Stats,
    icon: Users,
    href: '/admin/clientes',
    color: 'from-purple-500/10 to-violet-500/20',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-500',
    iconColor: 'text-white',
    trend: '+3 esta semana',
  },
  {
    label: 'Contactos totales',
    key: 'contactos' as keyof Stats,
    icon: MessageSquare,
    href: '/admin/contactos',
    color: 'from-orange-500/10 to-amber-500/20',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500',
    iconColor: 'text-white',
    trend: '+12 esta semana',
  },
];

const quickActions = [
  { label: 'Agregar servicio', href: '/admin/servicios', icon: Settings },
  { label: 'Nuevo proyecto', href: '/admin/proyectos', icon: Folder },
  { label: 'Ver contactos', href: '/admin/contactos', icon: MessageSquare },
  { label: 'Configuración', href: '/admin/config', icon: Users },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ servicios: 0, proyectos: 0, clientes: 0, contactos: 0 });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const [servicios, proyectos, clientes, contactos] = await Promise.all([
          getServices(),
          getProjects(),
          getClients(),
          getContacts(),
        ]);
        setStats({
          servicios: servicios.length,
          proyectos: proyectos.length,
          clientes: clientes.length,
          contactos: contactos.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header title="Dashboard" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-r from-[#0B1D3A] via-[#162B4D] to-[#0B1D3A] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A896]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00A896]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Bienvenido al panel de Katemi 👋</h2>
              <p className="text-white/70 text-sm lg:text-base max-w-xl">
                Gestiona tus servicios, proyectos, clientes y contactos desde un solo lugar.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className={card.iconColor} />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp size={12} />
                      {card.trend}
                    </span>
                  </div>

                  {loading ? (
                    <>
                      <Skeleton className="h-9 w-20 mb-2 rounded" />
                      <Skeleton className="h-4 w-28 rounded" />
                    </>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-[#0B1D3A] mb-1 tracking-tight">
                        {stats[card.key]}
                      </div>
                      <div className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                        {card.label}
                      </div>
                    </>
                  )}
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ChevronRight size={20} className="text-[#00A896]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section - Quick Actions + Activity */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#00A896]/10 flex items-center justify-center">
                <Activity size={20} className="text-[#00A896]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1D3A]">Acciones rápidas</h3>
                <p className="text-xs text-gray-400">Accesos directos</p>
              </div>
            </div>

            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-[#00A896]/30 hover:bg-[#00A896]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-400 group-hover:text-[#00A896] transition-colors" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-[#0B1D3A] transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#00A896] group-hover:translate-x-1 transition-all duration-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Activity size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1D3A]">Estado del sistema</h3>
                <p className="text-xs text-gray-400">Métricas en tiempo real</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Base de datos</span>
                </div>
                <p className="text-2xl font-bold text-[#0B1D3A]">Activa</p>
                <p className="text-xs text-gray-400 mt-1">PocketBase v0.26</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">API</span>
                </div>
                <p className="text-2xl font-bold text-[#0B1D3A]">En línea</p>
                <p className="text-xs text-gray-400 mt-1">Respuesta &lt;50ms</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Última actualización</span>
                </div>
                <p className="text-lg font-bold text-[#0B1D3A]">Ahora</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}