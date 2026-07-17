import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HardHat, Flame, Droplet, Paintbrush, 
  MapPin, ChevronRight, ChevronLeft, 
  User, Phone, Mail, CheckCircle2, 
  ShieldAlert, RefreshCw, Smartphone, 
  Lock, Loader2, ArrowRight, Sparkles,
  Building, Award, DollarSign, ShieldCheck, Zap
} from 'lucide-react';
import { ServiceType, FunnelState } from '../types';

interface FunnelProps {
  initialService: ServiceType | '';
  initialMode: 'homeowner' | 'contractor';
  onServiceReset: () => void;
}

const CITY_MAPPING: Record<string, string> = {
  '78': 'Austin, TX',
  '80': 'Denver, CO',
  '98': 'Seattle, WA',
  '33': 'Miami, FL',
  '02': 'Boston, MA',
  '60': 'Chicago, IL',
  '85': 'Phoenix, AZ',
  '75': 'Dallas, TX',
  '97': 'Portland, OR',
  '55': 'Minneapolis, MN',
  '92': 'San Diego, CA',
  '37': 'Nashville, TN',
  '89': 'Las Vegas, NV',
  '19': 'Philadelphia, PA',
  '28': 'Charlotte, NC',
  '43': 'Columbus, OH',
  '94': 'San Francisco, CA',
  '10': 'New York, NY',
  '46': 'Indianapolis, IN',
  '32': 'Orlando, FL',
  '48': 'Detroit, MI',
  '77': 'Houston, TX',
  '64': 'Kansas City, MO',
};

export default function Funnel({ initialService, initialMode, onServiceReset }: FunnelProps) {
  const [funnelMode, setFunnelMode] = useState<'homeowner' | 'contractor'>(initialMode);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FunnelState>({
    funnelMode: initialMode,
    serviceType: '',
    zipCode: '',
    specificNeeds: '',
    projectUrgency: 'standard',
    estimatedBudget: '',
    companyName: '',
    licenseNumber: '',
    yearsInBusiness: '',
    dailyLeadBudget: '$150',
    coverageRadius: '25 miles',
    name: '',
    phone: '',
    email: '',
  });

  const [zipVerified, setZipVerified] = useState(false);
  const [detectedCity, setDetectedCity] = useState('');
  
  // Carrier lookup and matching animations states
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  
  const [routingProgress, setRoutingProgress] = useState(0);
  const [routingLogs, setRoutingLogs] = useState<string[]>([]);
  const [matchedPartner, setMatchedPartner] = useState('');
  const [matchedSeconds, setMatchedSeconds] = useState(0);

  // Synchronize externally passed variables
  useEffect(() => {
    if (initialService) {
      setForm(prev => ({ ...prev, serviceType: initialService }));
      setStep(1);
    }
  }, [initialService]);

  useEffect(() => {
    setFunnelMode(initialMode);
    setForm(prev => ({ ...prev, funnelMode: initialMode }));
    setStep(1);
  }, [initialMode]);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setForm(prev => ({ ...prev, zipCode: val }));
    setZipVerified(false);
    
    if (val.length === 5) {
      const prefix = val.slice(0, 2);
      const city = CITY_MAPPING[prefix] || 'Metro Coverage Area';
      setDetectedCity(city);
      setZipVerified(true);
    }
  };

  const startPhoneVerification = () => {
    if (!form.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    const phoneClean = form.phone.replace(/\D/g, '');
    if (phoneClean.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (funnelMode === 'contractor') {
      if (!form.companyName.trim()) {
        alert('Please enter your company name');
        return;
      }
    }

    setVerifyingPhone(true);
    setVerificationProgress(0);
    setVerificationLogs([]);

    const logSequence = funnelMode === 'homeowner' ? [
      'Establishing secure SSL validation layers...',
      'HLR live carrier lookup: Initiating cell network diagnostics...',
      'Testing line dial capabilities & routing path active...',
      'Evaluating VOIP or high-risk line filtering protections...',
      '✓ Active Carrier Approved. Homeowner dispatch line verified.'
    ] : [
      'Establishing secure contractor endpoint...',
      'HLR license state lookup: Cross-referencing trade board database...',
      'Carrier authorization: Testing direct automated routing lines...',
      'Anti-fraud protocol: Validating corporate routing endpoints...',
      '✓ Verification Approved. Contractor dispatch account pre-validated.'
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVerifyingPhone(false);
            setStep(4);
            startLeadRouting();
          }, 600);
          return 100;
        }

        if (prev >= logIndex * 20 && logIndex < logSequence.length) {
          setVerificationLogs(curr => [...curr, logSequence[logIndex]]);
          logIndex++;
        }

        return prev + 5;
      });
    }, 100);
  };

  const startLeadRouting = () => {
    setRoutingProgress(0);
    setRoutingLogs([]);

    const matchNames = {
      roofing: ['Apex Roofers Ltd.', 'Vertex Roofing Co.', 'Echelon Slate & Tile'],
      hvac: ['Priority Plumbing & Climate', 'NextGen Climate HVAC', 'Blue Ribbon HVAC'],
      plumbing: ['Priority Plumbing', 'Oasis Plumbing & Drain', 'Vanguard Pipe Specialists'],
      electrical: ['VoltMaster Electric', 'SmartHome Electrical', 'Apex Grid Connections'],
      painting: ['ProTouch Painting', 'Elite Surface Painters', 'Precision Drywall Inc.'],
      landscaping: ['Drip Irrigation Specialists', 'EcoDesign Hardscaping', 'GreenScapes Design'],
      deck: ['Composite Deck Pros', 'Cedar Pergola Craftsmen', 'Elite Millwork Co.'],
      flooring: ['Hardwood Restoration Co.', 'LVP Foundation Specialists', 'Premium Stone Tile'],
    };

    const tradeId = form.serviceType || 'roofing';
    const list = matchNames[tradeId as ServiceType] || ['Elite Local Contractor'];
    const matchedVal = list[Math.floor(Math.random() * list.length)];
    setMatchedPartner(matchedVal);
    setMatchedSeconds(Math.floor(Math.random() * 25) + 15);

    const logs = funnelMode === 'homeowner' ? [
      'Packaging dynamic homeowner project parameters...',
      'Scanning local regional database for high-rating match...',
      `Transmitting lead concurrently to qualified professionals in ${detectedCity}...`,
      `Exclusive match accepted by ${matchedVal}.`,
      'Routing direct phone bridge and text message receipt...'
    ] : [
      'Publishing contractor coverage ZIP criteria...',
      'Mapping historical inquiry density in designated parameters...',
      'Establishing API listener pathways for real-time customer submission...',
      'Claiming exclusive territory parameters...',
      '✓ Account ready! Active leads are set to bridge directly.'
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      setRoutingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        if (prev >= logIndex * 20 && logIndex < logs.length) {
          setRoutingLogs(curr => [...curr, logs[logIndex]]);
          logIndex++;
        }

        return prev + 4;
      });
    }, 150);
  };

  const handleReset = () => {
    setStep(1);
    setForm({
      funnelMode,
      serviceType: '',
      zipCode: '',
      specificNeeds: '',
      projectUrgency: 'standard',
      estimatedBudget: '',
      companyName: '',
      licenseNumber: '',
      yearsInBusiness: '',
      dailyLeadBudget: '$150',
      coverageRadius: '25 miles',
      name: '',
      phone: '',
      email: '',
    });
    setZipVerified(false);
    setDetectedCity('');
    onServiceReset();
  };

  const renderHomeownerQuestions = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-mono text-muted-text uppercase mb-2">
            Briefly describe your project requirements:
          </label>
          <textarea
            value={form.specificNeeds}
            onChange={(e) => setForm(p => ({ ...p, specificNeeds: e.target.value }))}
            placeholder="e.g., Replacing architectural shingles on a 2-story home, or installing a tankless water heater..."
            className="w-full bg-white border border-charcoal/10 p-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta h-24 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Project Urgency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'immediate', title: 'Emergency/Now' },
                { id: 'standard', title: 'Flexible Schedule' }
              ].map((urg) => (
                <button
                  key={urg.id}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, projectUrgency: urg.id }))}
                  className={`p-3.5 border text-xs font-medium tracking-wide text-center transition-all cursor-pointer ${
                    form.projectUrgency === urg.id 
                      ? 'border-terracotta bg-terracotta/5 text-charcoal font-semibold' 
                      : 'border-charcoal/10 hover:border-charcoal text-muted-text hover:text-charcoal'
                  }`}
                >
                  {urg.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Estimated Project Budget
            </label>
            <select
              value={form.estimatedBudget}
              onChange={(e) => setForm(p => ({ ...p, estimatedBudget: e.target.value }))}
              className="w-full bg-white border border-charcoal/10 p-3.5 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta cursor-pointer"
            >
              <option value="">Select Range...</option>
              <option value="under-5k">Under $5,000</option>
              <option value="5k-15k">$5,000 - $15,000</option>
              <option value="15k-30k">$15,000 - $30,000</option>
              <option value="30k-plus">$30,000+</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderContractorQuestions = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Company Registered Name
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="text"
                placeholder="e.g. Austin Master Builders"
                value={form.companyName}
                onChange={(e) => setForm(p => ({ ...p, companyName: e.target.value }))}
                className="w-full bg-white border border-charcoal/10 py-3.5 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Trade License Number / Certification
            </label>
            <div className="relative">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="text"
                placeholder="e.g. LIC-928491-TX"
                value={form.licenseNumber}
                onChange={(e) => setForm(p => ({ ...p, licenseNumber: e.target.value }))}
                className="w-full bg-white border border-charcoal/10 py-3.5 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Years in Active Business
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={form.yearsInBusiness}
              onChange={(e) => setForm(p => ({ ...p, yearsInBusiness: e.target.value }))}
              className="w-full bg-white border border-charcoal/10 p-3.5 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Coverage Radius
            </label>
            <select
              value={form.coverageRadius}
              onChange={(e) => setForm(p => ({ ...p, coverageRadius: e.target.value }))}
              className="w-full bg-white border border-charcoal/10 p-3.5 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta cursor-pointer"
            >
              <option value="15 miles">15 miles radius</option>
              <option value="25 miles">25 miles radius</option>
              <option value="50 miles">50 miles radius</option>
              <option value="100 miles">Full Metro area</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-text uppercase mb-2">
              Est. Monthly Lead Budget
            </label>
            <select
              value={form.dailyLeadBudget}
              onChange={(e) => setForm(p => ({ ...p, dailyLeadBudget: e.target.value }))}
              className="w-full bg-white border border-charcoal/10 p-3.5 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta cursor-pointer"
            >
              <option value="$150">Small ($500/mo)</option>
              <option value="$500">Medium ($2,000/mo)</option>
              <option value="$1500">Enterprise ($5,000/mo+)</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const isStep2Completed = () => {
    if (funnelMode === 'homeowner') {
      return !!form.specificNeeds && !!form.estimatedBudget;
    } else {
      return !!form.companyName && !!form.licenseNumber && !!form.yearsInBusiness;
    }
  };

  return (
    <section id="funnel-section" className="py-24 sm:py-32 bg-white relative border-b border-charcoal/10 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Visual Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase block mb-3">
            // MATCH ENGINE V4.0
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-charcoal uppercase">
            {funnelMode === 'homeowner' ? 'Find Your Verified local Pro' : 'Contractor Match & Dispatch Setup'}
          </h2>
          <p className="text-muted-text font-light mt-2 text-sm sm:text-base">
            {funnelMode === 'homeowner' 
              ? 'Our dynamic referral network connects you with pre-screened local contractors. Enter details to confirm territory matches in real-time.'
              : 'Setup your dispatcher profile. Select your trade, zip code targets, and begin receiving verified, HLR-validated phone transfers.'}
          </p>

          {/* Inline Toggle Selector */}
          <div className="inline-flex mt-6 p-1 bg-alabaster border border-charcoal/10 rounded-sm">
            <button
              onClick={() => {
                setFunnelMode('homeowner');
                setForm(p => ({ ...p, funnelMode: 'homeowner' }));
                setStep(1);
              }}
              className={`px-4 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                funnelMode === 'homeowner' ? 'bg-charcoal text-alabaster font-bold' : 'text-muted-text hover:text-charcoal'
              }`}
            >
              Homeowner Path
            </button>
            <button
              onClick={() => {
                setFunnelMode('contractor');
                setForm(p => ({ ...p, funnelMode: 'contractor' }));
                setStep(1);
              }}
              className={`px-4 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                funnelMode === 'contractor' ? 'bg-charcoal text-alabaster font-bold' : 'text-muted-text hover:text-charcoal'
              }`}
            >
              Contractor Path
            </button>
          </div>
        </div>

        {/* Funnel Progress bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-charcoal/5 -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-terracotta -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          <div className="relative flex justify-between">
            {[1, 2, 3, 4].map((num) => {
              const isActive = step >= num;
              const isCurrent = step === num;
              return (
                <div key={num} className="flex flex-col items-center">
                  <div 
                    className={`w-9 h-9 flex items-center justify-center font-mono text-xs tracking-tighter font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-charcoal text-alabaster shadow-md scale-110' 
                        : 'bg-white border-2 border-charcoal/10 text-charcoal/40'
                    } ${isCurrent ? 'ring-2 ring-terracotta ring-offset-2' : ''}`}
                  >
                    {num}
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider uppercase mt-2 hidden sm:block ${
                    isActive ? 'text-charcoal font-semibold' : 'text-charcoal/40'
                  }`}>
                    {num === 1 && 'VALIDATE REGION'}
                    {num === 2 && (funnelMode === 'homeowner' ? 'ENRICH INTENT' : 'COMPANY SPECS')}
                    {num === 3 && 'VERIFY IDENTITY'}
                    {num === 4 && (funnelMode === 'homeowner' ? 'ROUTING MATCH' : 'LIVE BOARD')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Outer Shell */}
        <div className="bg-alabaster border border-charcoal/10 p-6 sm:p-10 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Geographic & Service Validation */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                    Step 1: Trade Sector & Core Region
                  </h3>
                  <p className="text-muted-text text-sm font-light">
                    Select your targeted trade discipline and enter your key geographic ZIP code.
                  </p>
                </div>

                {/* Service Selector Buttons */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono text-muted-text uppercase tracking-wider">
                    Select Core Discipline
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'roofing', title: 'Roofing', icon: HardHat },
                      { id: 'hvac', title: 'HVAC', icon: Flame },
                      { id: 'plumbing', title: 'Plumbing', icon: Droplet },
                      { id: 'electrical', title: 'Electrical', icon: Sparkles },
                      { id: 'painting', title: 'Painting', icon: Paintbrush },
                      { id: 'landscaping', title: 'Landscaping', icon: Zap },
                      { id: 'deck', title: 'Carpentry', icon: HardHat },
                      { id: 'flooring', title: 'Flooring', icon: Award },
                    ].map((srv) => {
                      const Icon = srv.icon;
                      const isSelected = form.serviceType === srv.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => setForm(p => ({ ...p, serviceType: srv.id as ServiceType }))}
                          className={`p-4 border flex flex-col items-center justify-center text-center space-y-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-charcoal text-alabaster border-charcoal scale-105 shadow-md'
                              : 'bg-white text-charcoal border-charcoal/10 hover:border-charcoal hover:bg-alabaster/10'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-terracotta' : 'text-charcoal/60'}`} />
                          <span className="text-[10px] font-mono font-medium tracking-wide uppercase">
                            {srv.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ZIP Code Input */}
                <div className="space-y-3 max-w-sm">
                  <label className="block text-xs font-mono text-muted-text uppercase tracking-wider">
                    Target Zip Code
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                    <input
                      type="text"
                      placeholder="e.g. 78701"
                      value={form.zipCode}
                      onChange={handleZipChange}
                      className="w-full bg-white border border-charcoal/10 py-3.5 pl-11 pr-4 font-mono text-sm tracking-widest text-charcoal focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
                    />
                  </div>

                  {zipVerified && (
                    <div className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 text-xs font-mono space-y-1">
                      <div className="flex items-center space-x-2 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>REGION COVERAGE CONFIRMED</span>
                      </div>
                      <p className="font-light">
                        Metro Hub: <strong>{detectedCity}</strong>. {funnelMode === 'homeowner' ? 'Active certified master pros are online.' : 'Inbound homeowner demand is active.'}
                      </p>
                    </div>
                  )}

                  {form.zipCode.length > 0 && form.zipCode.length < 5 && (
                    <span className="text-xs text-amber-600 font-mono">
                      Please enter a full 5-digit ZIP code.
                    </span>
                  )}
                </div>

                {/* Action CTA */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!form.serviceType || !zipVerified}
                    onClick={() => setStep(2)}
                    className="bg-charcoal text-alabaster disabled:opacity-30 disabled:cursor-not-allowed font-mono text-xs tracking-wider uppercase px-6 py-4 transition-all duration-200 hover:bg-terracotta flex items-center space-x-2 cursor-pointer"
                  >
                    <span>{funnelMode === 'homeowner' ? 'ENRICH PROJECT SPECIFICATIONS' : 'ENTER BUSINESS CREDENTIALS'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Intent Enrichment (Branched Logic Questions) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                    {funnelMode === 'homeowner' ? 'Step 2: Project Specifications & Range' : 'Step 2: Onboard Firm Credentials'}
                  </h3>
                  <p className="text-muted-text text-sm font-light">
                    {funnelMode === 'homeowner' 
                      ? `Enrich your ${form.serviceType.toUpperCase()} specifications to locate the most compatible master craftsman.`
                      : 'Provide your commercial details to activate state-level territory matching protocols.'}
                  </p>
                </div>

                {funnelMode === 'homeowner' ? renderHomeownerQuestions() : renderContractorQuestions()}

                {/* Buttons back/forth */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-charcoal font-mono text-xs tracking-widest uppercase hover:text-terracotta flex items-center space-x-2 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>BACK</span>
                  </button>
                  <button
                    type="button"
                    disabled={!isStep2Completed()}
                    onClick={() => setStep(3)}
                    className="bg-charcoal text-alabaster disabled:opacity-30 disabled:cursor-not-allowed font-mono text-xs tracking-wider uppercase px-6 py-4 transition-all duration-200 hover:bg-terracotta flex items-center space-x-2 cursor-pointer"
                  >
                    <span>PROCEED TO SECURE VERIFICATION</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Verification (HLR silent checking simulation) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {!verifyingPhone ? (
                  <>
                    <div>
                      <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                        Step 3: Identity & Dual Carrier Verification
                      </h3>
                      <p className="text-muted-text text-sm font-light">
                        Provide secure direct communication lines. HLR queries confirm carrier-active mobile endpoints to maintain pristine lead routing.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-mono text-muted-text uppercase tracking-wider mb-2">
                          Your Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-white border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-muted-text uppercase tracking-wider mb-2">
                            Direct Mobile Line
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                            <input
                              type="tel"
                              placeholder="(512) 555-0199"
                              value={form.phone}
                              onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                              className="w-full bg-white border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-muted-text uppercase tracking-wider mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                            <input
                              type="email"
                              placeholder="john@builders.com"
                              value={form.email}
                              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                              className="w-full bg-white border border-charcoal/10 py-3 pl-11 pr-4 font-sans text-sm text-charcoal focus:outline-none focus:border-terracotta"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-charcoal/5 p-4 border border-charcoal/10 flex items-start space-x-3 text-xs text-muted-text font-mono">
                        <Lock className="w-4 h-4 text-terracotta mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-charcoal uppercase block mb-0.5">LAGOM SECURE ENVELOPE</span>
                          <span>Carrier-HLR double checks verify genuine active phone lines. Zero promotional robocalls or reseller syndication.</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-charcoal font-mono text-xs tracking-widest uppercase hover:text-terracotta flex items-center space-x-2 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>
                      <button
                        type="button"
                        onClick={startPhoneVerification}
                        className="bg-terracotta hover:bg-terracotta/90 text-alabaster font-mono text-xs tracking-wider uppercase px-6 py-4 transition-all duration-200 flex items-center space-x-2 shadow-md shadow-terracotta/10 cursor-pointer"
                      >
                        <span>{funnelMode === 'homeowner' ? 'INITIALIZE MATCH ENGINES' : 'ACTIVATE DISPATCH PIPELINE'}</span>
                        <Smartphone className="w-4 h-4 animate-pulse" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* SILENT VERIFICATION PROGRESS */
                  <div className="py-12 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="w-12 h-12 text-terracotta animate-spin" />
                    <div className="text-center">
                      <h4 className="font-display font-bold text-lg text-charcoal uppercase">
                        {funnelMode === 'homeowner' ? 'Auditing Secure Match Route...' : 'Cross-Referencing Firm Registry...'}
                      </h4>
                      <p className="text-muted-text text-xs font-mono mt-1">
                        Active validation running. {verificationProgress}%
                      </p>
                    </div>

                    <div className="w-full max-w-md h-1 bg-charcoal/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-terracotta transition-all duration-100"
                        style={{ width: `${verificationProgress}%` }}
                      />
                    </div>

                    <div className="w-full max-w-md bg-charcoal text-alabaster p-4 rounded-sm font-mono text-[11px] leading-relaxed space-y-1.5 shadow-inner">
                      {verificationLogs.map((log, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className="text-terracotta">{`>`}</span>
                          <span className="text-alabaster/90">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Routing Dispatch / Dashboard preview */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {routingProgress < 100 ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-terracotta/20 border-t-terracotta animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-terracotta" />
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className="font-display font-bold text-lg text-charcoal uppercase tracking-wider">
                        {funnelMode === 'homeowner' ? 'Publishing Priority Dispatch...' : 'Locking Regional Zip Codes...'}
                      </h4>
                      <p className="text-muted-text text-xs font-mono mt-1">
                        Priority routing protocol running. {routingProgress}%
                      </p>
                    </div>

                    <div className="w-full max-w-md bg-charcoal text-alabaster p-4 font-mono text-[11px] leading-relaxed space-y-1.5 shadow-inner">
                      {routingLogs.map((log, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <span className="text-emerald-400">✓</span>
                          <span className="text-alabaster/90">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* COMPLETED SCREEN */
                  <div className="space-y-6 text-center py-6">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    {funnelMode === 'homeowner' ? (
                      <>
                        <div className="space-y-2">
                          <span className="font-mono text-xs tracking-widest text-emerald-600 font-bold uppercase block animate-pulse">
                            EXCLUSIVE LOCAL MATCH ESTABLISHED
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-display font-black text-charcoal uppercase leading-none">
                            {matchedPartner} Accepted Match!
                          </h3>
                          <p className="text-muted-text text-sm font-light max-w-md mx-auto">
                            Your project specifications in <strong>{detectedCity}</strong> are securely dispatched. A certified project lead will contact you shortly.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4 border-t border-b border-charcoal/10 py-6 font-mono text-xs">
                          <div className="text-center">
                            <span className="text-muted-text block mb-1">CLAIM SPEED</span>
                            <span className="text-base font-bold text-charcoal">{matchedSeconds} seconds</span>
                          </div>
                          <div className="text-center border-l border-r border-charcoal/10">
                            <span className="text-muted-text block mb-1">CITY METRO</span>
                            <span className="text-base font-bold text-charcoal">{detectedCity}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-muted-text block mb-1">EXCLUSIVITY</span>
                            <span className="text-base font-bold text-emerald-600">GUARANTEED</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <span className="font-mono text-xs tracking-widest text-emerald-600 font-bold uppercase block animate-pulse">
                            DISPATCH ACCOUNT ACTIVE
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-display font-black text-charcoal uppercase leading-none">
                            Welcome, {form.companyName}!
                          </h3>
                          <p className="text-muted-text text-sm font-light max-w-md mx-auto">
                            Territorial parameters locked around <strong>{form.zipCode}</strong> ({detectedCity}). Your automated client routing is pre-activated.
                          </p>
                        </div>

                        {/* Interactive Dispatch Dashboard Mock Widget */}
                        <div className="bg-charcoal text-alabaster p-6 text-left space-y-4 font-mono text-xs max-w-md mx-auto shadow-xl">
                          <div className="font-bold border-b border-alabaster/10 pb-2 flex justify-between uppercase">
                            <span>Territory Dispatch Dashboard</span>
                            <span className="text-emerald-400 flex items-center space-x-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1"></span>
                              <span>LIVE LISTENER</span>
                            </span>
                          </div>
                          <div className="space-y-2 text-[10px]">
                            <div className="flex justify-between text-alabaster/60">
                              <span>Assigned Zip:</span>
                              <span className="text-alabaster font-bold">{form.zipCode}</span>
                            </div>
                            <div className="flex justify-between text-alabaster/60">
                              <span>Target Radius:</span>
                              <span className="text-alabaster font-bold">{form.coverageRadius}</span>
                            </div>
                            <div className="flex justify-between text-alabaster/60">
                              <span>Trade Discipline:</span>
                              <span className="text-terracotta font-bold uppercase">{form.serviceType}</span>
                            </div>
                            <div className="flex justify-between text-alabaster/60">
                              <span>Verification Level:</span>
                              <span className="text-emerald-400 font-bold">HLR + OTP DIRECT</span>
                            </div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-sm border border-white/10 text-[9px] text-alabaster/85">
                            <strong>System Notice:</strong> Inbound phone transfers will trigger an instantaneous SMS notification. Ensure your direct dial line ({form.phone}) remains unblocked.
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-6 flex justify-center space-x-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="border border-charcoal/15 hover:border-charcoal hover:bg-charcoal/5 text-charcoal font-mono text-xs tracking-widest uppercase px-6 py-4 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>SUBMIT ANOTHER ENQUIRY</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
