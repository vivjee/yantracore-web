"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme/ThemeProvider";

/**
 * GalaxyField — a slowly rotating spiral galaxy of twinkling stars, drawn in
 * WebGL as the base background layer behind the entire site.
 *
 * Imperative three.js (no react-three-fiber), like ReachGlobe: one Scene +
 * WebGLRenderer in a useEffect, a manual rAF loop, full disposal on unmount.
 *
 * IMPORTANT — works under SOFTWARE rendering too. Many machines (Enterprise
 * GPU policy, blocklisted drivers) run Chrome's WebGL on SwiftShader, which
 * clamps `gl_POINTS` sprites to ~1px and chokes on multi-pass bloom. So stars
 * here are real BILLBOARDED QUADS (size comes from geometry, identical in
 * software + hardware) with their glow BAKED INTO the sprite — no gl_PointSize,
 * no post-processing pass. We detect software rendering and scale the star
 * count down so the rAF loop stays smooth there.
 *
 * The renderer is OPAQUE (clears to ink-black) and is the bottom layer of
 * SiteBackground, so it IS the backdrop. Stars are additive along parametric
 * spiral arms: a hot near-white core fading to violet/cyan arms with a few
 * pink stars, each with its own soft glow and twinkle phase.
 *
 * Lifecycle (matched from ReachGlobe / the music page):
 *   • prefers-reduced-motion (OS or in-app toggle) → render ONE static frame.
 *   • pause the rAF loop while the tab is hidden.
 *   • cap devicePixelRatio.
 */

const GAL_RADIUS = 9;
const BRANCHES = 3;
const SPIN = 0.5; // radians of winding per unit radius — low, so arms stay open
const RANDOMNESS = 0.13;
const RANDOMNESS_POWER = 2.8;
const DISK_THICKNESS = 0.24;
const ROT_SPEED = 0.05; // radians / second
const CLEAR_COLOR = 0x05060d;

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSize;

  attribute vec3 aOffset;
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aSeed;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Per-star twinkle: each star has its own phase + speed.
    float tw = sin(uTime * (0.5 + aSeed * 1.7) + aSeed * 6.2831853);
    vTwinkle = 0.62 + 0.38 * tw;

    // Billboard: place the star centre in view space (so the galaxy's rotation
    // moves it), then push the quad corners out in screen-facing axes so every
    // star always faces the camera. Size is geometric — no gl_PointSize.
    vec4 viewCenter = modelViewMatrix * vec4(aOffset, 1.0);
    float size = uSize * aScale;
    viewCenter.xy += position.xy * size;
    gl_Position = projectionMatrix * viewCenter;

    vUv = uv;
    vColor = aColor;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft round glowing star: bright core + generous halo. This baked glow is
    // what gives the "bloom" look without a post pass.
    float d = distance(vUv, vec2(0.5));
    float s = clamp(1.0 - d * 2.0, 0.0, 1.0);
    float core = pow(s, 3.0);
    float halo = pow(s, 1.25) * 0.55;
    float alpha = (core + halo) * vTwinkle;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * (0.9 + 0.7 * vTwinkle), alpha);
  }
`;

/** Soft radial sprite used for the bright galactic core glow. */
function makeGlowTexture(stops: [number, string][]): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [offset, color] of stops) g.addColorStop(offset, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** True when WebGL is running on a software rasterizer (SwiftShader / llvmpipe). */
function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const r = (dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "").toLowerCase();
    return /swiftshader|software|llvmpipe|basic render|microsoft basic/.test(r);
  } catch {
    return false;
  }
}

export function GalaxyField() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { palette, reducedMotionEnabled } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || reducedMotionEnabled;

    // ── Scene / camera / renderer ────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CLEAR_COLOR);

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // ~45° tilt, framed so the spiral fills the hero area and the arms sweep out
    // behind the cards, curling around the centred Sun.
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 300);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(CLEAR_COLOR, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const software = isSoftwareRenderer(renderer.getContext());
    // Software rasterisers pay per fragment, and additive stars overdraw a lot,
    // so use fewer (slightly larger) stars there and cap DPR hard.
    const STAR_COUNT = software ? 10000 : 24000;
    const FAR_COUNT = software ? 400 : 1100;
    const BASE_SIZE = software ? 0.15 : 0.12; // view-space quad size
    const pixelRatio = Math.min(window.devicePixelRatio || 1, software ? 1 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    // ── Shared additive star material (billboarded glowing quads) ─────────────
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: BASE_SIZE },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // Unit quad shared by every star instance.
    const quad = new THREE.PlaneGeometry(1, 1);

    /** Build an instanced glowing-quad cloud from per-star buffers. */
    const buildStars = (
      offsets: Float32Array,
      colors: Float32Array,
      scales: Float32Array,
      seeds: Float32Array,
      count: number,
    ) => {
      const geo = new THREE.InstancedBufferGeometry();
      geo.index = quad.index;
      geo.setAttribute("position", quad.getAttribute("position"));
      geo.setAttribute("uv", quad.getAttribute("uv"));
      geo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
      geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
      geo.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
      geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
      geo.instanceCount = count;
      return geo;
    };

    // ── Palette (hot near-white core → violet/cyan arms, a few pink stars) ────
    const inside = new THREE.Color(palette.accentWarm).lerp(new THREE.Color("#ffffff"), 0.72);
    const violet = new THREE.Color(palette.accent1);
    const cyan = new THREE.Color(palette.accent2);
    const pink = new THREE.Color(palette.accent3);

    // ── Galaxy geometry ──────────────────────────────────────────────────────
    const gOff = new Float32Array(STAR_COUNT * 3);
    const gCol = new Float32Array(STAR_COUNT * 3);
    const gScl = new Float32Array(STAR_COUNT);
    const gSeed = new Float32Array(STAR_COUNT);
    const tmp = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.pow(Math.random(), 0.95) * GAL_RADIUS;
      const radiusNorm = radius / GAL_RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = radius * SPIN;

      const scatter = () =>
        Math.pow(Math.random(), RANDOMNESS_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        (radius + 0.6);

      gOff[i3] = Math.cos(branchAngle + spinAngle) * radius + scatter();
      gOff[i3 + 1] = scatter() * DISK_THICKNESS;
      gOff[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatter();

      const pick = Math.random();
      const rim = pick > 0.9 ? pink : pick > 0.5 ? cyan : violet;
      tmp.copy(inside).lerp(rim, Math.pow(radiusNorm, 0.55));
      const brightness = (1.9 - radiusNorm * 0.3) * (0.9 + Math.random() * 0.7);
      gCol[i3] = tmp.r * brightness;
      gCol[i3 + 1] = tmp.g * brightness;
      gCol[i3 + 2] = tmp.b * brightness;

      gScl[i] = (0.5 + Math.random() * 0.7) * (i % 26 === 0 ? 2.1 : 1);
      gSeed[i] = Math.random();
    }

    const galaxyGeo = buildStars(gOff, gCol, gScl, gSeed, STAR_COUNT);
    const galaxy = new THREE.Mesh(galaxyGeo, material);
    galaxy.frustumCulled = false;
    scene.add(galaxy);

    // ── Distant depth starfield (static shell behind the galaxy) ──────────────
    const fOff = new Float32Array(FAR_COUNT * 3);
    const fCol = new Float32Array(FAR_COUNT * 3);
    const fScl = new Float32Array(FAR_COUNT);
    const fSeed = new Float32Array(FAR_COUNT);
    const farTint = new THREE.Color("#aab6e6");

    for (let i = 0; i < FAR_COUNT; i++) {
      const i3 = i * 3;
      const r = 30 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      fOff[i3] = r * Math.sin(phi) * Math.cos(theta);
      fOff[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      fOff[i3 + 2] = r * Math.cos(phi);
      const b = 0.5 + Math.random() * 0.5;
      fCol[i3] = farTint.r * b;
      fCol[i3 + 1] = farTint.g * b;
      fCol[i3 + 2] = farTint.b * b;
      fScl[i] = 1.4 + Math.random() * 1.4; // farther away → need bigger quads to read
      fSeed[i] = Math.random();
    }

    const farGeo = buildStars(fOff, fCol, fScl, fSeed, FAR_COUNT);
    const farStars = new THREE.Mesh(farGeo, material);
    farStars.frustumCulled = false;
    scene.add(farStars);

    // ── Bright galactic core glow (warm inner + violet halo) ──────────────────
    const innerTex = makeGlowTexture([
      [0, "rgba(255, 248, 232, 1)"],
      [0.25, "rgba(255, 224, 184, 0.7)"],
      [0.6, "rgba(190, 150, 255, 0.2)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const haloTex = makeGlowTexture([
      [0, "rgba(150, 130, 255, 0.55)"],
      [0.4, "rgba(110, 86, 255, 0.2)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const glowMats: THREE.SpriteMaterial[] = [];
    const addGlow = (tex: THREE.Texture, scale: number, opacity: number) => {
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        opacity,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(scale, scale, 1);
      scene.add(sprite);
      glowMats.push(mat);
    };
    addGlow(innerTex, 3.2, 0.8);
    addGlow(haloTex, 6, 0.28);

    // ── Render / loop ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let elapsed = 0;
    let raf = 0;
    // Throttle to ~30fps on software rasterisers to keep the page responsive.
    const minFrameDt = software ? 1 / 30 : 0;
    let acc = 0;

    const drawScene = () => {
      material.uniforms.uTime.value = elapsed;
      galaxy.rotation.y = elapsed * ROT_SPEED;
      camera.position.x = Math.sin(elapsed * 0.06) * 0.7;
      camera.position.y = 10 + Math.sin(elapsed * 0.05) * 0.45;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      acc += dt;
      if (acc >= minFrameDt) {
        acc = 0;
        drawScene();
      }
      raf = requestAnimationFrame(tick);
    };

    if (prefersReduced) {
      drawScene(); // one static frame; galaxy still reads beautifully
    } else {
      clock.start();
      raf = requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else if (!prefersReduced && !raf) {
        clock.getDelta(); // discard the long hidden gap
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (prefersReduced) drawScene();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      quad.dispose();
      galaxyGeo.dispose();
      farGeo.dispose();
      material.dispose();
      innerTex.dispose();
      haloTex.dispose();
      glowMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [
    palette.id,
    palette.accent1,
    palette.accent2,
    palette.accent3,
    palette.accentWarm,
    reducedMotionEnabled,
  ]);

  return <div ref={mountRef} aria-hidden className="absolute inset-0" style={{ pointerEvents: "none" }} />;
}
