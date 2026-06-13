"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

/**
 * Cursor — custom site-wide cursor: a small dot + a larger trailing ring.
 *
 * On pointer over interactive elements (a, button:not(disabled), [role=button],
 * [data-cursor="grow"]), the ring expands and gets accent-tinted.
 *
 * Hidden on touch devices and when prefers-reduced-motion is reduce.
 * Mount once in the root layout.
 */
export function Cursor() {
  const { cursorStyle, customCursorEnabled } = useTheme();
  const dotRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!customCursorEnabled || cursorStyle === "default") {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    // Safely add the custom cursor active class to the document tag
    document.documentElement.classList.add("has-custom-cursor");

    let mx = 0;
    let my = 0;
    let raf = 0;

    // Calculate hotspot offset depending on cursor design
    let ox = -4;
    let oy = -4;
    if (cursorStyle === "crosshair") {
      ox = -16;
      oy = -16;
    } else if (cursorStyle === "dot") {
      ox = -8;
      oy = -8;
    }

    function tick() {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx + ox}px, ${my + oy}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }

    function showOnce() {
      if (visibleRef.current) return;
      visibleRef.current = true;
      dotRef.current?.classList.remove("opacity-0");
    }

    function onMove(e: MouseEvent) {
      mx = e.clientX;
      my = e.clientY;
      showOnce();
    }

    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t) return;

      const hit = t.closest(
        'a, button:not([disabled]), [role="button"], [data-cursor="grow"], .cursor-pointer'
      );
      
      const isTextInput = t.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea, [contenteditable="true"], .cursor-text'
      );

      if (dotRef.current) {
        dotRef.current.classList.toggle("cursor-dot--active", !!hit);
        dotRef.current.classList.toggle("cursor-dot--text", !!isTextInput);
      }
    }

    function onMouseDown() {
      if (dotRef.current) {
        dotRef.current.classList.remove("cursor-dot--click");
        void dotRef.current.offsetWidth; // Trigger DOM reflow to restart CSS keyframe ripple
        dotRef.current.classList.add("cursor-dot--click");
      }
    }

    function onMouseUp() {
      dotRef.current?.classList.remove("cursor-dot--click");
    }

    function onLeave() {
      dotRef.current?.classList.add("opacity-0");
      visibleRef.current = false;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [customCursorEnabled, cursorStyle]);

  if (!customCursorEnabled || cursorStyle === "default") return null;

  // Render text-beam and click-ripple offset in styles dynamically to center exactly on active hotspot
  const beamOffset = cursorStyle === "crosshair" ? 16 : cursorStyle === "dot" ? 8 : 4;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="cursor-dot pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block opacity-0"
    >
      {/* 1. Neon Arrowhead Pointer */}
      {cursorStyle === "arrow" && (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-arrow-svg"
        >
          <path
            d="M4 4L26 15L16 17L14 25L4 4Z"
            fill="url(#cursor-arrow-gradient)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="cursor-arrow-gradient" x1="4" y1="4" x2="26" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent-2)" />
              <stop offset="1" stopColor="var(--accent-1)" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* 2. Futuristic Crosshair Pointer */}
      {cursorStyle === "crosshair" && (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-crosshair-svg"
        >
          <circle cx="16" cy="16" r="2" fill="var(--accent-2)" />
          <path d="M16 4V10M16 22V28M4 16H10M22 16H28" stroke="var(--accent-2)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="7" stroke="var(--accent-1)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      )}

      {/* 3. Minimalist Glowing Dot Pointer */}
      {cursorStyle === "dot" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-dot-svg"
        >
          <circle cx="8" cy="8" r="4" fill="url(#cursor-dot-gradient)" stroke="#ffffff" strokeWidth="1.5" />
          <defs>
            <linearGradient id="cursor-dot-gradient" x1="4" y1="4" x2="12" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent-2)" />
              <stop offset="1" stopColor="var(--accent-1)" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Thicker vertical glowing text insertion beam */}
      <div
        className="cursor-text-beam"
        style={{ left: beamOffset, top: beamOffset }}
      />

      {/* Anchor-localized click shockwave ripple element */}
      <div
        className="cursor-click-ripple"
        style={{ left: beamOffset, top: beamOffset }}
      />
    </div>
  );
}
