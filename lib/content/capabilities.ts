import type { LucideIcon } from "lucide-react";
import { Globe, Smartphone, Server, Cloud, BrainCircuit, Palette } from "lucide-react";

export interface Capability {
  id: string;
  index: string;
  title: string;
  description: string;
  bullets: string[];
  stack: string[];
  icon: LucideIcon;
  accentVar: string; // CSS variable name for accent color
}

export const capabilities: Capability[] = [
  {
    id: "web",
    index: "01",
    title: "Web",
    description:
      "Modern marketing sites and web applications built for speed, SEO, and delight. From headless storefronts to custom portals — if it runs in a browser, we build it beautifully.",
    bullets: [
      "Next.js & React app frontends",
      "Headless WordPress & Shopify themes",
      "Performance-first, Core Web Vitals green",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "WordPress", "Shopify"],
    icon: Globe,
    accentVar: "--accent-1",
  },
  {
    id: "apps",
    index: "02",
    title: "Apps",
    description:
      "Native-quality mobile experiences on iOS and Android. We move fast with React Native where cross-platform makes sense, and reach for native Swift/Kotlin when the craft demands it.",
    bullets: [
      "iOS & Android applications",
      "React Native cross-platform",
      "Offline-capable, push-ready",
    ],
    stack: ["React Native", "Expo", "Swift", "Kotlin", "Firebase"],
    icon: Smartphone,
    accentVar: "--accent-2",
  },
  {
    id: "apis",
    index: "03",
    title: "APIs & Backends",
    description:
      "The invisible layer that makes everything else work. We design APIs that are clean to consume, easy to evolve, and built to handle real load from day one.",
    bullets: [
      "REST & GraphQL API design",
      "Node.js / Express / Fastify services",
      "Third-party integrations & webhooks",
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "Stripe"],
    icon: Server,
    accentVar: "--accent-3",
  },
  {
    id: "cloud",
    index: "04",
    title: "Cloud & Infra",
    description:
      "Deployments that stay up, scale out, and don't cost a fortune. We architect the stack, manage the databases, and keep things running so you don't have to think about it.",
    bullets: [
      "AWS, GCP & Azure architecture",
      "CI/CD pipelines & DevOps",
      "Database management & backups",
    ],
    stack: ["AWS", "GCP", "Docker", "GitHub Actions", "Terraform", "Postgres"],
    icon: Cloud,
    accentVar: "--accent-1",
  },
  {
    id: "ai",
    index: "05",
    title: "AI & Data",
    description:
      "From embedding pipelines to production agent systems — we build AI that earns its place in your product, not AI for the sake of a press release.",
    bullets: [
      "LLM integration & agent systems",
      "Embeddings, RAG & vector search",
      "Data pipelines & analytics infra",
    ],
    stack: ["OpenAI", "Anthropic", "LangChain", "Pinecone", "Python", "dbt"],
    icon: BrainCircuit,
    accentVar: "--accent-2",
  },
  {
    id: "design",
    index: "06",
    title: "Design",
    description:
      "Product design that feels considered — not templated. From brand systems to interaction design to component libraries, we bring the same craft to the visual layer as we do to the code.",
    bullets: [
      "Product & UI/UX design",
      "Brand systems & design tokens",
      "Interactive prototypes & component libraries",
    ],
    stack: ["Figma", "Framer", "Storybook", "Lottie", "Adobe CC"],
    icon: Palette,
    accentVar: "--accent-3",
  },
];
