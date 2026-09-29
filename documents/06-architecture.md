# fixnear-marketplace-template — Architecture Summary

> Generated from static analysis on 2026-09-28.

## Components

| Layer | Present | Evidence |
| --- | --- | --- |
| Presentation / UI | yes | 0 route module(s), 27 component file(s) |
| API / server | yes | 0 handler(s), entrypoints: src/data/index.ts |
| Domain / business logic | unclear | no dedicated layer detected |
| Persistence | yes | @supabase/supabase-js |
| Authentication | no | none detected |

## Detected frameworks and libraries

| Package | Purpose (inferred) |
| --- | --- |
| `@google/genai` | dependency |
| `@supabase/supabase-js` | Supabase |
| `@tailwindcss/vite` | dependency |
| `@types/express` | dependency |
| `@types/node` | dependency |
| `@vitejs/plugin-react` | dependency |
| `autoprefixer` | dependency |
| `dotenv` | dependency |
| `esbuild` | esbuild |
| `express` | Express |
| `gsap` | dependency |
| `lucide-react` | dependency |
| `motion` | dependency |
| `react` | React |
| `react-dom` | React |
| `tailwindcss` | Tailwind CSS |
| `tsx` | dependency |
| `typescript` | dependency |
| `vite` | Vite |

## Runtime and delivery

| Concern | Finding |
| --- | --- |
| Language mix | TypeScript, JavaScript, HTML, CSS, SQL |
| Package manager | npm |
| Container | none |
| Serverless / PaaS | Vercel configuration present |
| CI | none detected |
| Tests | **none detected** |
| Type safety | TypeScript |

## Environment variables referenced

- `DISABLE_HMR`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NODE_ENV`
- `PORT`
