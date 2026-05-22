"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RealtimeContextValue {
  unreadContacts: number;
  resetUnreadContacts: () => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  unreadContacts: 0,
  resetUnreadContacts: () => {},
});

export function useRealtime() {
  return useContext(RealtimeContext);
}

async function ensureAuth() {
  if (pb.authStore.isValid) return;
  const email = process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_EMAIL || "";
  const password = process.env.NEXT_PUBLIC_POCKETBASE_ADMIN_PASSWORD || "";
  if (!email || !password) return;
  await pb.collection("_superusers").authWithPassword(email, password);
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [unreadContacts, setUnreadContacts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        await ensureAuth();
        if (cancelled) return;

        await pb.collection("contacts").subscribe("*", (e: { action: string; record: Record<string, unknown> }) => {
          if (cancelled) return;
          if (e.action === "create") {
            setUnreadContacts((prev) => prev + 1);
            const firstName = (e.record.firstName as string) || "";
            const lastName = (e.record.lastName as string) || "";
            const name = `${firstName} ${lastName}`.trim() || "Alguien";
            toast(`${name} envió un mensaje`, {
              description: (e.record.subject as string) || "Sin asunto",
              action: { label: "Ver", onClick: () => router.push("/admin/contactos") },
              duration: 5000,
            });
          }
        });
      } catch {}
    };

    setup();

    return () => {
      cancelled = true;
      try { pb.collection("contacts").unsubscribe(); } catch {}
    };
  }, []);

  const resetUnreadContacts = () => setUnreadContacts(0);

  return (
    <RealtimeContext.Provider value={{ unreadContacts, resetUnreadContacts }}>
      {children}
    </RealtimeContext.Provider>
  );
}
