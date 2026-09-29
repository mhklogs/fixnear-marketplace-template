import React, { useState } from 'react';
import NavIsland from './components/NavIsland';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import Marketplace from './components/Marketplace';
import TrustWall from './components/TrustWall';
import KnowledgeHub from './components/KnowledgeHub';
import ConnectPipeline from './components/ConnectPipeline';
import FAQs from './components/FAQs';
import AboutUs from './components/AboutUs';
import HomeownerModal from './components/HomeownerModal';
import ChatWidget from './components/ChatWidget';
import { ServiceType } from './types';

export default function App() {
  const [homeOpen, setHomeOpen] = useState(false);
  const [homeTrade, setHomeTrade] = useState<ServiceType | ''>('');

  const openHomeowner = (trade: ServiceType | '' = '') => {
    setHomeTrade(trade);
    setHomeOpen(true);
  };

  return (
    <div className="relative min-h-screen text-ink font-sans selection:btn-brass selection:text-white">
      <NavIsland onHomeowner={() => openHomeowner('')} />

      <Hero onHomeowner={() => openHomeowner('')} />

      {/* Slate Gray cinematic experience for all subsequent sections */}
      <div className="relative bg-forest text-ink font-sans selection:btn-brass selection:text-white">
        <Capabilities />
        <Marketplace onHomeowner={openHomeowner} />
        <TrustWall />
        <KnowledgeHub />
        <ConnectPipeline />
        <FAQs />
        <AboutUs />
      </div>

      <footer className="bg-forest text-ink py-16 sm:py-20 relative overflow-hidden border-t border-white/5">
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,160,91,0.18),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 space-y-5">
              <div className="brand-mark text-2xl">
                Referral<span className="brand-close">Close</span>
              </div>
              <p className="text-sm text-ink-muted font-light leading-relaxed max-w-md">
                The high-integrity referral platform connecting premium local trades with verified, high-intent homeowners. Engineered with secure double-verification and instant match protection. No spam. No shared data. Just direct, reliable connection to local professionals.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-brass mb-4">Explore</div>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li><a href="#marketplace" className="hover:text-brass transition-colors">Local Trades</a></li>
                <li><a href="#knowledge" className="hover:text-brass transition-colors">Homeowner Briefs</a></li>
                <li><a href="#faqs" className="hover:text-brass transition-colors">FAQ</a></li>
                <li><a href="#connect" className="hover:text-brass transition-colors">Book Consultation</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-brass mb-4">Company</div>
              <ul className="space-y-2.5 text-sm text-ink-muted">
                <li><a href="#about" className="hover:text-brass transition-colors">About Us</a></li>
                <li><a href="mailto:hello@fixnear-marketplace.com" className="hover:text-brass transition-colors">Contact</a></li>
                <li><a href="tel:1-800-REF-CLOS" className="hover:text-brass transition-colors">1-800-REF-CLOS</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-[10px] font-mono text-ink-muted/60">
              © {new Date().getFullYear()} FixNear.com. All Rights Reserved.
            </div>
            <div className="text-[10px] font-mono text-ink-muted/60">
              Houston, Texas · Matching verified pros across the U.S.
            </div>
          </div>
        </div>
      </footer>

      <HomeownerModal open={homeOpen} initialTrade={homeTrade} onClose={() => setHomeOpen(false)} />

      <ChatWidget onRequestPro={(trade = '') => openHomeowner(trade as ServiceType | '')} />
    </div>
  );
}
