"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useAudioPlayer } from "@/lib/audio/AudioPlayerContext";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { useAppMode } from "@/lib/hooks/useAppMode";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { AnimatedBorder } from "@/components/glass/AnimatedBorder";
import { MusicMiniControls } from "./MusicMiniControls";
import { audioSynth } from "@/lib/audio";

function formatTime(secs: number) {
  if (!Number.isFinite(secs) || secs < 0) secs = 0;
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * NowPlayingDock — a floating glass mini-player for pages that have no TV chrome
 * bar (the brochure surfaces). On app-mode pages the inline TV-chrome controls
 * cover this, so the dock hides itself there to avoid two control surfaces.
 *
 * Mounted once in the root layout; reads the global AudioPlayerContext. Visible
 * only once a listening session is live (playing or scrubbed into a track).
 */
export function NowPlayingDock() {
  const { isPlaying, currentTime, simulatedDuration, currentTrack } = useAudioPlayer();
  const { reducedMotionEnabled } = useTheme();
  const osReducedMotion = useReducedMotion();
  // Respect both the app's manual toggle and the OS-level setting — framer's JS
  // transforms aren't caught by the global reduced-motion CSS.
  const reduce = reducedMotionEnabled || !!osReducedMotion;
  const isAppMode = useAppMode();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  const sessionActive = isPlaying || currentTime > 0;

  // Re-arm the dock (clear a manual dismiss) when the session resets OR the
  // listener switches tracks — so "hide" reads as "hide for now", not "gone for
  // the whole session". Adjusting state during render avoids a cascading effect.
  const [prevActive, setPrevActive] = useState(sessionActive);
  const [prevTrackId, setPrevTrackId] = useState(currentTrack.id);
  if (prevActive !== sessionActive || prevTrackId !== currentTrack.id) {
    const trackChanged = prevTrackId !== currentTrack.id;
    setPrevActive(sessionActive);
    setPrevTrackId(currentTrack.id);
    if (dismissed && (!sessionActive || trackChanged)) setDismissed(false);
  }

  const visible = sessionActive && !isAppMode && pathname !== "/music" && !dismissed;

  const progress =
    simulatedDuration > 0 ? Math.min(100, (currentTime / simulatedDuration) * 100) : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="now-playing-dock"
          className="fixed right-4 bottom-[calc(1rem+var(--safe-bottom))] sm:right-6 sm:bottom-[calc(1.5rem+var(--safe-bottom))] z-[60] pointer-events-auto"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={
            reduce ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 30 }
          }
        >
          <AnimatedBorder variant="pulse" radius={16} paused={reduce}>
            <GlassPanel variant="heavy" className="w-[min(86vw,320px)] px-3.5 py-3">
              {/* Header — status dot + track title + dismiss */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`shrink-0 w-2 h-2 rounded-full bg-accent-2 ${
                    isPlaying && !reduce ? "signal-dot" : ""
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-text-low leading-none mb-1">
                    {isPlaying ? "Now Playing" : "Paused"}
                  </p>
                  <p className="text-[13px] font-medium text-text-hi truncate leading-tight">
                    {currentTrack.title}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Hide music controls"
                  onClick={() => {
                    audioSynth.playClick();
                    setDismissed(true);
                  }}
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-text-low hover:text-text-hi hover:bg-white/10 transition cursor-pointer opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress (display only) */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="text-[10px] font-mono text-text-low tabular-nums w-8 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="relative flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent-2"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-text-low tabular-nums w-8">
                  {formatTime(simulatedDuration)}
                </span>
              </div>

              {/* Transport + open console */}
              <div className="mt-1.5 flex items-center justify-between">
                <MusicMiniControls variant="dock" />
                <Link
                  href="/music"
                  aria-label="Open music console"
                  onClick={() => audioSynth.playClick()}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-mid hover:text-accent-2 transition px-2 py-1 rounded-md hover:bg-white/5"
                >
                  Console <Maximize2 className="w-3 h-3" />
                </Link>
              </div>
            </GlassPanel>
          </AnimatedBorder>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
