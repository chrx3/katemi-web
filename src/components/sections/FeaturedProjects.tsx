"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "../shared/SectionHeader";
import ProjectCard from "../shared/ProjectCard";
import ScrollReveal from "../shared/ScrollReveal";
import { pb } from "@/lib/pocketbase";
import type { LandingTemplateConfig } from "@/lib/template-config";

interface ProjectFromPB {
  slug: string;
  title: string;
  clientName: string;
  location: string;
  description: string;
  category: string;
  year: string;
  imageUrl?: string;
  images?: string[];
}

const staticFallback: ProjectFromPB[] = [
  {
    slug: "subestacion-cge-central",
    title: "Subestación 110kV Central",
    clientName: "CGE",
    location: "Región Metropolitana",
    description:
      "Diseño y construcción de subestación de transformación 110/23kV con capacidad de 40 MVA para suministro industrial.",
    category: "Media Tensión",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80",
  },
  {
    slug: "linea-aerea-220kv",
    title: "Línea Aérea 220kV",
    clientName: "Transelec",
    location: "Región del Biobío",
    description:
      "Instalación de 28 km de línea aérea en 220kV con towers de acero galvanizado, incluyendo tendido de conductores.",
    category: "Alta Tensión",
    year: "2023",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
  },
  {
    slug: "sistema-automatizacion-enel",
    title: "Sistema SCADA Enel",
    clientName: "Enel",
    location: "Región de Valparaíso",
    description:
      "Implementación de sistema SCADA para control y monitoreo de redes de distribución en media tensión.",
    category: "Automatización",
    year: "2023",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
];

type FeaturedProjectsContent = Pick<
  LandingTemplateConfig,
  "featuredProjectsEyebrow" | "featuredProjectsTitle" | "featuredProjectsSubtitle" | "featuredProjectsLinkLabel"
>;

interface FeaturedProjectsProps {
  content: FeaturedProjectsContent;
  previewMode?: boolean;
}

export default function FeaturedProjects({ content, previewMode = false }: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<ProjectFromPB[]>(staticFallback);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const records = await pb.collection("projects").getFullList({
          sort: "-year",
          filter: "isFeatured=true && isActive=true",
        });
        if (records.length > 0) {
          const mapped: ProjectFromPB[] = records.map((r: Record<string, unknown>) => ({
            slug: r.slug as string,
            title: r.title as string,
            clientName: r.clientName as string,
            location: r.location as string,
            description: r.description as string,
            category: r.category as string,
            year: String(r.year ?? ""),
            imageUrl: r.imageUrl as string | undefined,
            images: r.images as string[] | undefined,
          }));
          setProjects(mapped);
        }
      } catch {
        // Use static fallback
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-24 bg-[#2A3F5F]">
      <div className="container-max">
        <SectionHeader
          title={content.featuredProjectsTitle}
          subtitle={content.featuredProjectsSubtitle}
          eyebrow={content.featuredProjectsEyebrow}
          light
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.12}>
              <div className={previewMode ? "pointer-events-none opacity-80" : ""}>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  clientName={project.clientName}
                  location={project.location}
                  description={project.description}
                  category={project.category}
                  year={project.year}
                  imageUrl={project.imageUrl}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            {previewMode ? (
              <span className="inline-flex items-center gap-2 text-white/50 font-semibold">
                {content.featuredProjectsLinkLabel}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            ) : (
              <Link href="/proyectos" className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#00D4FF] transition-colors">
                {content.featuredProjectsLinkLabel}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
