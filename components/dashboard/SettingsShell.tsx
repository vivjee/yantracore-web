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
  Monitor,
  User,
  Bell,
  Shield,
  LayoutDashboard,
  MessageSquareText,
  FolderOpen,
  Mail,
  HardDriveUpload,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme, type CursorStyleType } from "@/lib/theme/ThemeProvider";
import { type Palette as PaletteType } from "@/lib/theme/palettes";
import { StaggerContainer, StaggerItem } from "@/components/motion/AnimationWrappers";
import { audioSynth } from "@/lib/audio";

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
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.04]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 relative">
            <Image
              src="/images/logo/logo-white.svg"
              alt="YantraCore logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div>
            <span className="text-sm font-bold text-text-hi tracking-tight font-display">YantraCore</span>
          </div>
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
    themeMode,
    setThemeMode,
    cursorStyle,
    setCursorStyle,
    customCursorEnabled,
    setCustomCursorEnabled,
    resetCursorSettings,
    reducedMotionEnabled,
    setReducedMotionEnabled,
  } = useTheme();

  const [toastVisible, setToastVisible] = useState(false);

  function handlePaletteSelect(id: string) {
    setPaletteId(id);
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
              Theme updated
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
          <StaggerItem className="rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden shadow-xl">
            
            {/* 1. Theme Selection Row */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Palette size={14} className="text-text-mid" />
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
                          ? "bg-white/10 border-white/20 text-white shadow"
                          : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                      )}
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

            {/* 2. Cursor Design Selector */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-text-mid" />
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
                      disabled={!customCursorEnabled && !isDefault}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                        isActive
                          ? "bg-white/10 border-white/20 text-white shadow"
                          : "bg-white/[0.01] border-white/5 text-text-low hover:border-white/10 hover:text-text-mid hover:bg-white/[0.03]"
                      )}
                    >
                      <span className="text-xs">{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Display Settings Toggles */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Monitor size={14} className="text-text-mid" />
                <p className="text-xs font-semibold text-text-hi">Display & Animation</p>
              </div>
              
              <div className="space-y-2.5">
                {/* Toggle 0: Theme Mode (Light / Dark) */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white/[0.01] transition-all">
                  <div>
                    <p className="text-[11px] font-medium text-text-hi">Neumorphic Light Theme</p>
                    <p className="text-[10px] text-text-faint mt-0.5">Switch between retro dark-mesh and physical light neumorphic styles</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      audioSynth.playClick();
                      setThemeMode(themeMode === "dark" ? "light" : "dark");
                    }}
                    className="relative w-8 h-4.5 rounded-full transition-all duration-200 focus:outline-none shrink-0 cursor-pointer"
                    style={{
                      background: themeMode === "light" ? "var(--accent-1)" : "rgba(255,255,255,0.08)",
                      width: "34px",
                      height: "18px",
                    }}
                  >
                    <span
                      className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: themeMode === "light" ? "calc(100% - 16px)" : "2px" }}
                    />
                  </button>
                </div>

                {/* Toggle 1: Custom Cursor */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white/[0.01] transition-all">
                  <div>
                    <p className="text-[11px] font-medium text-text-hi">Custom Cursor</p>
                    <p className="text-[10px] text-text-faint mt-0.5">Render glowing futuristic pointers instead of standard system arrow</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      audioSynth.playClick();
                      setCustomCursorEnabled(!customCursorEnabled);
                    }}
                    className="relative w-8 h-4.5 rounded-full transition-all duration-200 focus:outline-none shrink-0 cursor-pointer"
                    style={{
                      background: customCursorEnabled ? "var(--accent-1)" : "rgba(255,255,255,0.08)",
                      width: "34px",
                      height: "18px",
                    }}
                  >
                    <span
                      className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: customCursorEnabled ? "calc(100% - 16px)" : "2px" }}
                    />
                  </button>
                </div>

                {/* Toggle 2: Reduced Motion */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white/[0.01] transition-all">
                  <div>
                    <p className="text-[11px] font-medium text-text-hi">Reduced Motion</p>
                    <p className="text-[10px] text-text-faint mt-0.5">Freeze background meshes, tickers, and transitions globally</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReducedMotionEnabled(!reducedMotionEnabled)}
                    className="relative w-8 h-4.5 rounded-full transition-all duration-200 focus:outline-none shrink-0 cursor-pointer"
                    style={{
                      background: reducedMotionEnabled ? "var(--accent-1)" : "rgba(255,255,255,0.08)",
                      width: "34px",
                      height: "18px",
                    }}
                  >
                    <span
                      className="absolute top-[2px] w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: reducedMotionEnabled ? "calc(100% - 16px)" : "2px" }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Profile Section Context */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-text-mid" />
                <p className="text-xs font-semibold text-text-hi">Workspace Context</p>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ background: `linear-gradient(135deg, var(--accent-1) 0%, var(--accent-3) 100%)` }}
                  >
                    T
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-text-hi">Test User</p>
                    <p className="text-[10px] text-text-faint mt-0.5">test@yantracore.com</p>
                  </div>
                </div>
                <button
                  disabled
                  className="text-[10px] px-2.5 py-1 rounded border border-white/5 bg-white/[0.01] text-text-faint opacity-50 cursor-not-allowed"
                >
                  Admin
                </button>
              </div>
            </div>

          </StaggerItem>

          {/* Placeholders for secondary screens */}
          <StaggerItem className="grid grid-cols-2 gap-3 mt-4 opacity-50">
            <div className="p-3 rounded-lg border border-dashed border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-2 text-text-low text-[10px] font-semibold">
                <Bell size={12} />
                Notifications
              </div>
              <p className="text-[9px] text-text-faint mt-1">Configure email alerts (Coming soon)</p>
            </div>
            <div className="p-3 rounded-lg border border-dashed border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-2 text-text-low text-[10px] font-semibold">
                <Shield size={12} />
                Security Keys
              </div>
              <p className="text-[9px] text-text-faint mt-1">Manage 2FA preferences (Coming soon)</p>
            </div>
          </StaggerItem>

          <div className="h-12" />
        </StaggerContainer>
      </main>
    </div>
  );
}
