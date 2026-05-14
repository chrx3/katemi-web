'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const initial = {
    opacity: 0,
    y: direction === 'up' ? delay * 40 : 0,
    x: direction === 'left' ? -delay * 40 : direction === 'right' ? delay * 40 : 0,
  };

  const animate = {
    opacity: isInView ? 1 : 0,
    y: isInView ? 0 : direction === 'up' ? delay * 40 : 0,
    x: isInView ? 0 : direction === 'left' ? -delay * 40 : direction === 'right' ? delay * 40 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}