'use client';

import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/admin/Sidebar';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  
  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminContent>{children}</AdminContent>
    </SidebarProvider>
  );
}
