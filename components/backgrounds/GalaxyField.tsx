"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { useTheme } from "@/lib/theme/ThemeProvider";

/**
 * GalaxyField — a slowly rotating spiral galaxy of twinkling stars, drawn in
 * WebGL as the base background layer behind the entire site.
 *
 * Imperative three.js (no react-three-fiber), like ReachGlobe: one Scene +
 * WebGLRenderer in a useEffect, a manual rAF loop, full disposal on unmount.
 *
 * The renderer is OPAQUE (clears to ink-black) and sits at the bottom of
 * SiteBackground, so it IS the backdrop — the faint CSS nebula / light cones
 * wash over it. Opaque rendering also lets UnrealBloomPass bloom cleanly
 * (bloom over a transparent canvas produces muddy halos), and bloom is what
 * turns a field of points into a glowing galaxy.
 *
 * Stars are additive Points along parametric spiral arms (the classic Three.js
 * galaxy generator): a hot near-white core fading out to violet/cyan arms with
 * a few pink stars, every point with its own soft glow and twinkle phase.
 *
 * Lifecycle (matched from ReachGlobe / the music page):
 *   • prefers-reduced-motion (OS or in-app toggle) → render ONE static frame.
 *   • pause the rAF loop while the tab is hidden.
 *   • skip entirely on coarse-pointer (touch) devices — too costly there.
 *   • cap devicePixelRatio (bloom is forgiving, so we cap low for perf).
 */

const STAR_COUNT = 28000; // spiral-arm stars
const FAR_COUNT = 1100; // distant depth stars (static shell)
const GAL_RADIUS = 9;
const BRANCHES = 3;
const SPIN = 0.5; // radians of winding per unit radius — low, so arms stay open (not ringed)
const RANDOMNESS = 0.13;
const RANDOMNESS_POWER = 2.8;
const DISK_THICKNESS = 0.24;
const BASE_SIZE = 62;
const ROT_SPEED = 0.045; // radians / second
const CLEAR_COLOR = 0x05060d;

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSize;

  attribute float aScale;
  attribute float aSeed;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Per-star twinkle: each star has its own phase + speed, pulsing brightness
    // between ~0.35 and 1.0 (lively but not strobing).
    float tw = sin(uTime * (0.5 + aSeed * 1.7) + aSeed * 6.2831853);
    vTwinkle = 0.675 + 0.325 * tw;

    // Size attenuation: bigger near the camera, with DPR folded into uSize.
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);

    vColor = aColor;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft round star: bright core + generous halo (no hard square edges).
    float d = distance(gl_PointCoord, vec2(0.5));
    float s = clamp(1.0 - d * 2.0, 0.0, 1.0);
    float core = pow(s, 3.5);
    float halo = pow(s, 1.3) * 0.55;
    float alpha = (core + halo) * vTwinkle;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * (0.85 + 0.6 * vTwinkle), alpha);
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

export function GalaxyField() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { palette, reducedMotionEnabled } = useTheme();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Skip the WebGL galaxy on touch devices — the rAF loop + bloom pass is the
    // single biggest constant GPU cost and a prime flicker source there. The
    // static nebula + light cones in SiteBackground carry the backdrop instead.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || reducedMotionEnabled;

    // ── Scene / camera / renderer ────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CLEAR_COLOR);

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // Pulled back + a ~45° tilt so the whole spiral reads as one object (arms
    // curling around the centred Sun) rather than a near-edge-on smear.
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 300);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(CLEAR_COLOR, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Cap DPR low: bloom is blurry by nature, so the extra resolution buys
    // little but costs a lot on a permanently-running background.
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    // ── Shared additive star material ────────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: BASE_SIZE * pixelRatio },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // ── Palette (hot near-white core → violet/cyan arms, a few pink stars) ────
    const inside = new THREE.Color(palette.accentWarm).lerp(new THREE.Color("#ffffff"), 0.72);
    const violet = new THREE.Color(palette.accent1);
    const cyan = new THREE.Color(palette.accent2);
    const pink = new THREE.Color(palette.accent3);

    // ── Galaxy geometry ──────────────────────────────────────────────────────
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);
    const seeds = new Float32Array(STAR_COUNT);
    const tmp = new THREE.Color();

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Roughly uniform radius — the visible spiral arms (not the orb-occluded
      // nucleus) are the hero, so keep them well populated out to the rim.
      const radius = Math.pow(Math.random(), 0.95) * GAL_RADIUS;
      const radiusNorm = radius / GAL_RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = radius * SPIN;

      const scatter = () =>
        Math.pow(Math.random(), RANDOMNESS_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        (radius + 0.6);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatter();
      positions[i3 + 1] = scatter() * DISK_THICKNESS;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatter();

      // Colour: warm core → rim colour (mostly violet, some cyan, a few pink).
      const pick = Math.random();
      const rim = pick > 0.9 ? pink : pick > 0.5 ? cyan : violet;
      tmp.copy(inside).lerp(rim, Math.pow(radiusNorm, 0.55));
      // Bright throughout (arms must read), with a gentle inner boost + variance.
      const brightness = (2.0 - radiusNorm * 0.45) * (0.9 + Math.random() * 0.8);
      colors[i3] = tmp.r * brightness;
      colors[i3 + 1] = tmp.g * brightness;
      colors[i3 + 2] = tmp.b * brightness;

      // Mostly small stars with a scattering of bright giants.
      scales[i] = (0.45 + Math.random() * 0.7) * (i % 29 === 0 ? 2.1 : 1);
      seeds[i] = Math.random();
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    galaxyGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    galaxyGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const galaxy = new THREE.Points(galaxyGeo, material);
    scene.add(galaxy);

    // ── Distant depth starfield (static shell behind the galaxy) ──────────────
    const farPos = new Float32Array(FAR_COUNT * 3);
    const farColor = new Float32Array(FAR_COUNT * 3);
    const farScale = new Float32Array(FAR_COUNT);
    const farSeed = new Float32Array(FAR_COUNT);
    const farTint = new THREE.Color("#aab6e6");

    for (let i = 0; i < FAR_COUNT; i++) {
      const i3 = i * 3;
      const r = 30 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      farPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      farPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      farPos[i3 + 2] = r * Math.cos(phi);
      const b = 0.4 + Math.random() * 0.5;
      farColor[i3] = farTint.r * b;
      farColor[i3 + 1] = farTint.g * b;
      farColor[i3 + 2] = farTint.b * b;
      farScale[i] = 0.6 + Math.random() * 0.9;
      farSeed[i] = Math.random();
    }

    const farGeo = new THREE.BufferGeometry();
    farGeo.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
    farGeo.setAttribute("aColor", new THREE.BufferAttribute(farColor, 3));
    farGeo.setAttribute("aScale", new THREE.BufferAttribute(farScale, 1));
    farGeo.setAttribute("aSeed", new THREE.BufferAttribute(farSeed, 1));

    const farStars = new THREE.Points(farGeo, material);
    scene.add(farStars);

    // ── Bright galactic core glow (warm inner + violet halo) ──────────────────
    const innerTex = makeGlowTexture([
      [0, "rgba(255, 248, 232, 1)"],
      [0.25, "rgba(255, 224, 184, 0.7)"],
      [0.6, "rgba(190, 150, 255, 0.18)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const haloTex = makeGlowTexture([
      [0, "rgba(150, 130, 255, 0.5)"],
      [0.4, "rgba(110, 86, 255, 0.18)"],
      [1, "rgba(0, 0, 0, 0)"],
    ]);
    const makeGlowSprite = (tex: THREE.Texture, scale: number, opacity: number) => {
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
      return mat;
    };
    const innerMat = makeGlowSprite(innerTex, 3.5, 0.85);
    const haloMat = makeGlowSprite(haloTex, 7, 0.28);

    // ── Bloom composer (the glow that makes points read as a galaxy) ──────────
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.0, // strength
      0.5, // radius — tighter, so it glows stars without smearing arms into a disc
      0.0, // threshold — bloom everything, so the whole spiral glows
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ── Render / loop ─────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let elapsed = 0;
    let raf = 0;

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05); // clamp to avoid jumps after pause
      elapsed += dt;
      material.uniforms.uTime.value = elapsed;
      galaxy.rotation.y = elapsed * ROT_SPEED;
      // Subtle camera drift so the scene feels alive without parallax input.
      camera.position.x = Math.sin(elapsed * 0.06) * 0.7;
      camera.position.y = 10 + Math.sin(elapsed * 0.05) * 0.45;
      camera.lookAt(0, 0, 0);
      composer.render();
    };

    const tick = () => {
      renderFrame();
      raf = requestAnimationFrame(tick);
    };

    if (prefersReduced) {
      renderFrame(); // one static frame; galaxy still reads beautifully
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
      composer.setSize(width, height);
      bloom.setSize(width, height);
      if (prefersReduced) renderFrame();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      galaxyGeo.dispose();
      farGeo.dispose();
      material.dispose();
      innerTex.dispose();
      haloTex.dispose();
      innerMat.dispose();
      haloMat.dispose();
      composer.dispose();
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
