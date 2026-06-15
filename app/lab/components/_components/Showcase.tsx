"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "@/components/typography/Eyebrow";

/* ── Types ──────────────────────────────────────────────────────────── */

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/* ── Copy-to-clipboard button ───────────────────────────────────────── */

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={cn(
        "shrink-0 rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-200",
        copied
          ? "border-accent-2/50 text-accent-2"
          : "border-white/10 text-text-low hover:border-white/25 hover:text-text-mid"
      )}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

/* ── Import line (copyable) ─────────────────────────────────────────── */

export function ImportLine({ code }: { code: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-lg border border-ink-edge bg-ink-1 px-3 py-2">
      <code className="no-scrollbar flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-text-mid">
        {code}
      </code>
      <CopyButton text={code} />
    </div>
  );
}

/* ── Props table ────────────────────────────────────────────────────── */

export function PropsTable({ rows }: { rows: PropDef[] }) {
  if (!rows.length) return null;

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-ink-edge">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="bg-white/[0.02]">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                className="border-b border-ink-edge px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="align-top">
              <td className="border-b border-ink-edge/60 px-3 py-2.5 font-mono text-xs text-accent-1">
                {r.name}
              </td>
              <td className="border-b border-ink-edge/60 px-3 py-2.5 font-mono text-xs text-text-mid">
                {r.type}
              </td>
              <td className="border-b border-ink-edge/60 px-3 py-2.5 font-mono text-xs text-text-low">
                {r.default ?? "—"}
              </td>
              <td className="border-b border-ink-edge/60 px-3 py-2.5 text-xs leading-relaxed text-text-mid">
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Preview stage ──────────────────────────────────────────────────── */

export function PreviewStage({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-ink-edge",
        padded && "p-8",
        className
      )}
      style={{
        background:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "22px 22px",
        backgroundColor: "#070811",
      }}
    >
      {children}
    </div>
  );
}

/* ── A single component entry (preview + import + props) ────────────── */

export function ComponentEntry({
  id,
  name,
  description,
  importCode,
  props,
  children,
  stageClassName,
  stagePadded = true,
}: {
  id: string;
  name: string;
  description: string;
  importCode?: string;
  props?: PropDef[];
  children: ReactNode;
  stageClassName?: string;
  stagePadded?: boolean;
}) {
  return (
    <article id={id} data-spy={id} className="scroll-mt-28">
      <div className="mb-4">
        <h3
          className="text-xl font-semibold text-text-hi"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {name}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-mid">
          {description}
        </p>
      </div>
      <PreviewStage className={stageClassName} padded={stagePadded}>
        {children}
      </PreviewStage>
      {importCode && <ImportLine code={importCode} />}
      {props && props.length > 0 && <PropsTable rows={props} />}
    </article>
  );
}

/* ── A category section (group of entries) ──────────────────────────── */

export function CategorySection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-ink-edge pt-16">
      <Eyebrow tone="accent">{eyebrow}</Eyebrow>
      <h2
        className="mt-3 text-3xl font-semibold tracking-tight text-text-hi md:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {intro && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-mid">
          {intro}
        </p>
      )}
      <div className="mt-10 space-y-14">{children}</div>
    </section>
  );
}

/* ── Replay wrapper for scroll/enter-triggered motion demos ─────────── */

export function Replayable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [k, setK] = useState(0);
  return (
    <div className={cn("flex flex-col items-start gap-4", className)}>
      <div key={k} className="w-full">
        {children}
      </div>
      <button
        type="button"
        onClick={() => setK((n) => n + 1)}
        className="rounded-md border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-low transition-colors duration-200 hover:border-white/25 hover:text-text-mid"
      >
        ↻ Replay
      </button>
    </div>
  );
}

/* ── Small labeled cell for laying out variant grids ────────────────── */

export function VariantLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.15em] text-text-faint">
      {children}
    </span>
  );
}
