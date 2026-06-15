/**
 * Audio-reactive visualizer suite for the Music console.
 *
 * Each entry in {@link VISUALIZERS} is a self-contained Canvas 2D renderer. The
 * page runs a single requestAnimationFrame loop that:
 *   1. pulls frequency + waveform bytes from the Web Audio AnalyserNode,
 *   2. derives a smoothed, beat-aware {@link Analysis} via {@link updateAnalysis},
 *   3. builds a {@link VizFrame} and calls the active visualizer's `draw`.
 *
 * Everything draws in *logical* (CSS) pixels — the canvas backing store is
 * pre-scaled by devicePixelRatio in the page, so visuals stay crisp on hi-dpi
 * displays without per-visualizer math.
 */

// ── Palettes ────────────────────────────────────────────────────────────────

export type ColorKey = "teal" | "purple" | "amber" | "emerald";

export interface Palette {
  low: string;
  mid: string;
  hi: string;
  glow: string;
  /** Primary hue for HSL-based modes (particles, aurora, blob…). */
  hue: number;
  /** Secondary/accent hue. */
  hue2: number;
}

export const PALETTES: Record<ColorKey, Palette> = {
  teal:    { low: "rgba(110, 86, 255, 0.15)", mid: "rgba(110, 86, 255, 0.7)", hi: "rgba(0, 224, 203, 1)",  glow: "rgba(0, 224, 203, 0.4)",  hue: 172, hue2: 250 },
  purple:  { low: "rgba(255, 79, 176, 0.15)", mid: "rgba(255, 79, 176, 0.7)", hi: "rgba(110, 86, 255, 1)", glow: "rgba(110, 86, 255, 0.4)", hue: 327, hue2: 255 },
  amber:   { low: "rgba(239, 68, 68, 0.15)",  mid: "rgba(239, 68, 68, 0.7)",  hi: "rgba(245, 158, 11, 1)", glow: "rgba(245, 158, 11, 0.4)", hue: 38,  hue2: 6   },
  emerald: { low: "rgba(59, 130, 246, 0.15)", mid: "rgba(59, 130, 246, 0.7)", hi: "rgba(16, 185, 129, 1)", glow: "rgba(16, 185, 129, 0.4)", hue: 152, hue2: 212 },
};

// ── Shared per-frame analysis ────────────────────────────────────────────────

export interface Analysis {
  /** Asymmetrically smoothed spectrum, 0..1, length === frequencyBinCount. */
  smooth: Float32Array;
  /** Smoothed band energies, 0..1. */
  bass: number;
  mid: number;
  treble: number;
  /** Overall loudness (RMS of waveform), 0..1. */
  level: number;
  /** Decaying beat pulse, 0..1 (1 on a fresh beat, eased down after). */
  beat: number;
  /** True only on the frame a beat is detected. */
  isBeat: boolean;
  /** Auto-gain for waveform modes so quiet tracks still look full (1..4.5). */
  waveGain: number;
  // internal running state
  bassAvg: number;
  lastBeat: number;
  wavePeak: number;
}

export function makeAnalysis(bins: number): Analysis {
  return {
    smooth: new Float32Array(bins),
    bass: 0, mid: 0, treble: 0, level: 0,
    beat: 0, isBeat: false, waveGain: 1,
    bassAvg: 0.0001, lastBeat: 0, wavePeak: 0,
  };
}

function avgRange(arr: Uint8Array, a: number, b: number): number {
  let s = 0;
  const lo = Math.max(0, a);
  const hi = Math.min(arr.length, b);
  for (let i = lo; i < hi; i++) s += arr[i];
  return (s / Math.max(1, hi - lo)) / 255;
}

/**
 * Update `a` in place from the latest frequency/waveform bytes.
 * Rise-fast / fall-slow smoothing keeps motion lively but never jittery.
 */
export function updateAnalysis(
  a: Analysis,
  freq: Uint8Array,
  time: Uint8Array,
  t: number,
  playing: boolean,
): void {
  const bins = freq.length;

  for (let i = 0; i < bins; i++) {
    const target = freq[i] / 255;
    const prev = a.smooth[i];
    // attack faster than release → bars pop on peaks, glide through valleys
    a.smooth[i] = prev + (target > prev ? 0.45 : 0.12) * (target - prev);
  }

  const bass = avgRange(freq, 1, 7);
  const mid = avgRange(freq, 7, 40);
  const treble = avgRange(freq, 40, Math.min(bins, 110));

  // RMS loudness + peak from the waveform
  let sum = 0;
  let peak = 0;
  for (let i = 0; i < bins; i++) {
    const v = (time[i] - 128) / 128;
    sum += v * v;
    const av = v < 0 ? -v : v;
    if (av > peak) peak = av;
  }
  const rms = Math.sqrt(sum / bins);

  // Track the waveform peak (fast attack, slow release) and derive an auto-gain
  // so quiet ambient tracks fill the scope/lissajous as much as loud ones.
  a.wavePeak = peak > a.wavePeak ? peak : a.wavePeak * 0.92 + peak * 0.08;
  a.waveGain = Math.max(1, Math.min(4.5, 0.62 / (a.wavePeak + 0.02)));

  a.bass += (bass - a.bass) * 0.30;
  a.mid += (mid - a.mid) * 0.30;
  a.treble += (treble - a.treble) * 0.30;
  a.level += (rms - a.level) * 0.30;

  // Beat: bass spikes well above its rolling average, with a refractory window
  a.bassAvg = a.bassAvg * 0.94 + a.bass * 0.06;
  a.isBeat = false;
  if (playing && a.bass > a.bassAvg * 1.32 && a.bass > 0.22 && t - a.lastBeat > 0.16) {
    a.isBeat = true;
    a.lastBeat = t;
    a.beat = 1;
  }
  a.beat *= 0.90;

  // Gentle idle "breathing" so visuals stay alive while paused
  if (!playing) {
    const breath = 0.04 + 0.025 * (0.5 + 0.5 * Math.sin(t * 0.9));
    a.level = Math.max(a.level, breath);
    a.bass = Math.max(a.bass, breath * 0.8);
  }
}

// ── Frame context passed to every visualizer ─────────────────────────────────

export type VizState = Record<string, unknown>;

export interface VizFrame {
  ctx: CanvasRenderingContext2D;
  /** Logical (CSS-pixel) dimensions. */
  width: number;
  height: number;
  dpr: number;
  freq: Uint8Array;
  time: Uint8Array;
  a: Analysis;
  palette: Palette;
  expanded: boolean;
  playing: boolean;
  /** Seconds (monotonic). */
  t: number;
  /** Persistent scratch space, namespaced per visualizer via {@link vstate}. */
  state: VizState;
}

export interface Visualizer {
  value: string;
  label: string;
  short: string;
  draw: (f: VizFrame) => void;
}

// ── Drawing helpers ──────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const hsla = (h: number, s: number, l: number, a: number) =>
  `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;

/** Lazily create & memoize per-visualizer persistent state. */
function vstate<T>(f: VizFrame, key: string, init: () => T): T {
  if (f.state[key] === undefined) f.state[key] = init();
  return f.state[key] as T;
}

/** Sample the smoothed spectrum with a low-bias curve (energy lives in the lows). */
function sampleSmooth(a: Analysis, i: number, n: number, curve = 0.72): number {
  const idx = Math.floor(Math.pow(i / n, 1.0) * a.smooth.length * curve);
  return a.smooth[clamp(idx, 0, a.smooth.length - 1)];
}

/** Translucent dark wash (frame trails) + optional faint grid. */
function paintBackdrop(f: VizFrame, fade = 0.22, grid = true) {
  const { ctx, width, height } = f;
  ctx.fillStyle = `rgba(6, 7, 13, ${fade})`;
  ctx.fillRect(0, 0, width, height);

  if (grid) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.012)";
    ctx.lineWidth = 1;
    const g = 16;
    ctx.beginPath();
    for (let x = 0; x < width; x += g) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = 0; y < height; y += g) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
  }
}

/** Rounded-top bar path (open bottom). */
function barPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0) return;
  const rad = Math.min(r, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

// ── Visualizers ──────────────────────────────────────────────────────────────

/** Spectrum Wave — mirrored bars from center + central oscilloscope. */
function drawSpectrum(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded } = f;
  paintBackdrop(f, 0.22, true);

  const half = 32;
  const barWidth = width / (half * 2) - 3;
  const base = height - 10;

  for (let i = 0; i < half; i++) {
    const v = a.smooth[i];
    const barHeight = v * (height - 35);
    if (barHeight < 0.5) continue;
    const top = base - barHeight;

    const grad = ctx.createLinearGradient(0, base, 0, top);
    grad.addColorStop(0, p.low);
    grad.addColorStop(0.5, p.mid);
    grad.addColorStop(1, p.hi);
    ctx.fillStyle = grad;
    ctx.shadowBlur = 8 + a.beat * 8;
    ctx.shadowColor = p.glow;

    const x = i * (barWidth + 3);
    barPath(ctx, width / 2 + x, top, barWidth, barHeight, 2);
    ctx.fill();
    barPath(ctx, width / 2 - x - barWidth, top, barWidth, barHeight, 2);
    ctx.fill();
  }

  // Central oscilloscope
  ctx.shadowBlur = 10;
  ctx.shadowColor = p.glow;
  ctx.strokeStyle = p.hi;
  ctx.lineWidth = (expanded ? 1.8 : 1.3) + a.level * 2;
  ctx.beginPath();
  const n = f.time.length;
  const slice = width / n;
  for (let i = 0; i < n; i++) {
    const y = (f.time[i] / 128) * (height / 2);
    if (i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * slice, y);
  }
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/** EQ Columns — rounded gradient bars with a glassy reflection. */
function drawColumns(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded } = f;
  paintBackdrop(f, 0.25, true);

  const numBars = expanded ? 64 : 44;
  const gap = 2;
  const barWidth = width / numBars - gap;
  const base = height * 0.74;

  for (let i = 0; i < numBars; i++) {
    const v = sampleSmooth(a, i, numBars, 0.8);
    const barHeight = v * base;
    if (barHeight < 0.5) continue;
    const x = i * (barWidth + gap);
    const top = base - barHeight;

    const grad = ctx.createLinearGradient(0, base, 0, top);
    grad.addColorStop(0, p.low);
    grad.addColorStop(0.55, p.mid);
    grad.addColorStop(1, p.hi);
    ctx.fillStyle = grad;
    ctx.shadowBlur = 6 + a.beat * 10;
    ctx.shadowColor = p.glow;
    barPath(ctx, x, top, barWidth, barHeight, 3);
    ctx.fill();

    // Reflection below the baseline
    ctx.shadowBlur = 0;
    const reflectH = Math.min(barHeight, height - base);
    const rGrad = ctx.createLinearGradient(0, base, 0, base + reflectH);
    rGrad.addColorStop(0, p.mid.replace(/[\d.]+\)$/, "0.18)"));
    rGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rGrad;
    ctx.fillRect(x, base, barWidth, reflectH);
  }

  // Baseline glow
  ctx.strokeStyle = p.glow;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, base);
  ctx.lineTo(width, base);
  ctx.stroke();
}

/** Oscilloscope — glowing waveform with an echo trace and soft fill. */
function drawScope(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded } = f;
  paintBackdrop(f, 0.2, true);

  const n = f.time.length;
  const slice = width / n;
  const amp = height * 0.4;
  const mid = height / 2;
  const g = a.waveGain;
  const dev = (i: number) => {
    const v = ((f.time[i] - 128) / 128) * g;
    return (v < -1 ? -1 : v > 1 ? 1 : v) * amp;
  };

  // Soft fill under the curve
  ctx.beginPath();
  ctx.moveTo(0, mid);
  for (let i = 0; i < n; i++) ctx.lineTo(i * slice, mid + dev(i));
  ctx.lineTo(width, mid);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, 0, 0, height);
  fill.addColorStop(0, p.mid.replace(/[\d.]+\)$/, "0.10)"));
  fill.addColorStop(0.5, p.glow.replace(/[\d.]+\)$/, "0.05)"));
  fill.addColorStop(1, p.mid.replace(/[\d.]+\)$/, "0.10)"));
  ctx.fillStyle = fill;
  ctx.fill();

  // Echo trace
  ctx.strokeStyle = p.mid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const y = mid + dev(i) * 0.7 + 6;
    if (i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * slice, y);
  }
  ctx.stroke();

  // Main glowing line
  ctx.shadowBlur = 12;
  ctx.shadowColor = p.glow;
  ctx.strokeStyle = p.hi;
  ctx.lineWidth = (expanded ? 2.2 : 1.6) + a.level * 3;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const y = mid + dev(i);
    if (i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * slice, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/** Lissajous — phase plot of the waveform against a delayed copy. Lots of trails. */
function drawLissajous(f: VizFrame) {
  const { ctx, width, height, palette: p, a, t } = f;
  paintBackdrop(f, 0.10, true);

  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.42;
  const g = a.waveGain;
  const norm = (i: number) => {
    const v = ((f.time[i] - 128) / 128) * g;
    return (v < -1 ? -1 : v > 1 ? 1 : v) * scale;
  };
  const n = f.time.length;
  const shift = 6;

  ctx.globalCompositeOperation = "lighter";
  ctx.shadowBlur = 14;
  ctx.shadowColor = p.glow;
  ctx.lineWidth = 1.4 + a.level * 3;

  for (let pass = 0; pass < 2; pass++) {
    const rot = t * 0.15 + pass * Math.PI;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    ctx.strokeStyle = pass === 0 ? p.hi : hsla(p.hue2, 90, 65, 0.7);
    ctx.beginPath();
    for (let i = 0; i < n - shift; i++) {
      const sx = norm(i);
      const sy = norm(i + shift);
      const x = cx + sx * cos - sy * sin;
      const y = cy + sx * sin + sy * cos;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
}

/** Radial Portal — pulsing ring with frequency spikes, slowly rotating. */
function drawPortal(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded, t } = f;
  paintBackdrop(f, 0.22, true);

  const cx = width / 2;
  const cy = height / 2;
  const baseRadius = Math.min(width, height) * (expanded ? 0.30 : 0.24);
  const radius = baseRadius + a.bass * (expanded ? 26 : 16) + a.beat * 10;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.08);

  // Central ring
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = p.hi;
  ctx.lineWidth = (expanded ? 4 : 2) + a.beat * 3;
  ctx.shadowBlur = 16;
  ctx.shadowColor = p.glow;
  ctx.stroke();

  const numBars = 72;
  for (let i = 0; i < numBars; i++) {
    const angle = (i / numBars) * Math.PI * 2;
    const v = sampleSmooth(a, Math.min(i, numBars - i), numBars / 2, 0.5);
    const len = v * (expanded ? 70 : 36);
    const r0 = radius;
    const r1 = radius + len;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r0, Math.sin(angle) * r0);
    ctx.lineTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
    ctx.strokeStyle = v > 0.6 ? p.hi : p.mid;
    ctx.lineWidth = expanded ? 3 : 1.6;
    ctx.stroke();
  }
  ctx.restore();

  // Core glow
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius);
  cg.addColorStop(0, p.glow.replace(/[\d.]+\)$/, `${0.10 + a.bass * 0.4})`));
  cg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cg;
  ctx.fillRect(cx - baseRadius, cy - baseRadius, baseRadius * 2, baseRadius * 2);
  ctx.shadowBlur = 0;
}

/** Sunburst — 360° symmetric frequency rays radiating from a reactive core. */
function drawSunburst(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded, t } = f;
  paintBackdrop(f, 0.24, false);

  const cx = width / 2;
  const cy = height / 2;
  const inner = Math.min(width, height) * 0.10 + a.bass * 18 + a.beat * 8;
  const maxLen = Math.min(width, height) * (expanded ? 0.42 : 0.36);
  const rays = expanded ? 120 : 80;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.05 + a.beat * 0.12);
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    // mirror across the vertical axis for symmetry
    const m = Math.min(i, rays - i);
    const v = sampleSmooth(a, m, rays / 2, 0.55);
    const len = inner + v * maxLen;

    const grad = ctx.createLinearGradient(
      Math.cos(angle) * inner, Math.sin(angle) * inner,
      Math.cos(angle) * len, Math.sin(angle) * len,
    );
    grad.addColorStop(0, hsla(p.hue, 90, 60, 0.05));
    grad.addColorStop(0.5, hsla(p.hue + v * 40, 95, 60, 0.7));
    grad.addColorStop(1, hsla(p.hue2, 95, 68, 0.95));
    ctx.strokeStyle = grad;
    ctx.lineWidth = (Math.PI * 2 * inner) / rays * 0.9 * (0.5 + v);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
    ctx.stroke();
  }

  // Reactive core
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, inner * 1.4);
  core.addColorStop(0, hsla(p.hue2, 95, 75, 0.9));
  core.addColorStop(0.6, hsla(p.hue, 90, 55, 0.3));
  core.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, inner * 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}

/** Liquid Core — a morphing blob whose radius is modulated per-angle by the spectrum. */
function drawBlob(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded, t } = f;
  paintBackdrop(f, 0.20, false);

  const cx = width / 2;
  const cy = height / 2;
  const baseR = Math.min(width, height) * (expanded ? 0.22 : 0.20);
  const points = 96;

  const radial = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 2);
  radial.addColorStop(0, hsla(p.hue2, 95, 68, 0.95));
  radial.addColorStop(0.5, hsla(p.hue, 90, 55, 0.55));
  radial.addColorStop(1, hsla(p.hue, 85, 40, 0.05));

  const drawLobe = (rScale: number, rot: number, alpha: number) => {
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2 + rot;
      const m = Math.min(i % points, points - (i % points));
      const v = sampleSmooth(a, m, points / 2, 0.45);
      const wobble = 0.06 * Math.sin(angle * 3 + t * 1.6);
      const r = (baseR * rScale) * (1 + wobble) + v * baseR * 1.05 + a.beat * baseR * 0.22;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = radial;
    ctx.shadowBlur = 24;
    ctx.shadowColor = p.glow;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  ctx.globalCompositeOperation = "lighter";
  drawLobe(1.0, t * 0.2, 0.85);
  drawLobe(0.66, -t * 0.3, 0.7);
  ctx.globalCompositeOperation = "source-over";

  // Crisp rim
  ctx.strokeStyle = hsla(p.hue2, 95, 80, 0.6 + a.level * 0.4);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2 + t * 0.2;
    const m = Math.min(i % points, points - (i % points));
    const v = sampleSmooth(a, m, points / 2, 0.45);
    const wobble = 0.06 * Math.sin(angle * 3 + t * 1.6);
    const r = baseR * (1 + wobble) + v * baseR * 1.05 + a.beat * baseR * 0.22;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Pulse Rings — concentric rings emitted on each beat, expanding outward. */
function drawRings(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded } = f;
  paintBackdrop(f, 0.20, true);

  const st = vstate(f, "rings", () => ({ arr: [] as { r: number; a: number; w: number }[], spawn: 0 }));
  const cx = width / 2;
  const cy = height / 2;

  // Emit on beats, plus a slow heartbeat so it never goes fully static
  st.spawn -= 1;
  if (f.a.isBeat || (f.playing && st.spawn <= 0)) {
    st.arr.push({ r: 16 + a.bass * 40, a: 0.85, w: 2 + a.bass * 5 });
    st.spawn = 28;
  }

  ctx.globalCompositeOperation = "lighter";
  for (const ring of st.arr) {
    ring.r += 2.4 + a.bass * 3.5;
    ring.a *= 0.965;
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
    ctx.strokeStyle = p.hi.replace(/[\d.]+\)$/, `${ring.a})`);
    ctx.lineWidth = ring.w;
    ctx.shadowBlur = 14;
    ctx.shadowColor = p.glow;
    ctx.stroke();
  }
  st.arr = st.arr.filter((r: { r: number; a: number }) => r.a > 0.03 && r.r < Math.max(width, height));
  if (st.arr.length > 60) st.arr.splice(0, st.arr.length - 60);

  // Reactive core disc
  const cr = (expanded ? 26 : 18) + a.bass * 46 + a.beat * 16;
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
  cg.addColorStop(0, hsla(p.hue2, 95, 72, 0.9));
  cg.addColorStop(0.6, p.glow.replace(/[\d.]+\)$/, "0.25)"));
  cg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
}

/** Particle Field — sparks burst from the center on beats, drift and fade. */
function drawParticles(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded } = f;
  paintBackdrop(f, 0.16, false);

  type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number };
  const st = vstate(f, "particles", () => ({ arr: [] as P[], frame: 0 }));
  st.frame++;
  const cx = width / 2;
  const cy = height / 2;

  const emit = (count: number, power: number, baseSpeed: number) => {
    for (let k = 0; k < count; k++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (baseSpeed + power * 7) * (expanded ? 1.5 : 1);
      st.arr.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 1.2 + Math.random() * 2.6,
        hue: p.hue + (Math.random() * 60 - 30),
      });
    }
  };

  // Beats fire bright outward bursts; a steady drizzle keeps the field full.
  if (f.a.isBeat) emit(expanded ? 34 : 20, a.bass + a.beat, 2.2);
  if (f.playing && a.level > 0.015) emit(expanded ? 4 : 2, a.level, 1.6);

  ctx.globalCompositeOperation = "lighter";
  for (const pt of st.arr) {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vx *= 0.984;
    pt.vy *= 0.984;
    pt.life -= 0.0075;
    const r = pt.size * (1 + a.beat * 0.8);
    const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 3);
    g.addColorStop(0, hsla(pt.hue, 95, 68, clamp(pt.life, 0, 1)));
    g.addColorStop(1, hsla(pt.hue, 95, 60, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  st.arr = st.arr.filter((pt: P) => pt.life > 0 && pt.x > -30 && pt.x < width + 30 && pt.y > -30 && pt.y < height + 30);
  if (st.arr.length > 520) st.arr.splice(0, st.arr.length - 520);
  ctx.globalCompositeOperation = "source-over";
}

/** Aurora Veil — stacked flowing gradient ribbons swayed by the spectrum. */
function drawAurora(f: VizFrame) {
  const { ctx, width, height, palette: p, a, expanded, t } = f;
  paintBackdrop(f, 0.16, false);

  const bands = expanded ? 5 : 4;
  ctx.globalCompositeOperation = "lighter";

  for (let b = 0; b < bands; b++) {
    const hue = p.hue + b * 22 - 20;
    const yBase = height * (0.30 + b * 0.12);
    const amp = height * (0.06 + a.level * 0.22);
    const speed = 0.5 + b * 0.18;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 6) {
      const fi = Math.floor((x / width) * a.smooth.length * 0.55);
      const v = a.smooth[fi] || 0;
      const y =
        yBase +
        Math.sin(x * 0.012 + t * speed + b) * amp -
        v * height * 0.22 -
        a.beat * 14;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, yBase - amp - height * 0.22, 0, height);
    grad.addColorStop(0, hsla(hue, 90, 65, 0));
    grad.addColorStop(0.25, hsla(hue, 90, 62, 0.20 + a.level * 0.15));
    grad.addColorStop(1, hsla(hue, 85, 50, 0));
    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

/** Spectro Falls — a scrolling spectrogram waterfall; history flows downward.
 *  Uses two offscreen buffers ping-ponged each frame (no self-drawImage). */
function drawTerrain(f: VizFrame) {
  const { ctx, width, height, palette: p, a } = f;
  const W = Math.max(1, Math.round(width));
  const H = Math.max(1, Math.round(height));

  type T = {
    a: HTMLCanvasElement; b: HTMLCanvasElement;
    actx: CanvasRenderingContext2D; bctx: CanvasRenderingContext2D;
    w: number; h: number; flip: boolean;
  };
  const mk = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const cx = c.getContext("2d")!;
    cx.fillStyle = "#06070d";
    cx.fillRect(0, 0, w, h);
    return { c, cx };
  };

  const st = vstate<T>(f, "terrain", () => {
    const A = mk(W, H), B = mk(W, H);
    return { a: A.c, b: B.c, actx: A.cx, bctx: B.cx, w: W, h: H, flip: false };
  });

  // Rebuild buffers on resize, preserving the current front image.
  if (st.w !== W || st.h !== H) {
    const oldFront = st.flip ? st.b : st.a;
    const A = mk(W, H), B = mk(W, H);
    A.cx.drawImage(oldFront, 0, 0, W, H);
    st.a = A.c; st.b = B.c; st.actx = A.cx; st.bctx = B.cx;
    st.w = W; st.h = H; st.flip = false;
  }

  const front = st.flip ? st.b : st.a;
  const back = st.flip ? st.a : st.b;
  const backCtx = st.flip ? st.actx : st.bctx;

  // Scroll the previous frame down (2px/frame) into the back buffer…
  backCtx.fillStyle = "#06070d";
  backCtx.fillRect(0, 0, W, H);
  backCtx.drawImage(front, 0, 2);

  // …then paint the newest spectrum row across the top.
  for (let x = 0; x < W; x++) {
    const v = sampleSmooth(a, x, W, 0.7);
    if (v < 0.02) {
      backCtx.fillStyle = "#06070d";
    } else {
      backCtx.fillStyle = hsla(p.hue + (1 - v) * 40, 92, 22 + v * 48, 1);
    }
    backCtx.fillRect(x, 0, 1, 3);
  }

  ctx.drawImage(back, 0, 0, width, height);

  // Subtle scanline glow on the leading edge
  ctx.fillStyle = p.glow.replace(/[\d.]+\)$/, "0.15)");
  ctx.fillRect(0, 0, width, 2);

  st.flip = !st.flip;
}

// ── Registry ─────────────────────────────────────────────────────────────────

export const VISUALIZERS: Visualizer[] = [
  { value: "mixed",     label: "Spectrum Wave", short: "Spectrum",  draw: drawSpectrum },
  { value: "bars",      label: "EQ Columns",    short: "Columns",   draw: drawColumns },
  { value: "scope",     label: "Oscilloscope",  short: "Scope",     draw: drawScope },
  { value: "lissajous", label: "Lissajous",     short: "Lissajous", draw: drawLissajous },
  { value: "circular",  label: "Radial Portal", short: "Portal",    draw: drawPortal },
  { value: "bloom",     label: "Sunburst",      short: "Sunburst",  draw: drawSunburst },
  { value: "blob",      label: "Liquid Core",   short: "Liquid",    draw: drawBlob },
  { value: "rings",     label: "Pulse Rings",   short: "Rings",     draw: drawRings },
  { value: "particles", label: "Particle Field", short: "Particles", draw: drawParticles },
  { value: "aurora",    label: "Aurora Veil",   short: "Aurora",    draw: drawAurora },
  { value: "terrain",   label: "Spectro Falls", short: "Falls",     draw: drawTerrain },
];

export function getVisualizer(value: string): Visualizer {
  return VISUALIZERS.find((v) => v.value === value) || VISUALIZERS[0];
}
