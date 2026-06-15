# Agent Conventions — Yantra Web

> This document defines the conventions AI coding agents must follow when working on this project.
> It is intended to be read and followed by any AI agent (Antigravity, Copilot, Cursor, etc.) working in this codebase.

---

## 1. Git Commit Policy

**Agents MUST commit changes after every significant unit of work.**

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

## 5. Summary

> **Default rule**: When in doubt — commit. A clean git history helps the user
> track what changed and roll back if needed. Small, focused commits with clear
> messages are always better than one massive commit.
