import React, { useEffect, useRef, useState } from 'react';

type Dir = 'up' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  direction?: Dir;
  delay?: number;
  className?: string;
  threeD?: boolean;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  threeD = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hiddenTransform = threeD
    ? direction === 'left'
      ? 'translateX(-90px) translateY(30px) rotateY(14deg) translateZ(-90px)'
      : direction === 'right'
        ? 'translateX(90px) translateY(30px) rotateY(-14deg) translateZ(-90px)'
        : 'translateY(64px) translateZ(-90px) rotateX(8deg)'
    : direction === 'left'
      ? 'translateX(-48px)'
      : direction === 'right'
        ? 'translateX(48px)'
        : direction === 'up'
          ? 'translateY(40px)'
          : 'translateY(0)';

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateX(0) translateY(0) rotateX(0) rotateY(0) translateZ(0)'
      : hiddenTransform,
    transition: `transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
    transformStyle: 'preserve-3d',
    willChange: 'transform, opacity',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
