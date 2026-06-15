import { channels, type ChannelSlug } from "@/lib/content/channels";

/**
 * Reach data model — the live-activity globe at /reach.
 *
 * This module is the single source of truth for the globe's nodes, arcs, and
 * event copy. It is intentionally framework-agnostic (no three.js, no React) so
 * it can be reused by the renderer, the HUD, and — later — swapped for a real
 * feed. Today the event stream is simulated client-side; see `pickWeightedNode`
 * + `pickMessage`, which a future `useReachFeed()` hook can replace wholesale
 * while the component keeps consuming the same `LiveEvent` shape.
 */

export type NodeTier = "hub" | "major" | "minor";

export type ReachRegion =
  | "Nepal"
  | "South Asia"
  | "Gulf"
  | "East Asia"
  | "SE Asia"
  | "Europe"
  | "Africa"
  | "North America"
  | "South America"
  | "Oceania";

export interface ActivityNode {
  id: string;
  city: string;
  country: string;
  region: ReachRegion;
  lat: number;
  lng: number;
  /** Which company project this activity belongs to (filter dimension). */
  project: ChannelSlug;
  /** Activity intensity — drives marker size and event-pick bias. */
  weight: number;
  tier: NodeTier;
}

export interface ArcLink {
  id: string;
  from: string;
  to: string;
  project: ChannelSlug;
  /** primary = bright Nepal-hub spoke (animated); mesh = dim city↔city link. */
  kind: "primary" | "mesh";
}

export interface LiveEvent {
  id: string;
  stamp: string;
  message: string;
  city: string;
  country: string;
  region: ReachRegion;
  project: ChannelSlug;
}

/** The origin hub. Every primary arc radiates from here. */
export const NEPAL_HUB_ID = "np-pokhara";

/**
 * Globe-local project palette. The brand tokens give Restroverse AND YantraCore
 * the same teal (`--accent-2`), which is ambiguous as a *filter* color, so the
 * globe overrides YantraCore to pink (`--accent-3`). We don't touch channels.ts
 * — its own pages keep the brand teal. Colors are CSS vars resolved to concrete
 * hex at runtime (so they track the active theme) with these fallbacks.
 */
export const PROJECT_COLOR: Record<ChannelSlug, { var: string; fallback: string }> = {
  jimbo: { var: "--accent-1", fallback: "#6E56FF" },
  restroverse: { var: "--accent-2", fallback: "#00E0CB" },
  shramdan: { var: "--accent-warm", fallback: "#FFB454" },
  yantracore: { var: "--accent-3", fallback: "#FF4FB0" },
};

const channelName = (slug: ChannelSlug) => channels.find((c) => c.slug === slug)?.name ?? slug;

/** Chip / legend metadata, in CH-01..04 order. */
export const PROJECT_META = (Object.keys(PROJECT_COLOR) as ChannelSlug[]).map((slug) => ({
  slug,
  name: channelName(slug),
  colorVar: PROJECT_COLOR[slug].var,
  color: PROJECT_COLOR[slug].fallback,
}));

/**
 * ~54 hand-authored nodes across every continent. Nepal carries 10 hubs (the
 * brightest, busiest cluster) so it stays visually primary; the rest of the
 * world fills in to read as "everywhere is connected." Project mix leans
 * Shramdan toward Nepal + the Gulf migrant corridor + Africa, Restroverse toward
 * hospitality capitals, Jimbo + YantraCore toward business / tech hubs.
 */
export const reachNodes: ActivityNode[] = [
  // ── Nepal (hubs) ───────────────────────────────────────────────────────────
  { id: "np-pokhara", city: "Pokhara", country: "Nepal", region: "Nepal", lat: 28.2096, lng: 83.9856, project: "shramdan", weight: 1.6, tier: "hub" },
  { id: "np-kathmandu", city: "Kathmandu", country: "Nepal", region: "Nepal", lat: 27.7172, lng: 85.324, project: "shramdan", weight: 1.5, tier: "hub" },
  { id: "np-lalitpur", city: "Lalitpur", country: "Nepal", region: "Nepal", lat: 27.6588, lng: 85.3247, project: "yantracore", weight: 1.3, tier: "hub" },
  { id: "np-biratnagar", city: "Biratnagar", country: "Nepal", region: "Nepal", lat: 26.4525, lng: 87.2718, project: "shramdan", weight: 1.25, tier: "hub" },
  { id: "np-nepalgunj", city: "Nepalgunj", country: "Nepal", region: "Nepal", lat: 28.05, lng: 81.6167, project: "shramdan", weight: 1.2, tier: "hub" },
  { id: "np-butwal", city: "Butwal", country: "Nepal", region: "Nepal", lat: 27.7006, lng: 83.4484, project: "jimbo", weight: 1.2, tier: "hub" },
  { id: "np-dharan", city: "Dharan", country: "Nepal", region: "Nepal", lat: 26.8065, lng: 87.2846, project: "restroverse", weight: 1.2, tier: "hub" },
  { id: "np-birgunj", city: "Birgunj", country: "Nepal", region: "Nepal", lat: 27.0104, lng: 84.8821, project: "jimbo", weight: 1.2, tier: "hub" },
  { id: "np-janakpur", city: "Janakpur", country: "Nepal", region: "Nepal", lat: 26.7271, lng: 85.9407, project: "shramdan", weight: 1.2, tier: "hub" },
  { id: "np-hetauda", city: "Hetauda", country: "Nepal", region: "Nepal", lat: 27.4287, lng: 85.0322, project: "yantracore", weight: 1.2, tier: "hub" },

  // ── South Asia (majors) ─────────────────────────────────────────────────────
  { id: "in-delhi", city: "Delhi", country: "India", region: "South Asia", lat: 28.6139, lng: 77.209, project: "yantracore", weight: 0.95, tier: "major" },
  { id: "in-mumbai", city: "Mumbai", country: "India", region: "South Asia", lat: 19.076, lng: 72.8777, project: "jimbo", weight: 0.95, tier: "major" },
  { id: "in-kolkata", city: "Kolkata", country: "India", region: "South Asia", lat: 22.5726, lng: 88.3639, project: "shramdan", weight: 0.7, tier: "minor" },
  { id: "bd-dhaka", city: "Dhaka", country: "Bangladesh", region: "South Asia", lat: 23.8103, lng: 90.4125, project: "shramdan", weight: 0.75, tier: "major" },
  { id: "lk-colombo", city: "Colombo", country: "Sri Lanka", region: "South Asia", lat: 6.9271, lng: 79.8612, project: "restroverse", weight: 0.6, tier: "minor" },

  // ── Gulf corridor ───────────────────────────────────────────────────────────
  { id: "ae-dubai", city: "Dubai", country: "UAE", region: "Gulf", lat: 25.2048, lng: 55.2708, project: "jimbo", weight: 0.95, tier: "major" },
  { id: "ae-abudhabi", city: "Abu Dhabi", country: "UAE", region: "Gulf", lat: 24.4539, lng: 54.3773, project: "shramdan", weight: 0.7, tier: "minor" },
  { id: "qa-doha", city: "Doha", country: "Qatar", region: "Gulf", lat: 25.2854, lng: 51.531, project: "shramdan", weight: 0.85, tier: "major" },
  { id: "sa-riyadh", city: "Riyadh", country: "Saudi Arabia", region: "Gulf", lat: 24.7136, lng: 46.6753, project: "jimbo", weight: 0.7, tier: "minor" },
  { id: "kw-kuwait", city: "Kuwait City", country: "Kuwait", region: "Gulf", lat: 29.3759, lng: 47.9774, project: "shramdan", weight: 0.65, tier: "minor" },
  { id: "om-muscat", city: "Muscat", country: "Oman", region: "Gulf", lat: 23.588, lng: 58.3829, project: "restroverse", weight: 0.55, tier: "minor" },

  // ── East Asia ───────────────────────────────────────────────────────────────
  { id: "jp-tokyo", city: "Tokyo", country: "Japan", region: "East Asia", lat: 35.6762, lng: 139.6503, project: "restroverse", weight: 0.9, tier: "major" },
  { id: "kr-seoul", city: "Seoul", country: "South Korea", region: "East Asia", lat: 37.5665, lng: 126.978, project: "yantracore", weight: 0.85, tier: "major" },
  { id: "hk-hongkong", city: "Hong Kong", country: "Hong Kong", region: "East Asia", lat: 22.3193, lng: 114.1694, project: "jimbo", weight: 0.75, tier: "minor" },
  { id: "cn-beijing", city: "Beijing", country: "China", region: "East Asia", lat: 39.9042, lng: 116.4074, project: "yantracore", weight: 0.7, tier: "minor" },

  // ── SE Asia ─────────────────────────────────────────────────────────────────
  { id: "sg-singapore", city: "Singapore", country: "Singapore", region: "SE Asia", lat: 1.3521, lng: 103.8198, project: "jimbo", weight: 0.9, tier: "major" },
  { id: "th-bangkok", city: "Bangkok", country: "Thailand", region: "SE Asia", lat: 13.7563, lng: 100.5018, project: "restroverse", weight: 0.85, tier: "major" },
  { id: "my-kualalumpur", city: "Kuala Lumpur", country: "Malaysia", region: "SE Asia", lat: 3.139, lng: 101.6869, project: "restroverse", weight: 0.65, tier: "minor" },
  { id: "vn-hanoi", city: "Hanoi", country: "Vietnam", region: "SE Asia", lat: 21.0278, lng: 105.8342, project: "restroverse", weight: 0.55, tier: "minor" },
  { id: "id-denpasar", city: "Denpasar", country: "Indonesia", region: "SE Asia", lat: -8.6705, lng: 115.2126, project: "restroverse", weight: 0.6, tier: "minor" },
  { id: "ph-manila", city: "Manila", country: "Philippines", region: "SE Asia", lat: 14.5995, lng: 120.9842, project: "jimbo", weight: 0.65, tier: "minor" },

  // ── Europe ──────────────────────────────────────────────────────────────────
  { id: "gb-london", city: "London", country: "UK", region: "Europe", lat: 51.5072, lng: -0.1276, project: "yantracore", weight: 0.95, tier: "major" },
  { id: "de-berlin", city: "Berlin", country: "Germany", region: "Europe", lat: 52.52, lng: 13.405, project: "yantracore", weight: 0.75, tier: "minor" },
  { id: "fr-paris", city: "Paris", country: "France", region: "Europe", lat: 48.8566, lng: 2.3522, project: "restroverse", weight: 0.8, tier: "major" },
  { id: "nl-amsterdam", city: "Amsterdam", country: "Netherlands", region: "Europe", lat: 52.3676, lng: 4.9041, project: "jimbo", weight: 0.65, tier: "minor" },
  { id: "es-madrid", city: "Madrid", country: "Spain", region: "Europe", lat: 40.4168, lng: -3.7038, project: "restroverse", weight: 0.6, tier: "minor" },
  { id: "pt-lisbon", city: "Lisbon", country: "Portugal", region: "Europe", lat: 38.7223, lng: -9.1393, project: "jimbo", weight: 0.55, tier: "minor" },
  { id: "se-stockholm", city: "Stockholm", country: "Sweden", region: "Europe", lat: 59.3293, lng: 18.0686, project: "yantracore", weight: 0.55, tier: "minor" },

  // ── North America ───────────────────────────────────────────────────────────
  { id: "us-newyork", city: "New York", country: "USA", region: "North America", lat: 40.7128, lng: -74.006, project: "jimbo", weight: 0.95, tier: "major" },
  { id: "us-sanfrancisco", city: "San Francisco", country: "USA", region: "North America", lat: 37.7749, lng: -122.4194, project: "yantracore", weight: 0.9, tier: "major" },
  { id: "ca-toronto", city: "Toronto", country: "Canada", region: "North America", lat: 43.6532, lng: -79.3832, project: "yantracore", weight: 0.65, tier: "minor" },
  { id: "us-austin", city: "Austin", country: "USA", region: "North America", lat: 30.2672, lng: -97.7431, project: "yantracore", weight: 0.6, tier: "minor" },
  { id: "us-chicago", city: "Chicago", country: "USA", region: "North America", lat: 41.8781, lng: -87.6298, project: "jimbo", weight: 0.6, tier: "minor" },
  { id: "us-losangeles", city: "Los Angeles", country: "USA", region: "North America", lat: 34.0522, lng: -118.2437, project: "restroverse", weight: 0.7, tier: "minor" },

  // ── South America ───────────────────────────────────────────────────────────
  { id: "br-saopaulo", city: "São Paulo", country: "Brazil", region: "South America", lat: -23.5558, lng: -46.6396, project: "jimbo", weight: 0.75, tier: "major" },
  { id: "ar-buenosaires", city: "Buenos Aires", country: "Argentina", region: "South America", lat: -34.6037, lng: -58.3816, project: "restroverse", weight: 0.6, tier: "minor" },
  { id: "co-bogota", city: "Bogotá", country: "Colombia", region: "South America", lat: 4.711, lng: -74.0721, project: "jimbo", weight: 0.55, tier: "minor" },

  // ── Africa ──────────────────────────────────────────────────────────────────
  { id: "ke-nairobi", city: "Nairobi", country: "Kenya", region: "Africa", lat: -1.2921, lng: 36.8219, project: "shramdan", weight: 0.7, tier: "major" },
  { id: "ng-lagos", city: "Lagos", country: "Nigeria", region: "Africa", lat: 6.5244, lng: 3.3792, project: "jimbo", weight: 0.65, tier: "minor" },
  { id: "eg-cairo", city: "Cairo", country: "Egypt", region: "Africa", lat: 30.0444, lng: 31.2357, project: "shramdan", weight: 0.6, tier: "minor" },
  { id: "za-capetown", city: "Cape Town", country: "South Africa", region: "Africa", lat: -33.9249, lng: 18.4241, project: "restroverse", weight: 0.6, tier: "minor" },

  // ── Oceania ─────────────────────────────────────────────────────────────────
  { id: "au-sydney", city: "Sydney", country: "Australia", region: "Oceania", lat: -33.8688, lng: 151.2093, project: "restroverse", weight: 0.75, tier: "major" },
  { id: "au-melbourne", city: "Melbourne", country: "Australia", region: "Oceania", lat: -37.8136, lng: 144.9631, project: "yantracore", weight: 0.6, tier: "minor" },
  { id: "nz-auckland", city: "Auckland", country: "New Zealand", region: "Oceania", lat: -36.8485, lng: 174.7633, project: "restroverse", weight: 0.55, tier: "minor" },
];

export const reachNodeById = new Map(reachNodes.map((n) => [n.id, n]));

export const nodesByProject = (project: ChannelSlug | "all") =>
  project === "all" ? reachNodes : reachNodes.filter((n) => n.project === project);

export const projectNodeCount = (project: ChannelSlug) =>
  reachNodes.reduce((sum, n) => sum + (n.project === project ? 1 : 0), 0);

/**
 * Primary arcs: bright spokes from the Nepal hub to the world's gateways. These
 * get animated travelling pulses, so the cap (~24) doubles as the pulse budget.
 */
const PRIMARY_TARGETS: string[] = [
  // every other Nepal hub
  "np-kathmandu", "np-lalitpur", "np-biratnagar", "np-nepalgunj", "np-butwal",
  "np-dharan", "np-birgunj", "np-janakpur", "np-hetauda",
  // global gateways
  "in-delhi", "in-mumbai", "bd-dhaka", "ae-dubai", "qa-doha", "sg-singapore",
  "th-bangkok", "jp-tokyo", "kr-seoul", "gb-london", "us-newyork",
  "us-sanfrancisco", "au-sydney", "ke-nairobi", "br-saopaulo",
];

/**
 * Secondary mesh: dim regional + cross-region city links so the whole world
 * reads as connected (not just a Nepal star-burst). Static — no pulses.
 */
const MESH_PAIRS: Array<[string, string]> = [
  ["ae-dubai", "qa-doha"], ["ae-dubai", "sa-riyadh"], ["ae-dubai", "kw-kuwait"],
  ["qa-doha", "ae-abudhabi"], ["om-muscat", "ae-dubai"],
  ["gb-london", "de-berlin"], ["gb-london", "fr-paris"], ["fr-paris", "es-madrid"],
  ["nl-amsterdam", "de-berlin"], ["gb-london", "pt-lisbon"], ["se-stockholm", "de-berlin"],
  ["gb-london", "us-newyork"], ["us-newyork", "us-sanfrancisco"], ["us-newyork", "ca-toronto"],
  ["us-newyork", "us-chicago"], ["us-sanfrancisco", "us-losangeles"], ["us-austin", "us-chicago"],
  ["jp-tokyo", "kr-seoul"], ["jp-tokyo", "hk-hongkong"], ["hk-hongkong", "cn-beijing"],
  ["sg-singapore", "my-kualalumpur"], ["sg-singapore", "th-bangkok"], ["th-bangkok", "vn-hanoi"],
  ["sg-singapore", "ph-manila"], ["sg-singapore", "id-denpasar"],
  ["br-saopaulo", "ar-buenosaires"], ["br-saopaulo", "co-bogota"],
  ["au-sydney", "au-melbourne"], ["au-sydney", "nz-auckland"], ["sg-singapore", "au-sydney"],
  ["ke-nairobi", "ng-lagos"], ["ke-nairobi", "eg-cairo"], ["eg-cairo", "ae-dubai"],
  ["za-capetown", "ke-nairobi"],
  ["in-mumbai", "in-delhi"], ["in-delhi", "bd-dhaka"], ["bd-dhaka", "in-kolkata"],
  ["lk-colombo", "in-mumbai"],
];

function buildArcs(): ArcLink[] {
  const arcs: ArcLink[] = [];

  for (const to of PRIMARY_TARGETS) {
    const node = reachNodeById.get(to);
    if (!node) continue;
    arcs.push({ id: `pri-${to}`, from: NEPAL_HUB_ID, to, project: node.project, kind: "primary" });
  }

  for (const [from, to] of MESH_PAIRS) {
    const a = reachNodeById.get(from);
    const b = reachNodeById.get(to);
    if (!a || !b) continue;
    // arc inherits the busier endpoint's project for coloring
    const project = a.weight >= b.weight ? a.project : b.project;
    arcs.push({ id: `mesh-${from}-${to}`, from, to, project, kind: "mesh" });
  }

  return arcs;
}

export const reachArcs: ArcLink[] = buildArcs();

/** Per-project event copy. `{city}` is interpolated at runtime. */
export const EVENT_TEMPLATES: Record<ChannelSlug, string[]> = {
  jimbo: [
    "assistant resolved a booking query in {city}",
    "lead captured from a WhatsApp chat in {city}",
    "after-hours reply sent to a customer in {city}",
    "Instagram DM routed to sales in {city}",
    "payment exception handed to a human in {city}",
  ],
  restroverse: [
    "guest searched lakeside stays near {city}",
    "new hospitality profile indexed in {city}",
    "menu synced for a venue in {city}",
    "AI match surfaced a restaurant in {city}",
    "room availability refreshed in {city}",
  ],
  shramdan: [
    "cleanup drive coordinated in {city}",
    "new volunteer joined a drive in {city}",
    "tree-planting hours logged in {city}",
    "relief supplies routed through {city}",
    "community impact updated in {city}",
  ],
  yantracore: [
    "deployment shipped to {city}",
    "edge node responded in {city}",
    "telemetry sampled in {city}",
    "system check passed in {city}",
    "API latency nominal in {city}",
  ],
};

/**
 * Weighted node pick that honours the active project filter and keeps Nepal the
 * primary origin *within* whatever pool is active. Pure — pass your own RNG-free
 * caller (uses Math.random internally for the simulation).
 */
export function pickWeightedNode(active: ChannelSlug | "all"): ActivityNode {
  const pool = nodesByProject(active);
  const nepalNodes = pool.filter((n) => n.region === "Nepal");
  const usable = Math.random() < 0.58 && nepalNodes.length ? nepalNodes : pool;

  const total = usable.reduce((sum, n) => sum + n.weight, 0);
  let roll = Math.random() * total;
  for (const node of usable) {
    roll -= node.weight;
    if (roll <= 0) return node;
  }
  return usable[usable.length - 1];
}

export function pickMessage(node: ActivityNode): string {
  const templates = EVENT_TEMPLATES[node.project];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template.replace("{city}", node.city);
}
