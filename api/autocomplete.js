import { autocompleteLocation } from '../src/lib/autocomplete.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, state, city, query } = req.body || {};
  
  if (!type) {
    return res.status(400).json({ error: 'type parameter required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    const suggestions = await autocompleteLocation({ type, state, city, query, apiKey });
    return res.status(200).json({ suggestions });
  } catch (err) {
    console.error('[serverless-autocomplete] error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Server Error' });
  }
}
