"use client";

import SectionHeader from "../shared/SectionHeader";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bgColor?: string;
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  bgColor = "#0B1D3A",
}: PageHeaderProps) {
  const isDarkBg = bgColor === "#0B1D3A" || bgColor === "#162B4D";

  return (
    <section
      className="viewport-below-nav relative flex w-full items-center justify-center overflow-hidden py-12 sm:py-16"
      style={{ backgroundColor: bgColor }}
    >
      {/* Decorative Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle Animated Gradient Mesh */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(0, 168, 150, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="container-max relative z-10 w-full">
        <div className={isDarkBg ? "text-white" : "text-[#0B1D3A]"}>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            centered={true}
            light={isDarkBg}
            eyebrow={eyebrow}
          />
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L48 54C96 48 192 36 288 30C384 24 480 24 576 30C672 36 768 48 864 54C960 60 1056 60 1152 54C1248 48 1344 36 1392 30L1440 24V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}