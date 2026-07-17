import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, TrendingUp, Award, Clock } from 'lucide-react';

export default function Metrics() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const metricsData = [
    {
      id: 1,
      stat: "< 60s",
      title: "SMS MATCH SPEED",
      description: "Automated routing logic dispatches package-encrypted leads to matched local pros in real-time.",
      accent: "LEAD DISPATCH",
      // High res roofing or modern metal roof close-up
      image: "https://images.unsplash.com/photo-1635424710928-0544e8512eae?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      stat: "40% - 50%",
      title: "CONTRACTOR CLOSE RATE",
      description: "Contractors claim high-ticket leads representing high-intent active buyer budgets instantly.",
      accent: "HIGH ROI CONVERSION",
      // Modern high-end HVAC climate control zoning
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      stat: "4.8 ★",
      title: "VETTED NETWORK SCORE",
      description: "We require active liability insurance, state licensing, and strict satisfaction thresholds.",
      accent: "ELITE VERIFICATION",
      // Flawless surface finishing painted wall and warm afternoon lights
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    <section className="py-24 bg-charcoal text-alabaster relative overflow-hidden border-t border-b border-alabaster/10">
      {/* Background visual texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-alabaster" />
        <div className="absolute top-0 left-1/3 bottom-0 w-[1px] bg-alabaster" />
        <div className="absolute top-0 left-2/3 bottom-0 w-[1px] bg-alabaster" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="max-w-xl mb-16">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
            // PLATFORM METRICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-alabaster">
            The Referral Marketplace Advantage
          </h2>
          <p className="text-alabaster/60 font-light mt-3">
            Hover over each performance metric to reveal the underlying residential craftsmanship and active dispatch networks.
          </p>
        </div>

        {/* 3-Column Minimalist Metrics with Hover Transformations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metricsData.map((metric) => {
            const isHovered = hoveredCard === metric.id;

            return (
              <div
                key={metric.id}
                onMouseEnter={() => setHoveredCard(metric.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative min-h-[380px] transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer border border-alabaster/10 overflow-hidden"
              >
                {/* Background Image Layer (Active on Hover) */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500 ease-out scale-105"
                  style={{
                    backgroundImage: `url('${metric.image}')`,
                    opacity: isHovered ? 0.35 : 0,
                    filter: isHovered ? 'grayscale(30%) blur(1px)' : 'none',
                    transform: isHovered ? 'scale(1)' : 'scale(1.05)',
                  }}
                />

                {/* Background Overlay (Changes on Hover) */}
                <div 
                  className={`absolute inset-0 transition-colors duration-500 ${
                    isHovered ? 'bg-charcoal/90' : 'bg-white'
                  }`}
                />

                {/* Content Container */}
                <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full w-full">
                  
                  {/* Top line Accent & Icon */}
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
                      isHovered ? 'text-terracotta' : 'text-muted-text'
                    }`}>
                      {metric.accent}
                    </span>
                    <Clock className={`w-4 h-4 transition-colors duration-300 ${
                      isHovered ? 'text-alabaster/40' : 'text-charcoal/30'
                    }`} />
                  </div>

                  {/* Main Stat and Title */}
                  <div className="my-auto py-8">
                    <motion.div 
                      layout
                      className={`text-5xl sm:text-6xl font-display font-bold tracking-tight mb-2 transition-colors duration-300 ${
                        isHovered ? 'text-alabaster' : 'text-charcoal'
                      }`}
                    >
                      {metric.stat}
                    </motion.div>
                    
                    <h3 className={`font-display text-sm font-semibold tracking-wider transition-colors duration-300 ${
                      isHovered ? 'text-terracotta' : 'text-charcoal/80'
                    }`}>
                      {metric.title}
                    </h3>
                  </div>

                  {/* Description reveals or gets highlighted */}
                  <p className={`text-sm leading-relaxed font-light transition-colors duration-300 ${
                    isHovered ? 'text-alabaster/80' : 'text-muted-text'
                  }`}>
                    {metric.description}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
