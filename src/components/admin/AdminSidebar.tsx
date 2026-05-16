'use client';

import { useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminSidebar() {
  const { collapsed } = useSidebar();

  return (
    <>
      <Sidebar />
      {/* Dynamic margin based on sidebar state */}
      <div
        className="fixed top-0 left-0 h-screen pointer-events-none"
        style={{ width: collapsed ? '5rem' : '16rem', transition: 'width 0.3s ease-in-out' }}
      />
    </>
  );
}