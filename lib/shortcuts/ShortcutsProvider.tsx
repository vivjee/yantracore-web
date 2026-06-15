"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAudioPlayer } from "@/lib/audio/AudioPlayerContext";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { audioSynth } from "@/lib/audio";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { SHORTCUTS, POWER_TOGGLE_EVENT } from "./shortcuts";
import { ShortcutHelp } from "@/components/chrome/ShortcutHelp";

/** True when the keystroke originated in a field where the user is typing. */
function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable || Boolean(el.closest('[contenteditable="true"]'));
}

/**
 * Global keyboard shortcut engine. One window-level keydown listener drives the
 * whole app: navigation, playback, fullscreen, theme, TV power, and the `?`
 * cheat sheet. Must be mounted inside ThemeProvider + AudioPlayerProvider so its
 * handlers can reach those contexts. See `lib/shortcuts/shortcuts.ts`.
 */
export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const audio = useAudioPlayer();
  const { themeMode, setThemeMode } = useTheme();
  const { toggle: toggleFullscreen } = useFullscreen();
  const [helpOpen, setHelpOpen] = useState(false);

  // Latest-handler refs: the keydown listener binds once (below), but must run
  // the current closures. Refs are (re)assigned in an effect, not during render.
  const runRef = useRef<(id: string) => void>(() => {});
  const helpOpenRef = useRef(helpOpen);

  useEffect(() => {
    helpOpenRef.current = helpOpen;
    runRef.current = (id: string) => {
      switch (id) {
        case "nav-home":         router.push("/"); break;
        case "nav-entryport":    router.push("/entryport"); break;
        case "nav-technologies": router.push("/technologies"); break;
        case "nav-music":        router.push("/music"); break;
        case "nav-contact":      router.push("/contact"); break;
        case "nav-settings":     router.push("/settings"); break;
        case "nav-account": {
          const authed = sessionStorage.getItem("ym_authed") === "1";
          router.push(authed ? "/dashboard" : "/login");
          break;
        }
        case "play-toggle":      void audio.togglePlay(); break;
        case "play-next":        audio.handleNext(); break;
        case "play-prev":        audio.handlePrev(); break;
        case "play-mute":        audio.toggleMute(); break;
        case "view-fullscreen":  void toggleFullscreen(); break;
        case "view-theme":       setThemeMode(themeMode === "dark" ? "light" : "dark"); break;
        case "view-power":       window.dispatchEvent(new CustomEvent(POWER_TOGGLE_EVENT)); break;
        case "view-help":        setHelpOpen((v) => !v); return; // keep help open after toggling
      }
      setHelpOpen(false);
    };
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented) return;
      // Never override browser / OS combos.
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape") {
        if (helpOpenRef.current) {
          e.preventDefault();
          setHelpOpen(false);
        }
        return;
      }

      // Don't hijack keys while the user is typing.
      if (isEditableTarget(e.target)) return;

      const def = SHORTCUTS.find((s) => s.key === e.key);
      if (!def) return;

      e.preventDefault();
      audioSynth.playClick();
      runRef.current(def.id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {children}
      <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
