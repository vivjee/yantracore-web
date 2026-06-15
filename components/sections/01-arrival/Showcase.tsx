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
import { useTheme } from "@/lib/theme/ThemeProvider";
import {
  Activity,
  Bot,
  Clock,
  Compass,
  Cpu,
  ExternalLink,
  Heart,
  HeartHandshake,
  MapPin,
  MoreVertical,
  Phone,
  RotateCcw,
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
  Terminal,
  Play,
  CheckCircle,
  Server,
} from "lucide-react";
import { Rise } from "@/components/motion/Rise";
import { YantraElectricTitle } from "@/components/typography/YantraElectricTitle";
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
  /**
   * When true, the centre logo / orbital rings / brand copy are omitted because
   * the orbital route-group layout renders a *persistent* Sun behind this scene
   * (so the product cards orbit the shared logo instead of a second one of their
   * own). Used by /projects inside `app/(orbital)/`.
   */
  externalSun?: boolean;
}

export function Showcase({ inTv = false, externalSun = false }: ShowcaseProps) {
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
      name: "YANTRACORE",
      logoImg: "/images/logo/yantracore_logo.png",
      desc: "Build amazing apps.",
      accent: "var(--accent-2)",
      url: "/channels/yantracore"
    },
    {
      name: "JIMBO",
      logoImg: "/images/logo/jimbo_logo.png",
      desc: "Your 24/7 AI business assistant.",
      accent: "var(--accent-1)",
      url: "/channels/jimbo"
    },
    {
      name: "RESTROVERSE",
      logoImg: "/images/logo/restroverse_logo.png",
      desc: "Discover your perfect experience.",
      accent: "var(--accent-2)",
      url: "/channels/restroverse"
    },
    {
      name: "SHRAMDAN",
      logoImg: "/images/logo/shramdaan_logo.png",
      desc: "Come together and solve social problems.",
      accent: "var(--accent-warm)",
      url: "/channels/shramdan"
    }
  ];

  const handleMobileTap = (url?: string) => {
    if (!url) return;
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  const [syncTick, setSyncTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTick((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const cardData: Array<{ component: React.ReactNode; name: string; url?: string }> = [
    { component: <CardCoreStatus key="core-status" syncTick={syncTick} />, name: "YANTRACORE", url: "/channels/yantracore" },
    { component: <CardJimbo key="jimbo" />, name: "JIMBO", url: "/channels/jimbo" },
    { component: <CardRestroverse key="restroverse" syncTick={syncTick} />, name: "RESTROVERSE", url: "/channels/restroverse" },
    { component: <CardShramdan key="shramdan" syncTick={syncTick} />, name: "SHRAMDAN", url: "/channels/shramdan" },
  ];

  return (
    <section
      id="showcase"
      className="relative w-full overflow-hidden"
      style={{ minHeight: inTv ? "100%" : "100svh" }}
    >
      {/* ── MOBILE ONLY LAYOUT ── */}
      {/* Bottom-anchored flex column (like HomeOrbital): the logo/rings sit
          behind as an absolute layer, copy + grid hug the base. No min-h/spacer
          so it can't overflow the height-locked, bottom-nav-shortened screen. */}
      <div className="flex flex-col justify-end md:hidden relative w-full h-full pb-4">
        {/* Center Galaxy/Logo System for Mobile — omitted when the orbital layout
            renders the persistent Sun behind this scene. */}
        {!externalSun && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-[5]"
          style={{ transformOrigin: "center center" }}
          initial={{ scale: 0.2, rotate: -25, opacity: 0 }}
          animate={{ scale: 0.38, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 15,
            delay: 0.1,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <OrbitalRings />
            </div>

            <div
              className="absolute inset-0 z-[4] pointer-events-none flex items-center justify-center"
              aria-hidden
            >
              <div
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.1) 40%, transparent 68%)",
                  filter: "blur(50px)",
                  animation: "logo-breathe 9s ease-in-out infinite",
                }}
              />
            </div>

            <div className="absolute inset-0 z-[5] pointer-events-none flex items-center justify-center">
              <LogoCentered />
            </div>
          </div>
        </motion.div>
        )}

        {/* Foreground copy and mobile projects grid — bottom-anchored by the
            parent's justify-end; the absolute logo/rings layer sits behind. */}
          <div className="flex flex-col justify-center pointer-events-auto">
            {/* Brand copy — Home identity only; omitted on the orbital Projects view */}
            {!externalSun && (
            <motion.div
              className="showcase-copy-stack flex mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.45 }}
            >
              <BrandCopy isMobile={true} />
            </motion.div>
            )}

            {/* Projects intro — replaces the brand copy on the orbital /projects
                view, sitting just above the product grid. */}
            {externalSun && (
              <div className="mb-5 flex justify-center px-2">
                <ProjectsIntro mobile />
              </div>
            )}

            {/* Mobile Projects Grid */}
            <div className="w-full max-w-[320px] mx-auto px-2 mb-6 z-20">
              <div className="grid grid-cols-2 gap-2.5">
                {mobileProjects.map((proj, idx) => {
                  return (
                    <motion.div
                      key={proj.name}
                      className="glass-light rounded-xl p-2.5 flex flex-col gap-1 cursor-pointer border border-white/5 select-none active:scale-95 transition-transform"
                      style={{
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      onClick={() => handleMobileTap(proj.url)}
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
          </div>
        </div>

      <div 
        className="showcase-solar hidden md:grid grid-cols-[1fr_minmax(350px,420px)_1fr] lg:grid-cols-[1fr_minmax(400px,500px)_1fr] xl:grid-cols-[1fr_minmax(460px,580px)_1fr] gap-x-6 lg:gap-x-16 gap-y-8 items-center justify-center max-w-[1200px] lg:max-w-[1350px] xl:max-w-[1500px] mx-auto px-6 min-h-screen relative z-20 py-16 pointer-events-none"
        style={{ perspective: 1200 }}
      >
        {/* Column 1: Left Column (Yantracore 1st, Restroverse 3rd) */}
        <div className="flex flex-col gap-8 lg:gap-11 items-end justify-center w-full h-full pointer-events-auto">
          {/* Card 1: Yantracore (index 0) */}
          <FloatingCard
            key={0}
            side="left"
            vert="top"
            delay="0s"
            duration="14s"
            depth="front"
            url={cardData[0].url}
            projectName={cardData[0].name}
            xOffset={-120}
            yOffset={-120}
            index={0}
          >
            {cardData[0].component}
          </FloatingCard>

          {/* Card 3: Restroverse (index 2) */}
          <FloatingCard
            key={2}
            side="left"
            vert="bottom"
            delay="-9s"
            duration="18s"
            depth="mid"
            url={cardData[2].url}
            projectName={cardData[2].name}
            xOffset={-120}
            yOffset={120}
            index={2}
          >
            {cardData[2].component}
          </FloatingCard>
        </div>

        {/* Column 2: Center Column */}
        <div className="flex flex-col items-center justify-center w-full h-full relative pointer-events-none min-h-[480px] -mt-16 lg:-mt-24">
          {/* Centre logo + copy — omitted on the orbital Projects view, where the
              persistent Sun is rendered by the layout. */}
          {!externalSun && (<>
          <motion.div
            className="relative w-full aspect-square flex items-center justify-center pointer-events-none"
            style={{ transformOrigin: "center center" }}
            initial={{ scale: 0.2, rotate: -25, opacity: 0 }}
            animate={{ scale: 0.7, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 40,
              damping: 15,
              delay: 0.1,
            }}
          >
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
                  width: 420,
                  height: 420,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(110,86,255,0.22) 0%, rgba(0,224,203,0.1) 40%, transparent 68%)",
                  filter: "blur(50px)",
                  animation: "logo-breathe 9s ease-in-out infinite",
                }}
              />
            </div>

            {/* Logo centre */}
            <div className="relative w-[320px] h-[320px] z-[5] flex items-center justify-center pointer-events-auto">
              <LogoCentered />
            </div>
          </motion.div>

          {/* Brand Copy below Logo */}
          <motion.div
            className="-mt-10 lg:-mt-20 xl:-mt-28 z-[10] flex w-full justify-center pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.45 }}
          >
            <BrandCopy isMobile={false} />
          </motion.div>
          </>)}

          {/* Projects intro — shown on the orbital /projects view in place of the
              brand copy. Anchored low in the centre column (a top-% so it survives
              the height-locked TV's bottom clip and the showcase-solar centre-origin
              scaling) so it reads below the persistent Sun, nested in the gap between
              the two lower product cards. */}
          {externalSun && (
            <div className="pointer-events-auto absolute inset-x-0 top-[61%] flex justify-center px-4">
              <ProjectsIntro />
            </div>
          )}
        </div>

        {/* Column 3: Right Column (Jimbo 2nd, Shramdan 4th) */}
        <div className="flex flex-col gap-8 lg:gap-11 items-start justify-center w-full h-full pointer-events-auto">
          {/* Card 2: Jimbo (index 1) */}
          <FloatingCard
            key={1}
            side="right"
            vert="top"
            delay="-5s"
            duration="17s"
            depth="mid"
            url={cardData[1].url}
            projectName={cardData[1].name}
            xOffset={120}
            yOffset={-120}
            index={1}
          >
            {cardData[1].component}
          </FloatingCard>

          {/* Card 4: Shramdan (index 3) */}
          <FloatingCard
            key={3}
            side="right"
            vert="bottom"
            delay="-13s"
            duration="15s"
            depth="front"
            url={cardData[3].url}
            projectName={cardData[3].name}
            xOffset={120}
            yOffset={120}
            index={3}
          >
            {cardData[3].component}
          </FloatingCard>
        </div>
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
      <YantraElectricTitle
        as="h2"
        text="YantraCore"
        size={isMobile ? "xl" : "3xl"}
      />
      <p
        className="max-w-[320px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] md:max-w-none md:text-xs md:tracking-[0.24em]"
        style={{ color: "var(--text-mid)" }}
      >
        Technology for a Better World
      </p>
      <p
        className="max-w-[300px] text-xs leading-relaxed md:max-w-2xl md:text-sm"
        style={{ color: "var(--text-low)" }}
      >
        We believe technology should do more than solve problems. It should improve lives, empower people, and help build a smarter, more connected world. At YantraCore, we transform bold ideas into powerful digital products - apps, platforms, and intelligent systems that are fast, elegant, practical, and built to make life simpler, work smarter, and communities stronger.
        <br />
        <br />
        Technology with purpose. Built for impact.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ProjectsIntro — the orienting copy for the /projects orbital view.
   Where Home shows the brand wordmark, the Projects page omits its own
   centre logo (the persistent Sun fills that role) and instead explains
   what the orbiting cards are: YantraCore's growing ecosystem of work.
   Staggers in on the site's shared Rise curve; `mobile` tightens the
   scale for the phone layout above the product grid.
   ───────────────────────────────────────────────────────────────── */
function ProjectsIntro({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={`flex w-full flex-col items-center text-center ${
        mobile ? "max-w-[340px] gap-2" : "max-w-[520px] gap-3"
      }`}
    >
      <Rise delay={0.08} y={mobile ? 10 : 18}>
        {/* The page's main heading — the orbital /projects view had none until
            now. Styled as a quiet mono eyebrow so it labels without competing
            with the Sun. */}
        <h1
          className={`font-mono uppercase text-text-mid ${
            mobile ? "text-[10px] tracking-[0.24em]" : "text-[11px] tracking-[0.28em]"
          }`}
        >
          Our Projects
        </h1>
      </Rise>

      <Rise delay={0.16} y={mobile ? 10 : 18}>
        <p
          className={`text-balance leading-relaxed ${
            mobile ? "text-[12px]" : "text-[15px] md:text-base"
          }`}
          style={{ color: "var(--text-mid)" }}
        >
          A growing ecosystem of apps, AI agents, platforms, and social-impact
          tools — built by YantraCore to serve people, businesses, and
          communities.
        </p>
      </Rise>

      <Rise delay={0.24} y={mobile ? 10 : 18}>
        <p
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] ${
            mobile ? "text-[9px]" : "text-[11px]"
          }`}
          style={{ color: "var(--accent-2)" }}
        >
          <Sparkles className={mobile ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
          Explore what we&rsquo;re building
        </p>
      </Rise>
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
  const { themeMode } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [lineTarget, setLineTarget] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
    position: "relative",
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
    scale.set(0.975);
  };

  const handleMouseUp = () => {
    scale.set(1);
  };

  const handleCardClick = () => {
    if (url) {
      router.push(url);
    }
  };

  const accentColor =
    index === 0
      ? "var(--accent-2)" // Yantracore
      : index === 1
      ? "var(--accent-1)" // Jimbo
      : index === 2
      ? "var(--accent-2)" // Restroverse
      : "var(--accent-warm)"; // Shramdan

  const isReady = lineTarget.x !== 0 || lineTarget.y !== 0;

  return (
    <motion.div
      className="hidden md:block pointer-events-auto"
      style={{ 
        ...pos, 
        ...depthStyle[depth], 
        perspective: 1000, 
        zIndex: 20,
        transformOrigin: "center center",
      }}
      initial={{ 
        opacity: 0,
        scale: 0.85,
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
      }}
      transition={{
        scale: { type: "spring", stiffness: 55, damping: 14, delay: 0.45 + index * 0.15 },
        opacity: { duration: 0.7, ease: "easeOut", delay: 0.45 + index * 0.15 }
      }}
    >
      {/* Outer drift wrapper */}
      <motion.div style={{ x: driftX, y: driftY }}>
        
        {/* Dynamic Bezier Connector Line */}
        {isReady && (
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ delay: 1.0 + index * 0.15, duration: 0.8 }}
              className="filter blur-sm"
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke={`url(#connector-grad-${side}-${vert})`}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 + index * 0.15, duration: 0.8 }}
            />
            <motion.circle
              cx={circleCx}
              cy={circleCy}
              r="2.5"
              fill={accentColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.0 + index * 0.15, duration: 0.8 }}
            />
          </svg>
        )}

        {/* Card wrapper block */}
        <div
          className={url ? "cursor-pointer" : "cursor-default"}
        >
          <AnimatedBorder 
            variant="sweep" 
            radius={24} 
            duration={8000}
            style={{
              "--border-opacity": isEntering ? 1 : (isHovered ? 1 : 0.15),
              "--border-transition-duration": isEntering ? "1.5s" : "0.8s",
            } as React.CSSProperties}
          >
            {/* Interactive card surface */}
            <motion.div
              ref={cardRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onClick={handleCardClick}
              className="glass-medium rounded-[24px] p-4 w-[270px] h-[360px] relative overflow-hidden select-none focus-visible:outline-none group flex flex-col cursor-default"
              animate={{
                boxShadow: isEntering
                  ? `var(--nm-raised-medium), 0 0 35px color-mix(in srgb, ${accentColor} 45%, transparent)`
                  : isHovered
                  ? themeMode === "light"
                    ? undefined
                    : `var(--nm-raised-medium), 0 0 25px color-mix(in srgb, ${accentColor} 30%, transparent)`
                  : themeMode === "light"
                  ? undefined
                  : `var(--nm-raised-medium), 0 0 10px color-mix(in srgb, ${accentColor} 10%, transparent)`,
              }}
              whileTap={
                themeMode === "light"
                  ? undefined
                  : {
                      boxShadow: `var(--nm-sunken-medium), 0 0 12px color-mix(in srgb, ${accentColor} 20%, transparent)`,
                    }
              }
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

interface ProductCardHeaderProps {
  logoImg: string;
  unicodeChar: string;
  title: string;
  description?: string;
  accentColor: string;
  url?: string;
  showExternalLink?: boolean;
}

function ProductCardHeader({
  logoImg,
  unicodeChar,
  title,
  description,
  accentColor,
  url,
  showExternalLink = true,
}: ProductCardHeaderProps) {
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

      {/* ── Open in New Tab Icon towards the right ── */}
      {showExternalLink && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-low hover:text-text-hi transition-all p-1.5 pointer-events-auto mr-0.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
          title="Open in new tab"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

/* ============================================================
   CardJimbo — WhatsApp / AI agent scene
   ============================================================ */
const CONVERSATION_FLOW = [
  { sender: "user", text: "Is a lake view room at Rupakot Resort available tonight?" },
  { sender: "jimbo", text: "Checking the live calendar... 🏨" },
  { sender: "jimbo", text: "Yes! A lake view room at Rupakot Resort is open. Would you like me to book it?" },
  { sender: "user", text: "Awesome! Yes, please book it." },
  { sender: "jimbo", text: "Processing reservation... 💳" },
  { sender: "jimbo", text: "Booking confirmed! 🌟 Check your WhatsApp/email for details." },
  { sender: "user", text: "Perfect! Thanks for the quick help." },
  { sender: "jimbo", text: "You're welcome! 💚" },
] as const;


function CardJimbo() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ sender: "user" | "jimbo"; text: string }>>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [typingSender, setTypingSender] = useState<"user" | "jimbo" | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [resetNonce, setResetNonce] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInteractiveRef = useRef(isInteractive);
  const inputScrollRef = useRef<HTMLParagraphElement>(null);

  // Scroll to the end of the input text as it is typed to keep the typing visible
  useEffect(() => {
    if (inputScrollRef.current) {
      inputScrollRef.current.scrollLeft = inputScrollRef.current.scrollWidth;
    }
  }, [inputValue]);

  // Keep ref synchronized with the latest value of isInteractive
  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  // Auto-simulation flow
  useEffect(() => {
    if (isInteractive) return;

    let timeoutId: NodeJS.Timeout;

    const runSimulationStep = (currentStep: number) => {
      if (isInteractiveRef.current) return;
      if (currentStep >= CONVERSATION_FLOW.length) {
        // Reset simulation and loop back after a pause
        timeoutId = setTimeout(() => {
          if (isInteractiveRef.current) return;
          setMessages([]);
          setInputValue("");
          setTypingSender(null);
          timeoutId = setTimeout(() => {
            if (isInteractiveRef.current) return;
            runSimulationStep(0);
          }, 1000);
        }, 3000);
        return;
      }

      const nextMsg = CONVERSATION_FLOW[currentStep];

      if (nextMsg.sender === "user") {
        setTypingSender(null);
        let charIndex = 0;
        setInputValue("");

        const typeChar = () => {
          if (isInteractiveRef.current) return;
          if (charIndex < nextMsg.text.length) {
            const nextText = nextMsg.text.substring(0, charIndex + 1);
            setInputValue(nextText);
            charIndex++;
            const speed = 35 + Math.random() * 45;
            timeoutId = setTimeout(typeChar, speed);
          } else {
            // Finished typing, wait 700ms before sending
            timeoutId = setTimeout(() => {
              if (isInteractiveRef.current) return;
              setIsSending(true);
              setTimeout(() => setIsSending(false), 150);

              setMessages(prev => [...prev, nextMsg]);
              setInputValue("");

              // Wait 1.2s before next step (starts Jimbo typing)
              timeoutId = setTimeout(() => {
                if (isInteractiveRef.current) return;
                runSimulationStep(currentStep + 1);
              }, 1200);
            }, 700);
          }
        };

        // Start typing after a short 600ms hesitation/pause
        timeoutId = setTimeout(typeChar, 600);
      } else {
        // Jimbo typing
        setTypingSender("jimbo");

        // Show typing animation for 2 seconds
        timeoutId = setTimeout(() => {
          if (isInteractiveRef.current) return;
          setMessages(prev => [...prev, nextMsg]);
          setTypingSender(null);

          // Wait 1.5 seconds pause before next step
          timeoutId = setTimeout(() => {
            if (isInteractiveRef.current) return;
            runSimulationStep(currentStep + 1);
          }, 1500);
        }, 2000);
      }
    };

    // Initial load delay
    timeoutId = setTimeout(() => {
      if (isInteractiveRef.current) return;
      runSimulationStep(0);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isInteractive, resetNonce]);

  // Scroll to bottom on new messages or typing indicators
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typingSender]);

  const handleReset = () => {
    setMessages([]);
    setIsInteractive(false);
    setTypingSender(null);
    setInputValue("");
    setResetNonce(prev => prev + 1);
  };

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open("https://jimbo.yantracore.com/#hire-jimbo", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col h-full w-full gap-2">
      {/* Header */}
      <ProductCardHeader
        logoImg="/images/logo/jimbo_logo.png"
        unicodeChar="💬"
        title="JIMBO"
        description="Your 24/7 AI business assistant."
        accentColor="var(--accent-1)"
        url="https://jimbo.yantracore.com/"
      />

      {/* WhatsApp-style phone UI */}
      <div
        className="my-3 rounded-xl overflow-hidden border border-white/5 shadow-[var(--nm-sunken-soft)] flex flex-col flex-1 min-h-0"
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
              {typingSender === "jimbo" ? "typing..." : "online"}
            </p>
          </div>
          {isInteractive && (
            <button
              onClick={handleReset}
              title="Reset simulation"
              className="p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center mr-1 pointer-events-auto"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
          <Video className="w-2.5 h-2.5 text-white/40" />
          <Phone className="w-2.5 h-2.5 text-white/40" />
          <MoreVertical className="w-2.5 h-2.5 text-white/40" />
        </div>
        <div
          ref={chatContainerRef}
          className="p-2 overflow-y-auto scroll-smooth jimbo-chat-scrollbar flex flex-col flex-1 min-h-[130px]"
          style={{ background: "linear-gradient(180deg, #0b141a 0%, #131c23 100%)" }}
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
            {typingSender && (
              <div
                className={`flex ${
                  typingSender === "user" ? "justify-end" : "justify-start"
                } animate-chat-fade`}
              >
                <div
                  className={`${
                    typingSender === "user"
                      ? "bg-[#005c4b] rounded-tr-sm"
                      : "bg-[#202c33] rounded-tl-sm"
                  } px-2.5 py-2 rounded-lg`}
                >
                  <TypingDots colorClass="bg-white/70" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="bg-[#1f2c33] px-2 py-1 flex items-center gap-1.5 border-t border-white/5 pointer-events-none">
          <p
            ref={inputScrollRef}
            className="flex-1 bg-[#2a3942] text-white text-[10px] px-2.5 py-1 rounded-full outline-none border border-transparent font-sans select-none overflow-hidden whitespace-nowrap flex items-center gap-0.5"
          >
            {inputValue ? (
              <>
                <span>{inputValue}</span>
                {!isInteractive && (
                  <span className="w-1 h-3 bg-emerald-500 animate-[pulse_1s_infinite] flex-shrink-0" style={{ display: 'inline-block' }} />
                )}
              </>
            ) : (
              <span className="text-white/30">Type a message...</span>
            )}
          </p>
          <button 
            disabled
            tabIndex={-1}
            className={`w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 transition-transform select-none ${
              isSending ? "scale-90" : ""
            }`}
          >
            <Send className="w-3 h-3 text-[#111b21] stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full pointer-events-auto">
        <button
          onClick={handleHire}
          className="w-full py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 cursor-pointer"
          style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
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
  "boutique heritage hotel in kathmandu with traditional courtyard",
  "peaceful resort in pokhara lakeside with annapurna views",
  "cozy tea house lodge in namche bazaar for trekkers",
  "luxury jungle safari resort in chitwan with wildlife tours",
  "hill resort in dhulikhel with panoramic sunrise views"
];

interface HospitalitySearchInputProps {
  queryIndex: number;
  isInteractive: boolean;
  setIsInteractive: (v: boolean) => void;
  swiperRef: SwiperInstance | null;
}

function HospitalitySearchInput({
  queryIndex,
  isInteractive,
  setIsInteractive,
  swiperRef,
}: HospitalitySearchInputProps) {
  const [displayText, setDisplayText] = useState("");
  const [prevQueryIndex, setPrevQueryIndex] = useState(queryIndex);
  const [prevIsInteractive, setPrevIsInteractive] = useState(isInteractive);
  const textContainerRef = useRef<HTMLParagraphElement>(null);

  // Sync state during render to avoid synchronous effects and ref lint issues
  if (prevQueryIndex !== queryIndex || prevIsInteractive !== isInteractive) {
    setPrevQueryIndex(queryIndex);
    setPrevIsInteractive(isInteractive);
    if (!isInteractive) {
      setDisplayText("");
    } else {
      setDisplayText(SEARCH_QUERIES[queryIndex % SEARCH_QUERIES.length] || "");
    }
  }

  // Scroll to the end of the text as it is typed to keep the cursor visible
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollLeft = textContainerRef.current.scrollWidth;
    }
  }, [displayText]);

  // Typing animation cycle for Restroverse search bar query
  useEffect(() => {
    if (isInteractive) return;

    const fullQuery = SEARCH_QUERIES[queryIndex % SEARCH_QUERIES.length] || "";
    if (!fullQuery) return;

    let timer: NodeJS.Timeout;

    if (displayText === fullQuery) {
      // Pause at full length for 2.5 seconds, then trigger swiper slideNext
      timer = setTimeout(() => {
        if (swiperRef) {
          swiperRef.slideNext(1200);
        }
      }, 2500);
    } else {
      // Type out character by character
      timer = setTimeout(() => {
        setDisplayText(fullQuery.substring(0, displayText.length + 1));
      }, 50);
    }

    return () => clearTimeout(timer);
  }, [displayText, queryIndex, isInteractive, swiperRef]);

  // Reset interaction mode after 8 seconds of inactivity
  useEffect(() => {
    if (!isInteractive) return;

    const timer = setTimeout(() => {
      setIsInteractive(false);
      setDisplayText("");
    }, 8000);

    return () => clearTimeout(timer);
  }, [isInteractive, displayText, queryIndex, setIsInteractive]);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-inner">
      <Sparkles className="w-3 h-3 text-accent-2 flex-shrink-0 animate-pulse" />
      <p 
        ref={textContainerRef}
        className="text-[10px] text-text-hi font-mono flex-1 flex items-center gap-0.5 overflow-hidden whitespace-nowrap"
      >
        <span>{displayText}</span>
        {!isInteractive && (
          <span className="w-1 h-3 bg-accent-2 animate-[pulse_1s_infinite] flex-shrink-0" style={{ display: 'inline-block' }} />
        )}
      </p>
    </div>
  );
}

function CardRestroverse({ syncTick = 0 }: { syncTick?: number }) {
  const router = useRouter();
  const [queryIndex, setQueryIndex] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  // Auto-simulation flow synced centrally
  useEffect(() => {
    if (isInteractive) return;
    swiperRef?.slideNext(1300);
  }, [syncTick, isInteractive, swiperRef]);

  const hotelSlides = [
    {
      name: "Dwarika's Heritage",
      location: "Kathmandu",
      match: "99%",
      price: "$240",
      rating: "4.9",
      gradient: "linear-gradient(135deg, rgba(255,180,84,0.35) 0%, rgba(255,79,176,0.25) 50%, rgba(110,86,255,0.15) 100%)",
      amenities: [Sparkles, Wifi, UtensilsCrossed],
      image: "/images/restroverse/dwarikas_heritage.png"
    },
    {
      name: "Fishtail Lodge",
      location: "Pokhara",
      match: "96%",
      price: "$145",
      rating: "4.8",
      gradient: "linear-gradient(135deg, rgba(0,224,203,0.3) 0%, rgba(0,180,219,0.2) 50%, rgba(0,131,176,0.15) 100%)",
      amenities: [Waves, Wifi, UtensilsCrossed],
      image: "/images/restroverse/lakeside_oasis.png"
    },
    {
      name: "Yeti Mountain Home",
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
      name: "Dwarika's Resort",
      location: "Dhulikhel",
      match: "94%",
      price: "$190",
      rating: "4.6",
      gradient: "linear-gradient(135deg, rgba(241,95,121,0.35) 0%, rgba(240,152,25,0.2) 100%)",
      amenities: [Compass, Wifi, Waves],
      image: "/images/restroverse/himalayan_horizon.png"
    }
  ];

  const handlePillClick = (index: number) => {
    setIsInteractive(true);
    setQueryIndex(index);
    if (swiperRef) {
      swiperRef.slideToLoop(index);
    }
  };

  const handleShowcase = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open("https://restroverse.app/join", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <ProductCardHeader
        logoImg="/images/logo/restroverse_logo.png"
        unicodeChar="✨"
        title="RESTROVERSE"
        description="Discover your perfect experience."
        accentColor="var(--accent-2)"
        url="https://restroverse.app"
      />

      <div className="my-3 flex flex-col gap-2 flex-1 min-h-0 rounded-xl overflow-hidden border border-white/5 shadow-[var(--nm-sunken-soft)] p-1.5 bg-white/[0.02] backdrop-blur-sm">
        <HospitalitySearchInput
          queryIndex={queryIndex}
          isInteractive={isInteractive}
          setIsInteractive={setIsInteractive}
          swiperRef={swiperRef}
        />

        {/* Filter Pills */}
        <div className="flex gap-1 justify-center pointer-events-auto">
          {[
            { label: "KTM", index: 0, query: "boutique heritage hotel in kathmandu with traditional courtyard" },
            { label: "PKR", index: 1, query: "peaceful resort in pokhara lakeside with annapurna views" },
            { label: "CTW", index: 3, query: "luxury jungle safari resort in chitwan with wildlife tours" }
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={(e) => {
                e.stopPropagation();
                handlePillClick(pill.index);
              }}
              className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-[7.5px] font-mono text-text-low hover:text-text-hi transition-all"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Swiper Coverflow Carousel */}
        <div className="w-full relative overflow-hidden select-none h-[144px]">
          <Swiper
            onSwiper={setSwiperRef}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.15}
            loop={true}
            onTouchStart={() => setIsInteractive(true)}
            onSlideChange={(swiper) => {
              const newIdx = swiper.realIndex ?? 0;
              setQueryIndex(newIdx);
            }}
            coverflowEffect={{
              rotate: 15,
              stretch: -12,
              depth: 75,
              modifier: 1.2,
              slideShadows: false,
            }}
            modules={[EffectCoverflow]}
            className="w-full h-full"
          >
            {hotelSlides.map((hotel, index) => (
              <SwiperSlide key={index} className="w-full flex justify-center pt-2.5 pb-4">
                <div
                  className="flex gap-2.5 p-2 rounded-xl w-full h-full text-left relative group/slide overflow-hidden"
                  style={{
                    background: "var(--ink-1)",
                    border: "1px solid var(--nm-line-soft)",
                    boxShadow: "var(--nm-raised-soft)",
                  }}
                >
                  {/* Decorative digital grid background overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:6px_6px]" />

                  {/* Left Side: Large Visual Image with Overlay badges */}
                  <div className="relative w-[38%] h-full rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-700 group-hover/slide:scale-110 [.swiper-slide-active_&]:scale-110"
                    />
                    {/* Glass gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    
                    {/* Match percentage badge overlaid on image */}
                    <div className="absolute top-1 left-1 flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                      <Sparkles className="w-1.5 h-1.5 text-accent-2" />
                      <span className="text-[5.5px] font-mono font-bold text-text-hi leading-none">{hotel.match}</span>
                    </div>

                    {/* Location overlay at the bottom of the image */}
                    <div className="absolute bottom-1 left-1 flex items-center gap-0.5">
                      <MapPin className="w-1.5 h-1.5 text-accent-2" />
                      <span className="text-[7px] font-medium text-white truncate max-w-[70px]">{hotel.location}</span>
                    </div>
                  </div>

                  {/* Right Side: Smart Information Panel */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0 z-10">
                    
                    {/* Top: Futuristic Pass Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
                      <span className="text-[5.5px] font-mono tracking-widest text-text-low uppercase">PREMIUM ACCESS</span>
                      <div className="w-3.5 h-2 rounded-[2px] bg-white/10 border border-white/20 flex items-center justify-center opacity-85 shrink-0">
                        {/* Microchip look */}
                        <div className="w-2 h-1 bg-amber-400/30 rounded-[1px] border border-amber-400/40" />
                      </div>
                    </div>

                    {/* Middle: Venue Name, Rating, Price */}
                    <div className="space-y-0.5 my-1">
                      <p className="text-[10px] font-bold text-text-hi leading-tight tracking-wide font-sans group-hover/slide:text-accent-2 [.swiper-slide-active_&]:text-accent-2 transition-colors truncate">
                        {hotel.name}
                      </p>
                      
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
                          <span className="text-[8px] text-text-hi font-bold leading-none">{hotel.rating}</span>
                        </div>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <p className="text-[8px] text-text-low leading-none">
                          From <span className="text-text-hi font-bold">{hotel.price}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Amenities & Security / Digital Code */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                      {/* Amenities Row */}
                      <div className="flex items-center gap-0.5">
                        {hotel.amenities.map((Amenity, idx) => (
                          <div key={idx} className="p-0.5 rounded bg-white/[0.04] border border-white/5 transition-all hover:bg-white/10">
                            <Amenity className="w-2 h-2 text-text-low hover:text-accent-2" />
                          </div>
                        ))}
                      </div>

                      {/* Small futuristic barcode or id stamp */}
                      <div className="flex flex-col items-end opacity-40">
                        <span className="text-[4px] font-mono text-text-low leading-none">ID-00{index + 9}</span>
                        <div className="flex gap-[0.5px] h-2.5 mt-0.5">
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
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
      <div className="flex w-full pointer-events-auto">
        <button
          onClick={handleShowcase}
          className="w-full py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center cursor-pointer"
          style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
        >
          List Your Business
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
    name: "Fewa Lake Cleanup",
    location: "Pokhara",
    address: "Fewa Lake Ghat, Ward 6",
    time: "Every Sat, 7:00 AM",
    volunteers: 48,
    hours: 6,
    initialLikes: 142,
    image: "/images/shramdan-cleanup-result-eg.png",
    progress: 82,
    impact: "150kg waste collected",
    tag: "Clean Up",
    avatars: ["#f43f5e", "#10b981", "#3b82f6", "#f59e0b"]
  },
  {
    id: "treeplanting",
    name: "Sauraha Reforestation",
    location: "Chitwan",
    address: "Sauraha Buffer Zone",
    time: "Weekly Sun, 8:00 AM",
    volunteers: 31,
    hours: 4,
    initialLikes: 98,
    image: "/images/shramdan-tree-planting.png",
    progress: 64,
    impact: "450 saplings planted",
    tag: "Ecology",
    avatars: ["#8b5cf6", "#ec4899", "#10b981", "#06b6d4"]
  },
  {
    id: "fooddist",
    name: "Bagmati Cleaning Drive",
    location: "Kathmandu",
    address: "Gaurighat, Kathmandu",
    time: "Every Sat, 7:30 AM",
    volunteers: 22,
    hours: 3,
    initialLikes: 84,
    image: "/images/shramdan-food-distribution.png",
    progress: 95,
    impact: "2.5 tons waste cleared",
    tag: "River Cleanup",
    avatars: ["#3b82f6", "#f59e0b", "#ef4444", "#10b981"]
  },
];

function CardShramdan({ syncTick = 0 }: { syncTick?: number }) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const [likes, setLikes] = useState<number[]>(SHRAMDAN_PROJECTS.map(p => p.initialLikes));
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  // Neumorphic surface recipes — raised tactile chips + a carved sunken groove
  const nmChip = "3px 3px 7px #050608, -3px -3px 7px #131829";
  const nmGroove = "inset 2px 2px 5px #010203, inset -1px -1px 3px #171c30";

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
    <div className="flex flex-col h-full w-full relative gap-2">
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

      <ProductCardHeader
        logoImg="/images/logo/shramdaan_logo.png"
        unicodeChar="🌱"
        title="SHRAMDAN"
        description="Come together and solve social problems."
        accentColor="var(--accent-warm)"
        url="https://shramdan.org"
      />

      <div className="my-3 flex flex-col gap-2 flex-1 min-h-0 relative overflow-hidden pointer-events-auto">
        <Swiper
          onSwiper={setSwiperRef}
          effect="creative"
          grabCursor={true}
          loop={true}
          speed={1000}
          creativeEffect={{
            limitProgress: 2,
            prev: {
              opacity: 0,
              scale: 0.9,
              translate: ["-105%", 0, 0],
              rotate: [0, 0, 0],
            },
            next: {
              opacity: 0,
              scale: 0.9,
              translate: ["105%", 0, 0],
              rotate: [0, 0, 0],
            },
          }}
          onSlideChange={(swiper) => setActiveIdx(swiper.realIndex)}
          modules={[EffectCreative, Autoplay]}
          className="w-full h-full"
        >
          {SHRAMDAN_PROJECTS.map((project, index) => (
            <SwiperSlide key={project.id} className="w-full h-full">
              <div
                className="flex flex-col gap-2 w-full h-full rounded-2xl border border-white/[0.04] p-2 backdrop-blur-sm"
                style={{ background: "var(--ink-1)", boxShadow: "var(--nm-sunken-soft)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInteractive(true);
                  swiperRef?.slideToLoop(index, 1000);
                }}
              >
                {/* Project visual — raised neumorphic photo frame */}
                <div
                  className="relative rounded-xl overflow-hidden h-[104px] flex-shrink-0 w-full"
                  style={{ background: "var(--ink-0)", boxShadow: "var(--nm-raised-soft)", border: "1px solid var(--nm-line-soft)" }}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} before and after`}
                    fill
                    sizes="(max-width: 768px) 240px, 300px"
                    className="object-cover"
                  />
                  {/* Legibility gradient for the overlaid chrome */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/25 pointer-events-none" />

                  {/* Category tag — top-left */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/55 border border-white/10 backdrop-blur-md text-[7px] font-mono uppercase tracking-wider text-accent-warm leading-none">
                    {project.tag}
                  </div>

                  {/* Pagination — top-right (active pill grows) */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-30 pointer-events-auto">
                    {SHRAMDAN_PROJECTS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleDotClick(idx, e)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          activeIdx === idx
                            ? "w-4 bg-accent-warm shadow-[0_0_6px_var(--accent-warm)]"
                            : "w-1.5 bg-white/35 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Location — bottom-left */}
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
                    <MapPin className="w-2 h-2 text-accent-warm" />
                    <span className="text-[7.5px] text-text-hi leading-none font-medium">{project.location}</span>
                  </div>

                  {/* Social proof — bottom-right avatar stack */}
                  <div className="absolute bottom-1.5 right-1.5 flex -space-x-1.5 items-center">
                    {project.avatars.slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border border-black/60 flex items-center justify-center text-[6.5px] font-bold text-white"
                        style={{
                          backgroundColor: color,
                          backgroundImage: "radial-gradient(circle at top, rgba(255,255,255,0.25) 0%, transparent 75%)",
                        }}
                      >
                        {["A", "S", "R", "N"][idx]}
                      </div>
                    ))}
                    <div className="w-4 h-4 rounded-full bg-black/55 border border-white/20 backdrop-blur-md flex items-center justify-center text-[6px] text-text-hi font-bold">
                      +{Math.max(project.volunteers - 3, 0)}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-h-0">
                  {/* Title + Like */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-text-hi leading-tight truncate">{project.name}</p>
                      <p className="text-[8px] text-text-low font-mono leading-none mt-0.5 truncate">{project.address}</p>
                    </div>
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-shrink-0 active:scale-95 transition-transform pointer-events-auto"
                      style={{ background: "var(--ink-1)", boxShadow: nmChip, border: "1px solid var(--nm-line-soft)" }}
                    >
                      <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                      <span className="text-[9px] text-text-hi font-semibold leading-none">{likes[index]}</span>
                    </button>
                  </div>

                  {/* Impact + carved progress groove */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[8.5px] font-mono leading-none">
                      <span className="text-text-mid flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5 text-accent-warm" />
                        {project.impact}
                      </span>
                      <span className="text-accent-warm font-bold">{project.progress}%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden relative"
                      style={{ background: "var(--ink-0)", boxShadow: nmGroove }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300"
                        style={{ width: `${project.progress}%`, boxShadow: "0 0 8px rgba(255,180,84,0.55)" }}
                      />
                    </div>
                  </div>

                  {/* Footer — raised neumorphic stat chips */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-1 min-w-0"
                      style={{ background: "var(--ink-1)", boxShadow: nmChip, border: "1px solid var(--nm-line-soft)" }}
                    >
                      <Users className="w-2.5 h-2.5 text-accent-warm flex-shrink-0" />
                      <span className="text-[9px] text-text-hi font-bold leading-none">{project.volunteers}</span>
                      <span className="text-[7px] text-text-low leading-none">joined</span>
                    </div>
                    <div
                      className="flex items-center gap-1 px-1.5 py-1 rounded-lg flex-[1.4] min-w-0"
                      style={{ background: "var(--ink-1)", boxShadow: nmChip, border: "1px solid var(--nm-line-soft)" }}
                    >
                      <Clock className="w-2.5 h-2.5 text-accent-warm flex-shrink-0" />
                      <span className="text-[7.5px] text-text-hi font-medium leading-none truncate">{project.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://shramdan.org/events", "_blank", "noopener,noreferrer");
              }}
              className="w-full py-1.5 rounded-lg text-[9.5px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center cursor-pointer"
              style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
            >
              Participate
            </button>
      </div>
    </div>
  );
}

/* ============================================================
   CardCoreStatus — Yantra Core Active Status
   ============================================================ */
/* ============================================================
   CardCoreStatus Components & Main Dashboard Card
   ============================================================ */

function NeuralTelemetryMap() {
  const { themeMode } = useTheme();
  const [latency, setLatency] = useState(24.2);
  const [load, setLoad] = useState(41.8);
  const [speed, setSpeed] = useState(3.82);
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const delta = (Math.random() - 0.5) * 1.6;
        return parseFloat(Math.min(35, Math.max(12, prev + delta)).toFixed(1));
      });
      setLoad(prev => {
        const delta = (Math.random() - 0.5) * 3;
        return parseFloat(Math.min(60, Math.max(30, prev + delta)).toFixed(1));
      });
      setSpeed(prev => {
        const delta = (Math.random() - 0.5) * 0.15;
        return parseFloat(Math.min(4.2, Math.max(3.2, prev + delta)).toFixed(2));
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Self-driven telemetry pulse so the map stays alive on its own
  useEffect(() => {
    let pulseTimer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setPulseActive(true);
      pulseTimer = setTimeout(() => setPulseActive(false), 1100);
    }, 4200);
    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
    };
  }, []);

  const nodes = [
    { name: "SFO", x: 35, y: 25 },
    { name: "JFK", x: 105, y: 20 },
    { name: "FRA", x: 200, y: 30 },
    { name: "SGP", x: 165, y: 85 },
    { name: "LHM", x: 65, y: 80 },
  ];
  const center = { x: 120, y: 52 };

  return (
    <div className="flex-1 flex flex-col gap-2.5 w-full h-full min-h-0 select-none">
      {/* Topology Map Canvas/SVG */}
      <div
        className="relative flex-1 min-h-0 w-full rounded-xl border overflow-hidden flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: themeMode === "light" ? "var(--ink-0)" : "rgba(10, 12, 22, 0.4)",
          borderColor: themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)",
          boxShadow: "var(--nm-sunken-soft)",
        }}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-accent-2/5 to-transparent pointer-events-none" />
        
        <svg viewBox="0 0 240 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full absolute inset-0 pointer-events-none">
          <style>{`
            @keyframes telemetry-dash-flow {
              to { stroke-dashoffset: -20; }
            }
            @keyframes telemetry-dash-pulse {
              to { stroke-dashoffset: -100; }
            }
          `}</style>
          
          {/* Connection Lines from Center */}
          {nodes.map((node) => (
            <g key={node.name}>
              <line
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke="var(--accent-2)"
                strokeWidth={pulseActive ? "2" : "1"}
                strokeOpacity={pulseActive ? "0.4" : "0.15"}
                className="transition-all"
              />
              <line
                x1={center.x}
                y1={center.y}
                x2={node.x}
                y2={node.y}
                stroke="var(--accent-2)"
                strokeWidth="1.5"
                strokeOpacity={pulseActive ? "0.8" : "0.3"}
                strokeDasharray="4 16"
                style={{
                  strokeDashoffset: pulseActive ? -100 : undefined,
                  animation: pulseActive
                    ? "telemetry-dash-pulse 0.6s linear infinite"
                    : "telemetry-dash-flow 3s linear infinite",
                }}
              />
            </g>
          ))}

          {/* Central Core Hub */}
          <circle
            cx={center.x}
            cy={center.y}
            r={pulseActive ? 7 : 5}
            fill="var(--accent-2)"
            className="transition-all duration-300"
            style={{
              filter: "drop-shadow(0 0 4px var(--accent-2))",
            }}
          />
          <circle
            cx={center.x}
            cy={center.y}
            r={pulseActive ? 12 : 8}
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="1"
            strokeOpacity="0.4"
            className={pulseActive ? "animate-ping" : "animate-pulse"}
          />

          {/* Regional Edge Nodes */}
          {nodes.map((node) => (
            <g key={node.name}>
              <circle
                cx={node.x}
                cy={node.y}
                r="3.5"
                fill="var(--accent-1)"
                style={{
                  filter: "drop-shadow(0 0 3px var(--accent-1))",
                }}
              />
              {pulseActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="none"
                  stroke="var(--accent-1)"
                  strokeWidth="0.75"
                  className="animate-ping"
                />
              )}
              <text
                x={node.x}
                y={node.y - 7}
                textAnchor="middle"
                fill="var(--text-low)"
                fontSize="6.5px"
                fontFamily="monospace"
                fontWeight="bold"
                className="opacity-75"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating status tag */}
        <div className="absolute top-1.5 left-2 flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[7.5px] font-mono uppercase text-emerald-400 tracking-wider">Edge-Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div 
        className="grid grid-cols-3 gap-1.5 text-center border-t pt-2 transition-all duration-300"
        style={{
          borderColor: themeMode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="space-y-0.5">
          <p className="text-[7.5px] text-text-low font-mono uppercase tracking-wider">Avg Latency</p>
          <p className="text-[11px] font-bold text-accent-2 font-mono transition-all">
            {`${latency}ms`}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[7.5px] text-text-low font-mono uppercase tracking-wider">Cpu Core Load</p>
          <p className="text-[11px] font-bold text-accent-1 font-mono transition-all">
            {`${load}%`}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[7.5px] text-text-low font-mono uppercase tracking-wider">Bandwidth</p>
          <p className="text-[11px] font-bold text-text-hi font-mono transition-all">
            {`${speed}G`}
          </p>
        </div>
      </div>
    </div>
  );
}

function TechHexGrid() {
  const { themeMode } = useTheme();
  const [activeTechIndex, setActiveTechIndex] = useState(6); // Default to AI/ML (center node)

  const TECHNOLOGIES = [
    { name: "Next.js", icon: Sparkles, color: themeMode === "light" ? "#121420" : "#FFFFFF", desc: "Edge-rendered hybrid web framework" },
    { name: "React", icon: Cpu, color: themeMode === "light" ? "#008EA9" : "#61DAFB", desc: "Dynamic reactive components UI engine" },
    { name: "TypeScript", icon: Cpu, color: "#3178C6", desc: "Type-safe static structural developer safety" },
    { name: "Node.js", icon: Bot, color: "#339933", desc: "Async high-concurrency server runtime" },
    { name: "Python", icon: Cpu, color: "#3776AB", desc: "Robust data models & machine learning scripts" },
    { name: "AWS Cloud", icon: Sparkles, color: themeMode === "light" ? "#D97706" : "#FF9900", desc: "Serverless global edge routing & scale" },
    { name: "AI / ML", icon: Bot, color: themeMode === "light" ? "#D97706" : "#FF6F00", desc: "Neural networks, inference & model tools" },
  ];

  // Coordinates of hexagons forming a honeycomb
  const hexPositions = [
    { name: "Next.js", x: 93, y: 2 },
    { name: "React", x: 139, y: 28 },
    { name: "TypeScript", x: 139, y: 82 },
    { name: "Node.js", x: 93, y: 108 },
    { name: "Python", x: 47, y: 82 },
    { name: "AWS Cloud", x: 47, y: 28 },
    { name: "AI / ML", x: 93, y: 55 }, // Center node
  ];

  const orbitals = hexPositions.slice(0, 6);
  const activeTech = TECHNOLOGIES[activeTechIndex];

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full relative p-0.5 select-none">
      {/* Hex Honeycomb stage */}
      <div className="relative w-full h-[166px] mt-1 overflow-visible">
        {/* Connection paths inside SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <style>{`
            @keyframes hex-dash-flow {
              to { stroke-dashoffset: -20; }
            }
          `}</style>
          {orbitals.map((node) => (
            <g key={node.name}>
              <line
                x1={93 + 26}
                y1={55 + 29}
                x2={node.x + 26}
                y2={node.y + 29}
                stroke="var(--accent-2)"
                strokeWidth="1"
                strokeOpacity="0.15"
              />
              <line
                x1={93 + 26}
                y1={55 + 29}
                x2={node.x + 26}
                y2={node.y + 29}
                stroke={activeTech.name === node.name || activeTech.name === "AI / ML" ? activeTech.color : "var(--accent-2)"}
                strokeWidth="1.5"
                strokeOpacity={activeTech.name === node.name ? "0.7" : "0.1"}
                strokeDasharray="4 6"
                style={{
                  strokeDashoffset: activeTech.name === node.name ? 0 : undefined,
                  animation: activeTech.name === node.name ? "hex-dash-flow 1.5s linear infinite" : "none"
                }}
              />
            </g>
          ))}
        </svg>

        {/* Hex nodes */}
        {hexPositions.map((pos, i) => {
          const tech = TECHNOLOGIES.find(t => t.name === pos.name)!;
          const Icon = tech.icon;
          const isActive = activeTechIndex === i;
          
          return (
            <div
              key={pos.name}
              onMouseEnter={() => {
                audioSynth.playHover();
                setActiveTechIndex(i);
              }}
              className="absolute cursor-pointer transition-all duration-300 flex items-center justify-center animate-pulse-slow"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: "52px",
                height: "58px",
                zIndex: isActive ? 10 : 5,
              }}
            >
              <div
                className="w-full h-full absolute transition-all duration-300"
                style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  background: isActive 
                    ? `linear-gradient(135deg, ${tech.color}25, ${tech.color}08)` 
                    : (themeMode === "light" ? "var(--ink-0)" : "rgba(255, 255, 255, 0.02)"),
                  border: `1px solid ${isActive ? tech.color : (themeMode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)")}`,
                  boxShadow: isActive 
                    ? (themeMode === "light" ? `var(--nm-sunken-soft), 0 0 10px ${tech.color}33` : `0 0 10px ${tech.color}33`) 
                    : "var(--nm-raised-soft)",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                {isActive && (
                  <div 
                    className="absolute inset-0 filter blur-[4px] opacity-30 rounded-full" 
                    style={{ backgroundColor: tech.color }}
                  />
                )}
                <div 
                  className="absolute inset-px rounded-md flex flex-col items-center justify-center p-0.5"
                  style={{ 
                    clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    backgroundColor: themeMode === "light" ? "var(--ink-0)" : "rgba(10, 12, 22, 0.95)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 mb-0.5" style={{ color: tech.color }} />
                  <span className="text-[6.5px] font-mono font-semibold tracking-tight text-text-hi leading-none text-center truncate max-w-full px-0.5">
                    {tech.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Description overlay */}
      <div 
        className="w-full h-9 rounded-lg flex items-center justify-center px-2 py-1 select-none border transition-all duration-300"
        style={{
          backgroundColor: themeMode === "light" ? "var(--ink-0)" : "rgba(10, 12, 22, 0.4)",
          borderColor: themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)",
          boxShadow: "var(--nm-sunken-soft)",
        }}
      >
        <span className="text-[8.5px] font-mono text-center text-text-low leading-tight">
          <strong className="text-accent-2" style={{ color: activeTech.color }}>{activeTech.name}</strong>: {activeTech.desc}
        </span>
      </div>
    </div>
  );
}

function PipelineFlow() {
  const { themeMode } = useTheme();
  const [hoveredStage, setHoveredStage] = useState(1); // Default to Prototype

  const PIPELINE_STAGES = [
    { id: 0, label: "Discover", status: "100% DONE", detail: "Define scope & map architecture", color: "var(--accent-warm)" },
    { id: 1, label: "Prototype", status: "85% ACTIVE", detail: "Ship testable slices & code loops", color: "var(--accent-2)" },
    { id: 2, label: "Launch", status: "STAGING READY", detail: "Deploy to edge with logging", color: "var(--accent-1)" },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full select-none">
      <div className="flex justify-between items-center w-full relative pt-4 pb-2">
        {/* Horizontal Pipeline Background Line */}
        <div 
          className="absolute top-[34px] left-4 right-4 h-0.5 transition-all duration-300"
          style={{
            backgroundColor: themeMode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
          }}
        />
        
        {/* Animated Pipeline Active Line */}
        <div 
          className="absolute top-[34px] left-4 h-0.5 bg-gradient-to-r from-accent-warm via-accent-2 to-accent-1 transition-all duration-500"
          style={{ 
            width: hoveredStage === 0 ? "20%" : hoveredStage === 1 ? "50%" : "80%",
          }}
        />

        {PIPELINE_STAGES.map((stage) => (
          <div 
            key={stage.id} 
            className="flex flex-col items-center z-10 cursor-pointer"
            onMouseEnter={() => {
              audioSynth.playHover();
              setHoveredStage(stage.id);
            }}
          >
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300"
              style={{ 
                backgroundColor: themeMode === "light" ? "var(--ink-0)" : "rgba(10, 12, 22, 0.8)",
                borderColor: hoveredStage === stage.id ? stage.color : (themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.1)"),
                transform: hoveredStage === stage.id ? "scale(1.12)" : "scale(0.95)",
                boxShadow: hoveredStage === stage.id 
                  ? (themeMode === "light" ? `var(--nm-sunken-soft), 0 0 8px color-mix(in srgb, ${stage.color} 30%, transparent)` : `var(--nm-sunken-soft), 0 0 10px ${stage.color}44`)
                  : "var(--nm-raised-soft)",
              }}
            >
              <span className="text-[10px] font-mono" style={{ color: hoveredStage === stage.id ? stage.color : "var(--text-low)" }}>
                0{stage.id + 1}
              </span>
            </div>
            <span className={`text-[8.5px] font-mono mt-1.5 transition-colors duration-300 ${hoveredStage === stage.id ? "text-text-hi" : "text-text-low"}`}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      {/* Details Box */}
      <div
        className="flex-1 min-h-0 rounded-xl border p-2.5 flex flex-col justify-center select-none transition-all duration-300"
        style={{
          backgroundColor: themeMode === "light" ? "var(--ink-0)" : "rgba(10, 12, 22, 0.4)",
          borderColor: themeMode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)",
          boxShadow: "var(--nm-sunken-soft)",
        }}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[7.5px] font-mono uppercase tracking-wider text-text-faint">Stage status</span>
          <span className="text-[8px] font-mono font-semibold" style={{ color: PIPELINE_STAGES[hoveredStage].color }}>
            {PIPELINE_STAGES[hoveredStage].status}
          </span>
        </div>
        <p className="text-[9.5px] font-semibold text-text-hi leading-tight">
          {PIPELINE_STAGES[hoveredStage].label}
        </p>
        <p className="text-[8.5px] text-text-low leading-tight mt-0.5">
          {PIPELINE_STAGES[hoveredStage].detail}
        </p>
      </div>
    </div>
  );
}

function DiagnosticConsole() {
  const [logs, setLogs] = useState<string[]>([
    "SYS: boot core agents... OK",
    "NET: edge regions online [8/8]",
    "DB: cluster sync OK [3/3]",
    "SEC: identity vault unlocked",
    "AGENT: monitoring localhost...",
    "COMPILER: verified 18 modules",
    "SYS: thermal limits normal (42°C)",
    "READY: telemetry link operational"
  ]);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs internally
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Continuously stream background telemetry so the console stays alive
  useEffect(() => {
    const backgroundLogs = [
      "SYS: cleared cache buffers (0.01s)",
      "AGENT: context weight compressed 4.2x",
      "NET: edge SFO connection optimized",
      "COMPILER: verified 18 modules",
      "SYS: thermal limits normal (42°C)",
      "SEC: session tokens refreshed",
      "DB: cluster sync OK [3/3]",
      "EDGE: latency SFO:14ms SGP:48ms"
    ];

    const interval = setInterval(() => {
      const randomLog = backgroundLogs[Math.floor(Math.random() * backgroundLogs.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

      setLogs(prev => [...prev.slice(-13), `[${timeStr}] ${randomLog}`]);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full h-full select-none font-mono">
      {/* Terminal Display — fills the panel top to bottom */}
      <div
        ref={terminalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 min-h-0 rounded-xl border border-white/5 bg-black/60 p-2.5 overflow-y-auto text-[7.5px] leading-tight text-emerald-400 select-text scrollbar-thin scrollbar-thumb-white/10"
        style={{
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.8)",
          textShadow: "0 0 2px rgba(52, 211, 153, 0.4)",
        }}
      >
        <div className="text-text-faint text-[7px] mb-1 uppercase tracking-wider font-bold">
          [YANTRA CORE OS v4.1]
        </div>
        <div className="space-y-0.5">
          {logs.map((log, idx) => (
            <div key={idx} className="break-all whitespace-pre-wrap">
              {log}
            </div>
          ))}
          {/* Live prompt cursor */}
          <div className="flex items-center gap-1 text-emerald-400/90 pt-0.5">
            <span>{">"}</span>
            <span className="inline-block w-1 h-2.5 bg-emerald-400/80 animate-[pulse_1s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardCoreStatus({ syncTick = 0 }: { syncTick?: number }) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperInstance | null>(null);

  useEffect(() => {
    if (swiperRef) {
      swiperRef.slideNext(1500);
    }
  }, [syncTick, swiperRef]);

  const handleHireYantracore = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/contact");
  };

  return (
    <div className="flex flex-col justify-between h-full w-full relative">
      <ProductCardHeader
        logoImg="/images/logo/yantracore_logo.png"
        unicodeChar="⚡"
        title="YANTRACORE"
        description="Build Amazing Apps"
        accentColor="var(--accent-2)"
        showExternalLink={false}
      />

      <div className="flex-1 my-[22px] relative overflow-visible pointer-events-auto min-h-0">
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
          className="w-full h-full"
        >
          {/* Slide 1: Tech Hex Matrix */}
          <SwiperSlide className="w-full h-full flex items-center justify-center bg-transparent">
            <div className="w-full h-full rounded-xl border border-white/5 shadow-[var(--nm-sunken-soft)] p-1.5 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-center">
              <TechHexGrid />
            </div>
          </SwiperSlide>

          {/* Slide 2: Neural Telemetry Map */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center bg-transparent">
            <div className="w-full h-full rounded-xl border border-white/5 shadow-[var(--nm-sunken-soft)] p-1.5 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-center">
              <NeuralTelemetryMap />
            </div>
          </SwiperSlide>

          {/* Slide 3: Industrial Build Flow */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center bg-transparent">
            <div className="w-full h-full rounded-xl border border-white/5 shadow-[var(--nm-sunken-soft)] p-1.5 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-center">
              <PipelineFlow />
            </div>
          </SwiperSlide>

          {/* Slide 4: Interactive OS Console */}
          <SwiperSlide className="w-full h-full flex flex-col justify-center bg-transparent">
            <div className="w-full h-full rounded-xl border border-white/5 shadow-[var(--nm-sunken-soft)] p-1.5 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-center">
              <DiagnosticConsole />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full pointer-events-auto">
        <button
          onClick={handleHireYantracore}
          className="w-full py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-mono font-bold active:scale-95 transition-all text-ink-0 text-center cursor-pointer"
          style={{ backgroundColor: "var(--accent-2)", boxShadow: "0 0 12px rgba(0,224,203,0.3)" }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
