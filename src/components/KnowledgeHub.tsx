import React, { useState } from 'react';
import { BookOpen, Network, PiggyBank, ChevronDown } from 'lucide-react';
import Reveal from './Reveal';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

const POSTS = [
  {
    id: 1,
    tag: 'Deep Dive 01',
    icon: Network,
    title: 'The Cost of Delayed Home Repairs',
    body: 'A tiny structural crack, a slow HVAC leak, or a flickering breaker might seem minor, but deferred maintenance is the fastest way to compound your repair bills. Studies show that homeowners who address minor issues immediately save up to 70% in long-term emergency restoration costs. ReferralClose bypasses the friction of finding help. Our platform secures a local, ready-to-deploy specialist the moment a problem arises—protecting your home and your budget before a minor issue becomes a major crisis.',
    takeaway: 'ReferralClose Homeowner Protection Brief',
  },
  {
    id: 2,
    tag: 'Deep Dive 02',
    icon: PiggyBank,
    title: 'The Zero-Spam Match Guarantee',
    body: 'Traditional home-service directories operate on a chaotic bidding model: you submit your phone number, and they sell it to five or ten aggressive contractors who bomb your phone with sales calls for weeks. We believe your privacy is non-negotiable. The ReferralClose architecture works on a strict, single-match philosophy. We analyze your location and trade needs, match you with the single best-qualified local professional for your project, and lock the pipeline. No endless cold calls, no shared contact sheets—just one trusted expert, direct to your door.',
    takeaway: 'ReferralClose Security & Peace of Mind Brief',
  },
];

export default function KnowledgeHub() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="knowledge" className="py-24 sm:py-32 relative border-t border-white/5 overflow-hidden">
      <AmbientGlow className="w-[500px] h-[500px] -top-16 right-0" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.3), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={40} className="max-w-3xl mb-14">
          <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
            // KNOWLEDGE HUB & HOMEOWNER BRIEFS
          </span>
          <h2 className="text-5xl sm:text-7xl font-display font-bold uppercase tracking-tight text-ink">
            Smarter Homeownership, Explained
          </h2>
        </Parallax>

        <Parallax distance={50} className="grid grid-cols-1 lg:grid-cols-2 gap-8" >
          {POSTS.map((post, i) => {
            const Icon = post.icon;
            const isOpen = expanded === post.id;
            return (
              <React.Fragment key={post.id}>
                <Reveal direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 100} threeD>
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpanded(isOpen ? null : post.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpanded(isOpen ? null : post.id);
                      }
                    }}
                    className="glass tilt-3d group rounded-[32px] p-8 sm:p-10 flex flex-col transition-all duration-300 hover:border-brass active:scale-[0.99] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center gap-2 btn-brass/15 text-brass font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-full">
                        <BookOpen className="w-3.5 h-3.5" />
                        {post.tag}
                      </span>
                      <Icon className="w-6 h-6 text-ink/30 group-hover:text-brass transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-ink leading-tight mb-4">{post.title}</h3>
                    <p className="text-ink-muted font-light text-sm leading-relaxed">{post.body}</p>

                    <div
                      className={`grid transition-all duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-white/5 border border-white/5 rounded-[20px] p-4">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-brass">Why it matters for you</span>
                          <p className="text-sm text-ink mt-1 font-medium">When you book through ReferralClose, a single vetted local pro is matched to your home — fast, private, and free to request.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between font-mono text-[10px] tracking-widest text-ink-muted uppercase">
                      <span>{post.takeaway}</span>
                      <ChevronDown className={`w-4 h-4 text-brass transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </article>
                </Reveal>
              </React.Fragment>
            );
          })}
        </Parallax>
      </div>
    </section>
  );
}
