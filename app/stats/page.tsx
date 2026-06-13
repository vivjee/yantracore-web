"use client";

import { useState, useEffect, useRef } from "react";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { StaggerContainer, StaggerItem } from "@/components/motion/AnimationWrappers";
import {
  Activity,
  Cpu,
  Globe,
  Database,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Terminal,
  Flame,
  HardDrive,
  CheckCircle2,
} from "lucide-react";

interface RequestLog {
  timestamp: string;
  model: string;
  method: string;
  path: string;
  status: number;
  latency: number;
  origin: string;
  id: string;
}

const MODELS = [
  { name: "yantra-vision-v4", color: "var(--accent-1)", latencyBase: 38 },
  { name: "yantra-instruct-v2", color: "var(--accent-2)", latencyBase: 45 },
  { name: "restro-recommender-v1", color: "var(--accent-3)", latencyBase: 22 },
];

const ORIGINS = ["Pokhara", "Tokyo", "Berlin", "San Francisco", "London", "Bangalore", "Sydney", "New York"];
const PATHS = ["/v1/vision/analyze", "/v1/chat/completions", "/v2/curate", "/v1/embeddings", "/v1/moderation"];

export default function StatsPage() {
  const [isLive, setIsLive] = useState(true);
  const [reqsPerMin, setReqsPerMin] = useState(1284);
  const [p50Latency, setP50Latency] = useState(42);
  const [cpuTemp, setCpuTemp] = useState(58.4);
  const [gpuLoad, setGpuLoad] = useState(72);
  const [ramLoad, setRamLoad] = useState(28.4);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [throughputHistory, setThroughputHistory] = useState<number[]>([1220, 1245, 1210, 1260, 1284, 1250, 1275, 1260, 1290, 1284, 1292, 1284]);
  const [successErrorHistory, setSuccessErrorHistory] = useState<Array<{ success: number; error: number }>>([
    { success: 1210, error: 20 },
    { success: 1235, error: 25 },
    { success: 1220, error: 18 },
    { success: 1250, error: 30 },
    { success: 1270, error: 22 },
    { success: 1258, error: 26 },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Historical metrics for complex charts
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [tokenThroughputHistory, setTokenThroughputHistory] = useState<{ input: number; output: number }[]>([]);

  // Generate initial history and logs
  useEffect(() => {
    const initialLogs: RequestLog[] = [];
    const now = new Date();
    for (let i = 8; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4000);
      const modelObj = MODELS[Math.floor(Math.random() * MODELS.length)];
      initialLogs.push({
        id: Math.random().toString(36).substring(7),
        timestamp: time.toLocaleTimeString([], { hour12: false }),
        model: modelObj.name,
        method: Math.random() > 0.3 ? "POST" : "GET",
        path: PATHS[Math.floor(Math.random() * PATHS.length)],
        status: 200,
        latency: Math.floor(modelObj.latencyBase + (Math.random() * 10 - 5)),
        origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)],
      });
    }
    setLogs(initialLogs);

    // Initial 10 latency points
    const initialLatency = Array.from({ length: 10 }).map(() => Math.floor(38 + Math.random() * 8));
    setLatencyHistory(initialLatency);

    // Initial 10 token throughput points (Input vs Output)
    const initialTokens = Array.from({ length: 10 }).map(() => ({
      input: Math.floor(1800 + Math.random() * 600),
      output: Math.floor(2400 + Math.random() * 1000),
    }));
    setTokenThroughputHistory(initialTokens);
  }, []);

  // Update live metrics
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Drift stats
      setReqsPerMin((prev) => {
        const delta = Math.floor(Math.random() * 15) - 7;
        const nextVal = Math.max(1200, Math.min(1400, prev + delta));
        
        // Update throughput history
        setThroughputHistory((prevHist) => [...prevHist.slice(1), nextVal]);

        // Update success/error rate history
        setSuccessErrorHistory((prevHist) => {
          const successRate = 0.975 + Math.random() * 0.02; // 97.5% - 99.5% success
          const success = Math.round(nextVal * successRate);
          const error = nextVal - success;
          return [...prevHist.slice(1), { success, error }];
        });

        return nextVal;
      });

      setP50Latency((prev) => {
        const delta = Number((Math.random() * 2 - 1).toFixed(1));
        return Math.max(38, Math.min(48, prev + delta));
      });

      setCpuTemp((prev) => {
        const delta = Number((Math.random() * 0.8 - 0.4).toFixed(1));
        return Math.max(55, Math.min(62, prev + delta));
      });

      setGpuLoad((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(65, Math.min(85, prev + delta));
      });

      setRamLoad((prev) => {
        const delta = Number((Math.random() * 0.2 - 0.1).toFixed(1));
        return Math.max(27.5, Math.min(29.5, prev + delta));
      });

      // Add a new log
      const modelObj = MODELS[Math.floor(Math.random() * MODELS.length)];
      const newLog: RequestLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        model: modelObj.name,
        method: Math.random() > 0.3 ? "POST" : "GET",
        path: PATHS[Math.floor(Math.random() * PATHS.length)],
        status: Math.random() > 0.02 ? 200 : Math.random() > 0.5 ? 400 : 500,
        latency: Math.floor(modelObj.latencyBase + (Math.random() * 12 - 6)),
        origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)],
      };

      setLogs((prev) => [...prev.slice(1), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <StaggerContainer
          delay={150}
          staggerDelay={0.08}
          className="w-full h-full flex flex-col p-4 md:p-6 overflow-y-auto no-scrollbar relative z-10 text-text-hi font-body"
        >
          {/* Header row */}
          <StaggerItem className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Eyebrow tone="low">01.9 — Monitor</Eyebrow>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[8px] font-mono text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  CLUSTER ONLINE
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight font-display mt-0.5">
                SYSTEM_METRICS_MONITOR
              </h1>
              <p className="text-xs text-text-low mt-0.5">
                Live dashboard of core micro-services, network loads, and active AI runtimes.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                  isLive
                    ? "bg-accent-1/10 border-accent-1/30 text-text-hi"
                    : "bg-white/[0.02] border-white/10 text-text-low hover:text-text-hi"
                }`}
              >
                {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLive ? "PAUSE STREAM" : "RESUME"}</span>
              </button>

              <button
                onClick={() => {
                  const rReqs = 1200 + Math.floor(Math.random() * 200);
                  const rLat = 38 + Math.floor(Math.random() * 10);
                  setReqsPerMin(rReqs);
                  setP50Latency(rLat);
                  setLatencyHistory((prev) => [...prev.slice(1), rLat]);
                  setTokenThroughputHistory((prev) => [
                    ...prev.slice(1),
                    {
                      input: Math.floor(1800 + Math.random() * 600),
                      output: Math.floor(2400 + Math.random() * 1000),
                    },
                  ]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-text-mid hover:text-text-hi hover:border-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>SYNC</span>
              </button>
            </div>
          </StaggerItem>

          {/* Main layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
            {/* LEFT COLUMN: Map & Terminal (lg:span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 min-h-[350px]">
              {/* Traffic Map visualization */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 flex-1 flex flex-col relative overflow-hidden border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-accent-2" />
                    LIVE_TRAFFIC_MAP
                  </span>
                  <span className="text-[8px] font-mono text-accent-2">WS_STATUS: CONCURRENT</span>
                </div>
                
                {/* Dotted Network Grid */}
                <div className="flex-1 relative rounded-xl border border-white/5 bg-black/40 overflow-hidden min-h-[140px] flex items-center justify-center">
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                      backgroundSize: "16px 16px"
                    }}
                  />
                  
                  {/* Outer circle layout */}
                  <div className="w-[180px] h-[180px] rounded-full border border-dashed border-white/10 flex items-center justify-center animate-[ring-spin-cw_45s_linear_infinite] opacity-60">
                    <div className="w-[100px] h-[100px] rounded-full border border-dashed border-white/10" />
                  </div>

                  {/* Pulsing nodes */}
                  {isLive && (
                    <>
                      <div className="absolute top-1/4 left-1/3 text-accent-1 animate-pulse">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-1 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-1"></span>
                        </span>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 text-accent-2 animate-pulse">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-2"></span>
                        </span>
                      </div>
                      <div className="absolute top-1/2 left-2/3 text-accent-3 animate-pulse">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-3 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-3"></span>
                        </span>
                      </div>
                    </>
                  )}
                  <span className="text-[9px] font-mono text-text-faint absolute bottom-2 left-2">SCALE: 1:1.6M</span>
                  <span className="text-[9px] font-mono text-text-faint absolute top-2 right-2">NODES: 8 REGIONS</span>
                </div>
              </StaggerItem>

              {/* Terminal Log */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 h-[180px] flex flex-col border border-white/[0.06] overflow-hidden">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1.5 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-accent-1" />
                  LIVE_REQUEST_LOG
                </span>
                <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-2.5 font-mono text-[9px] text-[#A0E2A0] overflow-y-auto no-scrollbar">
                  <div className="space-y-1.5">
                    {logs.map((log) => (
                      <div key={log.id} className="leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-text-faint">[{log.timestamp}]</span>{" "}
                        <span className="text-accent-2">{log.model.split("-")[1]}</span>:{" "}
                        <span className="text-text-hi">{log.method}</span>{" "}
                        <span className="text-white/80">{log.path}</span> -{" "}
                        <span className={log.status === 200 ? "text-emerald-400" : "text-rose-400"}>
                          {log.status}
                        </span>{" "}
                        <span className="text-accent-warm">({log.latency}ms)</span> -{" "}
                        <span className="text-text-low">{log.origin}</span>
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>
              </StaggerItem>
            </div>

            {/* CENTER COLUMN: Counters, AI Activity Equalizer (Moved from homepage), Cluster Load Equalizer (lg:span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Counters */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06] grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-text-low block">REQUESTS/MIN</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-semibold tracking-tight text-text-hi">
                      {reqsPerMin.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center font-mono">
                      <TrendingUp className="w-3 h-3" />
                      12%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-text-low block">p50 LATENCY</span>
                  <div>
                    <span className="text-2xl font-mono font-semibold tracking-tight text-text-hi">
                      {p50Latency} <span className="text-xs text-text-low font-normal">ms</span>
                    </span>
                  </div>
                </div>
              </StaggerItem>

              {/* Exact AI Activity Panel (Moved from Homepage Showcase CardAI) */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-accent-2" />
                    AI_ACTIVITY_EQUALIZER (HOMEPAGE_PANEL)
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400/40 animate-ping" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-emerald-300">Live</span>
                  </div>
                </div>

                <ActivityEqualizer isLive={isLive} />

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-[10px] font-mono text-text-low">
                  <span>SAMPLING RATE: 2.5s</span>
                  <span className="text-text-hi font-semibold">{reqsPerMin.toLocaleString()} req/min</span>
                </div>
              </StaggerItem>

              {/* Multi Equalizers */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06] flex-1 flex flex-col justify-between gap-3 min-h-[200px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-accent-3" />
                    CLUSTER_LOAD_EQUALIZER
                  </span>
                  <span className="text-[9px] font-mono text-text-faint">3 CLUSTERS</span>
                </div>

                <div className="flex-1 flex flex-col justify-around gap-3 mt-1">
                  {MODELS.map((model, idx) => (
                    <div key={model.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-text-mid truncate max-w-[150px]">{model.name}</span>
                        <span className="text-text-low" style={{ color: model.color }}>
                          {idx === 0 ? "82%" : idx === 1 ? "49%" : "27%"} load
                        </span>
                      </div>
                      
                      {/* Equalizer Waveform */}
                      <div className="flex items-end gap-[1.5px] h-8 bg-white/[0.01] border border-white/5 rounded-lg p-1">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full opacity-80"
                            style={{
                              background: model.color,
                              height: "100%",
                              transformOrigin: "bottom",
                              animation: isLive 
                                ? "bar-scale 15s ease-in-out infinite" 
                                : "none",
                              animationDelay: `${i * 0.25}s`,
                              transform: !isLive ? "scaleY(0.2)" : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </StaggerItem>
            </div>

            {/* RIGHT COLUMN: Advanced Animated Charts & Computes (lg:span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Latency Trend Line Graph */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06]">
                <LatencyTrendLineChart history={latencyHistory} />
              </StaggerItem>

              {/* Token Throughput Double-Bar Chart */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06]">
                <TokenThroughputDoubleBarChart history={tokenThroughputHistory} isLive={isLive} />
              </StaggerItem>

              {/* Computes with Radial Gauges */}
              <StaggerItem className="glass-medium rounded-[18px] p-4 border border-white/[0.06] flex-1 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-accent-1" />
                    COMPUTE_RESOURCES
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400">ACTIVE</span>
                </div>

                {/* Side-by-side Radial Gauges */}
                <div className="flex gap-3 w-full">
                  <CpuGpuRadialGauge value={gpuLoad} label="GPU Load" color="var(--accent-2)" />
                  <CpuGpuRadialGauge value={Math.floor((cpuTemp / 100) * 100)} label="CPU Temp" color="var(--accent-warm)" />
                  <CpuGpuRadialGauge value={Math.floor((ramLoad / 64) * 100)} label="RAM Use" color="var(--accent-1)" />
                </div>

                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  {/* GPU cluster bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-text-mid">
                      <span>GPU CLUSTER ALLOCATION</span>
                      <span>{gpuLoad}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-1 to-accent-2 transition-all duration-1000 rounded-full"
                        style={{ width: `${gpuLoad}%` }}
                      />
                    </div>
                  </div>

                  {/* CPU Temp bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-text-mid">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-accent-warm" />
                        CPU TEMPERATURE
                      </span>
                      <span className={cpuTemp > 60 ? "text-accent-warm" : "text-text-mid"}>
                        {cpuTemp}°C
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-warm to-accent-3 transition-all duration-1000 rounded-full"
                        style={{ width: `${((cpuTemp - 40) / 40) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* RAM bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-text-mid">
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        SYSTEM MEMORY
                      </span>
                      <span>{ramLoad} GB / 64 GB</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/20 transition-all duration-1000 rounded-full"
                        style={{ width: `${(ramLoad / 64) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </div>
          </div>
        </StaggerContainer>
      </TvFrame>
    </>
  );
}

/* ── Auxiliary Dashboard Components ── */

function ActivityEqualizer({ isLive }: { isLive: boolean }) {
  const bars = 22;
  return (
    <div className="flex items-end gap-[2px] h-14 bg-black/40 border border-white/5 rounded-xl p-2.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-full opacity-80"
          style={{
            background: "linear-gradient(180deg, var(--accent-2), var(--accent-1))",
            height: "100%",
            transformOrigin: "bottom",
            animation: isLive 
              ? "bar-scale 15s ease-in-out infinite" 
              : "none",
            animationDelay: `${i * 0.25}s`,
            transform: !isLive ? "scaleY(0.2)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function LatencyTrendLineChart({ history }: { history: number[] }) {
  if (history.length === 0) return null;
  const width = 300;
  const height = 90;
  const padding = 10;
  
  const minVal = 35;
  const maxVal = 55;
  const range = maxVal - minVal;
  
  const points = history.map((val, idx) => {
    const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
    const ratio = (val - minVal) / range;
    const y = height - padding - ratio * (height - padding * 2);
    return { x, y, val };
  });
  
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  const fillD = pathD ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : "";
  const lastPoint = points[points.length - 1];

  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] font-mono text-text-low">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-accent-2" />
          LATENCY_TREND_LINE (p50)
        </span>
        <span className="text-text-hi font-semibold">{lastPoint?.val.toFixed(1)} ms</span>
      </div>
      <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-2.5 h-[80px] flex items-center justify-center relative overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-2.5 px-2 pointer-events-none opacity-5">
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
        </div>
        
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="line-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-1)" />
              <stop offset="50%" stopColor="var(--accent-2)" />
              <stop offset="100%" stopColor="var(--accent-3)" />
            </linearGradient>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {fillD && (
            <path
              d={fillD}
              fill="url(#area-grad)"
              className="transition-all duration-700 ease-out-soft"
            />
          )}

          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#line-glow)"
              strokeWidth="4"
              opacity="0.3"
              className="transition-all duration-700 ease-out-soft filter blur-md"
            />
          )}

          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#line-glow)"
              strokeWidth="2.5"
              className="transition-all duration-700 ease-out-soft"
            />
          )}

          {lastPoint && (
            <g className="transition-all duration-700 ease-out-soft" transform={`translate(${lastPoint.x}, ${lastPoint.y})`}>
              <circle r="6" fill="var(--accent-2)" className="animate-ping opacity-60" />
              <circle r="3.5" fill="var(--text-hi)" stroke="var(--accent-2)" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function TokenThroughputDoubleBarChart({ history, isLive }: { history: { input: number; output: number }[]; isLive: boolean }) {
  if (history.length === 0) return null;

  const maxVal = 4000;
  
  return (
    <div className="relative w-full h-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] font-mono text-text-low">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-accent-3" />
          THROUGHPUT_COMPARE (Tokens/sec)
        </span>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-1" />
            IN
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-3" />
            OUT
          </span>
        </div>
      </div>
      
      <div className="flex-1 bg-black/40 border border-white/5 rounded-xl p-2.5 h-[80px] flex items-end justify-between gap-2 relative overflow-hidden">
        {/* Dotted horizontal guides */}
        <div className="absolute inset-0 flex flex-col justify-between py-2.5 px-2 pointer-events-none opacity-5">
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
        </div>

        {history.map((tick, idx) => {
          const inputHeight = Math.min(95, Math.max(10, (tick.input / maxVal) * 100));
          const outputHeight = Math.min(95, Math.max(10, (tick.output / maxVal) * 100));
          
          return (
            <div key={idx} className="flex-1 h-full flex items-end justify-center gap-[1px] group relative">
              <div 
                className="w-full rounded-t-sm bg-gradient-to-t from-accent-1/40 to-accent-1 hover:brightness-125 transition-all duration-700 ease-out-soft"
                style={{ 
                  height: `${inputHeight}%`,
                  boxShadow: '0 0 4px rgba(110, 86, 255, 0.1)'
                }}
              />
              
              <div 
                className="w-full rounded-t-sm bg-gradient-to-t from-accent-3/40 to-accent-3 hover:brightness-125 transition-all duration-700 ease-out-soft"
                style={{ 
                  height: `${outputHeight}%`,
                  boxShadow: '0 0 4px rgba(255, 79, 176, 0.1)'
                }}
              />

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center bg-black/90 border border-white/10 rounded px-1.5 py-0.5 text-[8px] font-mono text-text-hi pointer-events-none z-20 whitespace-nowrap shadow-lg">
                <span>IN: {tick.input.toLocaleString()}</span>
                <span>OUT: {tick.output.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CpuGpuRadialGauge({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 18;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 p-2.5 bg-black/40 border border-white/5 rounded-xl flex-1 relative overflow-hidden">
      <div 
        className="absolute w-10 h-10 rounded-full opacity-[0.03] blur-md transition-all duration-1000"
        style={{ background: color }}
      />
      <div className="relative w-11 h-11 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 overflow-visible">
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out-soft"
          />
        </svg>
        <span className="absolute text-[8px] font-mono font-semibold text-text-hi">{value}%</span>
      </div>
      <span className="text-[7.5px] font-mono tracking-wider text-text-low uppercase text-center truncate w-full">{label}</span>
    </div>
  );
}
