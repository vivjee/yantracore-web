"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Maximize2, Minimize2 } from "lucide-react";
import {
  TvConsoleIcon,
  UserIcon,
  SynthMusicIcon,
  ChipSettingsIcon,
  ControlSlidersIcon,
  SunCoreIcon,
  MoonCrescentIcon,
} from "@/components/chrome/NavIcons";
import { motion } from "framer-motion";
import { audioSynth } from "@/lib/audio";
import { useTheme } from "@/lib/theme/ThemeProvider";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);

  const pathname = usePathname();
  const isFirstMount = useRef(true);
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

  useEffect(() => {
    const syncFullscreenTimer = setTimeout(() => {
      setIsFullscreenSupported(Boolean(document.fullscreenEnabled));
      setIsFullscreen(Boolean(document.fullscreenElement));
    }, 0);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      clearTimeout(syncFullscreenTimer);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Trigger CRT Static Channel Glitch on pathname changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!isPowered) return;
    
    // Play static channel change sound
    audioSynth.playStatic();
    const glitchStartTimer = setTimeout(() => {
      setIsGlitching(true);
    }, 0);
    
    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 220);

    return () => {
      clearTimeout(glitchStartTimer);
      clearTimeout(timer);
    };
  }, [pathname, isPowered]);

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

  const toggleFullscreen = async () => {
    if (!isPowered || !document.fullscreenEnabled) return;

    audioSynth.playClick();

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {}
  };

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
      className="relative w-full h-screen p-[5.6px] pb-[8.4px] md:p-[11.2px] md:pb-[11.2px] flex flex-col justify-center"
      style={{
        boxShadow: "none",
      }}
    >
      <div className={`tv-frame-outer ${isCrtEnabled ? "crt-active" : ""}`}>
        {showTvNavigation && (
          <>
        {/* Top-Left Console Logo/Tabs Extension */}
        <div className={`tv-console-tabs-container${isConsoleDocked ? " console-docked" : ""}`}>
          <Link
            href="/"
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            className={`tv-console-tab ${!pathname.startsWith("/dashboard") ? "active" : ""}`}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
            aria-label="YantraCore Portal"
          >
            {!pathname.startsWith("/dashboard") && <div className="tv-console-nav-blend" />}
            <div className="flex items-center select-none">
              <img
                src={logoOnlySrc}
                alt="YantraCore Logo"
                className="w-10 h-10 object-contain"
                style={{ filter: logoToneFilter }}
              />
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard"
              onClick={(e) => {
                if (!isPowered) e.preventDefault();
                else audioSynth.playClick();
              }}
              onMouseEnter={() => isPowered && audioSynth.playHover()}
              className={`tv-console-tab ${pathname.startsWith("/dashboard") ? "active" : ""}`}
              style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
              aria-label="Control Center"
            >
              {pathname.startsWith("/dashboard") && <div className="tv-console-nav-blend" />}
              {pathname.startsWith("/dashboard") && (
                <span className={`absolute top-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 z-30 ${themeMode === "light" ? "bg-accent-1 shadow-[0_0_8px_var(--accent-1)]" : "bg-accent-2 shadow-[0_0_10px_var(--accent-2)]"}`} />
              )}
              <div className="flex items-center gap-2 select-none text-[10px] font-mono uppercase tracking-wider font-semibold relative z-20">
                <ControlSlidersIcon className={`w-[18px] h-[18px] transition-all duration-300 ${pathname.startsWith("/dashboard") ? (themeMode === "light" ? "text-accent-1 scale-110 drop-shadow-[0_0_6px_rgba(110,86,255,0.4)]" : "text-accent-2 scale-110 drop-shadow-[0_0_8px_rgba(0,224,203,0.75)]") : "text-text-mid opacity-60"}`} />
                <span className={`w-1.5 h-1.5 rounded-full ${pathname.startsWith("/dashboard") ? (themeMode === "light" ? "bg-accent-1 animate-pulse" : "bg-accent-2 animate-pulse") : (themeMode === "light" ? "bg-black/20" : "bg-white/30")}`} />
                <span className={pathname.startsWith("/dashboard") ? "text-text-hi font-bold" : "text-text-mid"}>Control Center</span>
              </div>
            </Link>
          )}
        </div>

        {/* Top-Right Console Panel Extension */}
        <div className={`tv-console-nav-panel${isConsoleDocked ? " console-docked" : ""}`}>
          <div className="tv-console-nav-blend" />

          {/* Home / Showcase feed */}
          <Link
            href="/"
            className={`tv-console-btn ${pathname === "/" ? "active" : ""}`}
            aria-label="Showcase Feed"
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
          >
            {isPowered && pathname === "/" && (
              <motion.span
                layoutId="tvActivePill"
                className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <TvConsoleIcon className="w-4 h-4 relative z-10" />
            <span className="tooltip">Showcase</span>
          </Link>

          {/* Entryport Earth */}
          <Link
            href="/entryport"
            className={`tv-console-btn ${pathname === "/entryport" ? "active" : ""}`}
            aria-label="Entryport Earth"
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
          >
            {isPowered && pathname === "/entryport" && (
              <motion.span
                layoutId="tvActivePill"
                className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <Globe2 className="w-4 h-4 relative z-10" />
            <span className="tooltip">Entryport Earth</span>
          </Link>


          {/* Ambient Music */}
          <Link
            href="/music"
            className={`tv-console-btn ${pathname === "/music" ? "active" : ""}`}
            aria-label="Ambient Music"
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
          >
            {isPowered && pathname === "/music" && (
              <motion.span
                layoutId="tvActivePill"
                className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <SynthMusicIcon className="w-4 h-4 relative z-10" />
            <span className="tooltip">Music</span>
          </Link>

          {/* System Settings */}
          <Link
            href="/settings"
            className={`tv-console-btn ${pathname === "/settings" ? "active" : ""}`}
            aria-label="System Settings"
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
          >
            {isPowered && pathname === "/settings" && (
              <motion.span
                layoutId="tvActivePill"
                className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <ChipSettingsIcon className="w-4 h-4 settings-icon relative z-10" />
            <span className="tooltip">Settings</span>
          </Link>

          {/* Theme Toggle */}
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
            disabled={!isPowered}
            style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
          >
            {themeMode === "dark" ? (
              <SunCoreIcon className="w-4 h-4 relative z-10" />
            ) : (
              <MoonCrescentIcon className="w-4 h-4 relative z-10" />
            )}
            <span className="tooltip">{themeMode === "dark" ? "Light Theme" : "Dark Theme"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            onMouseEnter={() => isPowered && isFullscreenSupported && audioSynth.playHover()}
            className="tv-console-btn relative z-10"
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
            aria-pressed={isFullscreen}
            disabled={!isPowered || !isFullscreenSupported}
            style={fullscreenButtonStyle}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 relative z-10" />
            ) : (
              <Maximize2 className="w-4 h-4 relative z-10" />
            )}
            <span className="tooltip">{isFullscreen ? "Exit Full Screen" : "Full Screen"}</span>
          </button>
        </div>

        {/* Top-Right Account Attachment */}
        <div className={`tv-console-user-panel${isConsoleDocked ? " console-docked" : ""}`}>
          <div className="tv-console-nav-blend" />
          <Link
            href={accountHref}
            className={`tv-console-btn tv-console-account-btn ${isAccountActive ? "active" : ""}`}
            aria-label="Account"
            onMouseEnter={() => isPowered && audioSynth.playHover()}
            onClick={(e) => {
              if (!isPowered) e.preventDefault();
              else audioSynth.playClick();
            }}
            style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}
          >
            {isPowered && isAccountActive && (
              <motion.span
                layoutId="tvAccountActivePill"
                className="absolute inset-0 rounded-[7px] bg-accent-2/20 border border-accent-2/45 shadow-[0_0_14px_rgba(0,224,203,0.35)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <UserIcon className="w-4 h-4 relative z-10" />
            <span className="tooltip">Account</span>
          </Link>
        </div>

        {/* ── Sticky top bar (detaches from TV → mounts to viewport top) ── */}
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
                        ? "bg-accent-1/10 border-accent-1/30 text-accent-1 shadow-[0_0_10px_rgba(110,86,255,0.15)]"
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
                        ? "text-accent-1 drop-shadow-[0_0_4px_rgba(110,86,255,0.35)] scale-105"
                        : "text-accent-2 drop-shadow-[0_0_6px_rgba(0,224,203,0.6)] scale-105")
                    : "text-text-mid opacity-60"
                }`} />
                <span className={`w-1.5 h-1.5 rounded-full ${
                  pathname.startsWith("/dashboard")
                    ? (themeMode === "light" ? "bg-accent-1 animate-pulse" : "bg-accent-2 animate-pulse")
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
              aria-label="Ambient Music"
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
                  className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
              )}
              <SynthMusicIcon className="w-4 h-4 relative z-10" />
              <span className="tooltip">Music</span>
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
                  className="absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 shadow-[0_0_12px_rgba(110,86,255,0.3)] pointer-events-none"
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                />
              )}
              <ChipSettingsIcon className="w-4 h-4 settings-icon relative z-10" />
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
                <SunCoreIcon className="w-4 h-4 relative z-10" />
              ) : (
                <MoonCrescentIcon className="w-4 h-4 relative z-10" />
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
                <Minimize2 className="w-4 h-4 relative z-10" />
              ) : (
                <Maximize2 className="w-4 h-4 relative z-10" />
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
                className="absolute inset-0 rounded-[7px] bg-accent-2/20 border border-accent-2/45 shadow-[0_0_14px_rgba(0,224,203,0.35)] pointer-events-none"
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              />
            )}
            <UserIcon className="w-4 h-4 relative z-10" />
            <span className="tooltip">Account</span>
          </Link>
        </div>
        )}
          </>
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

            {/* CRT Channel Static Glitch Overlay */}
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
          </div>

          {/* Retro Bezel Console Bar */}
          <div className="tv-frame-controls">
            <div className="flex items-center gap-3">
              <span className="tv-badge">YANTRACORE // TV-100</span>
              <div className="tv-lights">
                <span className={`tv-light-dot ${isPowered ? "green" : ""}`} style={!isPowered ? { backgroundColor: '#ff4f7e', color: '#ff4f7e', boxShadow: 'none' } : undefined} />
              </div>
            </div>



            <div className="flex items-center gap-2">
              <button
                onClick={handleCrtToggle}
                onMouseEnter={() => isPowered && audioSynth.playHover()}
                className="crt-toggle-btn text-[9px] font-mono tracking-wider"
                title="Toggle CRT Retro Filter"
                disabled={!isPowered}
                style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
              >
                CRT: {isCrtEnabled ? "ON" : "OFF"}
              </button>
              <button
                onClick={togglePower}
                onMouseEnter={() => audioSynth.playHover()}
                className="crt-toggle-btn text-[9px] font-mono tracking-wider font-semibold"
                style={{
                  background: isPowered ? "rgba(255, 79, 176, 0.12)" : "rgba(255, 255, 255, 0.02)",
                  borderColor: isPowered ? "var(--accent-3)" : "rgba(255, 255, 255, 0.08)",
                  color: isPowered ? "var(--text-hi)" : "var(--text-low)",
                }}
                title="Toggle TV Power"
              >
                POWER: {isPowered ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
