"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SHORTCUTS, SHORTCUT_GROUP_ORDER } from "@/lib/shortcuts/shortcuts";

/**
 * Glassmorphic keyboard-shortcut cheat sheet, toggled with `?` and dismissed
 * with `Esc` or a backdrop click. Reads everything from the shortcut registry,
 * so it stays in sync automatically. Mounted once by `ShortcutsProvider`.
 */
export function ShortcutHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  const grouped = SHORTCUT_GROUP_ORDER.map((group) => ({
    group,
    items: SHORTCUTS.filter((s) => s.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
          className="fixed inset-0 z-[300] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "rgba(6, 7, 13, 0.72)",
              backdropFilter: "blur(28px) saturate(140%)",
              WebkitBackdropFilter: "blur(28px) saturate(140%)",
            }}
          />

          {/* Panel */}
          <motion.div
            className="kbd-help-panel relative w-full max-w-2xl rounded-2xl overflow-x-hidden overflow-y-auto max-h-[calc(100dvh-2rem)]"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: "var(--accent-2)", boxShadow: "0 0 10px var(--accent-2)" }}
                />
                <h2 className="font-display text-base font-semibold text-text-hi tracking-wide">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close shortcuts"
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-mid hover:text-text-hi border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
              </button>
            </div>

            {/* Groups */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 px-6 py-5">
              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-faint mb-2.5">
                    {group}
                  </div>
                  <ul className="space-y-1.5" role="list">
                    {items.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-text-mid">{s.label}</span>
                        <kbd className="kbd-hint kbd-hint--solid">{s.display}</kbd>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/[0.08] font-mono text-[10px] uppercase tracking-[0.14em] text-text-faint">
              Press <kbd className="kbd-hint">?</kbd> anytime · <kbd className="kbd-hint">Esc</kbd> to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
