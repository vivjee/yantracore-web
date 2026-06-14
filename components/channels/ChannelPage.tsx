"use client";

import Image from "next/image";
import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  ExternalLink,
  Pause,
  Play,
  RadioTower,
  RefreshCw,
  Search,
  Terminal,
  X,
} from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { StaggerContainer, StaggerItem } from "@/components/motion/AnimationWrappers";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { getChannel, liveSignalIcons, type ChannelSlug } from "@/lib/content/channels";

interface ChannelPageProps {
  slug: ChannelSlug;
}

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function ChannelPage({ slug }: ChannelPageProps) {
  const router = useRouter();
  const channel = getChannel(slug);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(true);
  const [query, setQuery] = useState("");
  const [pulse, setPulse] = useState(0);
  const [logs, setLogs] = useState<string[]>(() =>
    (channel?.logSeeds ?? []).slice(0, 4).map((log) => `[${formatTime()}] ${log}`)
  );

  const filteredItems = useMemo(() => {
    if (!channel) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return channel.searchItems;
    return channel.searchItems.filter((item) =>
      [item.title, item.category, item.detail].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [channel, query]);

  useEffect(() => {
    if (!channel || !isLive) return;

    const interval = window.setInterval(() => {
      const seed = channel.logSeeds[Math.floor(Math.random() * channel.logSeeds.length)];
      setPulse((value) => value + 1);
      setLogs((current) => [...current.slice(-8), `[${formatTime()}] ${seed}`]);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [channel, isLive]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!channel) return null;

  const handlePrimaryAction = () => {
    if (channel.primaryExternal) {
      window.open(channel.primaryHref, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(channel.primaryHref);
  };

  return (
    <StaggerContainer
      delay={120}
      staggerDelay={0.07}
      className="relative z-10 flex h-full w-full flex-col overflow-y-auto p-4 font-body text-text-hi no-scrollbar md:p-6"
    >
      <StaggerItem className="mb-5 flex flex-col gap-4 border-b border-white/[0.06] pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40">
            <div
              className="absolute inset-0 opacity-20 blur-xl"
              style={{ background: channel.accent }}
              aria-hidden
            />
            <Image
              src={channel.logo}
              alt={`${channel.name} logo`}
              width={44}
              height={44}
              className="relative z-10 h-11 w-11 object-contain"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow tone="low">
                {channel.channelCode} - TV Channel
              </Eyebrow>
              <span className="inline-flex items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                {channel.status}
              </span>
            </div>
            <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {channel.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-low">
              {channel.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <button
            onClick={() => setIsLive((value) => !value)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-text-mid transition hover:border-white/20 hover:text-text-hi"
          >
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isLive ? "PAUSE" : "RESUME"}
          </button>
          <button
            onClick={() => {
              setPulse((value) => value + 1);
              setLogs((current) => [
                ...current.slice(-8),
                `[${formatTime()}] MANUAL: channel telemetry sync requested`,
              ]);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-text-mid transition hover:border-white/20 hover:text-text-hi"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            SYNC
          </button>
        </div>
      </StaggerItem>

      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-4">
          <StaggerItem className="glass-medium rounded-[18px] border border-white/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                <RadioTower className="h-3.5 w-3.5" style={{ color: channel.accent }} />
                Signal summary
              </span>
              <span className="font-mono text-[8px] text-text-faint">LIVE PREVIEW</span>
            </div>
            <p className="text-sm leading-relaxed text-text-mid">{channel.summary}</p>
            <div className="mt-4">
              <GlassButton
                variant="primary"
                onClick={handlePrimaryAction}
                className="w-full px-4 py-3 text-[11px] uppercase tracking-[0.18em]"
              >
                <span className="inline-flex items-center gap-2">
                  {channel.primaryCta}
                  {channel.primaryExternal ? (
                    <ExternalLink className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </span>
              </GlassButton>
            </div>
          </StaggerItem>

          <StaggerItem className="glass-medium flex min-h-[250px] flex-col rounded-[18px] border border-white/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                <Terminal className="h-3.5 w-3.5" style={{ color: channel.secondaryAccent }} />
                {channel.liveFeedLabel}
              </span>
              <span className="font-mono text-[8px] text-emerald-300">
                {isLive ? "STREAMING" : "PAUSED"}
              </span>
            </div>
            <div
              ref={terminalRef}
              className="min-h-[190px] flex-1 overflow-y-auto rounded-xl border border-white/5 bg-black/50 p-3 font-mono text-[9px] leading-relaxed text-emerald-300 no-scrollbar"
            >
              <div className="space-y-1.5">
                {logs.map((log, index) => (
                  <div key={`${log}-${index}`} className="break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-4">
          <StaggerItem className="grid grid-cols-2 gap-3">
            {channel.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-medium rounded-[18px] border border-white/[0.06] p-4"
              >
                <span className="block font-mono text-[9px] uppercase tracking-wider text-text-low">
                  {stat.label}
                </span>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-mono text-2xl font-semibold tracking-tight text-text-hi">
                    {stat.value}
                  </span>
                  <Activity
                    className={`mb-1 h-3.5 w-3.5 ${isLive ? "animate-pulse" : ""}`}
                    style={{ color: index % 2 === 0 ? channel.accent : channel.secondaryAccent }}
                  />
                </div>
                <span className="mt-1 block truncate font-mono text-[9px] text-text-faint">
                  {stat.trend}
                </span>
              </div>
            ))}
          </StaggerItem>

          <StaggerItem className="glass-medium flex flex-1 flex-col rounded-[18px] border border-white/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                <Search className="h-3.5 w-3.5" style={{ color: channel.accent }} />
                Quick search
              </span>
              <span className="font-mono text-[8px] text-text-faint">
                {filteredItems.length}/{channel.searchItems.length}
              </span>
            </div>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text-faint" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={channel.searchPlaceholder}
                className="h-9 w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-9 font-mono text-[10px] text-text-hi placeholder:text-text-faint focus:border-accent-2 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-2 rounded p-1 text-text-low transition hover:text-text-hi"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
              {filteredItems.map((item) => (
                <div
                  key={`${item.category}-${item.title}`}
                  className="rounded-xl border border-white/[0.05] bg-black/35 p-3 transition hover:border-white/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate text-sm font-semibold text-text-hi">{item.title}</h2>
                    <span
                      className="flex-shrink-0 rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider"
                      style={{
                        borderColor: `color-mix(in srgb, ${channel.accent} 40%, transparent)`,
                        color: channel.accent,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-low">{item.detail}</p>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-white/[0.05] bg-black/35 p-4 text-center font-mono text-[10px] text-text-low">
                  No channel items match this search.
                </div>
              )}
            </div>
          </StaggerItem>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-4">
          <StaggerItem className="glass-medium rounded-[18px] border border-white/[0.06] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-low">
                <Activity className="h-3.5 w-3.5" style={{ color: channel.secondaryAccent }} />
                Channel pulse
              </span>
              <span className="font-mono text-[8px] text-text-faint">TICK {pulse.toString().padStart(2, "0")}</span>
            </div>
            <div className="flex h-24 items-end gap-1 rounded-xl border border-white/5 bg-black/45 p-3">
              {Array.from({ length: 28 }).map((_, index) => {
                const height = 24 + ((index * 17 + pulse * 9) % 70);
                return (
                  <div
                    key={index}
                    className="flex-1 rounded-full opacity-80 transition-all duration-700"
                    style={{
                      height: `${height}%`,
                      background:
                        index % 2 === 0
                          ? `linear-gradient(180deg, ${channel.accent}, ${channel.secondaryAccent})`
                          : channel.secondaryAccent,
                    }}
                  />
                );
              })}
            </div>
          </StaggerItem>

          <StaggerItem className="grid flex-1 grid-cols-1 gap-3">
            {channel.features.map((feature, index) => {
              const Icon = feature.icon;
              const SignalIcon = liveSignalIcons[index % liveSignalIcons.length];
              return (
                <div
                  key={feature.title}
                  className="glass-medium rounded-[18px] border border-white/[0.06] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/35"
                      style={{ color: index % 2 === 0 ? channel.accent : channel.secondaryAccent }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-text-hi">{feature.title}</h2>
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-text-low">
                          <SignalIcon className="h-3 w-3" />
                          {feature.metric}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-text-low">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </StaggerItem>
        </div>
      </div>
    </StaggerContainer>
  );
}
