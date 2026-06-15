# 11 — UI Components (Reference)

> **Layer: REFERENCE** — the component inventory and API. Depth is **tiered**: reusable primitives get full props; large feature shells get purpose + key surface only (read the file for internals).
>
> Conventions: all paths are under `components/`. "Client" = has `"use client"`. Props shown are the exported interface; `className` and standard HTML attributes are usually accepted and omitted for brevity unless notable. Last reconciled **2026-06-15** — when you change a component's props, update its entry here.

**Jump to:** [Glass](#glass-primitives) · [Layout](#layout) · [Typography](#typography) · [Motion](#motion) · [Backgrounds](#backgrounds) · [Chrome](#chrome) · [Brand](#brand) · [Sections](#homepage-sections) · [Feature shells](#feature-shells)

---

## Glass primitives

The core design-system surfaces. Prefer these over hand-rolled glass. Styling comes from the `.glass-*` classes in `globals.css` (neumorphic — see [02-brand-system.md](./02-brand-system.md#4-glass--surface-system-neumorphic)).

### GlassCard
`components/glass/GlassCard.tsx` · Client · **the most-used interactive surface.**
```ts
interface GlassCardProps {
  variant?: "light" | "medium" | "heavy";  // default "medium"
  interactive?: boolean;                    // default true
  className?: string;
  children: ReactNode;
}
```
Signature hover (when `interactive`): 3D tilt toward cursor (±6°), lift, accent glow, and a cursor-following spotlight — all driven by CSS custom properties it sets (`--mx --my --rx --ry --lift --spot --glow`). Set `interactive={false}` for static cards.

### GlassButton
`components/glass/GlassButton.tsx` · Client · extends `ButtonHTMLAttributes`.
```ts
interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";  // default "primary"
  children: ReactNode;
}
```
Pill button. `primary` wraps an `AnimatedBorder` sweep + violet tint + accent halo on hover; `secondary` is neutral glass. Fires a press-shine sweep on mousedown/touchstart. Disabled removes animation and dims.

### GlassInput
`components/glass/GlassInput.tsx` · Client · extends `InputHTMLAttributes`.
```ts
interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```
Glass text field with optional label; focus adds an accent ring/glow, `error` shows a red border + message.

### GlassPanel
`components/glass/GlassPanel.tsx` · **Server** · extends `HTMLAttributes<HTMLDivElement>`.
```ts
interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "medium" | "heavy";  // default "heavy"
  children: ReactNode;
}
```
Non-interactive glass surface for nav/modal/banner backings. No hover. Use `GlassCard` when you need interactivity.

### AnimatedBorder
`components/glass/AnimatedBorder.tsx` · Client.
```ts
interface AnimatedBorderProps {
  variant?: "sweep" | "pulse" | "trace";  // default "sweep"
  radius?: number;     // px, default 24
  duration?: number;   // ms, default 8000
  paused?: boolean;    // default false
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}
```
Wraps children with an animated gradient border using the CSS mask technique + `@property --angle`. `sweep` = rotating conic gradient, `pulse` = soft glow, `trace` = SVG stroke draw.

---

## Layout

### Container
`components/layout/Container.tsx` · Server.
```ts
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: "narrow" | "default" | "wide" | "full";  // 720 / 1200 / 1440 / 100%; default "default"
  noPadding?: boolean;                              // default false (px-6 md:px-8)
  children: ReactNode;
}
```

### SectionDivider
`components/layout/SectionDivider.tsx` · Server · no props. A near-invisible gradient seam between sections.

### TvFrame
`components/layout/TvFrame.tsx` · Client · `{ children }`. The CRT television app shell — power state, CRT overlays, glitch-on-navigate, top chrome bar, console tabs, fullscreen, synth sounds. **See [10-systems.md](./10-systems.md#tvcrt-shell) for the full system.** Most pages wrap content in it.

---

## Typography

### Eyebrow
`components/typography/Eyebrow.tsx` · Server.
```ts
interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div";          // default "p"
  tone?: "low" | "mid" | "accent";    // default "low"
  children: ReactNode;
}
```
Small mono uppercase label with `0.2em` tracking — the "01 — SECTION" scene marker.

### YantraElectricTitle
`components/typography/YantraElectricTitle.tsx` · Client.
```ts
interface YantraElectricTitleProps {
  text?: string;     // default "YantraCore"
  size?: "xs"|"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl";
  fontSize?: string; // CSS override
  as?: "h1"|"h2"|"h3"|"h4"|"p"|"span"|"div";  // default "span"
  className?: string;
}
```
The signature electric-gradient wordmark (`.yantra-electric-title` — flow + pulse + scan + flicker). `size` maps to responsive `clamp()` values (xl≈2rem … 5xl≈clamp(4rem,10vw,7.5rem)).

---

## Motion

Reusable motion utilities. Behavior + reduced-motion handling described in [10-systems.md](./10-systems.md#motion).

### Reveal — `components/motion/Reveal.tsx` · Client · **most-used.**
```ts
interface RevealProps {
  delay?: number;      // ms, default 0
  duration?: number;   // ms, default 1100
  y?: number;          // px, default 24
  once?: boolean;      // default true
  threshold?: number;  // 0–1, default 0.15
  className?: string;
  children: ReactNode;
}
```
Fade + Y-translate when scrolled into view (IntersectionObserver). Respects reduced motion (instant show). `once` disconnects after first reveal.

### MarqueeRow — `components/motion/MarqueeRow.tsx` · Client.
```ts
interface MarqueeRowProps {
  speed?: number;                  // multiplier, default 1 (duration = 40s / speed)
  direction?: "left" | "right";    // default "left"
  gap?: number;                    // px, default 48
  pauseOnHover?: boolean;          // default true
  className?: string;
  children: ReactNode;
}
```
Infinite horizontal loop (children duplicated, CSS `marquee-*`), edge-masked.

### CountUp — `components/motion/CountUp.tsx` · Client.
```ts
interface CountUpProps {
  to: number;
  duration?: number;        // ms, default 2000
  decimals?: number;        // default 0
  prefix?: string; suffix?: string;
  triggerOnView?: boolean;  // default true (threshold 0.4)
  className?: string;
}
```
Eases 0→`to` with rAF; reduced-motion shows the final value immediately.

### JellyRotateWrapper — `components/motion/JellyRotateWrapper.tsx` · Client.
```ts
interface JellyRotateWrapperProps {
  duration?: number;  // ms, default 1500
  spins?: number;     // default 1
  className?: string;
  children: ReactNode;
}
```
Click-triggered jelly spin to the nearest 90° + `spins`×360°, with a wobble scale; direction inferred from click position.

### AnimationWrappers — `components/motion/AnimationWrappers.tsx` · Client (Framer Motion).
Exports three entrance helpers (all extend `HTMLMotionProps<"div">`):
- **`StaggerContainer`** — `{ delay?=0 (ms), staggerDelay?=0.1 (s) }`, staggers children in.
- **`StaggerItem`** — `{ y?=15, x?=0 }`, spring entrance child.
- **`ScaleFadeItem`** — `{ initialScale?=0.4, targetScale?=1, rotate?=0 }`.

### CanvasHUD — `components/motion/CanvasHUD.tsx` · Client.
`{ zoom: number; onReset: () => void }`. Fixed zoom/reset HUD for pannable canvases (pairs with `useCanvasControls`); shows a one-time hint stored in `localStorage`.

### StarSystem — `components/motion/StarSystem.tsx` · Client.
`{ onCenterClick: () => void }`. The `/technologies` visualization: a fixed (non-spinning) `LogoMark` star at center, ten tech "planets" on orbits — React, Next.js, Node.js, TypeScript, Python (AI/data), Google Cloud (cloud/hosting), PostgreSQL (databases), Flutter (mobile), Figma (design — incl. Photoshop), WordPress (CMS/commerce — Shopify, WooCommerce) — each carrying 2–3 satellite tools. Planets/satellites are data-driven from `lib/content/tech-stack.ts` (`techPlanets`); brands missing from `react-icons` (e.g. Photoshop) use custom marks in `lib/content/tech-icons.tsx`. Pan/zoom via `useCanvasControls`. On mount it plays a soothing centre-outward entrance (star → rings → planets → satellites, staggered inner-to-outer, fade + scale on the `--ease-out-soft` curve). `prefers-reduced-motion` renders everything at rest **and** parks the orbital spin into a static constellation. Framer Motion + react-icons. (Feature-scale, listed here as it lives in `motion/`.)

---

## Backgrounds
`components/backgrounds/` — see [10-systems.md](./10-systems.md#backgrounds).
- **`SiteBackground`** · Server · no props — the global fixed backdrop. Render once per page behind `TvFrame`.
- **`MeshGradient`**, **`DotField`**, **`LineWeave`**, **`NoiseAura`** · Client · all `{ className?: string }` — interchangeable per-section patterns.

---

## Chrome
`components/chrome/`.

- **`Header`** · Client · no props. Sticky top nav: logo + wordmark, scroll-reactive glass pill, desktop links, Signal CTA, Login, theme toggle, mobile hamburger + full-screen menu. Contains an internal `HeaderLogo` (glass backing, conic halo, bloom, chromatic aberration), reused by `SettingsShell`. Hidden on `[data-layout="auth"]` pages and in app-mode.
- **`Footer`** · Server · no props. Logo, nav links, legal links, copyright. Uses `Container` + `ColorfulLogo`.
- **`Cursor`** · Client · no props. The custom cursor — see [10-systems.md](./10-systems.md#cursor-system).
- **`SmoothScrollProvider`** · Client · `{ children }`. **Currently a passthrough** (Lenis disabled; native scroll). Kept as the integration point if smooth scroll returns.
- **`NavIcons`** · Server. Exports the custom 16×16 SVG icon set (`StudioIcon`, `CapabilitiesIcon`, `LabIcon`, `SignalIcon`, `UserIcon`, `TvConsoleIcon`, `StellarOrbitIcon`, `SynthMusicIcon`, `ContactIcon`, theme `SunCoreIcon`/`MoonCrescentIcon`, etc.), `stroke="currentColor"`.

---

## Brand

### ColorfulLogo — `components/brand/ColorfulLogo.tsx` · Client.
```ts
interface ColorfulLogoProps {
  size?: number;       // height px, default 24
  animate?: boolean;   // default true
  className?: string;
  style?: CSSProperties;
}
```
Compact prismatic logomark — CSS mask over a flowing cyan→violet→pink gradient with chromatic ghost layers and a pulsing glow. `animate={false}` for lightweight contexts (sidebars).

---

## Homepage sections
`components/sections/01-arrival … 09-signal/`. These were authored for the VISION 9-chapter scroll homepage. **The live homepage (`app/page.tsx`) currently renders only `Showcase`** inside `TvFrame`; the rest exist as building blocks (some used elsewhere, some staged for a future long-form home). Treat them as the section library, not a live page, until verified.

| Folder | Key component(s) | Role |
|---|---|---|
| `01-arrival` | **`Showcase`** (live), `Arrival`, `LogoMark`, `OrbitalCard` | The solar-system hero scene + alternates |
| `02-manifesto` | `Manifesto` | Mission statement block |
| `03-studio` | `Studio`, `BrandVisual` | Own-products showcase |
| `04-capabilities` | `Capabilities` | Client-services constellation (DotField bg) |
| `05-forge` | `Forge` | Process/“how we build” scene |
| `06-work` | `Work` | Client-work marquee/wall |
| `07-voices` | `Voices` | Testimonials |
| `08-lab` | `Lab` | Lab notes / blog teaser (LineWeave bg) |
| `09-signal` | `Signal` | Contact + footer finale |

Notable section pieces:
- **`Showcase`** · Client · `{ inTv?: boolean }`. LogoMark center + orbital product cards; Swiper carousel on mobile; rotating ring arcs. Uses `LogoMark`, `AnimatedBorder`, `Eyebrow`, `YantraElectricTitle`, `audioSynth`.
- **`LogoMark`** · Client · `{ centerY?="34%"; onClick?; parallax?=true; spin?=true }`. The animated 2D holographic centerpiece (planet spin, parallax, bloom, halo, shimmer, chromatic aberration; elaborate hover). `parallax={false}` disables the mouse-tilt rAF loop (for never-unmounting usages like the orbital `Sun`); `spin={false}` pins it front-facing (the `/technologies` star).
- **`OrbitalCard`** · Client · `{ delay?="0s"; duration?="16s"; depth?: "front"|"mid"|"back"; className?; children }`. Drifting glass tile around the hero (hidden on mobile).

---

## Feature shells
Large, self-contained components. Purpose + key surface only — read the file for internals.

### DashboardShell — `components/dashboard/DashboardShell.tsx` · Client · no props · **~2,900 lines.**
The console. Sidebar nav: **Ask AI** (RAG chat with cited Drive file sources + markdown rendering), **Projects**, **Requests**, **Email** (per-account chat + add/manage IMAP accounts modal), **Drive Sync**, **Settings** (embeds `SettingsShell`). Talks to YantraMate (see [12-app-api.md](./12-app-api.md) / [07-api-reference.md](./07-api-reference.md)). Persists drafts to `localStorage`. Includes a self-contained markdown renderer and email-provider badges.

### SettingsShell — `components/dashboard/SettingsShell.tsx` · Client · `{ inTv?: boolean }`.
The preferences panel: palette picker (6 options), font style (5), cursor design, logo-heartbeat toggle — all via `useTheme()`, with live previews and toast confirmations.

### LoginForm / SignupForm — `components/auth/` · Client · `{ inTv?: boolean }`.
Auth surfaces. `LoginForm`: role tabs (client/staff/admin), Google SSO button, email/password, remember-me; `SignupForm`: client-role registration with social buttons. **Demo-grade** — client-side validation, writes `sessionStorage` (`ym_authed`, `ym_role`, `ym_user`); no real backend session. Built from `GlassInput`, `AnimatedBorder`, the stagger wrappers, `ColorfulLogo`.

### ChannelPage — `components/channels/ChannelPage.tsx` · Client · `{ slug: ChannelSlug }`.
The `/channels/[slug]` dashboard: 3-column live-signal viewer (feed terminal, hero + controls, stats/search/pulse). Reads config from `lib/content/channels.ts`; simulated live updates. Slugs: `jimbo` · `restroverse` · `shramdan` · `yantracore`.

### EntryportGlobe — `components/entryport/EntryportGlobe.tsx` · Client.
The `/entryport` interactive 3D globe (Three.js + OrbitControls): activity arcs from a Nepal hub (Pokhara) to 12 cities, color-coded by kind, with status/metrics panels and drag/zoom controls.

### FloatingAssistant — `components/assistant/FloatingAssistant.tsx` · Client · no props.
Fixed bottom-right chat bubble with a Lottie bot avatar and a toggle panel. Currently a UI demo with a simulated response delay (not wired to YantraMate).
