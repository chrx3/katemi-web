"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";
import { resolveServiceImage } from "@/lib/image-placeholders";

interface ServiceCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
  previewMode?: boolean;
}

export default function ServiceCard({ slug, title, shortDescription, icon, imageUrl, previewMode = false }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = ((LucideIcons as unknown) as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] || LucideIcons.Box;

  const card = (
    <motion.div
      className="relative group flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
      whileHover={previewMode ? undefined : { y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-48 w-full overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={resolveServiceImage(imageUrl)}
          alt={title}
          fallbackKind="service"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={`absolute top-4 right-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${isHovered ? "bg-[#00A896]" : "bg-[#0B1D3A]"}`}>
        <IconComponent size={24} className={isHovered ? "text-white" : "text-[#00A896]"} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 h-[4.5rem] pr-16 text-lg font-bold uppercase leading-snug tracking-tight text-[#0B1D3A] line-clamp-3">
          {title}
        </h3>
        <p className="h-[3.75rem] flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
          {shortDescription}
        </p>
        <div className="mt-auto pt-4">
          {previewMode ? (
            <span className="inline-flex items-center text-sm font-medium text-gray-400">
              Ver más
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          ) : (
            <Link href={`/servicios/${slug}`} className="inline-flex items-center text-sm font-medium text-[#00A896] transition-colors hover:text-[#0B1D3A]">
              Ver más
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );

  return card;
}
