# YantraCore Web — Planning Docs

These docs are the **proposal** for the yantracore.com rebuild. They exist to align on direction *before* code gets written. Read in order; each one builds on the last.

## The thesis (one line)

> Dark workshop. Glass machinery. Scroll is the dial. Slow, confident, alive.

### Philosophy

> Apps that solve real world problems — AI enabled.

YantraCore reveals the machinery that moves modern business. The site itself becomes a demonstration of that craft — glass surfaces, animated borders, 3D, scroll-driven scenes — not as decoration, but as the sales argument.

## Documents

| # | Doc | What's in it |
|---|---|---|
| 01 | [Creative Direction](./01-creative-direction.md) | The thesis, mood, voice, motion language. The "why." |
| 02 | [Brand System](./02-brand-system.md) | Colors, typography, spacing, motion tokens, glass + animated border specs. The "kit of parts." |
| 03 | [Sitemap](./03-sitemap.md) | Proposed pages and homepage chapter narrative. The "what we build." |
| 04 | [Hero Concept](./04-hero-concept.md) | Full storyboard for the showpiece hero scene. The "wow moment." |
| 05 | [Tech Architecture](./05-tech-architecture.md) | Stack, packages, folder structure, performance budgets. The "how it's engineered." |
| 06 | [Roadmap](./06-roadmap.md) | Phased build plan with review checkpoints. The "when and in what order." |
| 07 | [API Reference](./07-api-reference.md) | Endpoints and request/response specifications. |
| 08 | [Pivot Log](./08-pivot-log.md) | Record of major pivots, layout revisions, and UX sweeps. |

## Status

Each doc is now in one of three states:
- **Locked** — decision made, will be built as-is unless flagged
- **Mostly locked** — small open items handled in the live chat batch (not in docs)
- **Proposal** — needs your reaction in chat before lock

Open items are **not** tracked in docs anymore — they're consolidated into batched chat questions to avoid scattering reviews across files.

## How to give feedback

Three useful ways, in order of preference:
1. **Reply with reactions in the chat** — best for direction-level feedback ("I love the assembly metaphor but the headline copy is off")
2. **Edit a doc directly** and tell me what you changed — best for precise wording
3. **Open a question** in chat — best for "is this possible?" and "what if we did X instead?"

## What YantraCore actually does (informs the whole site)

- **Studio products** — *Restroverse* (AI hospitality platform, pre-launch), *Jimbo* (AI agent for WhatsApp/Instagram/Facebook/SMS, deeply integrated with Restroverse)
- **Community** — *Shramdan* (nonprofit — "by the community, for the community")
- **Client work** — Shopify, WordPress, custom web/app, databases, APIs, AWS, and more

## Decisions locked

- **Positioning**: hybrid — products + services equal weight, Shramdan as soul
- **Logo**: at `public/images/logo/` (SVG + GLB)
- **Dark mode only**
- **Color palette**: **Crystal** (`#6E56FF` / `#00E0CB` / `#FF4FB0`) — swappable via one CSS file; alternates *Atelier* and *Hearth* sit commented in `styles/palettes.css`
- **Display font**: **General Sans** (self-hosted)
- **Build sequencing**: hero-first
- **Stack**: Next.js 15 + React 19 + Tailwind v4 + GSAP (free) + `split-type` + Lenis + React Three Fiber + next-intl
- **Package manager**: pnpm
- **v1 ships fully static**: all content in MDX + typed constants; forms validate locally with no submit; blog uses static placeholder posts
- **v2 wiring** (deferred): Node API for forms, WordPress for blog, multi-lingual flip, deployment
- **i18n**: scaffolded from day one with `next-intl`; English-only in v1, structure ready for `hi` and others
- **Team**: 8 members (5 staff + 3 management); headshots to follow; placeholder avatars until then
- **Testimonials**: placeholder quotes for v1; real ones swap in later
- **Case studies**: skipped; client work shown via marquee logo wall + modal
- **External product domains**: Restroverse, Jimbo, Shramdan will each have their own site. `/work/{product}` pages on yantracore.com are teasers that link out.
- **Privacy policy + terms**: I draft templates; client reviews with legal later
- **Homepage chapter list**: Arrival → Manifesto → In the Studio (products) → Capabilities → The Forge → Client Work → Voices → Lab Notes → Signal
- **Hero CTAs**: two side by side — *"Begin the tour"* (scroll) + *"Start a project"* (jump to Signal)
- **Hero orbital cards**: Jimbo chat / Restroverse listing / Shramdan moment / Code / AI activity / Client logos

## All planning locked. Build kicked off.

- **Thesis**: *"YantraCore reveals the machinery that moves modern business."*
- **Hero headline**: *"The mechanisms / that move modern business."*

## Build status

| Phase | Status |
|---|---|
| 0 — Foundation | ✅ scaffold + brand tokens + fonts + base layout |
| 0.5 — i18n scaffold | ⏭ next session (deferred to keep playground review unblocked) |
| 1 — Glass primitives | ✅ AnimatedBorder, GlassCard, GlassButton, GlassInput, GlassPanel, + 4 background patterns |
| 1 — Playground | ✅ `/lab/playground` live |
| 2 — Hero | ⏭ after playground review |
| 3 — Content drafting | ⏭ |
| 4 — Homepage chapters | ⏭ |
| 5 — Inner pages | ⏭ |
| 6 — Polish + audit | ⏭ |
| 7 — v2 wiring (Node API + WP + i18n flip) | ⏭ |

Run `pnpm dev` to start the dev server; visit `http://localhost:3000` for the home placeholder and `http://localhost:3000/lab/playground` for the primitives review surface.

## Next step

After the hero headline is picked in chat, I kick off **Phase 0 + Phase 1**: scaffold the Next.js project (with i18n + content + API stubs ready) and build the **glass primitives playground** at `/lab/playground` — the first thing you'll see running locally and react to.

From there, **the hero.**
