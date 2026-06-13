import { GlassButton } from "@/components/glass/GlassButton";
import { Container } from "@/components/layout/Container";

/**
 * 01 — Arrival
 *
 * Clean, cinematic hero — sits above the global SiteBackground canvas.
 * The logo and orbital product cards live in the next section (Showcase).
 */
export function Arrival() {
  return (
    <section
      id="arrival"
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
    >

      {/* Layer 10: hero content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* top spacer — pushes content to vertical center-ish */}
        <div className="flex-1" />

        <Container width="default" className="pb-20 md:pb-28">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2.5 mb-8"
            style={{ animation: "hero-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent-2)", boxShadow: "0 0 8px var(--accent-2)" }}
            />
            <span
              className="text-[11px] font-mono uppercase tracking-[0.22em]"
              style={{ color: "var(--text-low)" }}
            >
              01 — Arrival · YantraCore
            </span>
          </div>

          {/* Main headline — staggered word reveal */}
          <h1
            className="font-semibold tracking-tight leading-[0.92] text-text-hi"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 9.5vw, 8.5rem)",
            }}
          >
            {[
              { text: "The mechanisms", delay: "0.15s" },
              { text: "that move", delay: "0.3s" },
              { text: "modern business.", delay: "0.45s" },
            ].map(({ text, delay }) => (
              <span
                key={text}
                className="block overflow-hidden"
              >
                <span
                  className="block"
                  style={{
                    animation: `hero-line-up 0.9s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
                  }}
                >
                  {text}
                </span>
              </span>
            ))}
          </h1>

          {/* Sub-headline */}
          <p
            className="mt-7 text-lg md:text-xl leading-relaxed max-w-xl"
            style={{
              color: "var(--text-mid)",
              animation: "hero-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s both",
            }}
          >
            YantraCore engineers software, AI, and infrastructure for ambitious
            companies — and for the communities we belong to.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-wrap gap-4"
            style={{
              animation: "hero-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.8s both",
            }}
          >
            <GlassButton variant="primary">Begin the Tour</GlassButton>
            <GlassButton variant="secondary">Start a Project</GlassButton>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            animation: "hero-fade-up 1s cubic-bezier(0.22,1,0.36,1) 1.2s both",
          }}
        >
          <span
            className="text-[9px] font-mono uppercase tracking-[0.2em]"
            style={{ color: "var(--text-faint)" }}
          >
            Scroll
          </span>
          <div
            className="w-px h-12 origin-top"
            style={{
              background:
                "linear-gradient(180deg, var(--accent-1) 0%, transparent 100%)",
              animation: "scroll-line-pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}

