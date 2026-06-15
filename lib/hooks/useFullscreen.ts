"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Fullscreen state + toggle, shared by the TV chrome button and the `F`
 * keyboard shortcut so both drive one implementation.
 *
 * Reads live browser state via `useSyncExternalStore` — no effects, no
 * hydration mismatch (the server snapshot is `false`, then it reconciles to the
 * real value after hydration).
 */

function subscribeFullscreen(callback: () => void) {
  document.addEventListener("fullscreenchange", callback);
  return () => document.removeEventListener("fullscreenchange", callback);
}

/** `document.fullscreenEnabled` never changes at runtime — nothing to subscribe to. */
function noopSubscribe() {
  return () => {};
}

export function useFullscreen() {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    () => Boolean(document.fullscreenElement),
    () => false,
  );

  const isSupported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );

  const toggle = useCallback(async () => {
    if (typeof document === "undefined" || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* user-gesture / permission errors are non-fatal */
    }
  }, []);

  return { isFullscreen, isSupported, toggle };
}
