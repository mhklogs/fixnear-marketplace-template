import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import { localReply } from './src/lib/localChat.mjs';
import { autocompleteLocation } from './src/lib/autocomplete.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const app = express();
app.use(express.json());

const SYSTEM_PROMPT = `You are FixNear Assistant, the friendly AI guide for FixNear.com — a premium FixNear that connects verified local contractors (roofing, HVAC, plumbing, electrical, solar, remodeling, painting, landscaping, masonry, windows, flooring, decks, siding, garage, pest control, security) with high-intent homeowners.

Your job:
- Help homeowners pick the right trade and start a "Book Consultation" (tap any trade card or the Book Consultation buttons).
- Explain that booking is free for homeowners; the matched pro pays a small commission.
- Guide users through the site sections: Capabilities, Marketplace, Trust Wall, Insights, FAQ, Connect.
- Be concise, warm, and professional with an architectural, luxury tone.
- Mention that after a request or consultation is booked, "our team will email and call you to schedule a visit" and they should provide a phone number, address, and postal code so we match the right neighborhood pro.
- Keep replies under ~120 words unless the user asks for detail.
- If asked something off-topic, gently bring the conversation back to home services.`;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
  console.warn('[server] GEMINI_API_KEY not set — /api/chat will return a graceful fallback.');
}

app.post('/api/autocomplete', async (req, res) => {
  const { type, state, city, query } = req.body || {};
  if (!type) {
    return res.status(400).json({ error: 'type required' });
  }
  try {
    const suggestions = await autocompleteLocation({
      type,
      state,
      city,
      query,
      apiKey: API_KEY
    });
    return res.status(200).json({ suggestions });
  } catch (err) {
    console.error('[server-autocomplete] error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Server Error' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  if (!ai) {
    return res.status(200).json({
      reply:
        "I'm your FixNear guide. Tap any trade in the Marketplace or hit “Book Consultation” and I'll walk you through it. (Note: the AI backend key isn't configured right now.)",
    });
  }

  try {
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    contents.unshift({ role: 'user', parts: [{ text: SYSTEM_PROMPT }] });

    const result = await ai.models.generateContent({
      model: MODEL,
      contents,
    });
    const reply = result.text || "Sorry, I didn't catch that — could you rephrase?";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[server] gemini error — using local fallback', err?.status || err?.message || err);
    return res.status(200).json({
      reply: localReply(messages[messages.length - 1]?.content || ''),
    });
  }
});

// In production, serve the built app. In dev, Vite proxies /api here.
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] listening on http://0.0.0.0:${PORT} — /api/chat (Gemini ${MODEL})`);
});
