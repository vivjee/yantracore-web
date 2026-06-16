"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useIsTouch } from "@/lib/hooks/useMediaQuery";

/**
 * LogoMark — Showcase centerpiece.
 *
 * IDLE — "living planet" feel (all slow, soothing):
 *   1. Slow Y-axis planet spin with slight axial tilt (30 s / rotation)
 *   2. Mouse-parallax tilt layered on top — does NOT fight the spin
 *   3. Triple bloom blobs breathing at independent tempos
 *   4. Aurora ribbon rotating at 28 s — two-tone violet/cyan gradient
 *   5. Prismatic conic halo orbiting at 20 s
 *   6. 4 expanding pulse rings, staggered, very slow (6–9 s each)
 *   7. Holographic shimmer sweep — one gentle pass every 9 s
 *   8. Chromatic aberration drifting lazily over 14 s
 *   9. Top specular highlight breathing opposite to the blobs
 *
 * Props: `parallax` (mouse-tilt rAF loop, off for never-unmounting usages) and
 * `spin` (the Y-axis planet rotation — set false to pin the mark front-facing).
 *
 * HOVER — graceful awakening (not a punch, a bloom):
 *   • Planet spin pauses → snaps to front-facing with spring
 *   • Halo brightens and spins 4× faster
 *   • Bloom expands 35%
 *   • Shimmer becomes a coloured rainbow, twice per second
 *   • Shockwave ring detonates outward (1.2 s, slow and impressive)
 *   • RGB prism: green ghost joins red+cyan, all drift wider
 *   • 6 orbital spark dots bloom at 160 px radius
 *   • Bottom reflection appears — soft cyan underglow
 *   • Inner ring glows with a double halo
 *
 * ARCHITECTURE:
 *   <wrapRef>            — hover detect, parallax measure surface
 *     <Atmosphere>       — bloom, aurora, halo, rings (z 0–5)
 *     <planetRef>        — CSS planet-spin animation
 *       <tiltRef>        — JS parallax rotateX/Y (compose via preserve-3d)
 *         <Logo layers>  — chroma, primary, shimmer, specular
 *     <Sparks>           — hover-only orbital dots (z 20)
 */
export function LogoMark({ centerY = "34%", onClick, parallax = true, spin = true }: { centerY?: string; onClick?: () => void; parallax?: boolean; spin?: boolean }) {
  const { themeMode, logoHeartbeatEnabled } = useTheme();
  const ghostBlendMode = themeMode === "light" ? "multiply" : "screen";
  const wrapRef   = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);  // CSS planet spin
  const tiltRef   = useRef<HTMLDivElement>(null);  // JS parallax tilt

  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  // Touch devices (phones/tablets) render a static, colorful logo — the full
  // mark stacks ~10 animated blur/filter/blend layers that flicker on mobile GPUs.
  const lite = useIsTouch();

  // ── Mouse-parallax tilt — composes ON TOP of CSS planet spin ──
  useEffect(() => {
    // Ambient/persistent usages (e.g. the orbital Sun) opt out so this rAF loop
    // + mousemove listener don't run forever on a never-unmounting node.
    if (!parallax) return;
    // Touch / no-hover devices can never meaningfully drive the tilt, and
    // reduced-motion opts out — skip the perpetual rAF + mousemove there.
    if (typeof window !== "undefined" &&
        (window.matchMedia("(hover: none)").matches ||
         window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const wrap   = wrapRef.current;
    const tilt   = tiltRef.current;
    if (!wrap || !tilt) return;

    let rafId: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function onMouseMove(e: MouseEvent) {
      if (!hoveredRef.current) {
        targetX = 0;
        targetY = 0;
        return;
      }
      const rect = wrap!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Normalize coordinate from -1 to 1 based on mouse position in container
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      
      targetX = ny * -25; // rotateX (up/down)
      targetY = nx * 25;  // rotateY (left/right)
    }

    function tick() {
      if (!hoveredRef.current) {
        // Return to center when not hovered
        targetX = 0;
        targetY = 0;
      }
      // Smooth lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      if (tilt) {
        tilt.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [parallax]);

  function handleMouseEnter() {
    setHovered(true);
    hoveredRef.current = true;
  }

  function handleMouseLeave() {
    setHovered(false);
    hoveredRef.current = false;
  }

  const idleGlow =
    "drop-shadow(0 0 16px rgba(110,86,255,0.35)) " +
    "drop-shadow(0 0 6px rgba(0,224,203,0.25)) " +
    "drop-shadow(0 2px 20px rgba(110,86,255,0.15)) " +
    "drop-shadow(0 -1px 8px rgba(255,255,255,0.15))";

  // ── Mobile lite render: one static, colorful, flicker-free logomark ──
  if (lite) {
    return (
      <div
        ref={wrapRef}
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] ${onClick ? "cursor-pointer active:scale-[0.98] transition-transform duration-150" : ""}`}
        style={{ top: centerY, width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-hidden
        onClick={onClick}
      >
        {/* one soft static glow — composited once, no animation/blur churn */}
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,86,255,0.20) 0%, rgba(0,224,203,0.08) 45%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* static logomark — the brand gradient masked by the logo shape */}
        <div style={{ position: "relative", width: 260, height: 260 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
            <Image src="/images/logo/logo-white-no-text.svg" alt="YantraCore" fill className="object-contain" priority />
          </div>
          <div style={{
            position: "absolute", inset: 0,
            WebkitMaskImage: "url('/images/logo/logo-white-no-text.svg')",
            maskImage: "url('/images/logo/logo-white-no-text.svg')",
            WebkitMaskSize: "contain", maskSize: "contain",
            WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
            WebkitMaskPosition: "center", maskPosition: "center",
            background: "linear-gradient(135deg, #00e0cb 0%, #6e56ff 50%, #ff4fb0 100%)",
          }} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : 'transition-transform duration-300'}`}
      style={{
        top: centerY,
        cursor: onClick ? "pointer" : "default",
        width: 320,
        height: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      aria-hidden
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >

      {/* ══════════════════════════════════════════════════════════
          ATMOSPHERE — all background effects (z 0–5)
      ══════════════════════════════════════════════════════════ */}

      {/* — Aurora ribbon: deep, slow, two-tone — */}
      <div style={{
        position: "absolute", inset: -80,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 0,
        animation: "logo-halo-spin 28s linear infinite",
        opacity: 0.55,
      }}>
        <div style={{
          width: 520, height: 520,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.18) 40%, rgba(255,79,176,0.14) 70%, rgba(110,86,255,0.22) 100%)",
          filter: "blur(62px)",
        }} />
      </div>

      {/* — Bloom blobs: each on its own independent tempo — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1,
      }}>
        <div style={{
          position: "absolute",
          width: 260, height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,86,255,0.42) 0%, transparent 65%)",
          filter: "blur(44px)",
          animation: "logo-breathe 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          width: 220, height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,224,203,0.28) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: "translate(-28%, 22%)",
          animation: "logo-breathe 13s ease-in-out 2s infinite",
        }} />
        <div style={{
          position: "absolute",
          width: 170, height: 170,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,79,176,0.20) 0%, transparent 65%)",
          filter: "blur(30px)",
          transform: "translate(32%, -26%)",
          animation: "logo-breathe 8s ease-in-out 4s infinite",
        }} />
      </div>

      {/* — Prismatic conic halo ring — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2,
        animation: "logo-halo-spin 20s linear infinite",
        opacity: 0.65,
      }}>
        <div style={{
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, transparent 0%, rgba(110,86,255,0.35) 22%, rgba(0,224,203,0.38) 46%, rgba(255,79,176,0.25) 72%, transparent 88%)",
          filter: "blur(20px)",
        }} />
      </div>

      {/* — 4 Pulse rings — very slow, staggered — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 3,
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 220 + i * 76,
              height: 220 + i * 76,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: i % 2 === 0 ? "rgba(110,86,255,0.12)" : "rgba(0,224,203,0.10)",
              animation: `logo-pulse-ring ${6 + i * 0.8}s ease-out infinite`,
              animationDelay: `${i * 1.4}s`,
            }}
          />
        ))}
      </div>

      {/* — Inner precision ring — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 5,
        pointerEvents: "none",
      }}>
        <div style={{
          width: 282,
          height: 282,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
        }} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          PLANET STAGE — CSS Y-rotation (planet spin)
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={planetRef}
        style={{
          width: 260, height: 260,
          position: "relative",
          zIndex: 10,
          transformStyle: "preserve-3d",
          // `spin={false}` keeps the mark front-facing (e.g. the Technologies
          // star, where the logo is the fixed centre the system orbits). The
          // ambient halos/aurora/parallax tilt all keep moving regardless.
          animation: spin ? "logo-planet-spin 30s linear infinite" : "none",
          willChange: "transform",
        }}
      >
        {/* JS tilt overlay — layered inside the CSS spin */}
        <div
          ref={tiltRef}
          style={{
            position: "absolute", inset: 0,
            transformStyle: "preserve-3d",
            transform: "rotateX(0deg) rotateY(0deg)",
          }}
        >
          <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ animation: logoHeartbeatEnabled ? "logo-heartbeat 1.5s ease-in-out infinite" : "none" }}>
          {/* ── Glassmorphic Cyber Shield Backing ── */}
          <div style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.5) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.09)",
            boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.05), 0 6px 20px rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transform: "translateZ(-30px)",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              inset: "12px",
              borderRadius: "50%",
              border: "1px dashed rgba(0, 224, 203, 0.15)",
              animation: "logo-halo-spin 36s linear infinite",
            }} />
            <div style={{
              position: "absolute",
              inset: "24px",
              borderRadius: "50%",
              border: "1px solid rgba(255, 79, 176, 0.08)",
              animation: "logo-halo-spin 48s linear infinite reverse",
            }} />
            <div style={{
              position: "absolute",
              inset: "0px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(110, 86, 255, 0.12) 0%, transparent 65%)",
            }} />
          </div>

            {/* ── Chromatic red ghost ── */}
            <div style={{
              position: "absolute", inset: 0,
              mixBlendMode: ghostBlendMode,
              opacity: 0.20,
              animation: "logo-chroma-r 8s ease-in-out infinite",
              transform: "translateZ(6px)",
            }}>
              <Image
                src="/images/logo/logo-white-no-text.svg"
                alt="" fill className="object-contain"
                style={{ filter: "sepia(1) saturate(8) hue-rotate(-40deg) brightness(0.65) drop-shadow(0 0 3px rgba(110,86,255,0.1))" }}
              />
            </div>

            {/* ── Chromatic cyan ghost ── */}
            <div style={{
              position: "absolute", inset: 0,
              mixBlendMode: ghostBlendMode,
              opacity: 0.20,
              animation: "logo-chroma-c 8s ease-in-out infinite",
              transform: "translateZ(10px)",
            }}>
              <Image
                src="/images/logo/logo-white-no-text.svg"
                alt="" fill className="object-contain"
                style={{ filter: "sepia(1) saturate(8) hue-rotate(140deg) brightness(0.65) drop-shadow(0 0 3px rgba(0,224,203,0.1))" }}
              />
            </div>

            {/* ── Primary logo wrapper ── */}
            <div style={{
              position: "absolute",
              inset: 0,
              transform: "translateZ(16px)",
              filter: idleGlow,
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                opacity: 0.12,
              }}>
                <Image
                  src="/images/logo/logo-white-no-text.svg"
                  alt="YantraCore logo underlay"
                  fill className="object-contain"
                  priority
                />
              </div>
              <div style={{
                position: "absolute",
                inset: 0,
                WebkitMaskImage: "url('/images/logo/logo-white-no-text.svg')",
                maskImage: "url('/images/logo/logo-white-no-text.svg')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                background: "linear-gradient(135deg, #00e0cb 0%, #6e56ff 50%, #ff4fb0 100%)",
                backgroundSize: "200% 200%",
                animation: "yantra-electric-flow 8s linear infinite",
              }} />
            </div>

          {/* ── Holographic shimmer sweep ── */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: "linear-gradient(118deg, transparent 0%, rgba(255,79,176,0.15) 20%, rgba(255,255,255,0.45) 50%, rgba(0,224,203,0.15) 80%, transparent 100%)",
            backgroundSize: "300% 100%",
            animation: "logo-shimmer 7s ease-in-out infinite",
            mixBlendMode: "overlay",
            pointerEvents: "none",
            transform: "translateZ(17px)",
            opacity: 0.35,
          }} />

          {/* ── Top specular (overhead light) ── */}
          <div style={{
            position: "absolute",
            top: "7%", left: "18%",
            width: "64%", height: "28%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.40) 0%, transparent 70%)",
            filter: "blur(5px)",
            animation: "logo-breathe 10s ease-in-out 1.5s infinite",
            transform: "translateZ(21px)",
          }} />
          </div>
        </div>
      </div>
    </div>
  );
}
