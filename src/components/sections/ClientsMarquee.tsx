"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "../shared/ScrollReveal";
import ClientLogo from "../shared/ClientLogo";
import { pb, resolvePocketBaseFileUrl } from "@/lib/pocketbase";
import type { LandingTemplateConfig } from "@/lib/template-config";
import { getClientLogoUrl, toClientFallback } from "@/lib/company-content";

interface ClientItem {
  name: string;
  logoUrl: string;
  website: string;
}

const staticFallback: ClientItem[] = toClientFallback();

type ClientsContent = Pick<
  LandingTemplateConfig,
  "clientsEyebrow" | "clientsTitle"
>;

interface ClientsMarqueeProps {
  content: ClientsContent;
}

export default function ClientsMarquee({ content }: ClientsMarqueeProps) {
  const [clients, setClients] = useState<ClientItem[]>(staticFallback);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const records = await pb.collection("clients").getFullList({
          sort: "order",
          filter: "isActive=true",
        });
        if (records.length > 0) {
          const mapped: ClientItem[] = records.map(
            (r: Record<string, unknown>) => ({
              name: (r.name as string) || "",
              logoUrl:
                resolvePocketBaseFileUrl(r, r.logo) ||
                getClientLogoUrl((r.name as string) || ""),
              website: (r.website as string) || "",
            }),
          );
          setClients(mapped);
        }
      } catch {
        // Use static fallback
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="py-14 bg-[#F5F5F5]">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
              {content.clientsEyebrow}
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold uppercase text-[#0B1D3A]">
              {content.clientsTitle}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 flex flex-wrap justify-center items-stretch gap-6">
            {clients.map((client) => (
              <div key={client.name} className="w-full sm:w-56 max-w-xs">
                <ClientLogo
                  name={client.name}
                  logoUrl={client.logoUrl}
                  website={client.website}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
