"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/admin/Header";
import { getContacts } from "@/lib/pb-admin";
import { pb } from "@/lib/pocketbase";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, PencilRuler, MessageSquare } from "lucide-react";
import { useRealtime } from "@/context/RealtimeContext";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  created: string;
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const { resetUnreadContacts } = useRealtime();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data as unknown as Contact[]);
      } catch (error) {
        console.error("Error loading contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
    resetUnreadContacts();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (pb.authStore.isValid) {
      pb.collection("contacts").subscribe("*", (e: { action: string; record: Record<string, unknown> }) => {
        if (cancelled) return;
        if (e.action === "create") {
          setContacts((prev) => [e.record as unknown as Contact, ...prev]);
        }
      }).catch(() => {});
    }
    return () => {
      cancelled = true;
      try { pb.collection("contacts").unsubscribe(); } catch {}
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr || "—";
    }
  };

  const fullName = (c: Contact) => `${c.firstName || ""} ${c.lastName || ""}`.trim() || "—";

  return (
    <div className="max-w-6xl mx-auto">
      <Header title="Contactos" />

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Mensajes recibidos desde el formulario de contacto
            {contacts.length > 0 && <span className="ml-2 text-gray-400">({contacts.length})</span>}
          </p>
          <Link
            href="/admin/contactos/editor"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1D3A] text-white text-sm hover:bg-[#122645] transition-colors"
          >
            <PencilRuler size={16} />
            Editor visual de contacto
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-base">No hay contactos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Teléfono</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Asunto</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Fecha</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[150px]">{fullName(contact)}</td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[180px]">{contact.email}</td>
                      <td className="px-4 py-3 text-gray-600">{contact.phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 truncate max-w-[160px]">{contact.subject}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(contact.created)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(contact)} className="text-[#00A896] hover:text-[#008f7a] hover:bg-[#00A896]/10">
                          <Eye size={16} className="mr-1" />Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del mensaje</DialogTitle>
            <DialogDescription>{selected && formatDate(selected.created)}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Nombre</p>
                <p className="text-sm text-gray-900">{fullName(selected)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-900">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Teléfono</p>
                <p className="text-sm text-gray-900">{selected.phone || "—"}</p>
              </div>
              {selected.company && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Empresa</p>
                  <p className="text-sm text-gray-900">{selected.company}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Asunto</p>
                <p className="text-sm text-gray-900">{selected.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Mensaje</p>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
