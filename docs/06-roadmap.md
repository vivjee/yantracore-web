# 06 — Roadmap & To-Do (Reference)

> **Layer: REFERENCE** — current build status and the live backlog. This replaces the original VISION phased plan (preserved in summary at the end). Keep this doc honest: when you ship or pick up an item, move it.
>
> Last updated: **2026-06-15**.

---

## Where the project is

`yantra-web` has moved well past the original "static marketing v1." Today it is a themed Next.js app with a working CRT shell, a runtime design system, and a **live console** wired to the YantraMate AI backend (Ask/RAG, email chat, Drive sync, projects). The marketing brochure exists alongside it but its forms are still local stubs.

### Status snapshot

| Area | Status |
|---|---|
| Design system (tokens, glass, palettes, fonts, cursor) | ✅ Built & in use |
| TV/CRT shell (`TvFrame`) | ✅ Built |
| Theme system (5 palettes, light/dark, fonts, cursor, reduced-motion) | ✅ Built |
| Audio (UI synth + music player) | ✅ Built |
| Glass primitives + motion primitives | ✅ Built (`/lab/playground` reviews them) |
| Homepage — orbital navigation hub (`HomeOrbital`) | ✅ Live (calm one-screen hub; replaced the `Showcase` scene) |
| Orbital route group — persistent `Sun` + seamless transitions | ✅ `/`, `/projects`, `/technologies` in the group (seamless nav); `/reach` stays a channel (own centerpiece) |
| Brochure pages (contact, music, reach, technologies, channels) | ✅ Live |
| Projects page (`/projects`) — `Showcase` in the orbital group | ✅ Live (own products; client work + testimonials moved to `/work`) |
| `/work` — client work grid + testimonials | ✅ Live (reuses `Work` + `Voices`) |
| `/about` — studio identity walkthrough | ✅ Live (reuses `Manifesto`/`Capabilities`/`Forge`) |
| `/book` — Book a Consultation (estimator + intake) | ✅ Live (`submitProject` localStorage stub) |
| Console / dashboard (Ask AI, Email, Drive, Projects) | ✅ Live, wired to YantraMate |
| YantraMate proxy routes (`app/api/*`) | ✅ Built |
| Auth (login/signup) | ⚠️ Demo-grade (sessionStorage, no server session) |
| Marketing forms (contact/project/notify) | ⚠️ Stubs (localStorage, no submit) |
| Blog / Lab notes | 🔨 In progress — building `/lab` + `/lab/[slug]` from the static `posts.ts` array (CMS swap later) |
| i18n (next-intl) | ⚠️ Installed, not wired — **kept**; multilingual planned (Nepali `ne` next, English default) |
| Smooth scroll (Lenis) | ❌ Decided to remove (unused; smooth-scroll deferred) |
| Inner pages — lean IA | `/lab` + `/lab/[slug]` 🔨 to build; `/work/*`, `/capabilities`, `/atelier`, `/signal` ❌ cut/folded (see [03-sitemap.md](./03-sitemap.md)) |
| Husky / Prettier / CI / Lighthouse budgets | ❌ Not set up |
| Deployment | ❌ Not configured |

---

## Active backlog / To-Do

Grouped by theme. Unordered within a group; promote items as priorities firm up.

### Hardening (correctness & security)
- [ ] **Consolidate the two YantraMate paths.** Route the typed client (`lib/api/yantramate.ts`) through the `app/api/*` proxies (or vice-versa) so the backend URL/key never reach the browser. See [12-app-api.md](./12-app-api.md).
- [ ] **Real auth.** Replace the `sessionStorage` demo (`ym_authed`/`ym_role`/`ym_user`) with a server session, protect `/dashboard` and the proxy routes, and wire the bearer-token stub (`YANTRAMATE_API_KEY`).
- [ ] **Secrets audit.** Ensure no backend URL/key is shipped in the client bundle once auth lands.

### Marketing wire-up (v2 surface)
- [ ] Flip `lib/api/{contact,project,notify}.ts` from localStorage stubs to a real endpoint.
- [ ] Flip `lib/api/posts.ts` from the static array to a real source (decide: keep typed TS, or a CMS/WordPress).
- [ ] Build `/lab` + `/lab/[slug]` (render `lib/api/posts.ts`). Other vision inner pages are **decided (lean IA):** team folds into `/about`, client services into `/about`'s `Capabilities` section; `/work/*` teasers, `/capabilities`, `/atelier`, and `/signal` are **cut** (see [03-sitemap.md](./03-sitemap.md)).

### Orbital makeover (in progress)

Reorganizing the site around one idea: **YantraCore is the sun; every page is a constellation orbiting it.** Orbital pages (`/`, `/projects`, `/technologies`) share one persistent, memoized `Sun` via the `app/(orbital)/` route-group layout (mounts once, never re-mounts) so navigation between them is seamless — while staying distinct, server-rendered, crawlable routes. Channel pages (including `/reach`, the globe) re-mount under their own `TvFrame` (the CRT channel-change glitch was since removed site-wide). See [03-sitemap.md](./03-sitemap.md#the-orbital-makeover-in-progress--phase-01-shipped-2026-06-15).

- [x] **Phase 0+1 — foundation + new Home.** `(orbital)` route group; persistent `Sun` + `OrbitalRings`; `SatelliteTransition`; `TvFrame` `seamless` prop (gates the channel glitch); removed the root `template.tsx` remount boundary; `SiteBackground` hoist-ready. New calm `HomeOrbital` hub. `Showcase` relocated to `/projects`. *Verified: `tsc` clean, full `next build` passes, `/` + `/projects` static-prerendered with crawlable anchors.*
- [x] **Phase 2 — Projects folded into the orbital group.** `Showcase` gained an `externalSun` prop (drops its own centre logo/copy) so the cards orbit the shared `Sun`; `/projects` moved under `app/(orbital)/`. **First real seamless navigation** (Home ⇄ Projects, no glitch, Sun persists). Client work + testimonials were split out to a dedicated **`/work`** page (`WorkWalkthrough`, reusing `Work` + `Voices`) — the orbital screen is height-locked, so scrollable proof content lives better on its own route.
- [x] **Phase 3 (mostly) — Technologies folded in; Activity renamed.** `/technologies` moved under `app/(orbital)/` for seamless nav — its opaque star-map (own centre star) covers the persistent Sun, sidestepping the big-Sun-vs-small-star scale mismatch. `/entryport` → `/activity` → `/reach` (308 redirects; kept a channel page since the globe is its own centerpiece). *Remaining: perfect the exit→enter cross-morph (frozen-router `AnimatePresence`) — now testable with 3 orbital routes.*
- [x] **Phase 4 — About** (`/about`). Identity walkthrough assembling the VISION sections (custom hero + `Manifesto` + `Capabilities` + `Forge` + CTA). *Verified: static-prerendered, single `<h1>`, crawlable CTAs.*
- [x] **Phase 5 — Book a Consultation** (`/book`). Budget estimator (`lib/content/estimator.ts` + `BudgetEstimator`) feeding the `submitProject` intake form. *Verified: static-prerendered, ESLint clean.*
- [ ] **Phase 6 — nav/IA wiring + docs sweep.** Home ✅ (About node → `/about`; Book CTA → `/book`). Contact refresh ✅ (`/book` cross-link). Chrome-bar nav ✅ Home/Projects/Technologies/Reach/Contact (`/reach` relabel done). **Remaining:** add **About** + **Work** to the global nav, and **rewire the stale `Footer`** — it still links `#studio`, `#capabilities`, `/atelier`, `/signal`, `/privacy`, `/terms` (dead) instead of the real IA. Docs sweep ✅ (this update). (Staffing deferred.)

### Polish & decisions
- [x] ~~Decide the homepage~~ — **decided (2026-06-15):** the homepage is the calm **orbital navigation hub**; the `Showcase` product scene moved to `/projects`. [04-hero-concept.md](./04-hero-concept.md)'s scroll-assembled hero remains a possible future treatment for `/about`.
- [x] ~~Re-enable or remove Lenis~~ — **decided: remove** (unused; smooth-scroll deferred). Drop the dep + the passthrough `SmoothScrollProvider`.
- [x] ~~Decide on i18n~~ — **decided: keep `next-intl`**; multilingual is planned (Nepali `ne` next, English default). Wiring (`[locale]` routes + middleware) is future work, not now.
- [ ] Wire `FloatingAssistant` to YantraMate (currently a simulated demo).

### Quality infrastructure
- [ ] Add a typecheck script + lint in CI (GitHub Actions).
- [ ] Add Prettier (or document "match surrounding style" as the rule) and optional Husky/lint-staged.
- [ ] Accessibility pass (keyboard nav on the TV shell + dashboard, focus rings, contrast on neumorphic surfaces).
- [ ] Performance pass (bundle analysis, lazy-load 3D/heavy canvases, measure LCP/INP against the VISION budgets in [05](./05-tech-architecture.md#performance--accessibility-intent--status)).
- [ ] Deployment: pick a host, configure env vars, DNS, analytics.

> **Working convention:** keep this list current. When you finish an item, check it off (or delete it) in the same commit as the work. New significant work should be reflected here so the backlog stays the real picture.

---

## Appendix — original VISION roadmap (superseded)

The first roadmap sequenced a **hero-first** build in phases: Phase 0 foundation → Phase 0.5 i18n → Phase 1 glass primitives + `/lab/playground` → Phase 2 the cinematic hero → Phase 3 content → Phase 4 the 9 homepage chapters → Phase 5 inner pages → Phase 6 polish/audit → Phase 7 v2 wiring (Node API, WordPress, i18n flip, deployment). Phases 0–1 shipped; the build then diverged toward the console/app + theming/CRT systems rather than continuing the chapter-by-chapter marketing scroll. The unbuilt phases (inner pages, v2 wiring, polish/audit/deploy) survive as the backlog above.
