"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useAudioPlayer } from "@/lib/audio/AudioPlayerContext";
import { audioSynth } from "@/lib/audio";
import { cn } from "@/lib/utils/cn";

interface MusicMiniControlsProps {
  /**
   * `inline` blends into the TV chrome bar (reuses `tv-console-btn`); `dock`
   * renders rounder glass buttons for the floating off-page widget.
   */
  variant?: "inline" | "dock";
  className?: string;
}

/**
 * MusicMiniControls — the shared prev / play-pause / next transport, driven by
 * the global AudioPlayerContext. Used by both the TV-chrome inline controls and
 * the floating NowPlayingDock so the playback wiring lives in one place.
 */
export function MusicMiniControls({ variant = "dock", className }: MusicMiniControlsProps) {
  const { isPlaying, togglePlay, handleNext, handlePrev } = useAudioPlayer();

  const isInline = variant === "inline";
  const hover = () => isInline && audioSynth.playHover();
  const btnClass = isInline
    ? "tv-console-btn relative z-10"
    : "inline-flex items-center justify-center rounded-full w-9 h-9 text-text-hi/85 hover:text-text-hi hover:bg-white/10 active:scale-95 transition-[color,background-color,transform] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60";
  const iconClass = isInline ? "w-5 h-5 relative z-10" : "w-[18px] h-[18px]";

  return (
    <div className={cn("flex items-center", isInline ? "gap-1" : "gap-0.5", className)}>
      <button
        type="button"
        className={btnClass}
        aria-label="Previous track"
        onMouseEnter={hover}
        onClick={() => {
          audioSynth.playClick();
          handlePrev();
        }}
      >
        <SkipBack className={iconClass} />
        {isInline && <span className="tooltip">Previous</span>}
      </button>
      <button
        type="button"
        className={btnClass}
        aria-label={isPlaying ? "Pause" : "Play"}
        onMouseEnter={hover}
        onClick={() => {
          audioSynth.playClick();
          void togglePlay();
        }}
      >
        {isPlaying ? <Pause className={iconClass} /> : <Play className={iconClass} />}
        {isInline && <span className="tooltip">{isPlaying ? "Pause" : "Play"}</span>}
      </button>
      <button
        type="button"
        className={btnClass}
        aria-label="Next track"
        onMouseEnter={hover}
        onClick={() => {
          audioSynth.playClick();
          handleNext();
        }}
      >
        <SkipForward className={iconClass} />
        {isInline && <span className="tooltip">Next</span>}
      </button>
    </div>
  );
}
