"use client";

import { Activity, Crosshair, Gauge, Globe2, LocateFixed, Pause, Play, RefreshCw, Satellite } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type ActivityKind = "Aid" | "Build" | "Food" | "Learning" | "Signal";

interface ActivityPoint {
  city: string;
  country: string;
  lat: number;
  lng: number;
  kind: ActivityKind;
  weight: number;
}

interface LiveEvent extends ActivityPoint {
  id: string;
  stamp: string;
  message: string;
}

const NEPAL_HUB: ActivityPoint = {
  city: "Pokhara",
  country: "Nepal",
  lat: 28.2096,
  lng: 83.9856,
  kind: "Signal",
  weight: 1,
};

const ACTIVITY_POINTS: ActivityPoint[] = [
  { city: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.324, kind: "Aid", weight: 1.4 },
  { city: "Pokhara", country: "Nepal", lat: 28.2096, lng: 83.9856, kind: "Build", weight: 1.5 },
  { city: "Lalitpur", country: "Nepal", lat: 27.6588, lng: 85.3247, kind: "Learning", weight: 1.2 },
  { city: "Biratnagar", country: "Nepal", lat: 26.4525, lng: 87.2718, kind: "Food", weight: 1.1 },
  { city: "Nepalgunj", country: "Nepal", lat: 28.05, lng: 81.6167, kind: "Aid", weight: 1.1 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, kind: "Signal", weight: 0.7 },
  { city: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, kind: "Build", weight: 0.6 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, kind: "Learning", weight: 0.65 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, kind: "Signal", weight: 0.65 },
  { city: "London", country: "UK", lat: 51.5072, lng: -0.1276, kind: "Aid", weight: 0.55 },
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006, kind: "Food", weight: 0.5 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, kind: "Build", weight: 0.5 },
];

const KIND_TONE: Record<ActivityKind, string> = {
  Aid: "#6ee7b7",
  Build: "#60a5fa",
  Food: "#f59e0b",
  Learning: "#c084fc",
  Signal: "#22d3ee",
};

const EVENT_COPY: Record<ActivityKind, string[]> = {
  Aid: ["relief team check-in", "medical supply request", "field volunteer ping"],
  Build: ["repair crew active", "site material moved", "community build logged"],
  Food: ["meal distribution update", "kitchen capacity synced", "ration route confirmed"],
  Learning: ["training session joined", "mentor response logged", "classroom node active"],
  Signal: ["entryport relay opened", "global sync packet", "regional heartbeat"],
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function pickWeightedPoint() {
  const nepalBias = Math.random() < 0.68;
  const pool = nepalBias ? ACTIVITY_POINTS.filter((point) => point.country === "Nepal") : ACTIVITY_POINTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function makeEvent(): LiveEvent {
  const point = pickWeightedPoint();
  const messages = EVENT_COPY[point.kind];

  return {
    ...point,
    id: crypto.randomUUID(),
    stamp: new Date().toLocaleTimeString([], { hour12: false }),
    message: messages[Math.floor(Math.random() * messages.length)],
  };
}

function ThreeEarthViewport({ isLive, focusNepal }: { isLive: boolean; focusNepal: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isLiveRef = useRef(isLive);

  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    camera.position.set(0, 0.35, 5.25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.4;
    controls.maxDistance = 7.2;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.65;
    controls.autoRotate = isLive;
    controls.autoRotateSpeed = focusNepal ? 0.26 : 0.38;

    scene.add(new THREE.AmbientLight("#dffaff", 0.62));
    const keyLight = new THREE.DirectionalLight("#e8fbff", 2.8);
    keyLight.position.set(5, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight("#6d5dfc", 1.1);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.set(0.04, -0.52, 0);
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

    const starGeometry = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < 1600; i += 1) {
      const radius = 28 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({ color: "#d9f7ff", size: 0.035, transparent: true, opacity: 0.65 }),
      ),
    );

    const markers: Array<{ marker: THREE.Mesh; halo: THREE.Mesh; point: ActivityPoint }> = [];
    ACTIVITY_POINTS.forEach((point) => {
      const color = KIND_TONE[point.kind];
      const position = latLngToVector3(point.lat, point.lng, 2.08);
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.045 * point.weight, 24, 24),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false }),
      );
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.024 * point.weight, 24, 24),
        new THREE.MeshBasicMaterial({ color }),
      );
      halo.position.copy(position);
      marker.position.copy(position);
      earthGroup.add(halo, marker);
      markers.push({ marker, halo, point });
    });

    const pulseMeshes: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; delay: number }> = [];
    ACTIVITY_POINTS.filter((point) => point.city !== "Pokhara")
      .slice(0, focusNepal ? 8 : 11)
      .forEach((point, index) => {
        const start = latLngToVector3(NEPAL_HUB.lat, NEPAL_HUB.lng, 2.12);
        const end = latLngToVector3(point.lat, point.lng, 2.12);
        const arcLift = 2.78 + ((Math.abs(point.lat * 17 + point.lng * 11) % 32) / 100);
        const mid = start.clone().add(end).normalize().multiplyScalar(arcLift);
        const curve = new THREE.CatmullRomCurve3([start, mid, end]);
        const tone = KIND_TONE[point.kind];

        earthGroup.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(curve, 72, 0.006, 8, false),
            new THREE.MeshBasicMaterial({ color: tone, transparent: true, opacity: 0.28 }),
          ),
        );

        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 16, 16),
          new THREE.MeshBasicMaterial({ color: tone, transparent: true, opacity: 0.96 }),
        );
        earthGroup.add(pulse);
        pulseMeshes.push({ mesh: pulse, curve, delay: index / 11 });
      });

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

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      controls.autoRotate = isLiveRef.current;
      controls.update();

      if (isLiveRef.current) {
        earth.rotation.y += delta * 0.045;
        clouds.rotation.y += delta * 0.062;
      }

      markers.forEach(({ marker, halo, point }) => {
        const pulse = 1 + Math.sin(elapsed * 2.8 + point.lat) * 0.24;
        marker.scale.setScalar(isLiveRef.current ? pulse : 1);
        halo.scale.setScalar(isLiveRef.current ? 1.8 + pulse * 0.35 : 1.7);
        const haloMaterial = halo.material as THREE.MeshBasicMaterial;
        haloMaterial.opacity = isLiveRef.current ? 0.12 + Math.max(0, Math.sin(elapsed * 2 + point.lng)) * 0.18 : 0.1;
      });

      pulseMeshes.forEach(({ mesh, curve, delay }) => {
        const t = isLiveRef.current ? (elapsed * 0.16 + delay) % 1 : delay % 1;
        mesh.position.copy(curve.getPointAt(t));
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else {
          material?.dispose();
        }
      });
    };
  }, [focusNepal, isLive]);

  return <div ref={mountRef} className="absolute inset-0 [&_canvas]:!h-full [&_canvas]:!w-full" />;
}

function MetricTile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-black/35 px-3 py-2">
      <span className="block text-[8px] uppercase tracking-[0.18em] text-text-low font-mono">{label}</span>
      <span className="mt-1 block text-base font-mono font-semibold text-text-hi" style={{ color: tone }}>
        {value}
      </span>
    </div>
  );
}

export function EntryportGlobe() {
  const [isLive, setIsLive] = useState(true);
  const [focusNepal, setFocusNepal] = useState(true);
  const [events, setEvents] = useState<LiveEvent[]>(() => Array.from({ length: 8 }, makeEvent));
  const [totalEvents, setTotalEvents] = useState(1842);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const next = makeEvent();
      setEvents((current) => [next, ...current].slice(0, 9));
      setTotalEvents((current) => current + 1 + Math.floor(Math.random() * 4));
    }, 1800);

    return () => clearInterval(interval);
  }, [isLive]);

  const nepalShare = useMemo(() => Math.round((events.filter((event) => event.country === "Nepal").length / events.length) * 100), [events]);
  const activeRegions = useMemo(() => new Set(events.map((event) => event.country)).size + 5, [events]);

  return (
    <div className="relative h-full w-full overflow-hidden text-text-hi">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent-2) 26%, transparent), transparent 34%), radial-gradient(circle at 18% 18%, rgba(34, 211, 238, 0.16), transparent 26%), radial-gradient(circle at 82% 78%, rgba(245, 158, 11, 0.12), transparent 24%)",
        }}
      />

      <div className="relative z-10 grid h-full grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_320px] gap-4 p-4 md:p-5">
        <aside className="order-2 xl:order-1 flex min-h-0 flex-col gap-3">
          <section className="glass-medium rounded-[8px] border border-white/[0.07] p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-text-low font-mono">
              <Satellite className="h-3.5 w-3.5 text-accent-2" />
              Entryport Status
            </div>
            <h1 className="mt-2 font-display text-xl font-semibold tracking-tight text-text-hi">GLOBAL_ACTIVITY_EARTH</h1>
            <p className="mt-2 text-xs leading-5 text-text-low">
              Simulated live activity monitor with Nepal as the primary origin and global field nodes orbiting the feed.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <MetricTile label="Events" value={totalEvents.toLocaleString()} tone="var(--accent-1)" />
            <MetricTile label="Nepal Share" value={`${nepalShare}%`} tone="#6ee7b7" />
            <MetricTile label="Regions" value={`${activeRegions}`} tone="#22d3ee" />
            <MetricTile label="Latency" value="42ms" tone="#f59e0b" />
          </section>

          <section className="glass-medium min-h-0 flex-1 rounded-[8px] border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-text-low font-mono">
                <Activity className="h-3.5 w-3.5 text-accent-1" />
                Event Feed
              </span>
              <span className="flex items-center gap-1 text-[8px] uppercase tracking-[0.14em] text-emerald-300 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live
              </span>
            </div>
            <div className="space-y-2 overflow-hidden">
              {events.map((event) => (
                <div key={event.id} className="rounded-md border border-white/[0.06] bg-black/30 px-3 py-2 font-mono">
                  <div className="flex items-center justify-between gap-2 text-[9px]">
                    <span className="text-text-faint">[{event.stamp}]</span>
                    <span style={{ color: KIND_TONE[event.kind] }}>{event.kind}</span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-text-hi">{event.message}</p>
                  <p className="mt-0.5 truncate text-[9px] text-text-low">
                    {event.city}, {event.country}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <main className="order-1 xl:order-2 relative min-h-[420px] overflow-hidden rounded-[8px] border border-white/[0.08] bg-black/50">
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
            <div className="absolute h-[min(62vw,62vh)] w-[min(62vw,62vh)] max-h-[560px] max-w-[560px] min-h-[260px] min-w-[260px] rounded-full border border-cyan-200/10 animate-[ring-spin-cw_48s_linear_infinite]" />
            <div className="absolute h-[min(50vw,50vh)] w-[min(50vw,50vh)] max-h-[450px] max-w-[450px] min-h-[220px] min-w-[220px] rounded-full border border-dashed border-white/10 animate-[ring-spin-ccw_72s_linear_infinite]" />
            <div
              className="relative h-[min(38vw,46vh)] w-[min(38vw,46vh)] max-h-[390px] max-w-[390px] min-h-[210px] min-w-[210px] overflow-hidden rounded-full border border-cyan-200/20 bg-[#113d78] shadow-[0_0_70px_rgba(34,211,238,0.30),inset_-32px_-20px_46px_rgba(0,0,0,0.55),inset_20px_10px_34px_rgba(255,255,255,0.12)]"
            >
              <div
                className="absolute inset-0 scale-110 opacity-95 animate-[ring-spin-cw_80s_linear_infinite]"
                style={{
                  backgroundImage: "url('/images/entryport/earth-atmos-2048.jpg')",
                  backgroundSize: "205% 100%",
                  backgroundPosition: focusNepal ? "57% center" : "center",
                }}
              />
              <div
                className="absolute inset-[-2%] opacity-45 mix-blend-screen animate-[ring-spin-cw_95s_linear_infinite]"
                style={{
                  backgroundImage: "url('/images/entryport/earth-clouds-1024.png')",
                  backgroundSize: "190% 100%",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.28),transparent_22%),radial-gradient(circle_at_65%_62%,transparent_35%,rgba(0,0,0,0.46)_78%)]" />
            </div>
            {ACTIVITY_POINTS.slice(0, focusNepal ? 8 : 12).map((point, index) => (
              <span
                key={`${point.city}-fallback`}
                className="absolute h-2 w-2 rounded-full shadow-[0_0_16px_currentColor]"
                style={{
                  color: KIND_TONE[point.kind],
                  background: KIND_TONE[point.kind],
                  left: `${48 + Math.cos(index * 0.92) * (focusNepal && point.country === "Nepal" ? 13 : 25)}%`,
                  top: `${50 + Math.sin(index * 0.92) * (focusNepal && point.country === "Nepal" ? 12 : 24)}%`,
                  animation: "radar-pulse 2.4s ease-out infinite",
                  animationDelay: `${index * 0.16}s`,
                }}
              />
            ))}
          </div>
          <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLive((current) => !current)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-black/45 px-3 text-[10px] uppercase tracking-[0.14em] text-text-hi backdrop-blur transition hover:border-white/20"
            >
              {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isLive ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => setFocusNepal((current) => !current)}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-black/45 px-3 text-[10px] uppercase tracking-[0.14em] text-text-hi backdrop-blur transition hover:border-white/20"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {focusNepal ? "Nepal Focus" : "World View"}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 rounded-md border border-white/[0.08] bg-black/45 px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-text-low backdrop-blur font-mono">
            <span>Drag to rotate</span>
            <span>Scroll or pinch to zoom</span>
            <span>Arcs originate from Nepal</span>
          </div>

          <ThreeEarthViewport isLive={isLive} focusNepal={focusNepal} />
        </main>

        <aside className="order-3 flex min-h-0 flex-col gap-3">
          <section className="glass-medium rounded-[8px] border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-text-low font-mono">
                <Gauge className="h-3.5 w-3.5 text-accent-3" />
                Regional Load
              </span>
              <button
                type="button"
                onClick={() => {
                  setEvents(Array.from({ length: 8 }, makeEvent));
                  setTotalEvents((current) => current + 12);
                }}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/25 text-text-mid transition hover:text-text-hi"
                aria-label="Refresh activity simulation"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                ["Nepal", 86, "#6ee7b7"],
                ["Gulf Corridor", 58, "#22d3ee"],
                ["Asia Pacific", 44, "#c084fc"],
                ["Europe", 31, "#60a5fa"],
                ["Americas", 24, "#f59e0b"],
              ].map(([label, value, tone]) => (
                <div key={label as string}>
                  <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-text-low font-mono">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: tone as string }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-medium flex-1 rounded-[8px] border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-text-low font-mono">
              <Crosshair className="h-3.5 w-3.5 text-accent-2" />
              Active Categories
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(KIND_TONE) as ActivityKind[]).map((kind, index) => (
                <div key={kind} className="flex items-center justify-between rounded-md border border-white/[0.06] bg-black/30 px-3 py-2">
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-text-mid font-mono">
                    <span className="h-2 w-2 rounded-full" style={{ background: KIND_TONE[kind] }} />
                    {kind}
                  </span>
                  <span className="font-mono text-[10px] text-text-hi">{Math.max(7, 34 - index * 5)} nodes</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-200 font-mono">
              <Globe2 className="h-3.5 w-3.5" />
              v1 Simulation
            </div>
            <p className="mt-2 text-xs leading-5 text-text-low">
              Current feed is generated locally for the entryport concept. The globe is ready for real event coordinates when the API exists.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
