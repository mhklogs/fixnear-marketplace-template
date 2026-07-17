import React, { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  glint?: boolean;
}

/**
 * Frosted glass card with a 3D perspective hover tilt. Tracks the cursor to
 * rotate on the X/Y axes and paints a moving specular glint. Honors
 * prefers-reduced-motion by skipping the tilt.
 */
export default function GlassCard({
  children,
  className = '',
  max = 8,
  glint = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`glass tilt-3d relative rounded-[24px] ${className}`}
    >
      {glint && (
        <div className="tilt-glint pointer-events-none absolute inset-0 rounded-[24px]" />
      )}
      {children}
    </div>
  );
}
