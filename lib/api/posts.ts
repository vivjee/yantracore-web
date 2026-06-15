export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingMinutes: number;
  /** Post body as Markdown (GFM). v2: comes from the CMS as rendered/raw content. */
  body: string;
}

/**
 * v1: returns static placeholder posts.
 * v2: swap to fetch from WordPress (REST or WPGraphQL).
 *
 * The shape mirrors WordPress's response so the swap is config-only. The bodies
 * are written to read as real Lab notes — replace the words, keep the shape.
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
    body: `Most "AI for business" lives behind a login nobody opens twice. We wanted the opposite: an agent that answers where customers already are — the thread they're already in.

## Meet people in their inbox, not yours

A restaurant's customers don't want a portal. They want to ask "are you open tonight?" on WhatsApp and get an answer in seconds. So Jimbo's first job was never "be clever" — it was "be there." We started with WhatsApp, then Instagram, then SMS and Facebook, because that's the order real businesses asked for.

The hard part isn't the model. It's the seams between channels: identity, history, and tone all change shape when the same conversation moves from a DM to a text. Getting those seams invisible took longer than the reply logic did.

## Boring reliability beats clever answers

We learned to optimise for the unglamorous things first — delivery, latency, knowing when *not* to answer and hand off to a human. An agent that's right 95% of the time but escalates the other 5% gracefully feels trustworthy. One that's right 99% of the time but fumbles the handoff does not.

## What's next

Jimbo gets sharper as it learns a business's own context — its menu, its hours, its voice. That's where the Restroverse integration comes in, and where the next note will go.`,
  },
  {
    slug: "the-quiet-work-of-software",
    title: "The quiet work of software",
    excerpt:
      "Most of what we build is invisible by design. A note on why we treat that as the goal, not a compromise.",
    date: "2026-03-28",
    category: "Craft",
    readingMinutes: 4,
    body: `The best software disappears. You notice the booking that just worked, the sync that never dropped, the page that loaded before you finished blinking — and then you forget about it. That forgetting is the point.

## Invisible is the goal, not the consolation prize

It's tempting to chase the visible: the dashboard with forty charts, the animation that demos well. But the work that compounds is quieter — the migration that didn't lose a row, the queue that drained at 3am while everyone slept.

We treat that invisibility as a craft target. If a system needs explaining, it usually needs simplifying first.

## How we keep it honest

We measure the boring things, write the runbook before we need it, and delete more code than we'd like to admit. None of it shows up in a screenshot. All of it shows up in the months after launch, when the thing just keeps working.`,
  },
  {
    slug: "shramdan-handover",
    title: "Handing Shramdan to the community that built it with us",
    excerpt:
      "A short essay on starting something you intend to give away — and the practical shape of doing so.",
    date: "2026-03-04",
    category: "Community",
    readingMinutes: 6,
    body: `We started Shramdan with a plan to let go of it. That sounds like a contradiction until you've watched a community outgrow the people who seeded it — which is exactly what we were hoping for.

## Build it to be given away

Designing for handover changes your decisions from day one. You document differently. You pick tools people can actually run without you. You resist the urge to make yourself necessary.

The Sanskrit *shramdan* means a donation of labour — work given freely for the common good. A tool for that has to be ownable by the people doing the work, not rented from us forever.

## The practical shape of letting go

Handover isn't an event; it's a slope. We moved from doing, to doing-alongside, to advising, to watching. Each step we removed a dependency on YantraCore and added one the community controlled.

We're not all the way there yet. But the direction is set, and the destination — fully community-owned and run — is the whole reason we built it.`,
  },
];

export async function fetchPosts(limit?: number): Promise<Post[]> {
  // v1 stub
  return limit ? STATIC_POSTS.slice(0, limit) : STATIC_POSTS;
}

export async function fetchPost(slug: string): Promise<Post | null> {
  return STATIC_POSTS.find((p) => p.slug === slug) ?? null;
}
