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
  phase: number;
  driftSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
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
  const sectionRef = useRef<HTMLElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];

    const POINTER_RADIUS = 150;
    const POINTER_LINE_RADIUS = 200;
    const REPEL_STRENGTH = 0.55;
    const MIN_SPEED = 0.06;
    const MAX_SPEED = 0.9;
    const FRICTION = 0.986;

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
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 2.5 + 2.5,
          phase: Math.random() * Math.PI * 2,
          driftSpeed: 0.12 + Math.random() * 0.22,
        });
      }
    };

    const getCanvasPoint = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const point = getCanvasPoint(clientX, clientY);
      pointerRef.current = { ...point, active: true };
    };

    const addRipple = (clientX: number, clientY: number) => {
      const point = getCanvasPoint(clientX, clientY);
      ripples.push({
        x: point.x,
        y: point.y,
        radius: 0,
        maxRadius: 180,
        strength: 0.85,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
      addRipple(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const applyAutonomousMotion = (p: Particle, time: number) => {
      p.vx += Math.sin(time * p.driftSpeed + p.phase) * 0.007;
      p.vy += Math.cos(time * p.driftSpeed * 0.85 + p.phase) * 0.007;

      const speed = Math.hypot(p.vx, p.vy);
      if (speed < MIN_SPEED) {
        const angle = p.phase + time * 0.14;
        p.vx += Math.cos(angle) * 0.01;
        p.vy += Math.sin(angle) * 0.01;
      } else if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED;
        p.vy = (p.vy / speed) * MAX_SPEED;
      }
    };

    const applyPointerForce = (
      p: Particle,
      px: number,
      py: number,
      radius: number,
      strength: number,
    ) => {
      const dx = p.x - px;
      const dy = p.y - py;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < radius) {
        const force = (1 - dist / radius) * strength;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pointer = pointerRef.current;
      const time = Date.now() / 1000;

      ripples = ripples.filter((ripple) => {
        ripple.radius += 1.6;
        const band = 28;
        particles.forEach((p) => {
          const dx = p.x - ripple.x;
          const dy = p.y - ripple.y;
          const dist = Math.hypot(dx, dy);
          if (
            dist < ripple.radius &&
            dist > ripple.radius - band &&
            ripple.radius < ripple.maxRadius
          ) {
            const force =
              ripple.strength * (1 - ripple.radius / ripple.maxRadius);
            p.vx += (dx / (dist || 1)) * force * 0.2;
            p.vy += (dy / (dist || 1)) * force * 0.2;
          }
        });

        const alpha = (1 - ripple.radius / ripple.maxRadius) * 0.35;
        if (alpha > 0.02) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        return ripple.radius < ripple.maxRadius;
      });

      particles.forEach((p, i) => {
        applyAutonomousMotion(p, time);

        if (pointer.active) {
          applyPointerForce(
            p,
            pointer.x,
            pointer.y,
            POINTER_RADIUS,
            REPEL_STRENGTH,
          );
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        let particleAlpha = 0.6;
        let particleRadius = p.radius;

        if (pointer.active) {
          const pointerDist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (pointerDist < POINTER_LINE_RADIUS) {
            const proximity = 1 - pointerDist / POINTER_LINE_RADIUS;
            particleAlpha = 0.6 + proximity * 0.35;
            particleRadius = p.radius + proximity * 1.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particleAlpha})`;
        ctx.fill();

        if (pointer.active) {
          const pointerDist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (pointerDist < POINTER_LINE_RADIUS) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            const alpha = (1 - pointerDist / POINTER_LINE_RADIUS) * 0.45;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 2.2;
            ctx.stroke();
          }
        }

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
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      });

      if (pointer.active) {
        const pulse = 6 + Math.sin(Date.now() / 220) * 1.5;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 212, 255, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 212, 255, 0.85)";
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    const handleResize = () => {
      resize();
      createParticles();
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handlePointerLeave);
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: true });
    section.addEventListener("touchend", handlePointerLeave);
    section.addEventListener("touchcancel", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handlePointerLeave);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handlePointerLeave);
      section.removeEventListener("touchcancel", handlePointerLeave);
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
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1D3A]"
    >
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

      <div
        className={`container-max relative z-10 py-32 text-center ${editable ? "" : "pointer-events-none"}`}
      >
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
                  className="pointer-events-auto inline-flex items-center justify-center bg-[#00A896] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#008f7f] hover:shadow-lg hover:shadow-[#00A896]/30 transition-all duration-300 text-base"
                >
                  {content.heroPrimaryCtaLabel}
                </Link>
                <Link
                  href={content.heroSecondaryCtaHref}
                  className="pointer-events-auto inline-flex items-center justify-center border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-base"
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
