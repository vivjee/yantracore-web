"use client";

import { cn } from "@/lib/utils/cn";
import { audioSynth } from "@/lib/audio";
import {
  projectTypes,
  scopes,
  addOns,
  type ProjectTypeId,
  type ScopeId,
} from "@/lib/content/estimator";

interface BudgetEstimatorProps {
  projectType: ProjectTypeId;
  scope: ScopeId;
  selectedAddOns: string[];
  onTypeChange: (id: ProjectTypeId) => void;
  onScopeChange: (id: ScopeId) => void;
  onToggleAddOn: (id: string) => void;
}

/**
 * BudgetEstimator — a calm, interactive "configure your project" panel that
 * produces an indicative budget range. Controlled: the parent owns the
 * selections (so the intake form can prefill from the same estimate). Styling
 * stays on the existing neumorphic glass system + accent tokens; selection is
 * encoded with a static accent ring/glow (not just motion) so it reads under
 * reduced-motion too.
 */
export function BudgetEstimator({
  projectType,
  scope,
  selectedAddOns,
  onTypeChange,
  onScopeChange,
  onToggleAddOn,
}: BudgetEstimatorProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Project type ── */}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
          What are we building?
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {projectTypes.map((t) => {
            const active = t.id === projectType;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => {
                  audioSynth.playClick();
                  onTypeChange(t.id);
                }}
                style={{ ["--opt-accent" as string]: t.accent } as React.CSSProperties}
                className={cn(
                  "group relative flex cursor-pointer flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60",
                  active ? "glass-light" : "glass-light opacity-80 hover:opacity-100"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
                  style={{
                    opacity: active ? 1 : 0,
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--opt-accent) 55%, transparent), 0 0 20px color-mix(in srgb, var(--opt-accent) 28%, transparent)",
                  }}
                />
                <Icon
                  className="relative z-10 h-4 w-4 transition-colors"
                  style={{ color: active ? "var(--opt-accent)" : "var(--text-mid)" }}
                />
                <span className="relative z-10 text-[12.5px] font-semibold text-text-hi">{t.label}</span>
                <span className="relative z-10 text-[9.5px] leading-tight text-text-low">{t.blurb}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── Scope ── */}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
          How big is it?
        </legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {scopes.map((s) => {
            const active = s.id === scope;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => {
                  audioSynth.playClick();
                  onScopeChange(s.id);
                }}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 text-center transition-all duration-300",
                  "glass-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2/60",
                  active ? "" : "opacity-70 hover:opacity-100"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
                  style={{
                    opacity: active ? 1 : 0,
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--accent-2) 55%, transparent), 0 0 16px color-mix(in srgb, var(--accent-2) 25%, transparent)",
                  }}
                />
                <span
                  className="relative z-10 text-[12px] font-semibold"
                  style={{ color: active ? "var(--accent-2)" : "var(--text-hi)" }}
                >
                  {s.label}
                </span>
                <span className="relative z-10 text-[9px] leading-tight text-text-low">{s.blurb}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ── Add-ons ── */}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
          Anything else? <span className="text-text-low normal-case tracking-normal">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {addOns.map((a) => {
            const active = selectedAddOns.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={active}
                onMouseEnter={() => audioSynth.playHover()}
                onClick={() => {
                  audioSynth.playClick();
                  onToggleAddOn(a.id);
                }}
                className={cn(
                  "relative cursor-pointer rounded-full px-3.5 py-2 text-[11px] font-medium transition-all duration-300 glass-light",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1/60",
                  active ? "text-text-hi" : "text-text-mid opacity-75 hover:opacity-100"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
                  style={{
                    opacity: active ? 1 : 0,
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in srgb, var(--accent-1) 50%, transparent), 0 0 14px color-mix(in srgb, var(--accent-1) 22%, transparent)",
                  }}
                />
                <span className="relative z-10">{active ? "✓ " : "+ "}{a.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
