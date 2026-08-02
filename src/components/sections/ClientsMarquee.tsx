"use client";

import ScrollReveal from "../shared/ScrollReveal";
import ClientLogo from "../shared/ClientLogo";
import type { LandingTemplateConfig } from "@/lib/template-config";
import { toClientFallback } from "@/lib/company-content";

export interface ClientItem {
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
  /** Vienen del servidor. Antes se pedían a PocketBase desde el navegador. */
  clients?: ClientItem[];
}

export default function ClientsMarquee({
  content,
  clients: clientsProp,
}: ClientsMarqueeProps) {
  const clients =
    clientsProp && clientsProp.length > 0 ? clientsProp : staticFallback;

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
