import { ServiceType } from '../types';

export interface CampaignStep {
  question: string;
  key?: string;
  options?: string[];
}

export interface HomeownerLead {
  id: string;
  created_at: string;
  trade: ServiceType | '';
  responses: Record<string, string>;
  contactName: string;
  email: string;
  phone: string;
  zip: string;
  neighborhood: string;
}

/**
 * Local-only lead submission. No backend / Supabase dependency — generates a
 * reference token client-side so the request flow works end-to-end offline.
 */
export async function submitHomeownerLead(payload: {
  trade: ServiceType | '';
  responses: Record<string, string>;
  contactName: string;
  email: string;
  phone: string;
  zip: string;
}): Promise<HomeownerLead> {
  const neighborhood = deriveNeighborhood(payload.zip);
  const lead: HomeownerLead = {
    id: `RC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
    created_at: new Date().toISOString(),
    trade: payload.trade,
    responses: payload.responses,
    contactName: payload.contactName,
    email: payload.email,
    phone: payload.phone,
    zip: payload.zip.trim(),
    neighborhood,
  };
  return lead;
}

/** Best-effort neighborhood label from the postal code prefix. */
export function deriveNeighborhood(zip: string): string {
  const z = (zip || '').trim();
  if (!z) return 'your area';
  const prefix = z.slice(0, 3);
  return `postal area ${prefix}XX (${z})`;
}
