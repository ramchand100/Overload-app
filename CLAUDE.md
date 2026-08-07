# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # ESLint
npm run format    # Prettier --write across the repo
npm run test      # run the Vitest suite once
npm run test:watch  # Vitest in watch mode
```

Run a single test file: `npx vitest run src/useAuth.test.js`
Run a single test by name: `npx vitest run -t "signOut calls supabase signOut"`

`npm run build` does not require `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` to be set — it only bundles the client code and never executes `createClient`. Running the app (`npm run dev`) or the test suite does not touch real Supabase either, since `useAuth.test.js`/`useData.test.js` mock `./supabase` directly.

CI (`.github/workflows/ci.yml`) runs `lint`, `test`, and `build` as separate jobs on every PR and on push to `main`.

## Architecture

**Stack**: React 18 + Vite (SPA, no router), Supabase (Postgres + Auth), deployed to Vercel. No backend server of any kind — the client talks to Supabase directly via `@supabase/supabase-js`.

**Data flow**: `src/main.jsx` wraps `<App>` in `ErrorBoundary` and renders it. `App.jsx` composes two hooks:
- `useAuth.js` — wraps Supabase Auth (Google OAuth + email/password), exposes `user`/`loading`/sign-in/out functions.
- `useData.js` — all Supabase reads/writes for `profiles`, `programs`, `sessions`, `workout_state`. Returns the four data collections plus mutator functions (`saveProgram`, `saveSession`, `saveWorkoutState`, etc.). Every mutator writes to Supabase first and only updates local state on success — don't reverse that order.

**Guest mode**: when there's no logged-in user, the same app state (`programs`, `sessionLog`, `wSets`) is persisted to `localStorage` instead of Supabase, under the keys `overload_programs`, `overload_sessionLog`, `overload_wSets`. On login, a one-time migration (guarded by the `overload_migration_started`/`overload_migrated` localStorage flags, in `App.jsx`) pushes any local guest data into Supabase via the `useData` mutators, then clears the local keys. If you touch guest-mode persistence, keep the local key names and the migration-guard flags in sync — they're referenced in several places (initial state loaders, the migration effect, and the account-deletion/logout handlers that reset them).

**Database schema** (`supabase-schema.sql`): four tables, all with Row Level Security scoped to `auth.uid()`. There is no migration tool — schema changes are applied by pasting the updated SQL directly into the Supabase SQL Editor for the project. When you change `supabase-schema.sql`, tell the user explicitly that they need to re-run it against their actual Supabase project; editing the file alone does not change anything live.

**`App.jsx` structure**: still the bulk of the UI (~1300 lines), navigated with a plain `useState('screen')` string (values like `'splash'`, `'ob_info1'`, `'main'`, etc.) rather than a router — there's a big `if (screen === '...')` chain near the bottom of the component. Some pieces have already been extracted for reuse/testability and live outside `App.jsx`:
- `src/icons.jsx` — the `TI` icon lookup object.
- `src/components/MiniGraph.jsx`, `WeightChart.jsx`, `CalendarView.jsx` — self-contained, prop-driven components.

Still inline in `App.jsx` and not yet extracted: the `S` CSS-in-JS string (injected via `<style>{S}</style>`, ~670 lines), and the exercise/split reference data (`EX_LIB`, `MUSCLE_TAGS`, `ALL_SPLITS`, `FREQ_OPTS`). If you're pulling more pieces out, prefer components with clear, narrow props (same pattern as the ones already extracted) over splitting the screen-switching logic itself, which is more entangled.

## Testing conventions

Tests mock `./supabase` directly (see `useAuth.test.js`, `useData.test.js`) rather than hitting a real project. `useData.test.js` includes a hand-rolled chainable query-builder mock (`makeQueryBuilder`) that distinguishes between a chain awaited directly (list/update/delete queries) and one ending in `.single()` (inserts, profile reads) — reuse it rather than writing a new mock shape when adding coverage for another `useData` mutator.

When passing a `user` object into `renderHook(() => useData(user))`, keep the object reference stable across renders (define it once outside the hook callback) — `useData`'s effect depends on `[user]` by reference, so a fresh object literal on every render call retriggers the load effect indefinitely.

`App.test.jsx` mocks `./useAuth` and `./useData` with explicit factories (`vi.mock('./useAuth', () => ({ useAuth: vi.fn() }))`) rather than bare `vi.mock('./useAuth')`. A bare call triggers Vitest's automock, which still imports the real module to infer its shape — and `useAuth.js`/`useData.js` both import `src/supabase.js`, which throws (`supabaseUrl is required`) if `createClient` runs without the env vars set.
