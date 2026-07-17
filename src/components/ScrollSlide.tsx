import React, { useEffect, useRef, useState } from 'react';

interface ScrollSlideProps {
  children: React.ReactNode;
  className?: string;
  /** Base offset distance for the slide, in px. */
  distance?: number;
  /** Stagger delay in ms. */
  delay?: number;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared scroll-direction tracker so every card reacts consistently to the
// user scrolling up vs. down.
let lastY = typeof window !== 'undefined' ? window.scrollY : 0;
let scrollDir: 'up' | 'down' = 'down';
const dirListeners = new Set<(dir: 'up' | 'down') => void>();

function ensureScrollTracking() {
  if (typeof window === 'undefined' || dirListeners.size === 0) return;
  const onScroll = () => {
    const y = window.scrollY;
    const next = y > lastY ? 'down' : y < lastY ? 'up' : scrollDir;
    if (next !== scrollDir) {
      scrollDir = next;
      dirListeners.forEach((l) => l(scrollDir));
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

let detach: (() => void) | null = null;
function subscribe(cb: (dir: 'up' | 'down') => void) {
  dirListeners.add(cb);
  if (!detach) detach = ensureScrollTracking();
  return () => {
    dirListeners.delete(cb);
    if (dirListeners.size === 0 && detach) {
      detach();
      detach = null;
    }
  };
}

/**
 * Wraps a card so it slides in horizontally whenever it (re)enters the
 * viewport. Direction follows the user's scroll: scrolling down slides the
 * card in from the right, scrolling up slides it in from the left. The
 * animation re-plays on every entry, not just the first.
 */
export default function ScrollSlide({
  children,
  className = '',
  distance = 80,
  delay = 0,
}: ScrollSlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dir, setDir] = useState<'up' | 'down'>(scrollDir);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);

    const unsub = subscribe((d) => setDir(d));

    return () => {
      obs.disconnect();
      unsub();
    };
  }, []);

  const offset = dir === 'down' ? distance : -distance;
  const style: React.CSSProperties = prefersReducedMotion()
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : `translateX(${offset}px)`,
        transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.6s ease ${delay}ms`,
        willChange: 'transform, opacity',
      };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
