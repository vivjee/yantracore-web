export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Optional: accent color to use. Defaults to accent-1. */
  accent?: "accent-1" | "accent-2" | "accent-3" | "accent-warm";
}

/**
 * v1: Placeholder testimonials.
 * Real quotes from clients swap in here without any code changes.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "YantraCore didn't just build what we asked for — they built what we actually needed. The difference between the two was about six months of our roadmap.",
    author: "Placeholder Name",
    role: "Founder",
    company: "Placeholder Company",
    accent: "accent-1",
  },
  {
    id: "t2",
    quote:
      "We'd worked with agencies before. YantraCore is something different — they're builders who happen to take client work. The quality of thinking shows.",
    author: "Placeholder Name",
    role: "CTO",
    company: "Placeholder Company",
    accent: "accent-2",
  },
  {
    id: "t3",
    quote:
      "Shipped on time. Zero drama. The codebase they handed us was the cleanest I'd seen from an outside team. That's not an accident.",
    author: "Placeholder Name",
    role: "VP Engineering",
    company: "Placeholder Company",
    accent: "accent-warm",
  },
];
