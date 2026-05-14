"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
            start={0}
            end={numericValue}
            duration={2}
            separator=","
            useEasing={true}
            startWhenOnScreen={true}
          >
            {({ countUpRef }) => (
              <span
                ref={countUpRef as React.Ref<HTMLSpanElement>}
                className="text-6xl md:text-7xl text-[#00D4FF] font-bold tracking-tight"
              >
                0
              </span>
            )}
          </CountUp>
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