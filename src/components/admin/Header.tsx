'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Bell, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left side - Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#0B1D3A] tracking-tight">{title}</h1>
            <p className="text-xs text-gray-400 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search (optional visual only) */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
            searchFocused
              ? 'border-[#00A896] bg-[#00A896]/5'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}>
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-40"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
            <Bell size={20} className="text-gray-500 group-hover:text-[#0B1D3A] transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#00A896] rounded-full ring-2 ring-white" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#0B1D3A]">Admin</p>
              <p className="text-xs text-gray-400">Katemi</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00A896] to-[#0B1D3A] flex items-center justify-center text-white font-bold text-sm shadow-md">
              K
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-white hover:bg-[#0B1D3A] transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}