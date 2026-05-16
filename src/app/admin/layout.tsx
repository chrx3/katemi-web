import { SidebarProvider } from '@/context/SidebarContext';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#F5F5F5]">
        <Sidebar />
        <div className="flex-1 overflow-auto ml-64 transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}