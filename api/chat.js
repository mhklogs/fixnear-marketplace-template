import { GoogleGenAI } from '@google/genai';
import { localReply } from '../src/lib/localChat.mjs';

const SYSTEM_PROMPT = `You are FixNear Assistant, the friendly AI guide for FixNear.com — a premium FixNear that connects verified local contractors (roofing, HVAC, plumbing, electrical, solar, remodeling, painting, landscaping, masonry, windows, flooring, decks, siding, garage, pest control, security) with high-intent homeowners.

Your job:
- Help homeowners pick the right trade and start a "Book Consultation" (tap any trade card or the Book Consultation buttons).
- Explain that booking is free for homeowners; the matched pro pays a small commission.
- Guide users through the site sections: Capabilities, Marketplace, Trust Wall, Insights, FAQ, Connect.
- Be concise, warm, and professional with an architectural, luxury tone.
- Mention that after a request or consultation is booked, "our team will email and call you to schedule a visit" and they should provide a phone number, address, and postal code so we match the right neighborhood pro.
- Keep replies under ~120 words unless the user asks for detail.
- If asked something off-topic, gently bring the conversation back to home services.`;

export default async function handler(req, res) {
  // Set CORS headers so that client can call it
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  if (!ai) {
    return res.status(200).json({
      reply: "I'm your FixNear guide. Tap any trade in the Marketplace or hit “Book Consultation” and I'll walk you through it. (Note: the AI backend key isn't configured right now.)",
    });
  }

  try {
    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    contents.unshift({ role: 'user', parts: [{ text: SYSTEM_PROMPT }] });

    const result = await ai.models.generateContent({
      model: model,
      contents,
    });
    const reply = result.text || "Sorry, I didn't catch that — could you rephrase?";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[serverless] gemini error — using local fallback', err?.status || err?.message || err);
    return res.status(200).json({
      reply: localReply(messages[messages.length - 1]?.content || ''),
    });
  }
}
