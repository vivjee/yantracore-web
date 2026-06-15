# 00 — Overview (read me first)

> **Layer: REFERENCE** — this describes what is *actually built today*. For the aspirational design vision, see the VISION docs (01, 03, 04).
>
> Last reconciled with the codebase: **2026-06-15**.

This is the single starting point for anyone — human or coding agent — working on **yantra-web**. Read this, then jump to the doc you need from the map at the bottom.

---

## What this project actually is

`yantra-web` is the Next.js application behind **yantracore.com**. It started as a static marketing site (that origin story lives in the VISION docs) and has since grown into **two products sharing one shell**:

1. **The brochure** — the public marketing surface. Homepage (`/`), plus story/section components, contact, channels, technologies, an interactive globe (`/entryport`), and an ambient music player (`/music`). This is the "Dark workshop / glass machinery" experience.
2. **The console** — an authenticated app surface. Login/signup, a **dashboard** (`/dashboard`) that talks to the **YantraMate** AI backend (RAG over Google Drive, IMAP email chat, project/file browsing), and user settings.

Both run inside a signature **retro-CRT "TV" shell** (`TvFrame`) and share one runtime-themeable design system.

### One-line philosophy

> **Apps that solve real-world problems — AI enabled.**
> *YantraCore reveals the machinery that moves modern business — and the site itself is a demonstration of that craft.*

---

## The mental model (four things to know)

1. **Everything renders inside `TvFrame`.** Most pages wrap their content in `components/layout/TvFrame.tsx` — a CRT television shell with power on/off, scanlines, console tabs, and a top chrome bar. It is the app's chrome, not a decoration. See [10-systems.md](./10-systems.md#tvcrt-shell).

2. **The design system is runtime-themeable.** Colors, fonts, cursor, and motion are driven by CSS custom properties on `<html>`, set by `ThemeProvider` (`lib/theme/`). There are **5 palettes**, **5 font styles**, light/dark mode, and **3 cursor styles**, all persisted to `localStorage`. **Never hardcode an accent hex — use the `--accent-*` tokens.** See [02-brand-system.md](./02-brand-system.md).

3. **The AI features are powered by a separate backend: YantraMate.** `yantra-web` does not implement RAG/email/Drive itself — it calls the YantraMate service. There are **two** call paths (see below). The backend contract is documented in [07-api-reference.md](./07-api-reference.md); the Next.js proxy routes in [12-app-api.md](./12-app-api.md).

4. **The marketing forms are still stubs.** `lib/api/{contact,project,notify,posts}.ts` validate with Zod and write to `localStorage` — they do not hit a real server yet. The AI/console features, by contrast, are wired to a live backend.

### The two YantraMate call paths (important)

| Path | File(s) | Env var | Default base | Runs |
|---|---|---|---|---|
| **Direct client** | `lib/api/yantramate.ts` | `NEXT_PUBLIC_YANTRAMATE_API_URL` | `https://z0n76c1j-3011.usw3.devtunnels.ms` (devtunnel) | In the browser |
| **Server proxy** | `app/api/**/route.ts` | `YANTRAMATE_API_URL` | `http://localhost:3011` | On the server |

The proxy path exists to keep credentials/keys server-side and normalize errors/timeouts. The direct client is the typed SDK. These currently overlap — reconciling them onto one path is a known cleanup (see [06-roadmap.md](./06-roadmap.md)).

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts (from `package.json`): `pnpm build`, `pnpm start`, `pnpm lint`.

Package manager is **pnpm** (there is a `pnpm-lock.yaml` and a `pnpm-workspace.yaml`). Don't introduce `npm`/`yarn` lockfiles.

To exercise the AI/console features you also need the **YantraMate backend** running (locally on `:3011`, or point the env vars at the devtunnel).

### Environment variables

Create `.env.local` (not committed). Variables actually read by the code:

| Variable | Used by | Notes |
|---|---|---|
| `YANTRAMATE_API_URL` | `app/api/*` server proxies | Default `http://localhost:3011` |
| `NEXT_PUBLIC_YANTRAMATE_API_URL` | `lib/api/yantramate.ts` (browser) | Default devtunnel URL |
| `NEXT_PUBLIC_SITE_URL` | metadata / canonical | Default `http://localhost:3000` |

Declared in earlier planning for v2 but **not yet wired**: `NODE_API_URL`, `NODE_API_KEY`, `WORDPRESS_URL`, `WORDPRESS_GRAPHQL_URL`, `TURNSTILE_SECRET`.

---

## Repo tour (top level)

```
app/                 # Next.js App Router: pages, layouts, and /api proxy routes
  api/               # Server-side proxies to YantraMate (ask, drive, email, projects)
  (orbital)/         # Orbital route group — shared layout = persistent Sun + shared TvFrame (seamless nav)
    layout.tsx       #   mounts the Sun + frame ONCE; satellites swap beneath it
    page.tsx         #   / — calm orbital navigation hub (HomeOrbital)
    projects/        #   /projects — Showcase product constellation (externalSun → shares the Sun)
  about/             # /about — studio identity walkthrough (channel page; reuses VISION sections)
  work/              # /work — client work grid + testimonials (Work + Voices)
  book/              # /book — Book a Consultation (budget estimator + intake form)
  dashboard/         # The console (DashboardShell)
  login/ signup/     # Auth surfaces (currently localStorage/demo)
  music/ entryport/  # Brochure feature pages
  channels/[slug]/   # Per-channel dashboards
  technologies/      # StarSystem tech visualization
  globals.css        # ~2,840 lines: ALL design tokens, glass classes, keyframes, CRT/TV + orbital styles
components/
  glass/             # Design-system primitives (GlassCard, GlassButton, ...)
  motion/            # Reveal, Rise, MarqueeRow, CountUp, StarSystem, ...
  backgrounds/       # SiteBackground + MeshGradient/DotField/LineWeave/NoiseAura
  chrome/            # Header, Footer, Cursor, SmoothScrollProvider, NavIcons
  layout/            # Container, SectionDivider, TvFrame (shared CRT shell)
  typography/        # Eyebrow, YantraElectricTitle
  orbital/           # Sun (persistent logo), OrbitalRings, SatelliteTransition — the orbital shell
  home/              # HomeOrbital hub + OrbitNode (calm satellite) — the new homepage
  about/ work/ book/ # Channel pages: identity walkthrough, client work, consultation (estimator+form)
  sections/          # 01-arrival … 09-signal chapters (VISION-era; now assembled into /about & /work)
  dashboard/         # DashboardShell, SettingsShell
  auth/ channels/ entryport/ assistant/ brand/   # feature components
lib/
  api/               # yantramate.ts (live SDK) + contact/project/notify/posts (stubs)
  content/           # typed static content (capabilities, channels, team, testimonials, client-work)
  theme/             # ThemeProvider + palettes
  audio/ audio.ts    # Web-Audio music player + UI sound synth
  hooks/ utils/      # useCanvasControls, cn()
docs/                # You are here
public/              # images, logos (SVG + GLB), music, lottie
```

Path alias: **`@/*` → repo root** (e.g. `import { cn } from "@/lib/utils/cn"`).

---

## Document map

Each doc is labeled **VISION** (north star) or **REFERENCE** (ground truth). Trust REFERENCE for facts.

| # | Doc | Layer | What's in it |
|---|---|---|---|
| 00 | **Overview** (this file) | REFERENCE | The mental model, quick start, doc map |
| 01 | [Creative Direction](./01-creative-direction.md) | VISION | Thesis, mood, voice, motion language — the "why" |
| 02 | [Brand System](./02-brand-system.md) | REFERENCE | Real design tokens, palettes, fonts, glass/cursor/CRT — the design source of truth |
| 03 | [Sitemap](./03-sitemap.md) | VISION + REFERENCE | Narrative IA (vision) + the routes that actually exist (reference) |
| 04 | [Hero Concept](./04-hero-concept.md) | VISION | The "assembling machinery" hero storyboard (not the current live hero) |
| 05 | [Tech Architecture](./05-tech-architecture.md) | REFERENCE | Real stack, folder structure, data flow, auth state, tooling |
| 06 | [Roadmap & To-Do](./06-roadmap.md) | REFERENCE | Build status, backlog, known cleanups |
| 07 | [API Reference (YantraMate)](./07-api-reference.md) | REFERENCE | The backend service contract (OpenAPI mirror) |
| 08 | [Pivot Log](./08-pivot-log.md) | REFERENCE | Decision/pivot history |
| 09 | [Agent Conventions](./09-agent-conventions.md) | REFERENCE | Rules every coding agent must follow (commit policy, etc.) |
| 10 | [Systems](./10-systems.md) | REFERENCE | Theme, Audio, TV/CRT shell, Cursor, Backgrounds, Motion |
| 11 | [UI Components](./11-ui-components.md) | REFERENCE | Component reference with props/variants |
| 12 | [App API (proxy routes)](./12-app-api.md) | REFERENCE | The Next.js `/api/*` routes and how they proxy YantraMate |

Repo-root companions: **[`AGENTS.md`](../AGENTS.md)** (agent entry point) and **[`README.md`](../README.md)**.

---

## The golden rule

**Docs are the source of truth, and they only stay true if you keep them true.** When you change a token, a route, a component's props, or a system's behavior, update the matching REFERENCE doc *in the same change*. The drift this doc set just corrected is exactly what happens when that rule is skipped.
