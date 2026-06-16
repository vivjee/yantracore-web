"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Tag } from "@/components/ui/Tag";
import { capabilities } from "@/lib/content/capabilities";

/* ─── Illustration map ───────────────────────────────────────────────── */
const capabilityIllustrations: Record<number, string> = {
  0: "/images/brand/illus-spa.svg",
  1: "/images/brand/illus-ecommerce.svg",
  2: "/images/brand/illus-ai-bot.svg",
  3: "/images/brand/illus-api.svg",
  4: "/images/brand/illus-uiux.svg",
  5: "/images/brand/illus-branding.svg",
};

/* ─── Tiny hook: fires a boolean "ping" on every active change ─────── */
function usePing(value: number) {
  const [ping, setPing] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setPing(true);
    const id = setTimeout(() => setPing(false), 600);
    return () => clearTimeout(id);
  }, [value]);
  return ping;
}

/* ─── Keyframe injection (run once) ────────────────────────────────── */
const KEYFRAMES = `
@keyframes cap-tab-in {
  0%   { opacity: 0; transform: translateX(-14px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes cap-scanner {
  0%,100% { opacity: 0.6; }
  50%      { opacity: 1; }
}
@keyframes cap-dot-pulse {
  0%,100% { transform: scale(1);   opacity: 1; }
  50%      { transform: scale(1.5); opacity: 0.6; }
}
@keyframes cap-enter {
  0%   { opacity: 0; transform: translateY(var(--enter-y, 22px)) scale(0.985); filter: blur(6px); }
  100% { opacity: 1; transform: translateY(0) scale(1);                        filter: blur(0px); }
}
@keyframes cap-exit {
  0%   { opacity: 1; transform: translateY(0) scale(1);                        filter: blur(0px); }
  100% { opacity: 0; transform: translateY(var(--exit-y, -16px)) scale(0.985); filter: blur(7px); }
}
@keyframes cap-sweep {
  0%   { transform: translateX(-170%) skewX(-14deg); opacity: 0; }
  22%  { opacity: 0.6; }
  78%  { opacity: 0.5; }
  100% { transform: translateX(170%) skewX(-14deg);  opacity: 0; }
}
@keyframes cap-trace {
  0%   { stroke-dashoffset: 1; opacity: 0; }
  14%  { opacity: 1; }
  76%  { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes cap-icon-bounce {
  0%   { transform: scale(0.55) rotate(-8deg); opacity: 0; }
  60%  { transform: scale(1.12) rotate(3deg);  opacity: 1; }
  100% { transform: scale(1)   rotate(0deg);   opacity: 1; }
}
@keyframes cap-line-in {
  0%   { opacity: 0; transform: translateY(8px);  letter-spacing: 0.08em; filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0);    letter-spacing: inherit; filter: blur(0); }
}
@keyframes cap-bullet-in {
  0%   { opacity: 0; transform: translateX(-8px); }
  100% { opacity: 1; transform: translateX(0); }
}
@keyframes cap-chip-in {
  0%   { opacity: 0; transform: scale(0.82) translateY(4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes cap-glow-pulse {
  0%,100% { opacity: 0.35; }
  50%      { opacity: 0.65; }
}
@keyframes cap-scanline-sweep {
  0%   { top: 0%;    opacity: 0; }
  10%  {              opacity: 0.7; }
  90%  {              opacity: 0.7; }
  100% { top: 100%;  opacity: 0; }
}
@keyframes cap-active-bar {
  0%   { transform: scaleY(0.3); opacity: 0.4; }
  100% { transform: scaleY(1);   opacity: 1; }
}
@keyframes cap-data-flicker {
  0%,100% { opacity: 1; }
  40%      { opacity: 0.4; }
  42%      { opacity: 1; }
  80%      { opacity: 0.7; }
}
@media (prefers-reduced-motion: reduce) {
  #capabilities *, #capabilities *::before, #capabilities *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;

let injected = false;
function injectKeyframes() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const style = document.createElement("style");
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
}

/* ─── CapTab ─────────────────────────────────────────────────────────── */
interface CapTabProps {
  cap: (typeof capabilities)[0];
  index: number;
  active: boolean;
  onClick: () => void;
  entryDelay: number;
}

function CapTab({ cap, index, active, onClick, entryDelay }: CapTabProps) {
  const Icon = cap.icon;
  const ping = usePing(active ? 1 : 0);
  const accentColor = `var(${cap.accentVar})`;

  return (
    <button
      onClick={onClick}
      aria-selected={active}
      style={{
        animation: `cap-tab-in 0.55s cubic-bezier(0.22,1,0.36,1) ${entryDelay}ms both`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        borderRadius: "14px",
        textAlign: "left",
        width: "100%",
        cursor: "pointer",
        border: active
          ? `1px solid color-mix(in srgb, ${accentColor} 40%, transparent)`
          : "1px solid transparent",
        background: active
          ? `color-mix(in srgb, ${accentColor} 8%, rgba(255,255,255,0.04))`
          : "transparent",
        transition: "background 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
        boxShadow: active
          ? `0 0 28px -8px color-mix(in srgb, ${accentColor} 50%, transparent), inset 0 1px 0 0 rgba(255,255,255,0.08)`
          : "none",
        outline: "none",
        overflow: "hidden",
      }}
    >
      {/* Active left accent bar */}
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: "14%",
            bottom: "14%",
            width: "2.5px",
            borderRadius: "0 2px 2px 0",
            background: `linear-gradient(180deg, ${accentColor}, color-mix(in srgb, ${accentColor} 50%, transparent))`,
            animation: "cap-active-bar 0.35s cubic-bezier(0.22,1,0.36,1) both",
          }}
        />
      )}

      {/* Scanline sweep across the card when active */}
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "1.5px",
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            animation: "cap-scanline-sweep 1.6s ease-in-out infinite",
            pointerEvents: "none",
            opacity: 0.5,
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: active
            ? `color-mix(in srgb, ${accentColor} 22%, transparent)`
            : "rgba(255,255,255,0.04)",
          border: `1px solid color-mix(in srgb, ${accentColor} ${active ? 35 : 10}%, transparent)`,
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <Icon
          size={14}
          style={{
            color: active ? accentColor : "var(--text-low)",
            transition: "color 0.4s ease",
            animation: ping ? "cap-data-flicker 0.5s ease" : undefined,
          }}
          aria-hidden
        />
      </span>

      {/* Label */}
      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: active ? accentColor : "var(--text-faint)",
            transition: "color 0.4s ease",
          }}
        >
          {cap.index}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: active ? "var(--text-hi)" : "var(--text-low)",
            transition: "color 0.4s ease",
            letterSpacing: "0.01em",
          }}
        >
          {cap.title}
        </span>
      </span>

      {/* Active dot indicator */}
      {active && (
        <span
          aria-hidden
          style={{
            marginLeft: "auto",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accentColor,
            flexShrink: 0,
            animation: "cap-dot-pulse 2s ease-in-out infinite",
            boxShadow: `0 0 8px 2px color-mix(in srgb, ${accentColor} 60%, transparent)`,
          }}
        />
      )}

      {/* Hover glow overlay */}
      <span
        aria-hidden
        className="cap-tab-hover-glow"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(ellipse at 30% 50%, color-mix(in srgb, ${accentColor} 12%, transparent), transparent 70%)`,
          opacity: 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

/* ─── Panel content (one capability, one layer of the crossfade) ─────── */
interface PanelContentProps {
  cap: (typeof capabilities)[0];
  capIndex: number;
  /** true = the arriving layer (staggered reveal); false = the leaving layer (block fade-out) */
  entering: boolean;
  /** +1 selecting a lower capability, -1 a higher one — drives slide direction */
  dir: number;
  reduced: boolean;
}

function PanelContent({ cap, capIndex, entering, dir, reduced }: PanelContentProps) {
  const illustration = capabilityIllustrations[capIndex] ?? capabilityIllustrations[0];
  const accentColor = `var(${cap.accentVar})`;
  const ea = entering && !reduced; // element-stagger gate (only the arriving layer)

  /* Layer container: arriving slides in from `dir`, leaving slides out the opposite way. */
  const rootStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
    height: "100%",
  };
  if (!reduced) {
    if (entering) {
      rootStyle.animation = "cap-enter 0.5s cubic-bezier(0.22,1,0.36,1) both";
      (rootStyle as Record<string, string>)["--enter-y"] = dir >= 0 ? "22px" : "-22px";
    } else {
      rootStyle.animation = "cap-exit 0.34s cubic-bezier(0.4,0,1,1) both";
      (rootStyle as Record<string, string>)["--exit-y"] = dir >= 0 ? "-16px" : "16px";
    }
  }

  return (
    <div style={rootStyle} className="md:!grid-cols-[1fr_220px]">
      {/* Text side */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Icon + title */}
        <div
          style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
          aria-label={cap.title}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: `color-mix(in srgb, ${accentColor} 18%, transparent)`,
              border: `1px solid color-mix(in srgb, ${accentColor} 35%, transparent)`,
              boxShadow: `0 0 32px -10px color-mix(in srgb, ${accentColor} 60%, transparent)`,
              animation: ea ? "cap-icon-bounce 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both" : undefined,
            }}
          >
            <cap.icon size={24} style={{ color: accentColor }} aria-hidden />
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                animation: ea ? "cap-line-in 0.5s ease 0.15s both" : undefined,
                display: "block",
              }}
            >
              {cap.index} —
            </span>
            <h3
              style={{
                fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)",
                fontWeight: 600,
                color: "var(--text-hi)",
                marginTop: 2,
                fontFamily: "var(--font-display)",
                animation: ea ? "cap-line-in 0.55s ease 0.2s both" : undefined,
              }}
            >
              {cap.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            color: "var(--text-mid)",
            lineHeight: 1.7,
            fontSize: 15,
            animation: ea ? "cap-line-in 0.55s ease 0.27s both" : undefined,
          }}
        >
          {cap.description}
        </p>

        {/* Bullets */}
        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cap.bullets.map((b, bi) => (
            <li
              key={b}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 14,
                color: "var(--text-mid)",
                animation: ea
                  ? `cap-bullet-in 0.45s cubic-bezier(0.22,1,0.36,1) ${0.33 + bi * 0.07}s both`
                  : undefined,
              }}
            >
              <span
                aria-hidden
                style={{
                  marginTop: 6,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: accentColor,
                  flexShrink: 0,
                  boxShadow: `0 0 6px 1px color-mix(in srgb, ${accentColor} 50%, transparent)`,
                }}
              />
              {b}
            </li>
          ))}
        </ul>

        {/* Stack chips */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            marginTop: "auto",
          }}
        >
          {cap.stack.map((s, si) => (
            <Tag
              key={s}
              tone="accent"
              shape="square"
              size="sm"
              accentColor={accentColor}
              style={{
                animation: ea
                  ? `cap-chip-in 0.4s cubic-bezier(0.22,1,0.36,1) ${0.42 + si * 0.055}s both`
                  : undefined,
              }}
            >
              {s}
            </Tag>
          ))}
        </div>
      </div>

      {/* Illustration side */}
      <div
        className="hidden md:flex"
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow behind illustration */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, color-mix(in srgb, ${accentColor} 20%, transparent) 0%, transparent 70%)`,
          }}
        />
        {/* Orbit ring decoration */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: `1px solid color-mix(in srgb, ${accentColor} 18%, transparent)`,
            animation: "cap-glow-pulse 4s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: `1px dashed color-mix(in srgb, ${accentColor} 12%, transparent)`,
            animation: "cap-glow-pulse 4s ease-in-out 1.5s infinite",
          }}
        />
        <Image
          key={illustration}
          src={illustration}
          alt={`${cap.title} illustration`}
          width={220}
          height={190}
          className="w-full h-auto max-h-[190px] object-contain relative z-10"
          style={{
            filter: "brightness(1.08) saturate(0.88)",
            animation: ea
              ? "cap-icon-bounce 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both"
              : undefined,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Accent re-skin (energy sweep + self-tracing border) ─────────────── */
/* Mounted fresh on every capability change via `key`, so each plays once to
   completion — decoupled from the shorter-lived crossfade layers. */
function AccentReskin({ accentColor }: { accentColor: string }) {
  return (
    <>
      {/* Energy sweep — a beam in the new colour crossing the panel */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-12%",
          bottom: "-12%",
          left: 0,
          width: "55%",
          zIndex: 4,
          pointerEvents: "none",
          mixBlendMode: "screen",
          filter: "blur(6px)",
          background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accentColor} 14%, transparent), color-mix(in srgb, ${accentColor} 26%, transparent), color-mix(in srgb, ${accentColor} 14%, transparent), transparent)`,
          animation: "cap-sweep 0.85s cubic-bezier(0.4,0,0.2,1) both",
        }}
      />

      {/* Self-tracing border — the glass outline redraws once in the new accent */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 1,
          width: "calc(100% - 2px)",
          height: "calc(100% - 2px)",
          overflow: "visible",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <rect
          x="0.75"
          y="0.75"
          width="98%"
          height="98%"
          rx={23}
          ry={23}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          style={{
            filter: `drop-shadow(0 0 6px color-mix(in srgb, ${accentColor} 55%, transparent))`,
            animation: "cap-trace 0.95s cubic-bezier(0.4,0,0.2,1) both",
          }}
        />
      </svg>
    </>
  );
}

/* ─── Detail panel (persistent glass shell + crossfade + accent re-skin) ─ */
interface DetailPanelProps {
  current: number;
  leaving: { index: number; dir: number } | null;
  reduced: boolean;
  /** true once the user has selected a tab — gates the re-skin off the load. */
  flourish: boolean;
}

function DetailPanel({ current, leaving, reduced, flourish }: DetailPanelProps) {
  const cap = capabilities[current];
  const accentColor = `var(${cap.accentVar})`;
  const dir = leaving?.dir ?? 1;

  return (
    <div
      style={{
        height: "100%",
        borderRadius: 24,
        overflow: "hidden",
        background:
          "color-mix(in srgb, rgba(255,255,255,0.06) 100%, transparent)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 32px 80px -24px rgba(0,0,0,0.55)",
        padding: 32,
        position: "relative",
        isolation: "isolate",
      }}
    >
      {/* Ambient glow behind accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 80% 0%, color-mix(in srgb, ${accentColor} 12%, transparent) 0%, transparent 60%)`,
          animation: "cap-glow-pulse 3.5s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Crossfade stack: arriving layer in flow (defines height), leaving layer overlaid */}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        <PanelContent
          key={current}
          cap={cap}
          capIndex={current}
          entering
          dir={dir}
          reduced={reduced}
        />
        {leaving && !reduced && (
          <div
            aria-hidden
            style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
          >
            <PanelContent
              key={`leave-${leaving.index}`}
              cap={capabilities[leaving.index]}
              capIndex={leaving.index}
              entering={false}
              dir={leaving.dir}
              reduced={reduced}
            />
          </div>
        )}
      </div>

      {/* Accent re-skin — sweep + border trace, replayed on each change */}
      {flourish && !reduced && (
        <AccentReskin key={current} accentColor={accentColor} />
      )}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────── */
/* Duration the leaving layer stays mounted (matches cap-exit). */
const EXIT_MS = 340;

export function Capabilities() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState<{ index: number; dir: number } | null>(null);
  const [reduced, setReduced] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const lock = useRef(false);

  /* Inject keyframes once on mount */
  useEffect(injectKeyframes, []);

  /* Honour prefers-reduced-motion (matches the Reveal primitive). */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  function handleSelect(i: number) {
    if (i === current || lock.current) return;
    const dir = i > current ? 1 : -1;
    setInteracted(true);

    if (reduced) {
      setCurrent(i); // instant swap, no transition layers
      return;
    }

    lock.current = true;
    setLeaving({ index: current, dir }); // old content overlays + fades out
    setCurrent(i); // new content crossfades in underneath; tab highlights now

    setTimeout(() => {
      setLeaving(null);
      lock.current = false;
    }, EXIT_MS);
  }

  return (
    <section id="capabilities" className="relative py-32 md:py-48 overflow-hidden">
      <Container width="default" className="relative z-10">
        {/* ── Header ── */}
        <Reveal>
          <Eyebrow>04 — Capabilities</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            What we build
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3))",
              }}
            >
              for clients.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 text-lg text-text-mid max-w-2xl leading-relaxed">
            Six capabilities, all under one roof. Whether you need one or all
            six, the quality standard is the same.
          </p>
        </Reveal>

        {/* ── Tabs + Detail ── */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Tab list */}
          <Reveal delay={200}>
            <nav
              aria-label="Capabilities"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "12px 10px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              className="flex-row lg:flex-col overflow-x-auto pb-2 lg:pb-0"
            >
              {/* Header label */}
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  padding: "2px 14px 8px",
                  display: "block",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  marginBottom: 4,
                }}
              >
                Select capability
              </span>

              {capabilities.map((c, i) => (
                <CapTab
                  key={c.id}
                  cap={c}
                  index={i}
                  active={current === i}
                  onClick={() => handleSelect(i)}
                  entryDelay={200 + i * 60}
                />
              ))}
            </nav>
          </Reveal>

          {/* Detail panel */}
          <Reveal delay={300}>
            <div style={{ height: "100%", minHeight: 420 }}>
              <DetailPanel
                current={current}
                leaving={leaving}
                reduced={reduced}
                flourish={interacted}
              />
            </div>
          </Reveal>
        </div>

        {/* ── "We also work with" strip ── */}
        <Reveal delay={380} className="mt-16 text-center">
          <p className="text-sm text-text-faint font-mono uppercase tracking-widest mb-6">
            We also work with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Shopify", "WordPress", "AWS", "GCP", "Azure", "Firebase", "Stripe", "Twilio"].map(
              (tech) => (
                <Tag key={tech} size="md">
                  {tech}
                </Tag>
              )
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
