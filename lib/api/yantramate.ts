/**
 * YantraMate API Client
 *
 * Generated from: docs/api-docs.json (OpenAPI 3.0)
 * Backend base URLs:
 *   - Development : http://localhost:3011
 *   - Production  : https://z0n76c1j-3011.usw3.devtunnels.ms
 *
 * Set NEXT_PUBLIC_YANTRAMATE_API_URL in .env.local to override the default.
 */

// ---------------------------------------------------------------------------
// Base config
// ---------------------------------------------------------------------------

const API_BASE =
  process.env.NEXT_PUBLIC_YANTRAMATE_API_URL ??
  "https://z0n76c1j-3011.usw3.devtunnels.ms";

async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      json?.error ?? json?.message ?? `Request failed: ${res.status}`
    );
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Shared schemas / types
// ---------------------------------------------------------------------------

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents: string[];
  modifiedTime: string | null;
  headRevisionId: string | null;
  size: number | null;
  isFolder: boolean;
  trashed: boolean;
}

export interface DriveFileContent {
  fileId: string;
  name: string;
  mimeType: string;
  /** "text" for Docs/Sheets/Slides, "binary" (base64) for PDFs, images, etc. */
  encoding: "text" | "binary";
  content: string;
  bytes: number;
}

export interface DriveChange {
  fileId: string;
  removed: boolean;
  file: DriveFile | null;
}

export interface AskSource {
  chunkId: string;
  fileId: string;
  driveFileId: string;
  /** Direct browser-openable URL for the Drive file. */
  driveUrl: string;
  name: string;
  score: number;
  semanticScore: number;
  keywordScore: number;
  metadataScore: number;
}

export interface AskResult {
  answer: string;
  sources: AskSource[];
  grounding: Record<string, unknown>;
  stale: boolean;
}

export interface DriveTreeSummary {
  folderCount: number;
  fileCount: number;
  indexedCount: number;
  unsupportedCount: number;
  missingFromIndexCount: number;
  totalChunkCount: number;
}

export interface DeltaSyncResult {
  changeCount: number;
  newPageToken: string;
  changes: DriveChange[];
}

export interface ImapCreds {
  host: string;
  port?: number;
  user: string;
  password: string;
  secure?: boolean;
}

export interface EmailAttachment {
  filename: string | null;
  contentType: string;
  size: number;
  contentId: string | null;
  /** Base64 content — only present when explicitly requested. */
  content?: string;
}

export interface EmailListItem {
  uid: number;
  seq: number;
  date: string | null;
  subject: string | null;
  from: string | null;
  to: string | null;
  cc: string | null;
  flags: string[];
  hasAttachments: boolean;
  bodyText?: string;
  bodyHtml?: string | null;
  attachments?: EmailAttachment[];
}

export interface EmailDetail extends EmailListItem {
  bcc: string | null;
  replyTo: string | null;
  messageId: string | null;
  inReplyTo: string | null;
  references: string[];
  bodyText: string | undefined;
  bodyHtml: string | null;
  attachments: EmailAttachment[];
}

export interface EmailListResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
  messages: EmailListItem[];
}

export interface EmailSyncResult {
  ingested: number;
  totalPending: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Ask API
// ---------------------------------------------------------------------------

/**
 * POST /api/v1/ask
 * Ask a natural-language question over indexed Drive content.
 */
export async function ask(params: {
  question: string;
  projectId?: string;
  topK?: number;
}): Promise<AskResult> {
  return apiFetch<AskResult>("/api/v1/ask", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// ---------------------------------------------------------------------------
// Drive API
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/drive/health
 * Check OAuth auth state and confirm yantramate folder is visible.
 */
export async function driveHealth(): Promise<Record<string, unknown>> {
  return apiFetch("/api/v1/drive/health");
}

/**
 * GET /api/v1/drive/projects
 * List top-level project folders under the yantramate root.
 */
export async function listDriveProjects(): Promise<{
  count: number;
  projects: DriveFile[];
}> {
  return apiFetch("/api/v1/drive/projects");
}

/**
 * GET /api/v1/drive/projects/{projectId}/files
 * Recursively list all files inside a project folder by Drive ID.
 */
export async function listDriveProjectFiles(
  projectId: string
): Promise<DriveFile[]> {
  return apiFetch(`/api/v1/drive/projects/${encodeURIComponent(projectId)}/files`);
}

/**
 * GET /api/v1/drive/projects/by-name/{projectName}/files
 * Same as above but resolved by folder name.
 */
export async function listDriveProjectFilesByName(
  projectName: string
): Promise<DriveFile[]> {
  return apiFetch(
    `/api/v1/drive/projects/by-name/${encodeURIComponent(projectName)}/files`
  );
}

/**
 * GET /api/v1/drive/files/{fileId}
 * Get metadata for a single Drive file.
 */
export async function getDriveFile(fileId: string): Promise<DriveFile> {
  return apiFetch(`/api/v1/drive/files/${encodeURIComponent(fileId)}`);
}

/**
 * GET /api/v1/drive/files/{fileId}/content
 * Live-fetch the current content of a Drive file (never cached).
 */
export async function getDriveFileContent(
  fileId: string
): Promise<DriveFileContent> {
  return apiFetch(
    `/api/v1/drive/files/${encodeURIComponent(fileId)}/content`
  );
}

/**
 * POST /api/v1/drive/sync/bootstrap
 * One-time full crawl of the yantramate root.
 */
export async function driveBootstrap(): Promise<Record<string, unknown>> {
  return apiFetch("/api/v1/drive/sync/bootstrap", { method: "POST" });
}

/**
 * POST /api/v1/drive/sync/delta
 * Incremental sync — everything changed since the last cursor.
 */
export async function driveDelta(): Promise<DeltaSyncResult> {
  return apiFetch("/api/v1/drive/sync/delta", { method: "POST" });
}

/**
 * GET /api/v1/drive/sync/status
 * Show current Changes API cursor and last sync timestamp.
 */
export async function driveSyncStatus(): Promise<Record<string, unknown>> {
  return apiFetch("/api/v1/drive/sync/status");
}

/**
 * GET /api/v1/drive/tree
 * Hierarchical view of the yantramate root annotated with index state.
 */
export async function driveTree(): Promise<{
  summary: DriveTreeSummary;
  tree: Record<string, unknown>;
}> {
  return apiFetch("/api/v1/drive/tree");
}

// ---------------------------------------------------------------------------
// Email API
// ---------------------------------------------------------------------------

/**
 * POST /api/v1/email/credentials
 * Save IMAP credentials and receive a persistent connectionId UUID.
 * The backend immediately starts a background IDLE listener.
 */
export async function saveEmailCredentials(
  creds: ImapCreds
): Promise<{ id: string }> {
  return apiFetch("/api/v1/email/credentials", {
    method: "POST",
    body: JSON.stringify(creds),
  });
}

/**
 * POST /api/v1/email/chat
 * Chat with the AI assistant over your indexed mailbox.
 */
export async function emailChat(params: {
  message: string;
  connectionId?: string;
  accountUser?: string;
  history?: ChatMessage[];
}): Promise<Record<string, unknown>> {
  return apiFetch("/api/v1/email/chat", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export interface EmailListParams {
  host: string;
  user: string;
  password: string;
  port?: number;
  secure?: boolean;
  mailbox?: string;
  limit?: number;
  page?: number;
  search?: string;
  from?: string;
  to?: string;
  subject?: string;
  since?: string;
  before?: string;
  seen?: boolean;
  flagged?: boolean;
  hasAttachment?: boolean;
  includeBody?: boolean;
  includeAttachments?: boolean;
}

/**
 * GET /api/v1/email/list
 * List emails with Gmail-style filters.
 */
export async function listEmails(
  params: EmailListParams
): Promise<EmailListResult> {
  const qs = new URLSearchParams();
  (Object.entries(params) as [string, string | number | boolean | undefined][]).forEach(
    ([k, v]) => {
      if (v !== undefined) qs.set(k, String(v));
    }
  );
  return apiFetch(`/api/v1/email/list?${qs.toString()}`);
}

export interface EmailGetParams {
  host: string;
  user: string;
  password: string;
  uid: number;
  port?: number;
  secure?: boolean;
  mailbox?: string;
  includeAttachmentContent?: boolean;
}

/**
 * GET /api/v1/email/get
 * Fetch a single email by UID with full body and attachments.
 */
export async function getEmail(params: EmailGetParams): Promise<EmailDetail> {
  const qs = new URLSearchParams();
  (Object.entries(params) as [string, string | number | boolean | undefined][]).forEach(
    ([k, v]) => {
      if (v !== undefined) qs.set(k, String(v));
    }
  );
  return apiFetch(`/api/v1/email/get?${qs.toString()}`);
}

/**
 * POST /api/v1/email/sync
 * Manually backfill missed emails into the vector DB.
 */
export async function syncEmail(params: {
  connectionId: string;
  mailbox?: string;
  limit?: number;
}): Promise<EmailSyncResult> {
  return apiFetch("/api/v1/email/sync", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// ---------------------------------------------------------------------------
// Projects API
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/projects
 * List all projects mirrored from Drive.
 */
export async function listProjects(): Promise<unknown[]> {
  return apiFetch("/api/v1/projects");
}

/**
 * GET /api/v1/projects/{id}/files
 * List indexed files for a specific project.
 */
export async function listProjectFiles(id: string): Promise<unknown[]> {
  return apiFetch(`/api/v1/projects/${encodeURIComponent(id)}/files`);
}

// ---------------------------------------------------------------------------
// Drive auth helpers (redirect-based — use window.location directly)
// ---------------------------------------------------------------------------

/** Redirect the current tab to the Google OAuth consent screen. */
export function redirectToDriveLogin(): void {
  window.location.href = `${API_BASE}/api/v1/drive/auth/login`;
}
