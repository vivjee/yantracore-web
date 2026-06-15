"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

/* Compact layout shell */
export function SettingsShell({ inTv = false }: { inTv?: boolean }) {
  const {
    palette,
    palettes,
    setPaletteId,
    cursorStyle,
    setCursorStyle,
    customCursorEnabled,
    setCustomCursorEnabled,
    resetCursorSettings,
    fontStyle,
    setFontStyle,
    logoHeartbeatEnabled,
    setLogoHeartbeatEnabled,
  } = useTheme();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState("Settings updated");

  function handlePaletteSelect(id: string) {
    setPaletteId(id);
    setToastText("Theme updated");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }

  return (
    <div className={inTv ? "w-full" : "min-h-screen"} style={inTv ? {} : { background: "var(--ink-0)" }}>
      {!inTv && <AmbientOrbs palette={palette} />}
      {!inTv && <SettingsSidebar />}

      <main
        className={inTv ? "w-full flex flex-col" : "min-h-screen flex flex-col"}
        style={inTv ? {} : { paddingLeft: "200px" }}
      >
        {/* Top Header bar */}
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

            {/* Changed toast */}
            <div
              className={cn(
                "ml-auto flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full transition-all duration-300",
                toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
              )}
              style={{
                background: `${palette.accent1}12`,
                color: palette.accent1,
                border: `1px solid ${palette.accent1}22`,
              }}
            >
              <Check size={9} strokeWidth={3} />
              {toastText}
            </div>
          </header>
        )}

        {/* Page Content wrapper */}
        <StaggerContainer
          delay={50}
          staggerDelay={0.05}
          className={inTv ? "w-full px-2 py-2" : "flex-1 px-6 py-6 max-w-2xl w-full"}
        >
          {/* Header section */}
          <StaggerItem className="mb-6">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} style={{ color: "var(--accent-1)" }} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-text-low" style={{ color: "var(--accent-1)" }}>
                Preference Center
              </span>
            </div>
            <h1 className="text-xl font-bold text-text-hi tracking-tight font-display">
              Workspace Settings
            </h1>
            <p className="text-text-low mt-0.5 text-xs">
              Configure app appearance and cursor interface details.
            </p>
          </StaggerItem>

          {/* Unified Compact Settings Card */}
          <StaggerItem className="rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden shadow-xl relative">
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, ${palette.accent1}, ${palette.accent2})` }} />
            
            {/* 1. Theme Selection Row */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={14} style={{ color: palette.accent1 }} />
                <p className="text-xs font-semibold text-text-hi">Color Theme</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {palettes.map((p) => {
                  const isActive = p.id === palette.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePaletteSelect(p.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer",
                        isActive
                          ? "text-white shadow"
                          : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                      )}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${palette.accent1}1c, ${palette.accent2}0c)`,
                        borderColor: `${palette.accent1}50`,
                        boxShadow: `0 0 12px ${palette.accent1}20`,
                      } : {}}
                    >
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[p.accent1, p.accent2, p.accent3, p.accentWarm].map((c, i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full border border-black/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span>{p.name}</span>
                      <span className="opacity-80">{p.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Style Selection Row */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Type size={14} style={{ color: palette.accent2 }} />
                <p className="text-xs font-semibold text-text-hi">Font Style</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "default", name: "Crystal Tech", desc: "Space Grotesk + Inter", emoji: "💎" },
                  { id: "cyber", name: "Aero Cyber", desc: "Orbitron + Space Grotesk", emoji: "🚀" },
                  { id: "wide", name: "Quantum Wide", desc: "Syncopate + Inter", emoji: "🌌" },
                  { id: "mono", name: "Neo-Chrono", desc: "JetBrains Mono + Mono", emoji: "📟" },
                  { id: "avant-garde", name: "Chroma Organic", desc: "Syne + Outfit", emoji: "🎨" },
                ].map((f) => {
                  const isActive = f.id === fontStyle;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        audioSynth.playClick();
                        setFontStyle(f.id as FontStyleType);
                        setToastText("Fonts updated");
                        setToastVisible(true);
                        setTimeout(() => setToastVisible(false), 2000);
                      }}
                      className={cn(
                        "flex flex-col items-start px-3 py-1.5 rounded-lg text-left border transition-all duration-200 cursor-pointer min-w-[130px] flex-1",
                        isActive
                          ? "text-white shadow"
                          : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                      )}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${palette.accent1}1c, ${palette.accent2}0c)`,
                        borderColor: `${palette.accent1}50`,
                        boxShadow: `0 0 12px ${palette.accent1}20`,
                      } : {}}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs shrink-0">{f.emoji}</span>
                        <span className="text-[11px] font-bold">{f.name}</span>
                      </div>
                      <span className="text-[9px] opacity-60 leading-none">{f.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cursor Design Selector */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: palette.accent3 }} />
                <p className="text-xs font-semibold text-text-hi">Cursor Design</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "default", name: "Default Cursor", icon: "SYS" },
                  { id: "arrow", name: "Neon Arrow", icon: "↗️" },
                  { id: "crosshair", name: "Target Crosshair", icon: "🎯" },
                  { id: "dot", name: "Minimal Glow", icon: "🟢" },
                ].map((c) => {
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
                          setToastVisible(true);
                          setTimeout(() => setToastVisible(false), 2000);
                          return;
                        }
                        setCursorStyle(c.id as CursorStyleType);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer",
                        isActive
                          ? "text-white shadow"
                          : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                      )}
                      style={isActive ? {
                        background: `linear-gradient(135deg, ${palette.accent1}1c, ${palette.accent2}0c)`,
                        borderColor: `${palette.accent1}50`,
                        boxShadow: `0 0 12px ${palette.accent1}20`,
                      } : {}}
                    >
                      <span className="text-xs">{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Logo Animation Settings */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} style={{ color: palette.accentWarm }} />
                <p className="text-xs font-semibold text-text-hi">Logo Animation</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <p className="text-[11px] text-text-mid mb-2">
                    Enable the dynamic "heartbeat" squish effect on logos throughout the application.
                  </p>
                  <button
                    onClick={() => {
                      audioSynth.playClick();
                      setLogoHeartbeatEnabled(!logoHeartbeatEnabled);
                      setToastText(logoHeartbeatEnabled ? "Logo heartbeat disabled" : "Logo heartbeat enabled");
                      setToastVisible(true);
                      setTimeout(() => setToastVisible(false), 2000);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer w-fit",
                      logoHeartbeatEnabled
                        ? "text-white shadow"
                        : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                    )}
                    style={logoHeartbeatEnabled ? {
                      background: `linear-gradient(135deg, ${palette.accentWarm}1c, ${palette.accent3}0c)`,
                      borderColor: `${palette.accentWarm}50`,
                      boxShadow: `0 0 12px ${palette.accentWarm}20`,
                    } : {}}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      logoHeartbeatEnabled ? "bg-white animate-pulse" : "bg-white/30"
                    )} />
                    {logoHeartbeatEnabled ? "Heartbeat Enabled" : "Heartbeat Disabled"}
                  </button>
                </div>
                
                {/* Live Preview Container */}
                <div 
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/5 bg-[#06070D] shrink-0"
                  style={{ width: "120px", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  <span className="text-[9px] font-mono text-text-faint uppercase tracking-wider">Preview</span>
                  <HeaderLogo size="small" />
                </div>
              </div>
            </div>

          </StaggerItem>

          <div className="h-12" />
        </StaggerContainer>
      </main>
    </div>
  );
}
