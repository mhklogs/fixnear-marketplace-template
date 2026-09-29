import React, { useState } from 'react';
import { ChevronRight, Search, Zap, DollarSign, ShieldCheck, Cpu } from 'lucide-react';
import Reveal from './Reveal';
import GlassCard from './GlassCard';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

interface Capability {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
  schematic: 'seo' | 'routing' | 'cost' | 'disputes' | 'it';
}

const CAPABILITIES: Capability[] = [
  {
    id: 'demand',
    title: 'We Find The Pros, You Don’t',
    subtitle: 'High-ranking local portals',
    details:
      'We run hundreds of high-ranking local home-service portals across North America, so when you search for a roofer or plumber, a verified pro is already waiting on the other side. You never have to hunt through listings or cold-call.',
    icon: Search,
    schematic: 'seo',
  },
  {
    id: 'routing',
    title: 'Your Request Reaches A Pro In Seconds',
    subtitle: 'Instant match to your ZIP',
    details:
      'The moment you submit your project, we route it to a verified pro who actually serves your postal code — not a national call center. You get a real local craftsman, fast.',
    icon: Zap,
    schematic: 'routing',
  },
  {
    id: 'cost',
    title: 'Free For Homeowners',
    subtitle: 'Zero fees to you',
    details:
      'Requesting a verified pro costs you nothing. No monthly fees, no retainers. The pros who receive your request pay a small commission, so our incentive is simply to match you well.',
    icon: DollarSign,
    schematic: 'cost',
  },
  {
    id: 'disputes',
    title: 'Verified, Not Spam',
    subtitle: 'Every pro is vetted',
    details:
      'Every pro in our network is verified before they can receive your request. If something feels off, you can flag it and we’ll re-match you with another trusted local pro at no cost.',
    icon: ShieldCheck,
    schematic: 'disputes',
  },
  {
    id: 'it',
    title: 'Built To Stay Reliable',
    subtitle: '24/7 uptime & monitoring',
    details:
      'Our in-house engineering team keeps the platform fast and secure around the clock — so when you request a pro at midnight before a pipe bursts, the request still goes through.',
    icon: Cpu,
    schematic: 'it',
  },
];

function Schematic({ kind }: { kind: Capability['schematic'] }) {
  const stroke = '#D9A05B';
  const faint = '#9AA79C';
  return (
    <svg viewBox="0 0 240 200" className="w-full h-full" fill="none" stroke={faint} strokeWidth={1.5}>
      {kind === 'seo' && (
        <>
          <circle cx="120" cy="100" r="14" stroke={stroke} />
          <path d="M120 100 L60 60 M120 100 L180 60 M120 100 L60 140 M120 100 L180 140" stroke={stroke} opacity={0.6} />
          {[...Array(8)].map((_, i) => (
            <rect key={i} x={i % 2 ? 175 : 45} y={i < 4 ? 50 + i * 6 : 130 + (i - 4) * 6} width="14" height="8" rx="2" />
          ))}
          <circle cx="120" cy="20" r="4" fill={stroke} stroke="none" />
        </>
      )}
      {kind === 'routing' && (
        <>
          <rect x="40" y="80" width="46" height="40" rx="10" stroke={stroke} />
          <path d="M86 100 H150" stroke={stroke} />
          <rect x="154" y="80" width="46" height="40" rx="10" />
          <path d="M120 70 L120 40 L150 40" stroke={stroke} opacity={0.7} />
          <path d="M104 100 l16 -8 v16 z" fill={stroke} stroke="none" />
        </>
      )}
      {kind === 'cost' && (
        <>
          <circle cx="120" cy="100" r="46" stroke={stroke} />
          <path d="M120 70 v60 M108 84 a14 14 0 1 0 14 12" stroke={stroke} />
          <path d="M60 100 h-12 M192 100 h-12" />
        </>
      )}
      {kind === 'disputes' && (
        <>
          <path d="M120 50 l34 14 v36 c0 26 -18 38 -34 46 c-16 -8 -34 -20 -34 -46 v-36 z" stroke={stroke} />
          <path d="M104 100 l12 12 l22 -26" stroke={stroke} />
        </>
      )}
      {kind === 'it' && (
        <>
          <rect x="46" y="70" width="46" height="60" rx="8" stroke={stroke} />
          <rect x="148" y="70" width="46" height="60" rx="8" />
          <path d="M92 100 H148" stroke={stroke} />
          <circle cx="69" cy="100" r="5" fill={stroke} stroke="none" />
          <circle cx="171" cy="100" r="5" fill={stroke} stroke="none" />
          <path d="M120 40 v-10 M120 170 v-10" stroke={stroke} opacity={0.6} />
        </>
      )}
    </svg>
  );
}

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const current = CAPABILITIES[active];
  const Icon = current.icon;

  return (
    <section id="capabilities" className="py-24 sm:py-32 relative overflow-hidden">
      <AmbientGlow className="w-[520px] h-[520px] -top-20 -left-24" />
      <AmbientGlow className="w-[420px] h-[420px] bottom-0 right-0" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.28), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={40} className="max-w-3xl mb-16">
          <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
            // HOW FIXNEAR WORKS FOR HOMEOWNERS
          </span>
          <h2 className="text-5xl sm:text-7xl font-display font-bold uppercase tracking-tight text-ink">
            How We Match You With Verified Pros
          </h2>
        </Parallax>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start" style={{ perspective: '1400px' }}>
          {/* Accordion list */}
          <Reveal threeD direction="left" className="lg:col-span-7">
          <div className="divide-y divide-white/10 border-y border-white/5">
            {CAPABILITIES.map((cap, i) => {
              const isOpen = active === i;
              const CapIcon = cap.icon;
              return (
                <div
                  key={cap.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="py-6 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full transition-colors ${isOpen ? 'btn-brass text-alabaster' : 'bg-white/5 text-ink border border-white/5'}`}>
                      <CapIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg sm:text-xl text-ink">{cap.title}</h3>
                      <p className={`text-xs font-sans mt-0.5 ${isOpen ? 'text-brass' : 'text-ink-muted'}`}>{cap.subtitle}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'text-brass rotate-90' : 'text-ink/30'}`} />
                  </div>
                  {isOpen && (
                    <p className="text-ink-muted font-light text-sm leading-relaxed mt-4 pl-12 max-w-xl animate-[fadeIn_0.3s_ease]">
                      {cap.details}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          </Reveal>

          {/* Morphing schematic panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <GlassCard className="p-8 sm:p-10 aspect-[4/3] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-brass uppercase">{current.subtitle}</span>
                <Icon className="w-5 h-5 text-brass" />
              </div>
              <div key={current.schematic} className="flex-1 flex items-center justify-center py-6 animate-[fadeIn_0.4s_ease]">
                <div className="w-3/4 max-w-[260px]">
                  <Schematic kind={current.schematic} />
                </div>
              </div>
              <div className="border-t border-white/5 pt-4">
                <h4 className="font-display font-bold text-ink text-lg">{current.title}</h4>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
