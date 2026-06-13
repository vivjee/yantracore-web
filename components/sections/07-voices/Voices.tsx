import { GlassCard } from "@/components/glass/GlassCard";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Star } from "lucide-react";

/* ── Data ────────────────────────────────────────────────────── */

const stats = [
  { to: 50,  suffix: "+",  label: "Projects Delivered",  accent: "var(--accent-1)" },
  { to: 12,  suffix: "+",  label: "Countries Served",     accent: "var(--accent-2)" },
  { to: 4.9, suffix: "★",  label: "Average Rating",       accent: "var(--accent-warm)", decimals: 1 },
  { to: 100, suffix: "%",  label: "On-Time Rate",         accent: "var(--accent-3)" },
] as const;

type Accent = "accent-1" | "accent-2" | "accent-warm" | "accent-3";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  accent: Accent;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "travelnest",
    quote:
      "YantraCore didn't just build our platform — they understood our hospitality business deeply and made architectural decisions that saved us months of rework. The team felt like an extension of our own.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TravelNest",
    industry: "Travel & Hospitality",
    accent: "accent-2",
    featured: true,
  },
  {
    id: "foodfleet",
    quote:
      "The AI integration work was exceptional. Jimbo is now handling 60% of our customer inquiries autonomously, and our NPS went up 22 points in three months.",
    author: "Marcus Reid",
    role: "Head of Operations",
    company: "FoodFleet",
    industry: "F&B Tech",
    accent: "accent-1",
  },
  {
    id: "qlik",
    quote:
      "Clean code, on-time delivery, and a team that actually communicates. That combination is rarer than it should be.",
    author: "Ayesha Qureshi",
    role: "Product Lead",
    company: "Qlik Ventures",
    industry: "SaaS",
    accent: "accent-warm",
  },
  {
    id: "storefront",
    quote:
      "We had a complex e-commerce architecture problem they solved in two weeks — a problem two other agencies had been working on for six months.",
    author: "Tom Blanchard",
    role: "Engineering Director",
    company: "StoreFront Plus",
    industry: "E-commerce",
    accent: "accent-1",
  },
  {
    id: "shramdan",
    quote:
      "Shramdan changed how I think about software companies. You can tell YantraCore builds things because they care, not just because they can.",
    author: "Sita Thapa",
    role: "Community Coordinator",
    company: "Shramdan",
    industry: "Nonprofit",
    accent: "accent-warm",
  },
  {
    id: "novu",
    quote:
      "Our mobile app launch was flawless. No bugs on day one, performance was top-percentile, and they handed over complete documentation. We felt genuinely supported.",
    author: "Jin Park",
    role: "CEO",
    company: "Novu Health",
    industry: "HealthTech",
    accent: "accent-2",
  },
];

const accentMap: Record<Accent, string> = {
  "accent-1": "var(--accent-1)",
  "accent-2": "var(--accent-2)",
  "accent-warm": "var(--accent-warm)",
  "accent-3": "var(--accent-3)",
};

/* ── Section ─────────────────────────────────────────────────── */

export function Voices() {
  const featured = testimonials.find((t) => t.featured)!;
  const rest = testimonials.filter((t) => !t.featured);

  return (
    <section id="voices" className="relative py-32 md:py-48 overflow-hidden">
      {/* Amber accent radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, rgba(255, 180, 84, 0.10) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(110, 86, 255, 0.08) 0%, transparent 50%)",
        }}
      />

      <Container width="default" className="relative z-10">
        {/* Section header */}
        <Reveal>
          <Eyebrow>07 — Voices</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            What clients say.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-4 text-lg text-text-mid max-w-xl leading-relaxed">
            We let the work speak. Here&apos;s what the people who commissioned
            it have to say.
          </p>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={240}>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="glass-light rounded-2xl p-5 text-center relative overflow-hidden group"
              >
                {/* Rotating conic top-edge shimmer */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
                    opacity: 0.7,
                  }}
                />
                {/* Pulse ring decoration */}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 80, height: 80,
                      border: `1px solid ${stat.accent}`,
                      opacity: 0,
                      animation: `logo-pulse-ring 3s ease-out ${i * 0.6}s infinite`,
                    }}
                  />
                </div>
                <p
                  className="font-semibold leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    color: stat.accent,
                  }}
                >
                  <CountUp
                    to={stat.to}
                    suffix={stat.suffix}
                    decimals={(stat as { decimals?: number }).decimals ?? 0}
                    duration={2200}
                  />
                </p>
                <p className="mt-2 text-xs text-text-low font-mono uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Featured testimonial — full width with animated border */}
        <Reveal delay={300} className="mt-14">
          <AnimatedBorder variant="sweep" radius={24} duration={7000}>
            <div className="glass-heavy rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:gap-12">
                {/* Large quote */}
                <div className="flex-1">
                  <span
                    className="text-7xl font-serif leading-none select-none block mb-4"
                    style={{
                      color: accentMap[featured.accent],
                      opacity: 0.6,
                      lineHeight: 0.8,
                    }}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <blockquote>
                    <p
                      className="text-text-hi leading-relaxed"
                      style={{
                        fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                        fontStyle: "italic",
                      }}
                    >
                      {featured.quote}
                    </p>
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${accentMap[featured.accent]} 20%, transparent)`,
                        border: `1.5px solid color-mix(in srgb, ${accentMap[featured.accent]} 40%, transparent)`,
                        color: accentMap[featured.accent],
                      }}
                    >
                      {featured.author
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-hi text-sm">
                        {featured.author}
                      </p>
                      <p className="text-xs text-text-low">
                        {featured.role} · {featured.company}
                      </p>
                    </div>
                    <div className="ml-auto hidden md:flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-amber-400 text-amber-400"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Industry badge column */}
                <div className="hidden md:flex flex-col items-center justify-center gap-4 md:w-40 shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold"
                    style={{
                      background: `color-mix(in srgb, ${accentMap[featured.accent]} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${accentMap[featured.accent]} 30%, transparent)`,
                      color: accentMap[featured.accent],
                    }}
                  >
                    {featured.company[0]}
                  </div>
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest text-center px-3 py-1.5 rounded-full"
                    style={{
                      color: accentMap[featured.accent],
                      background: `color-mix(in srgb, ${accentMap[featured.accent]} 10%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${accentMap[featured.accent]} 25%, transparent)`,
                    }}
                  >
                    {featured.industry}
                  </span>
                  <div className="flex flex-col gap-0.5 items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="fill-amber-400 text-amber-400 md:hidden"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedBorder>
        </Reveal>

        {/* Rest of testimonials */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((t, i) => {
            const accent = accentMap[t.accent];
            return (
              <Reveal key={t.id} delay={360 + i * 80}>
                <div
                  className="h-full group rounded-3xl relative"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid color-mix(in srgb, ${accent} 22%, rgba(255,255,255,0.06))`,
                    boxShadow: `0 0 0 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`,
                    transition: "box-shadow 0.45s ease, border-color 0.45s ease",
                    padding: 24,
                  }}
                >
                  {/* Glowing left accent bar */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0, top: "12%", bottom: "12%",
                      width: 2.5,
                      borderRadius: "0 2px 2px 0",
                      background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent} 40%, transparent))`,
                    }}
                  />
                  {/* Shimmer sweep on hover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 30% 30%, color-mix(in srgb, ${accent} 10%, transparent), transparent 70%)`,
                    }}
                  />
                  <div className="flex flex-col gap-5 h-full">
                    <span
                      className="text-5xl font-serif leading-none select-none"
                      style={{ color: accent, opacity: 0.45 }}
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    <blockquote className="flex-1">
                      <p className="text-text-hi leading-relaxed text-sm">{t.quote}</p>
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `color-mix(in srgb, ${accent} 20%, transparent)`,
                          border: `1.5px solid color-mix(in srgb, ${accent} 40%, transparent)`,
                          color: accent,
                        }}
                      >
                        {t.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-hi truncate">{t.author}</p>
                        <p className="text-xs text-text-low">{t.role} · {t.company}</p>
                      </div>
                      <span
                        className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 hidden md:inline-block"
                        style={{
                          color: accent,
                          background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
                        }}
                      >
                        {t.industry}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
