"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Search,
  Music,
  Radio,
  Sliders,
  Activity,
  AlertTriangle,
  RotateCcw,
  Shuffle,
  Maximize2,
  Minimize2,
  Wind,
  CloudRain,
  Cpu,
  Sparkles,
  ChevronDown,
  Wand2,
} from "lucide-react";
import { useAudioPlayer } from "@/lib/audio/AudioPlayerContext";
import { audioSynth } from "@/lib/audio";
import { useElementFullscreen } from "@/lib/hooks/useElementFullscreen";
import {
  VISUALIZERS,
  PALETTES,
  getVisualizer,
  makeAnalysis,
  updateAnalysis,
  type Analysis,
  type ColorKey,
  type VizFrame,
} from "@/lib/audio/visualizers";

const HIDE_DELAY_MS = 2800;

export default function MusicPage() {
  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    isSynthOnly,
    isFallbackActive,
    currentTime,
    simulatedDuration,
    repeatMode,
    isShuffle,
    tracks,
    analyser,
    togglePlay,
    handleTrackSelect,
    handleVolumeChange,
    toggleMute,
    handleNext,
    handlePrev,
    handleSynthToggle,
    handleSeek,
    toggleRepeatMode,
    toggleShuffle,
    // EQ
    eqBass,
    setEqBass,
    eqMid,
    setEqMid,
    eqTreble,
    setEqTreble,
    // Echo
    echoVol,
    setEchoVol,
    // Ambient
    rainVol,
    setRainVol,
    windVol,
    setWindVol,
    humVol,
    setHumVol,
  } = useAudioPlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"eq" | "ambient">("ambient");
  const [visualizerStyle, setVisualizerStyle] = useState<string>("mixed");
  const [visualizerColor, setVisualizerColor] = useState<ColorKey>("teal");
  const [isVizMenuOpen, setIsVizMenuOpen] = useState(false);
  const [autoCycle, setAutoCycle] = useState(false);

  const currentViz = getVisualizer(visualizerStyle);

  // ── True-fullscreen "theater" mode ─────────────────────────────────────────
  // The visualizer panel itself enters the browser fullscreen top-layer, so only
  // the visualization fills the screen. Escape / the browser's own exit are
  // reflected automatically through the hook's `fullscreenchange` subscription.
  const vizPanelRef = useRef<HTMLDivElement>(null);
  const {
    isFullscreen: isFs,
    isSupported: isFsSupported,
    toggle: toggleFs,
  } = useElementFullscreen(vizPanelRef);

  // Auto-hiding overlay controls (YouTube-style): visible on pointer movement,
  // fade out after a few seconds of inactivity. Paused while the pointer rests
  // on the control bars themselves so they never vanish mid-interaction.
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlsHoveredRef = useRef(false);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (!controlsHoveredRef.current) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), HIDE_DELAY_MS);
    }
  }, []);

  // Reveal the overlay controls (and restart their hide timer) whenever
  // fullscreen is entered or exited — including the browser's own Escape exit.
  // Driven off the DOM event rather than an `isFs` effect so the state updates
  // happen inside an event callback, not synchronously in an effect body.
  useEffect(() => {
    const onFsChange = () => {
      setIsVizMenuOpen(false);
      showControls();
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [showControls]);

  // Clear any pending hide timer on unmount.
  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    [],
  );

  const handleToggleFs = useCallback(() => {
    if (!isFsSupported) return;
    if (isFs) audioSynth.playClick();
    else audioSynth.playStatic();
    void toggleFs();
  }, [isFs, isFsSupported, toggleFs]);

  // Click = play/pause, double-click = toggle fullscreen. The single-click is
  // debounced so a double-click doesn't also fire a stray play/pause.
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVizClick = useCallback(() => {
    if (isFs) showControls();
    if (clickTimerRef.current) return;
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null;
      togglePlay();
    }, 220);
  }, [isFs, showControls, togglePlay]);

  const handleVizDoubleClick = useCallback(() => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    handleToggleFs();
  }, [handleToggleFs]);

  // Latest values/handlers for the fullscreen keyboard shortcuts, kept in a ref
  // so the keydown listener can bind once per fullscreen session without going
  // stale or re-subscribing every tick.
  const kbRef = useRef({
    togglePlay,
    toggleMute,
    handleSeek,
    handleVolumeChange,
    handleToggleFs,
    showControls,
    currentTime,
    simulatedDuration,
    volume,
    isPlayable: currentTrack.isPlayable,
  });
  useEffect(() => {
    kbRef.current = {
      togglePlay,
      toggleMute,
      handleSeek,
      handleVolumeChange,
      handleToggleFs,
      showControls,
      currentTime,
      simulatedDuration,
      volume,
      isPlayable: currentTrack.isPlayable,
    };
  });

  // Theater keyboard shortcuts — only active while fullscreen so they never
  // fight the global app shortcuts on the regular page.
  useEffect(() => {
    if (!isFs) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = kbRef.current;
      const seekBy = (delta: number) => {
        if (!k.isPlayable || !k.simulatedDuration) return;
        const next = Math.min(Math.max(k.currentTime + delta, 0), k.simulatedDuration);
        k.handleSeek(next / k.simulatedDuration);
      };
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          k.togglePlay();
          k.showControls();
          break;
        case "ArrowRight":
          e.preventDefault();
          seekBy(5);
          k.showControls();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seekBy(-5);
          k.showControls();
          break;
        case "ArrowUp":
          e.preventDefault();
          k.handleVolumeChange(Math.min(1, k.volume + 0.05));
          k.showControls();
          break;
        case "ArrowDown":
          e.preventDefault();
          k.handleVolumeChange(Math.max(0, k.volume - 0.05));
          k.showControls();
          break;
        case "m":
        case "M":
          k.toggleMute();
          k.showControls();
          break;
        case "f":
        case "F":
          k.handleToggleFs();
          break;
        default:
          k.showControls();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFs]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Logical (CSS-pixel) canvas size + device pixel ratio, kept in a ref so the
  // render loop can read the current dimensions without restarting on resize.
  const sizeRef = useRef({ w: 1, h: 1, dpr: 1 });
  // Smoothing / beat-detection state, persisted across effect re-subscriptions.
  const analysisRef = useRef<Analysis | null>(null);
  // Per-visualizer scratch space (particles, ring lists, spectrogram buffers…).
  const vizStateRef = useRef<Record<string, unknown>>({});

  // Audio Visualizer render loop.
  //
  // A single rAF loop pulls analyser bytes, derives a smoothed/beat-aware
  // Analysis, then dispatches to the active visualizer module. All shared
  // smoothing + beat state lives in refs so it survives effect re-subscriptions.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // Allocate analyser buffers once per (re)subscription instead of every frame.
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    if (!analysisRef.current || analysisRef.current.smooth.length !== bufferLength) {
      analysisRef.current = makeAnalysis(bufferLength);
    }

    let localFrameId: number;

    const draw = () => {
      localFrameId = requestAnimationFrame(draw);

      // Draw in logical pixels; the backing store is scaled by dpr for crispness.
      const { w: width, h: height, dpr } = sizeRef.current;
      if (width <= 0 || height <= 0) return;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (analyser) {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
      } else {
        freqData.fill(0);
        timeData.fill(128);
      }

      const t = performance.now() / 1000;
      const analysis = analysisRef.current!;
      updateAnalysis(analysis, freqData, timeData, t, isPlaying);

      const frame: VizFrame = {
        ctx: ctx2d,
        width,
        height,
        dpr,
        freq: freqData,
        time: timeData,
        a: analysis,
        palette: PALETTES[visualizerColor] || PALETTES.teal,
        expanded: isFs,
        playing: isPlaying,
        t,
        state: vizStateRef.current,
      };

      getVisualizer(visualizerStyle).draw(frame);

      // Reset shared context state so visualizers never leak into each other.
      ctx2d.shadowBlur = 0;
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.globalAlpha = 1;
    };

    draw();

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [isPlaying, analyser, visualizerStyle, visualizerColor, isFs]);

  // Reset per-visualizer scratch when switching modes so old particles / rings
  // / spectrogram buffers don't bleed into the next visualizer.
  useEffect(() => {
    vizStateRef.current = {};
  }, [visualizerStyle]);

  // Auto-cycle through visualizers for hands-off ambience.
  useEffect(() => {
    if (!autoCycle) return;
    const id = setInterval(() => {
      setVisualizerStyle((prev) => {
        const i = VISUALIZERS.findIndex((v) => v.value === prev);
        return VISUALIZERS[(i + 1) % VISUALIZERS.length].value;
      });
    }, 12000);
    return () => clearInterval(id);
  }, [autoCycle]);

  // Keep the canvas backing store matched to its rendered size (DPR-aware).
  //
  // Entering/leaving fullscreen reflows this canvas. Re-sizing the backing store
  // mid-transition would clear it every frame, so we keep the current backing
  // store (the browser just scales it — a smooth zoom) and only commit a fresh,
  // crisp size once movement has stopped. An explicit snap after the toggle
  // guarantees the final size even if no resize event lands.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const applySize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cssW = Math.max(rect.width, 1);
      const cssH = Math.max(rect.height, 1);
      sizeRef.current = { w: cssW, h: cssH, dpr };

      const pxW = Math.round(cssW * dpr);
      const pxH = Math.round(cssH * dpr);
      // Only touch the backing store when it actually changes — assigning
      // width/height clears the canvas, so avoid redundant clears.
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
    };

    let debounceId: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(debounceId);
      debounceId = setTimeout(applySize, 120);
    });
    observer.observe(canvas);

    // Track logical size immediately, then snap to a crisp size once the
    // fullscreen transition has settled.
    applySize();
    const settleId = setTimeout(applySize, 200);

    return () => {
      observer.disconnect();
      clearTimeout(debounceId);
      clearTimeout(settleId);
    };
  }, [isFs]);

  const filteredTracks = tracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const progressPct = (currentTime / (simulatedDuration || 1)) * 100;

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack.isPlayable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    handleSeek(Math.min(Math.max(percent, 0), 1));
  };

  const themeColors = [
    { value: "teal", label: "Neo Teal", class: "bg-accent-2" },
    { value: "purple", label: "Cyber Purple", class: "bg-accent-1" },
    { value: "amber", label: "Solar Amber", class: "bg-accent-3" },
    { value: "emerald", label: "Matrix Emerald", class: "bg-emerald-500" },
  ];

  // Shared visualization quick-controls (auto-cycle, style picker, palette) —
  // rendered in the in-frame header and again in the fullscreen top overlay.
  // Only one is ever mounted at a time (the panel is either framed or fullscreen).
  const vizQuickControls = (
    <>
      {/* Auto-cycle toggle */}
      <button
        onClick={() => { audioSynth.playClick(); setAutoCycle((v) => !v); }}
        title={`Auto-cycle visualizers: ${autoCycle ? "ON" : "OFF"}`}
        className={`flex items-center gap-1 px-1.5 py-1 text-[8px] font-mono rounded border transition-colors ${
          autoCycle
            ? "bg-accent-2/15 border-accent-2/40 text-accent-2"
            : "bg-black/40 border-white/5 text-text-low hover:text-text-mid"
        }`}
      >
        <Wand2 className={`w-2.5 h-2.5 ${autoCycle ? "animate-pulse" : ""}`} />
        AUTO
      </button>

      {/* Visualizer style dropdown */}
      <div className="relative">
        <button
          onClick={() => { audioSynth.playClick(); setIsVizMenuOpen((o) => !o); }}
          className="flex items-center gap-1.5 px-2 py-1 text-[8.5px] font-mono rounded bg-black/40 border border-white/5 text-text-hi hover:border-accent-2/40 transition-colors min-w-[78px] justify-between"
          title="Choose visualization"
        >
          <span className="truncate">{currentViz.short}</span>
          <ChevronDown className={`w-2.5 h-2.5 flex-shrink-0 transition-transform ${isVizMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {isVizMenuOpen && (
          <>
            {/* click-away backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsVizMenuOpen(false)} />
            <div className="absolute right-0 mt-1.5 z-50 w-44 max-h-[280px] overflow-y-auto bg-[#0a0c14]/98 border border-white/10 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.7)] p-1 backdrop-blur-md custom-scrollbar flex flex-col gap-0.5">
              {VISUALIZERS.map((v) => (
                <button
                  key={v.value}
                  onClick={() => {
                    audioSynth.playClick();
                    setAutoCycle(false);
                    setVisualizerStyle(v.value);
                    setIsVizMenuOpen(false);
                  }}
                  className={`text-left px-2 py-1.5 rounded text-[9px] font-mono flex items-center justify-between gap-2 transition-colors ${
                    visualizerStyle === v.value
                      ? "bg-accent-2/15 text-accent-2"
                      : "text-text-low hover:bg-white/5 hover:text-text-hi"
                  }`}
                >
                  <span>{v.label}</span>
                  {visualizerStyle === v.value && <span className="w-1.5 h-1.5 rounded-full bg-accent-2 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Color selectors */}
      <div className="flex items-center gap-1">
        {themeColors.map((c) => (
          <button
            key={c.value}
            onClick={() => setVisualizerColor(c.value as ColorKey)}
            className={`w-2 h-2 rounded-full transition-transform hover:scale-125 ${c.class} ${
              visualizerColor === c.value ? "ring-2 ring-white scale-110" : "opacity-60"
            }`}
            title={c.label}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-hidden relative">

          {/* Header row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-1/10 border border-accent-1/30 flex items-center justify-center text-accent-1 shadow-[0_0_12px_rgba(110,86,255,0.2)]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <Eyebrow className="mb-0">MUSIC FOR DEEP WORK</Eyebrow>
                <h1 className="text-sm font-semibold tracking-wider font-mono text-text-hi uppercase">
                  Ambient Music Console
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-white/5 border border-white/10 text-text-mid flex items-center gap-1.5 select-none">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-accent-2 animate-ping" : "bg-text-faint"}`} />
                {isPlaying ? (isFallbackActive ? "PROCEDURAL SYNTH" : "HQ DECODER") : "STANDBY"}
              </span>
            </div>
          </div>

          {/* Main workspace */}
          <div className="flex-1 w-full flex flex-col md:flex-row gap-5 min-h-0 overflow-hidden relative">

            {/* Left Column: Player Console */}
            <div className="flex-1 flex flex-col gap-4 min-h-0 relative">

              {/* Visualizer Panel — enters true browser fullscreen for theater mode */}
              <div
                ref={vizPanelRef}
                onPointerMove={isFs ? showControls : undefined}
                className={`
                  relative flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-300
                  ${isFs
                    ? "bg-black w-screen h-screen p-0 gap-0"
                    : "bg-black/60 border border-white/5 rounded-xl p-3 gap-2 flex-1 min-h-[220px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                  }
                  ${isFs && !controlsVisible ? "cursor-none" : ""}
                `}
              >
                {/* In-frame header (framed mode only) */}
                {!isFs && (
                  <div className="flex items-center justify-between z-10 w-full select-none flex-shrink-0">
                    <div className="flex items-center gap-1.5 pointer-events-none min-w-0">
                      <Activity className="w-5 h-5 text-accent-2 flex-shrink-0" />
                      <span className="text-[9px] font-mono text-text-low uppercase tracking-wider font-semibold truncate">
                        Visualization
                      </span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      {vizQuickControls}
                      <button
                        onClick={handleToggleFs}
                        disabled={!isFsSupported}
                        className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-text-mid hover:text-text-hi transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isFsSupported ? "Enter Theater (fullscreen)" : "Fullscreen unavailable"}
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Canvas area — the canvas fills it in both framed and fullscreen modes */}
                <div className={`relative overflow-hidden ${isFs ? "flex-1" : "flex-1 min-h-0 rounded-lg group"}`}>
                  <canvas
                    ref={canvasRef}
                    onClick={handleVizClick}
                    onDoubleClick={handleVizDoubleClick}
                    className={`absolute inset-0 w-full h-full bg-black/40 cursor-pointer ${
                      isFs ? "" : "rounded-lg border border-white/5"
                    }`}
                  />

                  {/* Cinematic vignette in theater mode */}
                  {isFs && (
                    <div
                      className="absolute inset-0 pointer-events-none z-[5]"
                      style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)" }}
                    />
                  )}

                  {/* Subtle hover hint (framed mode) — non-interactive so clicks reach the canvas */}
                  {!isFs && (
                    <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/10 text-[8.5px] font-mono text-text-mid tracking-wider uppercase backdrop-blur-sm">
                        Click ▷ play · Double-click ⛶ theater
                      </span>
                    </div>
                  )}

                  {/* ── Fullscreen overlays (auto-hiding) ── */}
                  {isFs && (
                    <>
                      {/* Top bar: title (left) · style + color (right) */}
                      <div
                        className={`absolute top-0 inset-x-0 z-30 transition-all duration-500 ${
                          controlsVisible ? "opacity-100" : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        <div className="bg-gradient-to-b from-black/85 via-black/40 to-transparent px-5 md:px-8 pt-5 pb-12 flex items-start justify-between gap-4 select-none">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Activity className="w-5 h-5 text-accent-2 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-ping" />
                                <span className="text-[9px] font-mono tracking-[0.25em] text-accent-2 font-bold uppercase truncate">
                                  Broadcasting // {currentViz.label}
                                </span>
                              </div>
                              <h2 className="text-sm md:text-base font-bold font-mono text-text-hi truncate leading-tight mt-0.5">
                                {currentTrack.title}
                              </h2>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            {vizQuickControls}
                            <button
                              onClick={handleToggleFs}
                              className="p-1.5 rounded bg-white/10 border border-white/15 hover:bg-white/20 text-text-hi transition-colors"
                              title="Exit Theater (Esc)"
                            >
                              <Minimize2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom bar: seeker + transport */}
                      <div
                        onMouseEnter={() => {
                          controlsHoveredRef.current = true;
                          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                          setControlsVisible(true);
                        }}
                        onMouseLeave={() => {
                          controlsHoveredRef.current = false;
                          showControls();
                        }}
                        className={`absolute bottom-0 inset-x-0 z-30 transition-all duration-500 ${
                          controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                        }`}
                      >
                        <div className="bg-gradient-to-t from-black/90 via-black/65 to-transparent px-5 md:px-8 pt-20 pb-6 flex flex-col gap-3.5">
                          {/* Seeker */}
                          <div className="flex items-center gap-3 select-none">
                            <span className="text-[10px] font-mono text-text-mid tabular-nums w-9 text-right">
                              {formatTime(currentTime)}
                            </span>
                            <div
                              onClick={seekFromEvent}
                              className={`flex-1 h-1.5 rounded-full bg-white/15 relative group/seek ${
                                currentTrack.isPlayable ? "cursor-pointer" : "cursor-not-allowed"
                              }`}
                            >
                              <div
                                className={`h-full absolute left-0 top-0 rounded-full transition-all duration-100 ${
                                  isFallbackActive ? "bg-accent-1" : "bg-accent-2"
                                }`}
                                style={{ width: `${progressPct}%` }}
                              />
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
                                style={{ left: `calc(${progressPct}% - 6px)` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-text-mid tabular-nums w-9">
                              {formatTime(simulatedDuration)}
                            </span>
                          </div>

                          {/* Transport */}
                          <div className="flex items-center justify-between gap-4">
                            {/* Left: repeat / shuffle */}
                            <div className="flex items-center gap-2 flex-1 select-none">
                              <button
                                onClick={toggleRepeatMode}
                                className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                                  repeatMode !== "none" ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/10 text-text-low hover:text-text-mid"
                                }`}
                                title={`Repeat: ${repeatMode.toUpperCase()}`}
                              >
                                <RotateCcw className={`w-5 h-5 ${repeatMode === "one" ? "scale-x-[-1]" : ""}`} />
                                {repeatMode === "one" && <span className="absolute text-[6px] font-mono font-bold mt-[14px]">1</span>}
                              </button>
                              <button
                                onClick={toggleShuffle}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                                  isShuffle ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/10 text-text-low hover:text-text-mid"
                                }`}
                                title={`Shuffle: ${isShuffle ? "ON" : "OFF"}`}
                              >
                                <Shuffle className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Center: prev / play / next */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handlePrev}
                                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                                title="Previous Track"
                              >
                                <SkipBack className="w-6 h-6" />
                              </button>
                              <button
                                onClick={togglePlay}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                  isPlaying && currentTrack.isPlayable
                                    ? "bg-accent-2 text-black hover:bg-accent-2/80 shadow-[0_0_18px_rgba(0,224,203,0.45)]"
                                    : "bg-accent-1 text-text-hi hover:bg-accent-1/80 shadow-[0_0_18px_rgba(110,86,255,0.45)]"
                                }`}
                                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                              >
                                {isPlaying && currentTrack.isPlayable ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                              </button>
                              <button
                                onClick={handleNext}
                                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                                title="Next Track"
                              >
                                <SkipForward className="w-6 h-6" />
                              </button>
                            </div>

                            {/* Right: mute + volume */}
                            <div className="flex items-center gap-2 flex-1 justify-end select-none">
                              <button
                                onClick={toggleMute}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-text-mid flex items-center justify-center transition-all"
                                title={isMuted ? "Unmute (M)" : "Mute (M)"}
                              >
                                {isMuted ? <VolumeX className="w-5 h-5 text-accent-3" /> : <Volume2 className="w-5 h-5" />}
                              </button>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="w-20 md:w-28 accent-accent-2 cursor-pointer bg-white/10 h-1 rounded-full appearance-none outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress bar / Seeker — framed mode only */}
                {!isFs && (
                  <div className="w-full flex flex-col gap-1 select-none flex-shrink-0">
                    <div
                      onClick={seekFromEvent}
                      className={`w-full h-1.5 rounded-full bg-white/5 border border-white/10 relative overflow-hidden group/seek ${
                        currentTrack.isPlayable ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`h-full absolute left-0 top-0 transition-all duration-100 rounded-full ${
                          isFallbackActive ? "bg-accent-1" : "bg-accent-2"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                      <div
                        className="absolute w-2 h-full top-0 bg-white shadow-xl opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none rounded-full"
                        style={{ left: `calc(${progressPct}% - 4px)` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono text-text-low px-0.5 tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(simulatedDuration)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Deck Console — track details + EQ/Remix suite + transport (compact) */}
              <div className="flex-shrink-0 bg-black/30 border border-white/5 rounded-xl p-3.5 flex flex-col gap-3 relative glass-panel">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-1/2 to-transparent opacity-10 pointer-events-none" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    {/* Disc artwork */}
                    <div className="relative w-14 h-14 flex-shrink-0 select-none">
                      <div className={`w-full h-full rounded-full border border-white/10 bg-zinc-950 flex items-center justify-center shadow-2xl relative overflow-hidden ${isPlaying && currentTrack.isPlayable ? "animate-[spin_10s_linear_infinite]" : ""}`}>
                        <div className="absolute inset-2 rounded-full border border-dashed border-white/5" />
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                        <div className="w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center relative z-10 shadow-lg">
                          <div className="w-2 h-2 rounded-full bg-accent-1 shadow-[0_0_8px_var(--accent-1)]" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                      </div>
                      <div className={`absolute -inset-1 rounded-full border border-accent-2/10 pointer-events-none ${isPlaying && currentTrack.isPlayable ? "animate-pulse" : ""}`} />
                    </div>

                    <div>
                      <span className="text-[8.5px] font-mono text-accent-1 uppercase tracking-widest font-semibold block mb-0.5">
                        {currentTrack.isPlayable ? "Now Playing" : "Archive database"}
                      </span>
                      <h2 className="text-sm font-bold font-mono text-text-hi leading-tight tracking-wide mb-1">
                        {currentTrack.title}
                      </h2>
                      <p className="text-[9.5px] text-text-low line-clamp-2 leading-relaxed max-w-sm">
                        {currentTrack.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabbed Suite: Equalizer + Remix (ambient texture) layers */}
                <div className="border border-white/5 rounded-xl bg-black/40 overflow-hidden flex flex-col flex-shrink-0">
                  {/* Tab Headers */}
                  <div className="flex border-b border-white/5 bg-black/20 text-[9px] font-mono">
                    <button
                      onClick={() => setActiveConsoleTab("eq")}
                      className={`flex-1 py-2.5 text-[11px] flex items-center justify-center gap-2 border-r border-white/5 transition-all ${
                        activeConsoleTab === "eq" ? "bg-white/5 text-accent-2 font-bold" : "text-text-low hover:text-text-mid"
                      }`}
                    >
                      <Sliders className="w-4 h-4" />
                      Equalizer
                    </button>
                    <button
                      onClick={() => setActiveConsoleTab("ambient")}
                      className={`flex-1 py-2.5 text-[11px] flex items-center justify-center gap-2 transition-all ${
                        activeConsoleTab === "ambient" ? "bg-white/5 text-accent-2 font-bold" : "text-text-low hover:text-text-mid"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Remix
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="p-3 flex flex-col justify-center min-h-[72px]">
                    {activeConsoleTab === "eq" && (
                      <div className="flex items-center justify-around gap-4">
                        {/* Bass */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low uppercase">Bass</span>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={eqBass}
                            onChange={(e) => setEqBass(parseInt(e.target.value))}
                            className="w-full accent-accent-1 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className={`text-[8.5px] font-mono ${eqBass > 0 ? "text-accent-1" : eqBass < 0 ? "text-text-low" : "text-text-faint"}`}>
                            {eqBass > 0 ? `+${eqBass}` : eqBass} dB
                          </span>
                        </div>

                        {/* Mid */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low uppercase">Mid</span>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={eqMid}
                            onChange={(e) => setEqMid(parseInt(e.target.value))}
                            className="w-full accent-accent-2 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className={`text-[8.5px] font-mono ${eqMid > 0 ? "text-accent-2" : eqMid < 0 ? "text-text-low" : "text-text-faint"}`}>
                            {eqMid > 0 ? `+${eqMid}` : eqMid} dB
                          </span>
                        </div>

                        {/* Treble */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low uppercase">Treble</span>
                          <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={eqTreble}
                            onChange={(e) => setEqTreble(parseInt(e.target.value))}
                            className="w-full accent-accent-3 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className={`text-[8.5px] font-mono ${eqTreble > 0 ? "text-accent-3" : eqTreble < 0 ? "text-text-low" : "text-text-faint"}`}>
                            {eqTreble > 0 ? `+${eqTreble}` : eqTreble} dB
                          </span>
                        </div>

                        {/* Echo */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low uppercase">Echo</span>
                          <input
                            type="range"
                            min="0"
                            max="0.8"
                            step="0.01"
                            value={echoVol}
                            onChange={(e) => setEchoVol(parseFloat(e.target.value))}
                            className="w-full accent-purple-400 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className={`text-[8.5px] font-mono ${echoVol > 0 ? "text-purple-400" : "text-text-faint"}`}>
                            {Math.round((echoVol / 0.8) * 100)}%
                          </span>
                        </div>

                        {/* Reset EQ */}
                        <button
                          onClick={() => {
                            setEqBass(0);
                            setEqMid(0);
                            setEqTreble(0);
                            setEchoVol(0);
                          }}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-mono text-text-low hover:text-text-hi transition-colors"
                        >
                          Flat
                        </button>
                      </div>
                    )}

                    {activeConsoleTab === "ambient" && (
                      <div className="flex items-center justify-around gap-4">
                        {/* Rain */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low flex items-center gap-1">
                            <CloudRain className="w-2.5 h-2.5 text-blue-400" />
                            Rain
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="0.4"
                            step="0.01"
                            value={rainVol}
                            onChange={(e) => setRainVol(parseFloat(e.target.value))}
                            className="w-full accent-blue-400 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className="text-[8px] font-mono text-text-low">
                            {Math.round((rainVol / 0.4) * 100)}%
                          </span>
                        </div>

                        {/* Wind */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low flex items-center gap-1">
                            <Wind className="w-2.5 h-2.5 text-teal-400" />
                            Wind
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="0.4"
                            step="0.01"
                            value={windVol}
                            onChange={(e) => setWindVol(parseFloat(e.target.value))}
                            className="w-full accent-teal-400 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className="text-[8px] font-mono text-text-low">
                            {Math.round((windVol / 0.4) * 100)}%
                          </span>
                        </div>

                        {/* Hum */}
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-[8px] font-mono text-text-low flex items-center gap-1">
                            <Cpu className="w-2.5 h-2.5 text-accent-3" />
                            Hum
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="0.4"
                            step="0.01"
                            value={humVol}
                            onChange={(e) => setHumVol(parseFloat(e.target.value))}
                            className="w-full accent-accent-3 cursor-pointer bg-white/10 h-1 rounded outline-none"
                          />
                          <span className="text-[8px] font-mono text-text-low">
                            {Math.round((humVol / 0.4) * 100)}%
                          </span>
                        </div>

                        {/* Presets */}
                        <div className="flex flex-col gap-1 select-none">
                          <button
                            onClick={() => {
                              setRainVol(0.15);
                              setWindVol(0.1);
                              setHumVol(0);
                            }}
                            className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[7.5px] font-mono text-text-low hover:text-text-hi"
                          >
                            Nature
                          </button>
                          <button
                            onClick={() => {
                              setRainVol(0);
                              setWindVol(0);
                              setHumVol(0);
                            }}
                            className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[7.5px] font-mono text-text-low hover:text-text-hi"
                          >
                            Off
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bezel Controls */}
                <div className="flex items-center justify-between w-full gap-2 sm:gap-4 flex-shrink-0">
                  {/* Left: Toggles (Repeat, Shuffle, Synth Mode) */}
                  <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-start select-none">
                    <button
                      onClick={toggleRepeatMode}
                      className={`relative w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                        repeatMode !== "none" ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                      }`}
                      title={`Repeat: ${repeatMode.toUpperCase()}`}
                    >
                      <RotateCcw className={`w-5 h-5 ${repeatMode === "one" ? "scale-x-[-1]" : ""}`} />
                      {repeatMode === "one" && <span className="absolute text-[6px] font-mono font-bold mt-[14px]">1</span>}
                    </button>

                    <button
                      onClick={toggleShuffle}
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                        isShuffle ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                      }`}
                      title={`Shuffle: ${isShuffle ? "ON" : "OFF"}`}
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleSynthToggle}
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                        isSynthOnly ? "bg-accent-1/10 border-accent-1 text-accent-1" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                      }`}
                      title={`Synthesizer Mode: ${isSynthOnly ? "FORCE ON" : "AUTO"}`}
                    >
                      <Sliders className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Center: Playback Controls (Prev, Play/Pause, Next) */}
                  <div className="flex items-center gap-2 md:gap-3 justify-center flex-shrink-0">
                    <button
                      onClick={handlePrev}
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                      title="Previous Track (⟨)"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isPlaying && currentTrack.isPlayable
                           ? "bg-accent-2 text-black hover:bg-accent-2/80 shadow-[0_0_15px_rgba(0,224,203,0.4)]"
                           : "bg-accent-1 text-text-hi hover:bg-accent-1/80 shadow-[0_0_15px_rgba(110,86,255,0.4)]"
                      }`}
                      title={`${isPlaying ? "Pause" : "Play"} (⇧P)`}
                    >
                      {isPlaying && currentTrack.isPlayable ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                    </button>

                    <button
                      onClick={handleNext}
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                      title="Next Track (⟩)"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Right: Volume Block */}
                  <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-end select-none">
                    <button
                      onClick={toggleMute}
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid flex items-center justify-center transition-all"
                      title={`${isMuted ? "Unmute" : "Mute"} (⇧X)`}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-accent-3" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      aria-label="Volume"
                      // Hidden on phones (device volume rules there); mute stays.
                      className="hidden sm:block w-16 md:w-20 accent-accent-2 cursor-pointer bg-white/10 h-1 rounded-full appearance-none outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Track Search and Playlist Library */}
            <div className="w-full md:w-[340px] lg:w-[380px] xl:w-[420px] flex flex-col gap-3 min-h-0 select-none">

              {/* Search Box */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex-shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-low pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search Music..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 focus:border-accent-2/50 rounded-lg py-2 pl-9 pr-8 text-xs font-mono text-text-hi placeholder-text-faint outline-none transition-all focus:shadow-[0_0_12px_rgba(0,224,203,0.1)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-text-faint hover:text-text-mid text-xs font-mono"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Track list */}
              <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col min-h-0 glass-panel">
                <div className="flex justify-between items-center mb-2 px-1 flex-shrink-0">
                  <span className="text-[9px] font-mono text-text-low tracking-wider uppercase font-semibold">Channel Library</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-text-mid">
                    COUNT: {filteredTracks.length}
                  </span>
                </div>

                {/* List container */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 custom-scrollbar">
                  {filteredTracks.map((track) => {
                    const isSelected = track.id === currentTrack.id;
                    const isTrackPlaying = isPlaying && isSelected;

                    return (
                      <button
                        key={track.id}
                        onClick={() => {
                          // Clicking the current track toggles play/pause (so
                          // clicking the live track pauses it); any other track
                          // gets selected and auto-played.
                          if (isSelected) {
                            togglePlay();
                            return;
                          }
                          const idx = tracks.findIndex((t) => t.id === track.id);
                          handleTrackSelect(idx, { autoplay: true });
                        }}
                        aria-current={isTrackPlaying ? "true" : undefined}
                        className={`w-full text-left p-2 rounded-lg border transition-all duration-300 flex items-center justify-between gap-3 group relative overflow-hidden cursor-pointer ${
                          isTrackPlaying
                            ? "bg-accent-2/10 border-accent-2/60 shadow-[0_0_18px_rgba(0,224,203,0.12),inset_0_1px_8px_rgba(0,224,203,0.08)]"
                            : isSelected
                            ? "bg-white/5 border-accent-1/50 shadow-[inset_0_1px_4px_rgba(255,255,255,0.02)]"
                            : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
                        }`}
                      >
                        {/* Indicator highlight pill */}
                        {isSelected && (
                          <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isTrackPlaying ? "bg-accent-2 shadow-[0_0_12px_var(--accent-2)]" : track.isPlayable ? "bg-accent-2" : "bg-accent-3"}`} />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Channel number or animated indicator */}
                          <div className="w-6 h-6 rounded bg-black/40 border border-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-mono text-text-low">
                            {isTrackPlaying ? (
                              <span className="inline-flex animate-[track-icon-spin-in_0.6s_ease-out]">
                                <Music className="w-3.5 h-3.5 text-accent-2 animate-[track-icon-zoom_1.4s_ease-in-out_infinite]" />
                              </span>
                            ) : (
                              String(track.id).padStart(2, "0")
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className={`text-xs font-semibold font-mono block truncate leading-snug group-hover:text-text-hi transition-colors ${isTrackPlaying ? "text-accent-2" : "text-text-hi"}`}>
                              {track.title}
                            </span>
                            <span className={`text-[8.5px] font-mono tracking-wider font-semibold uppercase px-1 rounded inline-block mt-0.5 ${
                              isTrackPlaying
                                ? "bg-accent-2/20 border border-accent-2/40 text-accent-2"
                                : track.isPlayable
                                ? "bg-accent-2/10 border border-accent-2/20 text-accent-2"
                                : "bg-accent-3/10 border border-accent-3/20 text-accent-3"
                            }`}>
                              {isTrackPlaying ? "PLAYING" : track.isPlayable ? "LIVE" : "ARCHIVE"}
                            </span>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono text-text-low group-hover:text-text-mid transition-colors flex-shrink-0">
                          {track.duration}
                        </span>
                      </button>
                    );
                  })}

                  {filteredTracks.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-6 h-6 text-text-faint mx-auto mb-2" />
                      <p className="text-[10px] font-mono text-text-low">No channels found matching query.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </TvFrame>
    </>
  );
}
