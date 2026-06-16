"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme/ThemeProvider";

/**
 * GalaxyField — a slowly rotating spiral galaxy of twinkling stars, drawn in
 * WebGL behind the entire site.
 *
 * Follows the same imperative three.js pattern as ReachGlobe (no react-three-
 * fiber): one Scene + WebGLRenderer created in a useEffect, a manual rAF loop,
 * full disposal on unmount. The renderer is transparent (alpha) so the toned
 * nebula gradients in SiteBackground show through beneath it.
 *
 * Stars are a single additive Points cloud distributed along parametric spiral
 * arms (the classic Three.js galaxy generator), coloured warm→cool from a
 * bright core out to the rim using the live theme palette. A custom shader
 * gives each point a soft circular glow and an independent twinkle.
 *
 * Lifecycle conventions, matched from ReachGlobe / the music page:
 *   • prefers-reduced-motion (OS or in-app toggle) → render ONE static frame,
 *     never start the loop.
 *   • pause the rAF loop while the tab is hidden (visibilitychange).
 *   • cap devicePixelRatio (lower on coarse pointers).
 */

const STAR_COUNT = 12000; // spiral-arm stars
const FAR_COUNT = 900; // distant depth stars (static shell)
const GAL_RADIUS = 10;
const BRANCHES = 4;
const SPIN = 0.85;
const RANDOMNESS = 0.32;
const RANDOMNESS_POWER = 2.6;
const DISK_THICKNESS = 0.34;
const BASE_SIZE = 16;
const ROT_SPEED = 0.04; // radians / second

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

    // Per-star twinkle: each star has its own phase + speed, gently pulsing
    // brightness between ~0.2 and 1.0 (restrained, not strobing).
    float tw = sin(uTime * (0.5 + aSeed * 1.6) + aSeed * 6.2831853);
    vTwinkle = 0.6 + 0.4 * tw;

    // Size attenuation: bigger near the camera, with DPR folded into uSize.
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);

    vColor = aColor;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // Soft round star: tight bright core + faint halo (no hard square edges).
    float d = distance(gl_PointCoord, vec2(0.5));
    float s = clamp(1.0 - d * 2.0, 0.0, 1.0);
    float core = pow(s, 6.0);
    float halo = pow(s, 1.6) * 0.4;
    float alpha = (core + halo) * vTwinkle;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * (0.7 + 0.6 * vTwinkle), alpha);
  }
`;

/** Soft radial sprite for the bright galactic core glow. */
function makeCoreGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 244, 224, 0.9)");
  g.addColorStop(0.2, "rgba(255, 226, 190, 0.5)");
  g.addColorStop(0.5, "rgba(180, 150, 255, 0.16)");
  g.addColorStop(1, "rgba(0, 0, 0, 0)");
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

    // Mobile performance mode: the WebGL galaxy (~12.9k additive points + a rAF
    // loop) is the single biggest constant GPU cost on touch devices and a prime
    // flicker source — skip it entirely there (no context, no loop). The static
    // nebula + light cones in SiteBackground carry the backdrop instead.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || reducedMotionEnabled;

    // ── Scene / camera / renderer ────────────────────────────────────────────
    const scene = new THREE.Scene();

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 120);
    camera.position.set(0, 4.2, 8.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
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
      blending: THREE.AdditiveBlending,
    });

    // ── Palette (warm bright core → cool violet/cyan rim, a few pink stars) ───
    const inside = new THREE.Color(palette.accentWarm).lerp(new THREE.Color("#ffffff"), 0.55);
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
      const radius = Math.random() * GAL_RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = radius * SPIN;

      const scatter = () =>
        Math.pow(Math.random(), RANDOMNESS_POWER) *
        (Math.random() < 0.5 ? 1 : -1) *
        RANDOMNESS *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + scatter();
      positions[i3 + 1] = scatter() * DISK_THICKNESS;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + scatter();

      // Colour: lerp from warm core to a rim colour (mostly violet, some cyan,
      // a few pink), then desaturate a touch toward cool white.
      const pick = Math.random();
      const rim = pick > 0.92 ? pink : pick > 0.55 ? cyan : violet;
      tmp.copy(inside).lerp(rim, Math.pow(radius / GAL_RADIUS, 0.6));
      tmp.lerp(new THREE.Color("#cfe0ff"), 0.12);
      const brightness = 0.7 + Math.random() * 0.45;
      colors[i3] = tmp.r * brightness;
      colors[i3 + 1] = tmp.g * brightness;
      colors[i3 + 2] = tmp.b * brightness;

      // A handful of bright "giant" stars among many faint ones.
      scales[i] = (0.4 + Math.random() * 0.8) * (i % 37 === 0 ? 1.9 : 1);
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
      const r = 28 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      farPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      farPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      farPos[i3 + 2] = r * Math.cos(phi);
      const b = 0.35 + Math.random() * 0.4;
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

    // ── Bright galactic core glow ─────────────────────────────────────────────
    const glowTex = makeCoreGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });
    const coreGlow = new THREE.Sprite(glowMat);
    coreGlow.scale.set(7, 7, 1);
    scene.add(coreGlow);

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
      camera.position.x = Math.sin(elapsed * 0.06) * 0.4;
      camera.position.y = 4.2 + Math.sin(elapsed * 0.05) * 0.2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
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
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
      glowTex.dispose();
      glowMat.dispose();
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
