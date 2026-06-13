import Image from "next/image";
import { GlassCard } from "@/components/glass/GlassCard";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

const pillars = [
  {
    title: "Craft",
    body: "We treat every line of code and every pixel as a decision that reflects on the work. There is no \"good enough\" in a codebase we'll be proud of.",
    icon: "◆",
    accent: "var(--accent-1)",
    illustration: "/images/brand/illus-spa.svg",
  },
  {
    title: "Velocity",
    body: "Speed and quality are not opposites. We ship fast because we build right — clear architecture, no shortcuts that compound into debt.",
    icon: "▸",
    accent: "var(--accent-2)",
    illustration: "/images/brand/illus-api.svg",
  },
  {
    title: "Service",
    body: "Software should be in service of people — not the other way around. Shramdan is proof we mean it. Every product we build carries that ethic.",
    icon: "◇",
    accent: "var(--accent-warm)",
    illustration: "/images/brand/illus-uiux.svg",
  },
];

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Full-bleed atmospheric background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/brand/team-hero.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.25 }}
          aria-hidden
        />
        {/* Gradient overlay to blend naturally — transparent at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,7,13,0.55) 0%, rgba(6,7,13,0.10) 30%, rgba(6,7,13,0.10) 70%, rgba(6,7,13,0.55) 100%)",
          }}
          aria-hidden
        />
      </div>

      <Container width="default" className="relative z-10">
        {/* Eyebrow */}
        <Reveal>
          <Eyebrow>02 — Manifesto</Eyebrow>
        </Reveal>

        {/* Main manifesto block — now split layout with image */}
        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-center max-w-5xl">
            <AnimatedBorder variant="trace" radius={24}>
              <div className="glass-medium rounded-3xl p-8 md:p-12">
                <blockquote>
                  {/* Pull quote — short, punchy, readable */}
                  <p
                    className="font-semibold text-text-hi leading-snug tracking-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                    }}
                  >
                    &ldquo;Software is a mechanism — not a deliverable.
                    The best code creates a foundation others can build on,
                    long after the project closes.&rdquo;
                  </p>

                  {/* Supporting copy */}
                  <p className="mt-5 text-base text-text-mid leading-relaxed">
                    That conviction connects everything we build — Restroverse,
                    Jimbo, client work, Shramdan. The work is different.
                    The ethic is the same: build things that deserve to exist,
                    built right, for people.
                  </p>
                </blockquote>
              </div>
            </AnimatedBorder>

            {/* Decorative illustration — right side of the quote */}
            <div className="hidden lg:block relative">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(110,86,255,0.2) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
                aria-hidden
              />
              <Image
                src="/images/brand/illus-ai-bot.svg"
                alt="AI Bot Illustration"
                width={400}
                height={360}
                className="w-full h-auto relative z-10"
                style={{ filter: "brightness(1.1) saturate(0.9)" }}
              />
            </div>
          </div>
        </Reveal>

        {/* Three pillars — now with illustrations as card backgrounds */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={200 + i * 100}>
              <GlassCard variant="light" className="h-full group overflow-hidden relative">
                {/* Subtle illustration in background of card */}
                <div
                  className="absolute -right-8 -bottom-8 w-40 h-40 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-500 pointer-events-none"
                  aria-hidden
                >
                  <Image
                    src={pillar.illustration}
                    alt=""
                    fill
                    className="object-contain object-right-bottom"
                    aria-hidden
                  />
                </div>

                <div className="flex flex-col gap-4 h-full relative z-10">
                  <span
                    className="text-3xl font-mono"
                    style={{ color: pillar.accent }}
                    aria-hidden
                  >
                    {pillar.icon}
                  </span>
                  <h3 className="text-xl font-semibold text-text-hi">
                    {pillar.title}
                  </h3>
                  <p className="text-text-mid leading-relaxed text-sm flex-1">
                    {pillar.body}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}



