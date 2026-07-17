import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, Menu, X, ArrowRight, HardHat, DollarSign } from 'lucide-react';

interface HeaderProps {
  onNavToFunnel: (mode: 'homeowner' | 'contractor') => void;
}

export default function Header({ onNavToFunnel }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-alabaster/95 backdrop-blur-md py-4 border-charcoal/15 shadow-sm'
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo and Wordmark */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 bg-terracotta flex items-center justify-center text-alabaster font-bold text-lg font-display tracking-tight transition-transform group-hover:scale-105">
            RC
          </div>
          <span className="font-display font-bold tracking-[0.2em] text-lg text-charcoal">
            REFERRAL<span className="text-terracotta">CLOSE</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('marketplace')}
            className="text-charcoal/80 hover:text-terracotta text-sm font-medium tracking-wide transition-colors cursor-pointer"
          >
            Lead Marketplace
          </button>
          <button
            onClick={() => scrollToSection('why-us')}
            className="text-charcoal/80 hover:text-terracotta text-sm font-medium tracking-wide transition-colors cursor-pointer"
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="text-charcoal/80 hover:text-terracotta text-sm font-medium tracking-wide transition-colors cursor-pointer"
          >
            Trust Wall
          </button>
          <button
            onClick={() => scrollToSection('strategy')}
            className="text-charcoal/80 hover:text-terracotta text-sm font-medium tracking-wide transition-colors cursor-pointer"
          >
            Align Pipeline
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => {
              onNavToFunnel('homeowner');
              scrollToSection('funnel-section');
            }}
            className="border border-charcoal/15 text-charcoal hover:bg-charcoal/5 px-4 py-2.5 text-xs font-mono tracking-wider transition-colors cursor-pointer"
          >
            FIND A PRO
          </button>
          <button
            onClick={() => {
              onNavToFunnel('contractor');
              scrollToSection('funnel-section');
            }}
            className="bg-charcoal text-alabaster hover:bg-terracotta px-4 py-2.5 text-xs font-mono tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer"
          >
            <span>CLAIM LEADS ↗</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-4">
          <button
            onClick={() => {
              onNavToFunnel('contractor');
              scrollToSection('funnel-section');
            }}
            className="bg-terracotta text-alabaster p-2 text-xs font-mono tracking-wider"
          >
            Apply Now
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-charcoal p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-alabaster border-b border-charcoal/15 shadow-lg px-6 py-8 flex flex-col space-y-6">
          <button
            onClick={() => scrollToSection('marketplace')}
            className="text-left text-charcoal font-display text-lg tracking-wide border-b border-charcoal/5 pb-2"
          >
            Lead Marketplace
          </button>
          <button
            onClick={() => scrollToSection('why-us')}
            className="text-left text-charcoal font-display text-lg tracking-wide border-b border-charcoal/5 pb-2"
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="text-left text-charcoal font-display text-lg tracking-wide border-b border-charcoal/5 pb-2"
          >
            Trust Wall
          </button>
          <button
            onClick={() => scrollToSection('strategy')}
            className="text-left text-charcoal font-display text-lg tracking-wide border-b border-charcoal/5 pb-2"
          >
            Align Pipeline
          </button>
          <div className="pt-4 flex flex-col space-y-3">
            <button
              onClick={() => {
                onNavToFunnel('homeowner');
                scrollToSection('funnel-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center border border-charcoal/15 text-charcoal py-3 text-xs font-mono tracking-widest hover:bg-charcoal/5"
            >
              FIND A VERIFIED PRO
            </button>
            <button
              onClick={() => {
                onNavToFunnel('contractor');
                scrollToSection('funnel-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-charcoal text-alabaster py-3 text-xs font-mono tracking-widest hover:bg-terracotta"
            >
              CONTRACTOR APPLY ↗
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
