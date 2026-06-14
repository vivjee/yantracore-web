import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  CalendarCheck,
  ChartNoAxesCombined,
  Cpu,
  Database,
  Globe2,
  HandHeart,
  HeartHandshake,
  Hotel,
  MessageCircle,
  RadioTower,
  Search,
  Server,
  Sparkles,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

export type ChannelSlug = "jimbo" | "restroverse" | "shramdan" | "yantracore";

export interface ChannelStat {
  label: string;
  value: string;
  trend: string;
}

export interface ChannelSearchItem {
  title: string;
  category: string;
  detail: string;
}

export interface ChannelFeature {
  title: string;
  description: string;
  metric: string;
  icon: LucideIcon;
}

export interface ChannelConfig {
  slug: ChannelSlug;
  channelCode: string;
  name: string;
  logo: string;
  accent: string;
  secondaryAccent: string;
  tagline: string;
  summary: string;
  primaryCta: string;
  primaryHref: string;
  primaryExternal?: boolean;
  status: string;
  liveFeedLabel: string;
  searchPlaceholder: string;
  stats: ChannelStat[];
  logSeeds: string[];
  searchItems: ChannelSearchItem[];
  features: ChannelFeature[];
}

export const channels: ChannelConfig[] = [
  {
    slug: "jimbo",
    channelCode: "CH-01",
    name: "Jimbo",
    logo: "/images/logo/jimbo_logo.png",
    accent: "var(--accent-1)",
    secondaryAccent: "var(--accent-2)",
    tagline: "AI business assistant across every customer channel.",
    summary:
      "Jimbo watches customer conversations, answers questions, captures leads, and keeps bookings moving without making the team babysit every inbox.",
    primaryCta: "Hire Jimbo",
    primaryHref: "https://jimbo.yantracore.com/",
    primaryExternal: true,
    status: "AGENT ONLINE",
    liveFeedLabel: "Conversation feed",
    searchPlaceholder: "Search automations, channels, or use cases...",
    stats: [
      { label: "Channels", value: "4", trend: "WhatsApp + social" },
      { label: "Lead capture", value: "92%", trend: "+8% simulated" },
      { label: "Avg reply", value: "1.4s", trend: "low latency" },
      { label: "Handoff", value: "24/7", trend: "always on" },
    ],
    logSeeds: [
      "WHATSAPP: booking question classified as high intent",
      "JIMBO: drafted reply using business knowledge base",
      "CRM: new lead profile enriched with channel source",
      "ROUTER: human handoff queued for payment exception",
      "SYNC: Restroverse availability context refreshed",
    ],
    searchItems: [
      {
        title: "WhatsApp booking assistant",
        category: "Channel",
        detail: "Handles availability, follow-ups, and confirmation messages.",
      },
      {
        title: "Instagram lead capture",
        category: "Automation",
        detail: "Turns DMs and comments into structured sales opportunities.",
      },
      {
        title: "Restroverse sync",
        category: "Integration",
        detail: "Reads hospitality listings, room details, and service context.",
      },
      {
        title: "Human handoff",
        category: "Support",
        detail: "Escalates sensitive requests with the conversation history intact.",
      },
    ],
    features: [
      {
        title: "Multi-channel inbox",
        description: "WhatsApp, Instagram, Facebook, and SMS conversations in one agent loop.",
        metric: "4 live lanes",
        icon: MessageCircle,
      },
      {
        title: "Brand-trained replies",
        description: "Answers stay aligned with the business voice, policies, and service rules.",
        metric: "context aware",
        icon: Bot,
      },
      {
        title: "Booking-ready flow",
        description: "Captures intent, checks availability, and prepares the next action.",
        metric: "fast handoff",
        icon: CalendarCheck,
      },
    ],
  },
  {
    slug: "restroverse",
    channelCode: "CH-02",
    name: "Restroverse",
    logo: "/images/logo/restroverse_logo.png",
    accent: "var(--accent-2)",
    secondaryAccent: "var(--accent-3)",
    tagline: "Hospitality discovery with AI search and rich profiles.",
    summary:
      "Restroverse helps people discover restaurants, stays, menus, rooms, and experiences with enough detail to choose confidently.",
    primaryCta: "Showcase Business",
    primaryHref: "https://restroverse.app",
    primaryExternal: true,
    status: "DISCOVERY LIVE",
    liveFeedLabel: "Discovery feed",
    searchPlaceholder: "Search hotels, menus, profiles, or guest signals...",
    stats: [
      { label: "Profiles", value: "128", trend: "indexed" },
      { label: "Searches", value: "3.8k", trend: "this week" },
      { label: "Menus", value: "412", trend: "synced" },
      { label: "AI match", value: "87%", trend: "intent fit" },
    ],
    logSeeds: [
      "SEARCH: guest asked for lakeside stays with breakfast",
      "PROFILE: Dwarika's Heritage image set refreshed",
      "MENU: vegetarian filter matched 42 items",
      "JIMBO: availability context requested for follow-up",
      "RANKER: boosted profiles with verified amenities",
    ],
    searchItems: [
      {
        title: "AI hospitality search",
        category: "Search",
        detail: "Natural-language discovery for restaurants, hotels, rooms, and food.",
      },
      {
        title: "Rich business profile",
        category: "Profile",
        detail: "Visual pages for menus, rooms, amenities, and guest-ready details.",
      },
      {
        title: "Jimbo integration",
        category: "Agent sync",
        detail: "Feeds accurate profile context into customer conversations.",
      },
      {
        title: "Experience filters",
        category: "Discovery",
        detail: "Lets visitors narrow by mood, location, food, budget, or occasion.",
      },
    ],
    features: [
      {
        title: "AI-powered discovery",
        description: "Turns broad intent into relevant hospitality recommendations.",
        metric: "intent search",
        icon: Search,
      },
      {
        title: "Profiles with depth",
        description: "Combines rooms, food, amenities, location, and visuals in one view.",
        metric: "360 profile",
        icon: Hotel,
      },
      {
        title: "Food and stay graph",
        description: "Connects menus, properties, and experiences so results feel useful.",
        metric: "linked data",
        icon: UtensilsCrossed,
      },
    ],
  },
  {
    slug: "shramdan",
    channelCode: "CH-03",
    name: "Shramdan",
    logo: "/images/logo/shramdaan_logo.png",
    accent: "var(--accent-warm)",
    secondaryAccent: "var(--accent-2)",
    tagline: "Community work made visible, coordinated, and easier to join.",
    summary:
      "Shramdan turns local problems into shared action by helping people discover work, join drives, and see collective progress.",
    primaryCta: "Contribute Labor",
    primaryHref: "https://shramdan.org",
    primaryExternal: true,
    status: "COMMUNITY ACTIVE",
    liveFeedLabel: "Community feed",
    searchPlaceholder: "Search drives, impact, volunteers, or places...",
    stats: [
      { label: "Volunteers", value: "2.4k", trend: "+118 joined" },
      { label: "Drives", value: "64", trend: "active + done" },
      { label: "Hours", value: "9.7k", trend: "contributed" },
      { label: "Places", value: "18", trend: "served" },
    ],
    logSeeds: [
      "DRIVE: cleanup task moved to active coordination",
      "VOLUNTEER: new participant joined tree planting group",
      "IMPACT: waste collection estimate updated",
      "MAP: ward-level task cluster refreshed",
      "STORY: community photo added to recent works",
    ],
    searchItems: [
      {
        title: "Cleanup coordination",
        category: "Drive",
        detail: "Organizes people, locations, timing, and visible progress.",
      },
      {
        title: "Tree planting work",
        category: "Community",
        detail: "Tracks participation and local environmental impact.",
      },
      {
        title: "Volunteer matching",
        category: "People",
        detail: "Helps people find nearby tasks they can actually join.",
      },
      {
        title: "Impact storytelling",
        category: "Proof",
        detail: "Shows what changed after the community showed up.",
      },
    ],
    features: [
      {
        title: "Local action board",
        description: "Turns community needs into clear work that people can join.",
        metric: "64 drives",
        icon: HandHeart,
      },
      {
        title: "Volunteer momentum",
        description: "Shows who is joining, where help is needed, and what changed.",
        metric: "2.4k people",
        icon: Users,
      },
      {
        title: "Impact memory",
        description: "Keeps stories, photos, and progress visible beyond the event day.",
        metric: "public proof",
        icon: HeartHandshake,
      },
    ],
  },
  {
    slug: "yantracore",
    channelCode: "CH-04",
    name: "YantraCore",
    logo: "/images/logo/yantracore_logo.png",
    accent: "var(--accent-2)",
    secondaryAccent: "var(--accent-1)",
    tagline: "The studio signal for software, AI, systems, and launch work.",
    summary:
      "YantraCore is the build engine behind the products, client systems, infrastructure, and operational dashboards that keep the portfolio moving.",
    primaryCta: "View System Stats",
    primaryHref: "/stats",
    status: "SYSTEM NOMINAL",
    liveFeedLabel: "Studio feed",
    searchPlaceholder: "Search services, systems, stacks, or delivery signals...",
    stats: [
      { label: "Services", value: "6", trend: "studio stack" },
      { label: "Nodes", value: "8", trend: "edge ready" },
      { label: "Uptime", value: "99.9%", trend: "simulated" },
      { label: "Build loop", value: "4x", trend: "discover to ship" },
    ],
    logSeeds: [
      "BUILD: product channel template compiled",
      "EDGE: app routes responding inside TV frame",
      "AI: telemetry panel sampled simulated load",
      "OPS: launch checklist status refreshed",
      "DESIGN: primary CTA surface reused from glass system",
    ],
    searchItems: [
      {
        title: "Web app development",
        category: "Capability",
        detail: "Modern frontend and backend systems for practical products.",
      },
      {
        title: "AI integration",
        category: "Capability",
        detail: "Agents, search, embeddings, automations, and applied workflows.",
      },
      {
        title: "Cloud infrastructure",
        category: "System",
        detail: "Deployments, APIs, databases, observability, and scale paths.",
      },
      {
        title: "Product delivery loop",
        category: "Process",
        detail: "Discovery, prototype, launch, and measurement without theatre.",
      },
    ],
    features: [
      {
        title: "Software systems",
        description: "Apps, dashboards, APIs, and operational tools built to be used daily.",
        metric: "full stack",
        icon: Server,
      },
      {
        title: "AI and data",
        description: "Search, agents, analytics, and workflow automation where they help.",
        metric: "applied AI",
        icon: Cpu,
      },
      {
        title: "Live operations",
        description: "Telemetry, diagnostics, and status views that make systems legible.",
        metric: "monitorable",
        icon: ChartNoAxesCombined,
      },
    ],
  },
];

export const channelSlugs = channels.map((channel) => channel.slug);

export function getChannel(slug: string) {
  return channels.find((channel) => channel.slug === slug);
}

export const channelNavItems = channels.map((channel) => ({
  slug: channel.slug,
  name: channel.name,
  href: `/channels/${channel.slug}`,
  logo: channel.logo,
}));

export const liveSignalIcons = [RadioTower, Activity, Globe2, Database, Sparkles, Zap];
