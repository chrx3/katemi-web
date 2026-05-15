'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import { getServices, getProjects, getClients, getContacts } from '@/lib/pb-admin';
import { Settings, Folder, Users, MessageSquare, ChevronRight } from 'lucide-react';
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
    color: 'bg-green-50 text-[#00A896]',
  },
  {
    label: 'Proyectos activos',
    key: 'proyectos' as keyof Stats,
    icon: Folder,
    href: '/admin/proyectos',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Clientes',
    key: 'clientes' as keyof Stats,
    icon: Users,
    href: '/admin/clientes',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    label: 'Contactos totales',
    key: 'contactos' as keyof Stats,
    icon: MessageSquare,
    href: '/admin/contactos',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ servicios: 0, proyectos: 0, clientes: 0, contactos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="max-w-6xl mx-auto">
      <Header title="Dashboard" />

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                {loading ? (
                  <>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stats[card.key]}
                    </div>
                    <div className="text-sm text-gray-500">{card.label}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Accesos rápidos</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <a
                  key={card.key}
                  href={card.href}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-[#00A896] hover:bg-[#00A896]/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-gray-400 group-hover:text-[#00A896] transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#00A896] transition-colors">
                      Ver {card.label.toLowerCase()}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#00A896] transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}