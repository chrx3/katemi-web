'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Folder,
  Users,
  SlidersHorizontal,
  MessageSquare,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Servicios', href: '/admin/servicios', icon: Settings },
  { label: 'Proyectos', href: '/admin/proyectos', icon: Folder },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
  { label: 'Config', href: '/admin/config', icon: SlidersHorizontal },
  { label: 'Contactos', href: '/admin/contactos', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B1D3A] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[#00A896] font-bold text-xl">Katemi</span>
          <span className="text-white text-xl">Admin</span>
        </div>
        <p className="text-xs text-white/50 mt-1">Panel Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm transition-colors
                hover:bg-white/10
                ${isActive ? 'bg-[#00A896]/20 border-l-4 border-[#00A896] rounded-r' : ''}
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
