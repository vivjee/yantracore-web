import type { LucideIcon } from "lucide-react";
import { Globe, Smartphone, Server, Cloud, BrainCircuit, Palette } from "lucide-react";

/**
 * Budget estimator data + math for the Book a Consultation page (/book).
 *
 * The numbers are INDICATIVE placeholders (round, defensible ranges) so the
 * estimator produces a believable ballpark — the real quote always follows a
 * conversation. Keep `ProjectTypeId` / `BudgetBucket` aligned with
 * `lib/api/project.ts`'s `ProjectSchema` so the estimate can prefill the form.
 */

export type ProjectTypeId = "web" | "app" | "api" | "cloud" | "ai" | "design";

export interface ProjectTypeOption {
  id: ProjectTypeId;
  label: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  baseLow: number;
  baseHigh: number;
}

export const projectTypes: ProjectTypeOption[] = [
  { id: "web", label: "Web", blurb: "Sites, web apps, headless commerce", icon: Globe, accent: "var(--accent-1)", baseLow: 6000, baseHigh: 12000 },
  { id: "app", label: "Mobile App", blurb: "iOS, Android, React Native", icon: Smartphone, accent: "var(--accent-2)", baseLow: 12000, baseHigh: 28000 },
  { id: "api", label: "API / Backend", blurb: "Services, integrations, pipelines", icon: Server, accent: "var(--accent-3)", baseLow: 8000, baseHigh: 18000 },
  { id: "cloud", label: "Cloud / Infra", blurb: "AWS·GCP·Azure, deploy, databases", icon: Cloud, accent: "var(--accent-1)", baseLow: 7000, baseHigh: 16000 },
  { id: "ai", label: "AI / Data", blurb: "Agents, model integration, embeddings", icon: BrainCircuit, accent: "var(--accent-2)", baseLow: 14000, baseHigh: 35000 },
  { id: "design", label: "Design", blurb: "Product, UI, brand systems", icon: Palette, accent: "var(--accent-3)", baseLow: 4000, baseHigh: 10000 },
];

export type ScopeId = "small" | "medium" | "large" | "enterprise";

export interface ScopeOption {
  id: ScopeId;
  label: string;
  blurb: string;
  mult: number;
}

export const scopes: ScopeOption[] = [
  { id: "small", label: "Focused", blurb: "One clear goal", mult: 0.7 },
  { id: "medium", label: "Standard", blurb: "A complete product", mult: 1 },
  { id: "large", label: "Ambitious", blurb: "Multi-surface", mult: 1.8 },
  { id: "enterprise", label: "Enterprise", blurb: "Scale & compliance", mult: 3 },
];

export interface AddOnOption {
  id: string;
  label: string;
  addLow: number;
  addHigh: number;
}

export const addOns: AddOnOption[] = [
  { id: "ai", label: "AI features", addLow: 6000, addHigh: 15000 },
  { id: "mobile", label: "Companion mobile app", addLow: 8000, addHigh: 20000 },
  { id: "integrations", label: "3rd-party integrations", addLow: 3000, addHigh: 8000 },
  { id: "design-system", label: "Design system", addLow: 4000, addHigh: 10000 },
  { id: "analytics", label: "Analytics & dashboards", addLow: 2000, addHigh: 6000 },
  { id: "support", label: "3-month support", addLow: 3000, addHigh: 9000 },
];

export type TimelineId = "asap" | "1-3mo" | "3-6mo" | "flexible";

export interface TimelineOption {
  id: TimelineId;
  label: string;
  blurb: string;
}

export const timelines: TimelineOption[] = [
  { id: "asap", label: "ASAP", blurb: "Ready now" },
  { id: "1-3mo", label: "1–3 months", blurb: "Planning ahead" },
  { id: "3-6mo", label: "3–6 months", blurb: "On the roadmap" },
  { id: "flexible", label: "Flexible", blurb: "No fixed date" },
];

export type BudgetBucket = "under-10k" | "10k-25k" | "25k-50k" | "50k-plus" | "discuss";

export const bucketLabels: Record<BudgetBucket, string> = {
  "under-10k": "Under $10k",
  "10k-25k": "$10k – $25k",
  "25k-50k": "$25k – $50k",
  "50k-plus": "$50k+",
  discuss: "Let's discuss",
};

export interface Estimate {
  low: number;
  high: number;
  bucket: BudgetBucket;
}

const round500 = (n: number) => Math.round(n / 500) * 500;

export function estimate(typeId: ProjectTypeId, scopeId: ScopeId, addOnIds: string[]): Estimate {
  const type = projectTypes.find((t) => t.id === typeId) ?? projectTypes[0];
  const scope = scopes.find((s) => s.id === scopeId) ?? scopes[1];
  const chosen = addOns.filter((a) => addOnIds.includes(a.id));

  const low = round500(type.baseLow * scope.mult + chosen.reduce((sum, a) => sum + a.addLow, 0));
  const high = round500(type.baseHigh * scope.mult + chosen.reduce((sum, a) => sum + a.addHigh, 0));

  const mid = (low + high) / 2;
  const bucket: BudgetBucket =
    mid < 10000 ? "under-10k" : mid < 25000 ? "10k-25k" : mid < 50000 ? "25k-50k" : "50k-plus";

  return { low, high, bucket };
}

export function formatUSD(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
