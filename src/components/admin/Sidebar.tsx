"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Folder,
  Users,
  SlidersHorizontal,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  WandSparkles,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useRealtime } from "@/context/RealtimeContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Servicios", href: "/admin/servicios", icon: Settings },
  { label: "Proyectos", href: "/admin/proyectos", icon: Folder },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Config", href: "/admin/config", icon: SlidersHorizontal },
  { label: "Contactos", href: "/admin/contactos", icon: MessageSquare },
  { label: "Editor plantilla", href: "/admin/plantilla", icon: WandSparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const { unreadContacts, resetUnreadContacts } = useRealtime();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0B1D3A] text-white flex flex-col z-50 transition-all duration-300 ease-in-out shadow-xl ${
          collapsed ? "w-20" : "w-60"
        }`}
      >
        {/* Logo */}
        <div
          className={`relative border-b border-white/10 transition-all duration-300 ${collapsed ? "p-4" : "p-6"}`}
        >
          {!collapsed && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#00A896] font-bold text-xl tracking-tight">
                  Katemi
                </span>
                <span className="text-white/80 text-lg font-medium">Admin</span>
              </div>
              <p className="text-xs text-white/40 font-medium tracking-wide">
                Panel de Control
              </p>
            </>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <span className="text-[#00A896] font-bold text-2xl">K</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-4 top-20 w-9 h-9 bg-[#0B1D3A] border-2 border-white/25 rounded-full flex items-center justify-center hover:bg-[#00A896] hover:border-[#00A896] transition-all duration-200 shadow-lg z-10"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} className="text-white/80" />
          ) : (
            <ChevronLeft size={16} className="text-white/80" />
          )}
        </button>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => { if (item.label === "Contactos") resetUnreadContacts(); }}
                className={`
                  group flex items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  hover:bg-white/10
                  ${
                    isActive
                      ? "bg-[#00A896]/20 text-[#00A896] border-l-4 border-[#00A896]"
                      : "text-white/70 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "text-[#00A896]"
                      : "text-white/50 group-hover:text-white/80"
                  }`}
                />
                {!collapsed && (
                  <span className="transition-colors duration-200 flex items-center gap-2">
                    {item.label}
                    {item.label === "Contactos" && unreadContacts > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                        {unreadContacts}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className={`border-t border-white/10 transition-all duration-300 ${collapsed ? "p-3" : "p-4"}`}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Spacer div that adjusts with sidebar */}
      <div
        className="fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out pointer-events-none bg-transparent"
        style={{ width: collapsed ? "5rem" : "15rem" }}
      />
    </>
  );
}
