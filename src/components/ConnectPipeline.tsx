import React, { useState } from 'react';
import { Mail, Phone, Calendar as CalendarIcon, Clock, Users, ArrowRight, CheckCircle, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';
import AmbientGlow from './AmbientGlow';
import Parallax from './Parallax';

const DAYS = [
  { day: 15, name: 'Wed', available: true },
  { day: 16, name: 'Thu', available: true },
  { day: 17, name: 'Fri', available: true },
  { day: 18, name: 'Sat', available: false },
  { day: 19, name: 'Sun', available: false },
  { day: 20, name: 'Mon', available: true },
  { day: 21, name: 'Tue', available: true },
  { day: 22, name: 'Wed', available: true },
  { day: 23, name: 'Thu', available: true },
  { day: 24, name: 'Fri', available: true },
];

const SLOTS = ['09:00 AM', '10:15 AM', '11:30 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'];

export default function ConnectPipeline() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [booked, setBooked] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneOk = phone.replace(/\D/g, '').length >= 10;
  const zipOk = zip.trim().length >= 4;
  const addressOk = address.trim().length >= 4;
  const nameOk = name.trim().length >= 2;

  // Strict: every field (incl. location) is required before confirming.
  const canConfirm = Boolean(
    selectedDate && selectedTime && nameOk && emailOk && phoneOk && zipOk && addressOk
  );

  return (
    <section id="connect" className="py-24 sm:py-32 bg-forest text-ink relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#D9A05B_1px,transparent_1px)] [background-size:16px_16px]" />
      <AmbientGlow className="w-[460px] h-[460px] bottom-0 left-1/4" color="radial-gradient(circle at 50% 50%, rgba(217,160,91,0.32), transparent 70%)" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Parallax distance={50} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: homeowner-facing intro */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
                // BOOK A CONSULTATION
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight uppercase leading-none text-ink">
                Book Your Consultation
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed max-w-md mt-4">
                Book a free 10-minute consultation with our homeowner team. We’ll learn about your project, match you with a verified pro who serves your postal code, and schedule their visit — no fees to you, ever.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:hello@referralclose.com"
                className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-[20px] p-5 hover:border-brass transition-colors"
              >
                <Mail className="w-5 h-5 text-brass" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/70">Email</div>
                  <div className="text-ink font-medium">hello@referralclose.com</div>
                </div>
              </a>
              <a
                href="tel:1-800-REF-CLOS"
                className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-[20px] p-5 hover:border-brass transition-colors"
              >
                <Phone className="w-5 h-5 text-brass" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/70">Phone</div>
                  <div className="text-ink font-medium">1-800-REF-CLOS</div>
                </div>
              </a>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[20px] p-5 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-brass shrink-0 mt-0.5" />
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Free for homeowners. We only earn a small commission from the pro we match you with — booking a call costs you nothing.
              </p>
            </div>
          </div>

          {/* Right: live calendar + strict intake */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl uppercase tracking-tight text-ink">Select Date & Time</h3>
                  <p className="text-xs text-ink-muted font-mono">Free 10-Min Consultation</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Users className="w-3.5 h-3.5 text-brass" />
                  <span>1-on-1 with our team</span>
                </div>
              </div>

              {!booked ? (
                <>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted block mb-2">
                    July 2026 Calendar
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
                    {DAYS.map((d) => (
                      <button
                        key={d.day}
                        disabled={!d.available}
                        onClick={() => setSelectedDate(d.day)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-[20px] border transition-all text-xs ${
                          !d.available
                            ? 'bg-white/5 border-white/5 text-ink/30 cursor-not-allowed'
                            : selectedDate === d.day
                            ? 'btn-brass border-brass text-forest shadow-md'
                            : 'bg-white/5 border-white/5 text-ink hover:border-brass/60'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold text-ink-muted">{d.name}</span>
                        <span className="font-mono text-sm font-bold">{d.day}</span>
                      </button>
                    ))}
                  </div>

                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted block mb-2">
                    Available slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3 px-2 rounded-[20px] text-xs font-mono text-center border transition-all ${
                          selectedTime === slot
                            ? 'btn-brass border-brass text-forest font-semibold'
                            : 'bg-white/5 border-white/5 text-ink hover:border-brass/60'
                        }`}
                      >
                        <Clock className="w-3 h-3 inline mr-1.5 text-brass" />
                        {slot}
                      </button>
                    ))}
                  </div>

                  {/* Strict homeowner intake */}
                  <div className="space-y-3 mb-6">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/5 rounded-[20px] py-3.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-3.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
                      />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-3.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                      <input
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="Postal code (so we match a local pro)"
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address / neighborhood"
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
                      />
                    </div>
                  </div>

                  <button
                    disabled={!canConfirm}
                    onClick={() => {
                      setBooked(true);
                    }}
                    className="btn-amber w-full text-white font-semibold px-6 py-4 rounded-full text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    Confirm Consultation <ArrowRight className="w-4 h-4" />
                  </button>
                  {!canConfirm && (
                    <p className="text-[11px] font-mono text-ink-muted/70 text-center mt-3">
                      Select a date, time, and fill every field to confirm.
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="inline-flex p-4 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-ink uppercase">Consultation Confirmed!</h3>
                  <p className="text-sm text-ink-muted max-w-sm mx-auto">
                    We locked in your free consultation for July {selectedDate}, 2026 at {selectedTime}. Our team will call {phone} to plan your project and match you with a verified pro near {address}{zip ? `, ${zip}` : ''}.
                  </p>
                  <button
                    onClick={() => {
                      setBooked(false);
                      setSelectedTime('');
                      setSelectedDate(null);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setZip('');
                      setAddress('');
                    }}
                    className="text-xs font-mono font-bold uppercase text-brass hover:underline"
                  >
                    Book another consultation ↗
                  </button>
                </div>
              )}
            </GlassCard>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
