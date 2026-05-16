'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}