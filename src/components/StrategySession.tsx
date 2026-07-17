import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, MapPin, CheckCircle2, User, Phone, Briefcase, Activity } from 'lucide-react';

interface MetroMarket {
  city: string;
  state: string;
  leadsLastHour: number;
  status: 'highly-active' | 'capacity-warning' | 'available';
  activeTradesCount: number;
}

export default function StrategySession() {
  const [selectedDay, setSelectedDay] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [formName, setFormName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formCompany, setFormCompany] = useState<string>('');
  const [booked, setBooked] = useState<boolean>(false);
  const [activeMarketIndex, setActiveMarketIndex] = useState<number>(0);

  const days = ['Tomorrow', 'Day After Tomorrow', 'Next Monday'];
  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];

  const metroMarkets: MetroMarket[] = [
    { city: 'Austin', state: 'TX', leadsLastHour: 24, status: 'highly-active', activeTradesCount: 8 },
    { city: 'Denver', state: 'CO', leadsLastHour: 18, status: 'highly-active', activeTradesCount: 7 },
    { city: 'Seattle', state: 'WA', leadsLastHour: 15, status: 'highly-active', activeTradesCount: 8 },
    { city: 'Miami', state: 'FL', leadsLastHour: 32, status: 'highly-active', activeTradesCount: 8 },
    { city: 'Boston', state: 'MA', leadsLastHour: 9, status: 'available', activeTradesCount: 6 },
    { city: 'Chicago', state: 'IL', leadsLastHour: 27, status: 'highly-active', activeTradesCount: 8 },
    { city: 'Phoenix', state: 'AZ', leadsLastHour: 22, status: 'highly-active', activeTradesCount: 7 },
    { city: 'Dallas', state: 'TX', leadsLastHour: 29, status: 'highly-active', activeTradesCount: 8 },
  ];

  // Rotate highlighted active metro region every 4 seconds to simulate a live command center
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMarketIndex((prev) => (prev + 1) % metroMarkets.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [metroMarkets.length]);

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      alert('Please provide your name and phone number to secure your session.');
      return;
    }
    setBooked(true);
  };

  return (
    <section id="strategy" className="py-24 sm:py-32 bg-alabaster relative border-b border-charcoal/10 scroll-mt-24">
      {/* Decorative architectural grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#2b2e33_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
            // METRIC-BASED ENGAGEMENT CALLS
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-charcoal">
            Align Your Revenue Pipeline Today
          </h2>
          <p className="text-muted-text font-light mt-4 text-base sm:text-lg">
            Schedule a 10-minute technical session. No sales pitches. Just numbers, current regional lead volumes, and available exclusive territory lock-out checks.
          </p>
        </div>

        {/* Grid split-screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-stretch">
          
          {/* Left Column: Premium Interactive Calendar & Booking */}
          <div className="lg:col-span-7 bg-white border border-charcoal/10 p-6 sm:p-10 shadow-xl flex flex-col justify-between">
            {!booked ? (
              <form onSubmit={handleBookSession} className="space-y-6">
                
                <div className="flex items-center space-x-2 text-terracotta border-b border-charcoal/5 pb-4 mb-4">
                  <Calendar className="w-5 h-5" />
                  <span className="font-mono text-xs tracking-wider uppercase font-bold">10-Minute Dispatch Allocation Call</span>
                </div>

                {/* Day Selection */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono tracking-wider text-muted-text uppercase">
                    1. Select Preferred Target Date
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {days.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`py-3 px-2 text-xs font-mono border text-center transition-all cursor-pointer ${
                          selectedDay === day
                            ? 'bg-charcoal text-alabaster border-charcoal font-bold'
                            : 'bg-alabaster text-muted-text border-charcoal/10 hover:border-charcoal'
                        }`}
                      >
                        {day.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono tracking-wider text-muted-text uppercase">
                    2. Select Target Time Block (EST)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {times.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 text-xs font-mono border text-center transition-all cursor-pointer ${
                          selectedTime === time
                            ? 'bg-terracotta text-alabaster border-terracotta font-bold'
                            : 'bg-white text-muted-text border-charcoal/10 hover:border-charcoal'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Identity Inputs */}
                <div className="space-y-4 pt-4 border-t border-charcoal/5">
                  <span className="block text-[10px] font-mono tracking-wider text-muted-text uppercase">
                    3. Dispatch Contact Parameters
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-alabaster border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-xs text-charcoal focus:outline-none focus:border-terracotta"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                      <input
                        type="tel"
                        placeholder="Mobile Line (For SMS Confirmation)"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full bg-alabaster border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-xs text-charcoal focus:outline-none focus:border-terracotta"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                    <input
                      type="text"
                      placeholder="Company Name (e.g. Dallas Roofing Pros)"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full bg-alabaster border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-xs text-charcoal focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full bg-charcoal hover:bg-terracotta text-alabaster py-4 font-mono text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>SECURE FREE PIPELINE SESSION ➔</span>
                </button>

              </form>
            ) : (
              /* Success message state */
              <div className="text-center py-12 space-y-6 flex flex-col justify-center items-center h-full">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="font-mono text-xs tracking-widest text-emerald-600 font-bold uppercase block">
                    SESSION CONFIRMED
                  </span>
                  <h3 className="text-2xl font-display font-black text-charcoal uppercase leading-none">
                    Session Locked!
                  </h3>
                  <p className="text-muted-text text-sm font-light max-w-sm mx-auto">
                    We have reserved <strong>{selectedDay} at {selectedTime} (EST)</strong> for {formCompany || 'your company'}.
                  </p>
                </div>

                <div className="bg-alabaster p-4 text-left space-y-2 font-mono text-[11px] text-muted-text max-w-sm border border-charcoal/10">
                  <div className="font-bold text-charcoal uppercase border-b border-charcoal/5 pb-1">Dispatch Code: #RC-SESSION</div>
                  <div>Client Representative: <strong>Michael (Director of Growth)</strong></div>
                  <div>Bridge Phone line: <strong>SMS link sent to {formPhone}</strong></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBooked(false);
                    setFormName('');
                    setFormPhone('');
                    setFormCompany('');
                  }}
                  className="text-xs font-mono text-charcoal hover:text-terracotta underline uppercase tracking-wider cursor-pointer"
                >
                  Reschedule Session
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Rotating Live Metro Dispatch Command Board */}
          <div className="lg:col-span-5 bg-charcoal text-alabaster border border-white/10 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            
            {/* Command room map grids decor */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none font-display font-black text-9xl">
              RC
            </div>

            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-terracotta animate-pulse" />
                  <span className="font-mono text-xs tracking-wider uppercase font-bold text-alabaster">Live Metro Dispatch Feed</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[9px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>TRANSMITTING ACTIVE</span>
                </div>
              </div>

              <p className="text-alabaster/60 font-sans font-light text-xs sm:text-sm leading-relaxed mb-6">
                Inquiries are rotating, filtering, and bridging to verified local companies in real-time. Lock-out protection is active on highlighted nodes:
              </p>

              {/* Rotated Active Metro Markets Stack */}
              <div className="space-y-3">
                {metroMarkets.map((market, idx) => {
                  const isActive = idx === activeMarketIndex;
                  return (
                    <div
                      key={market.city}
                      className={`p-3.5 border transition-all duration-500 font-mono text-xs flex justify-between items-center ${
                        isActive
                          ? 'bg-white text-charcoal border-white shadow-xl scale-[1.02] translate-x-1 font-bold'
                          : 'bg-white/[0.02] text-alabaster/70 border-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className={`w-4 h-4 ${isActive ? 'text-terracotta' : 'text-alabaster/30'}`} />
                        <span>
                          {market.city}, {market.state}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className={`text-[10px] block ${isActive ? 'text-charcoal/60' : 'text-alabaster/40'}`}>
                            LAST HR DEMAND
                          </span>
                          <span className={`${isActive ? 'text-terracotta' : 'text-emerald-400'} font-bold`}>
                            +{market.leadsLastHour} matching flows
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="bg-white/[0.03] border border-white/5 p-4 text-[10px] font-mono text-alabaster/50 mt-6 leading-relaxed">
              * Redundant backup lines are maintained to guarantee &gt; 99.8% geo-bridge dispatch uptime. Available trades updated hourly.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
