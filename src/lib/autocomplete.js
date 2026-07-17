import { GoogleGenAI } from '@google/genai';

export const STATES = [
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

export const TOP_CITIES = {
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

export async function autocompleteLocation({ type, state, city, query, apiKey }) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  
  if (!apiKey) {
    return getLocalFallback({ type, state, city, query });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    let prompt = '';
    let schema = {};

    if (type === 'state') {
      prompt = `You are a helper that searches US states. Return a JSON object with a list of US states matching the partial search query "${query}". 
If the query is empty or 1 letter, return all states starting with or containing that query.
Each state object in the suggestions list MUST contain "name" (the full state name, e.g., "Texas") and "code" (the 2-letter postal code abbreviation, e.g., "TX"). 
Only return valid, actual US states. Do not include territories. Ensure the names are properly capitalized.`;
      
      schema = {
        type: "OBJECT",
        properties: {
          suggestions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                code: { type: "STRING" }
              },
              required: ["name", "code"]
            }
          }
        },
        required: ["suggestions"]
      };
    } else if (type === 'city') {
      prompt = `You are a helper that searches cities in the US state "${state}". Return a JSON object with a list of cities in "${state}" that match the search query "${query}".
Only return valid, actual cities in that state. If the query is empty or 1 letter, return the most common/populous cities in "${state}" starting with or containing that query.
Do not include zip codes or counties, just the plain city names (e.g. "Houston"). Return at most 15 suggestions.`;

      schema = {
        type: "OBJECT",
        properties: {
          suggestions: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["suggestions"]
      };
    } else if (type === 'zip') {
      prompt = `You are a helper that searches ZIP codes. Return a JSON object with a list of valid 5-digit ZIP codes for the city "${city}" in the state "${state}" that start with or match the prefix "${query}".
Only return valid ZIP codes that belong to "${city}, ${state}". Return at most 15 suggestions.`;

      schema = {
        type: "OBJECT",
        properties: {
          suggestions: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["suggestions"]
      };
    } else {
      throw new Error('Invalid autocomplete type');
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      if (data && Array.isArray(data.suggestions)) {
        return data.suggestions;
      }
    }
    throw new Error('Empty response or invalid format');
  } catch (err) {
    console.error('[autocomplete] Gemini API error, using local fallback:', err?.message || err);
    return getLocalFallback({ type, state, city, query });
  }
}

async function getLocalFallback({ type, state, city, query }) {
  const q = (query || '').trim().toLowerCase();
  
  if (type === 'state') {
    if (!q) return STATES;
    return STATES.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q)
    );
  }
  
  if (type === 'city') {
    const stateCities = TOP_CITIES[state?.toUpperCase()] || [];
    if (!q) return stateCities;
    return stateCities.filter(c => c.toLowerCase().includes(q));
  }
  
  if (type === 'zip') {
    if (!state || !city) return [];
    try {
      const cleanCity = encodeURIComponent(city.trim().toLowerCase());
      const res = await fetch(`https://api.zippopotam.us/us/${state.toLowerCase()}/${cleanCity}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.places && data.places.length > 0) {
          const codes = data.places.map((p) => p['post code']);
          const uniqueCodes = Array.from(new Set(codes)).sort();
          if (!q) return uniqueCodes.slice(0, 15);
          return uniqueCodes.filter(c => c.startsWith(q)).slice(0, 15);
        }
      }
    } catch (err) {
      console.error('[autocomplete-fallback] Zippopotam failed', err);
    }
    return [];
  }
  
  return [];
}
