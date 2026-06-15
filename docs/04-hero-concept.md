# 04 — Hero Concept: "The Machinery"

> **Layer: VISION.** This is the storyboard for an aspirational hero (3D logo + orbital cards assembling on scroll). **It is not the current live hero.** The homepage today renders the `Showcase` "solar-system" scene (`components/sections/01-arrival/Showcase.tsx`) inside `TvFrame` — a 2D animated `LogoMark` with orbiting product cards, not the scroll-assembled R3F scene below. Keep this as the target if/when the hero is rebuilt; see [06-roadmap.md](./06-roadmap.md).

The hero is the most expensive 800px of pixels on the internet. Every decision below is in service of one outcome: a first-time visitor watches the scene play out, scrolls once, and thinks *I want to see what this studio can do.*

---

## The 10-second elevator pitch of the scene

> A dark space. A 3D YantraCore logo turns slowly in the center, lit from below by violet and cyan volumetric light. Around it, six glass cards orbit at different depths — each a fragment of what YantraCore does: a phone running an app, a code window, an AI chart, a database schema, a deployment dashboard, a design layer. They drift gently. Animated borders ink themselves into existence along the frames of each card. As you begin to scroll, the cards stop drifting and begin **assembling** — they curve in toward the logo, snap into formation, their borders flash brighter, and the headline crystallizes through the haze: *"The mechanisms that move modern business."*

That's the scene. Everything below is how we build it.

---

## Scene Composition

### The canvas
- Full viewport, edge-to-edge, deep ink background (`--ink-0`)
- A `<MeshGradient>` shader fills the back layer — a slow 4-color flow (violet → cyan → magenta → deep blue) with low contrast (~15% lightness range), creating depth without distraction
- Two soft volumetric light cones beneath the logo, drawn in WebGL — one violet, one cyan, slightly overlapping (so the center where they meet is white-hot)
- Optional film grain overlay (very subtle, 3% opacity) to unify the WebGL with the HTML layers

### The 3D logo (centerpiece)
- You provide the YantraCore logo as a GLB/GLTF from Spline or Blender (I'll spec exact requirements below)
- Material: dark glass with a subtle iridescent fresnel — picks up the ambient light, refracts violet/cyan
- Rotation: slow, continuous, ~12 seconds per full revolution on the Y axis, with a tiny ±3° tilt oscillation on X
- Position: dead center horizontally, ~55% vertically (slightly above middle to leave room for headline)
- Scale: ~45% of viewport height
- Lighting: 3-point — soft key from below-front (violet), rim from back-right (cyan), fill from above (white at 5%)
- Subtle floating animation: ±20px vertical sine wave, 8s period

### The orbital glass cards (6 total)
Each card is a glass surface with content, positioned in 3D space around the logo at varying depths.

Now that we know YC's actual portfolio, here's the **updated working set** (final choice pending chat question D1):

| Card | Content | Approx. depth |
|---|---|---|
| 1 | **Jimbo** — phone mockup with looping AI chat in WhatsApp/Instagram UI | Front-left |
| 2 | **Restroverse** — phone or browser composite showing the hospitality listing/search | Mid-right |
| 3 | **Shramdan** — a community moment (photo with subtle motion) | Far-back-left |
| 4 | **Code** — editor window with syntax-highlighted snippet from real YC work | Mid-left |
| 5 | **AI activity** — animated particle network / graph (visual proof of AI craft) | Front-right |
| 6 | **Client marks** — slow rotating arc of client/tech logos (Shopify, AWS, WP, etc.) | Far-back-right |

**Card properties:**
- Glass-medium variant
- Animated **conic sweep border** on each, with staggered start angles (so they're not all in sync)
- Soft glow halo behind each (violet for some, cyan for others — alternating)
- Drift animation: each card has a unique slow Lissajous-curve drift (±30px in X, ±15px in Y, with rotation ±4°), 12–20s per cycle, all offset so they never align
- Parallax: cards translate based on mouse position (deeper cards move less; near cards move more — classic parallax math)

### The headline (foreground type)
- Sits *behind* the logo, partially obscured by it — implies the logo is the lens through which the message is read
- Font: General Sans, weight 600, 140px on desktop
- Color: starts at low opacity (`--text-mid` at 40%) with a slight blur, sharpens and brightens as scroll begins
- Two lines: *"The mechanisms"* / *"that move modern business."*
- A small uppercase mono eyebrow above: *"01 — ARRIVAL"*
- A 14px sub line beneath, single sentence: *"YantraCore engineers software, AI, and infrastructure for ambitious companies."*

### CTAs (two, side by side)
- **Primary** — *"Begin the tour"* — glass button with animated conic-sweep border (loud). On click: smooth scroll (Lenis) to chapter 02.
- **Secondary** — *"Start a project"* — quieter glass button without the conic sweep (or with a gentler pulse border). On click: jumps directly to chapter 09 (Signal) for visitors ready to convert immediately.
- Both lift 2px on hover; primary additionally accelerates its border sweep and intensifies halo.

### Top navigation
- Sticky glass-heavy nav bar at top
- Logomark left, capability links center, "Signal" CTA right (mini animated border)
- On scroll, condenses height and increases backdrop blur (the typical "becomes more solid on scroll" effect)

---

## The Scroll Choreography (the "wow")

This is the moment that earns the section. Pin the hero for ~150vh of scroll. As `scrollProgress` goes 0 → 1:

| Progress | What happens |
|---|---|
| 0.00 | Idle state. Cards drift in Lissajous loops. Logo rotates calmly. Headline soft & blurred. |
| 0.00 → 0.30 | Cards' drift damps to zero. Headline blur → 0, opacity → 1. Mesh gradient brightens slightly. |
| 0.30 → 0.65 | Cards curve in from their orbits along Bézier paths, **assembling** into a tight formation framing the logo. Conic borders accelerate (8s → 2s per revolution). Volumetric light cones brighten. |
| 0.65 → 0.85 | Brief hold: full formation, everything pulses softly (1 beat). Sub-line and CTA fade in. |
| 0.85 → 1.00 | Hero releases pin; user scrolls past into chapter 02 (Manifesto). As they leave, the formation gently scatters back to gentle drift in the background, so the hero remains alive behind the next section's content via a `position: sticky` ghost layer (or via the chapter 02 having a transparent backdrop that lets the hero scene continue below).

**Important constraint:** never trap the user. The pin lasts ~150vh of *scroll input*, not *time*. They control the pacing entirely. If they flick past quickly, the whole choreography compresses; if they scroll slowly, it plays out leisurely.

---

## Mouse Interactions

- **Parallax on cards** — translate cards opposite to cursor by `±20px` scaled by inverse depth
- **Logo gaze** — logo subtly rotates toward cursor (max ±8°), with damped easing
- **Cursor itself** — custom cursor: a small dot + larger trailing ring. On hover over glass elements, the ring expands and fills with the signature gradient at 20% opacity. (Hidden on touch.)

---

## Mobile Hero

The pin/scroll-choreography is desktop-only. On mobile, the same scene becomes:
- Full-bleed `<MeshGradient>` background
- 3D logo centered, scaled to ~30% viewport height, same rotation
- 3 orbital cards (not 6) stacked semi-overlapping below the logo
- Headline below the cards, full-width
- CTA pinned with safe-area padding
- All cards still have animated borders, glass surface, hover (which becomes "tap = lift" on touch)
- No scroll hijack at all on touch devices

This is non-negotiable: mobile gets a *different composition*, not a broken desktop layout.

---

## Reduced Motion Variant

With `prefers-reduced-motion: reduce`:
- Logo: still rotates (slow rotation is OK; it's not vestibular)
- Cards: do not drift, do not parallax — sit static in their final formation
- Background mesh: pauses (becomes a static gradient snapshot)
- Animated borders: become static gradient borders (no rotation)
- Scroll choreography: collapses to a 700ms fade-in of cards + headline; no pinning

---

## Performance Budget

Hero is the heaviest section. Target on mid-tier mobile (Pixel 6a class):
- LCP (first paint of "The mechanisms…" headline): **under 2.0s**
- Total JS for above-the-fold: **under 180KB gzipped**
- WebGL frame rate: **steady 60fps** on M1 Mac / iPhone 13+; **graceful 30fps** floor on older devices (we measure and downgrade quality dynamically)

Techniques used to hit this:
- Static HTML for headline + CTA renders first; canvas mounts after
- 3D logo lazy-loaded; first paint uses a 2D placeholder
- Mesh gradient shader uses a low-poly mesh (12×12 grid) — looks identical, costs nothing
- Cards' "phone mockup video" uses a poster image until scroll starts; video begins on user intent
- DPR clamped to `min(devicePixelRatio, 2)` in WebGL to avoid 4K canvas explosions

---

## Asset Spec — What I Need You to Provide

When you're ready to bring the 3D logo into the build, please export it like this:

**File format:** `.glb` (GLTF binary), Draco-compressed if possible
**Polygons:** under 50,000 triangles
**Textures:** baked into the GLB, 2048×2048 max, KTX2 compressed if available
**Materials:** PBR (metallic/roughness)
**Origin:** centered at world origin (0,0,0)
**Forward axis:** +Z, up axis: +Y (Three.js conventions)
**Scale:** unit scale (1 unit ≈ 1 meter; I'll scale at runtime)
**Animations:** none baked in (we drive rotation/float from code)

Spline can export directly to this. From Blender: File → Export → glTF 2.0 with Draco compression enabled. Send me one test export early so I can validate before we polish.

**For the orbital cards' content (updated for real products):**
- Card 1 (Jimbo): MP4 video loop of a Jimbo conversation in WhatsApp/Instagram UI (~5s, seamless, 1080×2340 portrait, under 4MB). If a recording doesn't exist yet, I can mock up a believable conversation in code as a fallback for v1.
- Card 2 (Restroverse): PNG/MP4 of the Restroverse listing+search UI. If the product isn't built yet, you can provide the figma export and I'll integrate.
- Card 3 (Shramdan): one photo from a real community work moment (JPG/PNG, ~2000×2000, under 1.5MB). If no photo available, this card swaps to a procedural visual placeholder.
- Card 4 (code): generated procedurally — no asset needed.
- Card 5 (AI activity): generated procedurally (WebGL particle graph) — no asset needed.
- Card 6 (client marks): SVG client/tech logos at white-on-transparent. Provide ~6–12 of them.

---

## Implementation Order

Once we start building:
1. Static skeleton: nav, headline, CTA, dark canvas (validates layout, no motion)
2. Mesh gradient background shader (R3F)
3. Volumetric light cones (R3F)
4. 3D logo with placeholder geometry → swap in your GLB when ready
5. Glass card primitive (one card, perfected)
6. Multiply to 6 orbital cards with Lissajous drift
7. Mouse parallax + logo gaze
8. Animated borders (conic sweep)
9. Scroll-pinned choreography (GSAP)
10. Mobile variant
11. Reduced-motion variant
12. Performance pass

Steps 1–4 give us a first impressive draft within the first build sprint. Steps 5–9 push it into "wow" territory. Steps 10–12 are non-negotiable polish.

---

## All hero decisions locked.
