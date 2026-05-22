"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ScrollReveal from "../shared/ScrollReveal";
import ClientLogo from "../shared/ClientLogo";
import { pb } from "@/lib/pocketbase";
import type { LandingTemplateConfig } from "@/lib/template-config";

const ReactFastMarquee = dynamic(() => import("react-fast-marquee"), {
  ssr: false,
});

interface ClientFromPB {
  name: string;
  logoUrl: string;
  website: string;
}

const staticFallback: ClientFromPB[] = [
  { name: "CGE", logoUrl: "", website: "" },
  { name: "Transelec", logoUrl: "", website: "" },
  { name: "Enel", logoUrl: "", website: "" },
  { name: "AES Chile", logoUrl: "", website: "" },
  { name: "Colbún", logoUrl: "", website: "" },
  { name: "Pacific Energy", logoUrl: "", website: "" },
  { name: "Grupo Saesa", logoUrl: "", website: "" },
  { name: "Engie", logoUrl: "", website: "" },
];

type ClientsContent = Pick<
  LandingTemplateConfig,
  "clientsEyebrow" | "clientsTitle"
>;

interface ClientsMarqueeProps {
  content: ClientsContent;
}

export default function ClientsMarquee({ content }: ClientsMarqueeProps) {
  const [clients, setClients] = useState<ClientFromPB[]>(staticFallback);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const records = await pb.collection("clients").getFullList({
          sort: "order",
          filter: "isActive=true",
        });
        if (records.length > 0) {
          const mapped: ClientFromPB[] = records.map(
            (r: Record<string, unknown>) => ({
              name: (r.name as string) || "",
              logoUrl: (r.logoUrl as string) || "",
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
    <section className="py-14 bg-[#F5F5F5] overflow-hidden">
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
      </div>

      <ReactFastMarquee
        speed={40}
        pauseOnHover
        gradient={false}
        className="mt-6"
      >
        <div className="flex items-center gap-6 pr-6">
          {clients.map((client) => (
            <div key={client.name} className="flex-shrink-0 w-44">
              <ClientLogo
                name={client.name}
                logoUrl={client.logoUrl}
                website={client.website}
              />
            </div>
          ))}
        </div>
      </ReactFastMarquee>
    </section>
  );
}
