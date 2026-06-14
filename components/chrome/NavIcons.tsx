/**
 * NavIcons.tsx
 * Custom premium SVG icon set for the YantraCore navigation bars.
 *
 * Design principles:
 *   All icons are 16x16 viewBox, pixel-aligned for sharpness at small sizes.
 *   stroke="currentColor" — colors automatically adapt to dark / light theme.
 *   fill="currentColor" used sparingly on accent nodes for a dual-tone look.
 */

import React from "react";

interface IconProps {
  className?: string;
}

/* Studio — Isometric floating cube */
export function StudioIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M8 1.5 L13.5 4.8 L8 8.1 L2.5 4.8 Z" />
      <path d="M2.5 4.8 L2.5 11.2 L8 14.5 L8 8.1 Z" />
      <path d="M8 8.1 L8 14.5 L13.5 11.2 L13.5 4.8 Z" />
      <circle cx="8" cy="8.1" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Capabilities — Stacked diamond processor nodes */
export function CapabilitiesIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M8 1.5 L11.2 5 L8 8.5 L4.8 5 Z" />
      <path d="M4.8 8.5 L8 12 L11.2 8.5" opacity="0.7" />
      <line x1="8" y1="8.5" x2="8" y2="12" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Lab — Cyber-flask with glowing core */
export function LabIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M5.5 2 H10.5" />
      <path d="M6.5 2 L4 9 A2.2 2.2 0 0 0 12 9 L9.5 2" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="6.2" cy="8" r="0.55" fill="currentColor" stroke="none" opacity="0.65" />
      <circle cx="9.6" cy="7.5" r="0.45" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

/* Signal — Pulsing radial antenna transmitter */
export function SignalIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M2.5 6.8 A7 7 0 0 1 13.5 6.8" />
      <path d="M4.5 9.2 A4.5 4.5 0 0 1 11.5 9.2" />
      <path d="M6.5 11.4 A2 2 0 0 1 9.5 11.4" />
      <circle cx="8" cy="13" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* User — Cybernetic biometric avatar */
export function UserIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <circle cx="8" cy="5.2" r="2.8" />
      <circle cx="8" cy="5.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M2.5 14 C2.5 10.8 5 9 8 9 C11 9 13.5 10.8 13.5 14" />
      <path d="M2.5 14 L1.5 14" strokeWidth="1" />
      <path d="M13.5 14 L14.5 14" strokeWidth="1" />
    </svg>
  );
}

/* TvConsole — Retro-futuristic CRT screen with terminal cursor */
export function TvConsoleIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
      <path d="M5.5 11.5 L5 14" />
      <path d="M10.5 11.5 L11 14" />
      <line x1="4.2" y1="14" x2="11.8" y2="14" />
      <path d="M4.5 5.8 L6 7 L4.5 8.2" strokeWidth="1" />
      <line x1="7" y1="7" x2="10.5" y2="7" strokeWidth="1" />
      <rect x="10.5" y="6.3" width="1.5" height="1.4" rx="0.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* StatsWave — Frequency pulse wave with active peaks */
export function StatsWaveIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M1.5 8 H3.5 L5 4.5 L7 11.5 L9 2.5 L11 10.5 L12.5 7 H14.5" />
      <circle cx="5" cy="4.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="9" cy="2.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* SynthMusic — Futuristic music note synth */
export function SynthMusicIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M5 12.5 L5 4.5 L12 3 L12 10.5" />
      <line x1="5" y1="4.5" x2="12" y2="3" />
      <circle cx="5" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ChipSettings — Microprocessor CPU chip with exposed pins */
export function ChipSettingsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="8" height="8" rx="1.5" />
      <rect x="6" y="6" width="4" height="4" rx="0.8" fill="currentColor" stroke="none" />
      <line x1="6" y1="4" x2="6" y2="2.5" />
      <line x1="8" y1="4" x2="8" y2="2.5" />
      <line x1="10" y1="4" x2="10" y2="2.5" />
      <line x1="6" y1="12" x2="6" y2="13.5" />
      <line x1="8" y1="12" x2="8" y2="13.5" />
      <line x1="10" y1="12" x2="10" y2="13.5" />
      <line x1="4" y1="6" x2="2.5" y2="6" />
      <line x1="4" y1="10" x2="2.5" y2="10" />
      <line x1="12" y1="6" x2="13.5" y2="6" />
      <line x1="12" y1="10" x2="13.5" y2="10" />
    </svg>
  );
}

/* ControlSliders — Modular mixing sliders / Control Center */
export function ControlSlidersIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <line x1="3.5" y1="2" x2="3.5" y2="14" />
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="12.5" y1="2" x2="12.5" y2="14" />
      <circle cx="3.5" cy="10.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="5" r="2" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="2.3" y1="10.5" x2="4.7" y2="10.5" stroke="var(--ink-0)" strokeWidth="0.9" />
      <line x1="6.8" y1="5" x2="9.2" y2="5" stroke="var(--ink-0)" strokeWidth="0.9" />
      <line x1="11.3" y1="12" x2="13.7" y2="12" stroke="var(--ink-0)" strokeWidth="0.9" />
    </svg>
  );
}

/* SunCore — Heliocentric solar core with radial spikes */
export function SunCoreIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1.5" x2="8" y2="3" />
      <line x1="8" y1="13" x2="8" y2="14.5" />
      <line x1="1.5" y1="8" x2="3" y2="8" />
      <line x1="13" y1="8" x2="14.5" y2="8" />
      <line x1="3.4" y1="3.4" x2="4.5" y2="4.5" />
      <line x1="11.5" y1="11.5" x2="12.6" y2="12.6" />
      <line x1="12.6" y1="3.4" x2="11.5" y2="4.5" />
      <line x1="4.5" y1="11.5" x2="3.4" y2="12.6" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* MoonCrescent — Crescent moon cradling a tiny star */
export function MoonCrescentIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M12.5 9 A5 5 0 1 1 8 3 A4 4 0 0 0 12.5 9 Z" />
      <line x1="12.5" y1="2.5" x2="12.5" y2="4.5" strokeWidth="1" />
      <line x1="11.5" y1="3.5" x2="13.5" y2="3.5" strokeWidth="1" />
      <circle cx="12.5" cy="3.5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
