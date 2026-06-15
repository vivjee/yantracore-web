"use client";

import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";
import { audioSynth } from "@/lib/audio";

export interface OrbitNodeProps {
  /** Display name, e.g. "Jimbo" or "Technologies". */
  name: string;
  /** One short line under the name. Keep it quiet. */
  tagline: string;
  /** Accent CSS value, e.g. "var(--accent-1)". Drives the hover glow + emblem tint. */
  accent: string;
  /** Destination. Omit (with `soon`) for a not-yet-built destination. */
  href?: string;
  /** Opens in a new tab via a real anchor. */
  external?: boolean;
  /** Renders a calm, non-navigating "Soon" node for roadmap destinations. */
  soon?: boolean;
  /** Product/initiative logo image (takes precedence over Icon). */
  logoImg?: string;
  /** Icon for wayfinding nodes (lucide or NavIcons — anything taking className). */
  Icon?: ComponentType<{ className?: string }>;
  className?: string;
}

/**
 * OrbitNode — a single calm satellite in the Home constellation.
 *
 * Deliberately quiet: a neumorphic glass surface that lifts and blooms its
 * accent glow on hover, with NO live simulation (the running mini-apps live on
 * the Projects page). Renders a real <Link>/<a> so every destination is a
 * crawlable anchor in the server-rendered markup.
 */
export function OrbitNode({
  name,
  tagline,
  accent,
  href,
  external,
  soon,
  logoImg,
  Icon,
  className,
}: OrbitNodeProps) {
  const content = (
    <>
      <span className="orbital-node__glow" aria-hidden />
      <span className="orbital-node__emblem">
        <span className="orbital-node__emblem-glow" aria-hidden />
        {logoImg ? (
          <Image src={logoImg} alt="" width={26} height={26} className="relative z-10 object-contain" />
        ) : Icon ? (
          <Icon className="relative z-10 h-[18px] w-[18px]" />
        ) : null}
      </span>
      <span className="orbital-node__body">
        <span className="orbital-node__name">
          {name}
          {soon && <span className="orbital-node__soon">Soon</span>}
          {external && <ArrowUpRight className="orbital-node__ext" aria-hidden />}
        </span>
        <span className="orbital-node__tag">{tagline}</span>
      </span>
    </>
  );

  const cls = `orbital-node glass-medium${soon ? " orbital-node--soon" : ""}${className ? ` ${className}` : ""}`;
  const style = { "--node-accent": accent } as React.CSSProperties;
  const handleEnter = () => audioSynth.playHover();
  const handleClick = () => audioSynth.playClick();

  if (soon || !href) {
    return (
      <div className={cls} style={style} aria-disabled={soon || undefined}>
        {content}
      </div>
    );
  }

  if (external) {
    return (
      <a
        className={cls}
        style={style}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleEnter}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={cls} style={style} href={href} onMouseEnter={handleEnter} onClick={handleClick}>
      {content}
    </Link>
  );
}
