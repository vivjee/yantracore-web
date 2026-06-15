"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
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
@keyframes cap-panel-out {
  0%   { opacity: 1; transform: translateY(0) scale(1);    filter: blur(0px); }
  100% { opacity: 0; transform: translateY(-10px) scale(0.98); filter: blur(6px); }
}
@keyframes cap-panel-in {
  0%   { opacity: 0; transform: translateY(18px) scale(0.98); filter: blur(8px); }
  100% { opacity: 1; transform: translateY(0) scale(1);     filter: blur(0px); }
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

/* ─── Detail panel ───────────────────────────────────────────────────── */
interface DetailPanelProps {
  capIndex: number;
  phase: "idle" | "out" | "in";
}

function DetailPanel({ capIndex, phase }: DetailPanelProps) {
  const cap = capabilities[capIndex];
  const illustration = capabilityIllustrations[capIndex] ?? capabilityIllustrations[0];
  const accentColor = `var(${cap.accentVar})`;

  const animStyle = ((): React.CSSProperties => {
    if (phase === "out")
      return { animation: "cap-panel-out 0.28s cubic-bezier(0.4,0,1,1) both" };
    if (phase === "in")
      return { animation: "cap-panel-in 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both" };
    return {};
  })();

  return (
    <div
      style={{
        ...animStyle,
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

      {/* Content grid */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
          height: "100%",
        }}
        className="md:!grid-cols-[1fr_220px]"
      >
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
                animation: phase !== "out" ? "cap-icon-bounce 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both" : undefined,
              }}
            >
              <cap.icon
                size={24}
                style={{ color: accentColor }}
                aria-hidden
              />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  animation: phase !== "out" ? "cap-line-in 0.5s ease 0.15s both" : undefined,
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
                  animation: phase !== "out" ? "cap-line-in 0.55s ease 0.2s both" : undefined,
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
              animation: phase !== "out" ? "cap-line-in 0.55s ease 0.27s both" : undefined,
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
                  animation: phase !== "out"
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
                  animation:
                    phase !== "out"
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
              animation: phase !== "out"
                ? "cap-icon-bounce 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both"
                : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────── */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const pendingRef = useRef<number | null>(null);

  /* Inject keyframes once on mount */
  useEffect(injectKeyframes, []);

  function handleSelect(i: number) {
    if (i === active || phase !== "idle") return;
    pendingRef.current = i;
    setPhase("out");
    setActive(i); // tab highlights immediately

    setTimeout(() => {
      setDisplayed(pendingRef.current ?? i);
      setPhase("in");
      setTimeout(() => setPhase("idle"), 550);
    }, 300);
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
                  active={active === i}
                  onClick={() => handleSelect(i)}
                  entryDelay={200 + i * 60}
                />
              ))}
            </nav>
          </Reveal>

          {/* Detail panel */}
          <Reveal delay={300}>
            <div style={{ height: "100%", minHeight: 420 }}>
              <DetailPanel capIndex={displayed} phase={phase} />
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
