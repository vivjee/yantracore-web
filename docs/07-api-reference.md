# YantraMate API Reference

> **Source of truth**: [`api-docs.json`](./api-docs.json) (OpenAPI 3.0)
>
> **Base URLs**
> - Development: `http://localhost:3011`
> - Production tunnel: `https://z0n76c1j-3011.usw3.devtunnels.ms`

All successful responses follow the envelope shape:
```json
{ "success": true, "data": { ... } }
```

---

## 🤖 Ask — RAG Question Answering

### `POST /api/v1/ask`
Ask a natural-language question over indexed Drive content. Returns an answer with cited file sources.

Now supports **session context**: pass a `sessionId` to maintain multi-turn conversation history.

**Request body**
```json
{
  "question": "string (required)",
  "projectId": "uuid (optional — scope to one project)",
  "topK": 1–20,          // optional, controls source cap
  "sessionId": "uuid"    // optional — enables multi-turn context
}
```

**Response `data`**
```json
{
  "answer": "string",
  "stale": false,
  "grounding": {},
  "sessionId": "uuid | null",   // session used, or null
  "sources": [
    {
      "chunkId": "uuid",
      "fileId": "uuid",
      "driveFileId": "string",
      "driveUrl": "https://...",   // direct browser-openable URL
      "name": "string",
      "score": 0.95,
      "semanticScore": 0.9,
      "keywordScore": 0.8,
      "metadataScore": 0.7
    }
  ]
}
```

**Errors**: `404` if `sessionId` is provided but not found.

---

### `POST /api/v1/ask/session`
Create a new Ask conversation session.

**Request body**
```json
{
  "title": "string (optional, max 255 chars)",
  "projectId": "uuid (optional — default project scope for the session)"
}
```

**Response `data`**: `{ "sessionId": "uuid" }`

---

### `GET /api/v1/ask/sessions`
List all Ask conversation sessions (without message history).

**Response `data`**: array of
```json
{
  "id": "uuid",
  "title": "string | null",
  "projectId": "uuid | null",
  "createdAt": "ISO date-time",
  "updatedAt": "ISO date-time"
}
```

---

### `DELETE /api/v1/ask/session/{sessionId}`
Delete an Ask conversation session and all its history.

**Errors**: `404` if session not found.

---

## 📁 Drive — Google Drive Integration

### `GET /api/v1/drive/health`
Check OAuth auth state and confirm the yantramate root folder is visible.

### `GET /api/v1/drive/auth/login`
Redirect the user to Google's OAuth consent screen. Used to initiate the auth flow.

### `GET /api/v1/drive/auth/callback?code=&error=`
OAuth callback. Exchanges the auth code for tokens and persists them to disk.

### `GET /api/v1/drive/projects`
List top-level project folders inside yantramate.

**Response `data`**
```json
{ "count": 3, "projects": [ DriveFile, ... ] }
```

### `GET /api/v1/drive/projects/{projectId}/files`
Recursively list all files inside a project folder (by Drive folder ID).

### `GET /api/v1/drive/projects/by-name/{projectName}/files`
Same as above but resolved by folder name. Returns `404` if the name is not found.

### `GET /api/v1/drive/files/{fileId}`
Get metadata for a single file.

**Response `data`**: `DriveFile`

### `GET /api/v1/drive/files/{fileId}/content`
Live-fetch the current content of a Drive file. Always hits Drive — never the cache.
- Google Docs/Sheets/Slides → exported as plain text
- Binary files (PDF, image, docx) → base64

**Response `data`**: `DriveFileContent`

### `POST /api/v1/drive/sync/bootstrap`
One-time full crawl of the yantramate root. Sets the initial Changes API cursor.

### `POST /api/v1/drive/sync/delta`
Incremental sync — fetch everything that changed since the stored cursor.

**Response `data`**
```json
{ "changeCount": 5, "newPageToken": "...", "changes": [ DriveChange, ... ] }
```

### `GET /api/v1/drive/sync/status`
Show the current Changes API cursor and last sync timestamp.

### `GET /api/v1/drive/tree`
Hierarchical view of the yantramate root, annotated with vector-DB index state.
Each node includes: `indexed`, `chunkCount`, `supported`, `lastIndexedAt`.

**Response `data`**
```json
{
  "summary": {
    "folderCount": 2, "fileCount": 10, "indexedCount": 8,
    "unsupportedCount": 1, "missingFromIndexCount": 1, "totalChunkCount": 120
  },
  "tree": { ... }
}
```

---

## 📧 Email — IMAP Integration

### `POST /api/v1/email/credentials`
Save IMAP credentials and get back a persistent `connectionId` UUID.
The backend immediately starts a background IDLE listener for this account.

**Duplicate check**: Returns `409 Conflict` if the same email address is already registered — remove it first before re-adding.

**Request body** (`ImapCreds`)
```json
{
  "host": "imap.titan.email",
  "port": 993,
  "user": "you@example.com",
  "password": "secret",
  "secure": true,
  "label": "Work Email"   // optional display label
}
```

**Response `data`**: `{ "id": "uuid" }` — use this as `connectionId` everywhere else.

**Errors**: `409` if email already registered.

---

### `GET /api/v1/email/credentials`
List all saved IMAP credentials. **Passwords are stripped** from the response.

**Response `data`**: array of
```json
{
  "id": "uuid",
  "host": "string",
  "port": 993,
  "user": "you@example.com",
  "label": "string | null",
  "secure": true,
  "createdAt": "ISO date-time"
}
```

---

### `DELETE /api/v1/email/credentials/{emailAddress}`
Unregister an email account by its address (e.g. `you@example.com`).

**Errors**: `404` if no credential found for that address.

---

### `POST /api/v1/email/chat/session`
Create a new server-side chat session for the given account. Returns a `sessionId` used by `POST /email/chat`.

**Request body**
```json
{
  "accountUser": "you@example.com",   // required
  "title": "Daily digest check"        // optional display title
}
```

**Response `data`**: `{ "sessionId": "uuid" }`

---

### `POST /api/v1/email/chat/sessions`
List chat sessions for an account (ordered by most recently updated). Messages are not included.

**Request body**
```json
{ "accountUser": "you@example.com" }
```

**Response `data`**: array of `EmailChatSession`

---

### `DELETE /api/v1/email/chat/session/{sessionId}`
Permanently delete a chat session and all its stored messages.

**Errors**: `404` if session not found.

---

### `POST /api/v1/email/chat`
Chat with an AI assistant over your indexed mailbox.

Sessions are now **server-side**: pass a `sessionId` (from `POST /email/chat/session`) — the server loads prior turns automatically. Clients **should not** send `history` manually anymore.

**Request body**
```json
{
  "message": "What's new in my mail today?",
  "sessionId": "uuid"   // required — from POST /email/chat/session
}
```

**Response `data`**
```json
{
  "answer": "string",
  "sessionId": "uuid | null",
  "toolTrace": [
    { "name": "string", "arguments": {}, "result": {} }
  ],
  "indexStats": EmailIndexStats,
  "usage": {
    "promptTokens": 0,
    "completionTokens": 0,
    "totalTokens": 0
  }
}
```

**Errors**: `404` if session not found.

---

### `GET /api/v1/email/list`
List emails with Gmail-style filters. All IMAP credentials are passed as query params.

| Param | Type | Notes |
|---|---|---|
| `host` * | string | e.g. `imap.titan.email` |
| `port` | int | default `993` |
| `user` * | string | email address |
| `password` * | string | — |
| `secure` | bool | default `true` |
| `mailbox` | string | default `INBOX` |
| `limit` | int | 1–200, default `20` |
| `page` | int | 1-based, default `1` |
| `search` | string | full-text across subject+body |
| `from` | string | sender substring |
| `to` | string | recipient substring |
| `subject` | string | subject substring |
| `since` | string | ISO date, e.g. `2026-05-01` |
| `before` | string | ISO date |
| `seen` | bool | `true`=read only, `false`=unread only |
| `flagged` | bool | `true`=starred only |
| `hasAttachment` | bool | filter by attachment presence |
| `includeBody` | bool | default `false` |
| `includeAttachments` | bool | default `false` (metadata only) |

**Response `data`**: `{ total, page, limit, pages, messages: EmailListItem[] }`

### `GET /api/v1/email/get`
Fetch a single email by UID with full body and attachments.

Key params: `host*`, `user*`, `password*`, `uid*` (integer), `includeAttachmentContent` (bool).

**Response `data`**: `EmailDetail`

### `POST /api/v1/email/sync`
Manually backfill missed emails into the vector DB.

**Request body**
```json
{
  "connectionId": "uuid",
  "mailbox": "INBOX",
  "limit": 50
}
```

**Response `data`**: `{ "ingested": 5, "totalPending": 0 }`

---

## 🗂️ Projects

### `GET /api/v1/projects`
List all projects mirrored from Drive.

### `GET /api/v1/projects/{id}/files`
List indexed files for a specific project.

---

## Schemas

### `DriveFile`
```ts
{
  id: string
  name: string
  mimeType: string
  parents: string[]
  modifiedTime: string | null   // ISO date-time
  headRevisionId: string | null
  size: number | null
  isFolder: boolean
  trashed: boolean
}
```

### `DriveFileContent`
```ts
{
  fileId: string
  name: string
  mimeType: string
  encoding: "text" | "binary"
  content: string   // plain text OR base64
  bytes: number
}
```

### `DriveChange`
```ts
{ fileId: string; removed: boolean; file: DriveFile | null }
```

### `ImapCreds`
```ts
{
  host: string        // required
  user: string        // required
  password: string    // required
  port?: number       // default 993
  secure?: boolean    // default true
  label?: string | null  // optional display label (NEW)
}
```

### `EmailIndexStats` *(new)*
```ts
{
  accountUser: string
  totalEmails: number
  totalChunks: number
  mailboxes: string[]
  oldestDate: string | null   // ISO date-time
  newestDate: string | null   // ISO date-time
  lastIndexedAt: string | null
}
```

### `EmailChatSession` *(new)*
```ts
{
  id: string          // uuid
  accountUser: string
  title: string | null
  createdAt: string   // ISO date-time
  updatedAt: string   // ISO date-time
}
```

### `EmailListItem`
```ts
{
  uid: number; seq: number; date: string | null
  subject: string | null; from: string | null
  to: string | null; cc: string | null
  flags: string[]               // e.g. ["\\Seen"]
  hasAttachments: boolean
  bodyText?: string             // only when includeBody=true
  bodyHtml?: string | null      // only when includeBody=true
  attachments?: EmailAttachment[] // only when includeAttachments=true
}
```

### `EmailDetail`
```ts
{
  uid: number; seq: number; date: string | null
  subject: string | null; from: string | null
  to: string | null; cc: string | null
  bcc: string | null; replyTo: string | null
  messageId: string | null; inReplyTo: string | null
  references: string[]; flags: string[]
  bodyText: string | null; bodyHtml: string | null
  attachments: EmailAttachment[]
}
```

### `EmailAttachment`
```ts
{
  filename: string | null
  contentType: string   // e.g. "application/pdf"
  size: number
  contentId: string | null
  content?: string      // base64, only when requested
}
```
