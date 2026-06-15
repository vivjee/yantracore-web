import type { IconType } from "react-icons";
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
  SiJest,
} from "react-icons/si";
import { FaPaw } from "react-icons/fa"; // Paw stands in for Zustand (bear logo)

export interface TechSatellite {
  name: string;
  radius: number;
  speed: number;
  color: string;
  icon: IconType;
  angleOffset?: number;
  direction?: 1 | -1;
}

export interface TechPlanet {
  name: string;
  radius: number;
  speed: number;
  color: string;
  icon: IconType;
  angleOffset?: number;
  satellites: TechSatellite[];
  direction?: 1 | -1;
}

/**
 * The technology "solar system" — the single source of truth for the stack
 * YantraCore works with. Consumed by the StarSystem visualization (orbits)
 * and by the flat `techStack` grid on the components page. Add a tool here
 * and it appears in both places.
 */
export const techPlanets: TechPlanet[] = [
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

export interface TechItem {
  name: string;
  color: string;
  icon: IconType;
  /** "core" = a planet (primary stack), "tool" = a satellite. */
  tier: "core" | "tool";
}

/**
 * Flattened, order-preserving list of every tech in the system — planets
 * first, then their tools. Used for the static icon grid on the components
 * page (no orbital motion).
 */
export const techStack: TechItem[] = techPlanets.flatMap((planet) => [
  { name: planet.name, color: planet.color, icon: planet.icon, tier: "core" as const },
  ...planet.satellites.map((sat) => ({
    name: sat.name,
    color: sat.color,
    icon: sat.icon,
    tier: "tool" as const,
  })),
]);
