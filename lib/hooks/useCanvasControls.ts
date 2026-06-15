"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

interface UseCanvasControlsOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomSensitivity?: number;
  initialZoom?: number;
}

interface UseCanvasControlsReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  resetView: () => void;
}

export function useCanvasControls({
  minZoom = 0.25,
  maxZoom = 4,
  zoomSensitivity = 0.001,
  initialZoom = 1,
}: UseCanvasControlsOptions = {}): UseCanvasControlsReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CanvasState>({ zoom: initialZoom, panX: 0, panY: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const stateRef = useRef(state);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);
  const touchMidRef = useRef({ x: 0, y: 0 });
  const touchPanRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clampZoom = useCallback(
    (z: number) => Math.max(minZoom, Math.min(maxZoom, z)),
    [minZoom, maxZoom]
  );

  const resetView = useCallback(() => {
    setState({ zoom: initialZoom, panX: 0, panY: 0 });
  }, [initialZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const { zoom, panX, panY } = stateRef.current;
      const delta = e.ctrlKey ? e.deltaY * 4 : e.deltaY;
      const factor = 1 - delta * zoomSensitivity;
      const newZoom = clampZoom(zoom * factor);
      const ratio = newZoom / zoom;
      setState({
        zoom: newZoom,
        panX: cursorX - (cursorX - panX) * ratio,
        panY: cursorY - (cursorY - panY) * ratio,
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setState(prev => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    const handleDblClick = () => resetView();

    const getTouchDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartDistRef.current = getTouchDist(e.touches);
        touchStartZoomRef.current = stateRef.current.zoom;
        touchPanRef.current = { x: stateRef.current.panX, y: stateRef.current.panY };
        const rect = container.getBoundingClientRect();
        touchMidRef.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        };
      } else if (e.touches.length === 1) {
        lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isDraggingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        const dist = getTouchDist(e.touches);
        const newZoom = clampZoom(touchStartZoomRef.current * (dist / touchStartDistRef.current));
        const { x: midX, y: midY } = touchMidRef.current;
        const { x: sPanX, y: sPanY } = touchPanRef.current;
        const ratio = newZoom / touchStartZoomRef.current;
        setState({
          zoom: newZoom,
          panX: midX - (midX - sPanX) * ratio,
          panY: midY - (midY - sPanY) * ratio,
        });
      } else if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - lastPointerRef.current.x;
        const dy = e.touches[0].clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setState(prev => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) touchStartDistRef.current = null;
      if (e.touches.length === 0) isDraggingRef.current = false;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);
    container.addEventListener("dblclick", handleDblClick);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
      container.removeEventListener("dblclick", handleDblClick);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [clampZoom, resetView, zoomSensitivity]);

  return {
    containerRef,
    zoom: state.zoom,
    panX: state.panX,
    panY: state.panY,
    isDragging,
    resetView,
  };
}