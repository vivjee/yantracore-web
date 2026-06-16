/* ============================================================
   YantraCore — Brand Palette Definitions
   All palettes share the same ink (background) tokens; only
   the 4 accent tokens differ. Switching palettes = instant
   full-app color change.
   ============================================================ */

export interface Palette {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  accent1: string; // --accent-1 (primary CTA, links)
  accent2: string; // --accent-2 (secondary, pairs with accent1)
  accent3: string; // --accent-3 (tertiary badge)
  accentWarm: string; // --accent-warm (human touches)
  // Preview gradient for the swatch card
  previewGradient: string;
  // Glow colours used in animated backgrounds (rgba strings)
  glow1: string; // used in MeshGradient / Orbs position 1
  glow2: string; // used in MeshGradient / Orbs position 2
  glow3: string; // used in MeshGradient position 3
}

export const PALETTES: Palette[] = [
  {
    id: "crystal",
    name: "Crystal",
    tagline: "The default — vibrant violet and teal",
    emoji: "💎",
    accent1: "#6E56FF",
    accent2: "#00E0CB",
    accent3: "#FF4FB0",
    accentWarm: "#FFB454",
    previewGradient: "linear-gradient(135deg, #6E56FF 0%, #00E0CB 60%, #FF4FB0 100%)",
    glow1: "rgba(110, 86, 255, 0.5)",
    glow2: "rgba(0, 224, 203, 0.4)",
    glow3: "rgba(255, 79, 176, 0.25)",
  },
  {
    id: "ember",
    name: "Sovereign Ember",
    tagline: "Forge, power, energy — deep fire",
    emoji: "🔥",
    accent1: "#E8400A",
    accent2: "#F5A623",
    accent3: "#FF6B35",
    accentWarm: "#FCD34D",
    previewGradient: "linear-gradient(135deg, #E8400A 0%, #F5A623 60%, #FCD34D 100%)",
    glow1: "rgba(232, 64, 10, 0.5)",
    glow2: "rgba(245, 166, 35, 0.4)",
    glow3: "rgba(255, 107, 53, 0.25)",
  },
  {
    id: "glacier",
    name: "Glacier Deep",
    tagline: "Electric precision — scientific clarity",
    emoji: "🌊",
    accent1: "#0EA5E9",
    accent2: "#10D9A0",
    accent3: "#38BDF8",
    accentWarm: "#FDE68A",
    previewGradient: "linear-gradient(135deg, #0EA5E9 0%, #10D9A0 60%, #38BDF8 100%)",
    glow1: "rgba(14, 165, 233, 0.5)",
    glow2: "rgba(16, 217, 160, 0.4)",
    glow3: "rgba(56, 189, 248, 0.25)",
  },
  {
    id: "sakura",
    name: "Obsidian Sakura",
    tagline: "Editorial luxury — Arc / Linear energy",
    emoji: "🌸",
    accent1: "#F1F5F9",
    accent2: "#FB7185",
    accent3: "#E879F9",
    accentWarm: "#FDBA74",
    previewGradient: "linear-gradient(135deg, #F1F5F9 0%, #FB7185 50%, #E879F9 100%)",
    glow1: "rgba(241, 245, 249, 0.3)",
    glow2: "rgba(251, 113, 133, 0.4)",
    glow3: "rgba(232, 121, 249, 0.25)",
  },
  {
    id: "chrome",
    name: "Void Chrome",
    tagline: "Terminal hacker — quietly dangerous",
    emoji: "⚡",
    accent1: "#A3E635",
    accent2: "#818CF8",
    accent3: "#34D399",
    accentWarm: "#FCD34D",
    previewGradient: "linear-gradient(135deg, #A3E635 0%, #818CF8 60%, #34D399 100%)",
    glow1: "rgba(163, 230, 53, 0.45)",
    glow2: "rgba(129, 140, 248, 0.4)",
    glow3: "rgba(52, 211, 153, 0.25)",
  },
  {
    id: "verdant",
    name: "Verdant Bloom",
    tagline: "Botanical and alive — moss after rain",
    emoji: "🌿",
    accent1: "#059669",
    accent2: "#84CC16",
    accent3: "#2DD4BF",
    accentWarm: "#EAB308",
    previewGradient: "linear-gradient(135deg, #059669 0%, #84CC16 60%, #EAB308 100%)",
    glow1: "rgba(5, 150, 105, 0.5)",
    glow2: "rgba(132, 204, 22, 0.4)",
    glow3: "rgba(45, 212, 191, 0.25)",
  },
  {
    id: "amethyst",
    name: "Royal Amethyst",
    tagline: "Regal purples gilded in gold",
    emoji: "👑",
    accent1: "#A855F7",
    accent2: "#D946EF",
    accent3: "#C084FC",
    accentWarm: "#FBBF24",
    previewGradient: "linear-gradient(135deg, #A855F7 0%, #D946EF 60%, #FBBF24 100%)",
    glow1: "rgba(168, 85, 247, 0.5)",
    glow2: "rgba(217, 70, 239, 0.4)",
    glow3: "rgba(192, 132, 252, 0.25)",
  },
  {
    id: "coral",
    name: "Coral Tide",
    tagline: "Sun-warmed reef — playful and bright",
    emoji: "🐚",
    accent1: "#FF6B6B",
    accent2: "#22D3EE",
    accent3: "#FB923C",
    accentWarm: "#FDE047",
    previewGradient: "linear-gradient(135deg, #FF6B6B 0%, #22D3EE 55%, #FDE047 100%)",
    glow1: "rgba(255, 107, 107, 0.5)",
    glow2: "rgba(34, 211, 238, 0.4)",
    glow3: "rgba(251, 146, 60, 0.25)",
  },
  {
    id: "graphite",
    name: "Graphite Mono",
    tagline: "Quiet, ink-and-silver minimalism",
    emoji: "🖤",
    accent1: "#CBD5E1",
    accent2: "#94A3B8",
    accent3: "#E2E8F0",
    accentWarm: "#D6D3D1",
    previewGradient: "linear-gradient(135deg, #E2E8F0 0%, #94A3B8 60%, #64748B 100%)",
    glow1: "rgba(203, 213, 225, 0.3)",
    glow2: "rgba(148, 163, 184, 0.3)",
    glow3: "rgba(226, 232, 240, 0.2)",
  },
  {
    id: "goldenhour",
    name: "Golden Hour",
    tagline: "Late-afternoon gold and rose",
    emoji: "🌅",
    accent1: "#FBBF24",
    accent2: "#FB7185",
    accent3: "#FDBA74",
    accentWarm: "#F59E0B",
    previewGradient: "linear-gradient(135deg, #FBBF24 0%, #FB7185 60%, #F59E0B 100%)",
    glow1: "rgba(251, 191, 36, 0.5)",
    glow2: "rgba(251, 113, 133, 0.4)",
    glow3: "rgba(253, 186, 116, 0.25)",
  },
];

export const DEFAULT_PALETTE_ID = "crystal";

export function getPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
