import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, DollarSign, Lock, Zap, Check, X, Sparkles } from 'lucide-react';

interface TabData {
  id: string;
  title: string;
  subtitle: string;
  details: string;
}

export default function WhyUs() {
  const [activeTab, setActiveTab] = useState<string>('phone-routing');

  const tabs: TabData[] = [
    {
      id: 'phone-routing',
      title: 'Verified Warm Phone Routing',
      subtitle: 'Double-OTP verification and automated live HLR checks.',
      details: 'Never purchase fake numbers or disconnected emails. Every contact entering ReferralClose passes through active carrier validation (HLR lookup) and receives an instantaneous SMS-OTP code. Contractors receive verified direct-dial lines only.'
    },
    {
      id: 'zero-retainers',
      title: 'Zero Agency Retainers',
      subtitle: 'Eliminate $5,000/mo setup traps. Pay only for real opportunities.',
      details: 'Most digital marketing agencies charge hefty upfront monthly consulting fees while delivering unstable results. We charge nothing to build your profile, integrate dynamic search, or run ads. You pay purely on a clear pay-per-lead basis.'
    },
    {
      id: 'territory-protection',
      title: 'Exclusive Territory Protection',
      subtitle: 'Claim absolute lock-outs in your target regional zip codes.',
      details: 'Block competitors from piggybacking on your leads. Opt into exclusive coverage areas so verified inbound inquiries in your exact zip codes route 100% to your phone instantly, maintaining maximum conversion margins.'
    },
    {
      id: 'instant-dispatch',
      title: '90-Second Instant Dispatch Routing',
      subtitle: 'Rapid matching engine optimized for highest homeowner engagement.',
      details: 'Homeowners are warmest the instant they hit Submit. Our proprietary dispatch router processes and transfers the qualified project details to your smartphone dashboard in under two minutes—letting you schedule jobs before anyone else.'
    }
  ];

  return (
    <section id="why-us" className="py-24 sm:py-32 bg-charcoal text-alabaster relative overflow-hidden">
      {/* Decorative architectural background circle */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
            // DISRUPTING THE DIRECTORY COOLDOWN
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight">
            Designed for Contractors Who Want Closed Deals, Not Clicks
          </h2>
          <p className="text-alabaster/60 font-light mt-4 max-w-2xl text-base sm:text-lg">
            Stop losing budget to legacy directory platforms that distribute identical leads to seven competitors or agency retainers that yield zero phone calls.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          
          {/* Left Column: Interactive Accordion Differentiators */}
          <div className="lg:col-span-6 space-y-6">
            {tabs.map((tab) => {
              const isOpen = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border transition-all duration-300 p-6 sm:p-8 cursor-pointer relative ${
                    isOpen 
                      ? 'border-terracotta bg-white/5 shadow-xl shadow-black/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Absolute active left accent bar */}
                  {isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-terracotta" />
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-alabaster">
                        {tab.title}
                      </h3>
                      <p className={`text-xs font-mono mt-1 ${isOpen ? 'text-terracotta' : 'text-alabaster/55'}`}>
                        {tab.subtitle}
                      </p>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-terracotta flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-alabaster/40 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-alabaster/70 text-sm font-light leading-relaxed animate-fadeIn">
                      {tab.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Matrix Comparison Board */}
          <div className="lg:col-span-6 bg-white/[0.02] border border-white/10 p-6 sm:p-10 shadow-2xl relative">
            
            {/* Top decorative accent dots */}
            <div className="absolute top-4 right-4 flex space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-white/20"></span>
              <span className="w-2 h-2 rounded-full bg-terracotta"></span>
            </div>

            <div className="flex items-center space-x-2 text-terracotta mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono text-xs tracking-wider uppercase">ReferralClose vs. Competitors</span>
            </div>

            <h3 className="text-xl font-display font-bold text-alabaster uppercase tracking-wide mb-6">
              The Performance Ledger
            </h3>

            {/* Comparison Table */}
            <div className="space-y-4 font-mono text-xs">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 pb-3 border-b border-white/10 text-alabaster/40 uppercase tracking-widest text-[10px]">
                <div className="col-span-5">Core Parameter</div>
                <div className="col-span-3 text-center">Typical Agencies</div>
                <div className="col-span-4 text-right text-terracotta">ReferralClose</div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 py-3.5 border-b border-white/5 items-center">
                <div className="col-span-5 text-alabaster font-medium font-sans">Setup & Retainers</div>
                <div className="col-span-3 text-center text-red-400">$3K-$5K/mo upfront</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">$0.00 (Pure Lead Base)</div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-12 py-3.5 border-b border-white/5 items-center">
                <div className="col-span-5 text-alabaster font-medium font-sans">Lead Shared With</div>
                <div className="col-span-3 text-center text-red-400">5-7 competitors</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">1 Exclusive (or max 2)</div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-12 py-3.5 border-b border-white/5 items-center">
                <div className="col-span-5 text-alabaster font-medium font-sans">Contact Validation</div>
                <div className="col-span-3 text-center text-alabaster/50">None (Form Only)</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">Dual Carrier-HLR + OTP</div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-12 py-3.5 border-b border-white/5 items-center">
                <div className="col-span-5 text-alabaster font-medium font-sans">Match Speed</div>
                <div className="col-span-3 text-center text-alabaster/50">24-48 Hours</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">&lt; 90 Seconds</div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-12 py-3.5 border-b border-white/5 items-center">
                <div className="col-span-5 text-alabaster font-medium font-sans">Client Risk</div>
                <div className="col-span-3 text-center text-red-400">High (6-mo lock-in)</div>
                <div className="col-span-4 text-right text-emerald-400 font-bold">Zero. Pay as you scale.</div>
              </div>
            </div>

            {/* Premium Guarantee stamp overlay */}
            <div className="mt-8 bg-white/[0.03] border border-white/5 p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <p className="text-xs text-alabaster/60 font-sans font-light leading-relaxed">
                <strong className="text-alabaster font-mono font-medium">90-Day Performance Backing:</strong> If a verified lead provides an invalid contact line, reporting and requesting replacement credit requires a single, automated click in your dispatcher panel.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
