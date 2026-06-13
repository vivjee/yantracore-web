"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

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
export function LogoMark({ centerY = "34%" }: { centerY?: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);  // CSS planet spin
  const tiltRef   = useRef<HTMLDivElement>(null);  // JS parallax tilt

  const [hovered, setHovered] = useState(false);
  const [ripple,  setRipple]  = useState(false);

  // ── Mouse-parallax tilt — composes ON TOP of CSS planet spin ──
  useEffect(() => {
    const wrap   = wrapRef.current;
    const tilt   = tiltRef.current;
    if (!wrap || !tilt) return;

    let rafId: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function onMouseMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect();
      // Centre of the VIEWPORT section (not just the logo box)
      // so the tilt feels screen-wide, not jittery on logo edge
      targetX = ((e.clientY - rect.top  - rect.height / 2) / (window.innerHeight / 2)) * -10;
      targetY = ((e.clientX - rect.left - rect.width  / 2) / (window.innerWidth  / 2)) *  10;
    }

    function tick() {
      // Very gentle lerp — slow follow, no snapping
      currentX += (targetX - currentX) * 0.028;
      currentY += (targetY - currentY) * 0.028;
      if (tilt) {
        // No perspective here — it comes from the CSS on planetRef
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
  }, []);

  // ── Hover enter: shockwave fires once ─────────────────────────
  function handleMouseEnter() {
    setHovered(true);
    setRipple(false);
    requestAnimationFrame(() => setRipple(true));
    setTimeout(() => setRipple(false), 1400);
  }

  // ─────────────────────────────────────────────────────────────
  //  Derived animation values
  // ─────────────────────────────────────────────────────────────
  const haloSpin    = hovered ? "logo-halo-spin 5s linear infinite"   : "logo-halo-spin 20s linear infinite";
  const auroraSpin  = hovered ? "logo-halo-spin 7s linear infinite"   : "logo-halo-spin 28s linear infinite";
  const shimmerDur  = hovered ? "2.8s" : "9s";
  const chromaDur   = hovered ? "2.5s" : "14s";
  const chromaDurW  = "2s";
  const bloomScale  = hovered ? 1.38 : 1;

  const idleGlow    =
    "drop-shadow(0 0 22px rgba(110,86,255,0.75)) " +
    "drop-shadow(0 0 6px rgba(0,224,203,0.55)) " +
    "drop-shadow(0 3px 28px rgba(110,86,255,0.4)) " +
    "drop-shadow(0 -1px 10px rgba(255,255,255,0.25))";

  const hoverGlow   =
    "drop-shadow(0 0 40px rgba(110,86,255,1)) " +
    "drop-shadow(0 0 14px rgba(0,224,203,0.9)) " +
    "drop-shadow(0 0 55px rgba(255,79,176,0.55)) " +
    "drop-shadow(0 -2px 16px rgba(255,255,255,0.5))";

  return (
    <div
      ref={wrapRef}
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]"
      style={{ top: centerY, cursor: "default" }}
      aria-hidden
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ══════════════════════════════════════════════════════════
          ATMOSPHERE — all background effects (z 0–5)
          These are NOT inside the planet spin so they stay
          stable in world-space while the logo rotates.
      ══════════════════════════════════════════════════════════ */}

      {/* — Aurora ribbon: deep, slow, two-tone — */}
      <div style={{
        position: "absolute", inset: -80,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 0,
        animation: auroraSpin,
      }}>
        <div style={{
          width: 520, height: 520,
          borderRadius: "50%",
          background: hovered
            ? "conic-gradient(from 0deg, rgba(255,79,176,0.42) 0%, rgba(110,86,255,0.55) 25%, rgba(0,224,203,0.42) 50%, rgba(255,180,84,0.36) 75%, rgba(255,79,176,0.42) 100%)"
            : "conic-gradient(from 0deg, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.18) 40%, rgba(255,79,176,0.14) 70%, rgba(110,86,255,0.22) 100%)",
          filter: "blur(62px)",
          opacity: hovered ? 0.85 : 0.55,
          transition: "background 1.2s ease, opacity 0.8s ease",
        }} />
      </div>

      {/* — Bloom blobs: each on its own independent tempo — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1,
      }}>
        {/* Violet — primary, breathing 10 s */}
        <div style={{
          position: "absolute",
          width:  260 * bloomScale, height: 260 * bloomScale,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,86,255,0.62) 0%, transparent 65%)",
          filter: "blur(44px)",
          animation: "logo-breathe 10s ease-in-out infinite",
          transition: "width 1s cubic-bezier(0.22,1,0.36,1), height 1s cubic-bezier(0.22,1,0.36,1)",
        }} />
        {/* Cyan — shifted position, 13 s */}
        <div style={{
          position: "absolute",
          width:  220 * bloomScale, height: 220 * bloomScale,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,224,203,0.42) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: "translate(-28%, 22%)",
          animation: "logo-breathe 13s ease-in-out 2s infinite",
          transition: "width 1s cubic-bezier(0.22,1,0.36,1), height 1s cubic-bezier(0.22,1,0.36,1)",
        }} />
        {/* Pink — offset opposite, 8 s */}
        <div style={{
          position: "absolute",
          width:  170 * bloomScale, height: 170 * bloomScale,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,79,176,0.30) 0%, transparent 65%)",
          filter: "blur(30px)",
          transform: "translate(32%, -26%)",
          animation: "logo-breathe 8s ease-in-out 4s infinite",
          transition: "width 1s cubic-bezier(0.22,1,0.36,1), height 1s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>

      {/* — Prismatic conic halo ring — */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2,
        animation: haloSpin,
      }}>
        <div style={{
          width:  hovered ? 400 : 350,
          height: hovered ? 400 : 350,
          borderRadius: "50%",
          background: hovered
            ? "conic-gradient(from 0deg, rgba(255,79,176,0.75) 0%, rgba(255,180,84,0.65) 15%, rgba(110,86,255,0.75) 32%, rgba(0,224,203,0.65) 50%, rgba(255,79,176,0.75) 68%, rgba(255,255,255,0.45) 82%, rgba(255,79,176,0.75) 100%)"
            : "conic-gradient(from 0deg, transparent 0%, rgba(110,86,255,0.45) 22%, rgba(0,224,203,0.38) 46%, rgba(255,79,176,0.32) 72%, transparent 88%)",
          filter: hovered ? "blur(10px)" : "blur(20px)",
          opacity: hovered ? 0.95 : 0.65,
          transition: "width 0.9s cubic-bezier(0.22,1,0.36,1), height 0.9s, filter 0.6s, opacity 0.6s, background 0.8s",
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
              width:  hovered ? 270 + i * 88 : 220 + i * 76,
              height: hovered ? 270 + i * 88 : 220 + i * 76,
              borderRadius: "50%",
              border: "1px solid",
              borderColor: i % 2 === 0
                ? "rgba(110,86,255,0.28)"
                : "rgba(0,224,203,0.22)",
              animation: `logo-pulse-ring ${hovered ? 3 + i * 0.6 : 6 + i * 0.8}s ease-out infinite`,
              animationDelay: `${i * 1.4}s`,
              transition: "width 0.8s, height 0.8s",
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
          width:  hovered ? 308 : 292,
          height: hovered ? 308 : 292,
          borderRadius: "50%",
          border: `1px solid ${hovered ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.09)"}`,
          boxShadow: hovered
            ? "0 0 24px 3px rgba(110,86,255,0.45), inset 0 0 18px rgba(0,224,203,0.18)"
            : "none",
          transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>

      {/* — Shockwave ripple (once on hover enter) — */}
      {ripple && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 0, height: 0,
          transform: "translate(-50%, -50%)",
          zIndex: 4,
          borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.7)",
          animation: "logo-shockwave 1.2s cubic-bezier(0,0.5,0.5,1) forwards",
        }} />
      )}

      {/* ══════════════════════════════════════════════════════════
          PLANET STAGE — CSS Y-rotation (planet spin)
          Uses transform-style: preserve-3d so the JS tilt
          inside composes into the same 3D context.
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={planetRef}
        style={{
          width: 260, height: 260,
          position: "relative",
          zIndex: 10,
          transformStyle: "preserve-3d",
          // Planet spin: slow Y rotation with axial tilt — like a real planet
          animation: hovered
            ? "logo-planet-arrive 0.8s cubic-bezier(0.22,1,0.36,1) forwards"
            : "logo-planet-spin 30s linear infinite",
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
            // Filter and scale live here so they sit ABOVE the spin
            filter: hovered ? hoverGlow : idleGlow,
            scale: hovered ? "1.10" : "1",
            transition: "scale 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.7s ease",
          }}
        >
          {/* ── Chromatic red ghost ── */}
          <div style={{
            position: "absolute", inset: 0,
            mixBlendMode: "screen",
            opacity: hovered ? 0.48 : 0.22,
            animation: hovered
              ? `logo-chroma-r-wide ${chromaDurW} ease-in-out infinite`
              : `logo-chroma-r ${chromaDur} ease-in-out infinite`,
            transition: "opacity 0.7s",
          }}>
            <Image
              src="/images/logo/logo-white-no-text.svg"
              alt="" fill className="object-contain"
              style={{ filter: "sepia(1) saturate(8) hue-rotate(-40deg) brightness(0.65)" }}
            />
          </div>

          {/* ── Chromatic cyan ghost ── */}
          <div style={{
            position: "absolute", inset: 0,
            mixBlendMode: "screen",
            opacity: hovered ? 0.48 : 0.22,
            animation: hovered
              ? `logo-chroma-c-wide ${chromaDurW} ease-in-out infinite`
              : `logo-chroma-c ${chromaDur} ease-in-out infinite`,
            transition: "opacity 0.7s",
          }}>
            <Image
              src="/images/logo/logo-white-no-text.svg"
              alt="" fill className="object-contain"
              style={{ filter: "sepia(1) saturate(8) hue-rotate(140deg) brightness(0.65)" }}
            />
          </div>

          {/* ── Green ghost — only on hover (completes RGB prism) ── */}
          {hovered && (
            <div style={{
              position: "absolute", inset: 0,
              mixBlendMode: "screen",
              opacity: 0.35,
              animation: `logo-chroma-g ${chromaDurW} ease-in-out infinite`,
            }}>
              <Image
                src="/images/logo/logo-white-no-text.svg"
                alt="" fill className="object-contain"
                style={{ filter: "sepia(1) saturate(8) hue-rotate(100deg) brightness(0.6)" }}
              />
            </div>
          )}

          {/* ── Primary logo — always sharp on top ── */}
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="/images/logo/logo-white-no-text.svg"
              alt="YantraCore logo"
              fill className="object-contain"
              priority
            />
          </div>

          {/* ── Holographic shimmer sweep ── */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: hovered
              ? "linear-gradient(118deg, transparent 0%, rgba(255,79,176,0.30) 22%, rgba(255,255,255,0.75) 50%, rgba(0,224,203,0.30) 78%, transparent 100%)"
              : "linear-gradient(118deg, transparent 0%, transparent 34%, rgba(255,255,255,0.42) 50%, transparent 66%, transparent 100%)",
            backgroundSize: "300% 100%",
            animation: `logo-shimmer ${shimmerDur} ease-in-out infinite`,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            transition: "background 0.8s ease",
          }} />

          {/* ── Top specular (overhead light) ── */}
          <div style={{
            position: "absolute",
            top: "7%", left: "18%",
            width: "64%", height: hovered ? "42%" : "28%",
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.50) 0%, transparent 70%)",
            filter: "blur(5px)",
            animation: "logo-breathe 10s ease-in-out 1.5s infinite",
            transition: "height 0.8s cubic-bezier(0.22,1,0.36,1)",
          }} />

          {/* ── Bottom reflection (hover only) ── */}
          {hovered && (
            <div style={{
              position: "absolute",
              bottom: "-6%", left: "14%",
              width: "72%", height: "28%",
              background: "radial-gradient(ellipse at 50% 100%, rgba(0,224,203,0.42) 0%, transparent 70%)",
              filter: "blur(9px)",
              animation: "logo-breathe 4s ease-in-out infinite alternate",
            }} />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ORBITAL SPARKS — hover only (above planet, z 20)
      ══════════════════════════════════════════════════════════ */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 20,
          pointerEvents: "none",
        }}>
          {[
            { a: 0,   r: 158, accent: "rgba(110,86,255,0.95)", s: 5, d: "0s"    },
            { a: 60,  r: 146, accent: "rgba(0,224,203,0.95)",  s: 4, d: "0.12s" },
            { a: 120, r: 162, accent: "rgba(255,79,176,0.90)", s: 5, d: "0.24s" },
            { a: 180, r: 153, accent: "rgba(255,180,84,0.90)", s: 4, d: "0.36s" },
            { a: 240, r: 156, accent: "rgba(110,86,255,0.85)", s: 3, d: "0.06s" },
            { a: 300, r: 150, accent: "rgba(0,224,203,0.85)",  s: 4, d: "0.18s" },
          ].map((spark, i) => {
            const rad = (spark.a * Math.PI) / 180;
            const x   = Math.cos(rad) * spark.r;
            const y   = Math.sin(rad) * spark.r;
            return (
              <div key={i} style={{
                position: "absolute",
                width: spark.s, height: spark.s,
                borderRadius: "50%",
                background: spark.accent,
                boxShadow: `0 0 ${spark.s * 3}px ${spark.accent}`,
                transform: `translate(${x}px, ${y}px)`,
                animation: `logo-spark-orbit 0.7s cubic-bezier(0.22,1,0.36,1) ${spark.d} both`,
              }} />
            );
          })}
        </div>
      )}
    </div>
  );
}
