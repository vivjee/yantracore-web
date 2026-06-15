"use client";

import { useCallback, useSyncExternalStore, type RefObject } from "react";

/**
 * Element-scoped fullscreen — drives the Music Lab visualizer's "theater" mode.
 *
 * Unlike {@link useFullscreen} (which fullscreens the whole document), this
 * targets a single element so *only* the visualization fills the screen. Reads
 * live browser state via `useSyncExternalStore`, so the browser's own exit
 * (Escape, the OS chrome, etc.) is reflected through the `fullscreenchange`
 * event with no extra wiring. Webkit-prefixed fallbacks keep desktop Safari
 * working.
 */

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
};

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function subscribe(callback: () => void) {
  document.addEventListener("fullscreenchange", callback);
  document.addEventListener("webkitfullscreenchange", callback);
  return () => {
    document.removeEventListener("fullscreenchange", callback);
    document.removeEventListener("webkitfullscreenchange", callback);
  };
}

/** `fullscreenEnabled` never changes at runtime — nothing to subscribe to. */
function noopSubscribe() {
  return () => {};
}

function currentFsElement(): Element | null {
  if (typeof document === "undefined") return null;
  const d = document as FsDocument;
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

export function useElementFullscreen<T extends HTMLElement>(ref: RefObject<T | null>) {
  const isFullscreen = useSyncExternalStore(
    subscribe,
    () => {
      const el = currentFsElement();
      return el !== null && el === ref.current;
    },
    () => false,
  );

  const isSupported = useSyncExternalStore(
    noopSubscribe,
    () => {
      if (typeof document === "undefined") return false;
      const d = document as FsDocument;
      return Boolean(document.fullscreenEnabled ?? d.webkitFullscreenEnabled);
    },
    () => false,
  );

  const enter = useCallback(async () => {
    const el = ref.current as FsElement | null;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch {
      /* user-gesture / permission errors are non-fatal */
    }
  }, [ref]);

  const exit = useCallback(async () => {
    const d = document as FsDocument;
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
    } catch {
      /* non-fatal */
    }
  }, []);

  const toggle = useCallback(async () => {
    if (ref.current && currentFsElement() === ref.current) {
      await exit();
    } else {
      await enter();
    }
  }, [enter, exit, ref]);

  return { isFullscreen, isSupported, enter, exit, toggle };
}
