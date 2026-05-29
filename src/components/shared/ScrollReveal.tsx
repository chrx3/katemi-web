'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  cappedRevealDelay,
  IN_VIEW_AMOUNT,
  IN_VIEW_MARGIN,
  REVEAL_DURATION,
  REVEAL_EASE,
} from '@/lib/motion-viewport';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
  threshold?: number;
}

const OFFSET = 20;

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  threshold = IN_VIEW_AMOUNT,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: IN_VIEW_MARGIN,
    amount: threshold,
  });

  const effectiveDelay = cappedRevealDelay(delay);

  const hidden = {
    opacity: 0,
    y: direction === 'up' ? OFFSET : 0,
    x: direction === 'left' ? -OFFSET : direction === 'right' ? OFFSET : 0,
  };

  const visible = { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      transition={{
        duration: REVEAL_DURATION,
        ease: REVEAL_EASE,
        delay: effectiveDelay,
      }}
      className={`min-w-0 ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}
