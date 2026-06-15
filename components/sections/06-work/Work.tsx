"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { MarqueeRow } from "@/components/motion/MarqueeRow";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Tag } from "@/components/ui/Tag";
import { clientProjects, techLogos, type ClientProject } from "@/lib/content/client-work";

const ACCENT_CYCLE = [
  "var(--accent-1)",
  "var(--accent-2)",
  "var(--accent-warm)",
  "var(--accent-3)",
  "var(--accent-1)",
  "var(--accent-2)",
];

export function Work() {
  const [selected, setSelected] = useState<ClientProject | null>(null);

  return (
    <section id="work" className="relative py-32 md:py-48 overflow-hidden">
      <Container width="default" className="relative z-10">
        <Reveal>
          <Eyebrow>06 — Client Work</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h2
            className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            Built for others.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--accent-2), var(--accent-1))",
              }}
            >
              Made to last.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 text-lg text-text-mid max-w-2xl leading-relaxed">
            A selection of projects across industries. Click any to see what we
            built and how.
          </p>
        </Reveal>
      </Container>

      {/* Project cards grid */}
      <Container width="default" className="relative z-10 mt-16">
        <Reveal delay={240}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clientProjects.map((project, pi) => (
              <ProjectCard
                key={project.id}
                project={project}
                accent={ACCENT_CYCLE[pi % ACCENT_CYCLE.length]}
                onClick={() => setSelected(project)}
              />
            ))}
          </div>
        </Reveal>
      </Container>

      {/* Tech logos marquee */}
      <Reveal delay={320} className="mt-20">
        <p className="text-center text-xs text-text-faint font-mono uppercase tracking-widest mb-8">
          Technologies we work with
        </p>
        <MarqueeRow gap={64} speed={0.6}>
          {techLogos.map((logo) => (
            <div
              key={logo.id}
              className="flex items-center justify-center px-4 py-2 rounded-xl border border-white/[0.07] bg-white/[0.02] min-w-[100px]"
            >
              <span className="text-sm font-medium text-text-low">
                {logo.label}
              </span>
            </div>
          ))}
        </MarqueeRow>
      </Reveal>

      {/* CTA */}
      <Container width="default" className="mt-12 text-center relative z-10">
        <Reveal delay={380}>
          <a
            href="#signal"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-mid transition-colors duration-300 hover:text-accent-1 font-mono"
          >
            Have a project? Send a signal →
          </a>
        </Reveal>
      </Container>

      {/* Modal */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: ClientProject;
  onClose: () => void;
}) {
  const accentColors: Record<string, string> = {
    "Web App": "var(--accent-1)",
    "AI": "var(--accent-2)",
    "E-commerce": "var(--accent-warm)",
    "Mobile": "var(--accent-3)",
  };
  const accent = accentColors[project.tags[0]] ?? "var(--accent-1)";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "cap-panel-in 0.45s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: "rgba(6,7,13,0.85)" }}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg"
        style={{ animation: "cap-panel-in 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}
      >
        <div
          style={{
            borderRadius: 28,
            padding: 36,
            background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            border: `1px solid color-mix(in srgb, ${accent} 30%, rgba(255,255,255,0.08))`,
            boxShadow: `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px color-mix(in srgb, ${accent} 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div
            aria-hidden
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: 0.8,
            }}
          />
          {/* Ambient glow */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `radial-gradient(ellipse at 80% 0%, color-mix(in srgb, ${accent} 12%, transparent), transparent 55%)`,
            }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-text-low hover:text-text-hi transition-colors duration-200"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            aria-label="Close"
          >
            <X size={14} />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map((tag) => (
                <Tag key={tag} tone="accent" accentColor={accent} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>

            <h3
              className="text-2xl font-semibold text-text-hi mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name}
            </h3>
            <p className="text-text-mid leading-relaxed">{project.description}</p>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                style={{ color: accent }}
              >
                View live
                <ExternalLink size={13} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
