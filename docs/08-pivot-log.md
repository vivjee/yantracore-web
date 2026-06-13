# 08 — Pivot & Decision Log

This log tracks the major architectural shifts, design pivots, and UX sweeps throughout the project lifecycle.

---

## Logged Pivots & UX Sweeps

### 1. Build Sequencing Pivot: Hero-First Checkpoint
- **Context:** Decided to pivot the build roadmap to prioritize the interactive hero scene ("The Machinery") and the primitives playground.
- **Rationale:** Nail the core visual language (glass shaders, light cones, Lissajous orbital card drift) before committing resources to inner pages.

### 2. Header Logo Polish (Glass Capsule)
- **Context:** Upgraded the header logo from a static SVG to a glass-bordered capsule.
- **Rationale:** Integrate the logo into the "glass machinery" thesis of the sitemap and visual language.

### 3. Rounded Square Glass Badge Logo UX Sweep (Current)
- **Context:** Shifted the header logo from a wide horizontal glass pill to a rounded square glass badge, utilizing dynamic border-radii (`rounded-2xl` for desktop, `rounded-xl` for mobile) matching the container aspect ratio. Unified the holographic shimmer sweep overlay to animate continuously over the entire glass backing card.
- **Rationale:** Standardize branding to a clean, modern rounded square lens, creating a single unified shimmering visual badge while keeping the layout flat for navigation readability.

### 4. Subtle Animation Tempo Sweep (Current)
- **Context:** Slowed down the AI Activity bar chart equalizer animation speeds by ~3.5 times.
- **Rationale:** Align all active page animations with a calmer, subtler motion design system. Slower and organic wave movement creates a more premium, confident look.
