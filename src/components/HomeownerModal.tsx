import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Home, User, Mail, Phone, Loader2, ChevronDown, Search,
} from 'lucide-react';
import { TRADES } from '../data/trades';
import { ServiceType } from '../types';
import { submitHomeownerLead, type CampaignStep } from '../lib/leads';

const STATES = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];

const TOP_CITIES: Record<string, string[]> = {
  TX: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington'],
  CA: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Oakland'],
  NY: ['New York', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
  FL: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'St. Petersburg', 'Tallahassee'],
  IL: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield'],
  PA: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton'],
  OH: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
  GA: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens'],
  NC: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville'],
  MI: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing'],
};

interface HomeownerModalProps {
  open: boolean;
  initialTrade: ServiceType | '';
  onClose: () => void;
}

const empty = (trade: ServiceType | '') => ({
  trade,
  responses: {} as Record<string, string>,
  contactName: '',
  email: '',
  phone: '',
  zip: '',
  address: '',
});

export default function HomeownerModal({ open, initialTrade, onClose }: HomeownerModalProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(empty(initialTrade));
  const [steps, setSteps] = useState<CampaignStep[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [selectedState, setSelectedState] = useState('');
  const [cityName, setCityName] = useState('');
  const [manualMode, setManualMode] = useState(false);

  // State search
  const [stateQuery, setStateQuery] = useState('');
  const [stateSuggestions, setStateSuggestions] = useState<{ name: string; code: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  // City search
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // ZIP search
  const [zipQuery, setZipQuery] = useState('');
  const [zipSuggestions, setZipSuggestions] = useState<string[]>([]);
  const [loadingZips, setLoadingZips] = useState(false);
  const [zipError, setZipError] = useState('');

  // Autocomplete effects querying Gemini live
  useEffect(() => {
    if (!stateQuery.trim()) {
      setStateSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoadingStates(true);
      try {
        const res = await fetch('/api/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'state', query: stateQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setStateSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStates(false);
      }
    }, 250);
    return () => clearTimeout(delay);
  }, [stateQuery]);

  useEffect(() => {
    if (!selectedState || !cityQuery.trim()) {
      setCitySuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoadingCities(true);
      try {
        const res = await fetch('/api/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'city', state: selectedState, query: cityQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setCitySuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCities(false);
      }
    }, 250);
    return () => clearTimeout(delay);
  }, [cityQuery, selectedState]);

  useEffect(() => {
    if (!selectedState || !cityName || !zipQuery.trim()) {
      setZipSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoadingZips(true);
      try {
        const res = await fetch('/api/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'zip', state: selectedState, city: cityName, query: zipQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setZipSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingZips(false);
      }
    }, 250);
    return () => clearTimeout(delay);
  }, [zipQuery, selectedState, cityName]);

  const formatUSPhone = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '';
    if (clean.length <= 3) return `(${clean}`;
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setToken('');
      setNeighborhood('');
      setDraft(empty(initialTrade));
      setSelectedState('');
      setCityName('');
      setStateQuery('');
      setStateSuggestions([]);
      setCityQuery('');
      setCitySuggestions([]);
      setZipQuery('');
      setZipSuggestions([]);
      setZipError('');
      setLoadingStates(false);
      setLoadingCities(false);
      setLoadingZips(false);
      setManualMode(false);
    }
  }, [open, initialTrade]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // No backend questionnaire — intake uses each trade's fieldSpecs fallback.
  useEffect(() => {
    setSteps([]);
  }, [draft.trade]);

  if (!open) return null;

  const set = (patch: Partial<typeof draft>) => setDraft((d) => ({ ...d, ...patch }));
  const setResponse = (q: string, v: string) =>
    setDraft((d) => ({ ...d, responses: { ...d.responses, [q]: v } }));

  const canAdvance = () => {
    switch (step) {
      case 1:
        return !!draft.trade;
      case 2: {
        // Every dynamic question must be answered (no skipping forward).
        if (steps.length > 0) {
          const answered = steps.every((s) => (draft.responses[s.question] || '').trim().length > 0);
          if (!answered) return false;
        } else {
          // Fallback intake: require a project description.
          if (!(draft.responses['Notes'] || '').trim()) return false;
        }
        return true;
      }
      case 3: {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
        const phoneOk = draft.phone.replace(/\D/g, '').length === 10;
        const zipOk = draft.zip.trim().length >= 5;
        const addressOk = draft.address.trim().length >= 4;
        return draft.contactName.trim().length >= 2 && emailOk && phoneOk && zipOk && addressOk;
      }
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const responses: Record<string, string> = {
      'Trade': TRADES.find((t) => t.id === draft.trade)?.title ?? draft.trade,
      ...draft.responses,
    };
    try {
      const row = await submitHomeownerLead({
        trade: draft.trade,
        responses,
        contactName: draft.contactName,
        email: draft.email,
        phone: draft.phone,
        zip: draft.zip,
      });
      setToken(row.id.toUpperCase());
      setNeighborhood(row.neighborhood);
    } catch {
      setToken(`RC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const tradeTitle = TRADES.find((t) => t.id === draft.trade)?.title ?? '';
  const fieldSpecs = TRADES.find((t) => t.id === draft.trade)?.fieldSpecs ?? '';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-forest/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[92vh] bg-sage border border-glass-border rounded-[32px] overflow-hidden shadow-2xl flex flex-col text-ink"
      >
        <div className="bg-forest px-6 sm:px-8 py-5 flex items-center justify-between border-b border-glass-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brass animate-ping" />
            <span className="brand-mark text-ink text-base">
              Referral<span className="brand-close">Close</span>
            </span>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-sm px-2 py-1 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted && (
          <div className="flex items-center justify-center gap-2 py-4 border-b border-glass-border">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full transition-all duration-300 ${n <= step ? 'w-8 bg-brass' : 'w-4 bg-white/10'}`}
              />
            ))}
          </div>
        )}

        <div className="p-6 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* STEP 1: Service needed */}
                {step === 1 && (
                  <>
                    <div>
                      <h3 className="font-display font-bold text-2xl text-ink">What do you need done?</h3>
                      <p className="text-sm text-ink-muted mt-1">Pick the trade you want a verified pro for.</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {TRADES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => set({ trade: t.id })}
                          className={`px-4 py-2.5 rounded-full border font-mono text-xs uppercase tracking-wide transition-all cursor-pointer ${
                            draft.trade === t.id
                              ? 'bg-brass border-brass text-white font-bold'
                              : 'bg-white/5 border-glass-border text-ink hover:border-brass'
                          }`}
                        >
                          {t.title.replace(' & ', ' / ')}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* STEP 2: Project details (dynamic) */}
                {step === 2 && (
                  <>
                    <div>
                      <h3 className="font-display font-bold text-2xl text-ink">Project details</h3>
                      <p className="text-sm text-ink-muted mt-1">
                        A few quick questions so we match you with the right {tradeTitle.toLowerCase()}.
                      </p>
                    </div>

                    {steps.length > 0 ? (
                      <div className="space-y-5">
                        {steps.map((s, i) => (
                          <div key={i}>
                            <label className="text-sm font-semibold text-ink block mb-2">{s.question}</label>
                            {s.options && s.options.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {s.options.map((o) => (
                                  <button
                                    key={o}
                                    onClick={() => setResponse(s.question, o)}
                                    className={`px-3.5 py-2.5 rounded-full border font-mono text-xs transition-all cursor-pointer ${
                                      draft.responses[s.question] === o
                                        ? 'bg-brass border-brass text-white font-bold'
                                        : 'bg-white/5 border-glass-border text-ink hover:border-brass'
                                    }`}
                                  >
                                    {o}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input
                                value={draft.responses[s.question] ?? ''}
                                onChange={(e) => setResponse(s.question, e.target.value)}
                                placeholder="Your answer"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-brass/10 border border-brass/20 rounded-[20px] p-4 text-ink">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-brass">Quick note</span>
                        <p className="text-sm text-ink mt-1">
                          Please describe specifics such as: <strong>{fieldSpecs}</strong>. A verified pro will receive these details.
                        </p>
                        <textarea
                          value={draft.responses['Notes'] ?? ''}
                          onChange={(e) => setResponse('Notes', e.target.value)}
                          rows={4}
                          placeholder="Describe your project…"
                          className="w-full mt-3 bg-white/5 border border-glass-border rounded-[20px] py-3.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none resize-none"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* STEP 3: State, ZIP Code, Address, Contact Info */}
                {step === 3 && (
                  <>
                    <div>
                      <h3 className="font-display font-bold text-2xl text-ink">Where should we send pros?</h3>
                      <p className="text-sm text-ink-muted mt-1">Search and select your location details live.</p>
                    </div>

                    <div className="space-y-5">
                      {!manualMode ? (
                        <>
                          {/* 1. STATE SELECTOR (Typable Search) */}
                          <div className="relative">
                            <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1.5">1. State</label>
                            {selectedState ? (
                              <div className="flex items-center justify-between bg-white/5 border border-glass-border rounded-[20px] px-4 py-3.5 text-sm text-ink">
                                <span>🇺🇸 State Selected: <strong>{STATES.find(s => s.code === selectedState)?.name || selectedState} ({selectedState})</strong></span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedState('');
                                    setStateQuery('');
                                    setCityName('');
                                    setCityQuery('');
                                    set({ zip: '' });
                                    setZipQuery('');
                                  }}
                                  className="text-xs font-mono font-bold text-brass hover:underline cursor-pointer"
                                >
                                  Change State
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                                <input
                                  value={stateQuery}
                                  onChange={(e) => setStateQuery(e.target.value)}
                                  placeholder="Type state name (e.g. Texas, California...)"
                                  className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                                />
                                {loadingStates && (
                                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brass" />
                                )}

                                {/* Suggestions */}
                                {stateQuery.trim() && stateSuggestions.length > 0 && (
                                  <div className="absolute left-0 right-0 z-[80] mt-1 max-h-[160px] overflow-y-auto border border-glass-border bg-sage rounded-[20px] shadow-2xl p-2 flex flex-col gap-1 scrollbar-thin">
                                    {stateSuggestions.map((s) => (
                                      <button
                                        key={s.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedState(s.code);
                                          setStateQuery(s.name);
                                          setStateSuggestions([]);
                                        }}
                                        className="text-left px-4 py-2.5 rounded-xl hover:bg-brass/20 text-ink text-sm font-mono font-bold transition-all cursor-pointer"
                                      >
                                        📍 {s.name} ({s.code})
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {stateQuery.trim() && stateSuggestions.length === 0 && !loadingStates && (
                                  <div className="absolute left-0 right-0 z-[80] mt-1 border border-glass-border bg-sage rounded-[20px] shadow-2xl p-4 text-center text-xs text-ink-muted">
                                    No states available. Keep typing...
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 2. CITY SELECTOR (Typable Search) - Unlocked once State is selected */}
                          {selectedState && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative"
                            >
                              <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1.5">2. City</label>
                              {cityName ? (
                                <div className="flex items-center justify-between bg-white/5 border border-glass-border rounded-[20px] px-4 py-3.5 text-sm text-ink">
                                  <span>🌆 City Selected: <strong>{cityName}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCityName('');
                                      setCityQuery('');
                                      set({ zip: '' });
                                      setZipQuery('');
                                    }}
                                    className="text-xs font-mono font-bold text-brass hover:underline cursor-pointer"
                                  >
                                    Change City
                                  </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                                  <input
                                    value={cityQuery}
                                    onChange={(e) => setCityQuery(e.target.value)}
                                    placeholder={`Type city in ${selectedState} (e.g. Houston, Los Angeles...)`}
                                    className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                                  />
                                  {loadingCities && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brass" />
                                  )}

                                  {/* Suggestions */}
                                  {cityQuery.trim() && citySuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 z-[70] mt-1 max-h-[160px] overflow-y-auto border border-glass-border bg-sage rounded-[20px] shadow-2xl p-2 flex flex-col gap-1 scrollbar-thin">
                                      {citySuggestions.map((c) => (
                                        <button
                                          key={c}
                                          type="button"
                                          onClick={() => {
                                            setCityName(c);
                                            setCityQuery(c);
                                            setCitySuggestions([]);
                                          }}
                                          className="text-left px-4 py-2.5 rounded-xl hover:bg-brass/20 text-ink text-sm font-bold transition-all cursor-pointer"
                                        >
                                          📌 {c}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {cityQuery.trim() && citySuggestions.length === 0 && !loadingCities && (
                                    <div className="absolute left-0 right-0 z-[70] mt-1 border border-glass-border bg-sage rounded-[20px] shadow-2xl p-4 text-center text-xs text-ink-muted">
                                      No cities available. Keep typing...
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}

                          {/* 3. ZIP CODE SELECTOR (Typable Search) - Unlocked once City and State are selected */}
                          {selectedState && cityName && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative"
                            >
                              <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1.5">3. ZIP Code</label>
                              {draft.zip ? (
                                <div className="flex items-center justify-between bg-white/5 border border-glass-border rounded-[20px] px-4 py-3.5 text-sm text-ink">
                                  <span>📮 ZIP Code Selected: <strong>{draft.zip}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      set({ zip: '' });
                                      setZipQuery('');
                                    }}
                                    className="text-xs font-mono font-bold text-brass hover:underline cursor-pointer"
                                  >
                                    Change ZIP
                                  </button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                                  <input
                                    value={zipQuery}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                                      setZipQuery(val);
                                      if (val.length === 5) {
                                        set({ zip: val });
                                      }
                                    }}
                                    placeholder="Type ZIP code..."
                                    className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                                  />
                                  {loadingZips && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brass" />
                                  )}

                                  {/* Suggestions */}
                                  {zipQuery.trim() && zipSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 z-[60] mt-1 max-h-[160px] overflow-y-auto border border-glass-border bg-sage rounded-[20px] shadow-2xl p-2 flex flex-col gap-1 scrollbar-thin">
                                      {zipSuggestions.map((z) => (
                                        <button
                                          key={z}
                                          type="button"
                                          onClick={() => {
                                            set({ zip: z });
                                            setZipQuery(z);
                                            setZipSuggestions([]);
                                          }}
                                          className="text-left px-4 py-2.5 rounded-xl hover:bg-brass/20 text-ink text-sm font-mono font-bold transition-all cursor-pointer"
                                        >
                                          📌 {z} ({cityName})
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {zipQuery.trim() && zipSuggestions.length === 0 && !loadingZips && (
                                    <div className="absolute left-0 right-0 z-[60] mt-1 border border-glass-border bg-sage rounded-[20px] shadow-2xl p-4 text-center text-xs text-ink-muted">
                                      No ZIP codes available. Keep typing...
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setManualMode(true)}
                              className="text-xs font-mono text-brass hover:underline cursor-pointer"
                            >
                              Type City & ZIP manually instead
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4 bg-white/5 p-5 rounded-[24px] border border-glass-border">
                          <div>
                            <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1">Enter Location Manually</label>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-brass block mb-1.5">State Abbrev.</label>
                              <input
                                maxLength={2}
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value.toUpperCase())}
                                placeholder="e.g. TX"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3 px-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-brass block mb-1.5">City Name</label>
                              <input
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                placeholder="e.g. Houston"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3 px-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-brass block mb-1.5">5-Digit ZIP</label>
                              <input
                                maxLength={5}
                                value={draft.zip}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                                  set({ zip: val });
                                }}
                                placeholder="e.g. 77056"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3 px-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-glass-border flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setManualMode(false);
                              }}
                              className="text-xs font-mono text-brass hover:underline cursor-pointer"
                            >
                              ← Use automatic ZIP search
                            </button>
                          </div>
                        </div>
                      )}
                {/* Address & Contact Details (Shown once ZIP is selected) */}
                {draft.zip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 border-t border-glass-border pt-5 mt-5"
                  >
                    {/* Location Selected summary badge */}
                    <div className="flex items-center justify-between bg-brass/10 border border-brass/20 rounded-[20px] p-4 text-sm">
                      <div className="flex items-center gap-2 text-ink">
                        <MapPin className="w-4 h-4 text-brass" />
                        <span>Location Confirmed: <strong>{cityName}, {selectedState} {draft.zip}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedState('');
                          setStateQuery('');
                          setCityName('');
                          setCityQuery('');
                          set({ zip: '' });
                          setZipQuery('');
                          setManualMode(false);
                          setZipError('');
                        }}
                        className="text-xs font-mono font-bold uppercase tracking-wider text-brass hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    </div>

                          {/* Address Input */}
                          <div>
                            <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1.5">4. Street Address</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                              <input
                                value={draft.address}
                                onChange={(e) => set({ address: e.target.value })}
                                placeholder="Street address / Unit / Neighborhood"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Contact Details */}
                          <div className="space-y-3">
                            <label className="text-xs font-mono uppercase tracking-widest text-brass block mb-1">5. Contact Information</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                              <input
                                value={draft.contactName}
                                onChange={(e) => set({ contactName: e.target.value })}
                                placeholder="Full Name"
                                className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                                <input
                                  type="email"
                                  value={draft.email}
                                  onChange={(e) => set({ email: e.target.value })}
                                  placeholder="Email Address"
                                  className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                                />
                              </div>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                                <input
                                  type="tel"
                                  value={draft.phone}
                                  onChange={(e) => {
                                    const formatted = formatUSPhone(e.target.value);
                                    set({ phone: formatted });
                                  }}
                                  maxLength={14}
                                  placeholder="Phone: (XXX) XXX-XXXX"
                                  className="w-full bg-white/5 border border-glass-border rounded-[20px] py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-2">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink font-medium cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 3 ? (
                    <button
                      disabled={!canAdvance()}
                      onClick={() => setStep((s) => s + 1)}
                      className="bg-brass hover:bg-brass/80 text-white rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-40 cursor-pointer"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !canAdvance()}
                      className="btn-amber text-white rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Matching…</> : <><Home className="w-4 h-4" /> Book Consultation</>}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs tracking-widest text-emerald-500 font-bold uppercase block">Request Confirmed</span>
                  <h3 className="text-2xl font-display font-extrabold text-ink uppercase">
                    Our Team Will Contact You For A Visit, {draft.contactName.split(' ')[0] || 'Homeowner'}!
                  </h3>
                  <p className="text-sm text-ink-muted max-w-md mx-auto">
                    We've logged your {tradeTitle} request for <strong>{draft.address}{draft.address && draft.zip ? `, ${draft.zip}` : draft.zip}</strong> and will call <strong>{draft.phone}</strong> to schedule a verified pro visit. A confirmation is on its way to {draft.email}.
                  </p>
                </div>
                <div className="bg-forest/40 text-ink border border-glass-border rounded-[20px] p-4 font-mono text-xs inline-block">
                  Request Token: <span className="text-brass font-bold">{token}</span>
                </div>
                <div>
                  <button
                    onClick={onClose}
                    className="bg-brass hover:bg-brass/80 text-white rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Return to Site
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
