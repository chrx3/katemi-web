"use client";

import Link from "next/link";
import SectionHeader from "../shared/SectionHeader";
import ProjectCard from "../shared/ProjectCard";
import ScrollReveal from "../shared/ScrollReveal";
import type { LandingTemplateConfig } from "@/lib/template-config";
import { toFeaturedProjectFallback } from "@/lib/company-content";

export interface FeaturedProjectItem {
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

const staticFallback: FeaturedProjectItem[] = toFeaturedProjectFallback();

type FeaturedProjectsContent = Pick<
  LandingTemplateConfig,
  "featuredProjectsEyebrow" | "featuredProjectsTitle" | "featuredProjectsSubtitle" | "featuredProjectsLinkLabel"
>;

interface FeaturedProjectsProps {
  content: FeaturedProjectsContent;
  previewMode?: boolean;
  /** Vienen del servidor. Antes se pedían a PocketBase desde el navegador. */
  projects?: FeaturedProjectItem[];
}

export default function FeaturedProjects({
  content,
  previewMode = false,
  projects: projectsProp,
}: FeaturedProjectsProps) {
  const projects =
    projectsProp && projectsProp.length > 0 ? projectsProp : staticFallback;

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
                  images={project.images}
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
