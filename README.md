<div align="center">

# FixNear

**Home-services marketplace template** — curated contractor directory, lead
pipeline, AI chat with a knowledge base, reviews and scheduling flows, wired for
Supabase with a graceful keyless demo mode.

`React 19` `Vite` `TypeScript` `Tailwind 4` `Supabase` `Gemini` `Express`

[Quickstart](#quickstart) · [Features](#features) · [Stack](#stack) · [Configuration](#configuration) · [Not included](#not-included)

</div>

---

## Why this template exists

A two-sided home-services marketplace has a deceptively hard UX problem: the
homeowner wants to trust a stranger with their house, and the contractor wants
qualified leads instead of a phone tree. Most hand-rolled versions solve one
side and ignore the other.

FixNear ships both halves — a **trust-forward homeowner experience** (vetting,
verified reviews, insurance badges, transparent process) and a **funnel that
actually converts for contractors** (multi-step lead wizard, scheduling
session, pipeline visualisation).

Everything runs **without any API keys**. Add Supabase for persistence and
Gemini for the chat widget when you're ready; without them the app falls back to
a local demo engine instead of breaking.

---

## Features

### Marketplace
- **Curated trade directory** — contractor cards with trade specialisation,
  service area, verified-credential badges and rating breakdowns
- **Trade filtering** — filter by trade, service area and availability
- **Review system** — aggregated ratings with per-trade review lists
- **Trust wall** — insurance, licensing and background-check signals surfaced
  before the homeowner ever enquires

### Lead capture
- **Multi-step lead wizard** (`LeadWizard`) — qualifies the homeowner on trade,
  scope, budget and timeline before handing off to a contractor
- **Lead pipeline** (`ConnectPipeline`) — visual funnel from enquiry through
  matched, scheduled and completed
- **Scheduling session** — slot selection and confirmation step
- **Homeowner modal** — request-detail capture without a page change

### AI
- **Chat widget** (`ChatWidget`) — Gemini-backed assistant grounded in a trade
  knowledge base (`KnowledgeHub`), with markdown rendering
- **Trade autocomplete** — `@google/genai` powered suggestion endpoint
- **Keyless fallback** — both degrade to a local canned-response engine when no
  key is configured, so demos and forks never break

### Content and presentation
- **Blog** and **FAQ** sections with dedicated components
- **Scroll choreography** — `Parallax`, `ScrollSlide` and `Reveal` wrappers for
  section entrance animation
- **Glass-morphism cards** (`GlassCard`) and ambient gradient wash (`AmbientGlow`)
- **Isolated nav** (`NavIsland`) — a floating nav island that detaches on scroll
- **Metrics band** — animated statistic counters

---

## Quickstart

Prerequisites: **Node.js 18+**.

```bash
npm install
npm run dev
```

That is the whole setup. No `.env` is required — the app boots in demo mode.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server plus the local API server on `PORT` (default 3001) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove `dist/` and the local server bundle |

Verified: `npm run lint` and `npm run build` both pass on a clean install.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Build | Vite 6 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Animation | GSAP 3 + Motion 12 |
| Data | Supabase (optional — local demo mode without it) |
| AI | `@google/genai` — Gemini 2.0 Flash (optional) |
| API | Express server for chat + autocomplete |
| Icons | lucide-react |

---

## Configuration

Every variable is optional. Copy `.env.example` to `.env` and fill in what you need.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | No | Supabase project URL. Blank → in-memory demo data |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key. Blank → in-memory demo data |
| `GEMINI_API_KEY` | No | Enables the chat widget and autocomplete |
| `GOOGLE_GENERATIVE_AI_API_KEY` | No | Fallback name for the Gemini key |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.0-flash` |
| `PORT` | No | Local API server port, defaults to `3001` |

**Never commit `.env`.** It is git-ignored; only `.env.example` is tracked.

### Where content lives

| What | Where |
| --- | --- |
| Trades and service catalogue | `src/data/trades.ts` |
| Reviews and testimonials | `src/data/reviews.ts` |
| Supabase client and demo-mode shim | `src/lib/supabase.ts` |
| Chat client and local fallback | `src/lib/chat.ts`, `src/lib/localChat.mjs` |
| Lead submission | `src/lib/leads.ts` |
| Page-level components | `src/components/` |
| AI endpoints | `api/chat.js`, `api/autocomplete.js` |

Branding lives in the component copy and `index.html` metadata. `metadata.json`
carries the app name and description.

---

## Not included

- ❌ **No payment processing** — no Stripe or equivalent
- ❌ **No real contractor data** — every listing, rating and credential in the
  demo dataset is fabricated placeholder content
- ❌ **No auth or accounts** — the lead wizard does not create user accounts
- ❌ **No CMS** — content is typed TS modules, not fetched at runtime
- ❌ **No notifications** — no email or SMS on lead submission
- ❌ **No booking calendar integration**

> Placeholder data is intentional. Replace the entire `src/data/` contents
> before using this commercially. The `Insured` / verified-credential badges are
> UI affordances only — implement real verification before implying it.

---

## Deployment

`vercel.json` is included for Vercel: the build emits `dist/` as static output
and `api/` is deployed as serverless functions.

Any static host works for the front end. The chat and autocomplete endpoints
need a Node runtime (or equivalent) and a `GEMINI_API_KEY`.

---

## Engineering documentation

`documents/` holds specs derived from the source tree — functional and
non-functional requirements, data-flow diagram, use cases, and an architecture
summary. Read these before extending the app.

## License

MIT — use commercially, no attribution required.
