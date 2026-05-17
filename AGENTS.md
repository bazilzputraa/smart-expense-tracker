<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Piggy — Smart Expense Tracker

Single-package Next.js 16.2.4 App Router project. React 19, TypeScript 5, Tailwind CSS v4.

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Start (prod) | `npm run start` |

No test framework or typecheck script is configured — do not add them without asking.

## Toolchain quirks

- **Tailwind v4**: no `tailwind.config.js`. Uses `@import "tailwindcss"`, `@theme inline` with `oklch()` colors, `@custom-variant dark (&:is(.dark *))`. PostCSS config has only `@tailwindcss/postcss` (no autoprefixer).
- **shadcn/ui base-nova style**: uses `@base-ui/react` primitives (NOT Radix). Components use `data-slot` attributes, `@container` queries, CVA. Check `@/components/ui/*` before adding new primitives.
- **ESLint v9 flat config** in `eslint.config.mjs` — not `.eslintrc.*`.
- **No Prettier / Biome**. Only ESLint for formatting.

## Architecture

- `@/*` → `./src/*`
- `src/app/layout.tsx` — server component root layout.
- `src/app/page.tsx` — `"use client"` home page (the only page). Scaffold routes under `src/app/(auth)/` and `src/app/dashboard/` are empty placeholders.
- `POST /api/parse-transaction` — AI transaction parser (OpenAI GPT-4o-mini). Falls back to manual regex when `OPENAI_API_KEY` is unset.
- `src/lib/supabase.ts` / `src/lib/openai.ts` — client singletons.
- `src/services/transaction.service.ts` — Supabase DB wrapper.

## Database (Supabase)

- Schema in `supabase-schema.sql` — `public.transactions` table with RLS (user-scoped), pgvector extension, `receipts` storage bucket.
- Monetary `amount` stored as **BIGINT in native unit** (not cents/sen). Frontend `Transaction` interface uses `number`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to commit (RLS-enforced). `NEXT_PUBLIC_SUPABASE_URL` is already committed.

## Conventions

- Indonesian locale (`id-ID`, `IDR`) for currency formatting. Transaction parsing handles Indonesian shorthand: `rb` (ribu), `jt` (juta).
- Strict TypeScript (`tsconfig.json` includes `.next/types/**/*.ts`). Use `@/` imports.
- No CI/CD, no Docker. Deploys to Vercel.
