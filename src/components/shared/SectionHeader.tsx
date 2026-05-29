"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { IN_VIEW_AMOUNT, IN_VIEW_MARGIN } from "@/lib/motion-viewport";
import ScrollReveal from "./ScrollReveal";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  eyebrow?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  centered = true,
  light = false,
  eyebrow,
}: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: IN_VIEW_MARGIN,
    amount: IN_VIEW_AMOUNT,
  });

  const textColor = light ? "text-white" : "text-[#0B1D3A]";
  const subtitleColor = light ? "text-white/70" : "text-gray-500";

  return (
    <div
      ref={ref}
      className={`w-full min-w-0 ${centered ? "mx-auto max-w-4xl text-center" : ""}`}
    >
      {eyebrow && (
        <ScrollReveal>
          <span className="text-xs font-medium uppercase tracking-widest mb-3 block text-[#00A896]">
            {eyebrow}
          </span>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.1}>
        <h2
          className={`break-words text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight ${textColor}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h2>
      </ScrollReveal>

      {subtitle && (
        <ScrollReveal delay={0.2}>
          <p
            className={`mt-4 text-lg max-w-2xl break-words ${subtitleColor} ${centered ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.3}>
        <motion.div
          className={`h-1 bg-[#00D4FF] mt-6 ${centered ? "mx-auto" : ""}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: "4rem" } : { width: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
        />
      </ScrollReveal>
    </div>
  );
}