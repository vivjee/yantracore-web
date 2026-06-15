# YantraCore Web — Documentation

**This `docs/` set is the source of truth for the project**, for humans and coding agents alike. If you're starting fresh, read **[00-overview.md](./00-overview.md)** first.

## The thesis (one line)

> Dark workshop. Glass machinery. Scroll is the dial. Slow, confident, alive.

### Philosophy

> **Apps that solve real-world problems — AI enabled.**

YantraCore reveals the machinery that moves modern business — and the site itself is a demonstration of that craft.

## How these docs are organized

Every doc is labeled with a **layer**:

- 🟢 **REFERENCE** — what is *actually built today*. Trust these for facts. Keep them in sync with the code.
- 🔭 **VISION** — north-star aspiration and design intent. Inspiring, but not all built. Never cite as current behavior.

> The set was reconciled with the codebase on **2026-06-15** after the original (pre-build) proposal docs drifted from reality. The app outgrew its "static brochure" origin into a full app with a console, an AI backend, runtime theming, and a CRT shell — so REFERENCE docs were added/rewritten and the original proposals kept as VISION.

## Documents

| # | Doc | Layer | What's in it |
|---|---|---|---|
| 00 | [Overview](./00-overview.md) | 🟢 REFERENCE | Read first: mental model, quick start, doc map |
| 01 | [Creative Direction](./01-creative-direction.md) | 🔭 VISION | Thesis, mood, voice, motion language — the "why" |
| 02 | [Brand System](./02-brand-system.md) | 🟢 REFERENCE | Real design tokens, palettes, fonts, glass/cursor/CRT |
| 03 | [Sitemap](./03-sitemap.md) | 🟢/🔭 | Real routes (reference) + narrative IA (vision) |
| 04 | [Hero Concept](./04-hero-concept.md) | 🔭 VISION | The "assembling machinery" hero (not the live hero) |
| 05 | [Tech Architecture](./05-tech-architecture.md) | 🟢 REFERENCE | Stack, folder structure, data flow, auth, tooling |
| 06 | [Roadmap & To-Do](./06-roadmap.md) | 🟢 REFERENCE | Build status + live backlog |
| 07 | [API Reference (YantraMate)](./07-api-reference.md) | 🟢 REFERENCE | The backend service contract (OpenAPI mirror) |
| 08 | [Pivot Log](./08-pivot-log.md) | 🟢 REFERENCE | Decision / pivot history |
| 09 | [Agent Conventions](./09-agent-conventions.md) | 🟢 REFERENCE | Rules every coding agent must follow |
| 10 | [Systems](./10-systems.md) | 🟢 REFERENCE | Theme, Audio, TV/CRT shell, Cursor, Backgrounds, Motion |
| 11 | [UI Components](./11-ui-components.md) | 🟢 REFERENCE | Component reference (props & variants) |
| 12 | [App API (proxy routes)](./12-app-api.md) | 🟢 REFERENCE | The Next.js `/api/*` routes |

Plus `api-docs.json` — the OpenAPI source for doc 07. Repo-root companions: [`AGENTS.md`](../AGENTS.md) and [`README.md`](../README.md).

## Reading paths

- **New to the project?** 00 → 05 → 02 → 11.
- **Doing UI / design work?** 02 → 10 → 11 (and 01/04 for intent).
- **Doing backend / data work?** 12 → 07 → 05.
- **Coding agent?** [`AGENTS.md`](../AGENTS.md) → 00 → 09, then whatever your task touches.

## The one rule that keeps this useful

**When you change behavior, update the matching REFERENCE doc in the same commit.** The drift this set just corrected is exactly what happens when that rule slips. Mapping table: [09-agent-conventions.md §6](./09-agent-conventions.md).
