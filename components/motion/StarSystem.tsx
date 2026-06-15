"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCanvasControls } from "@/lib/hooks/useCanvasControls";
import { CanvasHUD } from "@/components/motion/CanvasHUD";
import { LogoMark } from "@/components/sections/01-arrival/LogoMark";
import { IconType } from "react-icons";
import { techPlanets } from "@/lib/content/tech-stack";

const GlowingOrb = ({ color, size, name, Icon, isSatellite = false }: { color: string; size: number; name: string; Icon: IconType; isSatellite?: boolean }) => {
  return (
    <div className="relative group flex flex-col items-center justify-center cursor-default">
      <div
        className="relative flex items-center justify-center rounded-full backdrop-blur-md"
        style={{
          width: size,
          height: size,
          backgroundColor: "rgba(10,10,15,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: `0 0 ${size * 0.8}px ${color}, inset 0 0 ${size * 0.3}px ${color}40`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 ${size}px ${color}`,
          }}
        />
        {/* The Tech Icon */}
        <Icon
          className="relative z-10"
          size={size * 0.55}
          style={{
            color: color === "#ffffff" ? "#fff" : color,
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />
      </div>

      {/* Name Label permanently below the orb */}
      <div className="absolute top-[106%] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
        <span className={`px-1.5 py-0.5 rounded-full bg-[#08080f] border border-white/10 text-white shadow-lg tracking-wide uppercase font-semibold ${isSatellite ? "text-[7px]" : "text-[9px] sm:text-[10px]"}`}>
          {name}
        </span>
      </div>
    </div>
  );
};

/* ── Entrance choreography ──────────────────────────────────────────────
   A soothing, centre-outward reveal on mount: the star ignites first, then
   each orbit ring draws in and its planet + satellites settle, staggered
   from the inner orbits outward. Uses the site's --ease-out-soft standard
   (cubic-bezier(0.22,1,0.36,1)), the same curve `Reveal` and the glass
   surfaces ride. Reduced-motion renders everything at rest and parks the
   orbital spin, leaving a calm static constellation. */
const ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ENTER_DURATION = 1.0; // s — cinematic-soothing (cf. Reveal's 1.1s)
const RING_BASE = 0.25;     // s — first orbit ring draws in
const PLANET_BASE = 0.35;   // s — first planet lands (just after its ring)
const ORBIT_STEP = 0.1;     // s — per-orbit stagger, inner → outer
const SAT_STEP = 0.08;      // s — per-satellite stagger within a planet

export function StarSystem({ onCenterClick }: { onCenterClick: () => void }) {
  const { containerRef, zoom, panX, panY, isDragging, resetView } = useCanvasControls({
    minZoom: 0.25,
    maxZoom: 4,
    zoomSensitivity: 0.001,
  });
  const reduced = useReducedMotion();

  // Mount entrance for one element — fade + gentle scale-up on the soft ease,
  // or an instant render at rest when the user prefers reduced motion.
  const enter = (
    delay: number,
    { opacity = 1, fromScale = 0.7, toScale = 1 }: { opacity?: number; fromScale?: number; toScale?: number } = {},
  ) =>
    reduced
      ? { initial: false as const, animate: { opacity, scale: toScale } }
      : {
          initial: { opacity: 0, scale: fromScale },
          animate: { opacity, scale: toScale },
          transition: { duration: ENTER_DURATION, ease: ENTER_EASE, delay },
        };

  // Continuous orbital rotation, or a static park at the start angle under
  // reduced motion (keeps each body at its `angleOffset` position, upright).
  const spin = (offset: number, dir: number, speed: number) =>
    reduced
      ? { animate: { rotate: offset }, transition: { duration: 0 } }
      : {
          animate: { rotate: [offset, offset + 360 * dir] },
          transition: { duration: speed, ease: "linear" as const, repeat: Infinity },
        };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center bg-[#020205] select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >

      {/* Background nebula — stays fixed, does not zoom; gentle fade-in on mount */}
      <motion.div
        className="absolute inset-0 mix-blend-screen pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(110,86,255,0.2) 0%, transparent 65%)",
        }}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={reduced ? { duration: 0 } : { duration: ENTER_DURATION * 1.4, ease: ENTER_EASE }}
      />

      {/* Canvas layer — receives zoom/pan transform */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >

      {/* The System */}
      <div className="relative w-full h-full flex items-center justify-center scale-[0.26] sm:scale-[0.34] md:scale-[0.42] xl:scale-[0.5] origin-center">

        {/* Draw Orbit Rings for Planets */}
        {techPlanets.map((planet, i) => (
          <motion.div
            key={`orbit-ring-${i}`}
            className="absolute rounded-full border border-dashed pointer-events-none"
            style={{
              width: planet.radius * 2,
              height: planet.radius * 2,
              borderColor: planet.color,
            }}
            {...enter(RING_BASE + i * ORBIT_STEP, { opacity: 0.15, fromScale: 0.9 })}
          />
        ))}

        {/* Planets and their satellites */}
        {techPlanets.map((planet, pIdx) => {
          const pBase = PLANET_BASE + pIdx * ORBIT_STEP;
          return (
            <motion.div
              key={`planet-container-${pIdx}`}
              className="absolute flex items-center justify-center pointer-events-none"
              style={{ width: planet.radius * 2, height: planet.radius * 2 }}
              {...spin(planet.angleOffset || 0, planet.direction || 1, planet.speed)}
            >
              {/* Planet positioning wrapper (pushes it to the edge of the radius) */}
              <div
                className="absolute"
                style={{ right: 0, transform: "translateX(50%)" }}
              >
                {/* Counter-rotate the planet to keep its label/content upright */}
                <motion.div
                  {...spin(-(planet.angleOffset || 0), -(planet.direction || 1), planet.speed)}
                  className="relative flex items-center justify-center pointer-events-auto"
                >
                  {/* Satellite Orbit Rings */}
                  {planet.satellites.map((sat, sIdx) => (
                    <motion.div
                      key={`sat-ring-${pIdx}-${sIdx}`}
                      className="absolute rounded-full border border-solid pointer-events-none"
                      style={{
                        width: sat.radius * 2,
                        height: sat.radius * 2,
                        borderColor: sat.color,
                      }}
                      {...enter(pBase + 0.1 + sIdx * SAT_STEP, { opacity: 0.12, fromScale: 0.9 })}
                    />
                  ))}

                  {/* Satellites */}
                  {planet.satellites.map((sat, sIdx) => (
                    <motion.div
                      key={`sat-container-${pIdx}-${sIdx}`}
                      className="absolute flex items-center justify-center pointer-events-none z-10"
                      style={{ width: sat.radius * 2, height: sat.radius * 2 }}
                      {...spin(sat.angleOffset || 0, sat.direction || 1, sat.speed)}
                    >
                      <div className="absolute" style={{ right: 0, transform: "translateX(50%)" }}>
                        <motion.div
                          {...spin(-(sat.angleOffset || 0), -(sat.direction || 1), sat.speed)}
                          className="pointer-events-auto"
                        >
                          {/* Entrance wrapper — fade/scale in without fighting the spin */}
                          <motion.div {...enter(pBase + 0.18 + sIdx * SAT_STEP)}>
                            <GlowingOrb color={sat.color} size={28} name={sat.name} Icon={sat.icon} isSatellite />
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}

                  {/* The Planet Orb (rendered on top of sat rings) */}
                  <motion.div className="relative z-20" {...enter(pBase)}>
                    <GlowingOrb color={planet.color} size={56} name={planet.name} Icon={planet.icon} />
                  </motion.div>

                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* The Star (Center YantraCore Logo) — ignites first, then the system
            blooms outward. Resting scale (0.5, for stellar proportion) is held
            by the entrance's `toScale` so framer owns the transform cleanly. */}
        <motion.div
          className="absolute z-50 flex flex-col items-center justify-center"
          style={{ transformOrigin: "center center" }}
          {...enter(0, { fromScale: 0.3, toScale: 0.5 })}
        >
          <div style={{ width: 260, height: 260 }}>
            {/* spin disabled — the star is the fixed centre the system orbits */}
            <LogoMark centerY="50%" onClick={onCenterClick} spin={false} />
          </div>
          {/* Permanent Label for YantraCore below the center star */}
          <div className="absolute top-[106%] whitespace-nowrap pointer-events-none">
            <span className="px-4 py-1.5 text-lg font-extrabold rounded-full bg-[#0a0a12] border border-accent-1/50 text-accent-1 shadow-[0_0_20px_rgba(110,86,255,0.5)] tracking-widest uppercase">
              YantraCore
            </span>
          </div>
        </motion.div>
      </div>

      </div>{/* /canvas-layer */}

      {/* HUD — zoom badge + reset button, always fixed on top */}
      <CanvasHUD zoom={zoom} onReset={resetView} />

    </div>
  );
}
