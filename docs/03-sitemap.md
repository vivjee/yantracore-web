# 03 — Sitemap & Information Architecture

> **Layer: VISION + REFERENCE.** The reference table below is the **routes that actually exist today**. Everything after the divider is the original narrative IA **vision** (the 9-chapter scroll, inner pages, nav structure) — aspirational, not all built. Trust the table for what's real.

## Routes that actually exist (REFERENCE — 2026-06-15)

| Route | Surface | What it is |
|---|---|---|
| `/` | Brochure | Homepage — calm **orbital navigation hub** (`HomeOrbital`). Lives in the `app/(orbital)/` route group; the animated logo (`Sun`) is a *persistent* centre. Satellites: 3 initiative portals (Jimbo/Restroverse/Shramdan) + 3 wayfinding nodes (Projects/Technologies/About) + identity copy & two CTAs (Book a Consultation → `/book`, Explore Projects → `/projects`). On **md+** the satellites ride a single elliptical **orbit ring** around the Sun (left arc = *Explore* / wayfinding, right arc = *Our Projects* / initiatives), each drifting on its own slow bob, with the copy nested in the ring's open base; phones keep a compact 2-column grid |
| `/projects` | Brochure (orbital) | The live product "solar system" (`Showcase`) — **now in the `(orbital)` group, sharing the persistent `Sun`** (seamless from Home). YC's *own* products; client work + testimonials live on `/work` |
| `/work` | Brochure | Client-work grid (+ modal) + testimonials + CTA. Reuses the VISION `Work` / `Voices` sections (`WorkWalkthrough`) |
| `/about` | Brochure | Studio identity walkthrough — thesis hero + `Manifesto` / `Capabilities` / `Forge` + CTA (channel page, internal scroll) |
| `/book` | Brochure | **Book a Consultation** — budget estimator → project-intake form (`BookConsultation`, `submitProject` stub) |
| `/contact` | Brochure | Contact form (client-validated) |
| `/music` | Brochure | Ambient music player (Web-Audio engine) |
| `/reach` | Brochure | Interactive 3D globe (`ReachGlobe`) framed on Nepal — YantraCore's live reach across the world. **Renamed `/entryport` → `/activity` → `/reach`** (both old paths 308-redirect here, see `next.config.ts`); channel page — the globe is its own centerpiece, not a logo-at-centre orbital view |
| `/technologies` | Brochure (orbital) | `StarSystem` tech-stack star-map — **folded into the `(orbital)` group** (seamless nav; its opaque scene + own centre star sit over the persistent Sun) |
| `/channels/[slug]` | Brochure/App | Per-channel live dashboard (`jimbo`/`restroverse`/`shramdan`/`yantracore`) |
| `/lab/components` | Internal | UI component library — categorized, navigable source of truth (buttons, badges, tags, cards, icons, tech-stack, motion, brand) |
| `/lab/playground` | Internal | Glass-primitives showcase / design review surface (older scratch surface) |
| `/login`, `/signup` | Auth | Demo auth surfaces (no real backend session) |
| `/dashboard` | Console | The app — Ask AI / Email / Drive / Projects (`DashboardShell`) |
| `/dashboard/settings` | Console | Dashboard settings tab |
| `/settings` | App | Theme/font/cursor preferences (`SettingsShell`) |

**Top nav today** lives in the `TvFrame` chrome bar (Home / Entryport / Technologies / Music / Contact) plus the `Header` pill on brochure pages — **not** the Studio/Capabilities/Atelier/Lab/Signal structure described in the vision below.

**IA decisions (locked 2026-06-15 — the "lean set"):** keep a tight page surface; nothing redundant.

- **To build:** `/lab` (blog index) + `/lab/[slug]` (post) — the content/SEO engine, rendering `lib/api/posts.ts`. This is the only new marketing route still planned.
- **Folded in, not separate routes:** the **team** lives inside `/about` (no standalone `/atelier`); **client services** live inside `/about`'s `Capabilities` section (no standalone `/capabilities`).
- **Cut from the vision:** `/work/{restroverse,jimbo,shramdan}` product teasers (`/projects` + `/channels/*` already cover the products) and the standalone `/signal` (`/contact` + `/book` cover conversion).

(`/work`, `/about`, `/book`, `/reach` are built — see the table above. *Staffing is deferred.*)

### The orbital makeover (in progress — Phase 0+1 shipped 2026-06-15)

The site is being reorganized around one idea: **YantraCore is the sun; every page is a constellation orbiting the same sun.** Routes split into two classes:

- **Orbital pages** (`/`, `/projects`, `/technologies`) — *same channel, different view*. They share the `app/(orbital)/` route-group layout (a **persistent, memoized `Sun`** + `TvFrame`) that mounts once and never re-mounts across soft navigations, so transitions are **seamless** (no CRT glitch; only the satellites swap). Still **distinct, server-rendered routes** with their own metadata — SEO preserved. (Technologies' star-map is opaque, so it covers the Sun rather than orbiting it — it's "in the group" for seamless nav, not a literal shared-Sun view.)
- **Channel pages** (`/about`, `/work`, `/reach`, `/contact`, `/book`, `/music`, console) — *change the channel*: a full re-mount under their own `TvFrame`. `/reach` (the globe) is a channel because its centerpiece isn't the logo. *(The CRT channel-change glitch that used to fire on these navigations was removed site-wide — all navigation is now seamless; `TvFrame` no longer needs the old `seamless` prop.)*

**Phase status:** **0+1 ✅** orbital foundation (persistent `Sun`, removed root `template.tsx`; the channel-change glitch was later dropped site-wide, so the old `TvFrame seamless` prop is gone) + new calm Home · **2 ✅** `/projects` folded into the `(orbital)` group (shares the `Sun` — first real seamless navigation); client work + testimonials split out to **`/work` ✅** · **3 ✅ (mostly)** `/technologies` folded into the group (seamless nav); `/entryport`→`/activity`→`/reach` (308 redirects, channel page). Remaining: perfect the exit→enter cross-morph (frozen-router `AnimatePresence`) · **4 ✅** About (`/about`) · **5 ✅** Book a Consultation (`/book`) · **6 (in progress)** nav/IA — Home ✅ (About node → `/about`, Book CTA → `/book`); chrome bar ✅ for Home/Projects/Technologies/Reach/Contact; **remaining: add About + Work to the global nav and rewire the stale `Footer` links to the real IA** + Contact refresh ✅ + docs.

The mechanism: in Next.js App Router a shared layout is preserved across navigations between its children, so the `(orbital)` layout's `Sun` + `TvFrame` persist while only `{children}` (the satellites) swap through `SatelliteTransition`. The root `template.tsx` (a remount boundary) was removed because it would have re-mounted the group on every navigation.

---

> Everything below is the original **VISION** for the information architecture. Kept as the north star; reconcile against the table above before treating any of it as built.

## Principle

Your current site is a feature list. The proposed sitemap is a **narrative**, and now that we know YantraCore's actual portfolio — two AI-native products (Restroverse, Jimbo), a community/nonprofit arm (Shramdan), and client work across many techs — the narrative gets sharper:

> *YantraCore builds the machines. We build them for our own products, for our clients, and for our community — and each one demonstrates the others.*

The homepage moves the visitor through that thesis chapter by chapter, with the products as the strongest evidence and Shramdan as the soul that keeps it from feeling mercenary.

Section names are deliberately non-template. The fallback (boring) name is in parentheses; we can revert anytime.

---

## The Homepage — one scroll, nine chapters

### 01 — Arrival *(hero)*
**Job:** Establish the visual language. State what YantraCore is in one sentence. Make the visitor stop scrolling and start watching.

**Content:**
- 3D logo center stage (your provided GLB at `public/images/logo/`), slowly rotating, with volumetric light
- Orbital glass cards drifting at depth — each card a fragment of what YC does (Jimbo conversation, Restroverse listing, Shramdan moment, code, AI activity, client logos — final choice pending chat)
- Headline (working): *"The mechanisms that move modern business."*
- Sub: *"YantraCore engineers software, AI, and infrastructure for ambitious companies — and for the communities we belong to."*
- CTA: *"Begin the tour"* (or similar — pending chat)

See [04-hero-concept.md](./04-hero-concept.md) for the full storyboard.

### 02 — Manifesto *(philosophy)*
**Job:** Tell the visitor what we believe before we tell them what we sell. The "soul" chapter — Shramdan's ethic lives here.

**Content:**
- Large display type, one paragraph, glassmorphic block, animated trace border drawing in on scroll
- Background: slow `<NoiseAura>` texture
- 3 micro-pillars beneath the manifesto in glass cards: *Craft. Velocity. Service.* (placeholders — final words tbd; "Service" leans into the community angle without being preachy)
- Each pillar card has the signature hover

### 03 — In the Studio *(our own products)*
**Job:** Showcase YantraCore's *own* work — the strongest evidence we exist for. This chapter is unique to YC: most agencies don't have shipping products of their own.

**Content:**
- Three product showcases stacked vertically with cinematic transitions between each
- Each gets ~100vh of screen with its own visual treatment:

  **Restroverse** (AI-enabled hospitality platform — pre-launch)
  - Phone + browser composite showing the listing + AI search experience (renders/figma exports while real UI doesn't exist yet)
  - "Coming soon" badge styled *as part of the design*, not an apology
  - 3 capability bullets: AI-powered discovery / rich detailed profiles / sync with Jimbo
  - CTA: *"Get notified"* → simple email capture (locally validated for v1, no backend yet)
  - Inline mini-CTA: *"Learn more"* → `/work/restroverse`

  **Jimbo** (AI agent for WhatsApp / Instagram / Facebook / SMS — pre-launch)
  - Phone mockup with a *mocked* conversation playing out (typed message → AI reply, looped). The conversation is built in code; no real video needed for v1.
  - Floating chat bubbles in glass surrounding the phone
  - 3 capability bullets: multi-channel / Restroverse-aware / always-on
  - Primary accent moment (this is the AI flagship)
  - Inline mini-CTA: *"Learn more"* → `/work/jimbo`

  **Shramdan** (community-led, YC-founded)
  - Different emotional register on purpose — softer light, more human imagery, less hard-tech
  - Brief story: *YantraCore envisioned and launched Shramdan to do community work — by the community, for the community. We seeded it, got it running, and the community is gradually taking ownership. Eventually it will be fully community-owned and collaboratively run.*
  - One or two photos from real community work (if/when available; otherwise a procedural "community" visual placeholder we swap later)
  - The amber accent gets its strongest use here
  - CTA: *"Learn about Shramdan"* → `/work/shramdan`

**Why this chapter exists separately from "Capabilities":** products are *what YC builds for itself*; capabilities are *what YC builds for clients*. Conflating them dilutes both. Keeping them distinct lets us be specific in both.

### 04 — Capabilities *(client services)*
**Job:** Show what we do for clients — but as a *constellation*, not a 4-column grid.

**Content:**
- Horizontal scroll-pinned section: each capability is a chapter in the constellation
- Proposed final capability list (collapsed from your current 8 → 6 for impact; confirm in chat):
  1. **Web** — modern marketing & app frontends (Next.js, headless WP, Shopify themes)
  2. **Apps** — iOS, Android, React Native
  3. **APIs & Backends** — Node, custom services, integrations
  4. **Cloud & Infra** — AWS / GCP / Azure, hosting, databases, deployment
  5. **AI & Data** — model integration, agents, embeddings, data pipelines
  6. **Design** — product, UI, brand systems
- Each capability is a glass card with a small animated icon scene (e.g., AI = particle field forming a graph; Cloud = floating layers; Apps = phone with UI assembling)
- The first capability gets focus; scroll advances to the next; the active one scales up subtly while others recede
- Background: `<DotField>` reacts to which capability is active
- Below the constellation, a small "We also work with" strip showing tech logos: Shopify, WordPress, AWS, Node, React, Next.js, Postgres, etc.

### 05 — The Forge *(process / "how we do it")*
**Job:** The krootl-style scroll-controlled scene. The single most cinematic moment after the hero.

**Content:**
- Section pins for ~4× viewport height
- A central 3D scene: a "blank slab" of glass that, in 4 phases (Discover → Design → Build → Ship), accumulates layers — wireframe lines, interface frames, code traces, and finally a finished phone-and-browser composition
- Right side: 4 sequential text steps fading in/out
- Bottom: a horizontal progress meter with the signature gradient
- Exits unpinned when phase 4 completes

### 06 — Client Work *(selected work, lightweight)*
**Job:** Prove client capability without case studies (skipped per your request).

**Content:**
- Logo wall of client/project marks, animated with a slow `MarqueeRow` (continuous horizontal slow drift) — feels like a quiet showcase rather than a brag
- Click any logo → opens a glass modal with: client name, brief description, tech stack used, "View live →" link (where applicable)
- A subtle CTA below: *"Have a project? Send a signal →"* links to contact
- Whenever real case studies become available later, this chapter upgrades to feature them in scroll-tied tiles

### 07 — Voices *(testimonials)*
**Job:** Third-party validation, without looking like every testimonial section ever made.

**Content:**
- A "wall" of quote cards stacked in 3D space, slightly rotated, parallaxed on scroll
- Each card glassmorphic with client logo, quote, name, role
- On hover: card rises out of the stack and centers
- Amber accent reserved exclusively for this section
- **v1 ships with believable placeholder quotes**, clearly attributed to "placeholder" personas. The structure is real; the words get swapped when real testimonials land.

### 08 — Lab Notes *(blog)*
**Job:** Show we think, not just ship.

**Content for v1 (static):**
- 3 static placeholder posts (I draft thoughtful headlines + excerpts on relevant topics — software craft, AI, community work) so the section looks fully populated
- Each post is a glass card with title, eyebrow date, 1-line excerpt
- Background: `<LineWeave>` animated SVG (ptolemay-style)
- "All notes →" CTA links to `/lab` (also static for v1)

**v2 wiring (deferred):** swap the static array for a fetch from WordPress (REST or WPGraphQL). The component interface is built to match WP's response shape from day one, so the swap is config-only later.

### 09 — Signal *(contact + footer)*
**Job:** Convert the visitor.

**Content:**
- Final big moment. Section returns to dark canvas with the 3D logo from chapter 01 reappearing in the background — *bookends the experience*
- Headline: *"Start a project. Or send a signal."*
- Two paths:
  1. **Primary glass form** — "Submit a project" with richer fields (name, email, company, project type, budget range, message, optional file)
  2. **Quick contact** — lighter (name, email, message)
- **v1 forms validate locally with Zod and show a success state, but do not actually submit** (logged to console + stored in localStorage for visibility). The exact same component takes a real `onSubmit` prop in v2 once the Node API lands.
- Animated focus borders on inputs
- Footer integrated into this section — no separate boring footer

---

## Inner pages

> **Note on product pages:** Restroverse, Jimbo, and Shramdan will eventually live on their own external domains. The pages below are **teaser pages on yantracore.com** — they tell the story, hint at what's coming, and link out to the real product site once launched. They are not full product microsites.

### `/work/restroverse` *(teaser page)*
- Cinematic hero with phone + browser composite (from renders/figma), scroll-tied parallax
- Feature breakdown: AI-powered discovery, profile system, food menu, room system, sync with Jimbo
- Visual "tour" of the planned experience (stepped scroll — no live UI needed)
- Email capture: *"Get notified at launch"* (local-only for v1; persisted to localStorage as placeholder; once Node API lands, switches to real endpoint)
- Footer link: *"Visit the Restroverse site"* (placeholder URL until external domain launches)

### `/work/jimbo` *(teaser page)*
- Hero with a *mocked* but believable chat playing out across channels (WhatsApp → Instagram → Facebook → SMS)
- Multi-channel grid: WhatsApp / Instagram / Facebook / SMS visual matrix
- Sync-with-Restroverse subsection — explains the integration
- Use cases: hospitality, support, lead capture
- Email capture: *"Get early access"* (same local-only pattern as Restroverse)
- Footer link: *"Visit the Jimbo site"* (placeholder URL until external domain launches)

### `/work/shramdan` *(community page — different register)*
Intentionally different vibe from the product pages.
- Softer light, warmer accent (amber-led)
- The story: *YC envisioned and launched Shramdan; community is gradually taking ownership; eventually fully community-owned.*
- Recent community works (photos when available; placeholder visuals until then)
- "How to join / participate" — call to action for community members
- Smaller, more human-scale typography than the product pages
- This page is the visual proof that YC's mechanism-craft extends beyond business
- Footer link: *"Visit the Shramdan site"* (placeholder URL until external domain launches)

### `/work` *(client work index)*
Grid of client projects (logos + brief descriptions). Filterable by capability tag. Each tile is a glass card with the signature hover. Hovering shows a quick stat strip; click opens the modal (same as chapter 06) or, when we have case studies, navigates to a case study page.

### `/capabilities` *(client services in depth)*
A more functional page. Each capability gets a section with:
- Description
- "What we build" — concrete examples
- "Stack we use" — tech chips
- Linked client work
- Inline contact CTA

### `/atelier` *(about + team)*
- Story of YantraCore, manifesto echo
- **Team grid with real faces** — glassmorphic cards with team photos, names, roles, optional short bio on hover. Team is **8 members** total (5 staff + 3 management). Headshots will be arranged; until they land, we use a glass placeholder with initials.
- Where the team is based, how YC works
- A small "We're hiring" section if applicable
- Footer CTA back to Signal

### `/lab` *(blog index, headless WordPress)*
- All posts from your WP, paginated or infinite scroll
- Filterable by category/tag (pulled from WP taxonomies)
- Animated line background
- Each entry is a glass card

### `/lab/[slug]` *(blog post)*
Clean reading experience.
- Narrow container (720px)
- Mono eyebrow with category + date
- Display headline
- Body in Inter at 18px
- WordPress content rendered safely (sanitized HTML → React) with proper typography
- Inline code blocks, callout boxes, image figures
- Author block at bottom, related posts strip

### `/signal` *(standalone contact)*
Most contact happens in homepage chapter 09. A standalone `/signal` page exists for direct linking from emails / outreach. Same form, more space.

---

## URL & Navigation

**Top nav** (sticky, glassmorphic, condenses on scroll):
- *Studio* (dropdown: Restroverse / Jimbo / Shramdan) / *Capabilities* / *Atelier* / *Lab* / *Signal* (CTA button)
- YantraCore logomark on the left, links to /

**Mobile nav:** glass drawer slide-in from the right, with the same items plus social links.

**Page transitions:** view-transitions API with a custom mask animation between routes — the page wipes away with the signature gradient sweep, new page enters underneath. Adds polish, costs little.

---

## What we are explicitly *not* including

- Pricing page (custom work, doesn't fit the model)
- Generic "Features" landing pages
- A separate "Testimonials" page (homepage section is enough)
- Cookie banner with anything more than is legally required
- Live chat widget (kills the aesthetic; email is the primary funnel — *and Jimbo on your business handles its own channel*)
- A separate dedicated newsletter signup page (newsletter prompt lives quietly in lab/footer)
- Case study pages (deferred per your request; structure lives in client work tile modals)
- AI Atelier standalone section (folded into the In the Studio chapter through Jimbo — AI isn't pitched abstractly, it's demonstrated)

---

## All sitemap decisions locked.

Future-domain note: the three products will live on their own external domains. The `/work/*` pages on yantracore.com are teaser/story pages that link out once the real product sites exist. Placeholder external URLs are used until then.

Multi-lingual note: `next-intl` is installed and i18n is on the near-term roadmap. **Nepali (`ne`) is the planned next language** (YantraCore is Nepal-based — the `/reach` globe is framed on Nepal), with English (`en`) as the default. Routes will gain locale prefixes (`/en/…`, `/ne/…`) when i18n is wired; only `en` ships today. See [05-tech-architecture.md](./05-tech-architecture.md) for the i18n approach.
