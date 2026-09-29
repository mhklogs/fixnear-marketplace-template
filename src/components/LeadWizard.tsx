import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Wrench, ShieldCheck, Phone, Mail, 
  User, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Flame, Calendar, Sparkles, PhoneCall
} from 'lucide-react';
import { TRADE_CATEGORIES } from '../data';
import { OnboardingState } from '../types';

interface LeadWizardProps {
  onClose: () => void;
  onLeadSubmitted: (leadData: {
    id: string;
    trade: string;
    location: string;
    price: number;
    fullName: string;
    phone: string;
    projectScope: string;
  }) => void;
}

export default function LeadWizard({ onClose, onLeadSubmitted }: LeadWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<OnboardingState>({
    trade: 'Roofing & Gutters',
    zipCode: '',
    projectScope: 'Full Replacement / Major Project',
    timeframe: 'Immediately (Emergency/Urgent)',
    fullName: '',
    phone: '',
    email: '',
    otpCode: '',
    isOtpSent: false,
    isOtpVerified: false,
    submitted: false
  });

  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [showOtpBanner, setShowOtpBanner] = useState<boolean>(false);
  const [zipError, setZipError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const handleTradeSelect = (tradeName: string) => {
    setState(prev => ({ ...prev, trade: tradeName }));
    setStep(2);
  };

  const validateZip = () => {
    const zipPattern = /^\d{5}$/;
    if (!zipPattern.test(state.zipCode)) {
      setZipError('Please enter a valid 5-digit US zip code.');
      return false;
    }
    setZipError('');
    return true;
  };

  const validateContact = () => {
    let valid = true;
    if (!state.fullName.trim()) {
      valid = false;
    }
    const phonePattern = /^\d{10}$/;
    const cleanPhone = state.phone.replace(/\D/g, '');
    if (!phonePattern.test(cleanPhone)) {
      setPhoneError('Please enter a 10-digit phone number (e.g., 5125550199).');
      valid = false;
    } else {
      setPhoneError('');
    }
    return valid;
  };

  const handleSendOtp = () => {
    if (!validateContact()) return;
    
    // Generate a beautiful 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setState(prev => ({ ...prev, isOtpSent: true }));
    setShowOtpBanner(true);
  };

  const handleVerifyOtp = () => {
    if (state.otpCode === generatedOtp) {
      setState(prev => ({ ...prev, isOtpVerified: true, submitted: true }));
      
      // Get trade price
      const selectedTradeObj = TRADE_CATEGORIES.find(t => t.name === state.trade);
      const price = selectedTradeObj ? selectedTradeObj.estPrice : 45.00;

      // Pass the submitted lead up to trigger the live dashboard simulation
      onLeadSubmitted({
        id: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
        trade: state.trade,
        location: `Zip Code ${state.zipCode}`,
        price: price,
        fullName: state.fullName,
        phone: state.phone,
        projectScope: state.projectScope
      });

      setStep(5);
    } else {
      setState(prev => ({ ...prev, otpError: 'Incorrect OTP. Try entering ' + generatedOtp + '.' }));
    }
  };

  // Quick lookup for cities based on generic US regions for presentation
  const getCityFromZip = (zip: string) => {
    const firstDigit = zip.charAt(0);
    switch(firstDigit) {
      case '0': return 'Boston, MA';
      case '1': return 'Philadelphia, PA';
      case '2': return 'Atlanta, GA';
      case '3': return 'Orlando, FL';
      case '4': return 'Columbus, OH';
      case '5': return 'Minneapolis, MN';
      case '6': return 'Chicago, IL';
      case '7': return 'Austin, TX';
      case '8': return 'Denver, CO';
      case '9': return 'Seattle, WA';
      default: return 'Active FixNear Network';
    }
  };

  return (
    <div id="lead-wizard-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md">
      {/* Simulation OTP Toast Banner */}
      <AnimatePresence>
        {showOtpBanner && !state.isOtpVerified && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm bg-terra text-white shadow-2xl rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <PhoneCall className="w-5 h-5 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wider text-white/80">Automated OTP Verification SMS</p>
                <p className="text-sm font-semibold mt-1">
                  FixNear: Your verification code is <span className="font-mono text-lg tracking-wider underline font-extrabold text-white">{generatedOtp}</span>.
                </p>
                <p className="text-[10px] text-white/70 mt-1">This simulates our instant automated voice & text verification service.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-alabaster w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-charcoal/10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-charcoal px-6 py-6 text-white flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terra animate-ping" />
            <h3 className="font-display font-semibold tracking-tight text-lg text-offwhite uppercase">
              Homeowner Lead Verification Wizard
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-charcoal/20 w-full relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-terra"
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Main Content Scrollable Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Trade */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">
                    What trade do you need?
                  </h4>
                  <p className="text-sm text-warmgray mt-1">
                    Select a service category to find the absolute top-rated exclusive contractors in your territory.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TRADE_CATEGORIES.map((trade) => (
                    <button
                      key={trade.id}
                      onClick={() => handleTradeSelect(trade.name)}
                      className={`flex items-start text-left p-4 rounded-2xl border transition-all group ${
                        state.trade === trade.name 
                          ? 'border-terra bg-white shadow-md' 
                          : 'border-charcoal/10 bg-white/50 hover:bg-white hover:border-charcoal/30'
                      }`}
                    >
                      <div className="mr-3 mt-1 bg-terra/10 text-terra p-2 rounded-xl group-hover:scale-105 transition-transform">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-display font-semibold text-sm text-charcoal">{trade.name}</h5>
                        <p className="text-[11px] text-warmgray mt-0.5 line-clamp-2 leading-relaxed">{trade.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-warmgray">
                          <span className="bg-charcoal/5 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold">Active Volume: {trade.monthlyVolume}/mo</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Zip Code */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div>
                  <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">
                    Where is the project located?
                  </h4>
                  <p className="text-sm text-warmgray mt-1">
                    Enter your zip code so we can verify territory coverage for <span className="text-terra font-semibold">{state.trade}</span>.
                  </p>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warmgray">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="e.g. 78704"
                      value={state.zipCode}
                      onChange={(e) => {
                        const cleanVal = e.target.value.replace(/\D/g, '');
                        setState(prev => ({ ...prev, zipCode: cleanVal }));
                      }}
                      className="w-full bg-white border border-charcoal/15 rounded-2xl py-4 pl-12 pr-4 text-lg font-mono focus:border-terra focus:ring-1 focus:ring-terra focus:outline-none transition-all tracking-widest placeholder:tracking-normal placeholder:font-sans"
                    />
                  </div>

                  {zipError && (
                    <div className="flex items-center gap-2 text-terra text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>{zipError}</span>
                    </div>
                  )}

                  {state.zipCode.length === 5 && !zipError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-terra/5 border border-terra/20 rounded-2xl p-4 flex gap-3 items-center"
                    >
                      <ShieldCheck className="w-5 h-5 text-terra shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-charcoal">Verified Coverage Active!</p>
                        <p className="text-[11px] text-warmgray mt-0.5">
                          Target territory: <span className="font-medium text-charcoal">{getCityFromZip(state.zipCode)}</span>. Exclusive pros are standby.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-charcoal/10">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-warmgray hover:text-charcoal font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Trades
                  </button>
                  <button
                    onClick={() => {
                      if (validateZip()) {
                        setStep(3);
                      }
                    }}
                    disabled={state.zipCode.length < 5}
                    className="bg-charcoal hover:bg-terra text-white rounded-2xl px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:hover:bg-charcoal"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Project Scope & Timeframe */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">
                    Describe your {state.trade} project
                  </h4>
                  <p className="text-sm text-warmgray mt-1">
                    Providing accurate details matches you with the exact specialized contractor with the right budget tier.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-warmgray mb-1.5">Project Scope</label>
                    <select
                      value={state.projectScope}
                      onChange={(e) => setState(prev => ({ ...prev, projectScope: e.target.value }))}
                      className="w-full bg-white border border-charcoal/15 rounded-2xl p-4.5 text-sm text-charcoal focus:border-terra focus:outline-none transition-all"
                    >
                      <option value="Full Replacement / Major Project">Full Replacement / Major Project</option>
                      <option value="Partial Installation / Area Addition">Partial Installation / Area Addition</option>
                      <option value="Minor Repair / Repair Callout">Minor Repair / Repair Callout</option>
                      <option value="Inspection, Maintenance, & Safety Check">Inspection, Maintenance, & Safety Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-warmgray mb-1.5">Required Timeframe</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Emergency / ASAP', value: 'Immediately (Emergency/Urgent)', icon: Flame },
                        { label: 'Next 1-2 Weeks', value: 'In the next 1-2 weeks', icon: Calendar },
                        { label: 'Planning / Quote stage', value: 'Flexible / In the next month', icon: Sparkles }
                      ].map((t) => {
                        const IconComponent = t.icon;
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setState(prev => ({ ...prev, timeframe: t.value }))}
                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${
                              state.timeframe === t.value 
                                ? 'border-terra bg-white shadow-sm ring-1 ring-terra' 
                                : 'border-charcoal/10 bg-white/50 hover:bg-white'
                            }`}
                          >
                            <IconComponent className={`w-5 h-5 ${state.timeframe === t.value ? 'text-terra' : 'text-warmgray'}`} />
                            <div>
                              <p className="text-xs font-semibold text-charcoal">{t.label}</p>
                              <p className="text-[10px] text-warmgray mt-0.5 leading-tight">{t.value}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-charcoal/10">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-sm text-warmgray hover:text-charcoal font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Location
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="bg-charcoal hover:bg-terra text-white rounded-2xl px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Contact & OTP Send */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {!state.isOtpSent ? (
                  <>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">
                        Connect with the local dispatch team
                      </h4>
                      <p className="text-sm text-warmgray mt-1">
                        Every lead on FixNear requires verification. Real contractors, real active budgets, phone verified instantly.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-warmgray mb-1.5">Full Name</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warmgray">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="e.g. John Doe"
                              value={state.fullName}
                              onChange={(e) => setState(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full bg-white border border-charcoal/15 rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-terra focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-warmgray mb-1.5">Email Address</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warmgray">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder="e.g. john@example.com"
                              value={state.email}
                              onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full bg-white border border-charcoal/15 rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-terra focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-warmgray mb-1.5">
                          Phone Number (For OTP Validation SMS)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warmgray">
                            <Phone className="w-4 h-4" />
                          </span>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 5125550199 (10-digit number)"
                            value={state.phone}
                            onChange={(e) => {
                              const cleanVal = e.target.value.replace(/\D/g, '');
                              setState(prev => ({ ...prev, phone: cleanVal }));
                            }}
                            className="w-full bg-white border border-charcoal/15 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans focus:border-terra focus:outline-none transition-all"
                          />
                        </div>
                        {phoneError && (
                          <div className="flex items-center gap-2 text-terra text-xs mt-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>{phoneError}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-warmgray mt-1.5 leading-relaxed">
                          By clicking "Verify phone", you authorize FixNear to send a standard automated confirmation PIN to your phone number. No sales spam.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-charcoal/10">
                      <button
                        onClick={() => setStep(3)}
                        className="flex items-center gap-1.5 text-sm text-warmgray hover:text-charcoal font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Project Info
                      </button>
                      <button
                        onClick={handleSendOtp}
                        disabled={!state.fullName.trim() || state.phone.length < 10}
                        className="bg-terra hover:bg-terra-dark text-white rounded-2xl px-6 py-3.5 text-sm font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                      >
                        Send Verification OTP <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // OTP VERIFICATION INPUT
                  <div className="space-y-6 py-4">
                    <div className="text-center space-y-2">
                      <div className="inline-flex p-3 bg-terra/10 text-terra rounded-full">
                        <Phone className="w-6 h-6 animate-pulse" />
                      </div>
                      <h4 className="text-xl font-display font-bold text-charcoal tracking-tight">
                        Confirm Your Phone Number
                      </h4>
                      <p className="text-sm text-warmgray max-w-md mx-auto">
                        We sent an automated 4-digit OTP to your phone at <span className="font-mono text-charcoal font-medium">({state.phone.slice(0,3)}) {state.phone.slice(3,6)}-{state.phone.slice(6)}</span>.
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto space-y-4">
                      <div>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="0000"
                          value={state.otpCode}
                          onChange={(e) => {
                            const cleanVal = e.target.value.replace(/\D/g, '');
                            setState(prev => ({ ...prev, otpCode: cleanVal }));
                          }}
                          className="w-full text-center bg-white border border-charcoal/15 rounded-2xl py-4 text-2xl font-mono tracking-widest focus:border-terra focus:ring-1 focus:ring-terra focus:outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>

                      {state.otpError && (
                        <div className="flex items-center justify-center gap-2 text-terra text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{state.otpError}</span>
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const code = Math.floor(1000 + Math.random() * 9000).toString();
                            setGeneratedOtp(code);
                            setState(prev => ({ ...prev, otpCode: '', otpError: undefined }));
                            setGeneratedOtp(code);
                            setShowOtpBanner(true);
                          }}
                          className="text-[11px] text-terra underline hover:text-terra/80 font-medium"
                        >
                          Resend SMS Verification PIN
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-charcoal/10">
                      <button
                        onClick={() => setState(prev => ({ ...prev, isOtpSent: false }))}
                        className="flex items-center gap-1.5 text-sm text-warmgray hover:text-charcoal font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to details
                      </button>
                      <button
                        onClick={handleVerifyOtp}
                        disabled={state.otpCode.length < 4}
                        className="bg-charcoal hover:bg-terra text-white rounded-2xl px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        Verify & Submit Project Lead
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: Success & Lead Routing Process */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full border border-green-200">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-display font-bold text-charcoal tracking-tight">
                    Lead Dispatched Instantly!
                  </h4>
                  <p className="text-sm text-warmgray max-w-md mx-auto">
                    Excellent work, <span className="font-semibold text-charcoal">{state.fullName}</span>. Your phone verification is complete. Our routing engine is matching you with local, protected contractors in <span className="font-semibold text-charcoal">{getCityFromZip(state.zipCode)}</span> right now.
                  </p>
                </div>

                <div className="bg-white border border-charcoal/10 rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto shadow-sm">
                  <h5 className="text-xs uppercase tracking-wider text-warmgray font-semibold border-b border-charcoal/5 pb-2">Verified Lead Information</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-warmgray">Trade Category:</span>
                    <span className="font-semibold text-charcoal text-right">{state.trade}</span>
                    
                    <span className="text-warmgray">Territory:</span>
                    <span className="font-semibold text-charcoal text-right">{getCityFromZip(state.zipCode)} ({state.zipCode})</span>
                    
                    <span className="text-warmgray">Scope & Urgency:</span>
                    <span className="font-semibold text-charcoal text-right">{state.timeframe.split(' ')[0]} / {state.projectScope.split(' / ')[0]}</span>

                    <span className="text-warmgray">Instant Dispatch status:</span>
                    <span className="text-terra font-mono font-bold text-right flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 bg-terra rounded-full animate-ping" /> Dispatch Active
                    </span>
                  </div>
                </div>

                <div className="text-xs text-warmgray bg-charcoal/5 rounded-xl p-3 max-w-md mx-auto leading-relaxed">
                  💡 **Contractor Dashboard Demonstration Connected**: If you open the Contractor Portal on this website, you will see your live dispatch token <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-charcoal/10 font-bold">RC-{generatedOtp}</span> is instantly visible and route-protected!
                </div>

                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="bg-charcoal hover:bg-terra text-white rounded-xl px-8 py-3 text-sm font-semibold transition-all shadow-md"
                  >
                    Return to Homepage
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
