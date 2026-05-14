"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ClientLogoProps {
  name: string;
  logoUrl?: string;
  website?: string;
}

export default function ClientLogo({
  name,
  logoUrl,
  website,
}: ClientLogoProps) {
  const content = (
    <div className="relative group rounded-xl p-4 bg-white/50 backdrop-blur hover:bg-white/80 transition-all duration-300">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <div className="flex items-center justify-center h-16">
          <span className="font-bold text-lg tracking-wide text-[#0B1D3A] group-hover:text-[#00A896] transition-colors">
            {name}
          </span>
        </div>
      )}

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#00A896]/30 transition-colors duration-300" />
    </div>
  );

  if (website) {
    return (
      <Link href={website} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
}