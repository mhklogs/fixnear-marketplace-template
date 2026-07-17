// Local fallback intelligence for /api/chat (plain ESM, no TS).
// Used when Gemini is unavailable (invalid/quota key, network down, timeout).
// Always returns a helpful, on-brand, homeowner-focused answer — never an error or hang.

const TRADE_LIST =
  'roofing, HVAC, plumbing, electrical, solar, remodeling, painting, landscaping, masonry, windows, flooring, decks, siding, garage doors, and pest control';

const BASE = `ReferralClose is a premium home-service marketplace that connects you with verified local contractors. Booking a consultation is free for homeowners — the matched pro pays a small commission. After you book, our team calls and emails you to schedule a visit, so please share your phone, address, and ZIP.`;

function norm(s) {
  return (s || '').toLowerCase();
}

function hasAll(text, keywords) {
  const t = norm(text);
  return keywords.some((k) => t.includes(k));
}

export function localReply(userText) {
  const t = norm(userText);
  const last = (userText || '').trim();

  if (/^(hi|hello|hey|howdy|yo)\b/.test(t)) {
    return `Hi! I'm the ReferralClose Assistant. ${BASE} Which project are you planning — roofing, HVAC, plumbing, or something else?`;
  }

  if (hasAll(last, ['which trades', 'what trades', 'do you cover', 'services', 'what do you do', 'list of'])) {
    return `We cover ${TRADE_LIST}. Tap any trade card in the Marketplace or hit "Book Consultation" and we'll match a verified pro in your ZIP.`;
  }

  if (hasAll(last, ['price', 'cost', 'how much', 'pricing', 'expensive', 'fee', 'charge', 'pay'])) {
    return `Booking a consultation is 100% free for homeowners — you only get matched with a verified local pro, and that pro pays a small commission to us. There are no lead fees or hidden charges for you. Want me to start your Book Consultation?`;
  }

  if (hasAll(last, ['how does it work', 'how it works', 'process', 'how do i', 'steps', 'get started', 'start'])) {
    return `It's simple: 1) Pick your trade or hit "Book Consultation". 2) Tell us your name, phone, address, and ZIP. 3) Our team matches a verified local pro and calls you to schedule a visit. No spam, no shared data — just a direct connection. Want to begin?`;
  }

  if (hasAll(last, ['trust', 'safe', 'verified', 'scam', 'legit', 'reliable', 'background', 'insurance', 'license'])) {
    return `Every pro is verified before they join our network. We use secure double-verification and instant match protection — no spam, no shared data, just a reliable connection to a vetted local professional in your area.`;
  }

  if (hasAll(last, ['roof', 'shingle', 'leak', 'gutter'])) {
    return `For roofing we match verified local roofers for repairs, leaks, replacements, and gutters. Tap the Roofing card or "Book Consultation" and share your ZIP so we route you to a pro in your neighborhood.`;
  }
  if (hasAll(last, ['hvac', 'ac', 'a/c', 'air condition', 'heating', 'furnace', 'heat pump'])) {
    return `HVAC help covers AC repair, heating, furnace, and heat-pump installs. Book a Consultation and we'll match a certified local HVAC pro to your ZIP.`;
  }
  if (hasAll(last, ['plumb', 'pipe', 'leak', 'drain', 'water heater', 'faucet'])) {
    return `Plumbing pros handle leaks, drains, water heaters, and fixture installs. Hit "Book Consultation" and we'll connect you with a verified plumber near you.`;
  }
  if (hasAll(last, ['electric', 'wiring', 'panel', 'outlet', 'breaker', 'ev charger', 'solar'])) {
    return `Our electrical and solar pros cover wiring, panels, outlets, EV chargers, and solar installs. Book a Consultation and we'll match a licensed local pro.`;
  }
  if (hasAll(last, ['remodel', 'renovat', 'kitchen', 'bath', 'bathroom'])) {
    return `Remodeling pros handle kitchens, bathrooms, and full renovations. Tap the Remodeling card or "Book Consultation" and share your ZIP for a local match.`;
  }
  if (hasAll(last, ['paint', 'interior', 'exterior paint'])) {
    return `Painting pros cover interior and exterior jobs. Book a Consultation and we'll match a verified local painter to your area.`;
  }
  if (hasAll(last, ['landscap', 'lawn', 'yard', 'garden', 'tree', 'sod'])) {
    return `Landscaping pros handle lawns, gardens, trees, and outdoor design. Hit "Book Consultation" to get matched with a local pro.`;
  }
  if (hasAll(last, ['floor', 'tile', 'hardwood', 'deck', 'patio', 'siding', 'mason', 'brick', 'garage', 'pest', 'bug', 'termite'])) {
    return `We cover flooring, decks & patios, siding, masonry, garage doors, and pest control with verified local pros. Pick the trade card or Book a Consultation with your ZIP.`;
  }
  if (hasAll(last, ['window', 'windows'])) {
    return `Window pros handle installs and replacements. Book a Consultation and we'll match a verified local window pro to your ZIP.`;
  }

  if (hasAll(last, ['book', 'consultation', 'request', 'schedule', 'appointment', 'visit', 'contact', 'call me', 'quote', 'estimate'])) {
    return `I can start your Book Consultation now. We'll need your name, phone, address/neighborhood, and ZIP so we match the right verified pro. Tap "Book Consultation" and our team will call you to schedule a visit.`;
  }

  if (hasAll(last, ['where', 'area', 'location', 'zip', 'city', 'houston', 'service'])) {
    return `We match verified pros across the U.S. by ZIP code — based in Houston, TX. Share your ZIP and we'll route you to a pro in your neighborhood.`;
  }

  if (hasAll(last, ['thank', 'thanks', 'appreciate', 'cool', 'great', 'nice'])) {
    return `You're welcome! Whenever you're ready, tap any trade card or "Book Consultation" and we'll match you with a verified local pro. Anything else I can help with?`;
  }

  return `I'm here to help with home services — ${TRADE_LIST}. ${BASE} Tell me your project (for example "roof leak" or "new AC") and I'll point you to the right verified local pro, or you can tap "Book Consultation" to get started.`;
}
