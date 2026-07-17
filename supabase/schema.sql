-- ReferralClose — Homeowner-Only Database Schema
-- Run this in the Supabase SQL Editor to provision tables, RLS policies,
-- and seed initial homeowner matchmaker campaigns.

-- =========================================================
-- 1. TABLES
-- =========================================================

-- Dynamically configured homeowner matching forms (campaigns)
CREATE TABLE IF NOT EXISTS public.campaign_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    industry_tag TEXT NOT NULL,                 -- e.g. 'plumbing', 'roofing'
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Array of steps (questions, input formats, options)
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Homeowner lead submissions (Request Tickets)
CREATE TABLE IF NOT EXISTS public.lead_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    campaign_id UUID REFERENCES public.campaign_forms(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb, -- Captured answers (key-value map)
    status TEXT DEFAULT 'pending' NOT NULL        -- 'pending', 'in-progress', 'archived'
);

CREATE INDEX IF NOT EXISTS idx_campaign_forms_tag ON public.campaign_forms (industry_tag);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_campaign ON public.lead_submissions (campaign_id);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_status ON public.lead_submissions (status);

-- =========================================================
-- 2. ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.campaign_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;

-- Public (anon) can read active forms and insert new leads
DROP POLICY IF EXISTS "Allow public select active forms" ON public.campaign_forms;
CREATE POLICY "Allow public select active forms"
    ON public.campaign_forms FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Allow public to submit leads" ON public.lead_submissions;
CREATE POLICY "Allow public to submit leads"
    ON public.lead_submissions FOR INSERT
    WITH CHECK (true);

-- Authenticated admins get full CRUD
DROP POLICY IF EXISTS "Full admin access to forms" ON public.campaign_forms;
CREATE POLICY "Full admin access to forms"
    ON public.campaign_forms FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Full admin access to submissions" ON public.lead_submissions;
CREATE POLICY "Full admin access to submissions"
    ON public.lead_submissions FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =========================================================
-- 3. SEED INITIAL HOMEOWNER MATCHMAKERS
-- =========================================================

INSERT INTO public.campaign_forms (title, description, industry_tag, is_active, steps)
VALUES
    (
        'Roofing Project Funnel',
        'Captures roof type, square footage, and timeline to match homeowners with certified local roofers.',
        'roofing',
        true,
        '[
            { "question": "What type of roofing service do you need?", "options": ["Repair", "Full Replacement", "Inspection"] },
            { "question": "Approximate roof square footage?", "options": ["Under 1,500", "1,500 - 3,000", "3,000+"] },
            { "question": "Desired timeline?", "options": ["ASAP", "Within a month", "Just exploring"] }
        ]'::jsonb
    ),
    (
        'Plumbing Project Funnel',
        'Collects issue type, residential/commercial, and urgency for fast plumber routing.',
        'plumbing',
        true,
        '[
            { "question": "What is the issue?", "options": ["Leak", "Clog", "Remodel", "Water Heater"] },
            { "question": "Urgency?", "options": ["Emergency", "This week", "Flexible"] }
        ]'::jsonb
    ),
    (
        'HVAC Project Funnel',
        'Captures system type and emergency status for heating/cooling dispatch.',
        'hvac',
        true,
        '[
            { "question": "System type?", "options": ["Central AC", "Heat Pump", "Furnace"] },
            { "question": "Is this an emergency?", "options": ["Yes", "No"] }
        ]'::jsonb
    )
ON CONFLICT DO NOTHING;
