/**
 * Keyboard shortcuts — single source of truth.
 *
 * Pure data, no React. The keyboard engine (`ShortcutsProvider`), the on-button
 * key hints (`KeyHint`), and the `?` cheat sheet (`ShortcutHelp`) all read from
 * this list, so a new shortcut is one entry here + one handler in the provider.
 *
 * Matching trick: `Shift`+letter yields an uppercase `e.key` ("H"), and `?` / `>`
 * / `<` are already their shifted characters — so each entry just stores the
 * literal `e.key` it fires on. No modifier bookkeeping; `display` is the pretty
 * label shown to the user.
 */

/** Custom window event that the `⇧Q` shortcut dispatches; TvFrame runs its
 * (page-local) power toggle in response. */
export const POWER_TOGGLE_EVENT = "yantra:toggle-power";

export type ShortcutGroup = "Navigation" | "Playback" | "View";

export interface ShortcutDef {
  /** Stable id used to wire the handler and look up the hint. */
  id: string;
  /** The literal `KeyboardEvent.key` value this fires on. */
  key: string;
  /** Pretty label shown in tooltips and the cheat sheet, e.g. "⇧H", "F", "⟩". */
  display: string;
  /** Human-readable action description. */
  label: string;
  group: ShortcutGroup;
}

export const SHORTCUTS: ShortcutDef[] = [
  // ── Navigation (Shift + mnemonic letter) ──
  { id: "nav-home",         key: "H", display: "⇧H", label: "Home",            group: "Navigation" },
  { id: "nav-entryport",    key: "R", display: "⇧R", label: "Reach",           group: "Navigation" },
  { id: "nav-technologies", key: "T", display: "⇧T", label: "Technologies",    group: "Navigation" },
  { id: "nav-music",        key: "M", display: "⇧M", label: "Music Lab",       group: "Navigation" },
  { id: "nav-contact",      key: "C", display: "⇧C", label: "Contact",         group: "Navigation" },
  { id: "nav-settings",     key: "S", display: "⇧S", label: "Settings",        group: "Navigation" },
  { id: "nav-account",      key: "A", display: "⇧A", label: "Account",         group: "Navigation" },

  // ── Playback ──
  { id: "play-toggle",      key: "P", display: "⇧P", label: "Play / Pause",    group: "Playback" },
  { id: "play-next",        key: ">", display: "⟩",  label: "Next track",      group: "Playback" },
  { id: "play-prev",        key: "<", display: "⟨",  label: "Previous track",  group: "Playback" },
  { id: "play-mute",        key: "X", display: "⇧X", label: "Mute / Unmute",   group: "Playback" },

  // ── View & system ──
  { id: "view-fullscreen",  key: "f", display: "F",  label: "Fullscreen",      group: "View" },
  { id: "view-theme",       key: "D", display: "⇧D", label: "Toggle theme",    group: "View" },
  { id: "view-power",       key: "Q", display: "⇧Q", label: "TV power",        group: "View" },
  { id: "view-help",        key: "?", display: "?",  label: "Shortcut help",   group: "View" },
];

const SHORTCUT_BY_ID = new Map(SHORTCUTS.map((s) => [s.id, s]));

/** The pretty `display` string for a shortcut id (empty string if unknown). */
export function hintFor(id: string): string {
  return SHORTCUT_BY_ID.get(id)?.display ?? "";
}

/** The full definition for a shortcut id, or undefined. */
export function shortcutById(id: string): ShortcutDef | undefined {
  return SHORTCUT_BY_ID.get(id);
}

/** Group order used by the cheat sheet. */
export const SHORTCUT_GROUP_ORDER: ShortcutGroup[] = ["Navigation", "Playback", "View"];
