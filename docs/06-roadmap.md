# 06 — Phased Roadmap

> Status: **proposal**. This sequences the build so you see something impressive early, then we expand.

You chose **hero-first**: nail the wow scene before committing to the rest. This roadmap honors that.

Time estimates are approximate working sessions, not calendar days — they depend on how often we iterate and how much asset work happens in parallel on your side.

---

## Phase 0 — Foundation

**Goal:** A boring, working Next.js skeleton so every later phase moves fast.

**Tasks:**
- Initialize Next.js 15 + TypeScript + Tailwind v4
- Install + configure: GSAP (free), `split-type`, Lenis, R3F, drei, Framer Motion, shadcn/ui base, lucide-react, next-intl
- Set up fonts: General Sans (self-hosted Fontshare in `public/fonts/general-sans/`) + Inter + JetBrains Mono via `next/font`
- Brand tokens (Crystal palette) as CSS custom properties; Tailwind theme extension; alternate palettes commented in `styles/palettes.css`
- **i18n scaffolding**: deferred to a focused Phase 0.5 sprint (see below). `next-intl` package is installed; route restructure (`app/[locale]/...`) happens before we build any content-bearing pages
- **Static content layer**: `lib/content/en/` with empty MDX + typed constant stubs (capabilities, team, testimonials, client-work, products, lab posts)
- **API stub layer**: `lib/api/{contact,project,notify-*,posts}.ts` with no-op + localStorage implementations
- Base layout: dark canvas, root container, smooth-scroll provider, cursor component (placeholder)
- ESLint, Prettier, Husky, basic CI workflow
- `.env.example` with placeholders for v2 wiring
- Empty marketing layout with placeholder nav + footer
- Local dev runs cleanly; no Vercel coupling

**Deliverable:** A blank dark page on `localhost:3000` that renders fonts and applies the brand tokens. Not impressive yet — this is the load-bearing scaffold.

**Estimated effort:** 1 working session.

---

## Phase 1 — Glass Primitives

**Goal:** Build the kit of parts every section will use. Get the *signature card hover* and *animated borders* perfect once so we never rebuild them.

**Tasks:**
- `<GlassCard>` (3 variants: light/medium/heavy) with signature hover (tilt + glow + cursor spotlight)
- `<AnimatedBorder>` with three modes (conic-sweep, trace-on-scroll, pulse)
- `<GlassButton>` (uses AnimatedBorder)
- `<GlassInput>` (for forms)
- `<GlassPanel>` (nav/modal surface)
- A throwaway `/lab/playground` route that showcases every primitive in one page so we can review them together
- Background pattern components: `<MeshGradient>`, `<DotField>`, `<LineWeave>`, `<NoiseAura>`

**Deliverable:** `/lab/playground` URL where you can scroll through every glass primitive and background pattern. This is the **first review checkpoint** — if the glass and borders don't sing here, they won't sing in production.

**Estimated effort:** 2–3 sessions.

---

## Phase 0.5 — i18n Scaffolding (next session)

**Goal:** Wrap the existing routes in a `[locale]` segment using `next-intl` so multi-lingual is one config change away when v2 ships.

**Tasks:**
- Move `app/page.tsx` and `app/lab/playground/page.tsx` under `app/[locale]/`
- Create `i18n/request.ts` + `i18n/routing.ts`
- Add `middleware.ts` routing default locale (`en`) at `/`
- Seed `messages/en.json` with all UI strings; refactor components to read from `useTranslations()` / `getTranslations()`
- Hidden language switcher built (feature-flagged off)

**Deliverable:** Same site, no visible difference, but now i18n-ready. Adding a locale becomes a JSON file drop.

**Estimated effort:** 1 session.

---

## Phase 2 — The Hero ("The Machinery")

**Goal:** Build the showpiece. See [04-hero-concept.md](./04-hero-concept.md) for the full scene.

**Sub-phases:**
1. Static skeleton (headline, sub, CTA, nav, dark canvas) — *immediately impressive even without motion*
2. `<MeshGradient>` shader background
3. Volumetric light cones
4. Placeholder 3D logo (procedural geometry) → swap your GLB when ready
5. One perfected `<OrbitalCard>` → multiply to 6 with Lissajous drift
6. Mouse parallax + logo gaze
7. Animated borders on all cards
8. GSAP ScrollTrigger choreography (the assembly)
9. Mobile variant (no scroll hijack)
10. Reduced-motion variant
11. Performance pass (LCP target < 2s)

**Deliverable:** A homepage that has *only* the hero, deployed. This is the **second review checkpoint** — and the moment we judge whether the entire direction works. If yes, full speed ahead. If no, we recalibrate before committing weeks to the rest.

**Estimated effort:** 4–6 sessions.

---

## Phase 3 — Content Drafting

**Goal:** I draft all v1 copy across every section so we ship a fully populated site, not a wireframe.

**Tasks:**
- I draft proposed copy for each section into `lib/content/en/*` (manifesto, capability descriptions, product teasers for Restroverse/Jimbo/Shramdan, client work blurbs, team bios, placeholder testimonials, placeholder blog posts) — you revise later
- Asset checklist for you to provide async: team headshots (8), client/tech logos (~6–12 SVGs), any Shramdan community photos, any Restroverse/Jimbo render exports

**Deliverable:** Site fully populated with draft copy and placeholder/real assets — no Lorem Ipsum anywhere.

**Estimated effort:** 1–2 sessions (I work async between your reviews).

---

## Phase 4 — Homepage Chapters 02–09

**Goal:** Build the remaining chapters of the homepage in narrative order.

For each chapter (in this order — they build on each other):

### 4a — Chapter 02: Manifesto
Display type block, trace-border animation, NoiseAura background, 3 pillar cards.

### 4b — Chapter 03: In the Studio (products)
Restroverse + Jimbo + Shramdan showcases stacked vertically. PhoneFrame + BrowserFrame composites. Cinematic transitions between products. Real video loop for Jimbo, real screenshots for Restroverse, real photos for Shramdan (or placeholders we swap).

### 4c — Chapter 04: Capabilities (client services)
Horizontal scroll-pinned constellation; one capability card built well, then replicated. Animated icon scenes per capability.

### 4d — Chapter 05: The Forge
The krootl-style scroll-pinned process scene. Most cinematic moment of this phase. 3D slab accumulating layers across 4 phases.

### 4e — Chapter 06: Client Work
MarqueeRow logo wall; click → glass modal with project details. PhoneFrame + BrowserFrame components built here, reused in product pages.

### 4f — Chapter 07: Voices
3D stacked testimonial cards; hover lifts to center.

### 4g — Chapter 08: Lab Notes (WP headless)
LineWeave background; 3 recent post cards pulled live from WordPress.

### 4h — Chapter 09: Signal
Final hero-reprise; two forms (Submit Project + Quick Contact) → Node API via edge route; integrated footer.

**Deliverable:** Fully functional, polished homepage at a preview URL.

**Estimated effort:** 1–2 sessions per chapter, so 8–16 sessions total. This is the bulk of the build.

---

## Phase 5 — Inner Pages

**Goal:** Build the deep-dive pages. By now the brand system is mature, so these go faster.

**Tasks:**
- `/work/restroverse` — product microsite-feel page
- `/work/jimbo` — product microsite-feel page (with live demo if feasible)
- `/work/shramdan` — community page (different register, warmer)
- `/work` — client work index
- `/capabilities` — services depth page
- `/atelier` — about + team grid (with team photos)
- `/lab` — blog index, pulled from WordPress
- `/lab/[slug]` — blog post template, renders sanitized WP HTML
- `/signal` — standalone contact page
- 404, error boundaries
- View Transitions API between routes

**Deliverable:** Every route in the sitemap exists and is polished.

**Estimated effort:** 4–6 sessions.

---

## Phase 6 — Polish, Audit, Ship

**Goal:** Take the site from "great" to "shippable."

**Tasks:**
- Cross-browser pass: Chrome, Firefox, Safari (desktop + iOS), Edge
- Real-device mobile pass (mid-tier Android + iPhone)
- Accessibility audit (axe-core + manual keyboard pass + screen reader smoke test)
- Lighthouse pass on every page (target 90+ Performance, 95+ Accessibility, 100 SEO, 100 Best Practices)
- Image and video optimization pass (every asset right-sized)
- Bundle analysis; trim heavy imports
- Meta tags + OG images per page (dynamic OG via `@vercel/og`)
- robots.txt, sitemap.xml, structured data (JSON-LD)
- Privacy policy, terms (you provide copy or we use a template)
- Custom domain setup, SSL, DNS
- Pre-launch QA checklist (forms tested end-to-end against real Node API; rate limiting verified; error states all reachable)

**Deliverable:** A site you're proud to put on yantracore.com.

**Estimated effort:** 2–3 sessions.

---

## Phase 7 — Post-Launch (v2 wiring)

Things deferred to v2:

- **Wire forms to Node API** — flip `lib/api/contact.ts`, `project.ts`, `notify-*.ts` from stubs to real fetches
- **Wire blog to WordPress** — flip `lib/api/posts.ts` from static array to WP REST or WPGraphQL call
- **Enable multi-lingual** — add `messages/{locale}.json` files, expose language switcher, add `/hi/...` and other locale routes
- **Real testimonials, headshots, product visuals** — drop in as they land; no code changes
- **Deployment** — pick host (Vercel / Netlify / self-hosted), configure DNS, CI/CD, analytics
- **Storybook** for component documentation (if team grows)
- **CMS migration** (Sanity or Contentful) once non-technical updates become frequent
- **A/B testing** infra for CTA copy and hero variants
- **Awwwards / FWA submission** — we should aim for this; the site will be eligible

---

## How we work in practice

After each phase ships:
1. You review the preview URL.
2. We agree on what to fix, what to tune, what to push further.
3. I iterate until you're happy *before* starting the next phase.

The unspoken rule: **no phase moves forward until the previous one is polished.** Award-winning sites are not built by rushing through ten phases; they're built by stopping at each phase and asking "is this actually great?"

---

## Risk Checkpoints

Three points in the timeline where we decide whether to continue or recalibrate:

- **End of Phase 1 (Glass Playground)** — Do the primitives feel right? If yes, full speed. If no, we tune the brand system before touching the hero.
- **End of Phase 2 (Hero)** — Does the showpiece work? This is the make-or-break checkpoint. If the hero doesn't earn its keep, we don't push the same direction across the whole site.
- **End of Phase 4 (Homepage complete)** — Before building inner pages, we look at the homepage as a whole and decide if anything needs structural rework.

These three checkpoints protect you from sunk-cost momentum: if the direction stops working, we know early.

---

## What you provide in parallel (async, no blockers)

- ✅ 3D logo GLB — already at `public/images/logo/` (great)
- Team headshots (8 members: 5 staff + 3 management) — when ready
- Client/tech logos (SVG, white-on-transparent, ~6–12)
- Any Shramdan community photos you want featured (JPG/PNG, optional)
- Restroverse/Jimbo render exports from your design tool (PNG or MP4, optional — I can mock convincingly without them)
- Final external product URLs once they launch (placeholder links until then)

Nothing on this list blocks any phase. Real assets swap in to replace placeholders without code changes.

---

## My recommended starting point

Once you've reviewed these docs and given me a green light (with or without changes):

1. I kick off **Phase 0 + Phase 1 together** — scaffold the project and build the glass primitives playground in one push.
2. We pause at the playground URL and you tell me which primitives feel right.
3. We move into **Phase 2** (the hero) with confidence in the building blocks.

That gets us to the most important review moment — the hero — in roughly **6–10 working sessions** from your green light.

Ready when you are.
