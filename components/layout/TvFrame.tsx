"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Maximize2, Minimize2, Home, Headphones, Mail, Boxes, Briefcase, Info, Volume2, VolumeX } from "lucide-react";
import {
  TvConsoleIcon,
  UserIcon,
  SynthMusicIcon,
  ChipSettingsIcon,
  ControlSlidersIcon,
  SunCoreIcon,
  MoonCrescentIcon,
  StellarOrbitIcon,
} from "@/components/chrome/NavIcons";
import { motion } from "framer-motion";
import { audioSynth } from "@/lib/audio";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { POWER_TOGGLE_EVENT } from "@/lib/shortcuts/shortcuts";
import { KeyHint } from "@/components/chrome/KeyHint";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";
import { useAudioPlayer } from "@/lib/audio/AudioPlayerContext";
import { MusicMiniControls } from "@/components/chrome/MusicMiniControls";

/**
 * A pulsing "now playing" dot badged onto the Music Lab nav button while a
 * track is actively playing (hidden on /music — you're already there). Kept as
 * its own subscriber so live `currentTime` ticks don't re-render the whole frame.
 */
function TvMusicDot({ isPowered }: { isPowered: boolean }) {
  const { isPlaying } = useAudioPlayer();
  const pathname = usePathname();
  if (!isPowered || !isPlaying || pathname === "/music") return null;
  return (
    <span
      className="signal-dot absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-2 z-20 pointer-events-none"
      aria-hidden
    />
  );
}

/**
 * The Music Lab nav button, plus a hover/focus "now playing" quick-panel that
 * unfurls beneath it once a listening session is live — so playback is
 * controllable from any app-mode page without crowding the nav row. The panel
 * is gated to hover-capable pointers (see `.tv-music-popover` in globals.css):
 * on touch/phones it never appears — the pulsing dot signals playback and a tap
 * opens the full `/music` console. Isolated subscriber so live `currentTime`
 * ticks (the popover header) don't re-render the whole frame.
 */
function TvMusicControl({ isPowered }: { isPowered: boolean }) {
  const {
    isPlaying,
    currentTime,
    currentTrack,
    volume,
    isMuted,
    handleVolumeChange,
    toggleMute,
  } = useAudioPlayer();
  const pathname = usePathname();
  const { themeMode } = useTheme();
  const isActive = pathname === "/music";
  const sessionActive = isPlaying || currentTime > 0;
  const showPanel = isPowered && sessionActive && !isActive;

  return (
    <div className="tv-music-control">
      <Link
        href="/music"
        className={`tv-console-btn ${isActive ? "active" : ""}`}
        aria-label="Music Lab"
        onMouseEnter={() => isPowered && audioSynth.playHover()}
        onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }}
        style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
      >
        {isPowered && isActive && (
          <motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />
        )}
        <TvMusicDot isPowered={isPowered} />
        <Headphones className="w-5 h-5 relative z-10" />
        {/* When the quick-panel is live it replaces the tooltip on hover. */}
        {!showPanel && <span className="tooltip">Music Lab <KeyHint id="nav-music" /></span>}
      </Link>

      {showPanel && (
        <div className="tv-music-popover">
          <div className="tv-music-popover__card">
            {/* Header — status dot + track title */}
            <div className="flex items-center gap-2">
              <span className={`shrink-0 w-2 h-2 rounded-full bg-accent-2 ${isPlaying ? "signal-dot" : ""}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[8.5px] font-mono uppercase tracking-[0.18em] text-text-low leading-none mb-1">
                  {isPlaying ? "Now Playing" : "Paused"}
                </p>
                <p className="text-[12px] font-semibold text-text-hi truncate leading-tight">
                  {currentTrack.title}
                </p>
              </div>
            </div>

            {/* Short description */}
            {currentTrack.description && (
              <p className="text-[10px] text-text-low leading-relaxed line-clamp-2">
                {currentTrack.description}
              </p>
            )}

            {/* Transport + compact volume */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <MusicMiniControls variant="dock" />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { audioSynth.playClick(); toggleMute(); }}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-text-mid hover:text-text-hi hover:bg-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-accent-3" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="w-16 accent-accent-2 cursor-pointer bg-white/10 h-1 rounded-full appearance-none outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TvFrameProps {
  children: React.ReactNode;
}

export function TvFrame({ children }: TvFrameProps) {
  const { themeMode, setThemeMode } = useTheme();
  const [isCrtEnabled, setIsCrtEnabled] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isPoweringOn, setIsPoweringOn] = useState(false);
  const [isPowered, setIsPowered] = useState(true);
  const isConsoleDocked = false;
  const showTvNavigation = true;
  const showTvStickyBar = false;
  const [isUserAuthed, setIsUserAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isFullscreen, isSupported: isFullscreenSupported, toggle: toggleFullscreenApi } = useFullscreen();

  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Set the body class to app-mode-active on mount
  useEffect(() => {
    document.body.classList.add("app-mode-active");
    document.body.classList.remove("brochure-mode-active");
    return () => {
      document.body.classList.remove("app-mode-active");
    };
  }, []);
  useEffect(() => {
    const syncAuthTimer = setTimeout(() => {
      const isAuthed = sessionStorage.getItem("ym_authed");
      const role = sessionStorage.getItem("ym_role");
      setIsUserAuthed(isAuthed === "1");
      setIsAdmin(isAuthed === "1" && role === "admin");
    }, 0);

    return () => clearTimeout(syncAuthTimer);
  }, [pathname]);

  const handleCrtToggle = () => {
    if (!isPowered) return;
    // Play power off sweep
    audioSynth.playCrtOff();
    setIsCollapsing(true);

    setTimeout(() => {
      setIsCrtEnabled((prev) => !prev);
      setIsCollapsing(false);
      
      // Play power on chime
      audioSynth.playCrtOn();
      setIsPoweringOn(true);

      setTimeout(() => {
        setIsPoweringOn(false);
      }, 200);
    }, 400);
  };

  const togglePower = () => {
    if (isPowered) {
      // Turn off: audio sound, collapse screen, and power off
      audioSynth.playCrtOff();
      setIsCollapsing(true);
      setTimeout(() => {
        setIsPowered(false);
        setIsCollapsing(false);
      }, 400);
    } else {
      // Turn on: audio sound, immediately power on, glitch and expand
      audioSynth.playCrtOn();
      setIsPowered(true);
      setIsPoweringOn(true);
      setIsGlitching(true);

      setTimeout(() => {
        setIsPoweringOn(false);
      }, 220);

      setTimeout(() => {
        setIsGlitching(false);
      }, 400);
    }
  };

  const toggleFullscreen = () => {
    if (!isPowered || !isFullscreenSupported) return;
    audioSynth.playClick();
    void toggleFullscreenApi();
  };

  // Let the global `⇧Q` shortcut run this instance's power toggle. The listener
  // binds once; a ref (assigned in an effect, not during render) keeps it
  // pointed at the latest closure.
  const togglePowerRef = useRef(togglePower);
  useEffect(() => {
    togglePowerRef.current = togglePower;
  });
  useEffect(() => {
    const handler = () => togglePowerRef.current();
    window.addEventListener(POWER_TOGGLE_EVENT, handler);
    return () => window.removeEventListener(POWER_TOGGLE_EVENT, handler);
  }, []);

  const fullscreenButtonStyle =
    !isPowered || !isFullscreenSupported
      ? { opacity: 0.3, cursor: "not-allowed" }
      : undefined;
  const accountHref = isUserAuthed ? "/dashboard" : "/login";
  const isAccountActive = pathname === "/login" || (isUserAuthed && pathname.startsWith("/dashboard"));
  const logoOnlySrc = "/images/logo/logo-white-logo-only.svg";
  const logoToneFilter =
    themeMode === "light"
      ? "brightness(0) saturate(100%)"
      : "drop-shadow(0 0 8px rgba(110,86,255,0.6)) drop-shadow(0 0 3px rgba(0,224,203,0.4))";

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh]"
    >
      <div className={`tv-frame-outer ${isCrtEnabled ? "crt-active" : ""}`}>
        {/* ── Top Chrome Control Bar ── */}
        {showTvNavigation && (
          <div className="tv-chrome-bar">

            {/* Left: Logo & Title */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <Link
                href="/"
                onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }}
                onMouseEnter={() => isPowered && audioSynth.playHover()}
                className="tv-chrome-logo"
                aria-label="YantraCore Portal"
                style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
              >
                <ColorfulLogo size={36} />
              </Link>
              <Link
                href="/"
                onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }}
                onMouseEnter={() => isPowered && audioSynth.playHover()}
                style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
                className="hidden sm:inline-flex items-center hover:opacity-80 transition-opacity"
              >
                <YantraElectricTitle size="sm" className="select-none" />
              </Link>
            </div>

            {/* Right: Three button groups */}
            <div className="tv-chrome-controls">

              {/* Group 1 — Navigation pages (top bar on tablet/desktop; on phones
                  these move to the bottom tab bar, so this group is CSS-hidden) */}
              <div className="tv-chrome-btn-group tv-chrome-nav-pages">
                <Link href="/" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/" ? "active" : ""}`} aria-label="Home" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Home className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Home</span>
                  <span className="tooltip">Home <KeyHint id="nav-home" /></span>
                </Link>
                <Link href="/projects" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/projects" ? "active" : ""}`} aria-label="Projects" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/projects" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Boxes className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Projects</span>
                  <span className="tooltip">Projects</span>
                </Link>
                <Link href="/work" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/work" ? "active" : ""}`} aria-label="Work" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/work" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Briefcase className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Work</span>
                  <span className="tooltip">Work</span>
                </Link>
                <Link href="/about" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/about" ? "active" : ""}`} aria-label="About" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/about" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Info className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">About</span>
                  <span className="tooltip">About</span>
                </Link>
                <Link href="/technologies" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/technologies" ? "active" : ""}`} aria-label="Technologies" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/technologies" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <StellarOrbitIcon className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Technologies</span>
                  <span className="tooltip">Technologies <KeyHint id="nav-technologies" /></span>
                </Link>
                <Link href="/reach" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/reach" ? "active" : ""}`} aria-label="Reach" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/reach" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Globe2 className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Reach</span>
                  <span className="tooltip">Reach <KeyHint id="nav-entryport" /></span>
                </Link>
                <Link href="/contact" className={`tv-console-btn tv-console-btn--labeled ${pathname === "/contact" ? "active" : ""}`} aria-label="Contact" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/contact" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Mail className="w-5 h-5 relative z-10" />
                  <span className="tv-console-label">Contact</span>
                  <span className="tooltip">Contact <KeyHint id="nav-contact" /></span>
                </Link>
              </div>

              {/* Group 2 — Theme and Settings */}
              <div className="tv-chrome-btn-group">
                <button className="tv-console-btn relative z-10" onClick={() => { if (isPowered) { audioSynth.playClick(); setThemeMode(themeMode === "dark" ? "light" : "dark"); } }} onMouseEnter={() => isPowered && audioSynth.playHover()} aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`} disabled={!isPowered} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {themeMode === "dark" ? <SunCoreIcon className="w-5 h-5 relative z-10" /> : <MoonCrescentIcon className="w-5 h-5 relative z-10" />}
                  <span className="tooltip">{themeMode === "dark" ? "Light Theme" : "Dark Theme"} <KeyHint id="view-theme" /></span>
                </button>
                <TvMusicControl isPowered={isPowered} />
                <Link href="/settings" className={`tv-console-btn ${pathname === "/settings" ? "active" : ""}`} aria-label="System Settings" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/settings" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <ChipSettingsIcon className="w-5 h-5 settings-icon relative z-10" />
                  <span className="tooltip">Settings <KeyHint id="nav-settings" /></span>
                </Link>
              </div>
 
              {/* Group 3 — Account and Fullscreen */}
              <div className="tv-chrome-btn-group">
                <Link href={accountHref} className={`tv-console-btn tv-console-account-btn ${isAccountActive ? "active" : ""}`} aria-label="Account" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}>
                  {isPowered && isAccountActive && (<motion.span layoutId="tvAccountActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-2/20 border border-accent-2/45 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_14px_rgba(0,158,143,0.35)]" : "shadow-[0_0_14px_rgba(0,224,203,0.35)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <UserIcon className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Account <KeyHint id="nav-account" /></span>
                </Link>
                <button className="tv-console-btn relative z-10" onClick={toggleFullscreen} onMouseEnter={() => isPowered && isFullscreenSupported && audioSynth.playHover()} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"} aria-pressed={isFullscreen} disabled={!isPowered || !isFullscreenSupported} style={fullscreenButtonStyle}>
                  {isFullscreen ? <Minimize2 className="w-5 h-5 relative z-10" /> : <Maximize2 className="w-5 h-5 relative z-10" />}
                  <span className="tooltip">{isFullscreen ? "Exit Full Screen" : "Full Screen"} <KeyHint id="view-fullscreen" /></span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Sticky top bar (hidden) ── */}
        {showTvStickyBar && (
        <div
          className={`tv-sticky-bar ${isConsoleDocked ? "tv-sticky-bar--visible" : ""}`}
          aria-hidden={!isConsoleDocked}
        >
          {/* Logo side */}
          <div className="tv-sticky-bar__logo flex items-center gap-3">
            <Link
              href="/"
              aria-label="YantraCore — home"
              className={`flex items-center p-1 rounded-lg border transition-all duration-300 ${!pathname.startsWith("/dashboard") ? "bg-accent-1/10 border-accent-1/30" : "border-transparent opacity-60 hover:opacity-100"}`}
              tabIndex={isConsoleDocked ? 0 : -1}
              onClick={(e) => {
                if (!isPowered) e.preventDefault();
                else audioSynth.playClick();
              }}
              onMouseEnter={() => isPowered && audioSynth.playHover()}
            >
              <img
                src={logoOnlySrc}
                alt="YantraCore Logo"
                className="w-8 h-8 object-contain"
                style={{ filter: logoToneFilter }}
              />
            </Link>

            {isAdmin && (
              <Link
                href="/dashboard"
                aria-label="Control Center"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider font-semibold transition-all duration-300 ${
                  pathname.startsWith("/dashboard")
                    ? (themeMode === "light"
                        ? "bg-accent-2/10 border-accent-2/35 text-accent-2 shadow-[0_0_10px_rgba(0,158,143,0.18)]"
                        : "bg-accent-2/15 border-accent-2/40 text-text-hi shadow-[0_0_12px_rgba(0,224,203,0.35)]")
                    : (themeMode === "light"
                        ? "border-black/10 text-text-mid opacity-70 hover:opacity-100 hover:border-black/20"
                        : "border-white/10 text-text-mid opacity-60 hover:opacity-100 hover:border-white/20")
                }`}
                tabIndex={isConsoleDocked ? 0 : -1}
                onClick={(e) => {
                  if (!isPowered) e.preventDefault();
                  else audioSynth.playClick();
                }}
                onMouseEnter={() => isPowered && audioSynth.playHover()}
              >
                <ControlSlidersIcon className={`w-[15px] h-[15px] transition-all duration-300 ${
                  pathname.startsWith("/dashboard")
                    ? (themeMode === "light"
                        ? "text-accent-2 drop-shadow-[0_0_4px_rgba(0,158,143,0.4)] scale-105"
                        : "text-accent-2 drop-shadow-[0_0_6px_rgba(0,224,203,0.6)] scale-105")
                    : "text-text-mid opacity-60"
                }`} />
                <span className={`w-1.5 h-1.5 rounded-full ${
                  pathname.startsWith("/dashboard")
                    ? "bg-accent-2 animate-pulse"
                    : (themeMode === "light" ? "bg-black/20" : "bg-white/30")
                }`} />
                <span>Control Center</span>
              </Link>
            )}
          </div>

          {/* Nav buttons side */}
          <div className="tv-sticky-bar__nav">


            {/* Music */}
            <Link
              href="/music"
              className={`tv-console-btn ${pathname === "/music" ? "active" : ""}`}
              aria-label="Music Lab"
              tabIndex={isConsoleDocked ? 0 : -1}
              onMouseEnter={() => isPowered && audioSynth.playHover()}
              onClick={(e) => {
                if (!isPowered) e.preventDefault();
                else audioSynth.playClick();
              }}
              style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
            >
              {isPowered && pathname === "/music" && (
                <motion.span
                  layoutId="tvActivePillSticky"
                  className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
              )}
              <Headphones className="w-5 h-5 relative z-10" />
              <span className="tooltip">Music Lab</span>
            </Link>
 
            {/* Settings */}
            <Link
              href="/settings"
              className={`tv-console-btn ${pathname === "/settings" ? "active" : ""}`}
              aria-label="System Settings"
              tabIndex={isConsoleDocked ? 0 : -1}
              onMouseEnter={() => isPowered && audioSynth.playHover()}
              onClick={(e) => {
                if (!isPowered) e.preventDefault();
                else audioSynth.playClick();
              }}
              style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
            >
              {isPowered && pathname === "/settings" && (
                <motion.span
                  layoutId="tvActivePillSticky"
                  className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
              )}
              <ChipSettingsIcon className="w-5 h-5 settings-icon relative z-10" />
              <span className="tooltip">Settings</span>
            </Link>

            {/* Theme Toggle (Sticky Bar) */}
            <button
              onClick={() => {
                if (isPowered) {
                  audioSynth.playClick();
                  setThemeMode(themeMode === "dark" ? "light" : "dark");
                }
              }}
              onMouseEnter={() => isPowered && audioSynth.playHover()}
              className="tv-console-btn relative z-10"
              aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
              tabIndex={isConsoleDocked ? 0 : -1}
              disabled={!isPowered}
              style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
            >
              {themeMode === "dark" ? (
                <SunCoreIcon className="w-5 h-5 relative z-10" />
              ) : (
                <MoonCrescentIcon className="w-5 h-5 relative z-10" />
              )}
              <span className="tooltip">{themeMode === "dark" ? "Light Theme" : "Dark Theme"}</span>
            </button>

            {/* Fullscreen Toggle (Sticky Bar) */}
            <button
              onClick={toggleFullscreen}
              onMouseEnter={() => isPowered && isFullscreenSupported && audioSynth.playHover()}
              className="tv-console-btn relative z-10"
              aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
              aria-pressed={isFullscreen}
              tabIndex={isConsoleDocked ? 0 : -1}
              disabled={!isPowered || !isFullscreenSupported}
              style={fullscreenButtonStyle}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 relative z-10" />
              ) : (
                <Maximize2 className="w-5 h-5 relative z-10" />
              )}
              <span className="tooltip">{isFullscreen ? "Exit Full Screen" : "Full Screen"}</span>
            </button>
          </div>

          <Link
            href={accountHref}
            className={`tv-console-btn tv-console-account-btn tv-sticky-bar__account ${isAccountActive ? "active" : ""}`}
            aria-label="Account"
            tabIndex={isConsoleDocked ? 0 : -1}
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
          >
            {isPowered && isAccountActive && (
              <motion.span
                layoutId="tvAccountActivePillSticky"
                className={`absolute inset-0 rounded-[7px] bg-accent-2/20 border border-accent-2/45 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_14px_rgba(0,158,143,0.35)]" : "shadow-[0_0_14px_rgba(0,224,203,0.35)]"}`}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <UserIcon className="w-5 h-5 relative z-10" />
            <span className="tooltip">Account</span>
          </Link>
        </div>
        )}

        <div className="tv-frame-bezel">
          <div className="tv-screen-glass">
            {isPowered && isCrtEnabled && (
              <>
                <div className="crt-scanlines pointer-events-none" />
                <div className="crt-phosphor pointer-events-none" />
                <div className="crt-curvature pointer-events-none" />
              </>
            )}

            {/* CRT power-on static burst (shown only while the screen re-ignites) */}
            {isGlitching && (
              <div className="absolute inset-0 bg-[#06070d] z-[99] pointer-events-none flex flex-col items-center justify-center">
                <div className="crt-glitch-static" />
                <div className="crt-glitch-line" />
              </div>
            )}

            <div
              className={`tv-screen-content ${isCollapsing ? "crt-collapse" : ""} ${
                isPoweringOn ? "crt-power-on" : ""
              }`}
              style={{
                background: !isPowered ? "#020205" : undefined,
                transition: "background 0.5s ease"
              }}
            >
              {isPowered ? children : <div className="absolute inset-0 bg-[#020205]" />}
            </div>

            {/* Phone-only primary nav — thumb-reachable tab bar (see TvBottomNav) */}
            <TvBottomNav isPowered={isPowered} />
          </div>


        </div>
      </div>
    </section>
  );
}

/**
 * Mobile primary navigation — the five page destinations as a bottom tab bar.
 * The top chrome bar can't fit ten 44px targets on a phone, so on `<md` the
 * page-nav group is hidden up there (`.tv-chrome-nav-pages`) and these
 * thumb-reachable tabs take over. Rendered as a flex sibling *below* the screen
 * content (so it never overlaps pages) and hidden from `md` up via CSS.
 */
function TvBottomNav({ isPowered }: { isPowered: boolean }) {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/projects", label: "Projects", Icon: Boxes },
    { href: "/work", label: "Work", Icon: Briefcase },
    { href: "/about", label: "About", Icon: Info },
    { href: "/technologies", label: "Tech", Icon: StellarOrbitIcon },
    { href: "/reach", label: "Reach", Icon: Globe2 },
    { href: "/contact", label: "Contact", Icon: Mail },
  ] as const;
  return (
    <nav className="tv-bottom-nav" aria-label="Primary">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`tv-bottom-nav-btn ${active ? "active" : ""}`}
            onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }}
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            style={!isPowered ? { opacity: 0.3, pointerEvents: "none" } : undefined}
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="tv-bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
