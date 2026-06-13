"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { PALETTES, DEFAULT_PALETTE_ID, getPalette, type Palette } from "./palettes";

const STORAGE_KEY = "yantra_theme_palette";
const CURSOR_STORAGE_KEY = "yantra_theme_cursor";
const CURSOR_TOGGLE_STORAGE_KEY = "yantra_theme_cursor_toggle";
const MOTION_TOGGLE_STORAGE_KEY = "yantra_theme_motion_toggle";

export type CursorStyleType = "default" | "arrow" | "crosshair" | "dot";

interface ThemeContextValue {
  palette: Palette;
  palettes: Palette[];
  setPaletteId: (id: string) => void;
  themeMode: "dark" | "light";
  setThemeMode: (mode: "dark" | "light") => void;
  cursorStyle: CursorStyleType;
  setCursorStyle: (style: CursorStyleType) => void;
  customCursorEnabled: boolean;
  setCustomCursorEnabled: (enabled: boolean) => void;
  resetCursorSettings: () => void;
  reducedMotionEnabled: boolean;
  setReducedMotionEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: PALETTES[0],
  palettes: PALETTES,
  setPaletteId: () => {},
  themeMode: "dark",
  setThemeMode: () => {},
  cursorStyle: "default",
  setCursorStyle: () => {},
  customCursorEnabled: false,
  setCustomCursorEnabled: () => {},
  resetCursorSettings: () => {},
  reducedMotionEnabled: false,
  setReducedMotionEnabled: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/** Writes palette CSS variables to the <html> element */
function applyPalette(palette: Palette) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--accent-1", palette.accent1);
  root.style.setProperty("--accent-2", palette.accent2);
  root.style.setProperty("--accent-3", palette.accent3);
  root.style.setProperty("--accent-warm", palette.accentWarm);
  root.setAttribute("data-palette", palette.id);
}

/** Toggles reduced motion global stylesheet rules */
function applyReducedMotion(enabled: boolean) {
  if (typeof document === "undefined") return;
  if (enabled) {
    document.documentElement.classList.add("prefers-reduced-motion");
  } else {
    document.documentElement.classList.remove("prefers-reduced-motion");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [paletteId, setPaletteIdState] = useState<string>(DEFAULT_PALETTE_ID);
  const [themeMode, setThemeModeState] = useState<"dark" | "light">("dark");
  const [cursorStyle, setCursorStyleState] = useState<CursorStyleType>("default");
  const [customCursorEnabled, setCustomCursorEnabledState] = useState<boolean>(false);
  const [reducedMotionEnabled, setReducedMotionEnabledState] = useState<boolean>(false);

  // On mount, read persisted preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && PALETTES.find((p) => p.id === saved)) {
        setPaletteIdState(saved);
        applyPalette(getPalette(saved));
      }

      const savedThemeMode = localStorage.getItem("yantra_theme_mode") as "dark" | "light";
      if (savedThemeMode && ["dark", "light"].includes(savedThemeMode)) {
        setThemeModeState(savedThemeMode);
        document.documentElement.setAttribute("data-theme", savedThemeMode);
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }

      const savedCursor = localStorage.getItem(CURSOR_STORAGE_KEY) as CursorStyleType;
      if (savedCursor && ["default", "arrow", "crosshair", "dot"].includes(savedCursor)) {
        setCursorStyleState(savedCursor);
      }

      const savedCursorToggle = localStorage.getItem(CURSOR_TOGGLE_STORAGE_KEY);
      if (savedCursorToggle !== null) {
        setCustomCursorEnabledState(
          savedCursorToggle === "true" &&
            !!savedCursor &&
            savedCursor !== "default"
        );
      }

      const savedMotionToggle = localStorage.getItem(MOTION_TOGGLE_STORAGE_KEY);
      if (savedMotionToggle !== null) {
        const motionVal = savedMotionToggle === "true";
        setReducedMotionEnabledState(motionVal);
        applyReducedMotion(motionVal);
      }
    } catch {
      // ignore (SSR / private mode)
    }
  }, []);

  const setPaletteId = useCallback((id: string) => {
    const p = getPalette(id);
    setPaletteIdState(id);
    applyPalette(p);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const setThemeMode = useCallback((mode: "dark" | "light") => {
    setThemeModeState(mode);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
    try {
      localStorage.setItem("yantra_theme_mode", mode);
    } catch {
      // ignore
    }
  }, []);

  const setCursorStyle = useCallback((style: CursorStyleType) => {
    setCursorStyleState(style);
    setCustomCursorEnabledState(style !== "default");
    try {
      if (style === "default") {
        localStorage.removeItem(CURSOR_STORAGE_KEY);
        localStorage.removeItem(CURSOR_TOGGLE_STORAGE_KEY);
      } else {
        localStorage.setItem(CURSOR_STORAGE_KEY, style);
        localStorage.setItem(CURSOR_TOGGLE_STORAGE_KEY, "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const setCustomCursorEnabled = useCallback((enabled: boolean) => {
    setCustomCursorEnabledState(enabled);
    if (enabled && cursorStyle === "default") {
      setCursorStyleState("arrow");
    }
    try {
      if (enabled) {
        localStorage.setItem(CURSOR_TOGGLE_STORAGE_KEY, "true");
        if (cursorStyle === "default") {
          localStorage.setItem(CURSOR_STORAGE_KEY, "arrow");
        }
      } else {
        localStorage.removeItem(CURSOR_TOGGLE_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [cursorStyle]);

  const resetCursorSettings = useCallback(() => {
    setCursorStyleState("default");
    setCustomCursorEnabledState(false);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("has-custom-cursor");
    }
    try {
      localStorage.removeItem(CURSOR_STORAGE_KEY);
      localStorage.removeItem(CURSOR_TOGGLE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setReducedMotionEnabled = useCallback((enabled: boolean) => {
    setReducedMotionEnabledState(enabled);
    applyReducedMotion(enabled);
    try {
      localStorage.setItem(MOTION_TOGGLE_STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
  }, []);

  const palette = getPalette(paletteId);

  return (
    <ThemeContext.Provider
      value={{
        palette,
        palettes: PALETTES,
        setPaletteId,
        themeMode,
        setThemeMode,
        cursorStyle,
        setCursorStyle,
        customCursorEnabled,
        setCustomCursorEnabled,
        resetCursorSettings,
        reducedMotionEnabled,
        setReducedMotionEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
