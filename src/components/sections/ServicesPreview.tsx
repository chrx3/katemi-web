"use client";

import Link from "next/link";
import SectionHeader from "../shared/SectionHeader";
import ServiceCard from "../shared/ServiceCard";
import ScrollReveal from "../shared/ScrollReveal";
import type { LandingTemplateConfig } from "@/lib/template-config";
import InlineEditableText from "@/components/template/InlineEditableText";

type ServicesContent = Pick<
  LandingTemplateConfig,
  | "servicesEyebrow"
  | "servicesTitle"
  | "servicesSubtitle"
  | "servicesDescription"
  | "servicesLinkLabel"
  | "servicesItems"
>;

interface ServicesPreviewProps {
  content: ServicesContent;
  editable?: boolean;
  onFieldChange?: (key: keyof ServicesContent, value: string) => void;
  onServiceChange?: (
    index: number,
    field: keyof LandingTemplateConfig["servicesItems"][number],
    value: string,
  ) => void;
}

export default function ServicesPreview({
  content,
  editable = false,
  onFieldChange,
  onServiceChange,
}: ServicesPreviewProps) {
  return (
    <section className="py-24 bg-white">
      <div className="container-max">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <div className="lg:w-5/12 lg:pt-4">
            {editable && onFieldChange ? (
              <div className="space-y-2">
                <InlineEditableText
                  value={content.servicesEyebrow}
                  onChange={(v) => onFieldChange("servicesEyebrow", v)}
                  className="text-xs font-medium uppercase tracking-widest text-[#00A896]"
                />
                <InlineEditableText
                  value={content.servicesTitle}
                  onChange={(v) => onFieldChange("servicesTitle", v)}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-[#0B1D3A]"
                />
                <InlineEditableText
                  value={content.servicesSubtitle}
                  onChange={(v) => onFieldChange("servicesSubtitle", v)}
                  multiline
                  className="text-lg text-gray-500"
                />
                <InlineEditableText
                  value={content.servicesDescription}
                  onChange={(v) => onFieldChange("servicesDescription", v)}
                  multiline
                  className="mt-6 text-gray-600 leading-relaxed"
                />
                <div className="mt-8 inline-flex items-center gap-2 text-[#00A896] font-semibold">
                  <InlineEditableText
                    value={content.servicesLinkLabel}
                    onChange={(v) => onFieldChange("servicesLinkLabel", v)}
                    className="text-[#00A896] font-semibold"
                  />
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  title={content.servicesTitle}
                  subtitle={content.servicesSubtitle}
                  eyebrow={content.servicesEyebrow}
                  centered={false}
                />
                <ScrollReveal delay={0.3}>
                  <p className="mt-6 text-gray-600 leading-relaxed">
                    {content.servicesDescription}
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                  <Link
                    href="/servicios"
                    className="mt-8 inline-flex items-center gap-2 text-[#00A896] font-semibold hover:text-[#0B1D3A] transition-colors"
                  >
                    {content.servicesLinkLabel}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </ScrollReveal>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:w-7/12">
            {content.servicesItems.map((service, i) => (
              <ScrollReveal key={`${service.slug}-${i}`} delay={i * 0.1} className="h-full">
                {editable && onServiceChange ? (
                  <div className="flex h-full min-h-[220px] flex-col rounded-2xl border border-[#00A896]/30 bg-white p-5 shadow-sm">
                    <InlineEditableText
                      value={service.title}
                      onChange={(v) => onServiceChange(i, "title", v)}
                      className="font-bold text-lg uppercase tracking-tight text-[#0B1D3A]"
                    />
                    <InlineEditableText
                      value={service.shortDescription}
                      onChange={(v) =>
                        onServiceChange(i, "shortDescription", v)
                      }
                      multiline
                      className="text-sm text-gray-600 mt-3"
                    />
                  </div>
                ) : (
                  <ServiceCard
                    slug={service.slug}
                    title={service.title}
                    shortDescription={service.shortDescription}
                    icon={service.icon}
                    imageUrl={service.imageUrl}
                  />
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
