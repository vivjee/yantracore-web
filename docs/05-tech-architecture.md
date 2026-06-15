# 05 — Tech Architecture (Reference)

> **Layer: REFERENCE** — the stack and structure as built.
>
> Last reconciled: **2026-06-15**. The original VISION architecture (i18n-first, Husky/CI, MDX content, WordPress blog, fully-static v1) is summarized at the end with a note on what shipped vs. didn't.

---

## Stack (as installed)

From [`package.json`](../package.json):

| Layer | Choice | Version |
|---|---|---|
| Framework | **Next.js** (App Router, RSC) | `16.2.6` |
| Runtime | **React** / React DOM | `19.2.4` |
| Language | **TypeScript** (strict) | `^5` |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`) | `^4` |
| 3D | **three** + **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** + **postprocessing** | three `^0.170`, fiber `^9.6`, drei `^10.7` |
| DOM animation | **gsap** + **split-type** | gsap `^3.12` |
| Component motion | **framer-motion** | `^11.15` |
| Smooth scroll | **lenis** (installed, **not active** — see note) | `^1.1` |
| Carousel | **swiper** | `^12.2` |
| Markdown | **react-markdown** + **remark-gfm** | `^10`, `^4` |
| Icons | **lucide-react** + **react-icons** | `^0.469`, `^5.6` |
| Validation | **zod** | `^3.24` |
| i18n | **next-intl** (installed, **not wired** — no `[locale]` routes/middleware) | `^3.26` |
| Classnames | **clsx** + **tailwind-merge** (via `cn()`) | `^2.1`, `^2.5` |

**Dev:** eslint `^9` + `eslint-config-next@16.2.6`, `@types/*`, `@types/three`, typescript.

> **Notes / divergences from VISION:**
> - **Lenis is installed but inactive.** `SmoothScrollProvider` is now a passthrough; the site uses native scroll.
> - **next-intl is installed but not wired** — there are no `[locale]` routes and no middleware. The site is English-only with no i18n scaffolding live.
> - **No Husky, lint-staged, Prettier config, or CI** in the repo. Linting is ESLint only, run manually (`pnpm lint`).
> - **No shadcn/ui, no react-hook-form.** Forms are hand-rolled with `useState` + Zod.
> - **No MDX, no WordPress.** Static content is typed TS in `lib/content/`; blog posts are a static array in `lib/api/posts.ts`.

---

## Folder structure (actual)

```
yantra-web/
├── app/
│   ├── layout.tsx              # Root: fonts, ThemeProvider, AudioPlayerProvider, Cursor, SmoothScrollProvider
│   ├── template.tsx            # Per-navigation pass-through wrapper
│   ├── globals.css             # ALL design tokens, glass classes, keyframes, CRT/TV styles (~2,570 lines)
│   ├── page.tsx                # Homepage: <Showcase> in <TvFrame> + <SiteBackground>
│   ├── login/  signup/         # Auth (own layout.tsx sets data-layout="auth")
│   ├── dashboard/              # Console (DashboardShell); /dashboard/settings sub-route
│   ├── settings/               # Public settings (SettingsShell)
│   ├── music/                  # Ambient music player page
│   ├── reach/                  # ReachGlobe (Three.js globe; was /entryport→/activity)
│   ├── technologies/           # StarSystem tech visualization
│   ├── contact/                # Contact form page
│   ├── channels/[slug]/        # Per-channel dashboard (generateStaticParams)
│   ├── lab/playground/         # Glass primitives showcase
│   └── api/                    # Server proxies to YantraMate (see docs/12-app-api.md)
│       ├── ask/                ├── email-chat/   ├── email-credentials/
│       ├── email/{list,get,sync}/                ├── projects/  projects/[id]/
│       └── drive/  drive/sync/  drive/projects/[id]/
├── components/                 # See docs/11-ui-components.md for the full inventory
│   ├── glass/ motion/ backgrounds/ chrome/ layout/ typography/
│   ├── sections/01-arrival … 09-signal/
│   ├── dashboard/ auth/ channels/ reach/ assistant/ brand/
├── lib/
│   ├── api/                    # yantramate.ts (live SDK) + contact/project/notify/posts (stubs)
│   ├── content/                # capabilities, channels, client-work, team, testimonials (typed TS)
│   ├── theme/                  # ThemeProvider.tsx, palettes.ts
│   ├── audio/AudioPlayerContext.tsx  + audio.ts (UI sound synth)
│   ├── hooks/useCanvasControls.ts
│   └── utils/cn.ts
├── public/                     # images, logos (SVG + GLB), music (mp3), lottie (json), globe textures
├── docs/                       # this doc set
├── AGENTS.md  README.md
├── next.config.ts  tsconfig.json  postcss.config.mjs  eslint.config.mjs
└── package.json  pnpm-lock.yaml  pnpm-workspace.yaml
```

**Path alias:** `@/*` → repo root (`tsconfig.json`). `tsconfig` target ES2017, strict, `jsx: react-jsx`, bundler module resolution.

**`next.config.ts`:** allows remote images from `b3289946.smushcdn.com` and `yantracore.com`.

---

## Rendering model

- **Root layout** (`app/layout.tsx`, server) loads 7 Google fonts as CSS variables, sets metadata (`metadataBase: https://yantracore.com`, OG image `/images/brand/frame-hero-og.png`), and wraps the tree in: `ThemeProvider` → `AudioPlayerProvider` → `Cursor` + `SmoothScrollProvider`.
- There is **no root `template.tsx`** — it was removed so the `(orbital)` group's shared layout (persistent `Sun` + `TvFrame`) survives soft navigations. The TV glitch-on-navigate effect it once powered was retired with it; navigation is now seamless everywhere.
- Most pages are **client components** (`"use client"`) because of the interactive shell, theming, and canvases. Auth pages and a few section components are server components.
- **`TvFrame`** is the de-facto app chrome: pages compose `<TvFrame><PageContent/></TvFrame>` over a fixed `<SiteBackground/>`.

---

## Data flow & backend

### YantraMate (the AI backend)
The console's AI features (Ask/RAG, email chat, Drive sync, projects) are served by the external **YantraMate** service — see [07-api-reference.md](./07-api-reference.md) for its contract. `yantra-web` reaches it **two ways**:

1. **Server proxy** — `app/api/**/route.ts` forward to `YANTRAMATE_API_URL` (default `http://localhost:3011`), normalizing errors and applying per-route timeouts. Documented in [12-app-api.md](./12-app-api.md).
2. **Typed client SDK** — `lib/api/yantramate.ts` calls `NEXT_PUBLIC_YANTRAMATE_API_URL` (default the devtunnel) **directly from the browser**, returning typed results and unwrapping the `{ success, data }` envelope.

> These two paths overlap. Consolidating onto the proxy (so the backend URL/keys never reach the client) is a known cleanup — see [06-roadmap.md](./06-roadmap.md).

### Marketing stubs (not yet a real backend)
`lib/api/contact.ts`, `project.ts`, `notify.ts` validate with Zod and persist to the `yc.signals` `localStorage` key (no network). `lib/api/posts.ts` returns 3 hardcoded blog posts. These are the planned v2 wire-up surface (Node API + WordPress) and are intentionally swappable behind their function signatures.

### State
No Redux/Zustand. State is **React Context** (`ThemeProvider`, `AudioPlayerProvider`) + component `useState` + `localStorage` persistence. Auth is currently **demo-grade**: `LoginForm`/`SignupForm` set `sessionStorage` keys (`ym_authed`, `ym_role`, `ym_user`) with client-side validation only — there is no server session, no token verification in the proxy routes, and no route guards. Treat auth as **not production-ready**.

---

## Build & tooling

- **Scripts:** `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.
- **Linting:** ESLint flat config (`eslint.config.mjs`) extending `eslint-config-next`. No formatter is enforced — match surrounding style.
- **Type-check:** `tsc` via the editor / `pnpm build`. There is no standalone typecheck script or CI gate yet.
- **Deployment:** not configured. Code is host-agnostic; metadata assumes `yantracore.com`.

---

## Performance & accessibility (intent → status)

The VISION set hard budgets (LCP < 2s, etc.) and strong a11y commitments (full keyboard nav, reduced-motion everywhere, contrast ≥ 4.5:1, Lighthouse ≥ 95). **Honored today:** `prefers-reduced-motion` is respected globally (CSS + `ThemeProvider` toggle); the custom cursor falls back on touch/reduced-motion; semantic copy lives in HTML, decorative canvases are visual-only. **Not yet measured/enforced:** no Lighthouse-CI, no bundle budget, no formal a11y audit. Treat the budgets as goals, not guarantees — see [06-roadmap.md](./06-roadmap.md).

---

## Appendix — VISION vs. shipped

| VISION plan | Status |
|---|---|
| Next.js 15, React 19, Tailwind v4 | ✅ (on Next **16**) |
| GSAP free + split-type + Lenis + R3F + Framer Motion | ✅ installed (Lenis inactive) |
| next-intl i18n scaffolded day one | ⚠️ installed, **not wired** |
| shadcn/ui + react-hook-form + Zod | ⚠️ only Zod; forms hand-rolled |
| MDX content + headless WordPress blog | ❌ typed TS content; static posts array |
| Husky + lint-staged + Prettier + GitHub Actions CI | ❌ not present |
| v1 fully static, forms don't submit | ⚠️ marketing forms still stubs; **but** a live AI backend (YantraMate) is wired |
| Dark-only, single locked palette | ❌ superseded by runtime theme system (5 palettes, light/dark, fonts, cursor) |
| 9-chapter scroll homepage | ⚠️ chapters exist as components; live home is `Showcase` |
