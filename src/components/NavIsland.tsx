import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavIslandProps {
  onHomeowner: () => void;
}

const NAV_LINKS = [
  { label: 'Capabilities', target: 'capabilities' },
  { label: 'Marketplace', target: 'marketplace' },
  { label: 'Trust Wall', target: 'trust' },
  { label: 'Insights', target: 'knowledge' },
  { label: 'FAQ', target: 'faqs' },
  { label: 'Connect', target: 'connect' },
];

export default function NavIsland({ onHomeowner }: NavIslandProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const go = (target: string) => {
    setMobileOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[1200px] flex items-center justify-between gap-4 bg-charcoal/90 backdrop-blur-[12px] border border-white/10 rounded-full px-5 sm:px-7 py-3 shadow-2xl shadow-charcoal/30">
          {/* Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="brand-mark text-lg sm:text-xl text-white flex items-center space-x-1 cursor-pointer"
          >
            <span>Referral</span>
            <span className="brand-close">Close</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => go(l.target)}
                className="text-white/70 hover:text-brass text-sm font-medium tracking-wide transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="text-white/80 hover:text-brass p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer mr-1"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => go('about')}
              className="text-white/80 hover:text-white text-xs font-mono tracking-widest uppercase px-4 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              Explore Us
            </button>
            <button
              onClick={onHomeowner}
              className="btn-amber text-white text-xs font-mono tracking-widest uppercase px-5 py-2.5 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Book Consultation ↗
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="text-white/80 hover:text-brass p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-white p-1 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-charcoal/95 backdrop-blur-md flex flex-col items-center justify-center gap-6">
          {NAV_LINKS.map((l) => (
            <button
              key={l.target}
              onClick={() => go(l.target)}
              className="brand-mark text-2xl text-alabaster hover:text-brass transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onHomeowner();
            }}
            className="mt-2 btn-brass text-forest font-mono text-sm tracking-widest uppercase px-8 py-4 rounded-full"
          >
            Book Consultation ↗
          </button>
        </div>
      )}
    </>
  );
}
