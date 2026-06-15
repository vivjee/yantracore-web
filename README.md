# YantraCore Web

The Next.js application behind **yantracore.com** — a marketing **brochure** and an authenticated **console** sharing one retro-CRT shell and a runtime-themeable design system.

> **Apps that solve real-world problems — AI enabled.**
> *YantraCore reveals the machinery that moves modern business — and the site itself demonstrates that craft.*

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

The AI/console features call the external **YantraMate** backend (RAG over Drive, IMAP email chat, projects). Run it locally on `:3011` or point the env vars below at a remote instance.

Scripts: `pnpm dev` · `pnpm build` · `pnpm start` · `pnpm lint`. Package manager: **pnpm**.

### Environment (`.env.local`)

| Variable | Used by | Default |
|---|---|---|
| `YANTRAMATE_API_URL` | `app/api/*` server proxies | `http://localhost:3011` |
| `NEXT_PUBLIC_YANTRAMATE_API_URL` | browser SDK (`lib/api/yantramate.ts`) | devtunnel URL |
| `NEXT_PUBLIC_SITE_URL` | metadata / canonical | `http://localhost:3000` |

## What's inside

- **Brochure:** `/` (homepage), `/contact`, `/music`, `/entryport` (3D globe), `/technologies`, `/channels/[slug]`.
- **Console:** `/login`, `/signup`, `/dashboard` (Ask AI · Email · Drive · Projects), `/settings`.
- **Design system:** all tokens, glass surfaces, palettes, and animations live in `app/globals.css`; theming is runtime via `lib/theme/`.

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · GSAP · three / React Three Fiber · Zod. See [docs/05-tech-architecture.md](./docs/05-tech-architecture.md).

## Documentation

**`docs/` is the source of truth.** Start at **[docs/00-overview.md](./docs/00-overview.md)**, then the [docs index](./docs/README.md). Docs are labeled **VISION** (north star) or **REFERENCE** (what's built) — trust REFERENCE for facts.

## Contributing / working in this repo

Read **[AGENTS.md](./AGENTS.md)** (applies to humans and AI agents alike). In short: commit on every medium-to-major change, keep REFERENCE docs in sync with your code, never hardcode accent colors, and prefer the existing primitives.
