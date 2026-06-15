"use client";

import { cn } from "@/lib/utils/cn";
import { Tag } from "@/components/ui/Tag";
import type { ClientProject } from "@/lib/content/client-work";

interface ProjectCardProps {
  project: ClientProject;
  /** Accent CSS color used for the hover line, glow, and "View details" link. */
  accent?: string;
  /** Click handler — typically opens the project detail modal. */
  onClick?: () => void;
  className?: string;
}

/**
 * ProjectCard — the glass tile used in the Client Work grid.
 *
 * Presentational: the parent owns the project data and the accent color
 * (so a grid can cycle accents) and handles the click. Tag chips come from
 * the shared <Tag> primitive.
 */
export function ProjectCard({
  project,
  accent = "var(--accent-1)",
  onClick,
  className,
}: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 rounded-3xl group",
        className
      )}
      aria-label={`View details for ${project.name}`}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 24,
          padding: 24,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
          transition:
            "border-color 0.45s ease, box-shadow 0.45s ease, transform 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
        className="group-hover:[border-color:color-mix(in_srgb,var(--accent-1)_35%,rgba(255,255,255,0.08))] group-hover:-translate-y-1"
      >
        {/* Top accent gradient line */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            opacity: 0,
            transition: "opacity 0.45s ease",
          }}
          className="group-hover:!opacity-100"
        />
        {/* Hover glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background: `radial-gradient(ellipse at 30% 0%, color-mix(in srgb, ${accent} 10%, transparent), transparent 60%)`,
            opacity: 0,
            transition: "opacity 0.45s ease",
            pointerEvents: "none",
          }}
          className="group-hover:!opacity-100"
        />
        <div className="flex flex-col gap-3 h-full relative z-10">
          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag} size="xs">
                {tag}
              </Tag>
            ))}
          </div>
          <h3
            className="text-lg font-semibold text-text-hi transition-colors duration-300"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h3>
          <p className="text-sm text-text-low leading-relaxed flex-1">
            {project.description}
          </p>
          <p
            className="text-xs font-mono uppercase tracking-widest mt-2 transition-colors duration-300"
            style={{ color: accent }}
          >
            View details →
          </p>
        </div>
      </div>
    </button>
  );
}
