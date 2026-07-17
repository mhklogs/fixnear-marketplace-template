import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import Reveal from './Reveal';

interface HeroProps {
  onHomeowner: () => void;
}

// Local hero background videos (served from /public/videos).
const HERO_VIDEOS = [
  '/videos/rompt_The_Luxury_Interior_.mp4',
  '/videos/Untitled.mp4',
];

export default function Hero({ onHomeowner }: HeroProps) {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Force muted + kick off playback; re-trigger on crossfade for smoothness.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted = true;
      if (i === activeVideo) {
        void v.play().catch(() => {});
      }
    });
  }, [activeVideo]);

  // Crossfade through the local background videos on a continuous loop.
  useEffect(() => {
    const id = window.setInterval(
      () => setActiveVideo((v) => (v + 1) % HERO_VIDEOS.length),
      9000
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-forest"
      style={{ perspective: '1400px' }}
    >
      {/* Background videos (local files, continuous loop, crossfading).
          Flipped vertically (scaleY -1) and pushed up to the top border so the
          bottom-right Gemini watermark (now top-right) is cropped out of frame. */}
      <div className="absolute -top-[22%] -bottom-[6%] left-0 right-0 w-full h-auto z-0 pointer-events-none overflow-hidden">
        {HERO_VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === activeVideo ? 0.45 : 0 }}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              e.currentTarget.muted = true;
              if (i === activeVideo) void e.currentTarget.play().catch(() => {});
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Bottom fade keeps the bright corner effect intact at the base */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-[1] pointer-events-none bg-gradient-to-t from-forest via-forest/70 to-transparent" />



      {/* Content — perfectly centered, no cutoff or offset overlap */}
      <Reveal threeD direction="up" className="relative z-10 max-w-5xl text-center flex flex-col items-center justify-center pt-32 pb-16">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-alabaster leading-[1.05] tracking-tight max-w-4xl mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          The Premium, Frictionless Way to Book Top-Tier Local Contractors.
        </h1>

        <p className="text-base md:text-lg text-alabaster/90 max-w-2xl font-light leading-relaxed mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
          No endless searching. No spam calls. Just hand-picked, certified craftsmen ready to secure your home.
        </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button
              onClick={onHomeowner}
              className="btn-amber w-full sm:w-auto px-8 py-4 text-white font-semibold text-sm hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 rounded-full cursor-pointer"
            >
              Lock In Your Time ↗
            </button>
            <button
              onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border border-white/20 text-alabaster font-semibold text-sm backdrop-blur hover:scale-105 transition-all duration-300 hover:border-brass flex items-center justify-center gap-2 rounded-full cursor-pointer"
            >
              Explore Local Trades
            </button>
          </div>
        </Reveal>

        {/* Scroll hint */}
      <button
        onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-alabaster/60 hover:text-brass transition-colors cursor-pointer"
      >
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase">Scroll to explore</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
