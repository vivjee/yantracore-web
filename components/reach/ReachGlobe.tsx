"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, LocateFixed, Maximize2, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Rise } from "@/components/motion/Rise";
import type { ChannelSlug } from "@/lib/content/channels";
import {
  type LiveEvent,
  PROJECT_COLOR,
  PROJECT_META,
  pickMessage,
  pickWeightedNode,
  projectNodeCount,
  reachArcs,
  reachNodeById,
  reachNodes,
} from "@/lib/content/reach";

type Filter = ChannelSlug | "all";

const SLUGS = PROJECT_META.map((p) => p.slug);

// ── Camera framing (earth radius 2) ──────────────────────────────────────────
const NEPAL = { lat: 28.2096, lng: 83.9856 };
const VIEW_DIST = 5.4; // settled, Nepal fills the hemisphere
const WORLD_DIST = 9.2; // "world view" — whole connected globe
const INTRO_DIST = 10.4; // cinematic fly-in start (near maxDistance)
const TILT = 0.16; // gentle look down over Nepal
const DIM = 0.1; // opacity of projects filtered out

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Lat/lng → point on a sphere of the given radius (texture-aligned). */
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const NEPAL_DIR = latLngToVector3(NEPAL.lat, NEPAL.lng, 1).normalize();

/** Camera position that frames Nepal dead-center at distance `d`. */
function nepalCameraPos(d: number) {
  const p = NEPAL_DIR.clone().multiplyScalar(d);
  p.y += TILT * d;
  return p.setLength(d);
}

/** Resolve the globe-local project palette from CSS vars (theme-aware) → hex. */
function resolveProjectColors(): Record<ChannelSlug, THREE.Color> {
  const root = typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const out = {} as Record<ChannelSlug, THREE.Color>;
  for (const slug of SLUGS) {
    const { var: cssVar, fallback } = PROJECT_COLOR[slug];
    const resolved = root?.getPropertyValue(cssVar).trim();
    out[slug] = new THREE.Color(resolved || fallback);
  }
  return out;
}

interface ViewApi {
  recenter: () => void;
  worldView: () => void;
}

function ReachGlobeViewport({
  isLive,
  activeProject,
  apiRef,
}: {
  isLive: boolean;
  activeProject: Filter;
  apiRef: React.MutableRefObject<ViewApi | null>;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isLiveRef = useRef(isLive);
  const activeRef = useRef<Filter>(activeProject);

  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);
  useEffect(() => {
    activeRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = resolveProjectColors();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160);
    camera.position.copy(nepalCameraPos(reduced ? VIEW_DIST : INTRO_DIST));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.0;
    controls.maxDistance = 11.0;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.7;
    controls.autoRotate = false;
    controls.target.set(0, 0, 0);

    // ── Camera tween (fly-in + recenter/world-view buttons) ──────────────────
    const tween = {
      active: false,
      t: 0,
      dur: 1,
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
    };
    const startTween = (to: THREE.Vector3, dur = 1.1) => {
      tween.active = true;
      tween.t = 0;
      tween.dur = dur;
      tween.from.copy(camera.position);
      tween.to.copy(to);
    };
    controls.addEventListener("start", () => {
      tween.active = false; // grabbing the globe hands control to the user
    });
    apiRef.current = {
      recenter: () => startTween(nepalCameraPos(VIEW_DIST), 1.1),
      worldView: () => startTween(nepalCameraPos(WORLD_DIST), 1.1),
    };
    if (!reduced) startTween(nepalCameraPos(VIEW_DIST), 2.2); // cinematic fly-in

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight("#dffaff", 0.62));
    const keyLight = new THREE.DirectionalLight("#e8fbff", 2.8);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight("#6d5dfc", 1.1);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // ── Earth + clouds + atmosphere (identity rotation: Nepal stays put) ─────
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: "#1d78c1",
      emissive: "#062447",
      emissiveIntensity: 0.2,
      roughness: 0.82,
      metalness: 0,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(2, 96, 96), earthMaterial);
    earthGroup.add(earth);

    const cloudsMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(2.025, 96, 96), cloudsMaterial);
    earthGroup.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 96, 96),
      new THREE.MeshBasicMaterial({ color: "#58d5ff", transparent: true, opacity: 0.12, side: THREE.BackSide }),
    );
    earthGroup.add(atmosphere);

    // ── Starfield ────────────────────────────────────────────────────────────
    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 2400; i += 1) {
      const r = 30 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      );
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: "#d9f7ff", size: 0.04, transparent: true, opacity: 0.6 }),
    );
    scene.add(stars);

    // ── Shared materials (per project) — filter dimming lerps these ──────────
    const coreMat: Record<ChannelSlug, THREE.MeshBasicMaterial> = {} as never;
    const haloMat: Record<ChannelSlug, THREE.MeshBasicMaterial> = {} as never;
    const arcPrimaryMat: Record<ChannelSlug, THREE.MeshBasicMaterial> = {} as never;
    const arcMeshMat: Record<ChannelSlug, THREE.MeshBasicMaterial> = {} as never;
    const pulseMat: Record<ChannelSlug, THREE.MeshBasicMaterial> = {} as never;
    for (const slug of SLUGS) {
      const color = colors[slug];
      coreMat[slug] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
      haloMat[slug] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false });
      arcPrimaryMat[slug] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
      arcMeshMat[slug] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.09 });
      pulseMat[slug] = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    }

    // ── Markers (shared geometries, scaled per node) ─────────────────────────
    const coreGeo = new THREE.SphereGeometry(1, 16, 16);
    const haloGeo = new THREE.SphereGeometry(1, 16, 16);
    const markers: Array<{ core: THREE.Mesh; halo: THREE.Mesh; base: number; slug: ChannelSlug; lat: number }> = [];
    for (const node of reachNodes) {
      const base = 0.018 + node.weight * 0.016;
      const pos = latLngToVector3(node.lat, node.lng, 2.08);
      const halo = new THREE.Mesh(haloGeo, haloMat[node.project]);
      halo.position.copy(pos);
      halo.scale.setScalar(base * 2.6);
      const core = new THREE.Mesh(coreGeo, coreMat[node.project]);
      core.position.copy(pos);
      core.scale.setScalar(base);
      earthGroup.add(halo, core);
      markers.push({ core, halo, base, slug: node.project, lat: node.lat });
    }

    // ── Arcs (primary spokes animate; mesh links are static) ─────────────────
    const arcGeos: THREE.BufferGeometry[] = [];
    const pulses: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; slug: ChannelSlug; delay: number }> = [];
    let primaryIndex = 0;
    for (const arc of reachArcs) {
      const a = reachNodeById.get(arc.from);
      const b = reachNodeById.get(arc.to);
      if (!a || !b) continue;
      const start = latLngToVector3(a.lat, a.lng, 2.12);
      const end = latLngToVector3(b.lat, b.lng, 2.12);
      const chord = start.distanceTo(end);
      const lift = Math.min(3.4, 2.45 + chord * 0.18);
      const mid = start.clone().add(end).normalize().multiplyScalar(lift);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const isPrimary = arc.kind === "primary";
      const tube = new THREE.TubeGeometry(curve, isPrimary ? 48 : 30, isPrimary ? 0.006 : 0.004, 6, false);
      arcGeos.push(tube);
      earthGroup.add(new THREE.Mesh(tube, isPrimary ? arcPrimaryMat[arc.project] : arcMeshMat[arc.project]));

      if (isPrimary) {
        const pulse = new THREE.Mesh(coreGeo, pulseMat[arc.project]);
        pulse.scale.setScalar(0.026);
        earthGroup.add(pulse);
        pulses.push({ mesh: pulse, curve, slug: arc.project, delay: (primaryIndex % 12) / 12 });
        primaryIndex += 1;
      }
    }

    // ── Textures ─────────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.load("/images/entryport/earth-atmos-2048.jpg", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      earthMaterial.map = texture;
      earthMaterial.color.set("#ffffff");
      earthMaterial.emissive.set("#000000");
      earthMaterial.needsUpdate = true;
    });
    loader.load("/images/entryport/earth-normal-2048.jpg", (texture) => {
      earthMaterial.normalMap = texture;
      earthMaterial.normalScale = new THREE.Vector2(0.55, 0.55);
      earthMaterial.needsUpdate = true;
    });
    loader.load("/images/entryport/earth-clouds-1024.png", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      cloudsMaterial.map = texture;
      cloudsMaterial.opacity = 0.34;
      cloudsMaterial.needsUpdate = true;
    });

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    // ── Render loop ──────────────────────────────────────────────────────────
    const curAlpha: Record<ChannelSlug, number> = { jimbo: 1, restroverse: 1, shramdan: 1, yantracore: 1 };
    const curScale: Record<ChannelSlug, number> = { jimbo: 1, restroverse: 1, shramdan: 1, yantracore: 1 };
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (tween.active) {
        tween.t = Math.min(1, tween.t + delta / tween.dur);
        camera.position.lerpVectors(tween.from, tween.to, easeOutCubic(tween.t));
        if (tween.t >= 1) tween.active = false;
      }
      controls.update();
      if (!reduced) clouds.rotation.y += delta * 0.012; // ambient drift (earth stays put)

      const live = isLiveRef.current;
      const active = activeRef.current;
      const haloPulse = reduced ? 0.15 : 0.1 + (0.5 + 0.5 * Math.sin(elapsed * 2)) * 0.1;

      for (const slug of SLUGS) {
        const matched = active === "all" || active === slug;
        curAlpha[slug] += ((matched ? 1 : DIM) - curAlpha[slug]) * 0.1;
        curScale[slug] += ((matched ? 1 : 0.72) - curScale[slug]) * 0.1;
        coreMat[slug].opacity = curAlpha[slug];
        haloMat[slug].opacity = haloPulse * curAlpha[slug];
        arcPrimaryMat[slug].opacity = 0.3 * curAlpha[slug];
        arcMeshMat[slug].opacity = 0.09 * curAlpha[slug];
        pulseMat[slug].opacity = 0.95 * curAlpha[slug];
      }

      if (live) {
        for (const m of markers) {
          const pulse = reduced ? 1 : 1 + Math.sin(elapsed * 2.4 + m.lat) * 0.16;
          m.core.scale.setScalar(m.base * curScale[m.slug] * pulse);
          m.halo.scale.setScalar(m.base * 2.6 * curScale[m.slug]);
        }
        if (!reduced) {
          for (const p of pulses) {
            const t = (elapsed * 0.16 + p.delay) % 1;
            p.mesh.position.copy(p.curve.getPointAt(t));
          }
        }
      } else {
        for (const m of markers) {
          m.core.scale.setScalar(m.base * curScale[m.slug]);
          m.halo.scale.setScalar(m.base * 2.6 * curScale[m.slug]);
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Pause the 3D render loop while the tab is hidden (no point burning the
    // GPU on an off-screen globe). Reset the clock delta on resume so motion
    // doesn't lurch after a long pause.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!frameId) {
        clock.getDelta();
        frameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      controls.dispose();
      apiRef.current = null;
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      coreGeo.dispose();
      haloGeo.dispose();
      arcGeos.forEach((g) => g.dispose());
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
    };
    // Scene is built once; live + filter state flow in through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full" />;
}

// ── Live feed simulation ───────────────────────────────────────────────────────
function makeEvent(active: Filter): LiveEvent {
  const node = pickWeightedNode(active);
  return {
    id: crypto.randomUUID(),
    stamp: new Date().toLocaleTimeString([], { hour12: false }),
    message: pickMessage(node),
    city: node.city,
    country: node.country,
    region: node.region,
    project: node.project,
  };
}

const SEED_TOTALS: Record<ChannelSlug, number> = {
  shramdan: 7320,
  restroverse: 5140,
  jimbo: 4280,
  yantracore: 3910,
};

function formatCompact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

export function ReachGlobe() {
  const [isLive, setIsLive] = useState(true);
  const [activeProject, setActiveProject] = useState<Filter>("all");
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState(20680);
  const [projectTotals, setProjectTotals] = useState<Record<ChannelSlug, number>>(SEED_TOTALS);

  const apiRef = useRef<ViewApi | null>(null);
  const activeRef = useRef<Filter>(activeProject);
  useEffect(() => {
    activeRef.current = activeProject;
  }, [activeProject]);

  // Seed the feed after mount via a timer so the client's first render still
  // matches the empty server HTML (Date/UUID would otherwise drift hydration),
  // and the setState lands in an async callback rather than the effect body.
  useEffect(() => {
    const id = setTimeout(() => setEvents(Array.from({ length: 7 }, () => makeEvent("all"))), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const next = makeEvent(activeRef.current);
      setEvents((current) => [next, ...current].slice(0, 14));
      setTotalEvents((current) => current + 1 + Math.floor(Math.random() * 3));
      setProjectTotals((current) => ({ ...current, [next.project]: current[next.project] + 1 }));
    }, 1700);
    return () => clearInterval(interval);
  }, [isLive]);

  const visibleEvents = useMemo(
    () => events.filter((e) => activeProject === "all" || e.project === activeProject).slice(0, 4),
    [events, activeProject],
  );
  const activeRegions = useMemo(() => new Set(events.map((e) => e.region)).size, [events]);
  const nepalShare = useMemo(() => {
    if (!events.length) return 0;
    return Math.round((events.filter((e) => e.region === "Nepal").length / events.length) * 100);
  }, [events]);

  const recenter = useCallback(() => apiRef.current?.recenter(), []);
  const worldView = useCallback(() => apiRef.current?.worldView(), []);

  return (
    <div className="relative h-full w-full overflow-hidden text-text-hi">
      <ReachGlobeViewport isLive={isLive} activeProject={activeProject} apiRef={apiRef} />

      {/* Ambient vignette so HUD text stays legible over the globe */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(3,7,18,0.55), transparent 40%), radial-gradient(120% 90% at 50% 100%, rgba(3,7,18,0.7), transparent 42%)",
        }}
      />

      {/* ── Top bar: identity + project filter chips ── */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex flex-wrap items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
        <Rise delay={0.1} x={-12} className="pointer-events-auto">
          <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-low">
              <Globe2 className="h-3.5 w-3.5 text-accent-2" />
              Reach · Live Activity
            </div>
            <h1 className="mt-1 max-w-[16rem] font-display text-lg font-semibold leading-tight tracking-tight text-text-hi sm:text-xl">
              Our projects, in motion
            </h1>
            <div className="mt-2 flex items-center gap-3 font-mono text-[10px] text-text-mid">
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "animate-pulse bg-emerald-400" : "bg-text-faint"}`} />
                {isLive ? "Live" : "Paused"}
              </span>
              <span className="text-text-low">·</span>
              <span className="text-text-hi">{totalEvents.toLocaleString()}</span>
              <span>events</span>
              <span className="hidden xs:inline text-text-low">·</span>
              <span className="hidden xs:inline text-text-hi">{activeRegions}</span>
              <span className="hidden xs:inline">regions</span>
              <span className="hidden sm:inline text-text-low">·</span>
              <span className="hidden sm:inline text-emerald-300">{nepalShare}% Nepal</span>
            </div>
          </div>
        </Rise>

        <Rise delay={0.2} x={12} className="pointer-events-auto">
          <div className="flex flex-wrap justify-end gap-1.5">
            <FilterChip
              label="All"
              count={reachNodes.length}
              active={activeProject === "all"}
              onClick={() => setActiveProject("all")}
            />
            {PROJECT_META.map((p) => (
              <FilterChip
                key={p.slug}
                label={p.name}
                color={p.colorVar}
                count={formatCompact(projectTotals[p.slug])}
                sub={`${projectNodeCount(p.slug)} hubs`}
                active={activeProject === p.slug}
                onClick={() => setActiveProject(p.slug)}
              />
            ))}
          </div>
        </Rise>
      </div>

      {/* ── Live ticker (compact) ── */}
      <Rise delay={0.34} y={12} className="pointer-events-none absolute bottom-3 left-3 right-[7.25rem] z-20 sm:bottom-4 sm:left-4 sm:right-auto sm:w-[min(88vw,24rem)]">
        <div className="pointer-events-auto rounded-lg border border-white/10 bg-black/40 p-2.5 backdrop-blur-md">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-text-low">
            <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "animate-ping bg-emerald-400" : "bg-text-faint"}`} />
            {activeProject === "all" ? "Live feed" : `${PROJECT_META.find((p) => p.slug === activeProject)?.name} feed`}
          </div>
          <ul className="space-y-1">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleEvents.map((event) => (
                <motion.li
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 font-mono text-[10px] leading-tight"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: `var(${PROJECT_COLOR[event.project].var})` }}
                  />
                  <span className="truncate text-text-mid">
                    <span className="text-text-faint">[{event.stamp}]</span> {event.message}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </Rise>

      {/* ── Controls ── */}
      <Rise delay={0.34} y={12} className="pointer-events-none absolute bottom-3 right-3 z-20 sm:bottom-4 sm:right-4">
        <div className="pointer-events-auto flex gap-1.5">
          <ControlButton label={isLive ? "Pause" : "Resume"} onClick={() => setIsLive((v) => !v)}>
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </ControlButton>
          <ControlButton label="Nepal" onClick={recenter}>
            <LocateFixed className="h-3.5 w-3.5" />
          </ControlButton>
          <ControlButton label="World" onClick={worldView}>
            <Maximize2 className="h-3.5 w-3.5" />
          </ControlButton>
        </div>
      </Rise>
    </div>
  );
}

function FilterChip({
  label,
  count,
  sub,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number | string;
  sub?: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={sub}
      className={`group inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 backdrop-blur-md transition ${
        active ? "border-white/30 bg-white/[0.08]" : "border-white/10 bg-black/40 hover:border-white/20"
      }`}
      style={active && color ? { borderColor: `var(${color})`, background: `color-mix(in srgb, var(${color}) 16%, transparent)` } : undefined}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: color ? `var(${color})` : "var(--text-mid)" }}
      />
      <span className={`text-[11px] font-medium ${active ? "text-text-hi" : "text-text-mid"}`}>{label}</span>
      <span className="font-mono text-[10px] text-text-low">{count}</span>
    </button>
  );
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 text-[10px] uppercase tracking-[0.14em] text-text-hi backdrop-blur-md transition hover:border-white/25"
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
