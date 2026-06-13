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
  Terminal,
  Activity,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface Track {
  id: number;
  title: string;
  duration: string;
  isPlayable: boolean;
  src?: string;
  description: string;
  tempo?: string;
  key?: string;
}

const TRACKS: Track[] = [
  { id: 1, title: "Quantum Drift", duration: "05:14", isPlayable: true, src: "/audio/ambient-1.mp3", description: "Lush resonant pads with shifting lowpass filters for deep focus.", tempo: "60 BPM", key: "C Minor" },
  { id: 2, title: "Neon Horizon", duration: "04:32", isPlayable: true, src: "/audio/ambient-2.mp3", description: "Detuned analog waves drifting over a gentle sub-harmonic pulse.", tempo: "64 BPM", key: "D Major" },
  { id: 3, title: "Subharmonic Resonance", duration: "06:08", isPlayable: true, src: "/audio/ambient-3.mp3", description: "Deep frequency vibrations designed to align brainwaves for coding.", tempo: "55 BPM", key: "Eb Minor" },
  { id: 4, title: "Silicon Rain", duration: "04:55", isPlayable: true, src: "/audio/ambient-4.mp3", description: "Soft procedural rain noise overlaid with crystalline bell chords.", tempo: "70 BPM", key: "F Major" },
  { id: 5, title: "Hyperdrive Terminal", duration: "05:40", isPlayable: true, src: "/audio/ambient-5.mp3", description: "Atmospheric interstellar drones and slow-decay feedback echo space pads.", tempo: "58 BPM", key: "Ab Minor" },
  { id: 6, title: "Ethernet Dream", duration: "04:12", isPlayable: false, description: "A vintage lofi ambient track with simulated tape flutter.", tempo: "Offline", key: "N/A" },
  { id: 7, title: "Baud Rate Lullaby", duration: "03:45", isPlayable: false, description: "Minimalist modular synthesizer loops reminiscent of early computing.", tempo: "Offline", key: "N/A" },
  { id: 8, title: "Binary Snowfall", duration: "05:22", isPlayable: false, description: "Delicate chime arrangements resembling random falling code particles.", tempo: "Offline", key: "N/A" },
  { id: 9, title: "Cybernetic Dusk", duration: "06:15", isPlayable: false, description: "Dark, cinematic drones for late-night compiler sessions.", tempo: "Offline", key: "N/A" },
  { id: 10, title: "Magnetic Tape Pulse", duration: "04:48", isPlayable: false, description: "Warm saturation and slowly undulating magnetic tape harmonics.", tempo: "Offline", key: "N/A" },
  { id: 11, title: "Analog Void", duration: "07:30", isPlayable: false, description: "Pure sine waves and white noise sweeps that clear room resonance.", tempo: "Offline", key: "N/A" },
  { id: 12, title: "Cold Boot Sequence", duration: "03:10", isPlayable: false, description: "Slowly rising frequencies reflecting the startup of an AI engine.", tempo: "Offline", key: "N/A" },
  { id: 13, title: "Mainframe Ambient", duration: "05:50", isPlayable: false, description: "Steady humming drone mimicking a well-cooled server room.", tempo: "Offline", key: "N/A" },
  { id: 14, title: "Thermal Dissipation", duration: "04:25", isPlayable: false, description: "Cooling sweeps and static discharge clicks in a wide stereo field.", tempo: "Offline", key: "N/A" },
  { id: 15, title: "Solar Wind Drift", duration: "06:40", isPlayable: false, description: "Spacious synthesizer sweeps evoking empty orbits and solar radiation.", tempo: "Offline", key: "N/A" },
  { id: 16, title: "Suborbital Glide", duration: "05:05", isPlayable: false, description: "Gliding string pads that feel light, floating, and zero-gravity.", tempo: "Offline", key: "N/A" },
  { id: 17, title: "Crystalline Grid", duration: "04:50", isPlayable: false, description: "Pure, high-frequency tones structured in geometric arpeggiation.", tempo: "Offline", key: "N/A" },
  { id: 18, title: "Zero State", duration: "03:55", isPlayable: false, description: "Completely flat, grounding base pads for meditative rest periods.", tempo: "Offline", key: "N/A" },
  { id: 19, title: "Ionized Atmosphere", duration: "05:35", isPlayable: false, description: "Crackling charges and sweeping bandpass noise for organic texture.", tempo: "Offline", key: "N/A" },
  { id: 20, title: "Dark Matter Wave", duration: "06:20", isPlayable: false, description: "Extremely low frequency rumble with random sub-bass drops.", tempo: "Offline", key: "N/A" },
];

export default function MusicPage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSynthOnly, setIsSynthOnly] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulatedDuration, setSimulatedDuration] = useState(314); // in seconds
  const [logs, setLogs] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("all");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Synthesizer Oscillators and Nodes
  const synthGainRef = useRef<GainNode | null>(null);
  const synthFilterRef = useRef<BiquadFilterNode | null>(null);
  const droneOscsRef = useRef<OscillatorNode[]>([]);
  const bellIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`,
      ...prev.slice(0, 15),
    ]);
  }, []);

  const currentTrack = TRACKS[currentTrackIndex];

  // Map track keys to synthesizers base frequencies
  const getTrackFrequency = useCallback((trackId: number): number => {
    switch (trackId) {
      case 1: return 130.81; // C3 (Quantum Drift)
      case 2: return 146.83; // D3 (Neon Horizon)
      case 3: return 155.56; // Eb3 (Subharmonic Resonance)
      case 4: return 174.61; // F3 (Silicon Rain)
      case 5: return 207.65; // Ab3 (Hyperdrive Terminal)
      default: return 130.81; // C3
    }
  }, []);

  // Parse duration string MM:SS into seconds
  const parseDuration = useCallback((durStr: string): number => {
    const parts = durStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 300;
  }, []);

  // Initialize Web Audio API
  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    try {
      const AudioCtx = window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        addLog("SYS: Web Audio API not supported in this browser.");
        return null;
      }

      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      addLog("SYS: Web Audio Context initialized.");

      // Setup HTML5 Audio element source routing
      if (audioRef.current && !audioSourceRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        audioSourceRef.current = source;
        addLog("SYS: Audio tag linked to Analyser Node.");
      }

      return ctx;
    } catch (e) {
      addLog("ERR: Failed to initialize Audio Context.");
      console.error(e);
      return null;
    }
  }, [addLog]);

  // Clean up procedural synthesizer nodes
  const stopProceduralSynth = useCallback(() => {
    // Fade out drone oscillator gain first
    if (synthGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      synthGainRef.current.gain.cancelScheduledValues(now);
      synthGainRef.current.gain.setValueAtTime(synthGainRef.current.gain.value, now);
      synthGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }

    // Clear sequencer
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }

    // Stop oscillators after fadeout
    const oscs = [...droneOscsRef.current];
    droneOscsRef.current = [];
    setTimeout(() => {
      oscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
    }, 900);
  }, []);

  // Play procedural ambient synth tones
  const startProceduralSynth = useCallback((trackIndex: number) => {
    const ctx = initAudioContext();
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    stopProceduralSynth();

    const now = ctx.currentTime;
    const baseFreq = getTrackFrequency(TRACKS[trackIndex].id);
    addLog(`SYNTH: Starting synth tone generator (Base: ${baseFreq.toFixed(1)}Hz).`);

    // 1. Create Synth Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.25, now + 2.0); // Soft fade-in
    masterGain.connect(analyser);
    synthGainRef.current = masterGain;

    // 2. Create Bandpass/Lowpass Filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(2.0, now);
    filter.connect(masterGain);
    synthFilterRef.current = filter;

    // 3. Create detuned oscillators for fat analog chorus sound
    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.detune.setValueAtTime(-10, now); // Detune left

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Perfect Fifth
    osc2.detune.setValueAtTime(10, now); // Detune right

    const osc3 = ctx.createOscillator();
    osc3.type = "sawtooth";
    osc3.frequency.setValueAtTime(baseFreq * 0.5, now); // Sub-octave base drone
    osc3.detune.setValueAtTime(0, now);

    // Create sub gain to mix saw wave quietly
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.12, now);
    osc3.connect(subGain);

    osc1.connect(filter);
    osc2.connect(filter);
    subGain.connect(filter);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    droneOscsRef.current = [osc1, osc2, osc3];

    // 4. Create LFO to modulate filter cutoff (creates organic wave/breathing)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.06, now); // Very slow sweep (16s cycle)
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now); // cut-off variation range

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    droneOscsRef.current.push(lfo);

    // 5. Pentatonic bell tones generator (sequencer)
    // Scale: root, minor 3rd (or major 3rd depending on key), 4th, 5th, minor 7th
    const track = TRACKS[trackIndex];
    const isMinor = track.key?.toLowerCase().includes("minor");
    const intervalMap = isMinor ? [1, 1.2, 1.33, 1.5, 1.8] : [1, 1.125, 1.25, 1.5, 1.66]; // minor vs major steps

    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.4, now);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.45, now); // Echo decay rate

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    const playBell = () => {
      if (!synthGainRef.current) return;
      const bellNow = ctx.currentTime;
      const randomInterval = intervalMap[Math.floor(Math.random() * intervalMap.length)];
      const bellFreq = baseFreq * 4.0 * randomInterval; // Shift up two octaves

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(bellFreq, bellNow);

      gain.gain.setValueAtTime(0, bellNow);
      gain.gain.linearRampToValueAtTime(0.06, bellNow + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, bellNow + 2.5); // long decay

      osc.connect(gain);
      gain.connect(masterGain); // Direct dry signal
      gain.connect(delay); // Route to echo delay

      osc.start(bellNow);
      osc.stop(bellNow + 3.0);
    };

    // Trigger initial bell after 1 second, then run interval
    setTimeout(() => {
      if (isPlaying) playBell();
    }, 1000);

    bellIntervalRef.current = setInterval(() => {
      playBell();
    }, 4500 + Math.random() * 3000); // Randomized timing to prevent repetitive loops

  }, [initAudioContext, stopProceduralSynth, getTrackFrequency, volume, addLog, isPlaying]);

  // Triggers static buzz noise burst when selecting offline database entries
  const playOfflineBuzz = useCallback(() => {
    const ctx = initAudioContext();
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    addLog("SYS: Attempting handshake with archived core...");
    const now = ctx.currentTime;

    // 1. Noise Generator (Handshake static)
    const bufferSize = ctx.sampleRate * 0.4; // 400ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);
    filter.Q.setValueAtTime(5.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(analyser);

    // 2. Beep (Terminal fail chime)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(250, now + 0.12);

    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(analyser);

    noiseSource.start(now);
    osc.start(now);
    osc.stop(now + 0.4);

    setTimeout(() => {
      addLog("ERR: Connection rejected. Channel archived (Offline).");
    }, 200);
  }, [initAudioContext, addLog]);

  // Core Play/Pause execution
  const togglePlay = useCallback(async () => {
    initAudioContext();

    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      addLog("SYS: Playback paused.");

      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopProceduralSynth();
    } else {
      // Play
      if (!currentTrack.isPlayable) {
        playOfflineBuzz();
        return;
      }

      setIsPlaying(true);
      setSimulatedDuration(parseDuration(currentTrack.duration));

      if (isSynthOnly) {
        setIsFallbackActive(true);
        startProceduralSynth(currentTrackIndex);
      } else {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : volume;
          try {
            addLog(`SYS: Stream loading on channel [${currentTrack.title}]...`);
            setIsFallbackActive(false);
            await audioRef.current.play();
            addLog(`SYS: Streaming audio active.`);
          } catch {
            // Stream loading failed (e.g. file missing), fallback to Synth
            addLog("WARN: Stream unavailable. Activating synthesis generator.");
            setIsFallbackActive(true);
            startProceduralSynth(currentTrackIndex);
          }
        }
      }
    }
  }, [
    isPlaying,
    currentTrack,
    currentTrackIndex,
    isSynthOnly,
    volume,
    isMuted,
    parseDuration,
    initAudioContext,
    startProceduralSynth,
    stopProceduralSynth,
    playOfflineBuzz,
    addLog,
  ]);

  // Handle track changing
  const handleTrackSelect = useCallback((index: number, options?: { autoplay?: boolean }) => {
    const track = TRACKS[index];
    const shouldPlay = isPlaying || options?.autoplay;

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setSimulatedDuration(parseDuration(track.duration));

    if (!track.isPlayable) {
      // Pause current playback if moving to an unplayable track
      if (isPlaying) {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        stopProceduralSynth();
      }
      playOfflineBuzz();
      return;
    }

    addLog(`SYS: Selected channel [${track.title}]`);

    if (shouldPlay) {
      // Start or restart playback on the selected active track
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopProceduralSynth();

      setTimeout(() => {
        if (isSynthOnly) {
          setIsFallbackActive(true);
          startProceduralSynth(index);
        } else {
          setIsFallbackActive(false);
          if (audioRef.current) {
            audioRef.current.src = track.src || "";
            audioRef.current.volume = isMuted ? 0 : volume;
            audioRef.current.load();
            audioRef.current.play().catch(() => {
              addLog("WARN: Stream failed. Initializing synthesizer fallback.");
              setIsFallbackActive(true);
              startProceduralSynth(index);
            });
          }
        }
      }, 50);
    } else {
      // Just load the source if paused
      setIsFallbackActive(false);
      if (audioRef.current) {
        audioRef.current.src = track.src || "";
        audioRef.current.load();
      }
    }
  }, [
    isPlaying,
    isSynthOnly,
    isMuted,
    volume,
    parseDuration,
    startProceduralSynth,
    stopProceduralSynth,
    playOfflineBuzz,
    addLog,
  ]);

  // Adjust volume
  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    const audioVol = isMuted ? 0 : val;
    if (audioRef.current) {
      audioRef.current.volume = audioVol;
    }

    // Apply to running synth drone master gain
    if (synthGainRef.current && audioContextRef.current) {
      synthGainRef.current.gain.setValueAtTime(audioVol * 0.25, audioContextRef.current.currentTime);
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    const targetVol = newMute ? 0 : volume;

    if (audioRef.current) {
      audioRef.current.volume = targetVol;
    }

    if (synthGainRef.current && audioContextRef.current) {
      synthGainRef.current.gain.setValueAtTime(targetVol * 0.25, audioContextRef.current.currentTime);
    }

    addLog(newMute ? "SYS: Volume muted." : "SYS: Volume unmuted.");
  }, [isMuted, volume, addLog]);

  // Previous and Next triggers
  const handleNext = useCallback(() => {
    let nextIndex = currentTrackIndex;
    // Find next playable track or wrap
    for (let i = 1; i <= TRACKS.length; i++) {
      const idx = (currentTrackIndex + i) % TRACKS.length;
      if (TRACKS[idx].isPlayable) {
        nextIndex = idx;
        break;
      }
    }
    handleTrackSelect(nextIndex);
  }, [currentTrackIndex, handleTrackSelect]);

  const handlePrev = useCallback(() => {
    let prevIndex = currentTrackIndex;
    // Find previous playable track or wrap
    for (let i = 1; i <= TRACKS.length; i++) {
      const idx = (currentTrackIndex - i + TRACKS.length) % TRACKS.length;
      if (TRACKS[idx].isPlayable) {
        prevIndex = idx;
        break;
      }
    }
    handleTrackSelect(prevIndex);
  }, [currentTrackIndex, handleTrackSelect]);

  // Force synth-only mode switch
  const handleSynthToggle = useCallback(() => {
    const nextSynthMode = !isSynthOnly;
    setIsSynthOnly(nextSynthMode);
    addLog(`SYS: Force Synthesizer Mode [${nextSynthMode ? "ON" : "OFF (AUTO)"}].`);

    if (isPlaying) {
      if (nextSynthMode) {
        if (audioRef.current) audioRef.current.pause();
        setIsFallbackActive(true);
        startProceduralSynth(currentTrackIndex);
      } else {
        stopProceduralSynth();
        setIsFallbackActive(false);
        if (audioRef.current) {
          audioRef.current.src = currentTrack.src || "";
          audioRef.current.load();
          audioRef.current.play().catch(() => {
            setIsFallbackActive(true);
            startProceduralSynth(currentTrackIndex);
          });
        }
      }
    }
  }, [isSynthOnly, isPlaying, currentTrackIndex, currentTrack, startProceduralSynth, stopProceduralSynth, addLog]);

  // Sync seek state
  const handleSeek = useCallback((percent: number) => {
    const targetTime = percent * simulatedDuration;
    setCurrentTime(targetTime);
    if (audioRef.current && !isFallbackActive) {
      audioRef.current.currentTime = targetTime;
    }
    addLog(`SYS: Seeked to ${Math.floor(targetTime / 60)}:${String(Math.floor(targetTime % 60)).padStart(2, "0")}`);
  }, [simulatedDuration, isFallbackActive, addLog]);

  // Run progress timer ticks
  useEffect(() => {
    if (isPlaying) {
      if (isFallbackActive) {
        // Synthesizer timer simulation
        progressInterval.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= simulatedDuration) {
              if (repeatMode === "one") {
                return 0;
              } else {
                handleNext();
                return 0;
              }
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Stream progress sync
        progressInterval.current = setInterval(() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.ended) {
              if (repeatMode === "one") {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
              } else {
                handleNext();
              }
            }
          }
        }, 250);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, isFallbackActive, simulatedDuration, repeatMode, handleNext]);

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
      const analyser = analyserRef.current;

      // Draw trailing fade background
      ctx2d.fillStyle = "rgba(6, 7, 13, 0.22)";
      ctx2d.fillRect(0, 0, width, height);

      // Draw glowing background grid
      ctx2d.strokeStyle = "rgba(255, 255, 255, 0.015)";
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
        analyser.getByteFrequencyData(dataArray);

        // 1. Draw glowing vertical mirror frequencies
        const barWidth = (width / 32) - 3;
        let x = 0;

        for (let i = 0; i < 32; i++) {
          const percent = dataArray[i] / 255;
          const barHeight = percent * (height - 30);
          
          // Generate a smooth neon purple to teal gradient
          const gradient = ctx2d.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, "rgba(110, 86, 255, 0.2)");
          gradient.addColorStop(0.5, "rgba(110, 86, 255, 0.8)");
          gradient.addColorStop(1, "rgba(0, 224, 203, 1)");

          ctx2d.fillStyle = gradient;
          ctx2d.shadowBlur = 8;
          ctx2d.shadowColor = "rgba(0, 224, 203, 0.5)";

          // Symmetrical outer render
          ctx2d.fillRect(width / 2 + x, height - barHeight - 10, barWidth, barHeight);
          ctx2d.fillRect(width / 2 - x - barWidth, height - barHeight - 10, barWidth, barHeight);

          x += barWidth + 3;
        }

        // 2. Draw central overlay oscilloscope waveform
        const timeArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(timeArray);

        ctx2d.beginPath();
        ctx2d.strokeStyle = "rgba(0, 224, 203, 0.8)";
        ctx2d.lineWidth = 2;
        ctx2d.shadowBlur = 12;
        ctx2d.shadowColor = "rgba(0, 224, 203, 0.6)";

        const sliceWidth = width / bufferLength;
        let tx = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeArray[i] / 128.0;
          const ty = (v * height) / 2;

          if (i === 0) {
            ctx2d.moveTo(tx, ty);
          } else {
            ctx2d.lineTo(tx, ty);
          }

          tx += sliceWidth;
        }
        ctx2d.lineTo(width, height / 2);
        ctx2d.stroke();

      } else {
        // Draw flat idling noise line when paused
        ctx2d.beginPath();
        ctx2d.strokeStyle = "rgba(110, 86, 255, 0.4)";
        ctx2d.lineWidth = 1.5;
        ctx2d.shadowBlur = 4;
        ctx2d.shadowColor = "rgba(110, 86, 255, 0.3)";
        ctx2d.moveTo(0, height / 2);

        // Add a micro-wobble to look live/idle
        const time = Date.now() * 0.003;
        for (let ix = 0; ix < width; ix += 5) {
          const wobble = Math.sin(ix * 0.05 + time) * 1.5;
          ctx2d.lineTo(ix, height / 2 + wobble);
        }
        ctx2d.stroke();
      }

      // Reset shadows
      ctx2d.shadowBlur = 0;
    };

    draw();

    return () => {
      cancelAnimationFrame(localFrameId);
    };
  }, [isPlaying]);

  // Resize canvas bounds
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 140;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync starting audio tags
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[0].src || "";
      audioRef.current.load();
    }
    queueMicrotask(() => addLog("SYS: Ambient Stream Decoders Ready."));
    return () => {
      stopProceduralSynth();
    };
  }, [stopProceduralSynth, addLog]);

  // Filter track library items
  const filteredTracks = TRACKS.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <>
      <SiteBackground />
      <TvFrame>
        {/* Hidden Audio Tag */}
        <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />

        <div className="w-full h-full flex flex-col p-4 md:p-6 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-1/10 border border-accent-1/30 flex items-center justify-center text-accent-1 shadow-[0_0_12px_rgba(110,86,255,0.2)]">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <Eyebrow className="mb-0">YANTRACORE // LABS</Eyebrow>
                <h1 className="text-sm font-semibold tracking-wider font-mono text-text-hi uppercase">
                  NEO Ambient Console
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

          {/* Main workspace splits to left console, right sidebar */}
          <div className="flex-1 w-full flex flex-col md:flex-row gap-5 min-h-0 overflow-hidden">
            
            {/* Left Column: Player Console */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              
              {/* Retro Audio Visualizer Screen */}
              <div className="bg-black/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden flex-shrink-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                <div className="absolute top-2.5 left-3 z-10 flex items-center gap-1.5 select-none pointer-events-none">
                  <Activity className="w-3.5 h-3.5 text-accent-2" />
                  <span className="text-[9px] font-mono text-text-low uppercase tracking-wider">Waveform / Freq Spectrum</span>
                </div>
                
                {/* Visualizer Canvas */}
                <canvas ref={canvasRef} className="w-full h-[140px] rounded-lg bg-black/40 border border-white/5" />
              </div>

              {/* Deck Console / Track Details */}
              <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-0 overflow-y-auto relative glass-panel">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-1/2 to-transparent opacity-10 pointer-events-none" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    {/* Glowing rotating CD disc artwork */}
                    <div className="relative w-20 h-20 flex-shrink-0 select-none">
                      <div className={`w-full h-full rounded-full border border-white/10 bg-zinc-950 flex items-center justify-center shadow-2xl relative overflow-hidden ${isPlaying && currentTrack.isPlayable ? "animate-[spin_10s_linear_infinite]" : ""}`}>
                        {/* Vinyl ridges pattern */}
                        <div className="absolute inset-2 rounded-full border border-dashed border-white/5" />
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                        <div className="absolute inset-6 rounded-full border border-dashed border-white/10" />
                        {/* Center spindle */}
                        <div className="w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center relative z-10 shadow-lg">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent-1 shadow-[0_0_8px_var(--accent-1)]" />
                        </div>
                        {/* Reflected neon ray */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                      </div>
                      <div className={`absolute -inset-1.5 rounded-full border border-accent-2/10 pointer-events-none ${isPlaying && currentTrack.isPlayable ? "animate-pulse" : ""}`} />
                    </div>

                    <div>
                      <span className="text-[8.5px] font-mono text-accent-1 uppercase tracking-widest font-semibold block mb-0.5">
                        {currentTrack.isPlayable ? `Channel ${currentTrack.id}` : "Database Record"}
                      </span>
                      <h2 className="text-base font-bold font-mono text-text-hi leading-tight tracking-wide mb-1">
                        {currentTrack.title}
                      </h2>
                      <p className="text-[10px] text-text-low line-clamp-2 leading-relaxed max-w-sm mb-1.5">
                        {currentTrack.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentTrack.tempo && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-text-mid">
                            Tempo: {currentTrack.tempo}
                          </span>
                        )}
                        {currentTrack.key && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-text-mid">
                            Key: {currentTrack.key}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mode Config Sliders icon */}
                  <button 
                    onClick={handleSynthToggle}
                    className={`p-1.5 rounded-lg border transition-all ${isSynthOnly ? "bg-accent-1/10 border-accent-1 text-accent-1" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"}`}
                    title="Toggle Synthesizer-Only Mode"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar / Seeking */}
                <div className="my-4">
                  <div className="flex justify-between items-center text-[9px] font-mono text-text-low mb-1.5 select-none">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-text-faint">{"//"}</span>
                    <span>{formatTime(simulatedDuration)}</span>
                  </div>
                  
                  {/* Track slider */}
                  <div 
                    onClick={(e) => {
                      if (!currentTrack.isPlayable) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleSeek(percent);
                    }}
                    className={`w-full h-1.5 rounded-full bg-white/5 border border-white/5 relative overflow-hidden group ${currentTrack.isPlayable ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    <div 
                      className={`h-full absolute left-0 top-0 transition-all duration-100 rounded-full ${isFallbackActive ? "bg-accent-1" : "bg-accent-2"}`}
                      style={{ width: `${(currentTime / (simulatedDuration || 1)) * 100}%` }}
                    />
                    <div 
                      className="absolute w-2 h-full top-0 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full"
                      style={{ left: `calc(${(currentTime / (simulatedDuration || 1)) * 100}% - 4px)` }}
                    />
                  </div>
                </div>

                {/* Bezel Controls */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    {/* Prev */}
                    <button
                      onClick={handlePrev}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                      title="Previous Track"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPlaying && currentTrack.isPlayable
                          ? "bg-accent-2 text-black hover:bg-accent-2/80 shadow-[0_0_15px_rgba(0,224,203,0.4)]"
                          : "bg-accent-1 text-text-hi hover:bg-accent-1/80 shadow-[0_0_15px_rgba(110,86,255,0.4)]"
                      }`}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying && currentTrack.isPlayable ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    {/* Next */}
                    <button
                      onClick={handleNext}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid hover:text-text-hi flex items-center justify-center transition-all"
                      title="Next Track"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Repeat Toggle */}
                    <button
                      onClick={() => {
                        setRepeatMode((prev) => (prev === "none" ? "all" : prev === "all" ? "one" : "none"));
                        addLog(`SYS: Repeat Mode changed.`);
                      }}
                      className={`ml-1 w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
                        repeatMode !== "none" ? "bg-white/10 border-white/20 text-accent-2" : "bg-white/5 border-white/5 text-text-low hover:text-text-mid"
                      }`}
                      title={`Repeat: ${repeatMode.toUpperCase()}`}
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${repeatMode === "one" ? "scale-x-[-1]" : ""}`} />
                      {repeatMode === "one" && <span className="absolute text-[6px] font-mono font-bold mt-[10px]">1</span>}
                    </button>
                  </div>

                  {/* Volume Slider Block */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-text-mid flex items-center justify-center transition-all"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-accent-3" /> : <Volume2 className="w-4 h-4" />}
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

            </div>

            {/* Right Column: Track Search and Playlist Library */}
            <div className="w-full md:w-[340px] lg:w-[380px] xl:w-[420px] flex flex-col gap-3 min-h-0">
              
              {/* Search Box */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex-shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-low pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search channels..."
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
                <div className="flex justify-between items-center mb-2 px-1 select-none flex-shrink-0">
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
                          const idx = TRACKS.findIndex((t) => t.id === track.id);
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
                          <div className="w-6 h-6 rounded bg-black/40 border border-white/5 flex items-center justify-center flex-shrink-0 text-[10px] font-mono text-text-low select-none">
                            {isTrackPlaying ? (
                              <Music className="w-3.5 h-3.5 text-accent-2 animate-bounce" />
                            ) : (
                              String(track.id).padStart(2, "0")
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className={`text-xs font-semibold font-mono block truncate leading-snug group-hover:text-text-hi transition-colors ${isTrackPlaying ? "text-accent-2" : "text-text-hi"}`}>
                              {track.title}
                            </span>
                            <span className={`text-[8.5px] font-mono tracking-wider font-semibold uppercase px-1 rounded inline-block mt-0.5 select-none ${
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

                        <span className="text-[9px] font-mono text-text-low group-hover:text-text-mid transition-colors flex-shrink-0 select-none">
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

          </div>
        </div>
      </TvFrame>
    </>
  );
}
