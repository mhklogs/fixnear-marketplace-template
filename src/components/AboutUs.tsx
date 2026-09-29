import React from 'react';
import { MapPin, Users, PhoneCall, BadgeCheck } from 'lucide-react';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

const STATS = [
  { icon: MapPin, label: 'Headquartered', value: 'Houston, Texas' },
  { icon: Users, label: 'Pro Network', value: 'Nationwide (all 50 states)' },
  { icon: PhoneCall, label: 'Requests Routed', value: 'By your ZIP code' },
  { icon: BadgeCheck, label: 'Model', value: 'Commission per match' },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-24 sm:py-32 relative border-t border-white/5 overflow-hidden">
      <AmbientGlow className="w-[520px] h-[520px] -top-20 -right-24" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.3), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={40} className="max-w-3xl mb-14">
          <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
            // ABOUT FIXNEAR
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold uppercase tracking-tight text-ink">
            A Houston Team Connecting You To Local Pros
          </h2>
          <p className="text-ink-muted font-light mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
            FixNear is based in <strong className="text-ink">Houston, Texas</strong>, and runs a verified network of home-service pros across the entire United States. When you request a service, we send it straight to a pro who works in your postal code — they handle the job, and we take a small commission on the match. No fees to you, ever.
          </p>
        </Parallax>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass rounded-[24px] p-6 flex flex-col gap-4">
                <span className="inline-flex p-3 rounded-full bg-white/5 text-brass border border-white/5 w-fit">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-display font-bold text-ink text-lg leading-tight">{s.value}</div>
                  <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 glass rounded-[28px] p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <h3 className="font-display font-bold text-ink text-2xl">How a request reaches your pro</h3>
            <p className="text-ink-muted font-light text-sm leading-relaxed mt-3 max-w-xl">
              You tell us the trade and your postal code. We match you to a verified pro already serving that neighborhood, they call to schedule a visit, and once the work is agreed we collect a modest commission from the pro. That’s the whole model — simple, local, and free for homeowners.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-amber text-white font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Book Consultation ↗
          </button>
        </div>
      </div>
    </section>
  );
}
