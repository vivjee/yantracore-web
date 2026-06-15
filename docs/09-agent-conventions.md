# Agent Conventions — Yantra Web

> **Layer: REFERENCE.** The conventions every coding agent (Claude, Antigravity, Copilot, Cursor, etc.) must follow in this codebase. The repo-root [`AGENTS.md`](../AGENTS.md) is the short entry point; this is the full version.

## 0. Start here: docs are the source of truth

Before non-trivial work, read [`docs/00-overview.md`](./00-overview.md) and the relevant **REFERENCE** doc. Docs are split into **VISION** (north-star aspiration) and **REFERENCE** (what is actually built). **Trust REFERENCE for facts; never trust a VISION doc for current behavior.**

When you change behavior — tokens, routes, component props, a system — **update the matching REFERENCE doc in the same change**. The doc set was just reconciled after heavy drift; do not let it drift again. Key REFERENCE docs: `00-overview`, `02-brand-system`, `05-tech-architecture`, `10-systems`, `11-ui-components`, `12-app-api`, `06-roadmap`.

---

## 1. Git Commit Policy

**Commit after every medium-to-major unit of work — do not batch large changes or leave significant work uncommitted.** Only truly trivial changes may skip a commit. This was reaffirmed directly by the user.

### What counts as a "significant" change?
- Adding or removing a page (`app/*/page.tsx`)
- Adding or significantly modifying a component
- Updating global styles, theme tokens, or design system
- Adding or removing a dependency (`package.json`)
- Updating navigation, layout, or routing
- Adding new assets (logos, images, audio)
- Any refactor that touches more than one file

### What does NOT need a commit?
- Fixing a single typo or wording
- A single-line style tweak
- Intermediate/WIP states within a single session task

### Commit message format
Use Conventional Commits style:

```
<type>(<scope>): <short description>

[optional body]
```

Types:
- `feat`     — New feature, page, or component
- `fix`      — Bug fix
- `refactor` — Code restructuring without behavior change
- `style`    — CSS/visual-only changes
- `chore`    — Dependency updates, config, gitignore, tooling
- `docs`     — Documentation changes
- `remove`   — Deleting files or features

Scope (optional but encouraged): the area of the app
e.g. music, nav, homepage, logo, auth, technologies

Examples:
  feat(technologies): add stellar system visualization page
  refactor(nav): update header links and remove intercom toggle
  style(homepage): reorder showcase layout, move tagline above logo
  remove(stats): delete live stats page
  chore(logo): replace old SVGs with updated brand assets
  feat(music): add meadow-sleepwalk track and nature sounds mixing

### How to commit
After completing a meaningful task, run:

  git add -A
  git commit -m "feat(scope): description"

Or stage specific files if only part of the work is complete:

  git add path/to/changed/file
  git commit -m "feat(scope): description"

---

## 2. Branching

- All agent work happens on the current branch (usually `main` or the feature branch the user is on).
- Do NOT create new branches unless explicitly instructed by the user.

---

## 3. Do NOT commit

- `.env`, `.env.local`, or any secrets
- `node_modules/`
- `.next/` build output
- `temp_ffmpeg/` or other temp directories
- `next-dev.log`, `next-dev.err.log`
- One-off utility scripts like `modify_tv.py` (these are in `.gitignore`)

---

## 4. File Hygiene

- Clean up temporary files before committing.
- If you create scratch files for debugging, remove them before the commit.
- Keep `docs/` updated if you add or remove major features.

---

## 5. Design & code conventions

These keep the runtime design system working. See [02-brand-system.md](./02-brand-system.md) and [10-systems.md](./10-systems.md) for the full rationale.

- **Never hardcode an accent color.** Use the CSS variables `var(--accent-1..3)` / `--accent-warm` (or Tailwind `accent-1` etc.), and `color-mix()` for translucency. Hardcoded hexes break palette switching.
- **Use semantic font classes** (`font-display` / `font-body` / `font-mono`), never a specific family name — or the font-style switcher breaks.
- **Use the design tokens** for ink/text colors, radii, motion durations, and the `.glass-*` / neumorphic shadow classes rather than inventing new values.
- **Respect reduced motion.** Global CSS handles most cases, but JS/rAF-driven animation must check `prefers-reduced-motion` (or `useTheme().reducedMotionEnabled`) itself.
- **Prefer existing primitives** (`GlassCard`, `GlassButton`, `Reveal`, `Container`, `Eyebrow`, …) over re-rolling. See [11-ui-components.md](./11-ui-components.md).
- **Imports use the `@/` alias** (repo root), e.g. `@/lib/utils/cn`.
- **Client vs. server:** add `"use client"` only when a component needs state/effects/browser APIs; keep purely presentational components as server components.
- **Backend calls:** prefer the `app/api/*` proxy path over the direct browser SDK so secrets can move server-side later. See [12-app-api.md](./12-app-api.md).
- **TypeScript is strict.** No `any` escapes without reason; type new props/data shapes.

## 6. Keep the docs in sync

When your change affects any of these, update the matching REFERENCE doc **in the same commit**:

| You changed… | Update… |
|---|---|
| Design tokens / glass / palettes / fonts / cursor (`globals.css`, `palettes.ts`) | `02-brand-system.md` |
| A reusable component's props/behavior | `11-ui-components.md` |
| A system (theme/audio/TV/cursor/bg/motion) | `10-systems.md` |
| A route / page added or removed | `03-sitemap.md` (+ `00-overview.md` tour if notable) |
| An `app/api/*` route | `12-app-api.md` (+ `07-api-reference.md` if the backend contract moved) |
| Stack/structure/build | `05-tech-architecture.md` |
| Finished or started significant work | `06-roadmap.md` (check off / add the item) |
| A material architectural/design decision | add an entry to `08-pivot-log.md` |

## 7. Summary

> **Default rule**: When in doubt — commit, and keep the docs true. A clean git
> history plus accurate REFERENCE docs let the user (and the next agent) trust
> the project. Small, focused commits with clear messages beat one massive commit;
> a doc update alongside the code beats a doc that drifts.
