"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { audioSynth } from "@/lib/audio";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";

/* ─── Nav link definitions ───────────────────────────────────────────── */

/** Desktop pill links — real destinations only */
const desktopLinks = [
  { label: "Studio",       href: "#studio" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Lab",          href: "#lab" },
  { label: "Technologies", href: "/technologies" },
];

/** Mobile full-screen menu links (same destinations) */
const mobileLinks = [
  { label: "Studio",       href: "#studio" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Lab",          href: "#lab" },
  { label: "Signal",       href: "#signal" },
  { label: "Technologies", href: "/technologies" },
];

/**
 * Smoothly scroll to a hash anchor using native browser scrollIntoView.
 */
function scrollToAnchor(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Hamburger icon ─────────────────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div
      data-menu-open={open ? "true" : "false"}
      aria-hidden
      className="flex flex-col justify-center items-center gap-[7px] w-6 h-6"
    >
      <span className="ham-bar-top block h-[2px] w-6 rounded-full bg-current origin-center" />
      <span className="ham-bar-mid block h-[2px] w-6 rounded-full bg-current origin-center" />
      <span className="ham-bar-bot block h-[2px] w-6 rounded-full bg-current origin-center" />
    </div>
  );
}

/* ─── Mobile full-screen overlay ─────────────────────────────────────── */
function MobileMenu({
  open,
  onClose,
  firstFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  firstFocusRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  const lastFocusRef = useRef<HTMLButtonElement | null>(null);
  const { themeMode, setThemeMode } = useTheme();

  const toggleThemeMode = useCallback(() => {
    audioSynth.playClick();
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [themeMode, setThemeMode]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const first = firstFocusRef.current;
      const last  = lastFocusRef.current;
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    },
    [onClose, firstFocusRef]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ animation: "nav-overlay-in 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
    >
      {/* Deep ink backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "rgba(6, 7, 13, 0.95)",
          backdropFilter: "blur(60px) saturate(140%)",
          WebkitBackdropFilter: "blur(60px) saturate(140%)",
        }}
      />

      {/* Ambient glow — violet top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(110,86,255,0.6) 0%, transparent 70%)" }}
      />
      {/* Ambient glow — teal bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(0,224,203,0.5) 0%, transparent 70%)" }}
      />

      {/* Top bar — logo + close */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <Link
          href="/"
          onClick={onClose}
          aria-label="YantraCore — home"
          className="pointer-events-auto relative inline-block group"
        >
          <HeaderLogo size="small" />
        </Link>

        <div className="flex items-center gap-3">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="
              group w-10 h-10 rounded-full flex items-center justify-center
              text-text-mid hover:text-text-hi
              border border-white/[0.08] hover:border-white/[0.22]
              transition-all duration-300 cursor-pointer
            "
            aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
          >
            {themeMode === "dark" ? (
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            ref={lastFocusRef}
            className="
              group w-10 h-10 rounded-full flex items-center justify-center
              text-text-mid hover:text-text-hi
              border border-white/[0.08] hover:border-white/[0.22]
              transition-all duration-300 cursor-pointer
            "
          >
            <svg
              width="16" height="16" viewBox="0 0 16 16"
              fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main nav links — staggered spring entrance */}
      <nav
        aria-label="Mobile navigation"
        className="flex-1 flex flex-col justify-center px-8 pb-4"
      >
        <ul className="space-y-1" role="list">
          {mobileLinks.map((link, i) => (
            <li key={link.href} role="listitem">
              <Link
                href={link.href}
                ref={i === 0 ? firstFocusRef : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  // Small delay so the overlay exit animation starts before scroll
                  setTimeout(() => scrollToAnchor(link.href), 120);
                }}
                className="
                  group relative flex items-center gap-4 py-4
                  border-b border-white/[0.06] last:border-0
                  transition-all duration-300 hover:pl-3
                "
                style={{
                  animation: `nav-item-in 560ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms both`,
                }}
              >
                {/* Violet left accent bar */}
                <span
                  aria-hidden
                  className="
                    absolute left-0 top-1/2 -translate-y-1/2
                    w-[2px] rounded-full
                    bg-gradient-to-b from-accent-1 to-accent-2
                    h-0 group-hover:h-8
                    transition-all duration-400 origin-center
                  "
                />

                <span
                  className="
                    font-display font-semibold
                    text-text-mid transition-colors duration-300 group-hover:text-text-hi
                    leading-none select-none
                  "
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {link.label}
                </span>

                {/* Arrow */}
                <span
                  aria-hidden
                  className="
                    ml-auto font-mono text-sm text-text-faint self-end pb-1
                    opacity-0 group-hover:opacity-100
                    translate-x-0 group-hover:translate-x-1
                    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section — Login CTA + watermark */}
      <div
        className="px-8 pb-10 flex flex-col gap-6"
        style={{
          animation: `nav-footer-in 560ms cubic-bezier(0.22, 1, 0.36, 1) ${mobileLinks.length * 70 + 80}ms both`,
        }}
      >
        {/* Login CTA — gradient-bordered glass */}
        <Link
          href="/login"
          onClick={onClose}
          className="
            group relative flex items-center justify-center gap-2.5
            w-full py-4 rounded-2xl overflow-hidden
            font-mono text-sm uppercase tracking-[0.16em] text-text-hi
            transition-all duration-400
          "
          style={{
            background: "linear-gradient(135deg, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.08) 100%)",
            border: "1px solid rgba(110,86,255,0.35)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px -10px rgba(110,86,255,0.25)",
          }}
        >
          {/* Shine on hover */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)",
            }}
          />

          {/* User icon */}
          <svg
            width="16" height="16" viewBox="0 0 16 16"
            fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="relative text-accent-1 transition-colors duration-300 group-hover:text-accent-2"
            aria-hidden
          >
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
          </svg>

          <span className="relative">Log in to YantraCore</span>
        </Link>

        {/* Logo watermark */}
        <div className="flex items-center gap-3 opacity-40">
          <ColorfulLogo size={20} animate={false} />
          <span className="font-mono text-[10px] text-text-faint tracking-widest uppercase">
            {new Date().getFullYear()} YantraCore
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Header Logo with Shiny Glass Effect ───────────────────────────── */
export function HeaderLogo({ size = "large" }: { size?: "large" | "small" }) {
  const [hovered, setHovered] = useState(false);
  const { themeMode, logoHeartbeatEnabled } = useTheme();

  const isLarge = size === "large";

  // Container dimensions (aspect-ratio matched to logo 1.39 + padding)
  const containerClass = isLarge
    ? "relative flex items-center justify-center pointer-events-auto h-14 w-14 md:h-16 md:w-16"
    : "relative flex items-center justify-center pointer-events-auto h-10 w-10";

  // Logo image dimensions inside the glass circle
  const logoHeight = "h-full";
  const logoWidth = "w-full";

  const logoPadding = isLarge ? "p-1.5" : "p-1";

  // Breathing size for bloom blobs
  const bloomSize1 = isLarge ? 55 : 35;
  const bloomSize2 = isLarge ? 50 : 30;

  const idleGlow =
    "drop-shadow(0 0 10px rgba(110,86,255,0.45)) " +
    "drop-shadow(0 0 3px rgba(0,224,203,0.35)) " +
    "drop-shadow(0 2px 14px rgba(110,86,255,0.25))";

  const hoverGlow =
    "drop-shadow(0 0 20px rgba(110,86,255,0.85)) " +
    "drop-shadow(0 0 8px rgba(0,224,203,0.75)) " +
    "drop-shadow(0 0 28px rgba(255,79,176,0.45))";

  const logoSrc = "/images/logo/logo-white-no-text.svg";
  const logoToneFilter = themeMode === "light" ? "brightness(0) saturate(100%)" : "none";
  const ghostOpacity = themeMode === "light" ? "opacity-10" : "opacity-22";
  const ghostBlendMode = themeMode === "light" ? "multiply" : "screen";

  return (
    <div
      className={containerClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: logoHeartbeatEnabled ? "logo-heartbeat 1.5s ease-in-out infinite" : "none",
      }}
    >
      {/* 1. Deep glow behind the logo circle */}
      <div
        className="absolute inset-0 -z-20 rounded-full blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(110,86,255,0.6) 0%, rgba(0,224,203,0.2) 50%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* 2. Conic halo ring spinning in background */}
      <div
        className="absolute -z-10 flex items-center justify-center pointer-events-none"
        style={{
          animation: hovered ? "logo-halo-spin 8s linear infinite" : "logo-halo-spin 24s linear infinite",
        }}
        aria-hidden
      >
        <div
          className="rounded-full transition-all duration-700"
          style={{
            width: isLarge ? (hovered ? 84 : 76) : (hovered ? 54 : 48),
            height: isLarge ? (hovered ? 84 : 76) : (hovered ? 54 : 48),
            background: hovered
              ? "conic-gradient(from 0deg, rgba(255,79,176,0.35) 0%, rgba(255,180,84,0.3) 15%, rgba(110,86,255,0.35) 32%, rgba(0,224,203,0.3) 50%, rgba(255,79,176,0.35) 68%, rgba(255,255,255,0.25) 82%, rgba(255,79,176,0.35) 100%)"
              : "conic-gradient(from 0deg, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.18) 40%, rgba(255,79,176,0.14) 70%, rgba(110,86,255,0.22) 100%)",
            filter: hovered ? "blur(5px)" : "blur(8px)",
            opacity: hovered ? 0.48 : 0.32,
          }}
        />
      </div>

      {/* 3. Bloom blobs (breathing) */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none" aria-hidden>
        {/* Violet blob */}
        <div style={{
          position: "absolute",
          width: hovered ? bloomSize1 + 10 : bloomSize1,
          height: hovered ? bloomSize1 + 10 : bloomSize1,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,86,255,0.22) 0%, transparent 70%)",
          filter: "blur(10px)",
          animation: "logo-breathe 8s ease-in-out infinite",
          transition: "all 0.8s ease",
        }} />
        {/* Cyan blob */}
        <div style={{
          position: "absolute",
          width: hovered ? bloomSize2 + 10 : bloomSize2,
          height: hovered ? bloomSize2 + 10 : bloomSize2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,224,203,0.18) 0%, transparent 70%)",
          filter: "blur(8px)",
          transform: "translate(-12%, 12%)",
          animation: "logo-breathe 11s ease-in-out 1.5s infinite",
          transition: "all 0.8s ease",
        }} />
      </div>

      {/* 4. Glass backing stage (rounded rectangle shape matching container size) */}
      <div
        className={`absolute inset-0 -z-10 transition-all duration-700 ${isLarge ? "rounded-2xl" : "rounded-xl"}`}
        style={{
          width: "100%",
          height: "100%",
          background: themeMode === "light" 
            ? "#EEF2F6" 
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%)",
          border: themeMode === "light" ? "1px solid rgba(255, 255, 255, 0.8)" : "1px solid rgba(255, 255, 255, 0.04)",
          backdropFilter: themeMode === "light" ? "none" : "blur(24px) saturate(140%)",
          WebkitBackdropFilter: themeMode === "light" ? "none" : "blur(24px) saturate(140%)",
          boxShadow: themeMode === "light"
            ? (hovered ? "3px 3px 6px #cbd5e1, -3px -3px 6px #ffffff" : "4px 4px 8px #cbd5e1, -4px -4px 8px #ffffff")
            : (hovered ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)" : "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"),
        }}
        aria-hidden
      />

      {/* 5. Top specular (overhead light reflecting on the glass edge) */}
      <div
        className={`absolute top-[2px] ${isLarge ? "left-[4px] right-[4px]" : "left-[3px] right-[3px]"} h-[30%] -z-10 pointer-events-none opacity-40 ${isLarge ? "rounded-t-2xl" : "rounded-t-xl"}`}
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.22) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
        aria-hidden
      />

      {/* 6. Holographic shimmer sweep overlay on the entire glass stage */}
      <div
        className={`absolute inset-0 -z-10 pointer-events-none transition-all duration-500 ease ${isLarge ? "rounded-2xl" : "rounded-xl"}`}
        style={{
          background: hovered
            ? "linear-gradient(118deg, transparent 0%, rgba(255,79,176,0.15) 22%, rgba(255,255,255,0.35) 50%, rgba(0,224,203,0.15) 78%, transparent 100%)"
            : "linear-gradient(118deg, transparent 0%, transparent 34%, rgba(255,255,255,0.18) 50%, transparent 66%, transparent 100%)",
          backgroundSize: "300% 100%",
          animation: hovered ? "logo-shimmer 3.5s ease-in-out infinite" : "logo-shimmer 9s ease-in-out infinite",
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />

      {/* 7. Logo Stage Container (No rotation/tilt) */}
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${logoHeight} ${logoWidth}`}
        style={{
          filter: hovered ? hoverGlow : idleGlow,
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <div className={`relative w-full h-full ${logoPadding}`}>
          {/* Chromatic red ghost */}
          <div className="absolute inset-0 pointer-events-none select-none" style={{ padding: "inherit" }}>
            <img
              src={logoSrc}
              alt=""
              className={`w-full h-full object-contain mix-blend-${ghostBlendMode} ${ghostOpacity}`}
              style={{
                filter: themeMode === "light" 
                  ? "sepia(1) saturate(5) hue-rotate(-40deg) brightness(0.9)"
                  : "sepia(1) saturate(8) hue-rotate(-40deg) brightness(0.65)",
                animation: hovered ? "logo-chroma-r-wide 2s ease-in-out infinite" : "logo-chroma-r 14s ease-in-out infinite",
              }}
            />
          </div>

          {/* Chromatic cyan ghost */}
          <div className="absolute inset-0 pointer-events-none select-none" style={{ padding: "inherit" }}>
            <img
              src={logoSrc}
              alt=""
              className={`w-full h-full object-contain mix-blend-${ghostBlendMode} ${ghostOpacity}`}
              style={{
                filter: themeMode === "light"
                  ? "sepia(1) saturate(5) hue-rotate(140deg) brightness(0.9)"
                  : "sepia(1) saturate(8) hue-rotate(140deg) brightness(0.65)",
                animation: hovered ? "logo-chroma-c-wide 2s ease-in-out infinite" : "logo-chroma-c 14s ease-in-out infinite",
              }}
            />
          </div>

          {/* Green ghost (hover only) */}
          {hovered && (
            <div className="absolute inset-0 pointer-events-none select-none" style={{ padding: "inherit" }}>
              <img
                src={logoSrc}
                alt=""
                className={`w-full h-full object-contain mix-blend-${ghostBlendMode} ${themeMode === "light" ? "opacity-8" : "opacity-18"} animate-[logo-chroma-g_2s_ease-in-out_infinite]`}
                style={{
                  filter: themeMode === "light"
                    ? "sepia(1) saturate(5) hue-rotate(100deg) brightness(0.9)"
                    : "sepia(1) saturate(8) hue-rotate(100deg) brightness(0.6)",
                }}
              />
            </div>
          )}

          {/* Primary logo — gradient mask fill, always sharp on top */}
          <div
            className="w-full h-full object-contain relative z-10"
            style={{
              WebkitMaskImage: `url('${logoSrc}')`,
              maskImage: `url('${logoSrc}')`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              background: "linear-gradient(135deg, #00e0cb 0%, #6e56ff 50%, #ff4fb0 100%)",
              backgroundSize: "200% 200%",
              animation: "yantra-electric-flow 8s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Header ────────────────────────────────────────────────────── */

/**
 * Header — site-wide nav. Client component for:
 *  1. Scroll-reactive glass pill (transparent at top → crystallises at 80px)
 *  2. Desktop: Studio | Capabilities | Lab | Signal (CTA) | Login
 *  3. Mobile pill: Signal link + Hamburger trigger (separate controls)
 *  4. Mobile menu: full-screen cinematic overlay with staggered entrance
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isAppModeActive, setIsAppModeActive] = useState(false);
  const { themeMode, setThemeMode } = useTheme();

  const toggleThemeMode = useCallback(() => {
    audioSynth.playClick();
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [themeMode, setThemeMode]);

  const firstNavRef = useRef<HTMLAnchorElement | null>(null);

  /* Body scroll lock */
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
      setTimeout(() => firstNavRef.current?.focus(), 50);
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  // Sync state with body class and pathname to hide brochure navigation dynamically
  useEffect(() => {
    const checkAppMode = () => {
      const isAppMode =
        document.body.classList.contains("app-mode-active") ||
        pathname?.startsWith("/dashboard");
      setIsAppModeActive(isAppMode);
    };

    checkAppMode();

    const observer = new MutationObserver(() => {
      checkAppMode();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, [pathname]);

  const openMenu  = useCallback(() => setMenuOpen(true),  []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <Container width="default">
          <div className="flex items-center justify-between gap-4">

            {/* ── Logo + wordmark ── */}
            <Link
              href="/"
              aria-label="YantraCore — home"
              className="pointer-events-auto relative inline-flex items-center gap-3 group"
            >
              <HeaderLogo size="large" />
              <YantraElectricTitle size="md" />
            </Link>

            {/* ── Pill ── */}
            <div
              className="pointer-events-auto nav-pill-scroll rounded-full flex items-center"
              style={{
                padding: "10px 20px",
                gap: "24px",
              }}
            >
              {/* Desktop nav links */}
              {!isAppModeActive && (
                <nav
                  aria-label="Primary navigation"
                  className="hidden md:flex items-center gap-7 text-sm"
                >
                  {desktopLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToAnchor(l.href);
                      }}
                      className="
                        relative inline-block pb-1 text-text-mid
                        transition-colors duration-300 hover:text-text-hi
                        after:content-[''] after:absolute after:left-0 after:bottom-0
                        after:h-[1.5px] after:w-full after:origin-left
                        after:bg-gradient-to-r after:from-accent-1 after:to-accent-2
                        after:scale-x-0 after:transition-transform after:duration-500
                        after:ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:after:scale-x-100
                      "
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              )}

              {/* Desktop divider */}
              {!isAppModeActive && (
                <div
                  aria-hidden
                  className="hidden md:block w-px h-4 bg-white/[0.10] rounded-full flex-shrink-0"
                />
              )}

              {/* Signal CTA — desktop + mobile (scroll anchor) */}
              {!isAppModeActive && (
                <Link
                  href="#signal"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor("#signal");
                  }}
                  className="
                    group inline-flex items-center gap-2
                    font-mono text-[11px] uppercase tracking-[0.18em] text-text-mid
                    transition-colors duration-300 hover:text-accent-2
                  "
                >
                  <span
                    aria-hidden
                    className="signal-dot inline-block w-[6px] h-[6px] rounded-full flex-shrink-0"
                    style={{ background: "var(--accent-2)" }}
                  />
                  <span>Signal</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              )}

              {/* Login — desktop only */}
              <Link
                href="/login"
                className="
                  hidden md:inline-flex
                  group items-center gap-1.5
                  px-4 py-1.5 rounded-full
                  font-mono text-[11px] uppercase tracking-[0.16em] text-text-mid
                  border border-white/[0.10]
                  transition-all duration-300
                  hover:text-text-hi hover:border-accent-1/40
                  relative overflow-hidden
                "
                style={{
                  background: "linear-gradient(135deg, rgba(110,86,255,0.12) 0%, rgba(0,224,203,0.04) 100%)",
                }}
              >
                {/* Inner glow on hover */}
                <span
                  aria-hidden
                  className="
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    transition-opacity duration-400 rounded-full pointer-events-none
                  "
                  style={{ boxShadow: "inset 0 0 20px rgba(110,86,255,0.25)" }}
                />
                {/* User icon */}
                <svg
                  width="18" height="18" viewBox="0 0 16 16"
                  fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden
                  className="relative transition-colors duration-300 group-hover:stroke-accent-1"
                >
                  <circle cx="8" cy="5.5" r="3" />
                  <path d="M2 14.5c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                </svg>
                <span className="relative">Login</span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleThemeMode}
                onMouseEnter={() => audioSynth.playHover()}
                className="
                  relative flex items-center justify-center
                  w-8 h-8 rounded-full
                  text-text-mid hover:text-text-hi
                  border border-white/[0.10] hover:border-white/[0.22]
                  transition-all duration-300
                  overflow-hidden cursor-pointer
                "
                aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
              >
                <div
                  className="relative w-5 h-5 transition-transform duration-500"
                  style={{
                    transform: themeMode === "light" ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  {themeMode === "dark" ? (
                    <svg
                      width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  ) : (
                    <svg
                      width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Hamburger — mobile only */}
              {!isAppModeActive && (
                <button
                  id="mobile-menu-trigger"
                  aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={menuOpen ? closeMenu : openMenu}
                  className="
                    md:hidden
                    relative flex items-center justify-center
                    w-10 h-10 rounded-full
                    text-text-mid hover:text-text-hi
                    border border-white/[0.10] hover:border-white/[0.22]
                    transition-all duration-300
                  "
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                  }}
                >
                  <HamburgerIcon open={menuOpen} />
                </button>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile full-screen menu */}
      <div id="mobile-menu">
        <MobileMenu
          open={menuOpen}
          onClose={closeMenu}
          firstFocusRef={firstNavRef}
        />
      </div>
    </>
  );
}
