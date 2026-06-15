"use client";

import { useEffect, useState } from "react";

interface CanvasHUDProps {
  zoom: number;
  onReset: () => void;
}

export function CanvasHUD({ zoom, onReset }: CanvasHUDProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("yntr_canvas_hint_seen");
    if (!seen) {
      setShowHint(true);
      const t = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem("yntr_canvas_hint_seen", "1");
      }, 4500);
      return () => clearTimeout(t);
    }
  }, []);

  const zoomPct = Math.round(zoom * 100);
  const isDefault = zoomPct === 100;

  return (
    <div className="absolute bottom-5 right-5 z-[60] flex flex-col items-end gap-2 pointer-events-none">
      {/* Scroll hint */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: showHint ? 1 : 0,
          transform: showHint ? "translateY(0)" : "translateY(4px)",
          pointerEvents: "none",
        }}
      >
        <span className="text-[9px] font-mono tracking-widest uppercase text-white/35 bg-[#08080f] border border-white/10 rounded-full px-3 py-1 whitespace-nowrap">
          Scroll to zoom / Drag to pan / Double-click to reset
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onReset}
          className="text-[10px] font-mono uppercase tracking-widest rounded-full px-3 py-1 border transition-all duration-200 active:scale-95"
          style={{
            background: "#08080f",
            color: isDefault ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.65)",
            borderColor: isDefault ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)",
          }}
          aria-label="Reset view"
        >
          Reset
        </button>

        <div
          className="min-w-[54px] text-center text-[11px] font-mono font-semibold tracking-wider rounded-full px-3 py-1 border transition-all duration-150"
          style={{
            background: "#08080f",
            color: isDefault ? "rgba(110,86,255,0.6)" : "rgba(110,86,255,1)",
            borderColor: isDefault ? "rgba(110,86,255,0.2)" : "rgba(110,86,255,0.45)",
            boxShadow: isDefault ? "none" : "0 0 10px rgba(110,86,255,0.25)",
          }}
        >
          {zoomPct}%
        </div>
      </div>
    </div>
  );
}