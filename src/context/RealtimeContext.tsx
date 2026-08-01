"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getRecentContacts } from "@/lib/pb-admin";
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

const POLL_INTERVAL_MS = 30_000;

/**
 * Avisa de mensajes de contacto nuevos consultando el servidor cada 30s.
 *
 * Antes esto abría una suscripción realtime de PocketBase autenticándose como
 * superusuario desde el navegador, lo que exigía enviar esas credenciales al
 * cliente. El sondeo pasa por una Server Action y no expone nada.
 */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [unreadContacts, setUnreadContacts] = useState(0);
  const router = useRouter();
  const seenIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const contacts = await getRecentContacts(10);
        if (cancelled) return;

        // La primera respuesta solo siembra el estado conocido: no avisamos de
        // mensajes que ya estaban ahí antes de abrir el panel.
        if (seenIds.current === null) {
          seenIds.current = new Set(contacts.map((c) => c.id));
          return;
        }

        const fresh = contacts.filter((c) => !seenIds.current!.has(c.id));
        if (fresh.length === 0) return;

        fresh.forEach((contact) => {
          seenIds.current!.add(contact.id);
          const name =
            `${contact.firstName} ${contact.lastName}`.trim() || "Alguien";
          toast(`${name} envió un mensaje`, {
            description: contact.subject || "Sin asunto",
            action: {
              label: "Ver",
              onClick: () => router.push("/admin/contactos"),
            },
            duration: 5000,
          });
        });

        setUnreadContacts((prev) => prev + fresh.length);
      } catch {
        // Sesión expirada o backend caído: reintentamos en el siguiente ciclo.
      }
    };

    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [router]);

  const resetUnreadContacts = () => setUnreadContacts(0);

  return (
    <RealtimeContext.Provider value={{ unreadContacts, resetUnreadContacts }}>
      {children}
    </RealtimeContext.Provider>
  );
}
