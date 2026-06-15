"use client";

import React, { useRef, useEffect } from "react";

interface JellyRotateWrapperProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  spins?: number;
}

export function JellyRotateWrapper({ children, className = "", duration = 1500, spins = 1 }: JellyRotateWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  const configRef = useRef({ duration, spins });
  useEffect(() => {
    configRef.current = { duration, spins };
  }, [duration, spins]);

  const stateRef = useRef({
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    clickAnimTime: 0,
    startRotation: 0,
    targetDeltaRotation: 0,
    lastTriggerTime: 0,
  });

  const triggerSpin = (clientX: number) => {
    const el = elementRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    // Fallback if clientX is not set (e.g. keyboard clicks)
    const x = clientX || cx;
    const dx = x - cx;

    // Pushing on the right (dx > 0) spins clockwise (+1).
    // Pushing on the left (dx < 0) spins counter-clockwise (-1).
    const direction = Math.abs(dx) > 5 ? Math.sign(dx) : (Math.random() > 0.5 ? 1 : -1);

    const time = performance.now();
    const state = stateRef.current;

    // Prevent double-triggering (e.g. pointerdown followed by click event)
    if (time - state.lastTriggerTime < 100) return;
    state.lastTriggerTime = time;

    // Normalize current rotation value to 0-360 first
    let currentNorm = state.rotation % 360;
    if (currentNorm < 0) currentNorm += 360;

    // Calculate nearest multiple of 90 degrees for symmetric alignment
    const currentRounded = Math.round(currentNorm / 90) * 90;

    state.startRotation = state.rotation;
    // Target is that rounded multiple plus/minus full 360-degree spins
    const targetRotation = currentRounded + direction * (360 * configRef.current.spins);
    state.targetDeltaRotation = targetRotation - state.startRotation;
    state.clickAnimTime = time;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    triggerSpin(e.clientX);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    triggerSpin(e.clientX);
  };

  useEffect(() => {
    let animFrameId: number;

    const update = (time: number) => {
      const state = stateRef.current;
      const el = elementRef.current;

      if (state.clickAnimTime > 0) {
        const elapsed = time - state.clickAnimTime;
        const currentDuration = configRef.current.duration;

        if (elapsed >= currentDuration) {
          state.clickAnimTime = 0;
          // Land exactly at the target rotation, normalized to [0, 360)
          let finalRotation = (state.startRotation + state.targetDeltaRotation) % 360;
          if (finalRotation < 0) finalRotation += 360;
          state.rotation = finalRotation;
          state.scaleX = 1;
          state.scaleY = 1;
        } else {
          const t = elapsed / currentDuration;

          // Easing function for rotation (easeOutQuart) for a smooth decelerating spin
          const easeProgress = 1 - Math.pow(1 - t, 4);
          state.rotation = state.startRotation + state.targetDeltaRotation * easeProgress;

          // Wobble scale effect: decaying cosine oscillation
          const amplitude = 0.35;
          const decay = 5.0;
          const frequency = 25.0;
          // Scale frequency slightly if duration is longer so it doesn't wobble insanely fast for a long time?
          // Actually frequency is relative to t (0..1), so it means 25 / (2*PI) oscillations ~ 4 oscillations over the WHOLE duration.
          const wobble = amplitude * Math.exp(-decay * t) * Math.cos(frequency * t);
          state.scaleX = 1 + wobble;
          state.scaleY = 1 - wobble;
        }

        if (el) {
          el.style.transform = `rotate(${state.rotation}deg) scale(${state.scaleX}, ${state.scaleY})`;
        }
      }

      animFrameId = requestAnimationFrame(update);
    };

    animFrameId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`select-none cursor-pointer ${className}`}
      style={{
        transformOrigin: "center center",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
