# 10 — Systems (Reference)

> **Layer: REFERENCE** — the cross-cutting systems that the whole app depends on. If a component behaves "magically," the explanation is usually here.

Seven systems: **Theme**, **Audio**, **TV/CRT shell**, **Keyboard shortcuts**, **Cursor**, **Backgrounds**, **Motion**. Each is small and self-contained; together they define the app's feel.

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
A full ambient-music engine behind the `/music` page, exposed via `useAudioPlayer()`. Mounted in the root layout so playback persists across navigation. It wraps a hidden `<audio>` element plus a Web-Audio graph (AnalyserNode for the visualizer, 3-band BiquadFilter EQ, a delay node for echo, oscillator drones, and procedural texture layers for rain/wind/hum). These texture layers are surfaced in the **Remix** tab (formerly "Nature") of the deck console: rain is band-limited **pink** noise with a slow cutoff drift, wind is **brown** noise through a low-Q band with gust LFOs on cutoff and amplitude, and hum is a detuned 60 Hz harmonic stack with a faint tremolo. Each layer's volume is user-controlled (`rainVol/windVol/humVol`); modulation is kept off those user gains so a slider at 0 is truly silent.

Capabilities: playlist (5 bundled lofi/ambient tracks in `public/music/`; the canonical list is the `TRACKS` array in `AudioPlayerContext.tsx`), play/pause/next/prev, seek, volume/mute, repeat (`none`/`one`/`all`), shuffle, a synth-only fallback when streaming fails, 3-band EQ (`eqBass/Mid/Treble`), ambient layer volumes (`echoVol/rainVol/windVol/humVol`), custom-track loading (`addCustomTrack`), and a `logs` activity array. `addCustomTrack` and `logs` remain in the context but are no longer surfaced in the `/music` page — the upload / stream-URL inputs and the decoder-log console were removed; the right column now holds only the search box and the (expanded) music library.

---

## TV/CRT shell

**File:** [`components/layout/TvFrame.tsx`](../components/layout/TvFrame.tsx). Styles: the `.tv-*` / `.crt-*` classes in `globals.css`.

`TvFrame` is the app's signature chrome — a retro CRT television that wraps page content. Nesting: `.tv-frame-outer` → `.tv-frame-bezel` → `.tv-screen-glass` → `.tv-screen-content`. Responsibilities:

- **Power state** — boot/shutdown animation with synth sounds (`isPowered`, `isPoweringOn`).
- **CRT overlays** — optional scanlines / phosphor flicker / curvature / distortion filter, toggled by `isCrtEnabled` (adds `.crt-active`).
- **Power-on static burst** — a brief CRT static overlay (`isGlitching`) flashes only as the screen re-ignites on power-on. Navigation between pages is seamless: there is **no** channel-change glitch (it was removed site-wide).
- **Top chrome bar** (`.tv-chrome-bar`) — logo + wordmark, the page-nav group (Home / Projects / Technologies / Reach / Contact), and utility buttons (theme, Music, Settings, account, fullscreen). On phones (`<md`) the page-nav group is hidden here (`.tv-chrome-nav-pages`) and moves to the bottom tab bar; utilities stay.
- **Mobile bottom tab bar** (`.tv-bottom-nav`, the `TvBottomNav` helper) — on `<md`, the five page destinations render as a thumb-reachable bottom tab bar, a flex sibling **below** `.tv-screen-content` so it never overlaps page content. Hidden from `md` up.
- **Slim adaptive frame** — below `md` the bezel padding/border thin out; the frame is `100dvh`. (The `.tv-console-*` "console tab" panel styles in `globals.css` are **legacy/unused** — the live nav is the chrome bar + bottom tab bar.)
- **Body locks** — `body.app-mode-active` (lock scroll → `100dvh`, hide global header) vs. `body.brochure-mode-active`.

Pages opt in by composing `<TvFrame>{children}</TvFrame>`. Several components also render "inside the TV" via an `inTv` prop (`LoginForm`, `SignupForm`, `SettingsShell`, `Showcase`) so they adapt padding/background.

---

## Responsive & viewport

The tablet/mobile foundation. **Prefer Tailwind breakpoints in markup; reach for the JS hooks only when a layout must branch in JavaScript.**

- **Hooks** — [`lib/hooks/useMediaQuery.ts`](../lib/hooks/useMediaQuery.ts): `useMediaQuery(query)` (SSR-safe via `useSyncExternalStore`, like `useFullscreen`), `useBreakpoint()` → `{ isMobile, isTablet, isDesktop, isCompact }`, `useMinWidth`/`useMaxWidth(bp)`, and `useIsTouch()` (`(pointer: coarse)` — gate hover/parallax affordances).
- **Breakpoints** — Tailwind defaults (`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`) plus custom **`xs ≈ 400`** (registered in `globals.css` via `--breakpoint-xs`; gives `xs:` and `max-xs:`). Semantic bands: mobile ≤640 · tablet 640–1023 · desktop ≥1024. Chrome CSS media queries use the `md` boundary (`767.98px`) so CSS and JS agree.
- **Viewport height** — full-bleed shells use `dvh`/`svh`, never `vh`, so the mobile address-bar show/hide doesn't clip content. `app/layout.tsx` exports `viewport` with `viewportFit: "cover"`; `body.app-mode-active` is `100dvh`.
- **Safe areas** — `--safe-{top,right,bottom,left}` (= `env(safe-area-inset-*)`) + `.{pt,pr,pb,pl,px,py}-safe` utilities reclaim notch / home-indicator space on fixed UI (TV bottom nav, dock).
- **Type & touch** — `.text-fluid-{display,h1,h2,h3,lead}` are `clamp()` ramps that scale smoothly (no abrupt `text-4xl→text-6xl` jumps); `.tap-target` guarantees a ≥44px hit-area on coarse pointers **without** changing a control's visual size.
- **Signature scenes** — phones get clean simplified layouts (Home's 2×2 node grid, Showcase's card scene). The desktop solar-system + rings scale down for the tablet/small-laptop bands (`.showcase-solar`, `.orbital-rings` mirror `.orbital-sun`) with the full spectacle returning at `xl`. The `/activity` globe and `/channels` panels **scroll within the height-locked TV screen** below their multi-column breakpoint (the screen itself never scrolls). The dashboard rail becomes an off-canvas drawer below `lg`.

---

## Off-page music controls

**Files:** [`components/chrome/NowPlayingDock.tsx`](../components/chrome/NowPlayingDock.tsx), [`components/chrome/MusicMiniControls.tsx`](../components/chrome/MusicMiniControls.tsx), [`lib/hooks/useAppMode.ts`](../lib/hooks/useAppMode.ts), plus the `TvMusicDot` / `TvInlineControls` helpers in [`TvFrame.tsx`](../components/layout/TvFrame.tsx).

Music plays globally (the `<audio>` element + `AudioPlayerProvider` live in the root layout), so playback persists across navigation. These surfaces let listeners see and control it without returning to `/music`, choosing the right surface per mode via `useAppMode()` (reads `body.app-mode-active`):

- **App-mode pages (TV chrome):** `TvInlineControls` adds prev / play-pause / next inline in the chrome bar once a session is live (`isPlaying || currentTime > 0`); hidden below `sm`, track title from `lg+`. `TvMusicDot` badges a pulsing `.signal-dot` on the Music Lab button while playing. Both are isolated `useAudioPlayer` subscribers, so live `currentTime` ticks don't re-render the whole frame.
- **Brochure pages:** `NowPlayingDock` — a floating bottom-right glass mini-player (status dot, track title, progress, transport, link to the console). Mounted once in the root layout; auto-hides on app-mode pages and on `/music`. Respects reduced motion; dismissible (re-arms when the track changes or the session resets).

`MusicMiniControls` is the shared prev / play-pause / next transport both surfaces reuse (`variant="inline" | "dock"`).

---

## Keyboard shortcuts

**Files:** [`lib/shortcuts/shortcuts.ts`](../lib/shortcuts/shortcuts.ts) (registry), [`lib/shortcuts/ShortcutsProvider.tsx`](../lib/shortcuts/ShortcutsProvider.tsx) (engine), [`lib/hooks/useFullscreen.ts`](../lib/hooks/useFullscreen.ts), [`components/chrome/KeyHint.tsx`](../components/chrome/KeyHint.tsx) (on-button badges), [`components/chrome/ShortcutHelp.tsx`](../components/chrome/ShortcutHelp.tsx) (`?` cheat sheet).

`shortcuts.ts` is the **single source of truth** — a flat `SHORTCUTS` array of `{ id, key, display, label, group }`. The engine, the tooltip/button hints, and the cheat sheet all read from it, so adding a shortcut is one entry here plus one handler in the provider's `switch`.

`ShortcutsProvider` is mounted in the root layout *inside* `ThemeProvider` + `AudioPlayerProvider` (so its handlers can use `useRouter`, `useAudioPlayer`, `useTheme`, `useFullscreen`). It attaches **one** `window` keydown listener that:
- ignores keystrokes while typing (input / textarea / select / contentEditable);
- ignores any combo with `Ctrl`/`Cmd`/`Alt` (never overrides browser/OS shortcuts);
- matches the literal `e.key` against the registry — `Shift`+letter yields an uppercase key (`"H"`), and `?`/`>`/`<` are already shifted, so no modifier bookkeeping is needed;
- on match: `preventDefault`, `audioSynth.playClick()`, run the handler.

### Bindings
| Key | Action | | Key | Action |
|---|---|---|---|---|
| `F` | Fullscreen | | `⇧H` | Home |
| `?` | Cheat sheet (Esc closes) | | `⇧R` | Reach (`/reach`) |
| `⇧P` | Play / Pause | | `⇧T` | Technologies |
| `⟩` (`⇧.`) | Next track | | `⇧M` | Music Lab |
| `⟨` (`⇧,`) | Previous track | | `⇧C` | Contact |
| `⇧X` | Mute / Unmute | | `⇧S` | Settings |
| `⇧D` | Toggle theme | | `⇧A` | Account (`/dashboard` or `/login`) |
| `⇧Q` | TV power | | | |

### Notes
- **Fullscreen** lives in `useFullscreen()`, shared by the chrome button and the `F` key (one implementation, no duplication). The chrome button keeps its `isPowered` gate; the `F` key works regardless (fullscreen is OS-level).
- **TV power** state is page-local to `TvFrame`, so `⇧Q` dispatches a `POWER_TOGGLE_EVENT` (`"yantra:toggle-power"`) window event that the mounted `TvFrame` listens for.
- **Hints on buttons:** `KeyHint` renders a small `.kbd-hint` badge from the registry, shown inside the `.tooltip` that reveals on hover — for both icon-only and labeled chrome buttons (labeled buttons stay static; only the tooltip appears). The music player uses native `title` text. All hints hide under `@media (pointer: coarse)` (no keyboard, no point).

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

**Reusable primitives:** `Reveal` (scroll-into-view fade/translate — the most-used), `Rise` (mount-time fade/translate — the on-load sibling of `Reveal`; give a screenful of items increasing `delay`s for a staggered entrance, as Home / Reach / Contact do), `MarqueeRow` (infinite scroll), `CountUp` (number animation), `JellyRotateWrapper` (click spin), `StaggerContainer`/`StaggerItem`/`ScaleFadeItem` (Framer entrances). See [11-ui-components.md](./11-ui-components.md).

**Always respect reduced motion.** New looping or large-movement animation must be disabled under `prefers-reduced-motion` — the global CSS handles most cases, but JS-driven motion (rAF loops) must check `window.matchMedia("(prefers-reduced-motion: reduce)")` or `useTheme().reducedMotionEnabled` itself, the way `Reveal`, `CountUp`, and `Cursor` do.
