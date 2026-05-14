"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface ServiceCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  imageUrl?: string;
}

export default function ServiceCard({
  slug,
  title,
  shortDescription,
  icon,
  imageUrl,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Dynamically get the Lucide icon
  const IconComponent = ((LucideIcons as unknown) as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon] || LucideIcons.Box;

  return (
    <motion.div
      className="relative group bg-white rounded-2xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <ScrollReveal>
        {/* Optional Image */}
        {imageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-2xl">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Icon Circle */}
        <div
          className={`absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isHovered ? "bg-[#00A896]" : "bg-[#0B1D3A]"
          }`}
        >
          <IconComponent
            size={24}
            className={isHovered ? "text-white" : "text-[#00A896]"}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-lg uppercase tracking-tight text-[#0B1D3A] mb-2 pr-16">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {shortDescription}
          </p>

          {/* Link */}
          <Link
            href={`/servicios/${slug}`}
            className="inline-flex items-center text-[#00A896] text-sm font-medium hover:text-[#0B1D3A] transition-colors"
          >
            Ver más
            <svg
              className="ml-1 w-4 h-4"
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
        </div>
      </ScrollReveal>
    </motion.div>
  );
}