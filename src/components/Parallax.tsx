import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Pixels of vertical travel across the viewport scroll. Negative = up. */
  distance?: number;
  delay?: number;
}

/**
 * Scroll-driven parallax wrapper. Content drifts vertically as the section
 * passes through the viewport, driven by the page scroll position (no
 * scroll listener). Honors prefers-reduced-motion.
 */
export default function Parallax({
  children,
  className = '',
  distance = 60,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={`parallax ${className}`}>
      {children}
    </motion.div>
  );
}
