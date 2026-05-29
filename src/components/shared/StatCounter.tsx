"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { IN_VIEW_AMOUNT, IN_VIEW_MARGIN } from "@/lib/motion-viewport";
import ScrollReveal from "./ScrollReveal";

interface StatCounterProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export default function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  delay = 0,
}: StatCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: IN_VIEW_MARGIN,
    amount: IN_VIEW_AMOUNT,
  });

  // Parse numeric value from string
  const numericValue = parseInt(value.replace(/\D/g, ""), 10) || 0;

  return (
    <div ref={ref} className="text-center">
      <ScrollReveal delay={delay}>
        <div className="flex items-center justify-center font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {prefix && (
            <span className="text-3xl md:text-4xl text-[#00D4FF] font-bold">
              {prefix}
            </span>
          )}
          <CountUp
            start={isInView ? 0 : undefined}
            end={numericValue}
            duration={2}
            separator=","
            useEasing={true}
          />
          {suffix && (
            <span className="text-3xl md:text-4xl text-[#00D4FF] font-bold">
              {suffix}
            </span>
          )}
        </div>
        <p className="mt-3 text-xs uppercase tracking-widest text-gray-500 font-medium">
          {label}
        </p>
      </ScrollReveal>
    </div>
  );
}