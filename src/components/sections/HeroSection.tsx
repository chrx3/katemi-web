"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { LandingTemplateConfig } from "@/lib/template-config";
import InlineEditableText from "@/components/template/InlineEditableText";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

type HeroContent = Pick<
  LandingTemplateConfig,
  | "heroEyebrow"
  | "heroTitleStart"
  | "heroTitleHighlightOne"
  | "heroTitleConnector"
  | "heroTitleHighlightTwo"
  | "heroSubtitle"
  | "heroPrimaryCtaLabel"
  | "heroPrimaryCtaHref"
  | "heroSecondaryCtaLabel"
  | "heroSecondaryCtaHref"
  | "heroBgImage"
  | "primaryColor"
  | "accentColor"
  | "highlightColor"
>;

interface HeroSectionProps {
  content: HeroContent;
  editable?: boolean;
  onFieldChange?: (key: keyof HeroContent, value: string) => void;
}

export default function HeroSection({
  content,
  editable = false,
  onFieldChange,
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(
        38,
        Math.floor((canvas.width * canvas.height) / 18000),
      );
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.6)";
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1D3A]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0, 168, 150, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="container-max relative z-10 py-32 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#00D4FF] px-4 py-2 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10">
              {editable && onFieldChange ? (
                <InlineEditableText
                  value={content.heroEyebrow}
                  onChange={(value) => onFieldChange("heroEyebrow", value)}
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                />
              ) : (
                content.heroEyebrow
              )}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-tight max-w-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {editable && onFieldChange ? (
              <>
                <InlineEditableText
                  value={content.heroTitleStart}
                  onChange={(value) => onFieldChange("heroTitleStart", value)}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                />{" "}
                <span className="text-[#00D4FF]">
                  <InlineEditableText
                    value={content.heroTitleHighlightOne}
                    onChange={(value) =>
                      onFieldChange("heroTitleHighlightOne", value)
                    }
                    className="text-[#00D4FF] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                  />
                </span>{" "}
                <InlineEditableText
                  value={content.heroTitleConnector}
                  onChange={(value) =>
                    onFieldChange("heroTitleConnector", value)
                  }
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                />{" "}
                <span className="text-[#00A896]">
                  <InlineEditableText
                    value={content.heroTitleHighlightTwo}
                    onChange={(value) =>
                      onFieldChange("heroTitleHighlightTwo", value)
                    }
                    className="text-[#00A896] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                  />
                </span>
              </>
            ) : (
              <>
                {content.heroTitleStart}{" "}
                <span className="text-[#00D4FF]">
                  {content.heroTitleHighlightOne}
                </span>{" "}
                {content.heroTitleConnector}{" "}
                <span className="text-[#00A896]">
                  {content.heroTitleHighlightTwo}
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed"
          >
            {editable && onFieldChange ? (
              <InlineEditableText
                value={content.heroSubtitle}
                onChange={(value) => onFieldChange("heroSubtitle", value)}
                multiline
                className="text-base sm:text-lg text-white/70"
              />
            ) : (
              content.heroSubtitle
            )}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4"
          >
            {editable && onFieldChange ? (
              <>
                <div className="inline-flex items-center justify-center bg-[#00A896] text-white font-semibold px-8 py-4 rounded-xl text-base">
                  <InlineEditableText
                    value={content.heroPrimaryCtaLabel}
                    onChange={(value) =>
                      onFieldChange("heroPrimaryCtaLabel", value)
                    }
                    className="text-base font-semibold"
                  />
                </div>
                <div className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base">
                  <InlineEditableText
                    value={content.heroSecondaryCtaLabel}
                    onChange={(value) =>
                      onFieldChange("heroSecondaryCtaLabel", value)
                    }
                    className="text-base font-semibold"
                  />
                </div>
              </>
            ) : (
              <>
                <Link
                  href={content.heroPrimaryCtaHref}
                  className="inline-flex items-center justify-center bg-[#00A896] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#008f7f] hover:shadow-lg hover:shadow-[#00A896]/30 transition-all duration-300 text-base"
                >
                  {content.heroPrimaryCtaLabel}
                </Link>
                <Link
                  href={content.heroSecondaryCtaHref}
                  className="inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-base"
                >
                  {content.heroSecondaryCtaLabel}
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
