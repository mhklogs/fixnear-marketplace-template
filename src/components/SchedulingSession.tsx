import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, Users, ArrowRight, CheckCircle, 
  MapPin, Check, Building2, Phone, Mail, Sliders, CheckSquare, Sparkles 
} from 'lucide-react';
import { TRADE_CATEGORIES, ACTIVE_U_S_CITIES } from '../data';
import { BookingState } from '../types';

export default function SchedulingSession() {
  const [selectedDate, setSelectedDate] = useState<number>(17); // Default to July 17, 2026 (Friday)
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1: Date/Time, 2: Business Info, 3: Success
  const [booking, setBooking] = useState<BookingState>({
    date: 'Friday, July 17, 2026',
    time: '',
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    trade: 'Roofing & Gutters',
    dailyBudget: 150,
    zipCodes: '78701, 78704, 78745',
    booked: false
  });

  const [hoveredMarket, setHoveredMarket] = useState<string>('Austin, TX');

  const daysInJuly2026 = [
    { day: 15, name: 'Wed', isToday: true, available: true },
    { day: 16, name: 'Thu', isToday: false, available: true },
    { day: 17, name: 'Fri', isToday: false, available: true },
    { day: 18, name: 'Sat', isToday: false, available: false },
    { day: 19, name: 'Sun', isToday: false, available: false },
    { day: 20, name: 'Mon', isToday: false, available: true },
    { day: 21, name: 'Tue', isToday: false, available: true },
    { day: 22, name: 'Wed', isToday: false, available: true },
    { day: 23, name: 'Thu', isToday: false, available: true },
    { day: 24, name: 'Fri', isToday: false, available: true },
  ];

  const timeSlots = [
    '09:00 AM', '10:15 AM', '11:30 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'
  ];

  const handleSelectDate = (day: number, name: string) => {
    setSelectedDate(day);
    setBooking(prev => ({
      ...prev,
      date: `${name === 'Wed' ? 'Wednesday' : name === 'Thu' ? 'Thursday' : name === 'Fri' ? 'Friday' : name === 'Mon' ? 'Monday' : 'Tuesday'}, July ${day}, 2026`
    }));
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setBooking(prev => ({ ...prev, booked: true }));
  };

  return (
    <section id="strategy-session" className="py-24 bg-charcoal text-offwhite relative overflow-hidden">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#5E7D2A_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left / Info & Interactive Markets Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-2 bg-terra/10 border border-terra/30 px-3 py-1 rounded-full text-terra text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Growth Consult
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight uppercase leading-none">
                LET'S ALIGN <br />
                <span className="text-terra">YOUR PIPELINE</span>
              </h2>
              <p className="text-sm text-warmgray leading-relaxed max-w-md">
                Book a 10-minute technical onboarding call with our contractor growth team. We will map out your service area, set up your target zip codes, and configure your daily lead budgets.
              </p>
            </div>

            {/* Interactive Market Showcase */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-warmgray">Currently Activating Territories</h4>
                <span className="text-[10px] bg-green-500/20 text-green-400 font-mono px-2 py-0.5 rounded-full border border-green-500/30">Live Dispatch</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ACTIVE_U_S_CITIES.map((city) => (
                  <button
                    key={city}
                    onMouseEnter={() => setHoveredMarket(city)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      hoveredMarket === city
                        ? 'bg-terra/20 border-terra text-offwhite'
                        : 'bg-white/5 border-white/10 text-warmgray hover:bg-white/10'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-terra" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-[11px] text-warmgray italic pt-2">
                * Selected market: <span className="text-terra font-semibold not-italic">{hoveredMarket}</span> is experiencing extreme homeowner demand in plumbing & HVAC categories.
              </p>
            </div>

            {/* Quick Benefits Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="bg-terra/10 text-terra p-1 rounded-full shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-xs text-warmgray leading-relaxed">
                  <strong className="text-offwhite">Exclusive Territory Locks:</strong> Claim custom zip codes before competitor capping limits.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-terra/10 text-terra p-1 rounded-full shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-xs text-warmgray leading-relaxed">
                  <strong className="text-offwhite">Zero Agency Contracts:</strong> Pay strictly per dispatch. Pause, change, or terminate lead routing in 1 tap.
                </p>
              </div>
            </div>
          </div>

          {/* Right / Live Minimal Calendar Widget (Col-span 7) */}
          <div className="lg:col-span-7">
            <div className="bg-alabaster rounded-3xl p-6 md:p-8 text-charcoal shadow-2xl border border-charcoal/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-terra/5 rounded-full blur-2xl" />
              
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl tracking-tight text-charcoal uppercase">
                          Select Date & Time
                        </h3>
                        <p className="text-xs text-warmgray">10-Min Strategy Call (July 2026)</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-warmgray font-mono bg-charcoal/5 px-3 py-1.5 rounded-xl border border-charcoal/10">
                        <Users className="w-3.5 h-3.5 text-terra" />
                        <span>1-on-1 with Territory Director</span>
                      </div>
                    </div>

                    {/* Date Horizontal Row */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-warmgray block">
                        July 2026 Calendar
                      </label>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {daysInJuly2026.map((d) => (
                          <button
                            key={d.day}
                            disabled={!d.available}
                            onClick={() => handleSelectDate(d.day, d.name)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs ${
                              !d.available
                                ? 'bg-charcoal/5 border-charcoal/5 text-charcoal/30 cursor-not-allowed'
                                : selectedDate === d.day
                                ? 'bg-terra border-terra text-white shadow-md'
                                : 'bg-white border-charcoal/15 text-charcoal hover:border-charcoal/40'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-semibold text-warmgray group-hover:text-charcoal block mb-1">
                              {d.name}
                            </span>
                            <span className="font-mono text-sm font-bold">{d.day}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time slots grid */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-warmgray block">
                        Available slots ({booking.date})
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 px-2 rounded-xl text-xs font-mono text-center border transition-all ${
                              selectedTime === slot
                                ? 'bg-charcoal border-charcoal text-white font-semibold'
                                : 'bg-white border-charcoal/15 text-charcoal hover:border-charcoal/30'
                            }`}
                          >
                            <Clock className="w-3 h-3 inline mr-1.5 text-terra" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-charcoal/10 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!selectedTime}
                        className="bg-terra hover:bg-terra/90 text-white font-semibold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                      >
                        Enter Contractor Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={handleBookSession} className="space-y-5">
                      <div className="flex justify-between items-center border-b border-charcoal/10 pb-4">
                        <div>
                          <h3 className="font-display font-bold text-xl tracking-tight text-charcoal uppercase">
                            Configure Profile
                          </h3>
                          <p className="text-xs text-warmgray">Selected: {booking.date} at {selectedTime}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs text-warmgray hover:text-charcoal underline"
                        >
                          Change slot
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Full Name</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray"><Users className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              required
                              value={booking.fullName}
                              onChange={(e) => setBooking(prev => ({ ...prev, fullName: e.target.value }))}
                              placeholder="John Doe"
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Company Name</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray"><Building2 className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              required
                              value={booking.businessName}
                              onChange={(e) => setBooking(prev => ({ ...prev, businessName: e.target.value }))}
                              placeholder="Austin Premier Roofing"
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Mobile Phone (For Onboarding SMS Alert)</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray"><Phone className="w-3.5 h-3.5" /></span>
                            <input
                              type="tel"
                              required
                              value={booking.phone}
                              onChange={(e) => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="512-555-0199"
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Email Address</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray"><Mail className="w-3.5 h-3.5" /></span>
                            <input
                              type="email"
                              required
                              value={booking.email}
                              onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@austinpremierroofing.com"
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Core Service Trade</label>
                          <select
                            value={booking.trade}
                            onChange={(e) => setBooking(prev => ({ ...prev, trade: e.target.value }))}
                            className="w-full bg-white border border-charcoal/15 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-terra"
                          >
                            {TRADE_CATEGORIES.map(t => (
                              <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Ideal Monthly Lead Budget ($)</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-warmgray font-bold">$</span>
                            <input
                              type="number"
                              min={100}
                              step={50}
                              value={booking.dailyBudget}
                              onChange={(e) => setBooking(prev => ({ ...prev, dailyBudget: Number(e.target.value) }))}
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-7 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-warmgray mb-1">Target Zip Codes</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray"><MapPin className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              value={booking.zipCodes}
                              onChange={(e) => setBooking(prev => ({ ...prev, zipCodes: e.target.value }))}
                              placeholder="78704, 78745"
                              className="w-full bg-white border border-charcoal/15 rounded-xl py-2.5 pl-9 pr-3 text-xs text-charcoal focus:outline-none focus:border-terra"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-charcoal/10 flex justify-end">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-terra hover:bg-terra/90 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                        >
                          Confirm Onboarding Session
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full border border-green-200">
                      <CheckCircle className="w-10 h-10 animate-bounce" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-2xl text-charcoal tracking-tight uppercase">
                        SESSION CONFIRMED!
                      </h3>
                      <p className="text-xs text-warmgray max-w-sm mx-auto">
                        Amazing, <span className="font-semibold text-charcoal">{booking.fullName}</span>. We locked in your strategy call with our growth specialist. We're looking forward to speaking on <span className="font-semibold text-charcoal">{booking.date} at {selectedTime}</span>.
                      </p>
                    </div>

                    <div className="bg-white border border-charcoal/10 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto shadow-sm">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-warmgray font-bold border-b border-charcoal/5 pb-2">Onboarding Roadmap</h4>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-terra/15 text-terra text-[10px] font-bold px-2 py-0.5 rounded-md font-mono mt-0.5">STEP 1</span>
                        <div>
                          <p className="font-semibold text-charcoal">Exclusive Territory Mapping</p>
                          <p className="text-[11px] text-warmgray mt-0.5">We will lock down zip codes: <span className="font-mono text-charcoal">{booking.zipCodes}</span> and blacklist other HVAC contractors in these regions.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="bg-terra/15 text-terra text-[10px] font-bold px-2 py-2.5 rounded-md font-mono mt-0.5">STEP 2</span>
                        <div>
                          <p className="font-semibold text-charcoal">Lead Delivery Setup</p>
                          <p className="text-[11px] text-warmgray mt-0.5">Configuring instant automated OTP validation SMS and linking your phone number for immediate dispatch.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="bg-terra/15 text-terra text-[10px] font-bold px-2 py-0.5 rounded-md font-mono mt-0.5">STEP 3</span>
                        <div>
                          <p className="font-semibold text-charcoal">$100 Lead Credit Activated</p>
                          <p className="text-[11px] text-warmgray mt-0.5">We have automatically loaded $100 starting credit into your potential dashboard for testing.</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-warmgray">
                      A calendar invite and SMS confirmation have been sent to <span className="font-medium text-charcoal">{booking.email}</span>.
                    </p>

                    <div>
                      <button
                        onClick={() => {
                          setStep(1);
                          setSelectedTime('');
                        }}
                        className="text-xs font-mono font-bold uppercase text-terra hover:underline"
                      >
                        Book another session ↗
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
