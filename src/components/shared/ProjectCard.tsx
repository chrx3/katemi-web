"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
  previewMode?: boolean;
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
  previewMode = false,
}: ProjectCardProps) {
  const bgImage = imageUrl || images?.[0] || "https://images.unsplash.com/photo-1621905251189-08b45d6a65e9?w=800&q=80";

  const card = (
    <motion.div
      className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-default"
      whileHover={previewMode ? undefined : { scale: 1.03 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/80 via-[#0B1D3A]/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
      <div className="absolute top-4 left-4">
        <span className="inline-block bg-[#F5A623]/90 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">{category}</span>
      </div>
      <div className="absolute top-4 right-4">
        <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded">{year}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <span className="text-white/80 text-xs font-bold tracking-wider uppercase block mb-1">{clientName}</span>
        <h3 className="font-bold text-xl text-white uppercase tracking-tight">{title}</h3>
        <span className="text-white/60 text-sm block mt-1">📍 {location}</span>
      </div>
      <motion.div className="absolute inset-0 bg-[#0B1D3A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
        <p className="text-white text-sm text-center line-clamp-3">{description}</p>
      </motion.div>
    </motion.div>
  );

  if (previewMode) return card;
  return <Link href={`/proyectos/${slug}`}>{card}</Link>;
}
