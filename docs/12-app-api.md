# 12 — App API (Next.js proxy routes)

> **Layer: REFERENCE** — the `app/api/**/route.ts` routes that *this* app exposes. These are thin **proxies** to the YantraMate backend; for the backend's own request/response shapes see [07-api-reference.md](./07-api-reference.md).

## Why these exist

The proxy routes let the browser call same-origin `/api/*` while the real backend URL (and, in future, an API key) stay server-side. Each route:

- reads `YANTRAMATE_API_URL` (default `http://localhost:3011`) and forwards to the matching `/api/v1/...` backend path,
- applies a per-route timeout (via `AbortController`) and maps failures to clean statuses — **502** backend unreachable, **504** timeout, **400** bad input,
- forwards the backend's status and JSON envelope (`{ success, data }`) back to the caller.

> **There is also a direct client** — `lib/api/yantramate.ts` — that calls the backend straight from the browser via `NEXT_PUBLIC_YANTRAMATE_API_URL`. It bypasses these proxies. The overlap is intentional-for-now but should be consolidated onto the proxy path (see [06-roadmap.md](./06-roadmap.md)). When adding a feature, **prefer the proxy** so secrets can move server-side later.

## Route map

| App route | Methods | → Backend (`/api/v1/...`) | Timeout | Purpose |
|---|---|---|---|---|
| `/api/ask` | POST | `/ask` | ~60s | RAG question over indexed Drive content |
| `/api/email-chat` | POST | `/email/chat` | ~60s | AI chat over an indexed mailbox |
| `/api/email/list` | GET, POST | `/email/list` | ~30s | List emails (Gmail-style filters); POST keeps creds out of the URL |
| `/api/email/get` | GET, POST | `/email/get` | ~30s | Fetch one email by UID (body + attachments) |
| `/api/email/sync` | POST | `/email/sync` | ~60s | Backfill a mailbox into the vector DB |
| `/api/email-credentials` | GET, POST | `/email/credentials` | ~15–20s | List / register IMAP accounts |
| `/api/projects` | GET | `/projects` | ~15s | List projects mirrored from Drive |
| `/api/projects/[id]` | GET | `/projects/{id}/files` | ~15s | Indexed files for a project |
| `/api/drive` | GET | `/drive/{action}` | ~20s | `?action=health\|projects\|tree` |
| `/api/drive/sync` | GET, POST | `/drive/sync/status` (GET) · `/drive/sync/{action}` (POST) | ~15–60s | GET status; POST `?action=bootstrap\|delta` |
| `/api/drive/projects/[id]` | GET | `/drive/projects/{id}/files` | ~20s | Files in a Drive project folder |

> Timeouts above are the values in the route files at last reconcile (2026-06-15); confirm against the route when it matters.

## Request/response contract

Bodies and query params mirror the backend exactly — see [07-api-reference.md](./07-api-reference.md) for each endpoint's schema (e.g. `/api/ask` takes `{ question, projectId?, topK?, sessionId? }`; `/api/email/list` takes the IMAP creds + filter params). Successful responses are the backend's `{ success: true, data: {...} }` envelope, forwarded with its status code.

### Error shape (added by the proxy)
```jsonc
// 400 — invalid/missing input before forwarding
{ "success": false, "error": "question is required" }
// 502 — backend unreachable
{ "success": false, "error": "Backend unreachable" }
// 504 — backend timed out
{ "success": false, "error": "Backend timed out" }
```

## Auth

**None today.** The proxies forward unauthenticated. A bearer-token path is stubbed in comments (`Authorization: Bearer ${YANTRAMATE_API_KEY}`) but not active, and the app's own login is demo-grade (see [05-tech-architecture.md](./05-tech-architecture.md#state)). Do **not** assume these routes are protected.

## Adding a new proxy route

1. Create `app/api/<name>/route.ts` exporting the needed HTTP method handlers.
2. Read `process.env.YANTRAMATE_API_URL` (fallback `http://localhost:3011`); forward to the matching `/api/v1/...` path.
3. Wrap the upstream `fetch` in an `AbortController` timeout; map errors to 400/502/504 like the existing routes.
4. Forward the upstream status + JSON.
5. **Update the route map above** and, if a new backend endpoint is involved, [07-api-reference.md](./07-api-reference.md).
