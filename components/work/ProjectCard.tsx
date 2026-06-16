"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Tag } from "@/components/ui/Tag";
import type { ClientProject } from "@/lib/content/client-work";

interface ProjectCardProps {
  project: ClientProject;
  /** Accent CSS color used for the hover line, glow, logo halo, and footer link. */
  accent?: string;
  /** Click handler — typically opens the project detail modal. */
  onClick?: () => void;
  className?: string;
}

/**
 * ProjectCard — the glass tile used in the client constellation grid.
 *
 * Presentational: the parent owns the project data and the accent color
 * (so a grid can cycle accents) and handles the click. It carries the client
 * logo mark, tech tags, and — when the project has a live site — a top-right
 * link straight to it (which stops propagation so it doesn't also open the
 * details modal). The whole tile is a focusable button-like surface; the live
 * link nests as a real anchor, so the root is a div with button semantics
 * rather than a <button> (anchors can't live inside buttons).
 */
export function ProjectCard({
  project,
  accent = "var(--accent-1)",
  onClick,
  className,
}: ProjectCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`View details for ${project.name}`}
      className={cn(
        "text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 rounded-3xl group",
        className
      )}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 24,
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
        className="p-5 sm:p-6 group-hover:[border-color:color-mix(in_srgb,var(--accent-1)_35%,rgba(255,255,255,0.08))] group-hover:-translate-y-1"
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
          {/* Header — logo mark, name, and (when live) a direct link out */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-white/20"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-25 blur-[5px] transition-opacity duration-300 group-hover:opacity-35"
                  style={{ background: accent }}
                />
                <Image
                  src={project.logo}
                  alt={`${project.name} logo`}
                  width={28}
                  height={28}
                  unoptimized
                  className="relative z-10 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3
                className="truncate text-lg font-semibold text-text-hi"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.name}
              </h3>
            </div>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-text-low shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-white/[0.06] hover:text-text-hi"
                title="Open live site"
                aria-label={`Open the ${project.name} live site in a new tab`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag} size="xs">
                {tag}
              </Tag>
            ))}
          </div>

          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-text-low">
            {project.description}
          </p>
          <p
            className="mt-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300"
            style={{ color: accent }}
          >
            View details →
          </p>
        </div>
      </div>
    </div>
  );
}
