"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, animate, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, EffectCreative, EffectCube, Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-creative";
import "swiper/css/effect-cube";
import type { LucideIcon } from "lucide-react";
import { audioSynth } from "@/lib/audio";
import {
  Activity,
  Bot,
  Clock,
  Compass,
  Cpu,
  Heart,
  HeartHandshake,
  MapPin,
  MoreVertical,
  Phone,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  UtensilsCrossed,
  User,
  Video,
  Waves,
  Wifi,
} from "lucide-react";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { LogoMark } from "../01-arrival/LogoMark";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";


/**
 * 01.5 — Showcase
 *
 * The "solar system" scene: the holographic 2D logo sits at the centre of a
 * dark stage and four product glass-cards orbit around it, each panel telling
 * the story of a YantraCore initiative.
 *
 * Visual layers (back → front):
 *   0  Dark canvas / bg-ink-0
 *   1  Grid scan-lines (very faint)
 *   2  Rotating outer rings (SVG arcs, CSS animation)
 *   3  Conic halo light that rotates behind the logo
 *   4  LogoMark (fancy 2D)
 *   5  Four orbital product cards
 *   6  Connector lines (SVG, hidden on mobile)
 *   7  Section header text
 */
interface ShowcaseProps {
  inTv?: boolean;
}

export function Showcase({ inTv = false }: ShowcaseProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isLargestScreen, setIsLargestScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLargestScreen(window.innerWidth >= 1536);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileProjects = [
    {
      name: "JIMBO",
      logoImg: "/images/logo/jimbo_logo.png",
      desc: "Your 24/7 AI business assistant.",
      accent: "var(--accent-1)",
      url: "https://jimbo.yantracore.com/"
    },
    {
      name: "RESTROVERSE",
      logoImg: "/images/logo/restroverse_logo.png",
      desc: "Discover your perfect experience.",
      accent: "var(--accent-2)",
      url: "https://restroverse.app"
    },
    {
      name: "SHRAMDAN",
      logoImg: "/images/logo/shramdaan_logo.png",
      desc: "Come together and solve social problems.",
      accent: "var(--accent-warm)",
      url: "https://shramdan.org"
    },
    {
      name: "YANTRACORE",
      logoImg: "/images/logo/yantracore_logo.png",
      desc: "Build amazing apps.",
      accent: "var(--accent-2)",
      url: "/stats"
    }
  ];

  const handleMobileTap = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return (
    <section
      id="showcase"
      className="relative w-full overflow-hidden"
      style={{ minHeight: inTv ? "100%" : "100svh" }}
    >

      {/* ── Center Galaxy/Logo System (scaled down on mobile, 30% on desktop) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-[5]"
        style={{ transformOrigin: "center center" }}
        initial={{ scale: 0.2, rotate: -25, opacity: 0 }}
        animate={{ scale: isMobile ? 0.38 : 0.7, rotate: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 15,
          delay: 0.1,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Rotating SVG orbital rings */}
          <div className="absolute inset-0 z-[2] flex items-center justify-center">
            <OrbitalRings />
          </div>

          {/* Deep glow behind logo */}
          <div
            className="absolute inset-0 z-[4] pointer-events-none flex items-center justify-center"
            aria-hidden
          >
            <div
              style={{
                width: 480,
                height: 480,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.1) 40%, transparent 68%)",
                filter: "blur(50px)",
                animation: "logo-breathe 9s ease-in-out infinite",
              }}
            />
          </div>

          {/* Logo centre */}
          <div className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center">
            <LogoCentered />
          </div>
        </div>
      </motion.div>

      {/* ── Orbital product cards ── */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        <OrbitalCards />
      </div>

      <motion.div
        className="showcase-copy-stack pointer-events-none absolute inset-x-0 z-[10] hidden w-full md:flex"
        style={{
          top: inTv
            ? "calc(50% + clamp(8rem, 14vh, 12rem))"
            : "calc(50% + clamp(9rem, 16vh, 14rem))",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.45 }}
      >
        <BrandCopy isMobile={isMobile} />
      </motion.div>

      {/* ── Foreground text (above everything) ── */}
      <div
        className={`relative z-[10] flex flex-col pointer-events-none ${
          inTv 
            ? "h-full pt-6 pb-6 md:pt-16 md:pb-20" 
            : "min-h-screen pt-12 pb-8 md:pt-24 md:pb-16"
        }`}
      >
        <div
          className={inTv ? "h-[56%]" : "h-[56svh]"}
          style={isLargestScreen ? { height: inTv ? "62%" : "64svh" } : undefined}
        />

        {/* Mobile Projects Grid */}
        <div className="block md:hidden pointer-events-auto w-full max-w-[320px] mx-auto px-2 mt-5 mb-4 z-20 order-last">
          <div className="grid grid-cols-2 gap-2.5">
            {mobileProjects.map((proj, idx) => {
              return (
                <motion.div
                  key={proj.name}
                  onClick={() => handleMobileTap(proj.url)}
                  className="glass-light rounded-xl p-2.5 flex flex-col gap-1 cursor-pointer border border-white/5 active:scale-95 transition-transform select-none"
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5.5 h-5.5 rounded-md flex items-center justify-center relative bg-white/[0.03] border border-white/10 overflow-hidden"
                    >
                      <div 
                        className="absolute inset-0 opacity-20 filter blur-[2px] rounded-md"
                        style={{ background: proj.accent }}
                      />
                      <Image
                        src={proj.logoImg}
                        alt={`${proj.name} logo`}
                        width={22}
                        height={22}
                        className="object-cover relative z-10"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-text-hi tracking-wide truncate">
                      {proj.name}
                    </span>
                  </div>
                  <p className="text-[8.5px] leading-normal text-text-low font-normal line-clamp-2">
                    {proj.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Brand copy below the center logo */}
        <motion.div
          className="showcase-copy-stack flex md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.45 }}
        >
          <BrandCopy isMobile={isMobile} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LogoCentered — renders LogoMark within a positioned wrapper that
   makes its internal "left-1/2 top-[34%]" hit absolute centre.
   ───────────────────────────────────────────────────────────────── */
function BrandCopy({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="flex w-full flex-col items-center gap-1.5 px-4 text-center md:gap-2.5">
      <h2
        className="yantra-electric-title font-bold"
        style={{ fontSize: isMobile ? "2rem" : "clamp(2.25rem, 5vw, 4.25rem)" }}
      >
        YantraCore
      </h2>
      <p
        className="max-w-[320px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] md:max-w-none md:text-xs md:tracking-[0.24em]"
        style={{ color: "var(--text-mid)" }}
      >
        Software for People, Businesses & Society
      </p>
      <p
        className="max-w-[300px] text-xs leading-relaxed md:max-w-xl md:text-sm"
        style={{ color: "var(--text-low)" }}
      >
        We turn bold ideas into useful apps -
        <br />fast, elegant, intelligent, and built to serve the real world.
      </p>
    </div>
  );
}

function LogoCentered() {
  return (
    /*
      LogoMark expects to be inside a `relative min-h-screen` container.
      We provide a full-viewport-sized div anchored to the section centre.
    */
    <div className="relative w-full h-full">
      <LogoMark centerY="50%" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OrbitalRings — three concentric SVG ellipses that rotate at
   different speeds and directions, giving the solar-system feel.
   ───────────────────────────────────────────────────────────────── */
function OrbitalRings() {
  return (
    <div
      className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center"
      aria-hidden
    >
      {/* Ring 1 — fastest, innermost */}
      <div
        className="absolute"
        style={{ animation: "ring-spin-cw 18s linear infinite" }}
      >
        <svg width="480" height="480" viewBox="0 0 480 480">
          <ellipse
            cx="240" cy="240" rx="228" ry="90"
            fill="none"
            stroke="url(#ring-grad-1)"
            strokeWidth="1"
            strokeDasharray="6 14"
          />
          <defs>
            <linearGradient id="ring-grad-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(110,86,255,0)" />
              <stop offset="40%" stopColor="rgba(110,86,255,0.6)" />
              <stop offset="100%" stopColor="rgba(0,224,203,0.5)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Ring 2 — medium, tilted */}
      <div
        className="absolute"
        style={{
          animation: "ring-spin-ccw 28s linear infinite",
          transform: "rotateX(65deg)",
        }}
      >
        <svg width="660" height="660" viewBox="0 0 660 660">
          <ellipse
            cx="330" cy="330" rx="318" ry="126"
            fill="none"
            stroke="url(#ring-grad-2)"
            strokeWidth="1"
            strokeDasharray="3 18"
            opacity="0.65"
          />
          <defs>
            <linearGradient id="ring-grad-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(0,224,203,0)" />
              <stop offset="50%" stopColor="rgba(0,224,203,0.5)" />
              <stop offset="100%" stopColor="rgba(255,79,176,0.4)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Ring 3 — slow, outermost circle, pure dashes */}
      <div
        className="absolute"
        style={{ animation: "ring-spin-cw 44s linear infinite" }}
      >
        <svg width="860" height="860" viewBox="0 0 860 860">
          <circle
            cx="430" cy="430" r="418"
            fill="none"
            stroke="rgba(110,86,255,0.09)"
            strokeWidth="1"
            strokeDasharray="2 22"
          />
        </svg>
      </div>

      {/* Tick marks on ring 3 */}
      <div
        className="absolute"
        style={{ animation: "ring-spin-ccw 44s linear infinite" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 2,
              height: i % 6 === 0 ? 10 : 5,
              background: i % 6 === 0 ? "rgba(0,224,203,0.5)" : "rgba(110,86,255,0.3)",
              borderRadius: 1,
              left: "50%",
              top: 0,
              transformOrigin: `1px 430px`,
              transform: `rotate(${(360 / 24) * i}deg) translateX(-50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OrbitalCards — four glass cards placed at the four quadrants.
   On desktop they float and drift. On mobile they stack below.
   ───────────────────────────────────────────────────────────────── */
function OrbitalCards() {
  const [syncTick, setSyncTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTick((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Positions: top-left, top-right, bottom-left, bottom-right
  const slots = [
    { side: "left",  vert: "top",    delay: "0s",    duration: "14s", depth: "front" as const, xOffset: -120, yOffset: -120 },
    { side: "right", vert: "top",    delay: "-5s",   duration: "17s", depth: "mid"   as const, xOffset: 120, yOffset: -120 },
    { side: "left",  vert: "bottom", delay: "-9s",   duration: "18s", depth: "mid"   as const, xOffset: -120, yOffset: 120 },
    { side: "right", vert: "bottom", delay: "-13s",  duration: "15s", depth: "front" as const, xOffset: 120, yOffset: 120 },
  ];

  // Cards pulled inward to match the site container edge:
  // max-w-[1200px] centred + px-8 (32px) padding ≈ calc((100% - 1200px)/2 + 2rem) on wide screens.
  // We use a CSS clamp so it collapses to px-6 on narrow viewports.

  const cardData = [
    { component: <CardJimbo key="jimbo" />, url: "https://jimbo.yantracore.com/", name: "JIMBO" },
    { component: <CardRestroverse key="restroverse" syncTick={syncTick} />, url: "https://restroverse.app", name: "RESTROVERSE" },
    { component: <CardShramdan key="shramdan" syncTick={syncTick} />, url: "https://shramdan.org", name: "SHRAMDAN" },
    { component: <CardCoreStatus key="core-status" syncTick={syncTick} />, url: "/stats", name: "YANTRACORE" },
  ];

  return (
    <>
      {slots.map((slot, i) => (
        <FloatingCard
          key={i}
          side={slot.side as "left" | "right"}
          vert={slot.vert as "top" | "bottom"}
          delay={slot.delay}
          duration={slot.duration}
          depth={slot.depth}
          url={cardData[i].url}
          projectName={cardData[i].name}
          xOffset={slot.xOffset}
          yOffset={slot.yOffset}
          index={i}
        >
          {cardData[i].component}
        </FloatingCard>
      ))}
    </>
  );
}

type Depth = "front" | "mid" | "back";

const depthStyle: Record<Depth, React.CSSProperties> = {
  front: { opacity: 1, scale: 1 },
  mid: { opacity: 0.92, scale: 1 },
  back: { opacity: 0.78, scale: 1 },
};

function FloatingCard({
  children,
  side,
  vert,
  delay,
  duration,
  depth = "mid",
  url,
  projectName,
  xOffset = 0,
  yOffset = 0,
  index = 0,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  vert: "top" | "bottom";
  delay: string;
  duration: string;
  depth?: Depth;
  url?: string;
  projectName?: string;
  xOffset?: number;
  yOffset?: number;
  index?: number;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [lineTarget, setLineTarget] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Framer Motion motion values for drift displacements
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);

  // Custom spring for jelly press
  const scale = useSpring(1, { stiffness: 280, damping: 10, mass: 0.5 });

  // 1. Programmatic drift loop replacing the CSS keyframes - DISABLED as per user request to stop continuous card animation
  /*
  useEffect(() => {
    const durNum = parseFloat(duration) || 15;
    const delayNum = parseFloat(delay) || 0;

    const controlsX = animate(driftX, [0, 12, -8, -14, 0], {
      duration: durNum,
      ease: "easeInOut",
      repeat: Infinity,
      delay: delayNum,
    });

    const controlsY = animate(driftY, [0, -10, -16, 8, 0], {
      duration: durNum,
      ease: "easeInOut",
      repeat: Infinity,
      delay: delayNum,
    });

    return () => {
      controlsX.stop();
      controlsY.stop();
    };
  }, [driftX, driftY, duration, delay]);
  */

  // 2. Measure screen center relative to the card slot
  useEffect(() => {
    const updatePosition = () => {
      if (!cardRef.current) return;
      const cardRect = cardRef.current.getBoundingClientRect();
      const parent = cardRef.current.offsetParent;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();

      const centerX = parentRect.width / 2;
      const centerY = parentRect.height / 2;

      // Card center coordinate relative to offsetParent
      const cardCenterX = cardRect.left - parentRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top - parentRect.top + cardRect.height / 2;

      setLineTarget({
        x: centerX - cardCenterX,
        y: centerY - cardCenterY,
      });
    };

    const timer = setTimeout(updatePosition, 100);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  // 3. Combined coordinates for line calculation
  const totalX = driftX;
  const totalY = driftY;

  const circleCx = useTransform(totalX, (tx) => lineTarget.x - (tx as number));
  const circleCy = useTransform(totalY, (ty) => lineTarget.y - (ty as number));

  const pathD = useTransform([totalX, totalY], ([tx, ty]) => {
    const ex = lineTarget.x - (tx as number);
    const ey = lineTarget.y - (ty as number);

    const length = Math.sqrt(ex * ex + ey * ey);
    if (!length) return "M 0 0 L 0 0";

    const mx = ex / 2;
    const my = ey / 2;

    // Calculate perpendicular bending (more saggy when cards drift close)
    const maxBend = 35;
    const bendFactor = Math.max(10, maxBend - length * 0.05);
    const px = -ey / length;
    const py = ex / length;

    const cx = mx + px * bendFactor;
    const cy = my + py * bendFactor;

    return `M 0 0 Q ${cx} ${cy} ${ex} ${ey}`;
  });

  const pos: React.CSSProperties = {
    position: "absolute",
    ...(side === "left"
      ? { left: "clamp(1.5rem, calc((100% - 1400px) / 2 + 2rem), 8rem)" }
      : { right: "clamp(1.5rem, calc((100% - 1400px) / 2 + 2rem), 8rem)" }),
    ...(vert === "top" ? { top: "10%" } : { bottom: "8%" }),
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
  };

  const handleMouseEnter = () => {
    audioSynth.playHover();
    setIsHovered(true);
    scale.set(1);
  };

  const handleMouseDown = () => {
    audioSynth.playClick();
    scale.set(1);
  };

  const handleMouseUp = () => {
    scale.set(1);
  };

  // Removed direct card click navigation logic as action buttons handle it now
  const handleTap = () => {};
  const handleKeyDown = (e: React.KeyboardEvent) => {};

  const accentColor =
    side === "left" && vert === "top"
      ? "var(--accent-1)"
      : side === "right" && vert === "top"
      ? "var(--accent-2)"
      : side === "left" && vert === "bottom"
      ? "var(--accent-warm)"
      : "var(--accent-2)";

  return (
    <motion.div
      className="hidden md:block pointer-events-auto"
      style={{ ...pos, ...depthStyle[depth], perspective: 1000, zIndex: 20 }}
      initial={{ x: xOffset, y: yOffset, opacity: 0, scale: 0.6 }}
      animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 55,
        damping: 14,
        delay: 0.6 + index * 0.15,
      }}
    >
      {/* Outer drift wrapper */}
      <motion.div style={{ x: driftX, y: driftY }}>
        
        {/* Dynamic Bezier Connector Line */}
        {lineTarget.x !== 0 && (
          <svg
            className="absolute pointer-events-none overflow-visible"
            style={{
              left: "50%",
              top: "50%",
              width: 0,
              height: 0,
              zIndex: -1,
            }}
          >
            <defs>
              <linearGradient id={`connector-grad-${side}-${vert}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
                <stop offset="70%" stopColor={accentColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent-1)" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <motion.path
              d={pathD}
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              opacity="0.12"
              className="filter blur-sm"
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#connector-grad-${side}-${vert})`}
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <motion.circle
              cx={circleCx}
              cy={circleCy}
              r="2.5"
              fill={accentColor}
              opacity="0.6"
            />
          </svg>
        )}

        {/* Card wrapper block */}
        <div
          className="cursor-default"
        >
          <AnimatedBorder 
            variant="sweep" 
            radius={24} 
            duration={8000}
            style={{
              "--border-opacity": isHovered ? 1 : 0,
              "--border-transition-duration": "0.8s",
            } as React.CSSProperties}
          >
            {/* Interactive card surface */}
            <motion.div
              ref={cardRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="glass-medium rounded-[24px] p-4 w-[270px] h-[325px] relative overflow-hidden select-none focus-visible:outline-none group flex flex-col"
              animate={{
                boxShadow: isHovered
                  ? `0 30px 60px -15px rgba(0,0,0,0.95), 
                     0 0 40px -5px color-mix(in srgb, ${accentColor} 45%, transparent), 
                     inset 0 1px 0 rgba(255,255,255,0.2)`
                  : `0 0px 0px 0px rgba(0,0,0,0), 
                     inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                scale: scale,
              }}
            >
              {/* Top specular reflection line */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                animate={{
                  background: isHovered
                    ? `linear-gradient(90deg, transparent, ${accentColor} 80%, transparent)`
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 50%, transparent)",
                  height: isHovered ? "1.5px" : "1px",
                }}
                transition={{ duration: 0.8 }}
              />
              <div style={{ height: "100%" }} className="w-full flex-1 flex flex-col justify-between">
                {children}
              </div>
            </motion.div>
          </AnimatedBorder>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ProjectCardHeaderProps {
  logoImg: string;
  unicodeChar: string;
  title: string;
  description?: string;
  statusDotColor: string;
  accentColor: string;
  isLive?: boolean;
}

function ProjectCardHeader({
  logoImg,
  unicodeChar,
  title,
  description,
  statusDotColor,
  accentColor,
  isLive = false,
}: ProjectCardHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {/* ── Fancy Logo Box (Larger w-9 h-9) ── */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-all duration-300 bg-white/[0.03] border border-white/10 group-hover:border-white/20 group-hover:bg-white/[0.05] overflow-hidden"
            style={{
              boxShadow: `0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            {/* Accent glow behind icon */}
            <div 
              className="absolute inset-0 opacity-20 filter blur-[4px] rounded-lg transition-all duration-300 group-hover:opacity-30"
              style={{ background: accentColor }}
            />
            <Image 
              src={logoImg} 
              alt={`${title} logo`} 
              fill
              sizes="36px"
              className="object-cover relative z-10 transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
          
          {/* Fancy Unicode Badge overlay */}
          <span 
            className="absolute -bottom-0.5 -right-0.5 text-[8.5px] bg-[#0A0C16]/90 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none z-20"
            style={{ fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Symbol", sans-serif' }}
          >
            {unicodeChar}
          </span>
        </div>

        {/* ── Title & Description ── */}
        <div className="flex flex-col">
          <p className="text-[12px] font-bold text-text-hi leading-tight tracking-wide font-sans">
            {title}
          </p>
          {description && (
            <p className="text-[9px] text-text-low leading-tight font-medium font-sans mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ── Status Dot towards the right ── */}
      <span className="relative flex items-center justify-center w-1.5 h-1.5 mr-0.5">
        {isLive && (
          <span className={`absolute w-3 h-3 rounded-full animate-ping opacity-60 ${statusDotColor}`} />
        )}
        <span className={`relative w-1.5 h-1.5 rounded-full ${statusDotColor}`} />
      </span>
    </div>
  );
}

/* ============================================================
   CardJimbo — WhatsApp / AI agent scene
   ============================================================ */
const CONVERSATION_FLOW = [
  { sender: "user", text: "Is the Aurora villa available tonight?" },
  { sender: "jimbo", text: "Checking the live calendar... 🏨" },
  { sender: "jimbo", text: "Yes! The Aurora Villa is open. Would you like me to book it?" },
  { sender: "user", text: "Awesome! Yes, please book it." },
  { sender: "jimbo", text: "Processing reservation... 💳" },
  { sender: "jimbo", text: "Booking confirmed! 🌟 Check your email for details." },
  { sender: "user", text: "Perfect! Thanks for the quick help." },
] as const;

const JIMBO_REPLIES = [
  "Hi there! I'm Jimbo, a custom AI agent. I can handle booking, support, and leads for your business. 🚀",
  "I sync natively with RestoReverse, databases, and calendars to automate client bookings seamlessly.",
  "You can integrate me on WhatsApp, Instagram, Telegram, or SMS. Would you like a demo?",
  "I am built with state-of-the-art NLP models trained on your brand guidelines.",
  "Interested? Click the 'Hire Jimbo' button below to build an agent for your business!"
];

function CardJimbo() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "jimbo"; text: string }>>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-simulation flow
  useEffect(() => {
    if (isInteractive) return;
    
    let rId: number;
    // Initial load: start with step 0
    if (stepIndex === 0) {
      rId = requestAnimationFrame(() => {
        setMessages([]);
      });
    }

    const interval = setInterval(() => {
      if (stepIndex < CONVERSATION_FLOW.length) {
        setMessages(prev => [...prev, CONVERSATION_FLOW[stepIndex]]);
        setStepIndex(prev => prev + 1);
      } else {
        // Reset simulation
        setMessages([]);
        setStepIndex(0);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (rId) cancelAnimationFrame(rId);
    };
  }, [stepIndex, isInteractive]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setIsInteractive(true);
    const userMsg = { sender: "user" as const, text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // AI response delay
    setTimeout(() => {
      const randomReply = JIMBO_REPLIES[Math.floor(Math.random() * JIMBO_REPLIES.length)];
      setMessages(prev => [...prev, { sender: "jimbo" as const, text: randomReply }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleReset = () => {
    setMessages([]);
    setStepIndex(0);
    setIsInteractive(false);
    setIsTyping(false);
  };

  const handleHire = () => {
    window.open("https://jimbo.yantracore.com/", "_blank", "noopener,noreferrer");
  };

  const currentTyper = isInteractive
    ? (isTyping ? "jimbo" : null)
    : (stepIndex < CONVERSATION_FLOW.length ? CONVERSATION_FLOW[stepIndex].sender : null);

  return (
    <div className="flex flex-col justify-between h-full w-full">
      {/* Header */}
      <ProjectCardHeader
        logoImg="/images/logo/jimbo_logo.png"
        unicodeChar="💬"
        title="JIMBO"
        description="Your 24/7 AI business assistant."
        statusDotColor="bg-accent-1"
        accentColor="var(--accent-1)"
        isLive={true}
      />

      {/* WhatsApp-style phone UI */}
      <div
        className="rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1f2c33] px-2 py-1.5 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <Bot className="w-2.5 h-2.5 text-emerald-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-medium text-white leading-tight">Jimbo</p>
            <p className="text-[7.5px] text-emerald-300 leading-tight font-mono">
              {currentTyper === "jimbo" ? "typing..." : "online"}
            </p>
          </div>
          <Video className="w-2.5 h-2.5 text-white/40" />
          <Phone className="w-2.5 h-2.5 text-white/40" />
          <MoreVertical className="w-2.5 h-2.5 text-white/40" />
        </div>
        <div
          ref={chatContainerRef}
          className="p-2 overflow-y-auto scroll-smooth jimbo-chat-scrollbar flex flex-col"
          style={{ background: "linear-gradient(180deg, #0b141a 0%, #131c23 100%)", height: "90px" }}
        >
          <div className="space-y-1.5 flex flex-col mt-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-chat-fade`}
              >
                <div
                  className={`${
                    msg.sender === "user"
                      ? "bg-[#005c4b] text-white rounded-tr-sm"
                      : "bg-[#202c33] text-white rounded-tl-sm"
                  } text-[10px] px-2 py-1.5 rounded-lg max-w-[85%] leading-snug`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-chat-fade">
                <div className="bg-[#202c33] px-2.5 py-2 rounded-lg rounded-tl-sm">
                  <TypingDots colorClass="bg-white/70" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="bg-[#1f2c33] px-2 py-1 flex items-center gap-1.5 border-t border-white/5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-[#2a3942] text-white text-[10px] px-2.5 py-1 rounded-full outline-none placeholder-white/30 border border-transparent focus:border-emerald-500/30 font-sans"
          />
          <button 
            onClick={handleSendMessage}
            className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-transform flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-3 h-3 text-[#111b21] stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1 w-full pointer-events-auto">
        <button
          onClick={handleReset}
          className="flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/20 transition-all text-text-hi"
        >
          Learn More
        </button>
        <button
          onClick={handleHire}
          className="flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0"
          style={{ backgroundColor: "var(--accent-1)", boxShadow: "0 0 12px rgba(110,86,255,0.3)" }}
        >
          Hire Jimbo
        </button>
      </div>
    </div>
  );
}

function TypingDots({ colorClass = "bg-text-mid" }: { colorClass?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          className={`w-1 h-1 rounded-full typing-dot ${colorClass}`}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   CardRestroverse — AI hospitality listing
   ============================================================ */
const SEARCH_QUERIES = [
  "traditional ryokan garden kyoto",
  "cliffside boutique villa amalfi",
  "sunset cave suite santorini",
  "eco jungle treehouse tulum",
  "glass dome aurora cabin iceland"
];

function CardRestroverse({ syncTick = 0 }: { syncTick?: number }) {
  const [queryText, setQueryText] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  useEffect(() => {
    if (isInteractive) return;
    if (swiperRef) {
      swiperRef.slideNext(1500);
    }
  }, [syncTick, swiperRef, isInteractive]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentQuery = SEARCH_QUERIES[queryIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        const nextText = currentQuery.substring(0, queryText.length - 1);
        setQueryText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setQueryIndex((prev) => (prev + 1) % SEARCH_QUERIES.length);
        }
      }, 40);
    } else {
      timer = setTimeout(() => {
        const nextText = currentQuery.substring(0, queryText.length + 1);
        setQueryText(nextText);
        if (nextText === currentQuery) {
          timer = setTimeout(() => setIsDeleting(true), 2500);
        }
      }, 70);
    }

    return () => clearTimeout(timer);
  }, [queryText, isDeleting, queryIndex]);

  const hotelSlides = [
    {
      name: "Hoshinoya Ryokan",
      location: "Kyoto",
      match: "99%",
      price: "$480",
      rating: "4.9",
      gradient: "linear-gradient(135deg, rgba(255,180,84,0.35) 0%, rgba(255,79,176,0.25) 50%, rgba(110,86,255,0.15) 100%)",
      amenities: [Sparkles, Wifi, UtensilsCrossed],
      image: "/images/restroverse/hoshinoya_ryokan.png"
    },
    {
      name: "Lakeside Oasis",
      location: "Pokhara",
      match: "96%",
      price: "$145",
      rating: "4.8",
      gradient: "linear-gradient(135deg, rgba(0,224,203,0.3) 0%, rgba(0,180,219,0.2) 50%, rgba(0,131,176,0.15) 100%)",
      amenities: [Waves, Wifi, UtensilsCrossed],
      image: "/images/restroverse/lakeside_oasis.png"
    },
    {
      name: "Sherpa Peak Lodge",
      location: "Namche",
      match: "95%",
      price: "$180",
      rating: "4.7",
      gradient: "linear-gradient(135deg, rgba(29,38,113,0.35) 0%, rgba(195,55,100,0.2) 100%)",
      amenities: [Compass, Wifi, Cpu],
      image: "/images/restroverse/sherpa_peak.png"
    },
    {
      name: "Meghauli Serai",
      location: "Chitwan",
      match: "97%",
      price: "$220",
      rating: "4.9",
      gradient: "linear-gradient(135deg, rgba(248,12,122,0.25) 0%, rgba(110,86,255,0.2) 100%)",
      amenities: [Compass, Wifi, Heart],
      image: "/images/restroverse/meghauli_serai.png"
    },
    {
      name: "Himalayan Horizon",
      location: "Dhulikhel",
      match: "94%",
      price: "$190",
      rating: "4.6",
      gradient: "linear-gradient(135deg, rgba(241,95,121,0.35) 0%, rgba(240,152,25,0.2) 100%)",
      amenities: [Compass, Wifi, Waves],
      image: "/images/restroverse/himalayan_horizon.png"
    }
  ];

  const handlePillClick = (index: number, query: string) => {
    setIsInteractive(true);
    setQueryText(query);
    if (swiperRef) {
      swiperRef.slideToLoop(index);
    }
  };

  const handleSearchTrigger = () => {
    setIsInteractive(false);
    setQueryText("");
    setIsDeleting(false);
    const newIdx = Math.floor(Math.random() * SEARCH_QUERIES.length);
    setQueryIndex(newIdx);
    if (swiperRef) {
      swiperRef.slideToLoop(newIdx);
    }
  };

  const handleShowcase = () => {
    window.open("https://restroverse.app", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <ProjectCardHeader
        logoImg="/images/logo/restroverse_logo.png"
        unicodeChar="✨"
        title="RESTROVERSE"
        description="Discover your perfect experience."
        statusDotColor="bg-accent-2"
        accentColor="var(--accent-2)"
        isLive={true}
      />

      <div className="flex flex-col gap-2 flex-1 justify-center my-1">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-inner">
          <Sparkles className="w-3 h-3 text-accent-2 flex-shrink-0 animate-pulse" />
          <p className="text-[10px] text-text-hi font-mono truncate flex-1 flex items-center gap-0.5">
            <span>&ldquo;{queryText}</span>
            <span className="w-1 h-3 bg-accent-2 animate-[pulse_1s_infinite]" style={{ display: 'inline-block' }} />
            <span>&rdquo;</span>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 justify-center pointer-events-auto">
          {[
            { label: "KTM", index: 0, query: "heritage boutique hotel kathmandu" },
            { label: "PKR", index: 1, query: "peaceful lakeside resort pokhara" },
            { label: "CTW", index: 3, query: "luxury safari resort chitwan" }
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill.index, pill.query)}
              className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-[7.5px] font-mono text-text-low hover:text-text-hi transition-all"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Swiper Coverflow Carousel */}
        <div className="w-full relative overflow-hidden select-none">
          <Swiper
            onSwiper={setSwiperRef}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.15}
            loop={true}
            autoplay={isInteractive ? false : {
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 15,
              stretch: -12,
              depth: 75,
              modifier: 1.2,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full"
            style={{ height: "115px" }}
          >
            {hotelSlides.map((hotel, index) => (
              <SwiperSlide key={index} className="w-full flex justify-center">
                <div 
                  className="flex flex-col justify-between p-2.5 rounded-xl border border-white/[0.08] w-full h-full text-left relative"
                  style={{
                    background: hotel.gradient,
                    boxShadow: "0 6px 20px -6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Top Row: Match & Location */}
                  <div className="flex justify-between items-center gap-1">
                    <div className="flex items-center gap-1 px-1 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
                      <Sparkles className="w-1.5 h-1.5 text-accent-2" />
                      <span className="text-[7px] font-mono font-medium text-text-hi leading-none">{hotel.match} match</span>
                    </div>
                    <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
                      <MapPin className="w-2 h-2 text-text-low" />
                      <span className="text-[7px] text-text-hi leading-none">{hotel.location}</span>
                    </div>
                  </div>

                  {/* Details Section with Thumbnail */}
                  <div className="flex gap-2 items-center mt-1 z-10">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shadow-md flex-shrink-0 bg-black/20">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] font-semibold text-text-hi leading-tight truncate">{hotel.name}</p>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
                          <span className="text-[8.5px] text-text-hi font-medium leading-none">{hotel.rating}</span>
                        </div>
                      </div>
                      
                      {/* Price & Amenities Row */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/[0.08] mt-0.5">
                        <p className="text-[8.5px] text-text-low leading-none">From <span className="text-text-hi font-semibold">{hotel.price}</span></p>
                        <div className="flex items-center gap-0.5">
                          {hotel.amenities.map((Amenity, idx) => (
                            <div key={idx} className="p-0.5 rounded bg-white/[0.04] border border-white/5">
                              <Amenity className="w-2 h-2 text-text-low" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1 w-full pointer-events-auto">
        <button
          onClick={handleSearchTrigger}
          className="flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/20 transition-all text-text-hi"
        >
          Learn More
        </button>
        <button
          onClick={handleShowcase}
          className="flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center"
          style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
        >
          Showcase Business
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CardShramdan — community impact scene
   ============================================================ */
const SHRAMDAN_PROJECTS = [
  {
    id: "lakeside",
    name: "Lakeside Cleanup",
    location: "Pokhara",
    volunteers: 48,
    hours: 6,
    initialLikes: 142,
    image: "/images/shramdan-cleanup-result-eg.png",
  },
  {
    id: "treeplanting",
    name: "Tree Planting Drive",
    location: "Chitwan",
    volunteers: 31,
    hours: 4,
    initialLikes: 98,
    image: "/images/shramdan-tree-planting.png",
  },
  {
    id: "fooddist",
    name: "Food Distribution",
    location: "Kathmandu",
    volunteers: 22,
    hours: 3,
    initialLikes: 84,
    image: "/images/shramdan-food-distribution.png",
  },
];

function CardShramdan({ syncTick = 0 }: { syncTick?: number }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [likes, setLikes] = useState<number[]>(SHRAMDAN_PROJECTS.map(p => p.initialLikes));
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  // Auto-simulation flow synced centrally
  useEffect(() => {
    if (isInteractive) return;
    swiperRef?.slideNext(1300);
  }, [syncTick, isInteractive, swiperRef]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInteractive(true);
    setLikes(prev => {
      const next = [...prev];
      next[activeIdx] += 1;
      return next;
    });
    const id = Date.now() + Math.random();
    const left = Math.random() * 80 + 10;
    setHearts(prev => [...prev, { id, left }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 1000);
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInteractive(true);
    swiperRef?.slideToLoop(idx, 1000);
  };

  return (
    <div className="flex flex-col justify-between h-full w-full relative">
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-90px) scale(1.4);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: floatHeart 1s ease-out forwards;
        }
      `}</style>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute bottom-24 text-red-500 animate-float-heart text-base opacity-95"
            style={{ left: `${h.left}%` }}
          >
            ❤️
          </span>
        ))}
      </div>

      <ProjectCardHeader
        logoImg="/images/logo/shramdaan_logo.png"
        unicodeChar="🌱"
        title="SHRAMDAN"
        description="Come together and solve social problems."
        statusDotColor="bg-accent-warm"
        accentColor="var(--accent-warm)"
        isLive={true}
      />

      <div className="flex flex-col gap-2 flex-1 justify-center my-1 relative overflow-hidden min-h-[146px] pointer-events-auto">
        <Swiper
          onSwiper={setSwiperRef}
          effect="creative"
          grabCursor={true}
          loop={true}
          speed={1000}
          creativeEffect={{
            limitProgress: 2,
            prev: {
              opacity: 0.2,
              scale: 0.88,
              translate: ["-34%", 0, -140],
              rotate: [0, 0, -5],
            },
            next: {
              opacity: 0.2,
              scale: 0.88,
              translate: ["34%", 0, -140],
              rotate: [0, 0, 5],
            },
          }}
          onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
          modules={[EffectCreative, Autoplay]}
          className="w-full"
          style={{ height: "146px" }}
        >
          {SHRAMDAN_PROJECTS.map((project, index) => (
            <SwiperSlide key={project.id} className="w-full h-full">
              <div
                className="flex flex-col gap-2 w-full h-full"
                onClick={() => {
                  setIsInteractive(true);
                  swiperRef?.slideToLoop(index, 1000);
                }}
              >
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-22 bg-black/30">
                  <Image
                    src={project.image}
                    alt={`${project.name} before and after`}
                    fill
                    sizes="(max-width: 768px) 240px, 300px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15">
                    <MapPin className="w-2 h-2 text-text-hi" />
                    <span className="text-[8px] text-text-hi">{project.location}</span>
                  </div>
                  
                  {/* Pagination dots overlay */}
                  <div className="absolute bottom-2 right-2 flex gap-1 z-30 pointer-events-auto">
                    {SHRAMDAN_PROJECTS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleDotClick(idx, e)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          activeIdx === idx 
                            ? "bg-accent-warm scale-125 shadow-[0_0_6px_var(--accent-warm)]" 
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[12px] font-semibold text-text-hi leading-tight">{project.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5 text-accent-warm" />
                      <span className="text-[10px] text-text-hi font-medium">{project.volunteers}</span>
                      <span className="text-[9px] text-text-low">volunteers</span>
                    </div>
                    <span className="text-text-faint">/</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-accent-warm" />
                      <span className="text-[10px] text-text-hi font-medium">{project.hours}</span>
                      <span className="text-[9px] text-text-low">hours</span>
                    </div>
                    <span className="text-text-faint">/</span>
                    <button 
                      className="flex items-center gap-1 hover:scale-105 active:scale-95 transition-transform pointer-events-auto" 
                      onClick={handleLike}
                    >
                      <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                      <span className="text-[10px] text-text-hi font-medium">{likes[index]}</span>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1 w-full pointer-events-auto">
        <button
          onClick={handleLike}
          className="flex-1 py-1.5 rounded-lg text-[9.5px] uppercase tracking-wider font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/20 transition-all text-text-hi flex items-center justify-center gap-1"
        >
          <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
          <span>Learn More</span>
        </button>
        <button
          onClick={() => window.open("https://shramdan.org", "_blank", "noopener,noreferrer")}
          className="flex-1 py-1.5 rounded-lg text-[9.5px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center"
          style={{ backgroundColor: "var(--accent-warm)", boxShadow: "0 0 12px rgba(255,180,84,0.3)" }}
        >
          Contribute Labor
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   CardCoreStatus — Yantra Core Active Status
   ============================================================ */
function ActivityEqualizer({ isLive }: { isLive: boolean }) {
  const bars = 18;
  return (
    <div className="flex items-end gap-[3px] h-12 lg:h-14 xl:h-16 bg-black/30 border border-white/5 rounded-xl p-2.5 w-full">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-full opacity-80"
          style={{
            background: "linear-gradient(180deg, var(--accent-2), var(--accent-1))",
            height: "100%",
            transformOrigin: "bottom",
            animation: isLive 
              ? "bar-scale 1.8s ease-in-out infinite" 
              : "none",
            animationDelay: `${i * 0.12}s`,
            transform: !isLive ? "scaleY(0.2)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function CardCoreStatus({ syncTick = 0 }: { syncTick?: number }) {
  const router = useRouter();
  const [latency, setLatency] = useState(38.4);
  const [isPinging, setIsPinging] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  useEffect(() => {
    if (swiperRef) {
      swiperRef.slideNext(1500);
    }
  }, [syncTick, swiperRef]);

  const handlePing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinging) return;
    setIsPinging(true);
    audioSynth.playClick();

    setTimeout(() => {
      const newLatency = parseFloat((Math.random() * 32 + 10).toFixed(1));
      setLatency(newLatency);
      setIsPinging(false);
    }, 800);
  };

  const handleLiveStats = () => {
    window.open("/stats", "_blank", "noopener,noreferrer");
  };

  const handleHireYantracore = () => {
    const el = document.getElementById("signal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#signal");
    }
  };

  const TECHNOLOGIES = [
    { name: "React", icon: Cpu, color: "#61DAFB" },
    { name: "Node.js", icon: Bot, color: "#339933" },
    { name: "Next.js", icon: Sparkles, color: "#FFFFFF" },
    { name: "Figma", icon: Heart, color: "#F24E1E" },
    { name: "Photoshop", icon: Sparkles, color: "#31A8FF" },
    { name: "AI / ML", icon: Bot, color: "#FF6F00" },
    { name: "TypeScript", icon: Cpu, color: "#3178C6" },
    { name: "Python", icon: Cpu, color: "#3776AB" },
    { name: "AWS Cloud", icon: Sparkles, color: "#FF9900" },
  ];

  const DELIVERY_FLOW = [
    { label: "Discover", detail: "Map the business case", icon: Compass },
    { label: "Prototype", detail: "Ship a testable slice", icon: Sparkles },
    { label: "Launch", detail: "Release with observability", icon: Send },
  ];

  const CORE_SIGNALS = [
    { label: "Product", value: "Strategy", icon: TrendingUp },
    { label: "Systems", value: "Reliable", icon: Activity },
    { label: "Teams", value: "Aligned", icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 18 
      } 
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full relative">
      <ProjectCardHeader
        logoImg="/images/logo/yantracore_logo.png"
        unicodeChar="⚡"
        title="YANTRACORE"
        description="Build amazing apps."
        statusDotColor="bg-emerald-400"
        accentColor="var(--accent-2)"
        isLive={true}
      />

      <div className="flex-1 my-2 relative overflow-visible pointer-events-auto">
        <Swiper
          onSwiper={setSwiperRef}
          effect="cube"
          grabCursor={true}
          cubeEffect={{
            shadow: false,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          autoplay={false}
          loop={true}
          speed={1500}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          modules={[EffectCube, Autoplay]}
          className="w-full"
          style={{ height: "175px" }}
        >
          {/* Slide 1: Technologies Grid */}
          <SwiperSlide className="w-full h-full flex items-center justify-center p-0.5 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={activeSlide === 0 ? "visible" : "hidden"}
              className="grid grid-cols-3 gap-1.5 w-full"
            >
              {TECHNOLOGIES.map((tech) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    variants={itemVariants}
                    className="flex flex-col items-center justify-center py-2 px-1 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group/tech cursor-default"
                    style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center mb-1 bg-black/40 border border-white/5 group-hover/tech:scale-110 transition-transform"
                      style={{ color: tech.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[8px] font-mono font-medium text-text-low group-hover/tech:text-text-hi transition-colors text-center truncate w-full">
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </SwiperSlide>

          {/* Slide 2: Active State & Equalizer */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center p-0.5 bg-transparent">
            <div className="flex-1 flex flex-col gap-2.5 justify-center w-full">
              {/* Live AI Activity Equalizer */}
              <div 
                className="cursor-pointer relative overflow-hidden rounded-xl border border-white/5 bg-black/45 p-2.5 flex flex-col gap-1.5 group/equalizer active:scale-[0.98] transition-transform"
                onClick={handlePing}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1">
                    <Activity className="w-3 h-3 text-accent-2 animate-pulse" />
                    AI Activity
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-2 h-2 rounded-full bg-emerald-400/40 animate-ping" />
                      <span className="relative w-1 h-1 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[7.5px] font-mono uppercase tracking-wider text-emerald-300">Live</span>
                  </div>
                </div>
                
                <ActivityEqualizer isLive={!isPinging} />
                
                {isPinging && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px] flex items-center justify-center rounded-xl z-20">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest animate-pulse">Pinging...</span>
                  </div>
                )}
              </div>

              {/* Latency & Nodes Stats */}
              <div className="grid grid-cols-2 gap-2 text-center border-t border-white/[0.06] pt-2">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-text-low font-mono uppercase tracking-wider">Latency</p>
                  <p className="text-xs font-semibold text-accent-2 font-mono">
                    {isPinging ? "---" : `${latency}ms`}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] text-text-low font-mono uppercase tracking-wider">Nodes Active</p>
                  <p className="text-xs font-semibold text-accent-1 font-mono">8 Regions</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3: Delivery Flow */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center p-0.5 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={activeSlide === 2 ? "visible" : "hidden"}
              className="flex flex-col gap-2.5 w-full"
            >
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-text-low">
                    Build loop
                  </span>
                  <span className="text-[7.5px] font-mono uppercase tracking-wider text-accent-2">
                    Fast + careful
                  </span>
                </div>

                <div className="space-y-2">
                  {DELIVERY_FLOW.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={step.label}
                        variants={itemVariants}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.025] px-2.5 py-2"
                      >
                        <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-accent-2">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold text-text-hi leading-tight">
                            {step.label}
                          </p>
                          <p className="text-[8px] text-text-low leading-tight truncate">
                            {step.detail}
                          </p>
                        </div>
                        <span className="text-[8px] font-mono text-text-faint">
                          0{index + 1}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </SwiperSlide>

          {/* Slide 4: Company Signals */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center p-0.5 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={activeSlide === 3 ? "visible" : "hidden"}
              className="flex flex-col gap-2.5 w-full"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {CORE_SIGNALS.map((signal) => {
                  const Icon = signal.icon;
                  return (
                    <motion.div
                      key={signal.label}
                      variants={itemVariants}
                      className="rounded-xl border border-white/[0.05] bg-white/[0.025] px-1.5 py-2.5 text-center"
                    >
                      <div className="mx-auto mb-1.5 w-7 h-7 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-accent-1">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[8px] text-text-low font-mono uppercase tracking-wider leading-tight">
                        {signal.label}
                      </p>
                      <p className="text-[10px] text-text-hi font-semibold leading-tight mt-0.5">
                        {signal.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-accent-2/10 border border-accent-2/20 flex items-center justify-center text-accent-2">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-text-hi leading-tight">
                      Software that keeps moving
                    </p>
                    <p className="text-[8px] text-text-low leading-tight">
                      AI tools, apps, infrastructure, and support in one build rhythm.
                    </p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-accent-2 to-accent-1 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1 w-full pointer-events-auto">
        <button
          onClick={handleLiveStats}
          className="flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/20 transition-all text-text-hi"
        >
          Learn More
        </button>
        <button
          onClick={handleHireYantracore}
          className="flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center"
          style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
        >
          Hire yantracore
        </button>
      </div>
    </div>
  );
}
