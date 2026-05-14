"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

interface ProjectCardProps {
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

export default function ProjectCard({
  slug,
  title,
  clientName,
  location,
  description,
  category,
  year,
  imageUrl,
  images,
}: ProjectCardProps) {
  // Use first image from images array if no imageUrl, fallback to placeholder
  const bgImage = imageUrl || images?.[0] || "https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80";

  return (
    <Link href={`/proyectos/${slug}`}>
      <motion.div
        className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/80 via-[#0B1D3A]/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-[#F5A623]/90 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Year Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">
            {year}
          </span>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Client Name */}
          <span className="text-white/80 text-xs font-bold tracking-wider uppercase block mb-1">
            {clientName}
          </span>

          {/* Title */}
          <ScrollReveal>
            <h3 className="font-bold text-xl text-white uppercase tracking-tight">
              {title}
            </h3>
          </ScrollReveal>

          {/* Location */}
          <span className="text-white/60 text-sm block mt-1">
            📍 {location}
          </span>
        </div>

        {/* Hover Overlay for Description */}
        <motion.div
          className="absolute inset-0 bg-[#0B1D3A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <p className="text-white text-sm text-center line-clamp-3">
            {description}
          </p>
        </motion.div>
      </motion.div>
    </Link>
  );
}