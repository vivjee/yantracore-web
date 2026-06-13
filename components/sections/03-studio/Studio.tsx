import Link from "next/link";
import { ArrowRight, Bot, MapPin, Sparkles, Star, Heart, Users } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

/* ── Product data ────────────────────────────────────────────── */

const products = [
  {
    id: "restroverse",
    eyebrow: "Studio Product — Hospitality AI",
    badge: "Coming Soon",
    badgeAccent: "var(--accent-2)",
    title: "RESTROVERSE",
    tagline: "Showcase your hospitality business on the experiences on Restroverse.",
    description:
      "Restroverse reimagines how people find, book, and experience restaurants and hotels. AI-powered discovery surfaces the perfect match from natural language queries. Rich, detailed profiles replace the sparse listings you're used to. And it's deeply integrated with Jimbo — so the conversation that starts on Instagram ends with a confirmed reservation.",
    bullets: [
      "AI-powered discovery from natural queries",
      "Rich, media-rich venue profiles",
      "Native sync with Jimbo across channels",
    ],
    cta: { label: "Discover Your Experiences", href: "https://restroverse.app" },
    notifyCta: "Get notified at launch",
    accent: "var(--accent-2)",
    // Decorative gradient for the visual panel
    gradient:
      "radial-gradient(ellipse at 30% 40%, rgba(0,224,203,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(110,86,255,0.25) 0%, transparent 60%)",
    visual: <RestrovisualMock />,
  },
  {
    id: "jimbo",
    eyebrow: "Studio Product — AI Agent",
    badge: "Pre-launch",
    badgeAccent: "var(--accent-1)",
    title: "JIMBO",
    tagline: "The AI agent that lives where your customers do.",
    description:
      "WhatsApp. Instagram. Facebook. SMS. Your customers are already there — Jimbo meets them on every channel with a single, coherent AI agent that handles bookings, support, lead capture, and more. Restroverse-aware by default: it knows your inventory, your rates, and your brand voice.",
    bullets: [
      "Multi-channel: WhatsApp, Instagram, Facebook, SMS",
      "Restroverse-aware — knows your inventory",
      "Always-on, never drops context",
    ],
    cta: { label: "Hire Jimbo", href: "https://jimbo.yantracore.com/" },
    notifyCta: "Get early access",
    accent: "var(--accent-1)",
    gradient:
      "radial-gradient(ellipse at 70% 30%, rgba(110,86,255,0.4) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,224,203,0.2) 0%, transparent 60%)",
    visual: <JimboVisualMock />,
  },
  {
    id: "shramdan",
    eyebrow: "Community — Nonprofit",
    badge: "Community Led",
    badgeAccent: "var(--accent-warm)",
    title: "SHRAMDAN",
    tagline: "By the community. For the community.",
    description:
      "YantraCore envisioned and launched Shramdan — a nonprofit built on the belief that software should be in service of people, not just profit. We seeded it, got it running, and the community has been gradually taking ownership. Eventually, it will be fully community-owned and collaboratively run.",
    bullets: [
      "Community-seeded and community-grown",
      "Real impact: cleanups, events, drives",
      "Gradually moving to full community ownership",
    ],
    cta: { label: "Join Shramdan", href: "https://shramdan.org" },
    notifyCta: null,
    accent: "var(--accent-warm)",
    gradient:
      "radial-gradient(ellipse at 50% 30%, rgba(255,180,84,0.30) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,79,176,0.15) 0%, transparent 60%)",
    visual: <ShramdanVisualMock />,
  },
] as const;

export function Studio() {
  return (
    <section id="studio" className="relative overflow-hidden">
      {/* Section header */}
      <div className="py-24 md:py-32">
        <Container width="default">
          <Reveal>
            <Eyebrow>03 — In the Studio</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
              }}
            >
              Things we built
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                }}
              >
                for ourselves.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-text-mid max-w-2xl leading-relaxed">
              Most agencies only build for clients. We build products too — and
              that changes how we think about everything else we ship.
            </p>
          </Reveal>
        </Container>
      </div>

      {/* Product showcases */}
      {products.map((product, i) => (
        <ProductShowcase key={product.id} product={product} flip={i % 2 === 1} />
      ))}
    </section>
  );
}

/* ── Individual product showcase ─────────────────────────────── */

function ProductShowcase({
  product,
  flip,
}: {
  product: (typeof products)[number];
  flip: boolean;
}) {
  return (
    <div className="relative py-24 md:py-36 overflow-hidden border-t border-white/[0.06]">
      {/* Gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: product.gradient, opacity: 0.5 }}
      />

      <Container width="default" className="relative z-10">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            flip ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Text column */}
          <div className={flip ? "lg:col-start-2" : ""}>
            <Reveal>
              <Eyebrow>{product.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-3 flex items-center gap-3">
                <h2
                  className="font-semibold text-text-hi tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                  }}
                >
                  {product.title}
                </h2>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    color: product.accent,
                    borderColor: `color-mix(in srgb, ${product.accent} 40%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${product.accent} 12%, transparent)`,
                  }}
                >
                  {product.badge}
                </span>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p
                className="mt-2 text-xl font-medium"
                style={{ color: product.accent }}
              >
                {product.tagline}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 text-text-mid leading-relaxed">
                {product.description}
              </p>
            </Reveal>
            <Reveal delay={290}>
              <ul className="mt-6 space-y-2">
                {product.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-text-mid">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: product.accent }}
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-8 flex flex-wrap gap-3">
                <GlassButton variant="secondary">
                  {product.cta.href.startsWith("http") ? (
                    <a
                      href={product.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      {product.cta.label}
                      <ArrowRight size={14} aria-hidden />
                    </a>
                  ) : (
                    <Link href={product.cta.href} className="flex items-center gap-2">
                      {product.cta.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                </GlassButton>
                {product.notifyCta && (
                  <GlassButton variant="primary">{product.notifyCta}</GlassButton>
                )}
              </div>
            </Reveal>
          </div>

          {/* Visual column */}
          <Reveal delay={100} className={flip ? "lg:col-start-1 lg:row-start-1" : ""}>
            <div className="glass-medium rounded-3xl p-6 md:p-8 aspect-[4/3] flex items-center justify-center overflow-hidden">
              {product.visual}
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}

/* ── Visual mocks ─────────────────────────────────────────────── */

function RestrovisualMock() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.05] border border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-accent-2 shrink-0" />
        <span className="text-xs text-text-hi font-mono">&ldquo;traditional garden ryokan in Kyoto&rdquo;</span>
      </div>
      {[
        { name: "Hoshinoya Ryokan", rating: "4.9", price: "$480", match: "99%" },
        { name: "Yuzuya Ryokan", rating: "4.8", price: "$350", match: "96%" },
        { name: "Ryokan Kurama", rating: "4.7", price: "$260", match: "93%" },
      ].map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-2/20 shrink-0 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-accent-2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-hi truncate">{item.name}</p>
            <div className="flex items-center gap-2">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-text-low">{item.rating} · from {item.price}/night</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent-2/15 shrink-0">
            <Sparkles className="w-2 h-2 text-accent-2" />
            <span className="text-[9px] font-mono text-accent-2">{item.match}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function JimboVisualMock() {
  const messages = [
    { from: "user", text: "Can I book a table for 4 at 7pm?" },
    { from: "bot", text: "Of course! Checking availability at Hotel Aurora for tonight…" },
    { from: "bot", text: "✓ Table confirmed for 4 at 7:00 PM. You'll receive a WhatsApp confirmation shortly." },
    { from: "user", text: "Perfect, thank you!" },
  ];
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-accent-1/25 border border-accent-1/40 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-accent-1" />
        </div>
        <div>
          <p className="text-xs font-medium text-text-hi">Jimbo</p>
          <p className="text-[9px] text-emerald-400 font-mono">online · WhatsApp</p>
        </div>
      </div>
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[82%] text-[11px] px-3 py-2 rounded-xl leading-snug text-white"
              style={{
                background:
                  m.from === "user"
                    ? "rgba(110,86,255,0.5)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1 flex-wrap">
        {["WhatsApp", "Instagram", "Facebook", "SMS"].map((ch) => (
          <span
            key={ch}
            className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-text-low"
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

function ShramdanVisualMock() {
  const events = [
    { title: "Lakeside Cleanup", people: 48, location: "Pokhara" },
    { title: "Tree Planting Drive", people: 31, location: "Chitwan" },
    { title: "Food Distribution", people: 22, location: "Kathmandu" },
  ];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-accent-warm fill-accent-warm/40" />
        <span className="text-sm font-semibold text-text-hi">Recent community work</span>
      </div>
      {events.map((e) => (
        <div key={e.title} className="flex items-center gap-3 p-3 rounded-xl bg-accent-warm/[0.06] border border-accent-warm/15">
          <div className="w-8 h-8 rounded-lg bg-accent-warm/20 flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 text-accent-warm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-hi">{e.title}</p>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-accent-warm" />
              <span className="text-[10px] text-text-low">{e.people} volunteers · {e.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
