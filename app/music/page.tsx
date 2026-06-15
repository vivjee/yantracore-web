"use client";

import { useState, useEffect, useRef } from "react";
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
  Terminal,
  Activity,
  AlertTriangle,
  RotateCcw,
  Shuffle,
  Maximize2,
  Minimize2,
  Upload,
  Link as LinkIcon,
  Wind,
  CloudRain,
  Cpu,
  Sparkles,
} from "lucide-react";
import { useAudioPlayer, Track } from "@/lib/audio/AudioPlayerContext";
import { audioSynth } from "@/lib/audio";

export default function MusicPage() {
  const {
    currentTrackIndex,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    isSynthOnly,
    isFallbackActive,
    currentTime,
    simulatedDuration,
    logs,
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
    // Custom Track Loaders
    addCustomTrack,
  } = useAudioPlayer();

  const [searchQuery, setSearchQuery] = useState("");
  const [isVisualizerExpanded, setIsVisualizerExpanded] = useState(false);
  const [isLocalGlitching, setIsLocalGlitching] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"eq" | "ambient">("ambient");
  const [customUrl, setCustomUrl] = useState("");
  const [visualizerStyle, setVisualizerStyle] = useState<"mixed" | "bars" | "scope" | "circular">("mixed");
  const [visualizerColor, setVisualizerColor] = useState<"teal" | "purple" | "amber" | "emerald">("teal");

  const toggleVisualizerExpanded = () => {
    if (isVisualizerExpanded) {
      audioSynth.playClick();
    } else {
      audioSynth.playStatic();
    }
    setIsLocalGlitching(true);
    setIsVisualizerExpanded(!isVisualizerExpanded);
    setTimeout(() => {
      setIsLocalGlitching(false);
    }, 220);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Audio Visualizer Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let localFrameId: number;

    const draw = () => {
      localFrameId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Color maps based on visualizerColor theme
      let cLow = "rgba(110, 86, 255, 0.15)";
      let cMid = "rgba(110, 86, 255, 0.7)";
      let cHi = "rgba(0, 224, 203, 1)";
      let shadowColor = "rgba(0, 224, 203, 0.4)";

      if (visualizerColor === "purple") {
        cLow = "rgba(255, 79, 176, 0.15)";
        cMid = "rgba(255, 79, 176, 0.7)";
        cHi = "rgba(110, 86, 255, 1)";
        shadowColor = "rgba(110, 86, 255, 0.4)";
      } else if (visualizerColor === "amber") {
        cLow = "rgba(239, 68, 68, 0.15)";
        cMid = "rgba(239, 68, 68, 0.7)";
        cHi = "rgba(245, 158, 11, 1)";
        shadowColor = "rgba(245, 158, 11, 0.4)";
      } else if (visualizerColor === "emerald") {
        cLow = "rgba(59, 130, 246, 0.15)";
        cMid = "rgba(59, 130, 246, 0.7)";
        cHi = "rgba(16, 185, 129, 1)";
        shadowColor = "rgba(16, 185, 129, 0.4)";
      }

      // Trail fade background
      ctx2d.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx2d.fillRect(0, 0, width, height);

      // Draw glowing background grid
      ctx2d.strokeStyle = "rgba(255, 255, 255, 0.012)";
      ctx2d.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx2d.beginPath();
        ctx2d.moveTo(x, 0);
        ctx2d.lineTo(x, height);
        ctx2d.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(width, y);
        ctx2d.stroke();
      }

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (visualizerStyle === "scope") {
          analyser.getByteTimeDomainData(dataArray);

          ctx2d.beginPath();
          ctx2d.strokeStyle = cHi;
          ctx2d.lineWidth = isVisualizerExpanded ? 3 : 1.5;
          ctx2d.shadowBlur = 10;
          ctx2d.shadowColor = shadowColor;

          const sliceWidth = width / bufferLength;
          let xWave = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const yWave = (v * height / 2);

            if (i === 0) {
              ctx2d.moveTo(xWave, yWave);
            } else {
              ctx2d.lineTo(xWave, yWave);
            }

            xWave += sliceWidth;
          }

          ctx2d.lineTo(width, height / 2);
          ctx2d.stroke();
        } 
        else if (visualizerStyle === "circular") {
          analyser.getByteFrequencyData(dataArray);
          const centerX = width / 2;
          const centerY = height / 2;
          const baseRadius = isVisualizerExpanded ? Math.min(width, height) * 0.35 : Math.min(width, height) * 0.22;

          let bassSum = 0;
          for (let i = 0; i < 8; i++) bassSum += dataArray[i];
          const bassAvg = bassSum / 8;
          const radius = baseRadius + (bassAvg / 255) * (isVisualizerExpanded ? 24 : 12);

          // Central ring
          ctx2d.beginPath();
          ctx2d.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx2d.strokeStyle = cHi;
          ctx2d.lineWidth = isVisualizerExpanded ? 4.5 : 2;
          ctx2d.shadowBlur = 15;
          ctx2d.shadowColor = shadowColor;
          ctx2d.stroke();

          // Spikes
          const numBars = 60;
          for (let i = 0; i < numBars; i++) {
            const angle = (i / numBars) * 2 * Math.PI;
            const dataIndex = Math.floor((i / numBars) * (bufferLength / 2));
            const value = dataArray[dataIndex] / 255;
            const barLength = value * (isVisualizerExpanded ? 60 : 30);

            const startX = centerX + Math.cos(angle) * radius;
            const startY = centerY + Math.sin(angle) * radius;
            const endX = centerX + Math.cos(angle) * (radius + barLength);
            const endY = centerY + Math.sin(angle) * (radius + barLength);

            ctx2d.beginPath();
            ctx2d.moveTo(startX, startY);
            ctx2d.lineTo(endX, endY);
            ctx2d.strokeStyle = cMid;
            ctx2d.lineWidth = isVisualizerExpanded ? 3.5 : 1.75;
            ctx2d.stroke();
          }
        }
        else if (visualizerStyle === "bars") {
          analyser.getByteFrequencyData(dataArray);
          const numBars = isVisualizerExpanded ? 64 : 48;
          const barWidth = (width / numBars) - 2;
          let x = 0;

          for (let i = 0; i < numBars; i++) {
            const percent = dataArray[i] / 255;
            const barHeight = percent * (height - 35);
            
            const gradient = ctx2d.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, cLow);
            gradient.addColorStop(0.5, cMid);
            gradient.addColorStop(1, cHi);

            ctx2d.fillStyle = gradient;
            ctx2d.shadowBlur = 6;
            ctx2d.shadowColor = shadowColor;

            ctx2d.fillRect(x, height - barHeight - 8, barWidth, barHeight);
            x += barWidth + 2;
          }
        }
        else { // "mixed"
          analyser.getByteFrequencyData(dataArray);

          // Mirrored frequencies
          const barWidth = (width / 32) - 3;
          let x = 0;

          for (let i = 0; i < 32; i++) {
            const percent = dataArray[i] / 255;
            const barHeight = percent * (height - 35);
            
            const gradient = ctx2d.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, cLow);
            gradient.addColorStop(0.5, cMid);
            gradient.addColorStop(1, cHi);

            ctx2d.fillStyle = gradient;
            ctx2d.shadowBlur = 8;
            ctx2d.shadowColor = shadowColor;

            ctx2d.fillRect(width / 2 + x, height - barHeight - 10, barWidth, barHeight);
            ctx2d.fillRect(width / 2 - x - barWidth, height - barHeight - 10, barWidth, barHeight);

            x += barWidth + 3;
          }

          // Central oscilloscope
          const timeArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(timeArray);

          ctx2d.beginPath();
          ctx2d.lineWidth = 1.5;
          ctx2d.strokeStyle = cHi;
          ctx2d.shadowBlur = 10;
          ctx2d.shadowColor = shadowColor;

          const sliceWidth = width / bufferLength;
          let xWave = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = timeArray[i] / 128.0;
            const yWave = (v * height / 2);

            if (i === 0) {
              ctx2d.moveTo(xWave, yWave);
            } else {
              ctx2d.lineTo(xWave, yWave);
            }

            xWave += sliceWidth;
          }

          ctx2d.lineTo(width, height / 2);
          ctx2d.stroke();
        }
      } else {
        // Idle ambient line
        ctx2d.beginPath();
        ctx2d.lineWidth = 1;
        ctx2d.strokeStyle = cLow;
        ctx2d.shadowBlur = 0;
        ctx2d.moveTo(0, height / 2);
        
        const time = Date.now() * 0.003;
        for (let ix = 0; ix < width; ix += 5) {
          const wobble = Math.sin(ix * 0.05 + time) * 1.5;
          ctx2d.lineTo(ix, height / 2 + wobble);
        }
        ctx2d.stroke();
      }

      ctx2d.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [isPlaying, analyser, visualizerStyle, visualizerColor, isVisualizerExpanded]);

  // Resize canvas bounds dynamically using ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(rect.width, 1);
      canvas.height = Math.max(rect.height, 1);
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(canvas);
    handleResize();

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    const newTrack: Track = {
      id: tracks.length + 1,
      title: file.name.replace(/\.[^/.]+$/, ""),
      duration: "00:00", // will load metadata
      isPlayable: true,
      src: objectURL,
      description: "User uploaded local ambient core file.",
      tempo: "Local",
      key: "Custom"
    };

    addCustomTrack(newTrack);
    setTimeout(() => {
      handleTrackSelect(tracks.length, { autoplay: true });
    }, 100);
  };

  // Handle URL stream loading
  const handleUrlLoad = () => {
    if (!customUrl) return;
    const newTrack: Track = {
      id: tracks.length + 1,
      title: "Custom Stream " + (tracks.length - 19),
      duration: "Stream",
      isPlayable: true,
      src: customUrl,
      description: `External streaming network feed: ${customUrl}`,
      tempo: "Network",
      key: "Remote"
    };

    addCustomTrack(newTrack);
    setCustomUrl("");
    setTimeout(() => {
      handleTrackSelect(tracks.length, { autoplay: true });
    }, 100);
  };

  const filteredTracks = tracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  // Setup visualizer preset controls
  const visualizerStyles = [
    { value: "mixed", label: "Spectrum Wave" },
    { value: "bars", label: "EQ Columns" },
    { value: "scope", label: "Oscilloscope" },
    { value: "circular", label: "Radial Portal" },
  ];

  const themeColors = [
    { value: "teal", label: "Neo Teal", class: "bg-accent-2" },
    { value: "purple", label: "Cyber Purple", class: "bg-accent-1" },
    { value: "amber", label: "Solar Amber", class: "bg-accent-3" },
    { value: "emerald", label: "Matrix Emerald", class: "bg-emerald-500" },
  ];

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-hidden relative">
          
          {/* CRT Local Channel Static Glitch Overlay */}
          {isLocalGlitching && (
            <div className="absolute inset-0 bg-[#06070d] z-[99] pointer-events-none flex flex-col items-center justify-center">
              <div className="crt-glitch-static" />
              <div className="crt-glitch-line" />
            </div>
          )}
          
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
              
              {/* Visualizer Panel (Supports Fullscreen/Expanded Mode) */}
              <div className={`
                bg-black/60 border border-white/5 rounded-xl p-3 flex flex-col relative overflow-hidden flex-shrink-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300
                ${isVisualizerExpanded 
                  ? "flex-1 border-accent-2/20 p-5 md:p-6 shadow-[0_0_40px_rgba(0,224,203,0.15)] bg-[#06070d]/98 gap-4" 
                  : "w-full gap-2"
                }
              `}>
                {/* Visualizer Panel Header */}
                <div className="flex items-center justify-between z-10 w-full select-none">
                  <div className="flex items-center gap-1.5 pointer-events-none">
                    <Activity className="w-5 h-5 text-accent-2" />
                    <span className="text-[9px] font-mono text-text-low uppercase tracking-wider font-semibold">
                      {isVisualizerExpanded ? "TV Mode // Ambient Space" : "Visualization"}
                    </span>
                  </div>

                  {/* Settings selectors & Expand control */}
                  <div className="flex items-center gap-3">
                    {/* Visualizer style selector */}
                    <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-md p-0.5">
                      {visualizerStyles.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setVisualizerStyle(s.value as any)}
                          className={`px-1.5 py-0.5 text-[8px] font-mono rounded transition-colors ${
                            visualizerStyle === s.value 
                              ? "bg-white/10 text-text-hi" 
                              : "text-text-low hover:text-text-mid"
                          }`}
                        >
                          {s.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    {/* Color selectors */}
                    <div className="flex items-center gap-1">
                      {themeColors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setVisualizerColor(c.value as any)}
                          className={`w-2 h-2 rounded-full transition-transform hover:scale-125 ${c.class} ${
                            visualizerColor === c.value ? "ring-2 ring-white scale-110" : "opacity-60"
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>

                    {/* Expand/Shrink Button */}
                    <button
                      onClick={toggleVisualizerExpanded}
                      className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-text-mid hover:text-text-hi transition-colors"
                      title={isVisualizerExpanded ? "Exit TV Mode" : "Expand to TV Mode"}
                    >
                      {isVisualizerExpanded ? (
                        <Minimize2 className="w-3 h-3" />
                      ) : (
                        <Maximize2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Visualizer Canvas Container */}
                <div className={`relative group overflow-hidden rounded-lg ${isVisualizerExpanded ? "flex-1 my-3 flex flex-col min-h-0" : "w-full"}`}>
                  <canvas 
                    ref={canvasRef} 
                    className={`w-full rounded-lg bg-black/40 border border-white/5 transition-all duration-300 cursor-pointer ${
                      isVisualizerExpanded ? "flex-1" : "h-[140px]"
                    }`} 
                    onClick={() => {
                      if (!isVisualizerExpanded) {
                        toggleVisualizerExpanded();
                      }
                    }}
                  />
                  {!isVisualizerExpanded && (
                    <div 
                      onClick={toggleVisualizerExpanded}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer border border-accent-2/20 rounded-lg"
                    >
                      <div className="p-2.5 rounded-full bg-accent-2/20 border border-accent-2/40 text-accent-2 shadow-[0_0_15px_rgba(0,224,203,0.3)] scale-90 group-hover:scale-100 transition-all duration-300">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-accent-2 tracking-widest uppercase font-semibold">
                        Enter TV Theater
                      </span>
                      <span className="text-[8px] font-mono text-text-low">
                        Click to Expand Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress bar / Seeker - Collapsed state only */}
                {!isVisualizerExpanded && (
                  <div className="w-full flex flex-col gap-1 select-none">
                    {/* Seeker Slider track */}
                    <div 
                      onClick={(e) => {
                        if (!currentTrack.isPlayable) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        handleSeek(percent);
                      }}
                      className={`w-full h-1.5 rounded-full bg-white/5 border border-white/10 relative overflow-hidden group ${
                        currentTrack.isPlayable ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div 
                        className={`h-full absolute left-0 top-0 transition-all duration-100 rounded-full ${
                          isFallbackActive ? "bg-accent-1" : "bg-accent-2"
                        }`}
                        style={{ width: `${(currentTime / (simulatedDuration || 1)) * 100}%` }}
                      />
                      <div 
                        className="absolute w-2 h-full top-0 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full"
                        style={{ left: `calc(${(currentTime / (simulatedDuration || 1)) * 100}% - 4px)` }}
                      />
                    </div>
                    
                    {/* Timestamps */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-text-low px-0.5">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(simulatedDuration)}</span>
                    </div>
                  </div>
                )}

                {/* Expanded Full-TV Mode Cohesive Console Panel */}
                {isVisualizerExpanded && (
                  <div className="w-full bg-black/85 border border-white/10 rounded-xl p-4 flex flex-col gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md z-50">
                    
                    {/* Seeker & Timestamps inside the Console Panel */}
                    <div className="w-full flex flex-col gap-1.5 select-none">
                      <div 
                        onClick={(e) => {
                          if (!currentTrack.isPlayable) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const percent = (e.clientX - rect.left) / rect.width;
                          handleSeek(percent);
                        }}
                        className={`w-full h-2 rounded-full bg-white/5 border border-white/10 relative overflow-hidden group ${
                          currentTrack.isPlayable ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                      >
                        <div 
                          className={`h-full absolute left-0 top-0 transition-all duration-100 rounded-full ${
                            isFallbackActive ? "bg-accent-1" : "bg-accent-2"
                          }`}
                          style={{ width: `${(currentTime / (simulatedDuration || 1)) * 100}%` }}
                        />
                        <div 
                          className="absolute w-2.5 h-full top-0 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full"
                          style={{ left: `calc(${(currentTime / (simulatedDuration || 1)) * 100}% - 5px)` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-mono text-text-low px-0.5">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-semibold text-text-hi">
                          {formatTime(currentTime)}
                        </span>
                        
                        {/* Broadcasting title banner */}
                        <div className="flex items-center gap-2 max-w-[50%] md:max-w-[60%] truncate">
                          <span className="w-2 h-2 rounded-full bg-accent-2 animate-ping" />
                          <span className="text-[9px] font-mono tracking-widest text-accent-2 font-bold truncate">
                            BROADCASTING // CH [{currentTrack.title.toUpperCase()}]
                          </span>
                        </div>

                        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-semibold text-text-hi">
                          {formatTime(simulatedDuration)}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Control Row */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-3">
                      
                      {/* Left Block: Audio Source Toggles */}
                      <div className="flex items-center gap-2 select-none">
                        {/* Repeat Mode Toggle */}
                        <button
                          onClick={toggleRepeatMode}
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                            repeatMode !== "none" ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                          }`}
                          title={`Repeat: ${repeatMode.toUpperCase()}`}
                        >
                          <RotateCcw className={`w-5 h-5 ${repeatMode === "one" ? "scale-x-[-1]" : ""}`} />
                          {repeatMode === "one" && <span className="absolute text-[6px] font-mono font-bold mt-[14px]">1</span>}
                        </button>

                        {/* Shuffle Toggle */}
                        <button
                          onClick={toggleShuffle}
                          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                            isShuffle ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                          }`}
                          title={`Shuffle: ${isShuffle ? "ON" : "OFF"}`}
                        >
                          <Shuffle className="w-5 h-5" />
                        </button>

                        {/* Synthesizer Mode Toggle */}
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

                      {/* Center Block: Playback controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePrev}
                          className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                          title="Previous Track"
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
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying && currentTrack.isPlayable ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                        </button>

                        <button
                          onClick={handleNext}
                          className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                          title="Next Track"
                        >
                          <SkipForward className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Right Block: Volume control & Exit button */}
                      <div className="flex items-center gap-2 select-none w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid flex items-center justify-center transition-all"
                            title={isMuted ? "Unmute" : "Mute"}
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
                            className="w-16 md:w-20 accent-accent-2 cursor-pointer bg-white/10 h-1 rounded-full appearance-none outline-none"
                          />
                        </div>
                        <button
                          onClick={toggleVisualizerExpanded}
                          className="ml-3 px-3 py-1.5 text-[9px] font-mono rounded border border-accent-3/20 bg-accent-3/10 text-accent-3 hover:bg-accent-3/20 transition-all uppercase font-semibold"
                        >
                          Exit Theater
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Deck Console / Track Details / Tabbed Music Improvement Suite */}
              {!isVisualizerExpanded && (
                <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-0 overflow-y-auto relative glass-panel">
                  <div className="absolute inset-0 bg-gradient-to-b from-accent-1/2 to-transparent opacity-10 pointer-events-none" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      {/* Disc artwork */}
                      <div className="relative w-16 h-16 flex-shrink-0 select-none">
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

                  {/* Tabbed Suite: Equalizer, Ambient Soundscapes, Custom Uploaders */}
                  <div className="my-4 border border-white/5 rounded-xl bg-black/40 overflow-hidden flex flex-col flex-1 min-h-[120px]">
                    {/* Tab Headers */}
                    <div className="flex border-b border-white/5 bg-black/20 text-[9px] font-mono">
                      <button
                        onClick={() => setActiveConsoleTab("eq")}
                        className={`flex-1 py-3 text-[11px] flex items-center justify-center gap-2 border-r border-white/5 transition-all ${
                          activeConsoleTab === "eq" ? "bg-white/5 text-accent-2 font-bold" : "text-text-low hover:text-text-mid"
                        }`}
                      >
                        <Sliders className="w-4 h-4" />
                        Equalizer
                      </button>
                      <button
                        onClick={() => setActiveConsoleTab("ambient")}
                        className={`flex-1 py-3 text-[11px] flex items-center justify-center gap-2 transition-all ${
                          activeConsoleTab === "ambient" ? "bg-white/5 text-accent-2 font-bold" : "text-text-low hover:text-text-mid"
                        }`}
                      >
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Nature
                      </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="p-3 flex-1 flex flex-col justify-center min-h-[90px]">
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
                  <div className="flex items-center justify-between mt-auto w-full gap-4 flex-shrink-0">
                    {/* Left Column: Toggles (Repeat, Shuffle, Synth Mode) */}
                    <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-start select-none">
                      {/* Repeat Toggle */}
                      <button
                        onClick={toggleRepeatMode}
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                          repeatMode !== "none" ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                        }`}
                        title={`Repeat: ${repeatMode.toUpperCase()}`}
                      >
                        <RotateCcw className={`w-5 h-5 ${repeatMode === "one" ? "scale-x-[-1]" : ""}`} />
                        {repeatMode === "one" && <span className="absolute text-[6px] font-mono font-bold mt-[14px]">1</span>}
                      </button>

                      {/* Shuffle Toggle */}
                      <button
                        onClick={toggleShuffle}
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                          isShuffle ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                        }`}
                        title={`Shuffle: ${isShuffle ? "ON" : "OFF"}`}
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>

                      {/* Synthesizer Mode Toggle */}
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

                    {/* Center Column: Playback Controls (Prev, Play/Pause, Next) */}
                    <div className="flex items-center gap-2 md:gap-3 justify-center flex-shrink-0">
                      {/* Prev */}
                      <button
                        onClick={handlePrev}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                        title="Previous Track"
                      >
                        <SkipBack className="w-6 h-6" />
                      </button>

                      {/* Play/Pause */}
                      <button
                        onClick={togglePlay}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                          isPlaying && currentTrack.isPlayable
                             ? "bg-accent-2 text-black hover:bg-accent-2/80 shadow-[0_0_15px_rgba(0,224,203,0.4)]"
                             : "bg-accent-1 text-text-hi hover:bg-accent-1/80 shadow-[0_0_15px_rgba(110,86,255,0.4)]"
                        }`}
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying && currentTrack.isPlayable ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                      </button>

                      {/* Next */}
                      <button
                        onClick={handleNext}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                        title="Next Track"
                      >
                        <SkipForward className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Right Column: Volume Block */}
                    <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-end select-none">
                      <button
                        onClick={toggleMute}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid flex items-center justify-center transition-all"
                        title={isMuted ? "Unmute" : "Mute"}
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
                        className="w-16 md:w-20 accent-accent-2 cursor-pointer bg-white/10 h-1 rounded-full appearance-none outline-none"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Column: Track Search and Playlist Library */}
            {!isVisualizerExpanded && (
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
                            const idx = tracks.findIndex((t) => t.id === track.id);
                            handleTrackSelect(idx, { autoplay: true });
                          }}
                          aria-current={isTrackPlaying ? "true" : undefined}
                          className={`w-full text-left p-2 rounded-lg border transition-all duration-300 flex items-center justify-between gap-3 group relative overflow-hidden ${
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
                                <Music className="w-5 h-5 text-accent-2 animate-bounce" />
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

                {/* Console log footer (retro style log) */}
                <div className="h-[100px] bg-black/75 border border-white/5 rounded-xl p-2.5 font-mono text-[8.5px] text-accent-2 overflow-y-auto flex flex-col-reverse gap-0.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] flex-shrink-0">
                  {logs.length > 0 ? (
                    logs.map((log, i) => <div key={i} className="truncate select-none leading-relaxed">{log}</div>)
                  ) : (
                    <div className="text-text-faint select-none animate-pulse">TERMINAL LOG ACTIVE (IDLE)</div>
                  )}
                  <div className="text-text-low border-b border-white/5 pb-1 mb-1 select-none flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-text-low" />
                    <span>DECODER LOG SUMMARY</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </TvFrame>
    </>
  );
}
