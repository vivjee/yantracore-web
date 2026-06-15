"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { LogoMark } from "@/components/sections/01-arrival/LogoMark";
import { IconType } from "react-icons";
import { 
  SiReact, 
  SiNextdotjs, 
  SiNodedotjs, 
  SiTypescript, 
  SiFramer, 
  SiTailwindcss, 
  SiVercel, 
  SiExpress, 
  SiPrisma, 
  SiEslint, 
  SiJest 
} from "react-icons/si";
import { FaPaw } from "react-icons/fa"; // Using Paw for Zustand since it's a bear logo

interface SatelliteProps {
  name: string;
  radius: number;
  speed: number;
  color: string;
  icon: IconType;
  angleOffset?: number;
  direction?: 1 | -1;
}

interface PlanetProps {
  name: string;
  radius: number;
  speed: number;
  color: string;
  icon: IconType;
  angleOffset?: number;
  satellites: SatelliteProps[];
  direction?: 1 | -1;
}

const planets: PlanetProps[] = [
  {
    name: "React",
    radius: 200,
    speed: 35,
    color: "#61DAFB",
    icon: SiReact,
    angleOffset: 0,
    direction: 1,
    satellites: [
      { name: "Framer", radius: 60, speed: 10, color: "#f505b3", icon: SiFramer, angleOffset: 0 },
      { name: "Zustand", radius: 90, speed: 15, color: "#453f3f", icon: FaPaw, angleOffset: 180 },
    ],
  },
  {
    name: "Next.js",
    radius: 320,
    speed: 50,
    color: "#ffffff",
    icon: SiNextdotjs,
    angleOffset: 120,
    direction: -1,
    satellites: [
      { name: "Tailwind", radius: 65, speed: 12, color: "#38bdf8", icon: SiTailwindcss, angleOffset: 45 },
      { name: "Vercel", radius: 95, speed: 18, color: "#ffffff", icon: SiVercel, angleOffset: 225 },
    ],
  },
  {
    name: "Node.js",
    radius: 440,
    speed: 65,
    color: "#339933",
    icon: SiNodedotjs,
    angleOffset: 240,
    direction: 1,
    satellites: [
      { name: "Express", radius: 60, speed: 11, color: "#aaaaaa", icon: SiExpress, angleOffset: 90 },
      { name: "Prisma", radius: 85, speed: 16, color: "#2d3748", icon: SiPrisma, angleOffset: 270 },
    ],
  },
  {
    name: "TypeScript",
    radius: 560,
    speed: 80,
    color: "#3178C6",
    icon: SiTypescript,
    angleOffset: 60,
    direction: -1,
    satellites: [
      { name: "ESLint", radius: 65, speed: 13, color: "#4b32c3", icon: SiEslint, angleOffset: 30 },
      { name: "Jest", radius: 90, speed: 19, color: "#c21325", icon: SiJest, angleOffset: 210 },
    ],
  },
];

const GlowingOrb = ({ color, size, name, Icon }: { color: string; size: number; name: string; Icon: IconType }) => {
  const { themeMode } = useTheme();
  // We use dark glassmorphism for dark mode, light glassmorphism for light mode
  const glassBg = themeMode === "light" ? "rgba(255,255,255,0.7)" : "rgba(10,10,15,0.7)";
  const borderColor = themeMode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

  return (
    <div className="relative group flex flex-col items-center justify-center cursor-default">
      <div 
        className="relative flex items-center justify-center rounded-full backdrop-blur-md"
        style={{ 
          width: size, 
          height: size,
          backgroundColor: glassBg,
          border: `1px solid ${borderColor}`,
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
            color: color === "#ffffff" ? (themeMode === "light" ? "#000" : "#fff") : color,
            filter: `drop-shadow(0 0 8px ${color})`
          }} 
        />
      </div>
      
      {/* Name Label permanently below the orb */}
      <div className="absolute top-[110%] left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none mt-1">
        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-lg tracking-wide uppercase">
          {name}
        </span>
      </div>
    </div>
  );
};

export function StarSystem({ onCenterClick }: { onCenterClick: () => void }) {
  const { themeMode } = useTheme();

  return (
    <div className={`absolute inset-0 overflow-hidden flex items-center justify-center ${themeMode === "light" ? "bg-[#ffffff]" : "bg-[#020205]"}`}>
      
      {/* Background Deep Space Particles / Nebula */}
      <div className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none" style={{
        background: `radial-gradient(circle at 50% 50%, ${themeMode === "light" ? "rgba(110,86,255,0.03)" : "rgba(110,86,255,0.2)"} 0%, transparent 65%)`
      }} />

      {/* The System */}
      {/* We scaled it down slightly more for mobile since orbits are larger now */}
      <div className="relative w-full h-full flex items-center justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.85] xl:scale-100 origin-center transition-transform duration-700">
        
        {/* Draw Orbit Rings for Planets */}
        {planets.map((planet, i) => (
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
        {planets.map((planet, pIdx) => {
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
                          <GlowingOrb color={sat.color} size={36} name={sat.name} Icon={sat.icon} />
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
          <div className="absolute top-[110%] whitespace-nowrap pointer-events-none">
            <span className="px-3 py-1 text-sm font-bold rounded-full bg-[#111116] border border-accent-1/40 text-accent-1 shadow-[0_0_15px_rgba(110,86,255,0.4)] tracking-widest uppercase">
              YantraCore
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
