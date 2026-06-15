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
| Homepage (`Showcase` hero scene) | ✅ Live (not the 9-chapter scroll) |
| Brochure pages (contact, music, entryport, technologies, channels) | ✅ Live |
| Console / dashboard (Ask AI, Email, Drive, Projects) | ✅ Live, wired to YantraMate |
| YantraMate proxy routes (`app/api/*`) | ✅ Built |
| Auth (login/signup) | ⚠️ Demo-grade (sessionStorage, no server session) |
| Marketing forms (contact/project/notify) | ⚠️ Stubs (localStorage, no submit) |
| Blog / Lab notes | ⚠️ Static array; no `/lab` route or CMS |
| i18n (next-intl) | ⚠️ Installed, not wired |
| Smooth scroll (Lenis) | ⚠️ Installed, disabled (passthrough) |
| Inner pages (`/work/*`, `/capabilities`, `/atelier`, `/signal`) | ❌ Not built |
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
- [ ] Build the missing inner pages if still wanted: `/work/{restroverse,jimbo,shramdan}`, `/work`, `/capabilities`, `/atelier`, `/lab`, `/lab/[slug]`, `/signal`.

### Polish & decisions
- [ ] Decide the homepage: keep the `Showcase` scene, or assemble the 9 section components into the long-form scroll. Reconcile [03-sitemap.md](./03-sitemap.md) + [04-hero-concept.md](./04-hero-concept.md) with the decision.
- [ ] Re-enable Lenis smooth scroll, or remove the dependency + passthrough provider.
- [ ] Decide on i18n: wire `next-intl` (`[locale]` routes + middleware) or drop it until needed.
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
