# 05 — Tech Architecture

> Status: **locked** (with open backend integration details handled in chat). Stack decisions below are confirmed.

## Locked tooling decisions

- **pnpm** as package manager
- **GSAP** — free tier only. No paid plugins. Where SplitText would be useful we use `split-type` (free) instead. DrawSVG → manual `stroke-dasharray` animation. MorphSVG → not needed; use SVG path interpolation if required.
- **Vercel deployment**: deferred — focus is on building the app first. Code stays deployment-agnostic (no Vercel-specific APIs without fallbacks) until we hook up hosting.
- **MDX-first** for non-blog content (case studies if we add them later, capability deep-dives, manifesto longform). **WordPress headless** for the blog (chapter 08 + `/lab` routes).

## Stack Decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, RSC) | Best-in-class for content + experience hybrid; edge-friendly; we already chose it |
| Runtime | **React 19** | Native support for use() / async components; pairs with Next 15 |
| Language | **TypeScript** (strict) | Non-negotiable for a site of this complexity |
| Styling | **Tailwind CSS v4** | Token-driven, fast, fits the brand system; v4's CSS-first config is great for our custom properties |
| Animation (DOM) | **GSAP 3** (free) + **@gsap/react** + **ScrollTrigger** + `split-type` | GSAP free-tier only (no SplitText/DrawSVG/MorphSVG). `split-type` covers split-text needs without the paid plugin. |
| Smooth scroll | **Lenis** (`@studio-freight/lenis` → now `lenis`) | Buttery scroll, plays nicely with ScrollTrigger via official integration |
| Component motion | **Framer Motion** | For React component-level animation (entrance, layout, modals); we use GSAP for scroll-tied scenes and Framer for component-level work |
| 3D | **React Three Fiber** + **drei** + **postprocessing** | Declarative R3F is faster to iterate than imperative Three.js; drei has every helper we need; postprocessing for bloom/depth-of-field |
| Shaders | Custom GLSL (raw) | For mesh gradient + custom card effects; written in `.glsl` files imported via vite-plugin-glsl or inline |
| Forms | **React Hook Form** + **Zod** | v1: validation only (no submit). v2: integrates with your Node API. |
| API client | **fetch** (server actions for forms, RSC for GET) | v2: your Node API as source of truth. v1: static stub functions in `lib/api/`. |
| i18n | **next-intl** | App Router-native; scaffolded in v1, English-only ships; multi-lingual flips on later via config |
| UI primitives | **shadcn/ui** (only what we use) | Headless, accessible, restyled to our brand — we pull `Dialog`, `Dropdown`, `Tooltip` only |
| Icons | **lucide-react** + custom SVGs | Clean, complete, tree-shakes well |
| Fonts | **next/font** with `General Sans` (self-hosted via Fontshare) + `Inter` (Google) + `JetBrains Mono` (Google) | No FOUT, no CLS, self-hosted CDN guarantees uptime |
| Analytics | **Deferred** | Host-agnostic; pick once deployment is decided (Plausible / Umami / Vercel Analytics all viable) |
| Deployment | **Deferred** | Not Vercel-locked. Build stays portable until host is chosen. |
| Image assets | Next.js Image + `<picture>` for art-direction | Auto AVIF/WebP, lazy loading |
| Video assets | `<video>` with poster, autoplay-on-intersection, MP4 (H.264) + WEBM fallback | Lightweight phone loops |

### Explicitly NOT using

- Three.js directly (we use R3F instead, which compiles down to the same Three but with a sane React model)
- Lottie (too rigid for our motion language; we build in code)
- A heavy CMS at v1 (Sanity/Contentful) — content lives in MDX in-repo for blog/case studies until growth justifies a CMS migration
- Redux / Zustand / Jotai — site has no global app state worth managing; React Context + URL state is enough
- A separate component library (Storybook deferred to phase 4 if we want it)

---

## Folder Structure

```
yantra-web/
├── app/                       # Next.js App Router
│   ├── (marketing)/           # Public route group — homepage and inner pages
│   │   ├── page.tsx           # Homepage (the 9-chapter scroll)
│   │   ├── work/
│   │   │   ├── page.tsx       # Portfolio index
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Case study
│   │   ├── capabilities/
│   │   │   ├── page.tsx
│   │   │   └── ai/
│   │   │       └── page.tsx   # AI deep-dive
│   │   ├── atelier/page.tsx   # About
│   │   ├── lab/
│   │   │   ├── page.tsx       # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Blog post
│   │   ├── signal/page.tsx    # Standalone contact
│   │   └── layout.tsx         # Marketing chrome (nav + footer)
│   ├── [locale]/              # Locale-scoped routes (en only in v1; structure ready for hi/etc.)
│   │   └── (marketing routes nest here in v2; flat in v1)
│   ├── api/                   # v2: form submission proxy to Node API. v1: empty.
│   ├── layout.tsx             # Root layout (fonts, Lenis provider, theme)
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/                    # shadcn primitives (restyled)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── glass/                 # Brand primitives — the most-used layer
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── AnimatedBorder.tsx
│   │   └── GlassInput.tsx
│   ├── motion/                # Reusable motion utilities
│   │   ├── Reveal.tsx         # Fade/translate on scroll into view
│   │   ├── ScrollPinned.tsx   # Wrapper for GSAP ScrollTrigger pinning
│   │   ├── Parallax.tsx       # Cursor + scroll parallax
│   │   ├── MarqueeRow.tsx     # Looping rows
│   │   └── SplitText.tsx      # Word/char split for type animations
│   ├── three/                 # R3F scenes & primitives
│   │   ├── scenes/
│   │   │   ├── HeroScene.tsx          # The full hero R3F canvas
│   │   │   ├── ForgeScene.tsx         # Chapter 04 scene
│   │   │   └── SignalScene.tsx        # Chapter 09 logo reprise
│   │   ├── materials/
│   │   │   ├── meshGradient.ts        # Custom shader material
│   │   │   ├── glassMaterial.ts
│   │   │   └── iridescentMaterial.ts
│   │   ├── primitives/
│   │   │   ├── VolumetricLight.tsx
│   │   │   ├── OrbitalCard.tsx        # 3D-positioned glass card
│   │   │   └── LogoModel.tsx          # Loads the GLB
│   │   └── shaders/
│   │       ├── meshGradient.vert
│   │       ├── meshGradient.frag
│   │       └── ...
│   ├── backgrounds/           # Reusable animated background patterns
│   │   ├── MeshGradient.tsx
│   │   ├── DotField.tsx
│   │   ├── LineWeave.tsx
│   │   └── NoiseAura.tsx
│   ├── chrome/                # Layout chrome
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Cursor.tsx
│   │   └── MobileNav.tsx
│   ├── sections/              # Homepage chapters
│   │   ├── 01-arrival/
│   │   ├── 02-manifesto/
│   │   ├── 03-capabilities/
│   │   ├── 04-forge/
│   │   ├── 05-work/
│   │   ├── 06-ai-atelier/
│   │   ├── 07-voices/
│   │   ├── 08-lab/
│   │   └── 09-signal/
│   ├── mockups/               # PhoneFrame + BrowserFrame
│   │   ├── PhoneFrame.tsx
│   │   └── BrowserFrame.tsx
│   └── work/                  # Case study templates
│       ├── CaseHero.tsx
│       └── CaseMetric.tsx
│
├── lib/
│   ├── api/                   # Stub functions for v1; swap to real calls in v2
│   │   ├── contact.ts         # submitContact() — v1: log + localStorage
│   │   ├── project.ts         # submitProject() — v1: log + localStorage
│   │   ├── notify-restroverse.ts
│   │   ├── notify-jimbo.ts
│   │   └── posts.ts           # fetchPosts() — v1: static array; v2: WordPress
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useMousePosition.ts
│   │   ├── useViewportSize.ts
│   │   └── useGsapContext.ts
│   ├── utils/
│   │   ├── cn.ts              # clsx + tailwind-merge
│   │   ├── lerp.ts            # math helpers for motion
│   │   ├── easing.ts          # named easing curves
│   │   └── format.ts
│   ├── content/               # MDX + typed constants for static v1 content
│   │   ├── en/                # Locale-scoped (more locales in v2)
│   │   │   ├── manifesto.mdx
│   │   │   ├── capabilities.ts
│   │   │   ├── products/      # Restroverse, Jimbo, Shramdan teaser content
│   │   │   ├── team.ts        # 8 members; placeholder avatars until headshots
│   │   │   ├── testimonials.ts # placeholder quotes for v1
│   │   │   ├── client-work.ts  # logos + project blurbs
│   │   │   └── lab/           # static blog placeholder posts
│   └── constants/
│       ├── nav.ts
│       ├── capabilities.ts
│       └── motion.ts
│
├── styles/
│   ├── globals.css            # Tailwind v4 imports + custom properties
│   ├── motion.css             # @property declarations, keyframes
│   └── fonts.css              # @font-face for General Sans
│
├── public/
│   ├── models/                # 3D assets (GLB) — you provide
│   ├── videos/                # Phone loops, etc. — you provide
│   ├── images/                # Project screenshots, og images
│   ├── fonts/                 # Self-hosted font files
│   └── favicons/
│
├── docs/                      # These docs
│
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts         # (or v4 CSS config in globals.css)
├── tsconfig.json
└── package.json
```

---

## Backend Integration

**v1 ships fully static.** No live backend calls. All content (copy, blog posts, testimonials, capability descriptions) lives in MDX or typed TypeScript constants in `lib/content/`. Forms validate locally with Zod and show a success state but don't transmit anywhere — submissions are logged to console and stored in localStorage for visibility during dev.

This is by design: it lets us ship a beautiful site quickly without backend coupling, and lets the same components flip to "real" wiring later by swapping a single function (`submitContact`, `submitProject`, `fetchPosts`) without touching UI code.

### Wire-up surface (v2)

When backends come online, only these files change:

```
lib/api/
  ├── contact.ts          # currently: console.log + localStorage   →  real Node API call
  ├── project.ts          # currently: console.log + localStorage   →  real Node API call
  ├── notify-restroverse.ts  # currently: localStorage                →  real Node API call
  ├── notify-jimbo.ts        # currently: localStorage                →  real Node API call
  └── posts.ts            # currently: returns static array         →  WordPress fetch (REST or GraphQL)
```

The component layer (forms, blog cards) imports from this layer and is **already shaped** for the live response — so the swap is config-only.

### Env vars (defined now, used later)

```
# v1: optional / unused
# v2: required

NODE_API_URL                 # base URL of Node API
NODE_API_KEY                 # server-only secret
WORDPRESS_URL                # base URL of WP install
WORDPRESS_GRAPHQL_URL        # if using WPGraphQL
NEXT_PUBLIC_SITE_URL         # canonical + OG (used now)
TURNSTILE_SECRET             # optional spam protection
```

## Internationalization (i18n)

v1 ships **English only**, but the route structure and component contract assume future locales from day one. We use **`next-intl`** (cleanest App Router integration, supports both static and dynamic locales, mature i18n library).

Setup:
- Routes are wrapped in a `[locale]` segment: `app/[locale]/(marketing)/page.tsx`
- Default locale (`en`) is exposed at the root (`/`) via Next.js middleware so users don't see `/en/...` in v1
- All UI text loaded via `useTranslations()` / `getTranslations()` reading from `messages/{locale}.json`
- The same JSON shape gets a sibling `messages/hi.json` (Hindi), `messages/{x}.json` etc. when v2 multi-lingual ships — no component changes needed
- Content (MDX) is keyed by locale: `lib/content/{locale}/...`; falls back to `en` if a locale is missing a file
- Language switcher component built in v1 but hidden via feature flag until v2 (so we can test it works without exposing partial translations)

This adds ~5% complexity now in exchange for ~80% time savings later when multi-lingual ships.

---

## Performance Budgets

Hard targets, measured against the homepage on a mid-tier mobile (Pixel 6a-class, throttled 4G):

| Metric | Budget |
|---|---|
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| TTFB | < 600ms |
| JS shipped above the fold | < 180KB gzipped |
| Total page weight (homepage) | < 1.8MB (incl. one video poster) |
| First WebGL frame | < 1.5s after LCP |

Strategies:
- Server-render headlines, type, layout — defer canvas mounting
- Code-split each chapter section; non-critical chapters are dynamic imports
- 3D scenes lazy-load on `IntersectionObserver` at 20vh threshold
- Three.js / R3F bundle separated and prefetched on idle
- Images: next/image with AVIF, sized exactly to layout
- Videos: poster image first; video element preloads metadata only; play on intersection
- Fonts: `next/font` with `display: swap`; preload only display + body weights used above the fold
- WebGL DPR clamped to 2; resolution scales down if FPS drops below 45 (auto-quality)
- `prefers-reduced-data` honored — disables non-essential scenes

---

## Accessibility Commitments

These are not afterthoughts. The site ships with:
- Full keyboard navigation; visible focus rings on glass elements (gradient ring, not browser default)
- All scroll-pinned scenes have a "skip to next section" link that appears on Tab focus
- `prefers-reduced-motion` honored everywhere; no looping shaders run in reduced-motion
- Color contrast ≥ 4.5:1 for body text on glass surfaces (we tune the glass darkness based on what's behind)
- All decorative WebGL is `aria-hidden="true"`; meaningful copy lives in HTML, not on canvas
- Custom cursor falls back to native cursor on `prefers-reduced-motion` or touch
- Forms label every input, announce errors via `aria-live`
- Image alt text on all real content imagery
- Lighthouse Accessibility score ≥ 95 on every page

---

## SEO

- Server-rendered HTML for all primary content (heading, body, links)
- `<title>`, `<meta description>`, OpenGraph image per page (dynamic OG via `@vercel/og`)
- `sitemap.xml` and `robots.txt` generated from routes
- JSON-LD structured data: `Organization` on home, `Article` on lab posts, `CreativeWork` on case studies
- Canonical URLs configured
- Mobile-friendly verified (Google's check)

---

## Tooling

- **Linting:** ESLint with `eslint-config-next` + `eslint-plugin-tailwindcss`
- **Formatting:** Prettier with `prettier-plugin-tailwindcss` for class ordering
- **Type-checking:** `tsc --noEmit` in CI
- **Pre-commit:** Husky + lint-staged (auto-format on commit)
- **CI:** GitHub Actions running typecheck + lint + Lighthouse-CI on PRs
- **Local dev:** `pnpm` as package manager (faster than npm, leaner than yarn)

---

## Risk Register

Things I'm watching that could blow the budget:

1. **WebGL on low-end mobile** — mitigation: auto-quality scaling, optional `?lite` URL param
2. **Heavy 3D assets** — mitigation: GLB spec is strict; we test every export before integrating
3. **Scroll jank on Safari iOS** — mitigation: Lenis has known patches; we test on real device frequently
4. **Tailwind v4 instability** — v4 is still settling; if we hit a blocker, falling back to v3.4 is one config change
5. **GSAP free-tier coverage** — locked: free tier only. No SplitText, DrawSVG, or MorphSVG. Use `split-type` and manual SVG dash-offset animations.
6. **Form spam to your Node API** — mitigation: edge rate-limit + honeypot + optional Turnstile (Cloudflare's hCaptcha alternative, free)

---

## All tech decisions locked.

v2 wiring (WordPress connection method, full Node API endpoint list, auth pattern) deferred until backend integration phase. v1 ships fully static with stub functions ready for swap-in.
