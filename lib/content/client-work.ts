/**
 * Ownership tier for anything in the portfolio.
 * - `owned`     — YantraCore builds it AND runs it (YantraCore, Jimbo, Restroverse).
 *                 These live as the bespoke interactive cards in the /projects
 *                 solar system, not in this list.
 * - `community` — YC founded and seeded it; the community now owns and runs it
 *                 (Shramdan). A collaborator model, not ownership.
 * - `client`    — YC built it; the client owns it. The entries below.
 *
 * The field is here so the data model can describe the whole portfolio in one
 * vocabulary even though the inner cards are hand-built components.
 */
export type ProjectTier = "owned" | "community" | "client";

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  tags: string[];
  /** Path to the logo mark under public/images/clients/. */
  logo: string;
  tier: ProjectTier;
  /** If set, shown as "View live →" in the card and modal. */
  url?: string;
}

/**
 * The client constellation — work YantraCore shipped for others, shown as the
 * outer orbit on /projects (the inner orbit is YC's own products).
 *
 * v1: 12 dummy projects with generated SVG logos in public/images/clients/.
 * Swap names, descriptions, tags, logo files, and real URLs in place — no
 * component changes needed. (Until then the URLs are plausible placeholders and
 * will not resolve.)
 */
export const clientProjects: ClientProject[] = [
  {
    id: "lumora",
    name: "Lumora",
    description:
      "Headless Shopify storefront with a bespoke checkout, real-time inventory sync, and a sub-second product experience that lifted conversion across every device.",
    tags: ["Shopify", "Next.js", "TypeScript"],
    logo: "/images/clients/lumora.svg",
    tier: "client",
    url: "https://lumora.shop",
  },
  {
    id: "verdant",
    name: "Verdant",
    description:
      "A carbon-analytics dashboard turning messy emissions data into clear, auditable reports — with live charts and one-click compliance exports.",
    tags: ["React", "D3", "Node.js"],
    logo: "/images/clients/verdant.svg",
    tier: "client",
    url: "https://verdant.eco",
  },
  {
    id: "nimbus-freight",
    name: "Nimbus Freight",
    description:
      "Logistics platform with live shipment tracking, route optimization, and a GraphQL API powering both the web console and partner integrations.",
    tags: ["Next.js", "GraphQL", "PostgreSQL"],
    logo: "/images/clients/nimbus-freight.svg",
    tier: "client",
    url: "https://nimbusfreight.io",
  },
  {
    id: "aether-health",
    name: "Aether Health",
    description:
      "Cross-platform telehealth app with offline-first records, secure video visits, and push reminders — shipped to iOS and Android from one codebase.",
    tags: ["React Native", "Expo", "Firebase"],
    logo: "/images/clients/aether-health.svg",
    tier: "client",
    url: "https://aetherhealth.app",
  },
  {
    id: "quill-co",
    name: "Quill & Co",
    description:
      "Headless WordPress publishing hub serving a multi-brand editorial network through custom Gutenberg blocks and a fast, SEO-tuned front end.",
    tags: ["WordPress", "React", "REST API"],
    logo: "/images/clients/quill-co.svg",
    tier: "client",
    url: "https://quilland.co",
  },
  {
    id: "solstice-realty",
    name: "Solstice Realty",
    description:
      "Property marketplace with map-driven search, saved alerts, and rich listing pages — backed by a typed data layer that keeps inventory in sync.",
    tags: ["Next.js", "Mapbox", "Prisma"],
    logo: "/images/clients/solstice-realty.svg",
    tier: "client",
    url: "https://solsticerealty.com",
  },
  {
    id: "forge-analytics",
    name: "Forge Analytics",
    description:
      "B2B business-intelligence suite querying billions of rows in milliseconds, with a drag-and-drop report builder and embeddable customer dashboards.",
    tags: ["React", "Python", "ClickHouse"],
    logo: "/images/clients/forge-analytics.svg",
    tier: "client",
    url: "https://forgeanalytics.io",
  },
  {
    id: "pulse-fitness",
    name: "Pulse Fitness",
    description:
      "Class-booking and membership app with wearable sync, Stripe billing, and a coach-side console — one membership graph across studio and mobile.",
    tags: ["React Native", "Node.js", "Stripe"],
    logo: "/images/clients/pulse-fitness.svg",
    tier: "client",
    url: "https://pulsefitness.app",
  },
  {
    id: "cobalt-bank",
    name: "Cobalt",
    description:
      "Fintech onboarding and KYC flow with bank-grade verification, encrypted document handling, and an audit trail — deployed to a hardened AWS estate.",
    tags: ["Next.js", "TypeScript", "AWS"],
    logo: "/images/clients/cobalt-bank.svg",
    tier: "client",
    url: "https://cobalt.finance",
  },
  {
    id: "harvest-table",
    name: "Harvest Table",
    description:
      "Restaurant ordering and reservations platform with live table availability, online payments, and a kitchen display that updates in real time.",
    tags: ["Next.js", "Stripe", "Supabase"],
    logo: "/images/clients/harvest-table.svg",
    tier: "client",
    url: "https://harvesttable.co",
  },
  {
    id: "orbit-labs",
    name: "Orbit Labs",
    description:
      "AI document search for legal teams — semantic retrieval over thousands of contracts with cited answers, built on an embeddings pipeline and vector store.",
    tags: ["Python", "OpenAI", "Pinecone"],
    logo: "/images/clients/orbit-labs.svg",
    tier: "client",
    url: "https://orbitlabs.ai",
  },
  {
    id: "meridian-edu",
    name: "Meridian",
    description:
      "Learning platform with adaptive course paths, live cohorts, and progress analytics — a typed end-to-end stack that scaled to tens of thousands of learners.",
    tags: ["Next.js", "tRPC", "PostgreSQL"],
    logo: "/images/clients/meridian-edu.svg",
    tier: "client",
    url: "https://meridian.education",
  },
];

/** Tech/tool logos shown in the marquee. SVG files go in public/images/tech/. */
export const techLogos = [
  { id: "nextjs", label: "Next.js" },
  { id: "react", label: "React" },
  { id: "shopify", label: "Shopify" },
  { id: "wordpress", label: "WordPress" },
  { id: "aws", label: "AWS" },
  { id: "node", label: "Node.js" },
  { id: "postgres", label: "PostgreSQL" },
  { id: "typescript", label: "TypeScript" },
  { id: "figma", label: "Figma" },
  { id: "openai", label: "OpenAI" },
];
