import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Search, X, Zap, Star, ShieldCheck, ShieldAlert, Sun, Award, Paintbrush, Leaf, Blocks, Building2, Wrench, Trees, Bug, Lock } from 'lucide-react';
import { TRADES } from '../data/trades';
import { ServiceType } from '../types';
import ScrollSlide from './ScrollSlide';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

interface MarketplaceProps {
  onHomeowner: (trade: ServiceType) => void;
}

// Consumer-facing trust/speed badges (SVG icons + label, no emojis).
const TRADE_BADGES: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  roofing: { icon: Zap, label: 'Avg. Response: Under 15 Mins' },
  hvac: { icon: Star, label: '4.9/5 Rating (Austin, TX)' },
  plumbing: { icon: ShieldCheck, label: '100% Vetted Specialists' },
  electrical: { icon: Zap, label: 'Immediate Emergency Dispatch' },
  solar: { icon: Sun, label: 'Licensed & Insured' },
  remodeling: { icon: Award, label: '4.9/5 Rated Pros' },
  painting: { icon: Paintbrush, label: 'Verified Crew' },
  landscaping: { icon: Leaf, label: 'Local Dispatch' },
  masonry: { icon: Blocks, label: 'Certified Masons' },
  windows: { icon: Building2, label: 'Precision Install' },
  flooring: { icon: Wrench, label: 'Trusted Fitters' },
  deck: { icon: Trees, label: 'Vetted Builders' },
  siding: { icon: ShieldAlert, label: 'Insured Crews' },
  garage: { icon: Lock, label: 'Smart-Secure Pros' },
  pest: { icon: Bug, label: 'Eco-Safe Teams' },
  security: { icon: ShieldCheck, label: 'Monitored Pros' },
};

export default function Marketplace({ onHomeowner }: MarketplaceProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      TRADES.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  );

  return (
    <section id="marketplace" className="py-24 sm:py-32 relative border-t border-white/5 overflow-hidden">
      <AmbientGlow className="w-[480px] h-[480px] -top-10 right-10" color="radial-gradient(circle at 30% 30%, rgba(217,160,91,0.42), transparent 70%)" />
      <AmbientGlow className="w-[420px] h-[420px] bottom-0 -right-10" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.22), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={40} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 border-b border-white/5 pb-12">
          <div className="max-w-2xl">
            <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
              // CERTIFIED LOCAL TRADE MARKETPLACE
            </span>
            <h2 className="text-5xl sm:text-7xl font-display font-bold uppercase tracking-tight text-ink">
              Every Trade. One Trusted Pro.
            </h2>
          </div>
          <div className="w-full lg:max-w-xs">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearch('');
                }}
                placeholder="Search trades..."
                aria-label="Search trades"
                className="w-full bg-white/5 border border-white/5 rounded-full py-3.5 pl-11 pr-10 font-sans text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass transition-colors cursor-text"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-brass cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] font-mono text-ink-muted mt-3 lg:text-right">
              {filtered.length} of {TRADES.length} trades
              {search && (
                <span> · “{search}”</span>
              )}
            </p>
          </div>
        </Parallax>

        <Parallax distance={50} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" >
          {filtered.map((trade, i) => (
            <React.Fragment key={trade.id}>
              <ScrollSlide
                delay={(i % 4) * 80}
                className={i % 2 === 1 ? 'lg:mt-10' : ''}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onHomeowner(trade.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onHomeowner(trade.id);
                    }
                  }}
                  className="glass tilt-3d group rounded-[24px] overflow-hidden flex flex-col transition-all duration-300 hover:border-brass active:scale-[0.98] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={trade.image}
                      alt={trade.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                    <span className="absolute top-3 right-3 bg-forest/90 backdrop-blur text-ink font-mono text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      {(() => {
                        const badge = TRADE_BADGES[trade.id];
                        if (!badge) return <>✓ Verified Local Pro</>;
                        const Icon = badge.icon;
                        return (<><Icon className="w-3 h-3 text-brass" />{badge.label}</>);
                      })()}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-ink text-lg leading-tight group-hover:text-brass transition-colors">
                      {trade.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-mono text-ink-muted">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Verified local pros standing by</span>
                    </div>

                    <div className="mt-5 border-t border-white/5 pt-4">
                      <span
                        role="button"
                        tabIndex={-1}
                        className="btn-amber text-white font-mono text-xs tracking-wider uppercase px-5 py-3 w-full rounded-full flex items-center justify-center gap-2 transition-all pointer-events-none"
                      >
                        Get Your Custom Estimate
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollSlide>
            </React.Fragment>
          ))}
        </Parallax>

        {filtered.length === 0 && (
          <div className="glass rounded-[24px] p-16 text-center">
            <p className="font-display font-bold text-ink">No matching trades found</p>
            <p className="text-ink-muted text-sm mt-1">Try a different search term.</p>
          </div>
        )}
      </div>
    </section>
  );
}
