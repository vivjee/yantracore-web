# 08 — Pivot & Decision Log

> **Layer: REFERENCE.** Append-only history of major architectural shifts, design pivots, and UX sweeps. Newest meaningful decisions go at the bottom.

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

### 5. Scope Pivot: from static brochure to a full app
- **Context:** The project grew beyond the planned static marketing site into a two-surface app — a marketing **brochure** *and* an authenticated **console** (`DashboardShell`) wired to the YantraMate AI backend (RAG/Ask, IMAP email chat, Google Drive sync, projects), plus auth, music, channels, an entryport globe, and a technologies visualization.
- **Rationale:** YantraCore's actual needs outgrew a brochure; the site became a working product surface and an internal tool, not just a sales page.
- **Impact:** Added `app/api/*` proxy routes + `lib/api/yantramate.ts`; auth surfaces (currently demo-grade). The original "v1 fully static" assumption no longer holds.

### 6. Neumorphic glass replaces frosted glass
- **Context:** The `.glass-*` surfaces were reimplemented as **neumorphic** (solid ink fill + paired light/dark shadows, `backdrop-filter` disabled) instead of the originally specced frosted blur.
- **Rationale:** A more tactile, console-like surface language that fits the CRT/TV direction and performs better than heavy backdrop blur.

### 7. Runtime theming system
- **Context:** Replaced "dark-only, one locked palette, swap via one CSS file" with a runtime `ThemeProvider`: **5 palettes**, light/dark mode, **5 font styles**, **3 cursor styles**, reduced-motion + logo-heartbeat toggles — all persisted to `localStorage`.
- **Rationale:** Make the design system a feature users (and the team) can drive live; demonstrates the "machinery you can operate" thesis.

### 8. The CRT "TV" shell
- **Context:** Introduced `TvFrame` — a retro-CRT television app shell (power state, scanlines, glitch-on-navigate, console tabs, synth sounds) that wraps most pages.
- **Rationale:** A distinctive, ownable chrome that frames both brochure and console as one "device."

### 9. Lenis disabled; i18n deferred
- **Context:** `SmoothScrollProvider` became a passthrough (native scroll); `next-intl` remained installed but unwired (no `[locale]` routes/middleware).
- **Rationale:** Both were deprioritized as the app surface took over. Flagged as decisions to revisit in [06-roadmap.md](./06-roadmap.md).

### 10. Documentation reconciliation (2026-06-15)
- **Context:** The docs had drifted far from the code. Reconciled the whole set into two labeled layers — **VISION** (north star) and **REFERENCE** (ground truth) — and added `00-overview`, `10-systems`, `11-ui-components`, `12-app-api`, plus a root `AGENTS.md`.
- **Rationale:** Make `docs/` the single source of truth for humans and coding agents going forward, and stop the drift by requiring REFERENCE docs to be updated alongside behavior changes. Also formalized the commit policy (commit on every medium-to-major change).
