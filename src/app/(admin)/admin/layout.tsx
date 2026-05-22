"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { RealtimeProvider } from "@/context/RealtimeContext";
import Sidebar from "@/components/admin/Sidebar";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? "ml-20" : "ml-60"}`}>
        <div className="min-h-screen px-4 lg:px-6 pt-4 pb-12">{children}</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RealtimeProvider>
        <AdminContent>{children}</AdminContent>
      </RealtimeProvider>
    </SidebarProvider>
  );
}
