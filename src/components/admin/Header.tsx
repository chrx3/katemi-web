'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </header>
  );
}
