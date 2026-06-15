"use client";

import { cn } from "@/lib/utils/cn";
import { audioSynth } from "@/lib/audio";
import {
  projectTypes,
  scopes,
  addOns,
  formatUSD,
  type ProjectTypeId,
  type ScopeId,
  type Estimate,
} from "@/lib/content/estimator";

interface BudgetEstimatorProps {
  projectType: ProjectTypeId;
  scope: ScopeId;
  selectedAddOns: string[];
  onTypeChange: (id: ProjectTypeId) => void;
  onScopeChange: (id: ScopeId) => void;
  onToggleAddOn: (id: string) => void;
  est: Estimate;
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
  est,
}: BudgetEstimatorProps) {
  return (
    <div className="flex flex-col gap-7">
      {/* ── Project type ── */}
      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
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
                  "group relative flex flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all duration-300",
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
      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
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
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 text-center transition-all duration-300",
                  "glass-light",
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
      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mid">
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
                  "relative rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-300 glass-light",
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

      {/* ── Result ── */}
      <div className="relative overflow-hidden rounded-2xl glass-medium px-5 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent-2) 50%, transparent)" }}
        />
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-low">
              Indicative estimate
            </span>
            <span
              className="bg-gradient-to-r from-accent-1 to-accent-2 bg-clip-text text-2xl font-bold text-transparent md:text-3xl"
              aria-live="polite"
            >
              {formatUSD(est.low)} – {formatUSD(est.high)}
            </span>
          </div>
          <span className="max-w-[44%] text-right text-[9.5px] leading-tight text-text-low">
            A ballpark to anchor the conversation — your real quote follows the consultation.
          </span>
        </div>
      </div>
    </div>
  );
}
