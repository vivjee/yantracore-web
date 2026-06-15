"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Maximize2, Minimize2, Home, Headphones, Mail } from "lucide-react";
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
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";

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
      className="relative w-full h-screen"
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

              {/* Group 1 — Navigation pages */}
              <div className="tv-chrome-btn-group">
                <Link href="/" className={`tv-console-btn ${pathname === "/" ? "active" : ""}`} aria-label="Home" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Home className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Home</span>
                </Link>
                <Link href="/entryport" className={`tv-console-btn ${pathname === "/entryport" ? "active" : ""}`} aria-label="Live Activity" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/entryport" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Globe2 className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Live Activity</span>
                </Link>
                <Link href="/technologies" className={`tv-console-btn ${pathname === "/technologies" ? "active" : ""}`} aria-label="Technologies" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/technologies" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <StellarOrbitIcon className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Technologies</span>
                </Link>
                <Link href="/music" className={`tv-console-btn ${pathname === "/music" ? "active" : ""}`} aria-label="Music Lab" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/music" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Headphones className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Music Lab</span>
                </Link>
                <Link href="/contact" className={`tv-console-btn ${pathname === "/contact" ? "active" : ""}`} aria-label="Contact" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/contact" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <Mail className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Contact</span>
                </Link>
              </div>

              {/* Group 2 — Theme and Settings */}
              <div className="tv-chrome-btn-group">
                <button className="tv-console-btn relative z-10" onClick={() => { if (isPowered) { audioSynth.playClick(); setThemeMode(themeMode === "dark" ? "light" : "dark"); } }} onMouseEnter={() => isPowered && audioSynth.playHover()} aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`} disabled={!isPowered} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {themeMode === "dark" ? <SunCoreIcon className="w-5 h-5 relative z-10" /> : <MoonCrescentIcon className="w-5 h-5 relative z-10" />}
                  <span className="tooltip">{themeMode === "dark" ? "Light Theme" : "Dark Theme"}</span>
                </button>
                <Link href="/settings" className={`tv-console-btn ${pathname === "/settings" ? "active" : ""}`} aria-label="System Settings" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}>
                  {isPowered && pathname === "/settings" && (<motion.span layoutId="tvActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-1/20 border border-accent-1/40 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_12px_rgba(79,53,255,0.25)]" : "shadow-[0_0_12px_rgba(110,86,255,0.3)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <ChipSettingsIcon className="w-5 h-5 settings-icon relative z-10" />
                  <span className="tooltip">Settings</span>
                </Link>
              </div>
 
              {/* Group 3 — Account and Fullscreen */}
              <div className="tv-chrome-btn-group">
                <Link href={accountHref} className={`tv-console-btn tv-console-account-btn ${isAccountActive ? "active" : ""}`} aria-label="Account" onMouseEnter={() => isPowered && audioSynth.playHover()} onClick={(e) => { if (!isPowered) e.preventDefault(); else audioSynth.playClick(); }} style={!isPowered ? { opacity: 0.3, cursor: "not-allowed" } : undefined}>
                  {isPowered && isAccountActive && (<motion.span layoutId="tvAccountActivePill" className={`absolute inset-0 rounded-[7px] bg-accent-2/20 border border-accent-2/45 pointer-events-none ${themeMode === "light" ? "shadow-[0_0_14px_rgba(0,158,143,0.35)]" : "shadow-[0_0_14px_rgba(0,224,203,0.35)]"}`} transition={{ type: "spring", stiffness: 350, damping: 20 }} />)}
                  <UserIcon className="w-5 h-5 relative z-10" />
                  <span className="tooltip">Account</span>
                </Link>
                <button className="tv-console-btn relative z-10" onClick={toggleFullscreen} onMouseEnter={() => isPowered && isFullscreenSupported && audioSynth.playHover()} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"} aria-pressed={isFullscreen} disabled={!isPowered || !isFullscreenSupported} style={fullscreenButtonStyle}>
                  {isFullscreen ? <Minimize2 className="w-5 h-5 relative z-10" /> : <Maximize2 className="w-5 h-5 relative z-10" />}
                  <span className="tooltip">{isFullscreen ? "Exit Full Screen" : "Full Screen"}</span>
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


        </div>
      </div>
    </section>
  );
}
