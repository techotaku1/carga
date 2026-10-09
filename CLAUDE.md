# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project

Cargo-transport reports app (freight loads, income, costs, driver payments, monthly balance) built on the ixartz Next.js boilerplate. Next.js 16.4 App Router with Cache Components, Partial Prefetching, typed routes and the Rust React Compiler enabled in every environment (`next.config.ts`); React 19.3, Tailwind v4, Clerk auth, Drizzle + PostgreSQL, next-intl. `README.md` is the untouched boilerplate README and does not describe this app. Demo leftovers: `counter` table and `/api/counter`, `BaseTemplate`, sitemap entries for routes that do not exist.

UI copy is Spanish (`es` is the default locale and the i18n source of truth; `en` is secondary).

## Commands

- `npm run dev`: starts a local PGlite server on `local.db` (applies migrations first), then `next dev`. Delete `local.db/` to reset local data.
- `npm run build-local`: production build against a temporary in-memory database.
- `npm run build:next`: `next build` only. Do not run `npm run build`: it runs `db:migrate` against `DATABASE_URL` first.
- `npm run db:generate` after editing `src/models/Schema.ts`; `db:migrate` applies; `db:check` / `db:studio` inspect.
- Check gate (there is no aggregate `check` script): `npm run lint`, `check:types`, `check:deps` (knip), `check:i18n`, `test`. Run `build:next` too when routes or config change.
- Tests: `npm test` runs Vitest with two projects. `unit` (node, `src/**/*.test.{js,ts}`) and `ui` (Chromium via Playwright, `*.test.tsx`; fails with "Executable doesn't exist" until `npx playwright install chromium` is run). Single file: `npx vitest run --project unit <path>`. E2E: `npm run test:e2e` (Playwright, `tests/e2e/*.e2e.ts`; integration specs in `tests/integration/*.spec.ts`).
- Hooks (Lefthook): pre-commit runs `ultracite fix --type-aware --type-check` and knip; commit-msg runs commitlint.

## Architecture

- Routing: `src/proxy.ts` (Next 16 middleware) runs Arcjet bot detection (only when `ARCJET_KEY` is set), then next-intl routing (`localePrefix: 'as-needed'`). Clerk middleware wraps only `/dashboard*` and `/sign-in*` because Clerk keyless mode does not work with i18n; `auth.protect()` there is the page-level gate. Pages live under `src/app/[locale]/`; `(auth)/dashboard/` is protected.
- Cache Components: no route opts out (`instant = false` is not used). `[locale]/layout.tsx` has `generateStaticParams` for the locales; the Clerk catch-all pages return `[{ 'sign-in': [] }]` / `[{ 'user-profile': [] }]` so only the base path is prerendered. The dashboard header reads `currentUser()` inside a `<Suspense>` child. `loading.tsx` files render client components (`DashboardLoading.tsx`) so they need no request data. `sitemap.ts` uses `'use cache'` with `cacheLife('days')`.
- Typed routes: redirect with `redirect({ href, locale })` and `Link` from `@/libs/I18nNavigation`, not `next/navigation`.
- Data: the only real table is `cargo_reports` in `src/models/Schema.ts`. Money columns are whole-number integers (no decimals), `date` is a `yyyy-mm-dd` text column, not a timestamp.
- All DB access goes through server actions in `src/components/reports/cargoReportsActions.ts`. Each one calls `requireUserId()` (Clerk `auth()`) and scopes by `userId`; keep that on every new query (per-user data isolation). `paid` is only writable through `setCargoReportPaid`. The boards (`ReportsBoard`, `BalanceBoard`) load data in the client after mount; never cache these per-user reads.
- Balance math is pure and lives in `src/components/reports/cargoReportsBalance.ts`: income = `fullValue + extraProfit`; costs = fuel + toll + other + driver payment; net = income − costs. Reports are filtered by string comparison on `yyyy-mm(-dd)`.
- Dates use the local timezone (`reportDates.ts`); day shifting is done in UTC to stay safe across month boundaries. "Today" is built from local date parts, not `toISOString()`.
- Driver list and the custom "other cost" label are stored per browser in `localStorage`, not in the database, and are read after mount in an effect (hydration-safe).

## Rules and pitfalls

- Env: every variable is validated in `src/libs/Env.ts` (t3-env); never read `process.env` directly. Only exception: `src/proxy.ts`, to keep the middleware bundle small. Variable names: `DATABASE_URL`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `ARCJET_KEY`, `NEXT_PUBLIC_APP_URL`, plus optional logging/PostHog/Better Stack ones.
- Schema changes need a generated migration (`db:generate`) committed with the change.
- Lint: Ultracite/Oxlint/Oxfmt, central config `oxlint.config.ts` (ignores `.agents/**`, `.claude/**`, `.continue/**`). Intentionally off there: `react/function-component-definition`, `react/set-state-in-effect`, `react/incompatible-library`, and `react-doctor/only-export-components` for `src/app/**`. JSDoc blocks (`/**` directly above the symbol, short present-tense description, then `@param`, `@returns`, `@throws` only if it can throw) must carry described `@param`/`@returns` tags; lint enforces it.
- Retained dependencies (re-test before bumping): `typescript` ^6 (TS 7 breaks `eslint-plugin-github` via `ts-api-utils`), `@tanstack/react-table` ^8 (v9 gives ~50 type errors in `ReportsTable.tsx`), `ultracite` ~7.10.8 (7.12 needs `eslint` ^10, conflicting with `eslint-plugin-github`'s eslint 9).
- TypeScript: named exports only (default exports only for Next.js pages/layouts); `type`, not `interface`; absolute `@/` imports unless same directory; avoid `any` and casts; Zod is imported type-only when only types are needed (`import type * as z from 'zod'`); options object for 3+ params.
- React: no `useMemo`/`useCallback` (React Compiler); avoid `useEffect`; a single `props` param typed inline and read as `props.foo` (no destructuring); `React.ReactNode`, not `ReactNode`; no `try/finally` in components or effects (the compiler skips them).
- Pages: default export name ends in `Page` (props alias ends in `PageProps`). Locale pages take `props: { params: Promise<{ locale: string }> }`, `await props.params`, then call `setRequestLocale(locale)`. Define dashboard metadata once in the layout.
- i18n (next-intl): never hard-code user-visible strings. Page namespaces end in `Page`; context-specific keys (`card_title`, `meta_description`); `t.rich` for markup; sentence case; short error messages. Server: `getTranslations`; client: `useTranslations`. Keep `es.json` and `en.json` in sync (`check:i18n`).
- Tests: `*.test.ts` co-located with the code; `*.spec.ts` and `*.e2e.ts` in `tests/`. Top `describe` = subject; `it` titles are short, third-person present, sentence case, no period, and avoid "should/works/handles". Avoid mocks unless necessary.
- Design tokens: navy `#0c2434` (primary), gold `#f5c518` (accent), cream `#f7f5ef` (text on dark), ink `#14161b` (dark bg), muted `#64748b`. System-ui font stack, `0.95rem` card radius, `rounded-lg` controls.
