import React, { useState, useEffect, useMemo } from 'react';
import { Star, Search, Quote, Plus } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import ScrollSlide from './ScrollSlide';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

const PAGE = 9;

export default function TrustWall() {
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState<number | 'all'>('all');
  const [visible, setVisible] = useState(PAGE);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  useEffect(() => {
    setVisible(PAGE);
  }, [search, rating]);

  const stats = useMemo(() => {
    const total = REVIEWS.length;
    const sum = REVIEWS.reduce((a, r) => a + r.rating, 0);
    const pct = (n: number) => Math.round((REVIEWS.filter((r) => r.rating === n).length / total) * 100);
    return {
      total,
      avg: (sum / total).toFixed(1),
      p5: pct(5),
      p4: pct(4),
      p3: pct(3),
    };
  }, []);

  const filtered = useMemo(
    () =>
      REVIEWS.filter((r) => {
        const okRating = rating === 'all' ? true : r.rating === rating;
        const okSearch =
          !search.trim() ||
          r.text.toLowerCase().includes(search.toLowerCase()) ||
          r.location.toLowerCase().includes(search.toLowerCase());
        return okRating && okSearch;
      }),
    [search, rating]
  );

  return (
    <section id="trust" className="py-24 sm:py-32 relative border-t border-white/5 overflow-hidden">
      <AmbientGlow className="w-[460px] h-[460px] top-1/3 -left-20" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.3), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={40} className="max-w-3xl mb-12">
          <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
            // 28-CLIENT VERIFIED TRUST WALL
          </span>
          <h2 className="text-5xl sm:text-7xl font-display font-bold uppercase tracking-tight text-ink">
            Verified Partner Network
          </h2>
        </Parallax>

        {/* Scorecard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-4 glass rounded-[32px] p-8 flex flex-col justify-center items-center text-center">
            <div className="text-6xl font-display font-black text-ink">{stats.avg}</div>
            <div className="flex gap-1 my-3 text-brass">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="font-mono text-xs text-ink-muted">
              Based on {stats.total} verified partners
            </div>
          </div>
          <div className="lg:col-span-8 glass rounded-[32px] p-8 flex flex-col justify-center gap-4">
            {[
              { n: 5, p: stats.p5 },
              { n: 4, p: stats.p4 },
              { n: 3, p: stats.p3 },
            ].map((row) => (
              <div key={row.n} className="flex items-center gap-3">
                <span className="w-12 font-mono text-xs font-bold text-ink">{row.n} STARS</span>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full btn-brass" style={{ width: `${row.p}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-xs text-ink-muted font-semibold">{row.p}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviews or metros..."
              className="w-full bg-white/5 border border-white/5 rounded-full py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
            />
          </div>
          <div className="flex gap-2 font-mono text-xs">
            {(['all', 5, 4, 3] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`px-4 py-2.5 rounded-full border transition-colors ${
                  rating === r ? 'btn-brass text-alabaster border-brass' : 'bg-white/5 text-ink-muted border-white/5 hover:border-brass'
                }`}
              >
                {r === 'all' ? 'ALL' : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <Parallax distance={50} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
          {filtered.slice(0, visible).map((r, i) => {
            const isSaved = saved.has(r.id);
            return (
              <React.Fragment key={r.id}>
                <ScrollSlide delay={(i % 3) * 80}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSaved((prev) => {
                        const next = new Set(prev);
                        if (next.has(r.id)) next.delete(r.id);
                        else next.add(r.id);
                        return next;
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSaved((prev) => {
                          const next = new Set(prev);
                          if (next.has(r.id)) next.delete(r.id);
                          else next.add(r.id);
                          return next;
                        });
                      }
                    }}
                    className={`glass tilt-3d rounded-[20px] p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass active:scale-[0.97] ${
                      isSaved
                        ? 'border-brass shadow-lg shadow-brass/20 ring-1 ring-brass/40'
                        : 'hover:border-brass hover:shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-0.5 text-brass">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-white/15'}`} />
                          ))}
                        </div>
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            isSaved ? 'fill-brass text-brass' : 'text-white/15'
                          }`}
                        />
                      </div>
                      <p className="text-ink/80 font-light text-sm leading-relaxed">{r.text}</p>
                    </div>
                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5 font-mono text-[10px] tracking-wider text-ink-muted">
                      <span className="uppercase">{r.type}</span>
                      <span>METRO: {r.location.toUpperCase()}</span>
                    </div>
                  </div>
                </ScrollSlide>
              </React.Fragment>
            );
          })}
        </Parallax>

        {visible < filtered.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisible((v) => v + PAGE)}
              className="inline-flex items-center gap-2 btn-brass rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Load More Reviews ({filtered.length - visible})
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="glass rounded-[24px] p-16 text-center">
            <p className="font-display font-bold text-ink">No reviews match your filters</p>
          </div>
        )}
      </div>
    </section>
  );
}
