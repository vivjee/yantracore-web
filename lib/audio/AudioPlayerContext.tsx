"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

export interface Track {
  id: number;
  title: string;
  duration: string;
  isPlayable: boolean;
  src?: string;
  description: string;
  tempo?: string;
  key?: string;
}

// `duration` is the displayed track length (m:ss). For the bundled files these
// are baked from the actual audio (measured once with ffprobe) so the library
// shows real lengths and the seek bar is correct before playback — no metadata
// fetch needed. The `loadedmetadata` handler still refines to the exact value
// on play. When the backend owns the catalogue this field comes from the API.
export const TRACKS: Track[] = [
  { id: 1, title: "Deep Work Lounge", duration: "3:03", isPlayable: true, src: "/music/deep-work-lounge.mp3", description: "Ambient downtempo lofi music for deep work and relaxation.", tempo: "65 BPM", key: "C Minor" },
  { id: 2, title: "Meadow Sleepwalk", duration: "3:06", isPlayable: true, src: "/music/meadow-sleepwalk.mp3", description: "Ethereal ambient chillout soundscape with gentle downtempo grooves.", tempo: "72 BPM", key: "D Major" },
  { id: 3, title: "Island Drift", duration: "2:39", isPlayable: true, src: "/music/island-drift.mp3", description: "Sun-soaked lounge groove drifting on breezy, tropical textures.", tempo: "70 BPM", key: "A Major" },
  { id: 4, title: "Mango Moon", duration: "3:19", isPlayable: true, src: "/music/mango-moon.mp3", description: "Warm nocturnal chillout with mellow, fruit-ripe synth pads.", tempo: "68 BPM", key: "F Major" },
  { id: 5, title: "Sunlit Strings", duration: "2:40", isPlayable: true, src: "/music/sunlit-strings.mp3", description: "Golden-hour ambient piece carried by soft, sunlit strings.", tempo: "60 BPM", key: "G Major" },
];

/** "m:ss" → seconds (300s fallback). Module-level so it can seed initial state. */
const clockToSecs = (durStr: string): number => {
  const parts = durStr.split(":");
  if (parts.length === 2) return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  return 300;
};

export interface AudioPlayerContextType {
  currentTrackIndex: number;
  currentTrack: Track;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isSynthOnly: boolean;
  isFallbackActive: boolean;
  currentTime: number;
  simulatedDuration: number;
  logs: string[];
  repeatMode: "none" | "one" | "all";
  isShuffle: boolean;
  tracks: Track[];
  analyser: AnalyserNode | null;
  togglePlay: () => Promise<void>;
  handleTrackSelect: (index: number, options?: { autoplay?: boolean }) => void;
  handleVolumeChange: (volume: number) => void;
  toggleMute: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSynthToggle: () => void;
  handleSeek: (percent: number) => void;
  toggleRepeatMode: () => void;
  toggleShuffle: () => void;
  addLog: (msg: string) => void;
  // EQ Control properties
  eqBass: number;
  setEqBass: (val: number) => void;
  eqMid: number;
  setEqMid: (val: number) => void;
  eqTreble: number;
  setEqTreble: (val: number) => void;
  // Echo effect
  echoVol: number;
  setEchoVol: (val: number) => void;
  // Ambient layers volume
  rainVol: number;
  setRainVol: (val: number) => void;
  windVol: number;
  setWindVol: (val: number) => void;
  humVol: number;
  setHumVol: (val: number) => void;
  // Custom Audio Load functions
  addCustomTrack: (track: Track) => void;
  setTrackDuration: (trackId: number, durationStr: string) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isSynthOnly, setIsSynthOnly] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulatedDuration, setSimulatedDuration] = useState(() => clockToSecs(TRACKS[0].duration));
  const [logs, setLogs] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("all");
  const [isShuffle, setIsShuffle] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // EQ states
  const [eqBass, setEqBass] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqTreble, setEqTreble] = useState(0);

  // Echo state
  const [echoVol, setEchoVol] = useState(0);

  // Ambient layer states
  const [rainVol, setRainVol] = useState(0);
  const [windVol, setWindVol] = useState(0);
  const [humVol, setHumVol] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // EQ filter refs
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);

  // Echo node ref
  const echoGainRef = useRef<GainNode | null>(null);

  // Ambient nodes refs
  const rainGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);
  const ambientSourcesRef = useRef<any[]>([]);

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

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || TRACKS[0];

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
    if (durStr === "Stream" || durStr === "00:00") return 300;
    return clockToSecs(durStr);
  }, []);

  // Add custom track
  const addCustomTrack = useCallback((track: Track) => {
    setPlaylist((prev) => [...prev, track]);
    addLog(`SYS: Loaded custom channel [${track.title}]`);
  }, [addLog]);

  // Set track duration dynamically
  const setTrackDuration = useCallback((trackId: number, durationStr: string) => {
    setPlaylist((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, duration: durationStr } : t))
    );
  }, []);

  // Initialize Web Audio API with EQ and Ambient noise generators
  const initAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (audioContextRef.current) return audioContextRef.current;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        addLog("SYS: Web Audio API not supported in this browser.");
        return null;
      }

      const ctx = new AudioCtx();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 256;

      // 3-Band Parametric EQ Filters
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = "lowshelf";
      lowFilter.frequency.setValueAtTime(320, ctx.currentTime);
      lowFilter.gain.setValueAtTime(eqBass, ctx.currentTime);

      const midFilter = ctx.createBiquadFilter();
      midFilter.type = "peaking";
      midFilter.frequency.setValueAtTime(1000, ctx.currentTime);
      midFilter.Q.setValueAtTime(1.0, ctx.currentTime);
      midFilter.gain.setValueAtTime(eqMid, ctx.currentTime);

      const highFilter = ctx.createBiquadFilter();
      highFilter.type = "highshelf";
      highFilter.frequency.setValueAtTime(3200, ctx.currentTime);
      highFilter.gain.setValueAtTime(eqTreble, ctx.currentTime);

      // Connect: Analyser -> Low shelf -> Peaking -> High shelf -> Destination
      analyserNode.connect(lowFilter);
      lowFilter.connect(midFilter);
      midFilter.connect(highFilter);

      // Echo Effect Nodes
      const echoDelay = ctx.createDelay();
      echoDelay.delayTime.setValueAtTime(0.4, ctx.currentTime);
      const echoFeedback = ctx.createGain();
      echoFeedback.gain.setValueAtTime(0.4, ctx.currentTime);
      const echoGain = ctx.createGain();
      echoGain.gain.setValueAtTime(echoVol, ctx.currentTime);

      // Split highFilter output to destination and echo loop
      highFilter.connect(ctx.destination);
      highFilter.connect(echoDelay);
      echoDelay.connect(echoFeedback);
      echoFeedback.connect(echoDelay);
      echoDelay.connect(echoGain);
      echoGain.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyserNode;
      lowFilterRef.current = lowFilter;
      midFilterRef.current = midFilter;
      highFilterRef.current = highFilter;
      echoGainRef.current = echoGain;
      setAnalyser(analyserNode);

      addLog("SYS: Audio Engine and 3-Band EQ initialized.");

      // Setup HTML5 Audio element source routing
      if (audioRef.current && !audioSourceRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyserNode);
        audioSourceRef.current = source;
        addLog("SYS: Audio tag linked to Analyser Node.");
      }

      // ── Procedural Ambient ("Remix") Layers ───────────────────────────
      // Colored-noise generator. "pink" rolls off ~3 dB/oct (natural, the
      // basis for rain); "brown" rolls off ~6 dB/oct (deep, airy — the basis
      // for wind). Longer buffers make the loop seam far less perceptible
      // than the old 3 s white-noise loop.
      const createNoiseBuffer = (
        c: AudioContext,
        secs: number,
        color: "white" | "pink" | "brown",
      ) => {
        const bufferSize = Math.floor(c.sampleRate * secs);
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);

        if (color === "pink") {
          // Paul Kellet's economical pink-noise filter.
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + w * 0.0555179;
            b1 = 0.99332 * b1 + w * 0.0750759;
            b2 = 0.969 * b2 + w * 0.153852;
            b3 = 0.8665 * b3 + w * 0.3104856;
            b4 = 0.55 * b4 + w * 0.5329522;
            b5 = -0.7616 * b5 - w * 0.016898;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
            b6 = w * 0.115926;
          }
        } else if (color === "brown") {
          // Integrated white noise → deep, rumbling spectrum.
          let last = 0;
          for (let i = 0; i < bufferSize; i++) {
            const w = Math.random() * 2 - 1;
            last = (last + 0.02 * w) / 1.02;
            data[i] = last * 3.5;
          }
        } else {
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        }
        return buffer;
      };

      const pinkBuf = createNoiseBuffer(ctx, 4, "pink");
      const brownBuf = createNoiseBuffer(ctx, 5, "brown");

      // ── Rain ──────────────────────────────────────────────────────────
      // Pink noise band-limited to the "sheet of rain" range. A slow LFO
      // drifts the lowpass cutoff so the downpour breathes lighter/heavier
      // instead of sitting as static hiss.
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = pinkBuf;
      rainSource.loop = true;
      const rainHP = ctx.createBiquadFilter();
      rainHP.type = "highpass";
      rainHP.frequency.setValueAtTime(700, ctx.currentTime);
      const rainLP = ctx.createBiquadFilter();
      rainLP.type = "lowpass";
      rainLP.frequency.setValueAtTime(6500, ctx.currentTime);
      const rainDriftLfo = ctx.createOscillator();
      rainDriftLfo.type = "sine";
      rainDriftLfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      const rainDriftDepth = ctx.createGain();
      rainDriftDepth.gain.setValueAtTime(1400, ctx.currentTime); // ±1.4 kHz
      rainDriftLfo.connect(rainDriftDepth);
      rainDriftDepth.connect(rainLP.frequency);
      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(rainVol, ctx.currentTime);
      rainSource.connect(rainHP);
      rainHP.connect(rainLP);
      rainLP.connect(rainGain);
      rainGain.connect(ctx.destination);
      rainSource.start(0);
      rainDriftLfo.start(0);
      rainGainRef.current = rainGain;

      // ── Wind ────────────────────────────────────────────────────────────
      // Brown noise through a low-Q band, with two slow LFOs: one sweeps the
      // cutoff (the airy rise/fall of a gust) and one swells the amplitude on
      // a dedicated gust node — kept off the user gain so "0" is truly silent.
      const windSource = ctx.createBufferSource();
      windSource.buffer = brownBuf;
      windSource.loop = true;
      const windHP = ctx.createBiquadFilter();
      windHP.type = "highpass";
      windHP.frequency.setValueAtTime(120, ctx.currentTime);
      const windLP = ctx.createBiquadFilter();
      windLP.type = "lowpass";
      windLP.frequency.setValueAtTime(700, ctx.currentTime);
      windLP.Q.setValueAtTime(0.7, ctx.currentTime);
      const windCutoffLfo = ctx.createOscillator();
      windCutoffLfo.type = "sine";
      windCutoffLfo.frequency.setValueAtTime(0.06, ctx.currentTime);
      const windCutoffDepth = ctx.createGain();
      windCutoffDepth.gain.setValueAtTime(380, ctx.currentTime);
      windCutoffLfo.connect(windCutoffDepth);
      windCutoffDepth.connect(windLP.frequency);
      // Gust swell node: oscillates 0.4–1.0 around a 0.7 base.
      const windGust = ctx.createGain();
      windGust.gain.setValueAtTime(0.7, ctx.currentTime);
      const windGustLfo = ctx.createOscillator();
      windGustLfo.type = "sine";
      windGustLfo.frequency.setValueAtTime(0.13, ctx.currentTime);
      const windGustDepth = ctx.createGain();
      windGustDepth.gain.setValueAtTime(0.3, ctx.currentTime);
      windGustLfo.connect(windGustDepth);
      windGustDepth.connect(windGust.gain);
      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(windVol, ctx.currentTime);
      windSource.connect(windHP);
      windHP.connect(windLP);
      windLP.connect(windGust);
      windGust.connect(windGain);
      windGain.connect(ctx.destination);
      windSource.start(0);
      windCutoffLfo.start(0);
      windGustLfo.start(0);
      windGainRef.current = windGain;

      // ── Hum ───────────────────────────────────────────────────────────
      // Mains/CPU hum: a 60 Hz fundamental + falling harmonics, each slightly
      // detuned for a touch of beating, rounded by a lowpass and given a faint
      // tremolo "flutter" so it breathes instead of being a sterile test tone.
      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(humVol, ctx.currentTime);
      humGain.connect(ctx.destination);

      const humFlutterBus = ctx.createGain();
      humFlutterBus.gain.setValueAtTime(1.0, ctx.currentTime);
      humFlutterBus.connect(humGain);
      const humFlutterLfo = ctx.createOscillator();
      humFlutterLfo.type = "sine";
      humFlutterLfo.frequency.setValueAtTime(1.7, ctx.currentTime);
      const humFlutterDepth = ctx.createGain();
      humFlutterDepth.gain.setValueAtTime(0.06, ctx.currentTime);
      humFlutterLfo.connect(humFlutterDepth);
      humFlutterDepth.connect(humFlutterBus.gain);

      const humLP = ctx.createBiquadFilter();
      humLP.type = "lowpass";
      humLP.frequency.setValueAtTime(320, ctx.currentTime);
      humLP.connect(humFlutterBus);

      const humPartials = [
        { f: 60, g: 1.0 },
        { f: 120, g: 0.5 },
        { f: 180, g: 0.18 },
        { f: 240, g: 0.08 },
      ];
      const humOscs = humPartials.map(({ f, g }) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(f, ctx.currentTime);
        o.detune.setValueAtTime(Math.random() * 6 - 3, ctx.currentTime);
        const og = ctx.createGain();
        og.gain.setValueAtTime(g, ctx.currentTime);
        o.connect(og);
        og.connect(humLP);
        o.start(0);
        return o;
      });
      humFlutterLfo.start(0);
      humGainRef.current = humGain;

      ambientSourcesRef.current = [
        rainSource,
        rainDriftLfo,
        windSource,
        windCutoffLfo,
        windGustLfo,
        humFlutterLfo,
        ...humOscs,
      ];

      addLog("SYS: Procedural Remix layers ready.");
      return ctx;
    } catch (e) {
      addLog("ERR: Failed to initialize Audio Context.");
      console.error(e);
      return null;
    }
  }, [addLog, eqBass, eqMid, eqTreble, echoVol, rainVol, windVol, humVol]);

  // Update EQ filters reactively
  useEffect(() => {
    if (lowFilterRef.current && audioContextRef.current) {
      lowFilterRef.current.gain.setTargetAtTime(eqBass, audioContextRef.current.currentTime, 0.05);
    }
  }, [eqBass]);

  useEffect(() => {
    if (midFilterRef.current && audioContextRef.current) {
      midFilterRef.current.gain.setTargetAtTime(eqMid, audioContextRef.current.currentTime, 0.05);
    }
  }, [eqMid]);

  useEffect(() => {
    if (highFilterRef.current && audioContextRef.current) {
      highFilterRef.current.gain.setTargetAtTime(eqTreble, audioContextRef.current.currentTime, 0.05);
    }
  }, [eqTreble]);

  useEffect(() => {
    if (echoGainRef.current && audioContextRef.current) {
      echoGainRef.current.gain.setTargetAtTime(echoVol, audioContextRef.current.currentTime, 0.05);
    }
  }, [echoVol]);

  // Update Ambient layer volumes reactively
  useEffect(() => {
    if (rainGainRef.current && audioContextRef.current) {
      rainGainRef.current.gain.setTargetAtTime(rainVol, audioContextRef.current.currentTime, 0.05);
    }
  }, [rainVol]);

  useEffect(() => {
    if (windGainRef.current && audioContextRef.current) {
      windGainRef.current.gain.setTargetAtTime(windVol, audioContextRef.current.currentTime, 0.05);
    }
  }, [windVol]);

  useEffect(() => {
    if (humGainRef.current && audioContextRef.current) {
      humGainRef.current.gain.setTargetAtTime(humVol, audioContextRef.current.currentTime, 0.05);
    }
  }, [humVol]);

  // Clean up procedural synthesizer nodes
  const stopProceduralSynth = useCallback(() => {
    if (synthGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      synthGainRef.current.gain.cancelScheduledValues(now);
      synthGainRef.current.gain.setValueAtTime(synthGainRef.current.gain.value, now);
      synthGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }

    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }

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
    const analyserNode = analyserRef.current;
    if (!ctx || !analyserNode) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    stopProceduralSynth();

    const now = ctx.currentTime;
    const track = playlist[trackIndex] || playlist[0];
    const baseFreq = getTrackFrequency(track.id);
    addLog(`SYNTH: Starting synth tone generator (Base: ${baseFreq.toFixed(1)}Hz).`);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.25, now + 2.0);
    masterGain.connect(analyserNode);
    synthGainRef.current = masterGain;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(2.0, now);
    filter.connect(masterGain);
    synthFilterRef.current = filter;

    const osc1 = ctx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.detune.setValueAtTime(-10, now);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc2.detune.setValueAtTime(10, now);

    const osc3 = ctx.createOscillator();
    osc3.type = "sawtooth";
    osc3.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc3.detune.setValueAtTime(0, now);

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

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.06, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    droneOscsRef.current.push(lfo);

    const isMinor = track.key?.toLowerCase().includes("minor");
    const intervalMap = isMinor ? [1, 1.2, 1.33, 1.5, 1.8] : [1, 1.125, 1.25, 1.5, 1.66];

    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.4, now);
    const feedback = ctx.createGain();
    feedback.gain.setValueAtTime(0.45, now);

    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    const playBell = () => {
      if (!synthGainRef.current) return;
      const bellNow = ctx.currentTime;
      const randomInterval = intervalMap[Math.floor(Math.random() * intervalMap.length)];
      const bellFreq = baseFreq * 4.0 * randomInterval;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(bellFreq, bellNow);

      gain.gain.setValueAtTime(0, bellNow);
      gain.gain.linearRampToValueAtTime(0.06, bellNow + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, bellNow + 2.5);

      osc.connect(gain);
      gain.connect(masterGain);
      gain.connect(delay);

      osc.start(bellNow);
      osc.stop(bellNow + 3.0);
    };

    setTimeout(() => {
      if (isPlaying) playBell();
    }, 1000);

    bellIntervalRef.current = setInterval(() => {
      playBell();
    }, 4500 + Math.random() * 3000);

  }, [initAudioContext, stopProceduralSynth, getTrackFrequency, volume, addLog, isPlaying, playlist]);

  const playOfflineBuzz = useCallback(() => {
    const ctx = initAudioContext();
    const analyserNode = analyserRef.current;
    if (!ctx || !analyserNode) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    addLog("SYS: Attempting handshake with archived core...");
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.4;
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
    gain.connect(analyserNode);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(250, now + 0.12);

    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(analyserNode);

    noiseSource.start(now);
    osc.start(now);
    osc.stop(now + 0.4);

    setTimeout(() => {
      addLog("ERR: Connection rejected. Channel archived (Offline).");
    }, 200);
  }, [initAudioContext, addLog]);

  // Core Play/Pause execution
  const togglePlay = useCallback(async () => {
    const ctx = initAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume().catch(() => {});
    }

    const track = playlist[currentTrackIndex] || playlist[0];

    if (isPlaying) {
      setIsPlaying(false);
      addLog("SYS: Playback paused.");
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopProceduralSynth();
    } else {
      if (!track.isPlayable) {
        playOfflineBuzz();
        return;
      }

      setIsPlaying(true);
      setSimulatedDuration(parseDuration(track.duration));

      if (isSynthOnly) {
        setIsFallbackActive(true);
        startProceduralSynth(currentTrackIndex);
      } else {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : volume;
          try {
            addLog(`SYS: Stream loading on channel [${track.title}]...`);
            setIsFallbackActive(false);
            if (audioRef.current.src !== window.location.origin + (track.src || "")) {
              audioRef.current.src = track.src || "";
              audioRef.current.load();
            }
            await audioRef.current.play();
            addLog(`SYS: Streaming audio active.`);
          } catch {
            addLog("WARN: Stream unavailable. Activating synthesis generator.");
            setIsFallbackActive(true);
            startProceduralSynth(currentTrackIndex);
          }
        }
      }
    }
  }, [
    isPlaying,
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
    playlist,
  ]);

  // Handle track changing
  const handleTrackSelect = useCallback((index: number, options?: { autoplay?: boolean }) => {
    const track = playlist[index];
    if (!track) return;
    const shouldPlay = isPlaying || options?.autoplay;

    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setSimulatedDuration(parseDuration(track.duration));

    if (!track.isPlayable) {
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
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopProceduralSynth();

      setTimeout(async () => {
        const ctx = initAudioContext();
        if (ctx && ctx.state === "suspended") {
          await ctx.resume().catch(() => {});
        }
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
    playlist,
    initAudioContext
  ]);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    const audioVol = isMuted ? 0 : val;
    if (audioRef.current) {
      audioRef.current.volume = audioVol;
    }

    if (synthGainRef.current && audioContextRef.current) {
      synthGainRef.current.gain.setTargetAtTime(audioVol * 0.25, audioContextRef.current.currentTime, 0.05);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    const targetVol = newMute ? 0 : volume;

    if (audioRef.current) {
      audioRef.current.volume = targetVol;
    }

    if (synthGainRef.current && audioContextRef.current) {
      synthGainRef.current.gain.setTargetAtTime(targetVol * 0.25, audioContextRef.current.currentTime, 0.05);
    }

    addLog(newMute ? "SYS: Volume muted." : "SYS: Volume unmuted.");
  }, [isMuted, volume, addLog]);

  const handleNext = useCallback(() => {
    let nextIndex = currentTrackIndex;
    if (isShuffle) {
      const playableIndices = playlist.map((t, idx) => t.isPlayable ? idx : -1).filter(idx => idx !== -1);
      if (playableIndices.length > 0) {
        nextIndex = playableIndices[Math.floor(Math.random() * playableIndices.length)];
      }
    } else {
      for (let i = 1; i <= playlist.length; i++) {
        const idx = (currentTrackIndex + i) % playlist.length;
        if (playlist[idx].isPlayable) {
          nextIndex = idx;
          break;
        }
      }
    }
    handleTrackSelect(nextIndex);
  }, [currentTrackIndex, isShuffle, handleTrackSelect, playlist]);

  const handlePrev = useCallback(() => {
    let prevIndex = currentTrackIndex;
    if (isShuffle) {
      const playableIndices = playlist.map((t, idx) => t.isPlayable ? idx : -1).filter(idx => idx !== -1);
      if (playableIndices.length > 0) {
        prevIndex = playableIndices[Math.floor(Math.random() * playableIndices.length)];
      }
    } else {
      for (let i = 1; i <= playlist.length; i++) {
        const idx = (currentTrackIndex - i + playlist.length) % playlist.length;
        if (playlist[idx].isPlayable) {
          prevIndex = idx;
          break;
        }
      }
    }
    handleTrackSelect(prevIndex);
  }, [currentTrackIndex, isShuffle, handleTrackSelect, playlist]);

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

  const handleSeek = useCallback((percent: number) => {
    const targetTime = percent * simulatedDuration;
    setCurrentTime(targetTime);
    if (audioRef.current && !isFallbackActive) {
      audioRef.current.currentTime = targetTime;
    }
    addLog(`SYS: Seeked to ${Math.floor(targetTime / 60)}:${String(Math.floor(targetTime % 60)).padStart(2, "0")}`);
  }, [simulatedDuration, isFallbackActive, addLog]);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      let nextMode: "none" | "one" | "all";
      if (prev === "none") nextMode = "one";
      else if (prev === "one") nextMode = "all";
      else nextMode = "none";
      addLog(`SYS: Repeat Mode [${nextMode.toUpperCase()}].`);
      return nextMode;
    });
  }, [addLog]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const nextVal = !prev;
      addLog(`SYS: Shuffle Mode ${nextVal ? "ENABLED" : "DISABLED"}.`);
      return nextVal;
    });
  }, [addLog]);

  // Run progress timer ticks
  useEffect(() => {
    if (isPlaying) {
      if (isFallbackActive) {
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

  // Update custom track duration when audio loaded
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadedMetadata = () => {
      const dur = audio.duration;
      if (!isNaN(dur) && isFinite(dur)) {
        setSimulatedDuration(dur);
        const formatT = (secs: number) => {
          const m = Math.floor(secs / 60);
          const s = Math.floor(secs % 60);
          return `${m}:${String(s).padStart(2, "0")}`;
        };
        setPlaylist((prev) =>
          prev.map((t, idx) =>
            idx === currentTrackIndex ? { ...t, duration: formatT(dur) } : t
          )
        );
      }
    };
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentTrackIndex]);

  // Sync the first audio source once on mount and clean up context on teardown.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[0]?.src || "";
      audioRef.current.load();
    }
    queueMicrotask(() => addLog("SYS: Ambient Stream Decoders Ready."));
    return () => {
      stopProceduralSynth();
      // Clean up ambient nodes
      ambientSourcesRef.current.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      });
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopProceduralSynth, addLog]);

  return (
    <AudioPlayerContext.Provider
      value={{
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
        tracks: playlist,
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
        addLog,
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
        // Custom Loaders
        addCustomTrack,
        setTrackDuration,
      }}
    >
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
