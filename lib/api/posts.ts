export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingMinutes: number;
}

/**
 * v1: returns static placeholder posts.
 * v2: swap to fetch from WordPress (REST or WPGraphQL).
 *
 * The shape mirrors WordPress's response so swap is config-only.
 */
const STATIC_POSTS: Post[] = [
  {
    slug: "on-building-jimbo",
    title: "On building Jimbo, our AI agent for the messages people actually send",
    excerpt:
      "We wanted an agent that meets businesses where their customers already are — WhatsApp, Instagram, SMS. Here's what we learned shipping it across four channels.",
    date: "2026-04-12",
    category: "Field Notes",
    readingMinutes: 7,
  },
  {
    slug: "the-quiet-work-of-software",
    title: "The quiet work of software",
    excerpt:
      "Most of what we build is invisible by design. A note on why we treat that as the goal, not a compromise.",
    date: "2026-03-28",
    category: "Craft",
    readingMinutes: 4,
  },
  {
    slug: "shramdan-handover",
    title: "Handing Shramdan to the community that built it with us",
    excerpt:
      "A short essay on starting something you intend to give away — and the practical shape of doing so.",
    date: "2026-03-04",
    category: "Community",
    readingMinutes: 6,
  },
];

export async function fetchPosts(limit?: number): Promise<Post[]> {
  // v1 stub
  return limit ? STATIC_POSTS.slice(0, limit) : STATIC_POSTS;
}

export async function fetchPost(slug: string): Promise<Post | null> {
  return STATIC_POSTS.find((p) => p.slug === slug) ?? null;
}
