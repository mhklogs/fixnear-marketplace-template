import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * The app runs in two modes:
 *  - LIVE: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are provided -> real backend.
 *  - DEMO: credentials missing -> all calls resolve with local sample data so the
 *          UI is fully reviewable without a backend.
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

export type LeadStatus = 'pending' | 'in-progress' | 'archived';

export interface CampaignStep {
  question: string;
  key?: string;
  options?: string[];
}

export interface CampaignRow {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  industry_tag: string;
  steps: CampaignStep[];
  is_active: boolean;
}

export interface LeadRow {
  id: string;
  created_at: string;
  campaign_id: string | null;
  client_name: string;
  email: string;
  phone: string;
  zip_code: string;
  responses: Record<string, string>;
  status: LeadStatus;
  campaign_forms?: { title: string; industry_tag: string } | null;
}

// ---------------------------------------------------------
// HOMEOWNER FRONTEND FLOWS
// ---------------------------------------------------------

/** Fetch the active multi-step questionnaire for a specific service tag. */
export async function getActiveCampaign(industryTag: string): Promise<CampaignRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('campaign_forms')
    .select('*')
    .eq('industry_tag', industryTag)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return (data as CampaignRow) ?? null;
}

/** Submit a homeowner project request lead. */
export async function submitHomeownerLead(payload: {
  campaignId: string | null;
  clientName: string;
  email: string;
  phone: string;
  zipCode: string;
  responses: Record<string, string>;
}): Promise<LeadRow> {
  if (!supabase) {
    return {
      id: `RC-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      campaign_id: payload.campaignId,
      client_name: payload.clientName,
      email: payload.email,
      phone: payload.phone,
      zip_code: payload.zipCode,
      responses: payload.responses,
      status: 'pending',
    };
  }
  const { data, error } = await supabase
    .from('lead_submissions')
    .insert([
      {
        campaign_id: payload.campaignId,
        client_name: payload.clientName,
        email: payload.email,
        phone: payload.phone,
        zip_code: payload.zipCode,
        responses: payload.responses,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data as LeadRow;
}

// ---------------------------------------------------------
// ADMIN STRAP-IN COMMANDS (CRUD)
// ---------------------------------------------------------

/** All incoming homeowner request tickets. */
export async function fetchAllIncomingLeads(): Promise<LeadRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lead_submissions')
    .select('*, campaign_forms ( title, industry_tag )')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as LeadRow[]) ?? [];
}

export async function fetchAllCampaigns(): Promise<CampaignRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('campaign_forms')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CampaignRow[]) ?? [];
}

export async function saveCampaign(
  campaign: Partial<CampaignRow> & { id?: string }
): Promise<CampaignRow> {
  if (!supabase) {
    return {
      id: campaign.id ?? `camp_${Date.now()}`,
      created_at: new Date().toISOString(),
      title: campaign.title ?? '',
      description: campaign.description ?? null,
      industry_tag: campaign.industry_tag ?? '',
      steps: campaign.steps ?? [],
      is_active: campaign.is_active ?? true,
    };
  }
  const { data, error } = await supabase
    .from('campaign_forms')
    .upsert(campaign)
    .select()
    .single();
  if (error) throw error;
  return data as CampaignRow;
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('campaign_forms')
    .delete()
    .eq('id', campaignId);
  if (error) throw error;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('lead_submissions')
    .update({ status })
    .eq('id', leadId);
  if (error) throw error;
}

// ---------------------------------------------------------
// ADMIN AUTH
// ---------------------------------------------------------

export async function adminSignIn(email: string, password: string) {
  if (!supabase) throw new Error('not-configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/** Register a new admin operator. Session persists in the browser so the
 *  operator can sign in from any device, any time, and receive notifications. */
export async function adminSignUp(email: string, password: string) {
  if (!supabase) throw new Error('not-configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function adminSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
