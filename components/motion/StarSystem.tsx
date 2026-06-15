"use client";

import { motion } from "framer-motion";
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

export function StarSystem({ onCenterClick }: { onCenterClick: () => void }) {
  const { containerRef, zoom, panX, panY, isDragging, resetView } = useCanvasControls({
    minZoom: 0.25,
    maxZoom: 4,
    zoomSensitivity: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center bg-[#020205] select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      
      {/* Background nebula — stays fixed, does not zoom */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(110,86,255,0.2) 0%, transparent 65%)"
      }} />

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
      <div className="relative w-full h-full flex items-center justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.85] xl:scale-100 origin-center">
        
        {/* Draw Orbit Rings for Planets */}
        {techPlanets.map((planet, i) => (
          <div
            key={`orbit-ring-${i}`}
            className="absolute rounded-full border border-dashed opacity-[0.15] pointer-events-none"
            style={{
              width: planet.radius * 2,
              height: planet.radius * 2,
              borderColor: planet.color,
            }}
          />
        ))}

        {/* Planets and their satellites */}
        {techPlanets.map((planet, pIdx) => {
          return (
            <motion.div
              key={`planet-container-${pIdx}`}
              className="absolute flex items-center justify-center pointer-events-none"
              style={{ width: planet.radius * 2, height: planet.radius * 2 }}
              animate={{ rotate: [planet.angleOffset || 0, (planet.angleOffset || 0) + (360 * (planet.direction || 1))] }}
              transition={{ duration: planet.speed, ease: "linear", repeat: Infinity }}
            >
              {/* Planet positioning wrapper (pushes it to the edge of the radius) */}
              <div 
                className="absolute" 
                style={{ right: 0, transform: "translateX(50%)" }}
              >
                {/* Counter-rotate the planet to keep its label/content upright (if needed) */}
                <motion.div
                  animate={{ rotate: [-(planet.angleOffset || 0), -((planet.angleOffset || 0) + (360 * (planet.direction || 1)))] }}
                  transition={{ duration: planet.speed, ease: "linear", repeat: Infinity }}
                  className="relative flex items-center justify-center pointer-events-auto"
                >
                  {/* Satellite Orbit Rings */}
                  {planet.satellites.map((sat, sIdx) => (
                    <div
                      key={`sat-ring-${pIdx}-${sIdx}`}
                      className="absolute rounded-full border border-solid opacity-[0.12] pointer-events-none"
                      style={{
                        width: sat.radius * 2,
                        height: sat.radius * 2,
                        borderColor: sat.color,
                      }}
                    />
                  ))}

                  {/* Satellites */}
                  {planet.satellites.map((sat, sIdx) => (
                    <motion.div
                      key={`sat-container-${pIdx}-${sIdx}`}
                      className="absolute flex items-center justify-center pointer-events-none z-10"
                      style={{ width: sat.radius * 2, height: sat.radius * 2 }}
                      animate={{ rotate: [sat.angleOffset || 0, (sat.angleOffset || 0) + (360 * (sat.direction || 1))] }}
                      transition={{ duration: sat.speed, ease: "linear", repeat: Infinity }}
                    >
                      <div className="absolute" style={{ right: 0, transform: "translateX(50%)" }}>
                        <motion.div
                          animate={{ rotate: [-(sat.angleOffset || 0), -((sat.angleOffset || 0) + (360 * (sat.direction || 1)))] }}
                          transition={{ duration: sat.speed, ease: "linear", repeat: Infinity }}
                          className="pointer-events-auto"
                        >
                          <GlowingOrb color={sat.color} size={28} name={sat.name} Icon={sat.icon} isSatellite />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}

                  {/* The Planet Orb (rendered on top of sat rings) */}
                  <div className="relative z-20">
                    <GlowingOrb color={planet.color} size={56} name={planet.name} Icon={planet.icon} />
                  </div>

                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* The Star (Center YantraCore Logo) */}
        {/* Scaled to half size for stellar system proportion */}
        <div className="absolute z-50 flex flex-col items-center justify-center" style={{ transform: "scale(0.5)", transformOrigin: "center center" }}>
          <div style={{ width: 260, height: 260 }}>
            <LogoMark centerY="50%" onClick={onCenterClick} />
          </div>
          {/* Permanent Label for YantraCore below the center star */}
          <div className="absolute top-[106%] whitespace-nowrap pointer-events-none">
            <span className="px-4 py-1.5 text-lg font-extrabold rounded-full bg-[#0a0a12] border border-accent-1/50 text-accent-1 shadow-[0_0_20px_rgba(110,86,255,0.5)] tracking-widest uppercase">
              YantraCore
            </span>
          </div>
        </div>
      </div>

      </div>{/* /canvas-layer */}

      {/* HUD — zoom badge + reset button, always fixed on top */}
      <CanvasHUD zoom={zoom} onReset={resetView} />

    </div>
  );
}
