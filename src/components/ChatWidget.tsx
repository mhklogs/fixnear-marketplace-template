import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { sendChat, type ChatMessage } from '../lib/chat';
import { TRADES } from '../data/trades';

interface ChatWidgetProps {
  /** Open the Request-a-Pro flow for a given trade ('' = generic). */
  onRequestPro: (trade?: string) => void;
}

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi, I'm the FixNear Assistant. I can help you pick the right home service, explain how it works, or start your “Book Consultation” — a verified local pro for your trade who serves your ZIP. What are you working on?",
};

const QUICK_PROMPTS = [
  'Help me start a request',
  'How does pricing work?',
  'Which trades do you cover?',
];

export default function ChatWidget({ onRequestPro }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setThinking(true);
    try {
      const reply = await sendChat(next);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "I'm having trouble reaching the assistant right now. You can still tap any trade card or “Book Consultation” to get started.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  // Detect a clear intent to start a request from the assistant or user.
  const maybeOfferRequest = (last: ChatMessage) => {
    const c = last.content.toLowerCase();
    return c.includes('request a verified pro') || c.includes('request') || c.includes('get started');
  };

  const last = messages[messages.length - 1];

  return (
    <>
      {/* Floating action button (bottom-right, site-wide) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className="fixed bottom-5 right-5 z-[70] h-14 w-14 rounded-full btn-amber text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[70] w-[min(92vw,380px)] h-[min(70vh,560px)] bg-forest border border-white/10 rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-charcoal/80 border-b border-white/10">
            <span className="inline-flex p-1.5 rounded-full bg-brass/20 text-brass">
              <Bot className="w-4 h-4" />
            </span>
            <div className="leading-tight">
              <div className="text-alabaster font-semibold text-sm">FixNear Assistant</div>
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">AI Guide · Online</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] text-sm rounded-2xl px-3.5 py-2.5 ${
                    m.role === 'user'
                      ? 'bg-brass text-forest rounded-br-sm'
                      : 'bg-white/5 text-ink rounded-bl-sm border border-white/5'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-3.5 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-brass" />
                </div>
              </div>
            )}

            {/* Contextual quick actions */}
            {last?.role === 'assistant' && maybeOfferRequest(last) && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => onRequestPro('')}
                  className="text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full btn-amber text-white cursor-pointer"
                >
                  Book Consultation ↗
                </button>
                <button
                  onClick={() => onRequestPro(TRADES[0].id)}
                  className="text-xs font-mono uppercase tracking-wide px-3 py-2 rounded-full border border-white/10 text-ink hover:border-brass cursor-pointer"
                >
                  Browse {TRADES[0].title.split(' ')[0]}
                </button>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={thinking}
                className="text-[11px] font-mono text-ink-muted border border-white/10 rounded-full px-2.5 py-1.5 hover:border-brass hover:text-brass transition-colors cursor-pointer disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-3 border-t border-white/10 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 bg-white/5 border border-white/5 rounded-full py-2.5 px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brass"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="h-10 w-10 rounded-full btn-amber text-white flex items-center justify-center cursor-pointer disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
