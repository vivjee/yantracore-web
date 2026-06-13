"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  MessageSquareText,
  FolderOpen,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  Send,
  Sparkles,
  Loader2,
  HardDriveUpload,
  Zap,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  Presentation,
  ClipboardList,
  ExternalLink,
  AlertTriangle,
  User,
  Bot,
  Plus,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Inbox,
  RefreshCw,
  Database,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StaggerContainer, StaggerItem, ScaleFadeItem } from "@/components/motion/AnimationWrappers";
import { SettingsShell } from "./SettingsShell";

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface AskSource {
  chunkId: string;
  fileId: string;
  driveFileId: string;
  name: string;
  mimeType?: string;
  score: number;
  semanticScore: number;
  keywordScore: number;
  metadataScore: number;
}

interface AskResult {
  answer: string;
  sources: AskSource[];
  grounding?: Record<string, unknown>;
  stale?: boolean;
}

interface ChatMessage {
  id: string;
  question: string;
  result?: AskResult;
  error?: string;
  loading?: boolean;
}

type EmailProvider = "gmail" | "outlook" | "yahoo" | "titan" | "imap" | "other";

interface EmailAccount {
  id: string;           // local key (same as connectionId if from backend)
  connectionId?: string; // UUID returned by POST /api/v1/email/credentials
  label: string;
  email: string;
  provider: EmailProvider;
  host?: string;
  port?: number;
  connectedAt?: string;
}

interface DriveProjectItem {
  id: string;
  name: string;
  mimeType?: string;
  modifiedTime?: string;
  size?: number;
  isFolder?: boolean;
}

interface DriveTreeSummary {
  folderCount: number;
  fileCount: number;
  indexedCount: number;
  unsupportedCount: number;
  missingFromIndexCount: number;
  totalChunkCount: number;
}

interface ProjectItem {
  id: string;
  name: string;
  fileCount?: number;
}

interface ProjectFile {
  id: string;
  name: string;
  mimeType?: string;
  driveFileId?: string;
  indexedAt?: string;
}

/* ─────────────────────────────────────────────────────────────
   Google Drive URL resolver
───────────────────────────────────────────────────────────── */
function getDriveUrl(driveFileId: string, mimeType?: string): string {
  const id = driveFileId;
  switch (mimeType) {
    case "application/vnd.google-apps.document":
      return `https://docs.google.com/document/d/${id}/edit`;
    case "application/vnd.google-apps.spreadsheet":
      return `https://docs.google.com/spreadsheets/d/${id}/edit`;
    case "application/vnd.google-apps.presentation":
      return `https://docs.google.com/presentation/d/${id}/edit`;
    case "application/vnd.google-apps.form":
      return `https://docs.google.com/forms/d/${id}/edit`;
    case "application/vnd.google-apps.drawing":
      return `https://docs.google.com/drawings/d/${id}/edit`;
    case "application/vnd.google-apps.site":
    case "application/vnd.google-apps.sites.page":
      return `https://sites.google.com/d/${id}/edit`;
    case "application/vnd.google-apps.jam":
      return `https://jamboard.google.com/d/${id}/edit`;
    case "application/vnd.google-apps.script":
      return `https://script.google.com/d/${id}/edit`;
    default:
      return `https://drive.google.com/file/d/${id}/view`;
  }
}

type FileKind =
  | "doc" | "sheet" | "slide" | "form" | "pdf"
  | "image" | "video" | "audio" | "code" | "generic";

function getFileKind(mimeType?: string): FileKind {
  if (!mimeType) return "generic";
  if (mimeType === "application/vnd.google-apps.document") return "doc";
  if (mimeType === "application/vnd.google-apps.spreadsheet") return "sheet";
  if (mimeType === "application/vnd.google-apps.presentation") return "slide";
  if (mimeType === "application/vnd.google-apps.form") return "form";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("json") ||
    mimeType.includes("xml") ||
    mimeType.includes("html") ||
    mimeType.includes("css") ||
    mimeType === "text/plain"
  ) return "code";
  return "generic";
}

/* ─────────────────────────────────────────────────────────────
   Provider badge colours
───────────────────────────────────────────────────────────── */
/** Known IMAP host/port defaults per provider */
const PROVIDER_DEFAULTS: Partial<Record<EmailProvider, { host: string; port: number }>> = {
  gmail:   { host: "imap.gmail.com",     port: 993 },
  outlook: { host: "outlook.office365.com", port: 993 },
  yahoo:   { host: "imap.mail.yahoo.com", port: 993 },
  titan:   { host: "imap.titan.email",   port: 993 },
};

/** Whether this provider needs the user to supply / confirm host+port */
const NEEDS_HOST_PORT: Partial<Record<EmailProvider, true>> = {
  titan: true,
  imap:  true,
  other: true,
};

const PROVIDER_META: Record<EmailProvider, { label: string; color: string; bg: string }> = {
  gmail:   { label: "Gmail",   color: "#ea4335", bg: "rgba(234,67,53,0.12)" },
  outlook: { label: "Outlook", color: "#0078d4", bg: "rgba(0,120,212,0.12)" },
  yahoo:   { label: "Yahoo",   color: "#7b0099", bg: "rgba(123,0,153,0.12)" },
  titan:   { label: "Titan",   color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  imap:    { label: "IMAP",    color: "#6e56ff", bg: "rgba(110,86,255,0.12)" },
  other:   { label: "Other",   color: "#9ca3af", bg: "rgba(156,163,175,0.12)" },
};

function ProviderBadge({ provider }: { provider: EmailProvider }) {
  const meta = PROVIDER_META[provider] ?? PROVIDER_META["other"];
  return (
    <span
      className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded-md shrink-0"
      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}33` }}
    >
      {meta.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lightweight markdown renderer
───────────────────────────────────────────────────────────── */
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-text-hi">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic text-text-mid">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md text-[0.82em] font-mono"
          style={{ background: "rgba(110,86,255,0.15)", color: "var(--accent-2)", border: "1px solid rgba(110,86,255,0.2)" }}
        >
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <div key={i} className="my-3 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {lang && (
            <div className="px-4 py-1.5 text-[10px] font-mono tracking-wider uppercase"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--accent-1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {lang}
            </div>
          )}
          <pre className="px-4 py-3.5 overflow-x-auto text-sm font-mono leading-relaxed"
            style={{ background: "rgba(0,0,0,0.35)", color: "var(--text-mid)" }}>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) { nodes.push(<h2 key={i} className="text-lg font-bold text-text-hi mt-5 mb-2 font-display">{renderInline(h1[1])}</h2>); i++; continue; }
    if (h2) { nodes.push(<h3 key={i} className="text-base font-semibold text-text-hi mt-4 mb-1.5">{renderInline(h2[1])}</h3>); i++; continue; }
    if (h3) { nodes.push(<h4 key={i} className="text-sm font-semibold text-text-mid mt-3 mb-1">{renderInline(h3[1])}</h4>); i++; continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push(<hr key={i} className="my-4 border-white/10" />);
      i++; continue;
    }

    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={i} className="pl-3 py-0.5 my-2 text-text-low italic text-sm"
          style={{ borderLeft: "3px solid rgba(110,86,255,0.5)" }}>
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ""));
        i++;
      }
      nodes.push(
        <ul key={i} className="my-2 space-y-1 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-text-mid leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent-1)", opacity: 0.7 }} />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={i} className="my-2 space-y-1 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-text-mid leading-relaxed">
              <span className="shrink-0 text-[11px] font-mono mt-0.5 w-4 text-right" style={{ color: "var(--accent-1)", opacity: 0.8 }}>
                {idx + num}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />);
      i++; continue;
    }

    nodes.push(
      <p key={i} className="text-sm text-text-mid leading-[1.8]">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{nodes}</div>;
}

/* ─────────────────────────────────────────────────────────────
   Ambient orbs
───────────────────────────────────────────────────────────── */
function Orbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute rounded-full opacity-25"
        style={{ width: "clamp(400px,55vw,900px)", height: "clamp(400px,55vw,900px)", top: "-20%", right: "-10%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent-1) 50%, transparent) 0%, transparent 70%)", filter: "blur(80px)",
          animation: "mesh-flow 22s ease-in-out infinite alternate" }} />
      <div className="absolute rounded-full opacity-15"
        style={{ width: "clamp(300px,40vw,700px)", height: "clamp(300px,40vw,700px)", bottom: "-10%", left: "10%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent-2) 40%, transparent) 0%, transparent 70%)", filter: "blur(80px)",
          animation: "mesh-flow 28s ease-in-out infinite alternate-reverse" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Add Email Account Modal
───────────────────────────────────────────────────────────── */
function AddEmailModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (account: EmailAccount) => void;
}) {
  const DRAFT_KEY = "yantra_add_email_draft";

  // ── Load draft from localStorage on first mount ──────────────────────────
  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<{
        user: string; provider: EmailProvider;
        host: string; port: string; secure: boolean;
      }>;
    } catch { return null; }
  };
  const draft = loadDraft();

  const [user, setUser] = useState(draft?.user ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [provider, setProvider] = useState<EmailProvider>(draft?.provider ?? "titan");
  const [host, setHost] = useState(draft?.host ?? "imap.titan.email");
  const [port, setPort] = useState<string>(draft?.port ?? "993");
  const [secure, setSecure] = useState(draft?.secure ?? true);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasDraft, setHasDraft] = useState(!!draft && !!(draft.user || draft.host));

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;
  const passwordConfirmed = confirmPassword !== "" && password === confirmPassword;

  // ── Persist non-sensitive fields whenever they change ────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ user, provider, host, port, secure }));
    } catch { /* storage full / private mode */ }
  }, [user, provider, host, port, secure]);

  // ── Clear draft indicator once it's been acknowledged ───────────────────
  function dismissDraftBanner() { setHasDraft(false); }

  /** When the user picks a provider, pre-fill host/port from known defaults */
  function handleProviderChange(next: EmailProvider) {
    setProvider(next);
    const defaults = PROVIDER_DEFAULTS[next];
    if (defaults) {
      setHost(defaults.host);
      setPort(String(defaults.port));
      setSecure(defaults.port === 993);
    } else {
      setHost("");
      setPort("993");
      setSecure(true);
    }
  }

  /** Auto-update secure when port changes */
  function handlePortChange(val: string) {
    setPort(val);
    const num = parseInt(val, 10);
    if (num === 993) setSecure(true);
    if (num === 143) setSecure(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user.trim()) { setError("Email / username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!host.trim()) { setError("Host is required."); return; }
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setError("Port must be a number between 1 and 65535.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Exact payload the backend expects
      const payload = {
        host: host.trim(),
        port: portNum,
        user: user.trim(),
        password,
        secure,
      };

      const res = await fetch("/api/email-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? `Failed (${res.status}). Please try again.`);
        setLoading(false);
        return;
      }

      // Backend returns { success: true, data: { id } } — capture the connectionId
      const connectionId: string = json.data?.id ?? json.id ?? `local-${Date.now()}`;
      const account: EmailAccount = {
        id: connectionId,
        connectionId,
        label: user.trim(),
        email: user.trim(),
        provider,
        host: host.trim(),
        port: portNum,
        connectedAt: new Date().toISOString(),
      };

      setSuccess(true);
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setTimeout(() => { onSuccess(account); }, 900);
    } catch {
      setError("Network error — is the dev server running?");
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(16,18,36,0.98) 0%, rgba(10,12,22,0.99) 100%)",
          border: "1px solid rgba(110,86,255,0.25)",
          boxShadow: "0 24px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(110,86,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.3) 0%, rgba(0,224,203,0.15) 100%)", border: "1px solid rgba(110,86,255,0.25)" }}>
              <Mail size={16} className="text-accent-1" style={{ color: "var(--accent-1)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-hi">Add Email Account</p>
              <p className="text-[10px] text-text-faint">Connect your inbox to chat with AI</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-faint hover:text-text-mid hover:bg-white/5 transition-all duration-200">
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Success state */}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: "rgba(0,224,203,0.08)", border: "1px solid rgba(0,224,203,0.2)" }}>
              <CheckCircle2 size={16} style={{ color: "var(--accent-2)" }} />
              <p className="text-sm text-text-mid">Account connected successfully!</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "rgb(248,113,113)" }}>
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}



          {/* Provider selector */}
          <div>
            <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-provider">Provider</label>
            <select
              id="add-provider"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as EmailProvider)}
              disabled={loading || success}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 appearance-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-hi)" }}
            >
              <option value="titan">Titan Mail</option>
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook / Microsoft 365</option>
              <option value="yahoo">Yahoo Mail</option>
              <option value="imap">Custom IMAP</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* IMAP connection — host / port / secure */}
          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-3.5 pt-3 pb-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: "var(--accent-1)", opacity: 0.8 }}>IMAP connection</span>
              <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div className="px-3.5 pb-3 flex gap-3">
              {/* Host */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-host">
                  Host <span className="text-red-400">*</span>
                </label>
                <input
                  id="add-host"
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="imap.example.com"
                  disabled={loading || success}
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm placeholder:text-text-faint outline-none font-mono transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-hi)" }}
                />
              </div>
              {/* Port */}
              <div style={{ width: "76px" }}>
                <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-port">Port</label>
                <input
                  id="add-port"
                  type="number"
                  min={1} max={65535}
                  value={port}
                  onChange={(e) => handlePortChange(e.target.value)}
                  disabled={loading || success}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none font-mono transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-hi)" }}
                />
              </div>
            </div>
            {/* Secure toggle */}
            <div className="px-3.5 pb-3.5 flex items-center justify-between">
              <span className="text-xs text-text-low">Use TLS / SSL</span>
              <button
                type="button"
                onClick={() => setSecure(v => !v)}
                disabled={loading || success}
                className="relative w-9 h-5 rounded-full transition-all duration-200 focus:outline-none"
                style={{ background: secure ? "var(--accent-1)" : "rgba(255,255,255,0.12)" }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: secure ? "calc(100% - 18px)" : "2px" }}
                />
              </button>
            </div>
          </div>

          {/* Username / Email */}
          <div>
            <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-user">
              Email / Username <span className="text-red-400">*</span>
            </label>
            <input
              id="add-user"
              type="email"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="you@example.com"
              disabled={loading || success}
              required
              className="w-full px-3.5 py-2.5 rounded-xl text-sm placeholder:text-text-faint outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-hi)" }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-password">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="add-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your email password"
                disabled={loading || success}
                required
                className="w-full px-3.5 py-2.5 pr-11 rounded-xl text-sm text-text-hi placeholder:text-text-faint outline-none transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-low transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-text-low mb-1.5" htmlFor="add-confirm-password">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="add-confirm-password"
                type={showConfirmPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={loading || success}
                required
                className="w-full px-3.5 py-2.5 pr-20 rounded-xl text-sm text-text-hi placeholder:text-text-faint outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: confirmPassword === ""
                    ? "1px solid rgba(255,255,255,0.1)"
                    : passwordConfirmed
                    ? "1px solid rgba(0,224,203,0.4)"
                    : "1px solid rgba(239,68,68,0.45)",
                }}
              />
              {/* Match indicator */}
              {confirmPassword !== "" && (
                <span
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold"
                  style={{ color: passwordConfirmed ? "var(--accent-2)" : "rgb(248,113,113)" }}
                >
                  {passwordConfirmed ? "✓ match" : "✗ mismatch"}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-low transition-colors"
                tabIndex={-1}
              >
                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-text-faint mt-1">
              {provider === "gmail"
                ? "Use a Google App Password — not your regular Gmail password."
                : provider === "outlook"
                ? "Use your Microsoft account password or an app password if 2FA is on."
                : provider === "yahoo"
                ? "Use a Yahoo App Password — generate one in Yahoo Account Security."
                : provider === "titan"
                ? "Use your Titan email account password."
                : "Use your email account password or an app-specific password."}
            </p>
          </div>

          {/* Submit */}
          <button
            id="add-email-submit"
            type="submit"
            disabled={loading || success}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(110,86,255,0.9) 0%, rgba(0,224,203,0.7) 100%)",
              boxShadow: loading || success ? "none" : "0 4px 20px -6px rgba(110,86,255,0.5)",
              color: "white",
            }}
          >
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Connecting…</>
            ) : success ? (
              <><CheckCircle2 size={14} /> Connected!</>
            ) : (
              <><Plus size={14} /> Connect Account</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────────────────────── */
interface ClientRequest {
  id: string;
  title: string;
  description: string;
  category: "Support" | "Integration" | "Bug" | "Impact" | "Infrastructure" | "Other";
  urgency: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In Progress" | "Resolved";
  clientEmail: string;
  clientName: string;
  createdAt: string;
  assignedTo?: string;
}

interface SidebarProps {
  onLogout: () => void;
  emailOpen: boolean;
  onEmailToggle: () => void;
  emailAccounts: EmailAccount[];
  activeEmailId: string | null;
  activeSection: "ask" | "email" | "drive" | "projects" | "requests" | "settings";
  onSelectEmail: (account: EmailAccount) => void;
  onAddEmail: () => void;
  emailLoading: boolean;
  onAskClick: () => void;
  onDriveClick: () => void;
  onProjectsClick: () => void;
  onRequestsClick: () => void;
  onSettingsClick: () => void;
  userRole: "client" | "staff" | "admin";
  userEmail: string;
}

function Sidebar({
  onLogout,
  emailOpen,
  onEmailToggle,
  emailAccounts,
  activeEmailId,
  activeSection,
  onSelectEmail,
  onAddEmail,
  emailLoading,
  onAskClick,
  onDriveClick,
  onProjectsClick,
  onRequestsClick,
  onSettingsClick,
  userRole,
  userEmail,
}: SidebarProps) {
  const isEmailActive = activeSection === "email";

  return (
    <aside
      className="relative flex flex-col z-10 shrink-0 transition-all duration-300 overflow-hidden"
      style={{
        width: emailOpen ? "260px" : "220px",
        background: "linear-gradient(180deg, rgba(10,12,22,0.97) 0%, rgba(6,7,13,0.99) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-4 pb-4 border-b border-white/[0.05] shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 shrink-0 relative">
            <Image
              src="/images/logo/logo-white.svg"
              alt="YantraCore logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <span className="text-base font-bold text-text-hi tracking-tight font-display">YantraCore</span>
            <span className="block text-[10px] font-mono tracking-[0.15em] uppercase" style={{ color: "var(--accent-2)", opacity: 0.8 }}>Control Center</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <StaggerContainer delay={50} staggerDelay={0.05} className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">

        {/* Dashboard */}
        <StaggerItem>
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative text-text-low hover:text-text-mid">
            <LayoutDashboard size={16} className="shrink-0 text-text-faint group-hover:text-text-low transition-colors duration-200" />
            Dashboard
          </Link>
        </StaggerItem>

        {/* Ask AI */}
        <StaggerItem>
          <button
            onClick={onAskClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              activeSection === "ask" ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={activeSection === "ask" ? {
              background: "linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 18%, transparent) 0%, color-mix(in srgb, var(--accent-2) 6%, transparent) 100%)",
              border: "1px solid color-mix(in srgb, var(--accent-1) 22%, transparent)",
            } : {}}
          >
            {activeSection === "ask" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <MessageSquareText size={16} className={cn("shrink-0 transition-colors duration-200", activeSection === "ask" ? "text-accent-1" : "text-text-faint group-hover:text-text-low")} style={activeSection === "ask" ? { color: "var(--accent-1)" } : {}} />
            Ask AI
            {activeSection === "ask" && <ChevronRight size={12} className="ml-auto opacity-60" style={{ color: "var(--accent-1)" }} />}
          </button>
        </StaggerItem>

        {/* Projects */}
        <StaggerItem>
          <button
            onClick={onProjectsClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              activeSection === "projects" ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={activeSection === "projects" ? {
              background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
              border: "1px solid rgba(110,86,255,0.22)",
            } : {}}
          >
            {activeSection === "projects" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <FolderOpen size={16} className={cn("shrink-0 transition-colors duration-200", activeSection === "projects" ? "" : "text-text-faint group-hover:text-text-low")} style={activeSection === "projects" ? { color: "var(--accent-1)" } : {}} />
            Projects
            {activeSection === "projects" && <ChevronRight size={12} className="ml-auto opacity-60" style={{ color: "var(--accent-1)" }} />}
          </button>
        </StaggerItem>

        {/* Requests Tab */}
        <StaggerItem>
          <button
            onClick={onRequestsClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              activeSection === "requests" ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={activeSection === "requests" ? {
              background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
              border: "1px solid rgba(110,86,255,0.22)",
            } : {}}
          >
            {activeSection === "requests" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <ClipboardList size={16} className={cn("shrink-0 transition-colors duration-200", activeSection === "requests" ? "" : "text-text-faint group-hover:text-text-low")} style={activeSection === "requests" ? { color: "var(--accent-1)" } : {}} />
            {userRole === "client" ? "My Requests" : "Manage Requests"}
            {activeSection === "requests" && <ChevronRight size={12} className="ml-auto opacity-60" style={{ color: "var(--accent-1)" }} />}
          </button>
        </StaggerItem>

        {/* ── Email (expandable) ── */}
        <StaggerItem>
          <button
            id="email-nav-btn"
            onClick={onEmailToggle}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              isEmailActive ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={isEmailActive ? {
              background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
              border: "1px solid rgba(110,86,255,0.22)",
            } : {}}
          >
            {isEmailActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <Mail size={16} className={cn("shrink-0 transition-colors duration-200", isEmailActive ? "text-accent-1" : "text-text-faint group-hover:text-text-low")} style={isEmailActive ? { color: "var(--accent-1)" } : {}} />
            <span className="flex-1 text-left">Email</span>
            {emailAccounts.length > 0 && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md mr-1"
                style={{ background: "rgba(110,86,255,0.15)", color: "var(--accent-1)", border: "1px solid rgba(110,86,255,0.2)" }}>
                {emailAccounts.length}
              </span>
            )}
            <ChevronDown
              size={12}
              className="shrink-0 transition-transform duration-300 text-text-faint"
              style={{ transform: emailOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          {/* Accounts sub-panel */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: emailOpen ? "400px" : "0px", opacity: emailOpen ? 1 : 0 }}
          >
            <div className="mt-1 mx-1 rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>

              {/* Account list */}
              {emailLoading ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 size={13} className="animate-spin" style={{ color: "var(--accent-1)" }} />
                  <span className="text-xs text-text-faint">Loading…</span>
                </div>
              ) : emailAccounts.length === 0 ? (
                <div className="px-3 py-4 text-center">
                  <Inbox size={20} className="mx-auto mb-1.5 text-text-faint opacity-40" />
                  <p className="text-[11px] text-text-faint">No accounts yet</p>
                </div>
              ) : (
                <ul className="py-1">
                  {emailAccounts.map((acct) => {
                    const isActive = acct.id === activeEmailId && activeSection === "email";
                    return (
                      <li key={acct.id}>
                        <button
                          onClick={() => onSelectEmail(acct)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-200 group"
                          style={isActive ? {
                            background: "linear-gradient(135deg, rgba(110,86,255,0.15) 0%, rgba(0,224,203,0.06) 100%)",
                          } : {}}
                        >
                          {/* Avatar */}
                          <div
                            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold"
                            style={{
                              background: isActive
                                ? "linear-gradient(135deg, rgba(110,86,255,0.6) 0%, rgba(0,224,203,0.4) 100%)"
                                : "rgba(255,255,255,0.08)",
                              color: "white",
                            }}
                          >
                            {(acct.label || acct.email || "?")[0].toUpperCase()}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-[11px] font-medium truncate leading-tight", isActive ? "text-text-hi" : "text-text-low group-hover:text-text-mid transition-colors")}>
                              {acct.label || acct.email || acct.host || "Unknown"}
                            </p>
                            <p className="text-[10px] text-text-faint truncate leading-tight">
                              {acct.email || acct.host || ""}
                            </p>
                          </div>

                          <ProviderBadge provider={acct.provider} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Add account button */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  id="add-email-account-btn"
                  onClick={onAddEmail}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-faint hover:text-text-mid transition-all duration-200 group"
                >
                  <Plus size={12} className="shrink-0 group-hover:text-accent-1 transition-colors" style={{}} />
                  <span className="group-hover:text-text-mid transition-colors">Add account</span>
                </button>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Drive Sync */}
        <StaggerItem>
          <button
            onClick={onDriveClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              activeSection === "drive" ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={activeSection === "drive" ? {
              background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
              border: "1px solid rgba(110,86,255,0.22)",
            } : {}}
          >
            {activeSection === "drive" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <HardDriveUpload size={16} className={cn("shrink-0 transition-colors duration-200", activeSection === "drive" ? "" : "text-text-faint group-hover:text-text-low")} style={activeSection === "drive" ? { color: "var(--accent-1)" } : {}} />
            Drive Sync
            {activeSection === "drive" && <ChevronRight size={12} className="ml-auto opacity-60" style={{ color: "var(--accent-1)" }} />}
          </button>
        </StaggerItem>

        {/* Settings */}
        <StaggerItem>
          <button
            onClick={onSettingsClick}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer",
              activeSection === "settings" ? "text-text-hi" : "text-text-low hover:text-text-mid"
            )}
            style={activeSection === "settings" ? {
              background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
              border: "1px solid rgba(110,86,255,0.22)",
            } : {}}
          >
            {activeSection === "settings" && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "var(--accent-1)" }} />
            )}
            <Settings size={16} className={cn("shrink-0 transition-colors duration-200", activeSection === "settings" ? "" : "text-text-faint group-hover:text-text-low")} style={activeSection === "settings" ? { color: "var(--accent-1)" } : {}} />
            Settings
            {activeSection === "settings" && <ChevronRight size={12} className="ml-auto opacity-60" style={{ color: "var(--accent-1)" }} />}
          </button>
        </StaggerItem>
      </StaggerContainer>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 capitalize"
            style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.6) 0%, rgba(255,79,176,0.4) 100%)", color: "var(--text-hi)" }}>
            {(userEmail || "T")[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-hi truncate capitalize">{userEmail.split("@")[0]}</p>
            <p className="text-[10px] text-text-faint truncate capitalize">{userRole} Account</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-text-low hover:text-red-400 hover:bg-red-500/8 transition-all duration-200">
          <LogOut size={14} />Sign out
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   Source strip
───────────────────────────────────────────────────────────── */
function SourceFileIcon({ kind }: { kind: FileKind }) {
  const sz = 11;
  switch (kind) {
    case "doc":   return <FileText        size={sz} className="shrink-0 text-blue-400" />;
    case "sheet": return <FileSpreadsheet size={sz} className="shrink-0 text-emerald-400" />;
    case "slide": return <Presentation    size={sz} className="shrink-0 text-orange-400" />;
    case "form":  return <ClipboardList   size={sz} className="shrink-0 text-purple-400" />;
    case "pdf":   return <FileText        size={sz} className="shrink-0 text-red-400" />;
    case "image": return <FileImage       size={sz} className="shrink-0 text-pink-400" />;
    case "video": return <FileVideo       size={sz} className="shrink-0 text-yellow-400" />;
    case "audio": return <FileAudio       size={sz} className="shrink-0 text-cyan-400" />;
    case "code":  return <FileCode        size={sz} className="shrink-0 text-accent-1" style={{ color: "var(--accent-1)" }} />;
    default:      return <FileText        size={sz} className="shrink-0 text-text-faint" />;
  }
}

function SourceStrip({ sources }: { sources: AskSource[] }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-[10px] font-mono uppercase tracking-wider text-text-faint mb-2">
        {sources.length} source{sources.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {sources.map((s, i) => {
          const pct  = Math.round(s.score * 100);
          const name = s.name || s.driveFileId || s.fileId;
          const id   = s.driveFileId || s.fileId;
          const kind = getFileKind(s.mimeType);
          const url  = id ? getDriveUrl(id, s.mimeType) : null;

          const chipBase = "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 no-underline";
          const chipStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" } as React.CSSProperties;

          const scoreChip = (
            <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: pct >= 70 ? "rgba(0,224,203,0.12)" : "rgba(255,255,255,0.06)", color: pct >= 70 ? "var(--accent-2)" : "var(--text-faint)" }}>
              {pct}%
            </span>
          );

          if (url) {
            return (
              <a key={s.chunkId ?? i} href={url} target="_blank" rel="noopener noreferrer"
                title={`Open "${name}" in Google Drive`}
                className={`${chipBase} group hover:border-white/20`}
                style={{ ...chipStyle, cursor: "pointer" }}>
                <SourceFileIcon kind={kind} />
                <span className="text-text-low max-w-[160px] truncate group-hover:text-text-mid transition-colors duration-200" title={name}>{name}</span>
                {scoreChip}
                <ExternalLink size={9} className="shrink-0 text-text-faint opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
              </a>
            );
          }

          return (
            <div key={s.chunkId ?? i} className={chipBase} style={chipStyle}>
              <SourceFileIcon kind={kind} />
              <span className="text-text-low max-w-[160px] truncate" title={name}>{name}</span>
              {scoreChip}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Single chat turn
───────────────────────────────────────────────────────────── */
function ChatTurn({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex flex-col gap-4">
      {/* User bubble */}
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-text-hi leading-relaxed"
          style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.25) 0%, rgba(0,224,203,0.12) 100%)", border: "1px solid rgba(110,86,255,0.25)" }}>
          {msg.question}
        </div>
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
          style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.5) 0%, rgba(255,79,176,0.4) 100%)" }}>
          <User size={14} className="text-white" />
        </div>
      </div>

      {/* AI response */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: "linear-gradient(135deg, rgba(0,224,203,0.3) 0%, rgba(110,86,255,0.3) 100%)", border: "1px solid rgba(0,224,203,0.2)" }}>
          <Bot size={14} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {msg.loading && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full typing-dot"
                    style={{ background: "var(--accent-1)", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-sm text-text-low">Searching your inbox…</span>
            </div>
          )}

          {msg.error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-2xl rounded-tl-sm text-sm" role="alert"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "rgb(248,113,113)" }}>
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {msg.error}
            </div>
          )}

          {msg.result && (
            <div className="px-5 py-4 rounded-2xl rounded-tl-sm"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {msg.result.stale && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md mb-3"
                  style={{ background: "rgba(255,180,84,0.1)", border: "1px solid rgba(255,180,84,0.2)", color: "var(--accent-warm)" }}>
                  ⚡ Index may be stale
                </span>
              )}
              <MarkdownBlock content={msg.result.answer} />
              <SourceStrip sources={msg.result.sources} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Empty states
───────────────────────────────────────────────────────────── */
const SUGGESTED_ASK = [
  "What were the key decisions in last quarter's board meeting?",
  "Summarise all Stripe invoices from May 2026.",
  "Which project files haven't been updated in 30 days?",
];

function AskEmptyState({ onSuggest }: { onSuggest: (q: string) => void }) {
  return (
    <StaggerContainer delay={50} staggerDelay={0.08} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 gap-6">
      <StaggerItem>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase mb-4"
          style={{ background: "rgba(110,86,255,0.12)", border: "1px solid rgba(110,86,255,0.25)", color: "var(--accent-1)" }}>
          <Sparkles size={11} />YantraCore AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-hi font-display tracking-tight mb-3">
          Ask anything about{" "}
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, var(--accent-1) 0%, var(--accent-2) 100%)" }}>
            your workspace
          </span>
        </h1>
        <p className="text-text-low text-sm max-w-md mx-auto">
          Query your Drive files, emails, and projects in plain language. Answers come with cited sources.
        </p>
      </StaggerItem>

      <div className="flex flex-col gap-2 w-full max-w-lg">
        {SUGGESTED_ASK.map((q) => (
          <StaggerItem key={q}>
            <button onClick={() => onSuggest(q)}
              className="text-left text-sm px-4 py-3 rounded-xl text-text-low hover:text-text-mid transition-all duration-200 group flex items-center gap-3 w-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Sparkles size={13} className="shrink-0 text-text-faint group-hover:text-accent-1 transition-colors duration-200" style={{ color: undefined }} />
              {q}
            </button>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
}

function EmailEmptyState({
  account,
  onSuggest,
}: {
  account: EmailAccount;
  onSuggest: (q: string) => void;
}) {
  const suggested = [
    `Summarise the last 10 unread emails in ${account.email}.`,
    "Are there any urgent action items in my inbox?",
    "Who have I emailed most in the past month?",
  ];

  return (
    <StaggerContainer delay={50} staggerDelay={0.08} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 gap-6">
      <StaggerItem>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase mb-4"
          style={{ background: "rgba(110,86,255,0.12)", border: "1px solid rgba(110,86,255,0.25)", color: "var(--accent-1)" }}>
          <Mail size={11} />{account.label || account.email}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-hi font-display tracking-tight mb-3">
          Chat with your{" "}
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, var(--accent-1) 0%, var(--accent-2) 100%)" }}>
            inbox
          </span>
        </h2>
        <p className="text-text-low text-sm max-w-md mx-auto">
          Ask questions about emails, threads, senders, and action items. Your account is connected and ready.
        </p>
      </StaggerItem>

      <div className="flex flex-col gap-2 w-full max-w-lg">
        {suggested.map((q) => (
          <StaggerItem key={q}>
            <button onClick={() => onSuggest(q)}
              className="text-left text-sm px-4 py-3 rounded-xl text-text-low hover:text-text-mid transition-all duration-200 group flex items-center gap-3 w-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Inbox size={13} className="shrink-0 text-text-faint group-hover:text-accent-1 transition-colors duration-200" />
              {q}
            </button>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
}

function NoAccountSelected({ onAddEmail }: { onAddEmail: () => void }) {
  return (
    <StaggerContainer delay={50} staggerDelay={0.08} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 gap-5">
      <StaggerItem>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(110,86,255,0.1)", border: "1px solid rgba(110,86,255,0.2)" }}>
          <Mail size={28} style={{ color: "var(--accent-1)", opacity: 0.7 }} />
        </div>
      </StaggerItem>
      <StaggerItem>
        <h2 className="text-xl font-bold text-text-hi font-display mb-2">No account selected</h2>
        <p className="text-text-low text-sm max-w-xs mx-auto">
          Add an email account and select it from the sidebar to start chatting with your inbox.
        </p>
      </StaggerItem>
      <StaggerItem>
        <button
          onClick={onAddEmail}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ background: "linear-gradient(135deg, rgba(110,86,255,0.3) 0%, rgba(0,224,203,0.15) 100%)", border: "1px solid rgba(110,86,255,0.3)", color: "var(--accent-1)" }}
        >
          <Plus size={14} /> Add email account
        </button>
      </StaggerItem>
    </StaggerContainer>
  );
}

/* ─────────────────────────────────────────────────────────────
   Input bar (shared)
───────────────────────────────────────────────────────────── */
function InputBar({
  onSend,
  disabled,
  placeholder = "Ask anything about your workspace…",
}: {
  onSend: (q: string) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [query]);

  function submit() {
    const q = query.trim();
    if (!q || disabled) return;
    setQuery("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSend(q);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="px-6 pb-5 pt-3 shrink-0"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(6,7,13,0.85)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="relative rounded-2xl transition-all duration-300"
          style={{
            background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
            border: focused ? "1px solid rgba(110,86,255,0.45)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: focused ? "0 0 0 3px rgba(110,86,255,0.1), 0 16px 40px -12px rgba(0,0,0,0.5)" : "0 4px 16px -4px rgba(0,0,0,0.4)",
          }}>
          <textarea
            ref={textareaRef}
            id="ask-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent resize-none px-5 py-4 pr-14 text-sm text-text-hi placeholder:text-text-faint outline-none font-body leading-relaxed disabled:opacity-50"
            style={{ minHeight: "52px", maxHeight: "180px" }}
            aria-label="Ask a question"
          />
          <button
            id="ask-submit"
            onClick={submit}
            disabled={!query.trim() || disabled}
            className="absolute right-3 bottom-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1"
            style={{
              background: query.trim() && !disabled
                ? "linear-gradient(135deg, rgba(110,86,255,0.9) 0%, rgba(0,224,203,0.7) 100%)"
                : "rgba(255,255,255,0.08)",
              boxShadow: query.trim() && !disabled ? "0 4px 14px -4px rgba(110,86,255,0.6)" : "none",
            }}
          >
            {disabled
              ? <Loader2 size={14} className="text-white animate-spin" />
              : <Send size={14} className="text-white" />
            }
          </button>
        </div>
        <p className="text-[11px] text-text-faint text-center mt-2 font-mono">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Drive Pane
───────────────────────────────────────────────────────────── */
interface DrivePaneProps {
  projects: DriveProjectItem[];
  loading: boolean;
  syncing: boolean;
  syncStatus: { lastSync?: string; pageToken?: string } | null;
  treeSummary: DriveTreeSummary | null;
  onRefresh: () => void;
  onSync: (type: "bootstrap" | "delta") => void;
}

function DrivePane({
  projects,
  loading,
  syncing,
  syncStatus,
  treeSummary,
  onRefresh,
  onSync,
}: DrivePaneProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-hi font-display tracking-tight">Drive Sync</h1>
            <p className="text-text-low text-sm mt-1">Google Drive index status and synchronisation</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 disabled:opacity-60"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} style={{ color: "var(--accent-1)" }} />
            <span className="text-text-low">Refresh</span>
          </button>
        </div>

        {/* Stats grid */}
        {treeSummary && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
            {([
              { label: "Files",       value: treeSummary.fileCount,             color: "var(--accent-1)" },
              { label: "Indexed",     value: treeSummary.indexedCount,          color: "var(--accent-2)" },
              { label: "Chunks",      value: treeSummary.totalChunkCount,       color: "var(--accent-1)" },
              { label: "Folders",     value: treeSummary.folderCount,           color: "rgba(255,255,255,0.45)" },
              { label: "Unsupported", value: treeSummary.unsupportedCount,      color: "rgb(248,113,113)" },
              { label: "Missing",     value: treeSummary.missingFromIndexCount, color: "rgb(251,191,36)" },
            ] as const).map((s) => (
              <div
                key={s.label}
                className="px-4 py-4 rounded-xl flex flex-col"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-2xl font-bold font-mono leading-none" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[10px] text-text-faint mt-1.5 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sync controls */}
        <div className="mb-8 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} style={{ color: "var(--accent-1)" }} />
            <span className="text-sm font-semibold text-text-hi">Synchronisation</span>
          </div>
          {syncStatus?.lastSync && (
            <p className="text-xs text-text-faint mb-4">
              Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
            </p>
          )}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => onSync("delta")}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, rgba(110,86,255,0.25) 0%, rgba(0,224,203,0.12) 100%)",
                border: "1px solid rgba(110,86,255,0.3)",
                color: "var(--accent-1)",
              }}
            >
              {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Delta Sync
            </button>
            <button
              onClick={() => onSync("bootstrap")}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-low)",
              }}
            >
              {syncing ? <Loader2 size={13} className="animate-spin" /> : <HardDriveUpload size={13} />}
              Full Bootstrap
            </button>
          </div>
          {syncing && (
            <p className="text-xs text-text-faint mt-3 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin" style={{ color: "var(--accent-2)" }} />
              Sync in progress — this may take a moment for large Drive folders…
            </p>
          )}
        </div>

        {/* Project folders */}
        <div>
          <h2 className="text-[10px] font-mono tracking-wider uppercase text-text-faint mb-4 flex items-center gap-2">
            <FolderOpen size={11} style={{ color: "var(--accent-1)" }} />
            Project Folders ({projects.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 size={22} className="animate-spin" style={{ color: "var(--accent-1)" }} />
              <span className="text-text-faint text-sm">Loading Drive…</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
              <HardDriveUpload size={32} className="mx-auto mb-3 opacity-25" style={{ color: "var(--accent-1)" }} />
              <p className="text-text-faint text-sm">No projects found in the yantramate folder.</p>
              <p className="text-text-faint text-xs mt-1 opacity-60">Run a Bootstrap Sync to index your Drive.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl group transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(110,86,255,0.12)", border: "1px solid rgba(110,86,255,0.2)" }}>
                    <FolderOpen size={16} style={{ color: "var(--accent-1)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-hi truncate">{proj.name}</p>
                    {proj.modifiedTime && (
                      <p className="text-xs text-text-faint mt-0.5">
                        Modified {new Date(proj.modifiedTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://drive.google.com/drive/folders/${proj.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-faint hover:text-text-mid transition-all duration-200 opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <ExternalLink size={11} />
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Projects Pane
───────────────────────────────────────────────────────────── */
interface ProjectsPaneProps {
  projects: ProjectItem[];
  loading: boolean;
  activeProjectId: string | null;
  projectFiles: ProjectFile[];
  projectFilesLoading: boolean;
  onSelectProject: (id: string) => void;
  onRefresh: () => void;
}

function ProjectsPane({
  projects,
  loading,
  activeProjectId,
  projectFiles,
  projectFilesLoading,
  onSelectProject,
  onRefresh,
}: ProjectsPaneProps) {
  const [search, setSearch] = useState("");
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;
  const filteredFiles = search
    ? projectFiles.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : projectFiles;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-hi font-display tracking-tight">Projects</h1>
            <p className="text-text-low text-sm mt-1">Indexed projects from your Google Drive</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 disabled:opacity-60"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} style={{ color: "var(--accent-1)" }} />
            <span className="text-text-low">Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project list */}
          <div className="lg:col-span-1">
            <h2 className="text-[10px] font-mono tracking-wider uppercase text-text-faint mb-3">
              Projects ({projects.length})
            </h2>
            {loading ? (
              <div className="flex items-center gap-2 py-8 justify-center">
                <Loader2 size={16} className="animate-spin" style={{ color: "var(--accent-1)" }} />
                <span className="text-text-faint text-sm">Loading…</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <Database size={26} className="mx-auto mb-2 opacity-25" style={{ color: "var(--accent-1)" }} />
                <p className="text-text-faint text-sm">No projects indexed yet.</p>
                <p className="text-text-faint text-xs mt-1 opacity-60">Sync your Drive to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {projects.map((proj) => {
                  const isActive = proj.id === activeProjectId;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => onSelectProject(proj.id)}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200"
                      style={isActive ? {
                        background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.06) 100%)",
                        border: "1px solid rgba(110,86,255,0.3)",
                      } : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: isActive ? "rgba(110,86,255,0.2)" : "rgba(255,255,255,0.05)",
                          border: isActive ? "1px solid rgba(110,86,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
                        }}>
                        <FolderOpen size={14} style={{ color: isActive ? "var(--accent-1)" : "var(--text-faint)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium truncate", isActive ? "text-text-hi" : "text-text-mid")}>{proj.name}</p>
                        {proj.fileCount !== undefined && (
                          <p className="text-xs text-text-faint">{proj.fileCount} file{proj.fileCount !== 1 ? "s" : ""}</p>
                        )}
                      </div>
                      {isActive && <ChevronRight size={12} style={{ color: "var(--accent-1)" }} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Files panel */}
          <div className="lg:col-span-2">
            {!activeProject ? (
              <div className="flex flex-col items-center justify-center h-56 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <FolderOpen size={30} className="mb-3 opacity-20" style={{ color: "var(--accent-1)" }} />
                <p className="text-text-faint text-sm">Select a project to view its indexed files</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-text-hi flex-1">{activeProject.name}</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md shrink-0"
                    style={{ background: "rgba(110,86,255,0.12)", border: "1px solid rgba(110,86,255,0.2)", color: "var(--accent-1)" }}>
                    {projectFilesLoading ? "…" : `${projectFiles.length} files`}
                  </span>
                </div>

{/* Search bar */}
                {projectFiles.length > 5 && (
                  <div className="relative mb-4">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Filter files…"
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-sm placeholder:text-text-faint outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-hi)" }}
                    />
                  </div>
                )}

                {projectFilesLoading ? (
                  <div className="flex items-center gap-2 py-12 justify-center">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--accent-1)" }} />
                    <span className="text-text-faint text-sm">Loading files…</span>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-12 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <FileText size={26} className="mx-auto mb-2 opacity-25" style={{ color: "var(--text-faint)" }} />
                    <p className="text-text-faint text-sm">
                      {search ? `No files matching "${search}"` : "No indexed files in this project."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                    {filteredFiles.map((file) => {
                      const kind = getFileKind(file.mimeType);
                      const url = file.driveFileId ? getDriveUrl(file.driveFileId, file.mimeType) : null;
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl group"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <SourceFileIcon kind={kind} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-mid truncate">{file.name}</p>
                            {file.indexedAt && (
                              <p className="text-xs text-text-faint mt-0.5">
                                Indexed {new Date(file.indexedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {url && (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open in Google Drive"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-text-faint hover:text-text-mid transition-all duration-200 opacity-0 group-hover:opacity-100"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main shell
───────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────
   Client Requests Pane
   ───────────────────────────────────────────────────────────── */
interface ClientRequestsPaneProps {
  requests: ClientRequest[];
  userEmail: string;
  onSubmitRequest: (req: Omit<ClientRequest, "id" | "clientEmail" | "clientName" | "createdAt" | "status">) => void;
}

function ClientRequestsPane({ requests, userEmail, onSubmitRequest }: ClientRequestsPaneProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ClientRequest["category"]>("Support");
  const [urgency, setUrgency] = useState<ClientRequest["urgency"]>("Medium");

  const clientRequests = requests.filter((r) => r.clientEmail === userEmail);
  const pendingCount = clientRequests.filter((r) => r.status === "Pending").length;
  const inProgressCount = clientRequests.filter((r) => r.status === "In Progress").length;
  const resolvedCount = clientRequests.filter((r) => r.status === "Resolved").length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmitRequest({ title, description, category, urgency });
    setTitle("");
    setDescription("");
    setCategory("Support");
    setUrgency("Medium");
    setShowCreateModal(false);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-hi font-display tracking-tight">My Requests</h1>
            <p className="text-text-low text-sm mt-1">Submit and track your support and implementation tickets</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(110,86,255,0.9) 0%, rgba(0,224,203,0.7) 100%)",
              color: "white",
              boxShadow: "0 4px 20px -6px rgba(110,86,255,0.5)"
            }}
          >
            <Plus size={14} />
            <span>New Request</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active Requests", value: pendingCount + inProgressCount, color: "var(--accent-1)" },
            { label: "In Progress", value: inProgressCount, color: "var(--accent-2)" },
            { label: "Resolved", value: resolvedCount, color: "rgba(255,255,255,0.4)" }
          ].map((stat, i) => (
            <div key={i} className="glass-light p-4 rounded-xl flex flex-col">
              <span className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px] text-text-faint uppercase tracking-wider mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Requests List */}
        <div>
          <h2 className="text-[10px] font-mono tracking-wider uppercase text-text-faint mb-4">
            Recent Submissions ({clientRequests.length})
          </h2>

          {clientRequests.length === 0 ? (
            <div className="text-center py-16 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
              <ClipboardList size={32} className="mx-auto mb-3 opacity-20" style={{ color: "var(--accent-1)" }} />
              <p className="text-text-faint text-sm">You haven&apos;t submitted any requests yet.</p>
              <p className="text-text-low text-xs mt-1">Click &quot;New Request&quot; to submit your first ticket.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clientRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(110,86,255,0.1)", color: "var(--accent-1)", border: "1px solid rgba(110,86,255,0.2)" }}>
                        {req.category}
                      </span>
                      <span className={cn(
                        "text-[10px] font-mono uppercase px-2 py-0.5 rounded-md",
                        req.urgency === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        req.urgency === "High" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                        req.urgency === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      )}>
                        {req.urgency} Priority
                      </span>
                      <span className="text-xs text-text-faint ml-auto font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-text-hi">{req.title}</h3>
                    <p className="text-xs text-text-low mt-1 leading-relaxed">{req.description}</p>
                    {req.assignedTo && (
                      <p className="text-[10px] text-text-faint mt-2 flex items-center gap-1">
                        <span>👤 Assigned to:</span> <span className="text-text-mid font-medium">{req.assignedTo}</span>
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex items-center mt-2 sm:mt-0">
                    <span className={cn(
                      "text-xs px-3 py-1.5 rounded-full font-semibold border",
                      req.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      req.status === "In Progress" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
             onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden glass-heavy border border-accent-1/25 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-1/15 border border-accent-1/20">
                  <ClipboardList size={16} className="text-accent-2" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-hi">Create Support Request</h3>
                  <p className="text-[10px] text-text-faint">Submit a request to the engineering & support staff</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)}
                      className="text-text-faint hover:text-text-mid p-1 rounded-lg hover:bg-white/5 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label htmlFor="req-title" className="block text-xs font-medium text-text-low mb-1.5">Request Title</label>
                <input
                  id="req-title"
                  type="text"
                  required
                  placeholder="e.g. Setting up custom SSO mapping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm placeholder:text-text-faint bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 focus:ring-1 focus:ring-accent-1/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="req-category" className="block text-xs font-medium text-text-low mb-1.5">Category</label>
                  <select
                    id="req-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClientRequest["category"])}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                  >
                    <option value="Support">Support</option>
                    <option value="Integration">Integration</option>
                    <option value="Bug">Bug Report</option>
                    <option value="Impact">Social Impact</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="req-urgency" className="block text-xs font-medium text-text-low mb-1.5">Urgency</label>
                  <select
                    id="req-urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as ClientRequest["urgency"])}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="req-desc" className="block text-xs font-medium text-text-low mb-1.5">Description</label>
                <textarea
                  id="req-desc"
                  required
                  rows={4}
                  placeholder="Provide details of your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm placeholder:text-text-faint bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 focus:ring-1 focus:ring-accent-1/50 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(110,86,255,0.9) 0%, rgba(0,224,203,0.7) 100%)",
                  boxShadow: "0 4px 20px -6px rgba(110,86,255,0.5)"
                }}
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Manage Requests Pane (Staff/Admin)
   ───────────────────────────────────────────────────────────── */
interface ManageRequestsPaneProps {
  requests: ClientRequest[];
  onUpdateStatus: (id: string, status: ClientRequest["status"]) => void;
  onAssignStaff: (id: string, staffName: string) => void;
}

function ManageRequestsPane({ requests, onUpdateStatus, onAssignStaff }: ManageRequestsPaneProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
                          r.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const inProgressCount = requests.filter((r) => r.status === "In Progress").length;
  const criticalCount = requests.filter((r) => r.urgency === "Critical" && r.status !== "Resolved").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-hi font-display tracking-tight">Manage Requests</h1>
          <p className="text-text-low text-sm mt-1">Review, assign, and resolve client support and engineering requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Pending Assignment", value: pendingCount, color: "var(--accent-1)" },
            { label: "Active Tickets", value: inProgressCount, color: "var(--accent-2)" },
            { label: "Critical Tickets", value: criticalCount, color: "rgb(248,113,113)" }
          ].map((stat, i) => (
            <div key={i} className="glass-light p-4 rounded-xl flex flex-col">
              <span className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</span>
              <span className="text-[10px] text-text-faint uppercase tracking-wider mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Filters */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                <input
                  type="text"
                  placeholder="Search by client, title, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm placeholder:text-text-faint bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                />
              </div>
              <div className="w-full sm:w-44">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-2.5">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-16 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                  <p className="text-text-faint text-sm">No requests found matching your filters.</p>
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isActive = selectedRequest?.id === req.id;
                  return (
                    <button
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className="w-full text-left px-5 py-4 rounded-xl transition-all duration-200"
                      style={isActive ? {
                        background: "linear-gradient(135deg, rgba(110,86,255,0.12) 0%, rgba(0,224,203,0.04) 100%)",
                        border: "1px solid rgba(110,86,255,0.3)"
                      } : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)"
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2 flex-wrap text-[10px]">
                        <span className="font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 text-text-mid border border-white/10">
                          {req.category}
                        </span>
                        <span className={cn(
                          "font-mono uppercase px-2 py-0.5 rounded-md",
                          req.urgency === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          req.urgency === "High" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        )}>
                          {req.urgency} Priority
                        </span>
                        <span className={cn(
                          "ml-auto font-semibold uppercase px-2.5 py-0.5 rounded-full",
                          req.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                          req.status === "In Progress" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-text-hi mb-1">{req.title}</h3>
                      <div className="flex items-center justify-between text-xs text-text-low mt-2">
                        <span>Client: <span className="text-text-mid font-medium">{req.clientName || req.clientEmail}</span></span>
                        <span className="font-mono">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Details Sidebar / Panel */}
          <div className="lg:col-span-1">
            {!selectedRequest ? (
              <div className="glass-light p-6 rounded-2xl text-center h-64 flex flex-col justify-center items-center border border-white/5">
                <ClipboardList size={28} className="text-text-faint opacity-30 mb-2" />
                <p className="text-sm text-text-low">Select a request to view details and manage assignments.</p>
              </div>
            ) : (
              <div className="glass-medium p-6 rounded-2xl border border-accent-1/20 flex flex-col gap-5">
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-text-faint mb-1">Ticket Details</h2>
                  <h3 className="text-base font-bold text-text-hi leading-snug">{selectedRequest.title}</h3>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-mono uppercase text-text-faint mb-2">Description</h4>
                  <p className="text-xs text-text-mid leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 max-h-40 overflow-y-auto">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase text-text-faint mb-1.5">Client</h4>
                    <p className="text-xs text-text-hi font-medium truncate">{selectedRequest.clientName}</p>
                    <p className="text-[10px] text-text-faint truncate">{selectedRequest.clientEmail}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase text-text-faint mb-1.5">Submitted</h4>
                    <p className="text-xs text-text-hi font-mono">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Changer */}
                <div className="border-t border-white/5 pt-4">
                  <label htmlFor="ticket-status-select" className="block text-[10px] font-mono uppercase text-text-faint mb-1.5">Ticket Status</label>
                  <select
                    id="ticket-status-select"
                    value={selectedRequest.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ClientRequest["status"];
                      onUpdateStatus(selectedRequest.id, newStatus);
                      setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Assignment Changer */}
                <div className="border-t border-white/5 pt-4">
                  <label htmlFor="ticket-assign-select" className="block text-[10px] font-mono uppercase text-text-faint mb-1.5">Assign Staff</label>
                  <select
                    id="ticket-assign-select"
                    value={selectedRequest.assignedTo || "Unassigned"}
                    onChange={(e) => {
                      const staff = e.target.value;
                      onAssignStaff(selectedRequest.id, staff === "Unassigned" ? "" : staff);
                      setSelectedRequest(prev => prev ? { ...prev, assignedTo: staff === "Unassigned" ? undefined : staff } : null);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/4 border border-white/8 outline-none text-text-hi focus:border-accent-1/50 transition-all"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Alex Staff">Alex Staff (Support)</option>
                    <option value="Sarah Staff">Sarah Staff (Engineering)</option>
                    <option value="John Admin">John Admin (Manager)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({
  initialSection = "ask",
}: {
  initialSection?: "ask" | "email" | "drive" | "projects" | "requests" | "settings";
}) {
  /* ── user session & roles ── */
  const [userRole, setUserRole] = useState<"client" | "staff" | "admin">("client");
  const [userEmail, setUserEmail] = useState("client@yantracore.com");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("ym_authed");
    if (isAuthed !== "1") {
      window.location.href = "/login";
      return;
    }
    const role = (sessionStorage.getItem("ym_role") as "client" | "staff" | "admin") || "admin";
    const email = sessionStorage.getItem("ym_user") || "test@yantracore.com";
    setUserRole(role);
    setUserEmail(email);
    setAuthChecked(true);
  }, []);

  /* ── requests / tickets database ── */
  const [requests, setRequests] = useState<ClientRequest[]>([
    {
      id: "req-1",
      title: "Need support setting up Jimbo chat widget",
      description: "We are trying to integrate the Jimbo chat system into our main marketing portal but the animation loop is not firing sequentially. It alternates correctly but stops typing. Please review the React implementation.",
      category: "Bug",
      urgency: "High",
      status: "In Progress",
      clientEmail: "client@yantracore.com",
      clientName: "Acme Client",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "Alex Staff"
    },
    {
      id: "req-2",
      title: "Incorporate restroverse APIs into Yantra Core",
      description: "Request to whitelist and configure access tokens for the Restroverse food platform services. Need this done to support our partner app launch next week.",
      category: "Integration",
      urgency: "Medium",
      status: "Pending",
      clientEmail: "partner@yantracore.com",
      clientName: "Restroverse Team",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "req-3",
      title: "Galaxy orbit logo sizing issue on mobile displays",
      description: "The rotating showcase logo expands outside its container boundaries on screen sizes smaller than 400px. Need to set responsive scaling.",
      category: "Bug",
      urgency: "Low",
      status: "Resolved",
      clientEmail: "client@yantracore.com",
      clientName: "Acme Client",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: "Sarah Staff"
    },
    {
      id: "req-4",
      title: "Clean water project portal deployment layout",
      description: "Deployment pipeline for Shramdan water quality telemetry app is failing on Docker build steps due to dependency conflicts. Urgent support requested.",
      category: "Infrastructure",
      urgency: "Critical",
      status: "Pending",
      clientEmail: "telemetry@yantracore.com",
      clientName: "Water Project Team",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ]);

  /* ── workspace chat state ── */
  const [askMessages, setAskMessages] = useState<ChatMessage[]>([]);

  /* ── email state ── */
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [activeEmailId, setActiveEmailId] = useState<string | null>(null);
  /* per-account chat histories keyed by accountId */
  const [emailChats, setEmailChats] = useState<Map<string, ChatMessage[]>>(new Map());

  /* ── drive state ── */
  const [driveProjects, setDriveProjects] = useState<DriveProjectItem[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [driveSyncStatus, setDriveSyncStatus] = useState<{ lastSync?: string; pageToken?: string } | null>(null);
  const [driveTreeSummary, setDriveTreeSummary] = useState<DriveTreeSummary | null>(null);

  /* ── projects state ── */
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [projectFilesLoading, setProjectFilesLoading] = useState(false);

  /* ── UI state ── */
  const [activeSection, setActiveSection] = useState<"ask" | "email" | "drive" | "projects" | "requests" | "settings">(initialSection);
  const [showAddModal, setShowAddModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── derived ── */
  const activeEmailAccount = emailAccounts.find((a) => a.id === activeEmailId) ?? null;
  const currentEmailMessages: ChatMessage[] = activeEmailId ? (emailChats.get(activeEmailId) ?? []) : [];
  const isAskLoading = askMessages.some((m) => m.loading);
  const isEmailLoading = currentEmailMessages.some((m) => m.loading);
  const sidebarWidth = emailOpen ? "260px" : "220px";

  /* ── auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [askMessages, currentEmailMessages]);

  /* ── fetch email accounts when panel opens ── */
  useEffect(() => {
    if (!emailOpen) return;
    fetchEmailAccounts();
  }, [emailOpen]);

  /**
   * Normalize a raw backend account object into our local EmailAccount shape.
   * The backend returns { id, user, host, port, secure, ... } — no label/email.
   * We map `user` → both `email` and `label` for display purposes.
   */
  function normalizeAccount(raw: Record<string, unknown>): EmailAccount {
    const emailVal = (raw.user as string) || (raw.email as string) || "";
    const connId = (raw.id as string) || (raw.connectionId as string) || undefined;
    return {
      id: connId || `local-${Date.now()}`,
      connectionId: connId,
      label: (raw.label as string) || emailVal,
      email: emailVal,
      provider: (Object.keys(PROVIDER_META).includes(raw.provider as string)
        ? raw.provider
        : "other") as EmailProvider,
      host: raw.host as string | undefined,
      port: raw.port as number | undefined,
      connectedAt: raw.connectedAt as string | undefined,
    };
  }

  const fetchDriveData = useCallback(async () => {
    setDriveLoading(true);
    try {
      const [projRes, treeRes, statusRes] = await Promise.all([
        fetch("/api/drive?action=projects"),
        fetch("/api/drive?action=tree"),
        fetch("/api/drive/sync"),
      ]);
      const [projJson, treeJson, statusJson] = await Promise.all([
        projRes.json(),
        treeRes.json(),
        statusRes.json(),
      ]);
      if (projJson.success && Array.isArray(projJson.data?.projects)) {
        setDriveProjects(projJson.data.projects as DriveProjectItem[]);
      }
      if (treeJson.success && treeJson.data?.summary) {
        setDriveTreeSummary(treeJson.data.summary as DriveTreeSummary);
      }
      if (statusJson.data) {
        setDriveSyncStatus(statusJson.data as { lastSync?: string; pageToken?: string });
      }
    } catch {
      // backend not reachable
    } finally {
      setDriveLoading(false);
    }
  }, []);

  const handleDriveSync = useCallback(async (type: "bootstrap" | "delta") => {
    setDriveSyncing(true);
    try {
      const res = await fetch(`/api/drive/sync?action=${type}`, { method: "POST" });
      const json = await res.json();
      if (json.success) await fetchDriveData();
    } catch {
      // ignore
    } finally {
      setDriveSyncing(false);
    }
  }, [fetchDriveData]);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data as ProjectItem[]);
      }
    } catch {
      // backend not reachable
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchProjectFiles = useCallback(async (id: string) => {
    setProjectFilesLoading(true);
    setProjectFiles([]);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjectFiles(json.data as ProjectFile[]);
      }
    } catch {
      // backend not reachable
    } finally {
      setProjectFilesLoading(false);
    }
  }, []);

  /* ── fetch drive data when drive section activates ── */
  useEffect(() => {
    if (activeSection !== "drive") return;
    fetchDriveData();
  }, [activeSection, fetchDriveData]);

  /* ── fetch projects when projects section activates ── */
  useEffect(() => {
    if (activeSection !== "projects") return;
    fetchProjects();
  }, [activeSection, fetchProjects]);

  const fetchEmailAccounts = useCallback(async () => {
    setEmailLoading(true);
    try {
      const res = await fetch("/api/email-credentials");
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        setEmailAccounts(
          (json.data as Record<string, unknown>[]).map(normalizeAccount)
        );
      }
    } catch {
      // backend not reachable — keep existing list
    } finally {
      setEmailLoading(false);
    }
  }, []);

  /* ── Ask AI send ── */
  async function handleAskSend(question: string) {
    const id = `ask-${Date.now()}`;
    setAskMessages((prev) => [...prev, { id, question, loading: true }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setAskMessages((prev) =>
          prev.map((m) => m.id === id
            ? { ...m, loading: false, error: json.error ?? `Backend returned ${res.status}.` }
            : m)
        );
        return;
      }
      setAskMessages((prev) =>
        prev.map((m) => m.id === id ? { ...m, loading: false, result: json.data as AskResult } : m)
      );
    } catch {
      setAskMessages((prev) =>
        prev.map((m) => m.id === id
          ? { ...m, loading: false, error: "Network error — is the dev server running?" }
          : m)
      );
    }
  }

  /* ── Email chat send ── */
  async function handleEmailSend(question: string) {
    if (!activeEmailId) return;
    const id = `email-${Date.now()}`;

    setEmailChats((prev) => {
      const next = new Map(prev);
      const existing = next.get(activeEmailId) ?? [];
      next.set(activeEmailId, [...existing, { id, question, loading: true }]);
      return next;
    });

    try {
      const account = emailAccounts.find((a) => a.id === activeEmailId);
      const res = await fetch("/api/email-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          connectionId: account?.connectionId ?? activeEmailId,
          accountUser: account?.email || undefined,
        }),
      });
      const json = await res.json();

      const update = (msg: ChatMessage): ChatMessage => {
        if (msg.id !== id) return msg;
        if (!res.ok || !json.success) {
          return { ...msg, loading: false, error: json.error ?? `Backend returned ${res.status}.` };
        }
        return { ...msg, loading: false, result: json.data as AskResult };
      };

      setEmailChats((prev) => {
        const next = new Map(prev);
        next.set(activeEmailId, (next.get(activeEmailId) ?? []).map(update));
        return next;
      });
    } catch {
      setEmailChats((prev) => {
        const next = new Map(prev);
        next.set(
          activeEmailId,
          (next.get(activeEmailId) ?? []).map((m) =>
            m.id === id ? { ...m, loading: false, error: "Network error — is the dev server running?" } : m
          )
        );
        return next;
      });
    }
  }

  /* ── Select project ── */
  function handleSelectProject(id: string) {
    setActiveProjectId(id);
    fetchProjectFiles(id);
  }

  /* ── Select email account ── */
  function handleSelectEmail(account: EmailAccount) {
    setActiveEmailId(account.id);
    setActiveSection("email");
    // Ensure a history slot exists
    setEmailChats((prev) => {
      if (prev.has(account.id)) return prev;
      const next = new Map(prev);
      next.set(account.id, []);
      return next;
    });
  }

  /* ── Add account success ── */
  function handleAccountAdded(account: EmailAccount) {
    setEmailAccounts((prev) => {
      if (prev.some((a) => a.id === account.id)) return prev;
      return [...prev, account];
    });
    setShowAddModal(false);
    handleSelectEmail(account);
  }

  function handleLogout() {
    sessionStorage.removeItem("ym_authed");
    window.location.href = "/login";
  }

  /* ── Breadcrumb label ── */
  const breadcrumbLabel =
    activeSection === "email" && activeEmailAccount
      ? activeEmailAccount.label || activeEmailAccount.email
      : activeSection === "drive"
      ? "Drive Sync"
      : activeSection === "projects"
      ? "Projects"
      : activeSection === "requests"
      ? (userRole === "client" ? "My Requests" : "Manage Requests")
      : "Ask AI";

  if (!authChecked) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-1" size={24} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex" style={{ background: "transparent" }}>

      <Sidebar
        onLogout={handleLogout}
        emailOpen={emailOpen}
        onEmailToggle={() => setEmailOpen((v) => !v)}
        emailAccounts={emailAccounts}
        activeEmailId={activeEmailId}
        activeSection={activeSection}
        onSelectEmail={handleSelectEmail}
        onAddEmail={() => setShowAddModal(true)}
        emailLoading={emailLoading}
        onAskClick={() => setActiveSection("ask")}
        onDriveClick={() => setActiveSection("drive")}
        onProjectsClick={() => setActiveSection("projects")}
        onRequestsClick={() => setActiveSection("requests")}
        onSettingsClick={() => setActiveSection("settings")}
        userRole={userRole}
        userEmail={userEmail}
      />

      {/* Main column */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <header
          className="h-14 flex items-center px-6 shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(6,7,13,0.8)",
            backdropFilter: "blur(16px)",
            zIndex: 20,
            position: "sticky",
            top: 0,
          }}
        >
          <div className="flex items-center gap-2 text-sm text-text-low">
            <span className="text-text-faint">YantraCore</span>
            <ChevronRight size={13} className="text-text-faint" />
            {activeSection === "email" && activeEmailAccount && (
              <>
                <span className="text-text-faint">Email</span>
                <ChevronRight size={13} className="text-text-faint" />
                <ProviderBadge provider={activeEmailAccount.provider} />
              </>
            )}
            <span className="text-text-mid font-medium">{breadcrumbLabel}</span>
          </div>

          {/* Refresh accounts button when in email section */}
          {activeSection === "email" && (
            <button
              onClick={fetchEmailAccounts}
              title="Refresh accounts"
              className="ml-3 w-7 h-7 flex items-center justify-center rounded-lg text-text-faint hover:text-text-mid hover:bg-white/5 transition-all duration-200"
            >
              <RefreshCw size={13} className={emailLoading ? "animate-spin" : ""} />
            </button>
          )}

          {/* Clear chat button */}
          {activeSection === "ask" && askMessages.length > 0 && (
            <button
              onClick={() => setAskMessages([])}
              className="ml-4 text-xs text-text-faint hover:text-text-low transition-colors duration-200 px-2.5 py-1 rounded-lg hover:bg-white/5"
            >
              New chat
            </button>
          )}
          {activeSection === "email" && activeEmailId && currentEmailMessages.length > 0 && (
            <button
              onClick={() => {
                if (!activeEmailId) return;
                setEmailChats((prev) => { const n = new Map(prev); n.set(activeEmailId, []); return n; });
              }}
              className="ml-4 text-xs text-text-faint hover:text-text-low transition-colors duration-200 px-2.5 py-1 rounded-lg hover:bg-white/5"
            >
              New chat
            </button>
          )}

          <div className="ml-auto">
            <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase"
              style={{ background: "rgba(110,86,255,0.12)", border: "1px solid rgba(110,86,255,0.22)", color: "var(--accent-1)" }}>
              v1.0.0
            </div>
          </div>
        </header>

        {/* ─── ASK AI pane ─── */}
        {activeSection === "ask" && (
          <StaggerContainer delay={100} staggerDelay={0.06} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              {askMessages.length === 0 ? (
                <AskEmptyState onSuggest={(q) => handleAskSend(q)} />
              ) : (
                <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-8">
                  {askMessages.map((msg) => (
                    <ChatTurn key={msg.id} msg={msg} />
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
            <StaggerItem>
              <InputBar onSend={handleAskSend} disabled={isAskLoading} />
            </StaggerItem>
          </StaggerContainer>
        )}

        {/* ─── EMAIL pane ─── */}
        {activeSection === "email" && (
          <StaggerContainer delay={100} staggerDelay={0.06} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              {!activeEmailAccount ? (
                <NoAccountSelected onAddEmail={() => setShowAddModal(true)} />
              ) : currentEmailMessages.length === 0 ? (
                <EmailEmptyState account={activeEmailAccount} onSuggest={(q) => handleEmailSend(q)} />
              ) : (
                <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-8">
                  {currentEmailMessages.map((msg) => (
                    <ChatTurn key={msg.id} msg={msg} />
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
            {activeEmailAccount && (
              <StaggerItem>
                <InputBar
                  onSend={handleEmailSend}
                  disabled={isEmailLoading}
                  placeholder={`Ask about ${activeEmailAccount.label || activeEmailAccount.email}…`}
                />
              </StaggerItem>
            )}
          </StaggerContainer>
        )}

        {/* ─── DRIVE pane ─── */}
        {activeSection === "drive" && (
          <ScaleFadeItem className="flex-1 flex flex-col min-h-0" initialScale={0.97} targetScale={1}>
            <DrivePane
              projects={driveProjects}
              loading={driveLoading}
              syncing={driveSyncing}
              syncStatus={driveSyncStatus}
              treeSummary={driveTreeSummary}
              onRefresh={fetchDriveData}
              onSync={handleDriveSync}
            />
          </ScaleFadeItem>
        )}

        {/* ─── PROJECTS pane ─── */}
        {activeSection === "projects" && (
          <ScaleFadeItem className="flex-1 flex flex-col min-h-0" initialScale={0.97} targetScale={1}>
            <ProjectsPane
              projects={projects}
              loading={projectsLoading}
              activeProjectId={activeProjectId}
              projectFiles={projectFiles}
              projectFilesLoading={projectFilesLoading}
              onSelectProject={handleSelectProject}
              onRefresh={fetchProjects}
            />
          </ScaleFadeItem>
        )}

        {/* ─── REQUESTS pane ─── */}
        {activeSection === "requests" && (
          <ScaleFadeItem className="flex-1 flex flex-col min-h-0" initialScale={0.97} targetScale={1}>
            {userRole === "client" ? (
              <ClientRequestsPane
                requests={requests}
                userEmail={userEmail}
                onSubmitRequest={(newReq) => {
                  const r: ClientRequest = {
                    id: `req-${Date.now()}`,
                    title: newReq.title,
                    description: newReq.description,
                    category: newReq.category,
                    urgency: newReq.urgency,
                    status: "Pending",
                    clientEmail: userEmail,
                    clientName: userEmail.split("@")[0].replace(/\b\w/g, c => c.toUpperCase()) + " (Client)",
                    createdAt: new Date().toISOString()
                  };
                  setRequests(prev => [r, ...prev]);
                }}
              />
            ) : (
              <ManageRequestsPane
                requests={requests}
                onUpdateStatus={(id, status) => {
                  setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
                }}
                onAssignStaff={(id, staffName) => {
                  setRequests(prev => prev.map(r => r.id === id ? { ...r, assignedTo: staffName || undefined } : r));
                }}
              />
            )}
          </ScaleFadeItem>
        )}

        {/* ─── SETTINGS pane ─── */}
        {activeSection === "settings" && (
          <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 text-text-hi font-body">
            <SettingsShell inTv={true} />
          </div>
        )}
      </div>

      {/* Add Email Modal */}
      {showAddModal && (
        <AddEmailModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAccountAdded}
        />
      )}
    </div>
  );
}
