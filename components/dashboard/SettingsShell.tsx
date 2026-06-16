"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Palette,
  ChevronRight,
  Check,
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  MessageSquareText,
  FolderOpen,
  Mail,
  HardDriveUpload,
  LogOut,
  Type,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme, type CursorStyleType, type FontStyleType } from "@/lib/theme/ThemeProvider";
import { type Palette as PaletteType } from "@/lib/theme/palettes";
import { StaggerContainer, StaggerItem } from "@/components/motion/AnimationWrappers";
import { audioSynth } from "@/lib/audio";
import { HeaderLogo } from "@/components/chrome/Header";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";

/* ── Font options — each renders its own name as a live type specimen ── */
type FontOption = {
  id: FontStyleType;
  name: string;
  desc: string;
  emoji: string;
  family: string; // the actual display family, for the live preview
};

const FONT_OPTIONS: FontOption[] = [
  { id: "default", name: "Crystal Tech", desc: "Space Grotesk", emoji: "💎", family: "var(--font-space-grotesk)" },
  { id: "cyber", name: "Aero Cyber", desc: "Orbitron", emoji: "🚀", family: "var(--font-orbitron)" },
  { id: "wide", name: "Quantum Wide", desc: "Syncopate", emoji: "🌌", family: "var(--font-syncopate)" },
  { id: "mono", name: "Neo-Chrono", desc: "JetBrains Mono", emoji: "📟", family: "var(--font-jetbrains-mono)" },
  { id: "avant-garde", name: "Chroma Organic", desc: "Syne + Outfit", emoji: "🎨", family: "var(--font-syne)" },
  { id: "editorial", name: "Editorial Ink", desc: "Fraunces", emoji: "📖", family: "var(--font-fraunces)" },
  { id: "couture", name: "Maison Couture", desc: "Instrument Serif", emoji: "🥂", family: "var(--font-instrument-serif)" },
  { id: "marquee", name: "Bold Marquee", desc: "Anton", emoji: "🎬", family: "var(--font-anton)" },
  { id: "pillow", name: "Soft Pillow", desc: "Quicksand", emoji: "☁️", family: "var(--font-quicksand)" },
  { id: "bricolage", name: "Studio Quirk", desc: "Bricolage", emoji: "🧩", family: "var(--font-bricolage)" },
];

const CURSOR_OPTIONS: { id: CursorStyleType; name: string; icon: string }[] = [
  { id: "default", name: "System", icon: "🖱️" },
  { id: "arrow", name: "Neon Arrow", icon: "↗️" },
  { id: "crosshair", name: "Crosshair", icon: "🎯" },
  { id: "dot", name: "Minimal Glow", icon: "🟢" },
];

/* ── Neumorphic surface helpers (single source of truth for depth) ── */
const RAISED_CARD: React.CSSProperties = {
  background: "var(--ink-1)",
  boxShadow: "var(--nm-raised-medium)",
};

/** Raised by default; pressed-in (sunken) + accent ring when active. */
function chipSurface(active: boolean, accent: string): React.CSSProperties {
  return active
    ? {
        background: "var(--ink-1)",
        boxShadow: `var(--nm-sunken-soft), 0 0 0 1px ${accent}59, 0 0 16px ${accent}1f`,
        color: "var(--text-hi)",
      }
    : {
        background: "var(--ink-1)",
        boxShadow: "var(--nm-raised-soft)",
      };
}

/* Ambient color glow */
function AmbientOrbs({ palette }: { palette: PaletteType }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div
        className="absolute rounded-full transition-all duration-[1400ms]"
        style={{
          width: "400px",
          height: "400px",
          top: "-10%",
          right: "-10%",
          background: `radial-gradient(circle, ${palette.glow1} 0%, transparent 70%)`,
          filter: "blur(120px)",
          opacity: 0.15,
        }}
      />
    </div>
  );
}

/* Sidebar navigation */
function SettingsSidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-30 hidden md:flex"
      style={{
        width: "200px",
        background: "rgba(10,12,22,0.6)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.04] flex justify-center">
        <Link href="/" className="flex items-center justify-center">
          <ColorfulLogo size={32} />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-0.5">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-low hover:text-text-mid transition-all duration-200">
          <LayoutDashboard size={14} className="text-text-faint" />
          Dashboard
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-low hover:text-text-mid transition-all duration-200">
          <MessageSquareText size={14} className="text-text-faint" />
          Ask AI
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-low hover:text-text-mid transition-all duration-200">
          <FolderOpen size={14} className="text-text-faint" />
          Projects
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-low hover:text-text-mid transition-all duration-200">
          <Mail size={14} className="text-text-faint" />
          Email
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-low hover:text-text-mid transition-all duration-200">
          <HardDriveUpload size={14} className="text-text-faint" />
          Drive Sync
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-hi transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Settings size={14} style={{ color: "var(--accent-1)" }} />
          Settings
        </Link>
      </nav>

      <div className="p-3 border-t border-white/[0.04] shrink-0">
        <Link href="/login" className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] text-text-low hover:text-red-400 transition-all duration-200">
          <LogOut size={12} />Sign out
        </Link>
      </div>
    </aside>
  );
}

/* Section heading with a recessed neumorphic icon well */
function SectionHeader({
  icon,
  title,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  accent: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
        style={{ boxShadow: "var(--nm-sunken-soft)", color: accent }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-none text-text-hi">{title}</p>
        {hint && <p className="mt-1 truncate text-[10px] leading-none text-text-low">{hint}</p>}
      </div>
    </div>
  );
}

/* Compact, neumorphic settings shell */
export function SettingsShell({ inTv = false }: { inTv?: boolean }) {
  const {
    palette,
    palettes,
    setPaletteId,
    cursorStyle,
    setCursorStyle,
    customCursorEnabled,
    resetCursorSettings,
    fontStyle,
    setFontStyle,
    logoHeartbeatEnabled,
    setLogoHeartbeatEnabled,
  } = useTheme();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState("Settings updated");

  function notify(text: string) {
    setToastText(text);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }

  function handlePaletteSelect(id: string) {
    audioSynth.playClick();
    setPaletteId(id);
    notify("Palette updated");
  }

  return (
    <div className={inTv ? "w-full" : "min-h-screen"} style={inTv ? {} : { background: "var(--ink-0)" }}>
      {!inTv && <AmbientOrbs palette={palette} />}
      {!inTv && <SettingsSidebar />}

      <main
        className={inTv ? "w-full flex flex-col" : "min-h-screen flex flex-col"}
        style={inTv ? {} : { paddingLeft: "200px" }}
      >
        {/* Top Header bar (standalone route only) */}
        {!inTv && (
          <header
            className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3 shrink-0"
            style={{
              background: "rgba(6,7,13,0.5)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-[11px] text-text-faint hover:text-text-low transition-colors duration-200"
            >
              <ArrowLeft size={12} />
              Dashboard
            </Link>
            <ChevronRight size={10} className="text-text-faint opacity-40" />
            <span className="text-[11px] text-text-mid">Settings</span>
          </header>
        )}

        {/* Content — centred and width-capped so it never sprawls on lg screens */}
        <StaggerContainer
          delay={50}
          staggerDelay={0.05}
          className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-5"
        >
          {/* Header */}
          <StaggerItem className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles size={11} style={{ color: palette.accent1 }} />
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: palette.accent1 }}>
                  Appearance
                </span>
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight text-text-hi">Theme &amp; Interface</h1>
              <p className="mt-0.5 text-xs text-text-low">Make the workspace feel like yours.</p>
            </div>

            {/* Live "changed" pill */}
            <div
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] transition-all duration-300",
                toastVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
              )}
              style={{ boxShadow: "var(--nm-sunken-soft)", color: palette.accent1 }}
            >
              <Check size={9} strokeWidth={3} />
              {toastText}
            </div>
          </StaggerItem>

          {/* ── Color palette ── */}
          <StaggerItem className="mb-4 rounded-2xl p-4 sm:p-5" style={RAISED_CARD}>
            <SectionHeader
              icon={<Palette size={14} />}
              title="Color Palette"
              hint={palette.name + " — " + palette.tagline}
              accent={palette.accent1}
            />
            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3">
              {palettes.map((p) => {
                const isActive = p.id === palette.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePaletteSelect(p.id)}
                    aria-pressed={isActive}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all duration-300"
                    style={chipSurface(isActive, palette.accent1)}
                  >
                    <span
                      className="h-7 w-7 shrink-0 rounded-lg"
                      style={{
                        background: p.previewGradient,
                        boxShadow: isActive
                          ? `0 0 10px ${p.accent1}66`
                          : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-text-hi">
                        <span className="truncate">{p.name}</span>
                        <span className="shrink-0 opacity-80">{p.emoji}</span>
                      </span>
                    </span>
                    {isActive && <Check size={12} strokeWidth={3} className="shrink-0" style={{ color: p.accent1 }} />}
                  </button>
                );
              })}
            </div>
          </StaggerItem>

          {/* ── Typeface ── */}
          <StaggerItem className="mb-4 rounded-2xl p-4 sm:p-5" style={RAISED_CARD}>
            <SectionHeader
              icon={<Type size={14} />}
              title="Typeface"
              hint="Each tile is a live specimen of the font"
              accent={palette.accent2}
            />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FONT_OPTIONS.map((f) => {
                const isActive = f.id === fontStyle;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      audioSynth.playClick();
                      setFontStyle(f.id);
                      notify("Typeface updated");
                    }}
                    aria-pressed={isActive}
                    className="flex cursor-pointer flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-all duration-300"
                    style={chipSurface(isActive, palette.accent2)}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span
                        className="truncate text-[15px] leading-tight text-text-hi"
                        style={{ fontFamily: f.family }}
                      >
                        {f.name}
                      </span>
                      <span className="shrink-0 text-xs">{f.emoji}</span>
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-low">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </StaggerItem>

          {/* ── Cursor ── */}
          <StaggerItem className="mb-4 rounded-2xl p-4 sm:p-5" style={RAISED_CARD}>
            <SectionHeader
              icon={<Sparkles size={14} />}
              title="Cursor"
              hint="Swap the pointer for a custom design"
              accent={palette.accent3}
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CURSOR_OPTIONS.map((c) => {
                const isDefault = c.id === "default";
                const isActive = isDefault
                  ? !customCursorEnabled || cursorStyle === "default"
                  : c.id === cursorStyle && customCursorEnabled;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      audioSynth.playClick();
                      if (isDefault) {
                        resetCursorSettings();
                        notify("Cursor reset");
                        return;
                      }
                      setCursorStyle(c.id);
                      notify("Cursor updated");
                    }}
                    aria-pressed={isActive}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-medium text-text-mid transition-all duration-300"
                    style={chipSurface(isActive, palette.accent3)}
                  >
                    <span className="text-xs">{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </StaggerItem>

          {/* ── Logo animation ── */}
          <StaggerItem className="mb-4 rounded-2xl p-4 sm:p-5" style={RAISED_CARD}>
            <SectionHeader
              icon={<Activity size={14} />}
              title="Logo Animation"
              hint="The “heartbeat” squish on logos site-wide"
              accent={palette.accentWarm}
            />
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  audioSynth.playClick();
                  setLogoHeartbeatEnabled(!logoHeartbeatEnabled);
                  notify(logoHeartbeatEnabled ? "Heartbeat off" : "Heartbeat on");
                }}
                role="switch"
                aria-checked={logoHeartbeatEnabled}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium text-text-mid transition-all duration-300"
                style={chipSurface(logoHeartbeatEnabled, palette.accentWarm)}
              >
                <span
                  className={cn("h-2 w-2 rounded-full", logoHeartbeatEnabled && "animate-pulse")}
                  style={{ background: logoHeartbeatEnabled ? palette.accentWarm : "var(--text-faint)" }}
                />
                {logoHeartbeatEnabled ? "Enabled" : "Disabled"}
              </button>

              {/* Live preview, recessed into the card */}
              <div
                className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-2.5"
                style={{ boxShadow: "var(--nm-sunken-soft)" }}
              >
                <span className="font-mono text-[8px] uppercase tracking-wider text-text-faint">Preview</span>
                <HeaderLogo size="small" />
              </div>
            </div>
          </StaggerItem>

          <div className="h-10" />
        </StaggerContainer>
      </main>
    </div>
  );
}
