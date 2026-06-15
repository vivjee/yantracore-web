# AGENTS.md — yantra-web

Entry point for any coding agent (Claude, Antigravity, Copilot, Cursor, …) working in this repo. Read this first, then the docs it points to. **`docs/` is the source of truth.**

## What this is

`yantra-web` is the Next.js app behind **yantracore.com**. It is two surfaces in one shell:

- **Brochure** — the public marketing site (homepage, contact, music, entryport globe, technologies, channels).
- **Console** — an authenticated app (`/dashboard`) wired to the **YantraMate** AI backend (RAG/Ask over Google Drive, IMAP email chat, projects).

Everything renders inside a retro-CRT `TvFrame` shell and a runtime-themeable design system. Full picture: **[docs/00-overview.md](./docs/00-overview.md)**.

## Before you start

1. Read [docs/00-overview.md](./docs/00-overview.md), then the relevant REFERENCE doc.
2. Docs come in two layers: **VISION** (aspiration) and **REFERENCE** (what's built). **Trust REFERENCE for facts; never trust VISION for current behavior.**
3. Key REFERENCE docs:
   - [02-brand-system.md](./docs/02-brand-system.md) — design tokens, palettes, fonts, glass/cursor/CRT
   - [05-tech-architecture.md](./docs/05-tech-architecture.md) — stack, structure, data flow, auth state
   - [10-systems.md](./docs/10-systems.md) — theme, audio, TV shell, cursor, backgrounds, motion
   - [11-ui-components.md](./docs/11-ui-components.md) — component props & variants
   - [12-app-api.md](./docs/12-app-api.md) + [07-api-reference.md](./docs/07-api-reference.md) — the API
   - [06-roadmap.md](./docs/06-roadmap.md) — status & backlog
   - [09-agent-conventions.md](./docs/09-agent-conventions.md) — the full convention set

## The rules (non-negotiable)

- **Commit on every medium-to-major unit of work.** Only truly trivial changes skip a commit. Use Conventional Commits (`feat`/`fix`/`refactor`/`style`/`chore`/`docs`/`remove` + scope). Don't create branches unless asked. Never commit secrets, `node_modules/`, `.next/`, or temp files.
- **Keep docs true.** When you change tokens, routes, component props, or a system, update the matching REFERENCE doc **in the same commit**. (Mapping table in [09-agent-conventions.md §6](./docs/09-agent-conventions.md).)
- **Never hardcode accent colors** — use `var(--accent-1..3)` / `--accent-warm` (or `accent-*` Tailwind classes). **Use semantic font classes** (`font-display`/`font-body`/`font-mono`), never a family name. Both are required for the runtime theme switcher to work.
- **Respect `prefers-reduced-motion`** in any JS-driven animation.
- **Prefer existing primitives** (`GlassCard`, `GlassButton`, `Reveal`, `Container`, `Eyebrow`, …) over rebuilding.
- **Imports use `@/`** (repo root). **TypeScript is strict.**

## Quick reference

```bash
pnpm install
pnpm dev      # http://localhost:3000   (needs YantraMate backend on :3011 for AI features)
pnpm build
pnpm lint
```

- Package manager: **pnpm** (don't add npm/yarn lockfiles).
- Design system & all CSS tokens/animations: `app/globals.css`.
- Theming: `lib/theme/` (`ThemeProvider` + `palettes.ts`).
- Env: `YANTRAMATE_API_URL` (server proxy), `NEXT_PUBLIC_YANTRAMATE_API_URL` (browser SDK), `NEXT_PUBLIC_SITE_URL`.
- Auth is **demo-grade** (sessionStorage) — not production; don't assume routes are protected.
