# 02 — Brand System (Design Reference)

> **Layer: REFERENCE** — the design system as it exists in code today.
>
> **Source of truth in code:** [`app/globals.css`](../app/globals.css) (~2,570 lines) holds every token, glass class, keyframe, cursor style, and CRT/TV style. This doc mirrors it. The original aspirational brand spec (blur-based glass, single locked palette) is preserved as VISION at the bottom for context.

The kit of parts every component is built from. Tokens live as **CSS custom properties** so the whole site re-skins from one place. Many are **swapped at runtime** by `ThemeProvider` (see [10-systems.md](./10-systems.md#theme-system)).

---

## 1. Color tokens

### Ink (canvas surfaces) — `:root`
| Token | Hex | Use |
|---|---|---|
| `--ink-0` | `#06070D` | Page base (a hair of blue, not pure black) |
| `--ink-1` | `#0A0C16` | Elevated surface; also the glass fill (see §4) |
| `--ink-edge` | `#1A1E2E` | Hairline dividers, low-contrast borders |

### Text
| Token | Hex | Use |
|---|---|---|
| `--text-hi` | `#F4F5FA` | Headlines, primary body |
| `--text-mid` | `#B4B9CC` | Secondary body, captions |
| `--text-low` | `#7B8197` | Eyebrow labels, metadata |
| `--text-faint` | `#4B5066` | Disabled, decorative numerals |

### Accent (the jewelry) — **runtime-swappable**
The default (`:root`) is the **Crystal** palette. `ThemeProvider` overwrites these four variables on `<html>` when the user picks another palette.

| Token | Crystal default | Role |
|---|---|---|
| `--accent-1` | `#6E56FF` | Primary (violet) |
| `--accent-2` | `#00E0CB` | Secondary (cyan) |
| `--accent-3` | `#FF4FB0` | Tertiary (magenta) |
| `--accent-warm` | `#FFB454` | Warm callouts (amber) |

Particle/star colors derive from accents: `--particle-color-1: var(--accent-2)`, `--particle-color-2: var(--text-hi)`, `--particle-color-3: var(--accent-1)`.

> **Rule:** never hardcode an accent hex in a component. Reference `var(--accent-1)` etc. (or the Tailwind classes `text-accent-1`, `bg-accent-2`, …) so palette switching works. Mix with `color-mix(in srgb, var(--accent-1) 30%, transparent)` for translucency — this pattern is used throughout `globals.css`.

### The 5 runtime palettes
Defined in [`lib/theme/palettes.ts`](../lib/theme/palettes.ts). Each has `accent1–4`, a `previewGradient`, and `glow1–3` rgba values.

| Palette | `--accent-1` | `--accent-2` | `--accent-3` | `--accent-warm` | Vibe |
|---|---|---|---|---|---|
| **Crystal** (default) | `#6E56FF` | `#00E0CB` | `#FF4FB0` | `#FFB454` | Violet / cyan / magenta |
| **Sovereign Ember** | `#E8400A` | `#F5A623` | `#FF6B35` | `#FCD34D` | Fire / amber |
| **Glacier Deep** | `#0EA5E9` | `#10D9A0` | `#38BDF8` | `#FDE68A` | Ice blue / mint |
| **Obsidian Sakura** | `#F1F5F9` | `#FB7185` | `#E879F9` | `#FDBA74` | Mono + rose |
| **Void Chrome** | `#A3E635` | `#818CF8` | `#34D399` | `#FCD34D` | Lime / indigo |

> Legacy alternates *Atelier* and *Hearth* still sit commented in `globals.css` from the original plan — superseded by the palette system above.

---

## 2. Typography

Fonts are loaded in [`app/layout.tsx`](../app/layout.tsx) via `next/font/google` and exposed as CSS variables. Fontshare faces (Clash Display, General Sans) are `@import`ed at the top of `globals.css`.

**Loaded faces:** Inter, JetBrains Mono, Orbitron, Space Grotesk, Syncopate, Syne, Outfit (Google) + Clash Display, General Sans (Fontshare).

### Font-style system (runtime-swappable)
The user can switch the whole site's type via `ThemeProvider` (`fontStyle`), which sets `data-font-style` on `<html>`. Each style remaps three role variables — `--font-display-val`, `--font-body-val`, `--font-mono-val` — which the Tailwind theme bridges to `font-display` / `font-body` / `font-sans` / `font-mono`.

| `data-font-style` | Name | Display | Body | Mono |
|---|---|---|---|---|
| `default` | Crystal Tech | Space Grotesk → General Sans → Inter | Inter | JetBrains Mono |
| `cyber` | Aero Cyber | Orbitron | Space Grotesk → Inter | JetBrains Mono |
| `wide` | Quantum Wide | Syncopate | Inter | JetBrains Mono |
| `mono` | Neo-Chrono | JetBrains Mono | JetBrains Mono | JetBrains Mono |
| `avant-garde` | Chroma Organic | Syne | Outfit → Inter | JetBrains Mono |

Use the semantic Tailwind classes (`font-display`, `font-body`, `font-mono`) — never name a specific family directly, or font switching breaks.

The **`.yantra-electric-title`** class is the signature wordmark treatment: gradient text-fill (white → cyan → violet → pink), animated flow + pulse + scan + flicker via `::before`/`::after` and `data-text`. Wrapped by [`YantraElectricTitle`](./11-ui-components.md#yantraelectrictitle).

---

## 3. Spacing, layout, radii

**Container widths** (via [`Container`](./11-ui-components.md#container)): `narrow` 720px · `default` 1200px · `wide` 1440px · `full` 100%. Default horizontal padding `px-6 md:px-8`.

**Radii tokens:** `--r-sm` 8px · `--r-md` 16px · `--r-lg` 24px · `--r-xl` 32px.

---

## 4. Glass / surface system (neumorphic)

> **Reality check:** the live glass is **neumorphic**, not the frosted/blurred recipe in the original spec. `backdrop-filter` is explicitly disabled. Surfaces are the ink fill (`#0A0C16`) shaped by paired light/dark shadows.

Four classes, three "elevations" + a primary:

| Class | Resting shadow | Active/pressed |
|---|---|---|
| `.glass-light` | `--nm-raised-soft` | `--nm-sunken-soft`, transparent bg |
| `.glass-medium` | `--nm-raised-medium` | `--nm-sunken-medium`, transparent bg |
| `.glass-heavy` | `--nm-raised-large` | `--nm-sunken-deep`, transparent bg |
| `.glass-primary` | `--nm-raised-medium` (primary buttons) | `--nm-sunken-medium`, transparent bg |

All share: `background: #0A0C16`, `backdrop-filter: none`, `border: 1px solid rgba(255,255,255,0.02)`, a top inset highlight, and a 300ms `--ease-out-soft` transition. Adding the `.active` class (or `:active`) presses the surface *into* the page (inset shadow).

**Neumorphic shadow tokens:**
```
--nm-raised-soft:   5px 5px 12px #020305, -5px -5px 12px #121626
--nm-raised-medium: 8px 8px 18px #020305, -8px -8px 18px #121626
--nm-raised-large:  12px 12px 28px #010204, -12px -12px 28px #14192d
--nm-sunken-soft:   inset 3px 3px 6px #020305, inset -3px -3px 6px #121626
--nm-sunken-medium: inset 5px 5px 10px #020305, inset -5px -5px 10px #121626
--nm-sunken-deep:   inset 8px 8px 16px #010204, inset -8px -8px 16px #14192d
--nm-line-soft:  rgba(255,255,255,0.04)
--nm-line-faint: rgba(255,255,255,0.02)
```

The **nav pill** (`.nav-pill-scroll`) is the one surface that *does* use true frosted glass (`backdrop-filter: blur()`), driven by a `--scroll-t` custom property.

---

## 5. Motion tokens

```
--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)   /* default */
--ease-out-snap: cubic-bezier(0.16, 1, 0.3, 1)    /* snappier */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1)   /* symmetrical */

--dur-fast:      200ms    /* micro: hover, focus */
--dur-base:      400ms    /* card lifts, fades */
--dur-slow:      700ms    /* section reveals */
--dur-cinematic: 1200ms   /* hero, big transitions */
--dur-loop:      8000ms   /* loops, border sweeps */
```

**Principles (from VISION, still honored):** slow is the new fast (700–1200ms reveals); `--ease-out-soft` is the default curve — no bounce, no linear except loops. `@property --angle` enables the animated conic border (`border-spin`).

**`prefers-reduced-motion`:** `globals.css` collapses all animations/transitions to ~0ms and disables looping effects (electric title, etc.). `ThemeProvider` can also force this via `reducedMotionEnabled`, toggling `html.prefers-reduced-motion`.

### Keyframe catalog (defined in `globals.css`)
The file defines ~40 named keyframes. Grouped:
- **Logo/hero:** `logo-planet-spin`, `logo-breathe`, `logo-heartbeat`, `logo-halo-spin`, `logo-pulse-ring`, `logo-shimmer`, `logo-chroma-r/c/g` (+ `-wide`), `logo-shockwave`, `logo-spark-orbit`, `logo-planet-arrive`, `hero-line-up`, `hero-fade-up`, `scroll-line-pulse`, `light-drift`.
- **Electric title:** `yantra-electric-flow`, `-pulse`, `-scan`, `-flicker`.
- **Backgrounds:** `mesh-flow`, `dot-drift`, `weave-flow`, `noise-wash`, `star-twinkle`, `float-drift-1/2/3`.
- **Showcase/sections:** `ring-spin-cw/ccw`, `orbital-drift`, `forge-fill`, `forge-line-travel`, `radar-pulse`, `bar-scale`.
- **UI/chrome:** `border-spin`, `pulse-glow`, `button-shine`, `marquee-left/right`, `signal-pulse`, `nav-overlay-in/out`, `nav-item-in/out`, `nav-footer-in`, `bar-{top,mid,bot}-{open,close}` (hamburger), `typing-bounce`, `chat-fade-in`.
- **CRT/TV:** `crt-flicker`, `crt-distortion`, `light-pulse`, `click-ripple`.

---

## 6. Custom cursor

A site-wide custom cursor ([`Cursor`](./11-ui-components.md#cursor) + `.cursor-*` classes). Three designs selectable via `ThemeProvider` (`cursorStyle`): **arrow** (neon, rotated 15°), **crosshair**, **dot**. States: `--active` (hover over interactive), `--click` (press, fires `click-ripple` shockwave), `--text` (over text inputs, shows a glowing beam). Glows use accent drop-shadows. System cursor is hidden via `html.has-custom-cursor` only on `hover:hover`/`pointer:fine` devices; touch and reduced-motion fall back to native. Toggle via `customCursorEnabled`.

---

## 7. CRT / TV shell styling

The `.tv-frame-*`, `.tv-screen-*`, `.crt-*`, and `.tv-console-*` classes implement the television app shell ([`TvFrame`](./11-ui-components.md#tvframe), [10-systems.md](./10-systems.md#tvcrt-shell)). Outer frame → bezel → screen glass → content, with optional CRT overlays (`.crt-scanlines`, `.crt-phosphor`, `.crt-curvature`) and a `crt-distortion` filter when `.crt-active`. Console tabs (`.tv-console-tabs-container`, `.tv-console-tab.active`) dock above the frame as the sticky nav on app pages.

---

## 8. Iconography

- `lucide-react` is the base icon library; `react-icons` is used in places (e.g. `StarSystem` tech logos).
- Custom brand SVGs live in [`components/chrome/NavIcons.tsx`](./11-ui-components.md#navicons) (16×16, `stroke="currentColor"`, theme-aware).

---

## 9. Utility classes worth knowing
- `.btn-shine-target` / `.btn-shining` — diagonal shine sweep on button press (3 cycles).
- `.no-scrollbar`, `.jimbo-chat-scrollbar`, `.whatsapp-scrollbar` — scrollbar treatments.
- `.mobile-menu-open`, `body.app-mode-active`, `body.brochure-mode-active` — body-level layout locks.
- `[data-layout="auth"]` — hides the global `<Header>` on login/signup via CSS.

---

## Appendix — original VISION spec (superseded, kept for intent)

The first brand doc specified: dark-mode-only, a single locked Crystal palette swapped via one CSS file, **frosted glass** (`backdrop-filter: blur(16–32px)`, white-tint gradients) in three variants, General Sans as the sole display face, and animated borders (conic-sweep / trace / pulse). The *intent* — jewel-bright accents on deep ink, glass as the dominant surface, slow confident motion — still drives the design. The *implementation* evolved to neumorphic surfaces, a runtime palette/font/cursor system, and the CRT shell. When intent and implementation conflict, **the implementation (this doc + `globals.css`) wins** for current work; raise it with the user if the divergence seems wrong.
