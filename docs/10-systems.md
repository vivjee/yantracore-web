# 10 — Systems (Reference)

> **Layer: REFERENCE** — the cross-cutting systems that the whole app depends on. If a component behaves "magically," the explanation is usually here.

Six systems: **Theme**, **Audio**, **TV/CRT shell**, **Cursor**, **Backgrounds**, **Motion**. Each is small and self-contained; together they define the app's feel.

---

## Theme system

**Files:** [`lib/theme/ThemeProvider.tsx`](../lib/theme/ThemeProvider.tsx), [`lib/theme/palettes.ts`](../lib/theme/palettes.ts). Mounted in the root layout, above everything.

`ThemeProvider` is a React Context that owns every user-tunable visual preference, applies it by writing to `<html>` (CSS variables + `data-*` attributes + classes), and persists each to `localStorage`. Read it with the `useTheme()` hook.

### Context shape (`useTheme()`)
| Group | Values / setters |
|---|---|
| Palette | `palette`, `palettes`, `setPaletteId(id)` |
| Mode | `themeMode: "dark" \| "light"`, `setThemeMode()` |
| Cursor | `cursorStyle: "default" \| "arrow" \| "crosshair" \| "dot"`, `setCursorStyle()`, `customCursorEnabled`, `setCustomCursorEnabled()`, `resetCursorSettings()` |
| Motion | `reducedMotionEnabled`, `setReducedMotionEnabled()` |
| Logo | `logoHeartbeatEnabled`, `setLogoHeartbeatEnabled()` |
| Font | `fontStyle: "default" \| "cyber" \| "wide" \| "mono" \| "avant-garde"`, `setFontStyle()` |

### How it applies
- **Palette** → overwrites `--accent-1..3` + `--accent-warm` on `<html>` (from `palettes.ts`).
- **Font style** → sets `data-font-style` on `<html>`; `globals.css` remaps the font role variables (see [02-brand-system.md](./02-brand-system.md#font-style-system-runtime-swappable)).
- **Cursor** → drives `<Cursor>` and toggles `html.has-custom-cursor`.
- **Reduced motion** → toggles `html.prefers-reduced-motion` (collapses animations).

### localStorage keys
`yantra_theme_palette`, `yantra_theme_mode`, `yantra_theme_cursor`, `yantra_theme_cursor_toggle`, `yantra_theme_motion_toggle`, `yantra_theme_logo_heartbeat`, `yantra_font_style`.

**UI:** `SettingsShell` (`/settings`, and the dashboard Settings tab) is the control panel for all of the above, with live previews.

---

## Audio system

Two independent pieces, both in `lib/audio/`.

### 1. UI sound synth — `lib/audio.ts`
A procedural Web-Audio synthesizer (`class AudioSynth`, exported as the singleton **`audioSynth`**). No audio files — every sound is generated. Master gain is a soft `0.04`.

| Method | Sound |
|---|---|
| `playHover()` | 2200→1200 Hz sine blip (15ms) |
| `playClick()` | 800→1400 Hz triangle click (70ms) |
| `playCrtOn()` | sine sweep + noise burst — TV degauss (260ms) |
| `playCrtOff()` | descending sweep — power down (360ms) |
| `playStatic()` | white-noise burst (180ms) |
| `mute()` / `unmute()` | master toggle |

Used by `TvFrame`, `Header`, `Showcase`, `SettingsShell` for tactile UI feedback. The `AudioContext` is created lazily on first interaction (autoplay-policy safe).

### 2. Music player — `lib/audio/AudioPlayerContext.tsx`
A full ambient-music engine behind the `/music` page, exposed via `useAudioPlayer()`. Mounted in the root layout so playback persists across navigation. It wraps a hidden `<audio>` element plus a Web-Audio graph (AnalyserNode for the visualizer, 3-band BiquadFilter EQ, a delay node for echo, oscillator drones, and noise generators for rain/wind/hum ambience).

Capabilities: playlist (2 bundled lofi tracks in `public/music/`), play/pause/next/prev, seek, volume/mute, repeat (`none`/`one`/`all`), shuffle, a synth-only fallback when streaming fails, 3-band EQ (`eqBass/Mid/Treble`), ambient layer volumes (`echoVol/rainVol/windVol/humVol`), custom-track loading (`addCustomTrack`), and a `logs` array for the on-screen console.

---

## TV/CRT shell

**File:** [`components/layout/TvFrame.tsx`](../components/layout/TvFrame.tsx). Styles: the `.tv-*` / `.crt-*` classes in `globals.css`.

`TvFrame` is the app's signature chrome — a retro CRT television that wraps page content. Nesting: `.tv-frame-outer` → `.tv-frame-bezel` → `.tv-screen-glass` → `.tv-screen-content`. Responsibilities:

- **Power state** — boot/shutdown animation with synth sounds (`isPowered`, `isPoweringOn`).
- **CRT overlays** — optional scanlines / phosphor flicker / curvature / distortion filter, toggled by `isCrtEnabled` (adds `.crt-active`).
- **Glitch on navigate** — brief distortion + sound when the route changes (works with `template.tsx` re-mounting).
- **Top chrome bar** (`.tv-chrome-bar`) — logo, primary nav pills (Home / Entryport / Technologies / Music / Contact), theme toggle, account button, fullscreen toggle.
- **Console tabs** (`.tv-console-tabs-container`) — dock above the frame and act as the sticky nav on app pages.
- **Body locks** — `body.app-mode-active` (lock scroll, hide global header) vs. `body.brochure-mode-active`.

Pages opt in by composing `<TvFrame>{children}</TvFrame>`. Several components also render "inside the TV" via an `inTv` prop (`LoginForm`, `SignupForm`, `SettingsShell`, `Showcase`) so they adapt padding/background.

---

## Cursor system

**File:** [`components/chrome/Cursor.tsx`](../components/chrome/Cursor.tsx) + `.cursor-*` classes. Mounted once in the root layout.

A custom cursor that tracks the pointer with `requestAnimationFrame`. The active design (`arrow` / `crosshair` / `dot`) comes from `useTheme().cursorStyle`. It expands and recolors on hover over interactive targets (`a`, `button`, `[role="button"]`, `[data-cursor="grow"]`), shows a press shockwave on click, and a glowing beam over text inputs. Disabled on touch / coarse pointers / reduced-motion, where the native cursor returns. Visibility is gated by `customCursorEnabled`. Full visual states in [02-brand-system.md](./02-brand-system.md#6-custom-cursor).

---

## Backgrounds

**Files:** `components/backgrounds/`. One global layer + four reusable patterns.

- **`SiteBackground`** — the global fixed backdrop rendered behind the whole app (server component, no props). Layered z-order: ink base → mesh-gradient blobs → scan-line grid → three volumetric light cones (violet/cyan/pink) → edge vignette → a 70-particle starfield. This is what makes every page sit in the same "deep space workshop."
- **`MeshGradient`** — slow-flowing accent color blobs (CSS radial-gradients + `mesh-flow`).
- **`DotField`** — drifting dot grid with radial mask (`dot-drift`).
- **`LineWeave`** — animated SVG wavy lines (circuit-trace feel).
- **`NoiseAura`** — color wash + film-grain (SVG `feTurbulence`).

All four take only `className` and are drop-in interchangeable per section. They read `--accent-*`, so they re-skin with the palette.

---

## Motion

Three sources of animation, used deliberately:

1. **CSS keyframes** (`globals.css`) — the default for loops and entrances; cheapest, GPU-friendly. Catalog in [02-brand-system.md](./02-brand-system.md#keyframe-catalog-defined-in-globalscss).
2. **Framer Motion** — component-level: entrance/stagger (`AnimationWrappers`), the `StarSystem` orbits, `Header`/`Showcase`/`TvFrame` transitions, mobile menus.
3. **GSAP + split-type** — installed for scroll-tied/text-split scenes (per VISION). Verify current usage before assuming a given scene uses it.

**Reusable primitives:** `Reveal` (scroll-into-view fade/translate — the most-used), `MarqueeRow` (infinite scroll), `CountUp` (number animation), `JellyRotateWrapper` (click spin), `StaggerContainer`/`StaggerItem`/`ScaleFadeItem` (Framer entrances). See [11-ui-components.md](./11-ui-components.md).

**Always respect reduced motion.** New looping or large-movement animation must be disabled under `prefers-reduced-motion` — the global CSS handles most cases, but JS-driven motion (rAF loops) must check `window.matchMedia("(prefers-reduced-motion: reduce)")` or `useTheme().reducedMotionEnabled` itself, the way `Reveal`, `CountUp`, and `Cursor` do.
