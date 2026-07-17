import React from 'react';
import { ArrowDownRight, BookOpen, Database, Cpu, DollarSign } from 'lucide-react';

export default function Blog() {
  const scrollToIntents = () => {
    document.getElementById('funnel')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="blog" className="py-24 sm:py-32 bg-alabaster relative border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Editorial Layout Header */}
        <div className="max-w-4xl border-b border-charcoal/15 pb-12 mb-16">
          <div className="flex items-center space-x-2 text-terracotta mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase">
              // MARKETPLACE BLUEPRINT
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-charcoal leading-tight">
            Beyond the Agency: Why the Referral Marketplace Model is the Ultimate Automated Business
          </h2>
        </div>

        {/* Two-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Big Statement / Editorial Pullquote */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border-l-4 border-terracotta p-8 shadow-sm">
              <span className="font-display font-black text-6xl text-charcoal/10 leading-none block mb-2">“</span>
              <p className="text-xl font-display font-medium text-charcoal leading-relaxed">
                Traditional agencies sell billable hours. Referral engines sell high-intent consumer commitment. One bottlenecks; the other scales infinitely.
              </p>
              <div className="mt-6 flex items-center space-x-3">
                <div className="w-6 h-[1px] bg-charcoal/30"></div>
                <span className="font-mono text-xs tracking-wider text-muted-text uppercase">LAGOM Product Strategy</span>
              </div>
            </div>

            {/* Platform illustration/status info */}
            <div className="border border-charcoal/10 p-6 bg-white space-y-4">
              <h4 className="font-mono text-xs font-bold text-charcoal uppercase tracking-widest">// AUTOMATION AUDIT</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-charcoal/5 p-4 bg-alabaster">
                  <span className="text-xs text-muted-text font-mono block">GEO MATCHING</span>
                  <span className="text-lg font-bold text-charcoal">REAL-TIME</span>
                </div>
                <div className="border border-charcoal/5 p-4 bg-alabaster">
                  <span className="text-xs text-muted-text font-mono block">VERIFICATION</span>
                  <span className="text-lg font-bold text-charcoal">AUTOMATED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deep-dive Editorial Body */}
          <div className="lg:col-span-7 space-y-8 lg:pl-4">
            <p className="text-lg text-charcoal/80 font-light leading-relaxed">
              In the digital era, traditional service agencies are bottlenecked by manual labor and scaling frictions. High-ticket retainers require constant account management, reporting, and client hand-holding. If a client has a slow month, they blame the marketer.
            </p>

            <p className="text-lg text-charcoal/80 font-light leading-relaxed">
              The <strong>Referral Marketplace Model</strong> completely rewrites this dynamic. Instead of building digital assets for individual contractors, you build and own the central matching engine. You capture consumer search intent, filter it, and instantly distribute high-value job leads to local contractors.
            </p>

            {/* Why it Scales Segment */}
            <div className="pt-6 space-y-8">
              <h3 className="font-display font-bold text-xl text-charcoal border-b border-charcoal/10 pb-3">
                Why This Engine Scales Effortlessly
              </h3>

              <div className="space-y-6">
                {/* Point 1 */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-charcoal text-alabaster mt-1">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-charcoal">
                      Complete Data Ownership
                    </h4>
                    <p className="text-muted-text text-sm font-light leading-relaxed mt-1">
                      You own the traffic, the consumer profiles, and the lead generation assets. You are not a contractor's subordinate; you own the marketplace infrastructure.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-charcoal text-alabaster mt-1">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-charcoal">
                      Automated Matching Logic
                    </h4>
                    <p className="text-muted-text text-sm font-light leading-relaxed mt-1">
                      Using simple geolocation parameters, leads are dispatched in real-time via SMS and email. Matches are selected and claimed with zero human bottlenecks.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-charcoal text-alabaster mt-1">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-charcoal">
                      Zero Inventory, High Margin
                    </h4>
                    <p className="text-muted-text text-sm font-light leading-relaxed mt-1">
                      You are selling highly perishable consumer intent (verified, real-time contact details) directly to trade specialists with active budgets who are looking to scale.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Link CTA */}
            <div className="pt-6">
              <button
                onClick={scrollToIntents}
                className="bg-charcoal text-alabaster px-8 py-4 font-mono text-xs tracking-widest hover:bg-terracotta transition-colors duration-300 uppercase flex items-center space-x-3"
              >
                <span>Experience the Matching Engine</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
