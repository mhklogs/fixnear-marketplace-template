import React from 'react';

interface AmbientGlowProps {
  className?: string;
  /** CSS gradient or color used as the organic light blob fill. */
  color?: string;
  /** Animation duration in seconds (slower = more organic). */
  duration?: number;
}

/**
 * A soft, slowly drifting organic light gradient used as a section ambient
 * backdrop. Place it absolutely inside a `relative overflow-hidden` section.
 */
export default function AmbientGlow({
  className = '',
  color = 'radial-gradient(circle at 30% 30%, rgba(217,160,91,0.55), transparent 70%)',
  duration = 26,
}: AmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`organic-glow ${className}`}
      style={{ background: color, animationDuration: `${duration}s` }}
    />
  );
}
