"use client";

import StatCounter from "../shared/StatCounter";
import type { LandingStat } from "@/lib/template-config";
import InlineEditableText from "@/components/template/InlineEditableText";

interface StatsBarProps {
  stats: LandingStat[];
  editable?: boolean;
  onStatChange?: (index: number, patch: Partial<LandingStat>) => void;
}

export default function StatsBar({
  stats,
  editable = false,
  onStatChange,
}: StatsBarProps) {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container-max">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <div key={`${stat.label}-${i}`}>
              {editable && onStatChange ? (
                <div className="rounded-xl border border-[#00A896]/25 bg-white p-4">
                  <div className="text-3xl font-bold text-[#0B1D3A] flex items-end gap-1">
                    <InlineEditableText
                      value={stat.value}
                      onChange={(v) => onStatChange(i, { value: v })}
                      className="text-3xl font-bold text-[#0B1D3A]"
                    />
                    <InlineEditableText
                      value={stat.suffix}
                      onChange={(v) => onStatChange(i, { suffix: v })}
                      className="text-2xl font-bold text-[#0B1D3A]"
                    />
                  </div>
                  <InlineEditableText
                    value={stat.label}
                    onChange={(v) => onStatChange(i, { label: v })}
                    className="text-sm text-gray-600 mt-2"
                  />
                </div>
              ) : (
                <StatCounter
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  delay={i * 0.15}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
