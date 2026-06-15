import { hintFor } from "@/lib/shortcuts/shortcuts";

/**
 * Tiny key-cap badge (e.g. ⇧H) rendered from the shortcut registry, so the
 * displayed key lives in exactly one place. Decorative — hidden from screen
 * readers and on touch devices (see `.kbd-hint` in globals.css).
 */
export function KeyHint({ id, className = "" }: { id: string; className?: string }) {
  const hint = hintFor(id);
  if (!hint) return null;
  return (
    <kbd className={`kbd-hint ${className}`} aria-hidden>
      {hint}
    </kbd>
  );
}
