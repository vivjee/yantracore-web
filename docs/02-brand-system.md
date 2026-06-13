# 02 — Brand System

> Status: **locked.** Crystal palette + General Sans confirmed.

The brand system is the kit of parts every component is built from. If we get this right, the whole site stays coherent even as it grows. All tokens will live as CSS custom properties and Tailwind theme extensions so they're tunable in one place.

### Locked decisions

- **Logo**: provided by user at `public/images/logo/` (SVG + GLB 3D versions present)
- **Light mode**: not building one. Dark is the brand.
- **Color palette**: **Crystal** (Violet `#6E56FF` / Cyan `#00E0CB` / Magenta `#FF4FB0`). Architected as CSS custom properties + Tailwind theme tokens so the entire palette can be swapped in one file.
- **Display font**: **General Sans** (Fontshare, self-hosted). Body: Inter (Google). Mono: JetBrains Mono (Google).

---

## 1. Color

Dark canvas, jewel-bright accents, glass everywhere in between.

### Surface (the canvas)

| Token | Hex | Use |
|---|---|---|
| `--ink-0` | `#06070D` | Page base, behind everything |
| `--ink-1` | `#0A0C16` | Section base when separation needed |
| `--ink-2` | `#11142233` | Subtle elevated surfaces (non-glass) |
| `--ink-edge` | `#1A1E2E` | Hairline dividers, low-contrast borders |

The base is *not* pure black — `#06070D` has a hint of blue so the violet/cyan accents harmonize.

### Glass (the dominant surface)

Glass is built from a layered recipe, not a single color. The recipe:

```css
.glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.06),  /* top hairline */
    0 24px 60px -20px rgba(0, 0, 0, 0.5);       /* drop */
}
```

Three glass variants:
- **`glass-light`** — for floating cards over busy backgrounds. blur 16px, opacity 4%.
- **`glass-medium`** — default card surface. blur 20px, opacity 6%.
- **`glass-heavy`** — for modal/nav surfaces that must obscure. blur 32px, opacity 10%.

### Accent (the jewelry) — swappable

All accent colors live as CSS custom properties under `:root`. Swapping the palette = editing one file (`styles/globals.css`). v1 ships with **Crystal**.

**Crystal — locked for v1:**
| Token | Hex | Role |
|---|---|---|
| `--accent-1` | `#6E56FF` | Primary (violet) |
| `--accent-2` | `#00E0CB` | Secondary (cyan) |
| `--accent-3` | `#FF4FB0` | Tertiary (magenta, used sparingly) |
| `--accent-warm` | `#FFB454` | Warm callouts (amber) — strongest use in Shramdan + Voices |

Two alternate palettes are kept in `styles/palettes.css` (commented out) for easy swap:
- *Atelier* — `#3B82F6` / `#14B8A6` / `#F59E0B` / `#F97316` (deeper, more serious)
- *Hearth* — `#6366F1` / `#34D399` / `#FB7185` / `#FBBF24` (warmer, product-friendly)

**The signature gradient:**
```css
linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 50%, var(--accent-3) 100%)
```
This is the gradient used on animated borders, text gradients on key headlines, and the conic-sweep that becomes our visual signature. It re-skins automatically when the palette swaps.

### Text

| Token | Hex | Use |
|---|---|---|
| `--text-hi` | `#F4F5FA` | Headlines, primary body |
| `--text-mid` | `#B4B9CC` | Secondary body, captions |
| `--text-low` | `#7B8197` | Eyebrow labels, metadata |
| `--text-faint` | `#4B5066` | Disabled, decorative numerals |

---

## 2. Typography

We pair three families. Each has one job; none competes with the others.

### Display — *General Sans* (locked)
For hero headlines and section openers. Geometric, modern, slightly characterful. Self-hosted via Fontshare files in `public/fonts/general-sans/`, loaded with `next/font/local` for zero-FOUT and no external CDN dependency.
- Weights used: 500, 600, 700
- Tracking: tight on display sizes (`-0.02em`), normal at body sizes
- Used at 64px–140px on desktop hero

### Body — *Inter*
For all body copy, UI labels, buttons. The workhorse.
- Weights: 400, 500, 600
- `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` for the cleaner glyph variants
- Used at 14px (UI), 16px (body), 18px (emphasized body), 20–24px (lead paragraphs)

### Mono — *JetBrains Mono*
For technical accents — section numbers (`01 —`), code snippets, metadata, "system labels."
- Weight 400 only
- Used at 12px–14px, uppercase with `letter-spacing: 0.08em`

### Type scale

```
display-xl   140px / 0.95 / -0.03em / 600
display-l     96px / 1.00 / -0.03em / 600
display-m     72px / 1.05 / -0.025em / 600
display-s     56px / 1.08 / -0.02em / 600
heading-l     40px / 1.15 / -0.015em / 600
heading-m     32px / 1.2  / -0.01em / 600
heading-s     24px / 1.3  / -0.005em / 600
body-l        20px / 1.55 / 500
body-m        16px / 1.6  / 400
body-s        14px / 1.6  / 400
label         12px / 1.4  / 0.08em uppercase / 500 (mono)
```

Mobile scales: display sizes shrink by ~40%; body stays the same.

---

## 3. Spacing & Layout

Single 4px base unit. Used scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 200`.

**Container widths:**
- `--container-narrow`: 720px (reading, blog posts)
- `--container-default`: 1200px (most sections)
- `--container-wide`: 1440px (showcase, gallery)
- `--container-full`: 100vw (immersive scenes)

**Section vertical rhythm:** sections get `min-height: 100vh` for cinematic moments, otherwise `padding-block: 160px` desktop / `96px` mobile. Generous breathing room is part of the "expensive" feeling.

**Radii:**
- `--r-sm` 8px (chips, small inputs)
- `--r-md` 16px (buttons, small cards)
- `--r-lg` 24px (default glass cards)
- `--r-xl` 32px (hero cards, large surfaces)
- `--r-full` 9999px (pills, avatars)

---

## 4. Motion Tokens

```
--ease-out-soft:    cubic-bezier(0.22, 1, 0.36, 1)   /* default */
--ease-out-snap:    cubic-bezier(0.16, 1, 0.3, 1)    /* slightly snappier */
--ease-in-out:      cubic-bezier(0.65, 0, 0.35, 1)   /* symmetrical */
--ease-linear:      linear                            /* loops, borders */

--dur-fast:     200ms   /* micro: hover color, focus */
--dur-base:     400ms   /* default: card lifts, fades */
--dur-slow:     700ms   /* section reveals, scroll-tied */
--dur-cinematic: 1200ms /* hero, big transitions */
--dur-loop:     8000ms  /* background patterns, border sweeps */
```

`prefers-reduced-motion`: all non-essential animation collapses to fade-only at 200ms. Looping background animations pause entirely.

---

## 5. The Glass Card System

A single `<GlassCard>` component will be the most-used UI primitive in the site. It must handle:

- Three variants (light / medium / heavy)
- Optional animated border (see below)
- Hover lift (3D tilt + glow)
- Inner content slots (eyebrow / title / body / cta / media)

**Hover behavior (the signature card hover):**
On pointer enter, the card:
1. Lifts: `translateY(-4px)` and a subtle `rotateX/rotateY` tilt based on cursor position (max ±6°), 400ms `--ease-out-soft`.
2. Glows: a soft accent halo appears behind via `box-shadow: 0 24px 80px -20px rgba(110, 86, 255, 0.4)`, 700ms.
3. Border brightens: opacity 0.08 → 0.20, 400ms.
4. A spotlight follows the cursor inside the card (radial gradient mask at cursor position) — this is the "pleasing common card hover" you asked for. Inspired by Linear / Vercel's product cards but warmer.

Single source of truth for this behavior. Every card on the site uses it; we never reinvent.

---

## 6. The Animated Border System

This is the second most-used primitive. Three border styles, all driven by CSS custom properties so they're cheap:

### a) "Conic sweep" — rotating gradient border
```css
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }

.border-sweep::before {
  content: '';
  position: absolute; inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    transparent 0%,
    var(--accent-1) 30%,
    var(--accent-2) 50%,
    var(--accent-3) 70%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: spin var(--dur-loop) linear infinite;
}
@keyframes spin { to { --angle: 360deg; } }
```
Used on: primary CTA, hero cards, featured project tiles.

### b) "Trace" — border that draws itself on scroll into view
SVG path with `stroke-dasharray` animated from 100% → 0% as element enters viewport. Used on: section dividers, the "Forge" process steps, manifesto block.

### c) "Pulse" — soft glowing border, no rotation
For subtle emphasis without commanding attention. Used on: form inputs on focus, secondary cards.

---

## 7. Background Pattern System

Animated backgrounds in specific sections (per your reference to biotz / ptolemay). Four patterns built once, reused:

1. **`<MeshGradient>`** — slow-flowing 4-color gradient blob (R3F shader). Used in hero and AI section.
2. **`<DotField>`** — animated dot grid with parallax depth and mouse-reactive distortion. Used in capabilities and lab.
3. **`<LineWeave>`** — animated SVG lines drawing in slow loops (think circuit traces). Used near process / forge section.
4. **`<NoiseAura>`** — subtle film-grain + slow color wash, no geometry. Used as a soft texture layer beneath glass-heavy sections.

All four implement a common interface so they're drop-in interchangeable per section.

---

## 8. Iconography

- **Stroke icons**, 1.5px stroke weight, `lucide-react` as base library (clean, modern, comprehensive)
- Custom icons where lucide falls short (drawn 24×24, same stroke weight)
- Icons in technical labels use the mono font's "□ ▸ ▹ ◇ ◆" set for variety

---

## 9. Imagery

- No stock photos.
- Project showcases use real product screenshots — composited into the **PhoneFrame** and **BrowserFrame** components (see Hero Concept doc).
- Where decorative imagery is needed, prefer generated abstract textures (you bring from your tools) over photography.
- All imagery clipped/masked with rounded corners matching radii scale.

---

## All brand decisions locked.
