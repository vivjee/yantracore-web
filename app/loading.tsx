/**
 * Root loading fallback — shown while a navigation suspends. Deliberately quiet
 * and on-brand (dark canvas, a single tuning ring). Most static routes resolve
 * instantly so this rarely appears; meaningful per-route skeletons pair with
 * the heavy-component lazy-loading pass. `animate-spin` is neutralized under the
 * global prefers-reduced-motion rule, leaving a static ring.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-0">
      <div className="flex flex-col items-center gap-4">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/10"
          style={{ borderTopColor: "var(--accent-2)" }}
          aria-hidden
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-low">
          Tuning in&hellip;
        </p>
      </div>
    </div>
  );
}
