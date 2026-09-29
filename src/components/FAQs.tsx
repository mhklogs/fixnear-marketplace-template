import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import { sendChat } from '../lib/chat';

interface Faq {
  id: number;
  question: string;
  answer: string;
  /** Sub-questions surfaced after the answer; these call the Gemini query. */
  sub?: string[];
}

const FAQS: Faq[] = [
  {
    id: 1,
    question: 'How does a service request actually get done?',
    answer:
      'You pick your trade (roofing, plumbing, HVAC, etc.), tell us a bit about the project, and share your phone + postal code. We route that request to a verified pro who serves your ZIP. They call you to schedule a visit and give a quote — you pay nothing to request.',
    sub: [
      'What happens after I submit my request?',
      'How soon will the pro call me?',
      'Do I get locked into a contract?',
    ],
  },
  {
    id: 2,
    question: 'Is it really free for homeowners?',
    answer:
      'Yes. Requesting a verified pro costs you $0. No monthly fees, no retainers. The local pro who receives your request pays FixNear a small commission, so we only win when we match you well.',
    sub: [
      'How does FixNear make money then?',
      'Will the pro charge me extra to cover the fee?',
      'Are there any hidden costs?',
    ],
  },
  {
    id: 3,
    question: 'How do you verify the pros?',
    answer:
      'Every pro is vetted before they can receive requests — licenses, insurance, and local presence are checked. We also monitor reviews and performance, and you can flag any pro you were not happy with for a free re-match.',
    sub: [
      'What if I’m unhappy with the pro?',
      'Are pros licensed and insured?',
      'Can I choose a specific pro?',
    ],
  },
  {
    id: 4,
    question: 'Why do you need my postal code?',
    answer:
      'Your postal code is how we find a pro who actually works in your neighborhood. We match you to someone local — not a national call center — so response times are fast and the pro knows your area’s building norms.',
    sub: [
      'Do you share my exact address?',
      'What if no pro covers my ZIP?',
      'Can I use a nearby ZIP?',
    ],
  },
  {
    id: 5,
    question: 'How is my phone number used?',
    answer:
      'Only the verified pro we match you with gets your number, so they can call to schedule your visit. We don’t sell your details or spam you. You can request a call-back time that suits you.',
    sub: [
      'Will I get marketing texts?',
      'Can I request a quote by email instead?',
      'How do I stop a pro from calling?',
    ],
  },
  // The remaining FAQs live as sub-questions above (queried via AI) so the
  // front page stays clean with 5 questions.
  {
    id: 6,
    question: 'What trades can I request?',
    answer:
      'Roofing, HVAC, plumbing, electrical, solar, remodeling, painting, landscaping, masonry, windows, flooring, decks, siding, garage, pest control, and security.',
  },
  {
    id: 7,
    question: 'Can I request multiple trades at once?',
    answer: 'Yes — submit a separate request per trade, or describe a multi-trade project and we’ll route each part to the right pro.',
  },
  {
    id: 8,
    question: 'How are quotes priced?',
    answer: 'Pros quote per project after seeing your details; FixNear charges a flat per-lead commission to the pro, not a markup to you.',
  },
  {
    id: 9,
    question: 'Do you serve my whole city?',
    answer: 'We operate a US-wide network of verified pros and match by postal code, so most metro and suburban areas are covered.',
  },
  {
    id: 10,
    question: 'What if the pro doesn’t show?',
    answer: 'Flag a no-show in the request and we’ll re-match you with another verified pro at no cost to you.',
  },
  {
    id: 11,
    question: 'Can I read reviews before the visit?',
    answer: 'Yes — each matched pro’s rating and recent reviews are shown so you can proceed with confidence.',
  },
  {
    id: 12,
    question: 'Is my project info kept private?',
    answer: 'Your project details go only to the pro matched to your request, and are never sold or shared broadly.',
  },
  {
    id: 13,
    question: 'Do pros carry warranty work?',
    answer: 'Warranties are set by each pro, but all pros in our network are vetted for licensing and insurance before they can receive requests.',
  },
  {
    id: 14,
    question: 'Can I schedule a visit for the weekend?',
    answer: 'Yes — share your preferred window and the matched pro will coordinate a time, including weekends where available.',
  },
  {
    id: 15,
    question: 'How do I change or cancel a request?',
    answer: 'Open the request confirmation and use “Return to Site”, or message the assistant in the bottom-right corner to update or cancel.',
  },
];

const FRONT_COUNT = 5;

export default function FAQs() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [query, setQuery] = useState<{ q: string; a: string } | null>(null);
  const [querying, setQuerying] = useState(false);

  const askQuery = async (q: string) => {
    if (querying) return;
    setQuerying(true);
    setQuery({ q, a: '' });
    try {
      const reply = await sendChat([
        {
          role: 'user',
          content: `You are the FixNear homeowner FAQ assistant. Answer concisely (under 60 words), friendly, homeowner-focused: ${q}`,
        },
      ]);
      setQuery({ q, a: reply });
    } catch {
      setQuery({
        q,
        a: 'I couldn’t reach the assistant just now. Try again, or message the assistant in the bottom-right corner.',
      });
    } finally {
      setQuerying(false);
    }
  };

  const front = FAQS.slice(0, FRONT_COUNT);

  return (
    <section id="faqs" className="py-24 sm:py-32 bg-forest relative border-t border-white/5 scroll-mt-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-widest text-brass uppercase block mb-3">
            // HOMEOWNER QUESTIONS
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-bold uppercase tracking-tight text-ink">
            Frequently Asked Questions
          </h2>
          <p className="text-ink-muted font-light mt-3 max-w-lg mx-auto text-sm sm:text-base">
            How a service request is done, what it costs you (nothing), and how we match you with a verified pro in your neighborhood.
          </p>
        </div>

        <div className="border-t border-white/10 divide-y divide-white/10">
          {front.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5">
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className={`font-display font-bold text-lg sm:text-xl transition-colors ${isOpen ? 'text-brass' : 'text-ink'}`}>
                    {faq.question}
                  </span>
                  <span className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-brass text-forest' : 'bg-white/5 text-ink-muted border border-white/10'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-ink-muted font-light text-sm leading-relaxed pt-4 max-w-2xl">
                        {faq.answer}
                      </p>
                      {faq.sub && (
                        <div className="pt-4 flex flex-col gap-2">
                          <span className="font-mono text-[10px] tracking-widest text-brass uppercase">
                            Related questions
                          </span>
                          {faq.sub.map((s) => (
                            <button
                              key={s}
                              onClick={() => askQuery(s)}
                              className="text-left text-sm text-ink border border-white/10 rounded-full px-4 py-2.5 hover:border-brass hover:text-brass transition-colors cursor-pointer"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* AI-answered sub-question result */}
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 glass rounded-[24px] p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brass" />
                <span className="font-mono text-[10px] tracking-widest text-brass uppercase">Assistant Answer</span>
                <button
                  onClick={() => setQuery(null)}
                  className="ml-auto text-ink-muted hover:text-ink text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
              <p className="font-display font-bold text-ink text-base mb-2">{query.q}</p>
              {querying && !query.a ? (
                <div className="flex items-center gap-2 text-ink-muted text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                </div>
              ) : (
                <p className="text-ink-muted font-light text-sm leading-relaxed">{query.a}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-ink-muted text-xs mt-10 font-light">
          Didn’t find your answer? Tap the assistant in the bottom-right corner — it can answer anything live.
        </p>
      </div>
    </section>
  );
}
