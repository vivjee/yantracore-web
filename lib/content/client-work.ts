export interface ClientProject {
  id: string;
  name: string;
  description: string;
  tags: string[];
  /** If set, shown as "View live →" link in the modal */
  url?: string;
}

/**
 * v1: placeholder client projects.
 * Each maps to a logo SVG in public/images/clients/.
 * Real entries + URLs added without code changes.
 */
export const clientProjects: ClientProject[] = [
  {
    id: "shopify-1",
    name: "Shopify Store",
    description:
      "Custom headless Shopify storefront with a bespoke checkout experience and real-time inventory sync.",
    tags: ["Shopify", "Next.js", "TypeScript"],
  },
  {
    id: "wp-1",
    name: "WordPress Platform",
    description:
      "Headless WordPress CMS powering a multi-brand content hub with custom Gutenberg blocks.",
    tags: ["WordPress", "React", "REST API"],
  },
  {
    id: "aws-1",
    name: "Cloud Migration",
    description:
      "Migrated a legacy monolith to a containerised AWS architecture with zero downtime deployment.",
    tags: ["AWS", "Docker", "Node.js"],
  },
  {
    id: "mobile-1",
    name: "Mobile App",
    description:
      "Cross-platform React Native app with offline-first sync and push notifications across iOS and Android.",
    tags: ["React Native", "Firebase", "Expo"],
  },
  {
    id: "ai-1",
    name: "AI Integration",
    description:
      "Embedded LLM-powered search and recommendation engine into an existing SaaS product.",
    tags: ["OpenAI", "Python", "Pinecone"],
  },
  {
    id: "api-1",
    name: "API Platform",
    description:
      "Designed and built a GraphQL API platform serving 3 front-end clients from a single source of truth.",
    tags: ["GraphQL", "Node.js", "Postgres"],
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
