"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FALABELLA_LOGO_URL } from "@/lib/company-content";

interface ClientLogoProps {
  name: string;
  logoUrl?: string;
  website?: string;
}

function isFalabellaClient(name: string) {
  return name.trim().toLowerCase() === "falabella";
}

export default function ClientLogo({
  name,
  logoUrl,
  website,
}: ClientLogoProps) {
  const falabella = isFalabellaClient(name);
  const resolvedLogoUrl = falabella ? FALABELLA_LOGO_URL : logoUrl;
  const [showText, setShowText] = useState(!resolvedLogoUrl);

  useEffect(() => {
    setShowText(!resolvedLogoUrl);
  }, [resolvedLogoUrl]);

  const content = (
    <div className="relative group rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {!showText && resolvedLogoUrl ? (
        <div className="flex items-center justify-center h-20">
          <img
            src={resolvedLogoUrl}
            alt={name}
            className={
              falabella
                ? "h-12 w-full max-w-[220px] object-contain"
                : "max-h-20 w-auto max-w-full object-contain"
            }
            onError={() => setShowText(true)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-20">
          <span className="font-bold text-lg tracking-wide text-[#0B1D3A] group-hover:text-[#00A896] transition-colors">
            {name}
          </span>
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#00A896]/30 transition-colors duration-300 pointer-events-none" />
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
