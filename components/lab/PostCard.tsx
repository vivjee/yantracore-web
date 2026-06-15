import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { Post } from "@/lib/api/posts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * PostCard — a single Lab note as a glass card linking to /lab/[slug]. Pure
 * markup (CSS-only hover), so it works in server components — used by the Lab
 * index grid and the "more notes" strip on a post.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/lab/${post.slug}`}
      className="block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1"
    >
      <GlassCard variant="light" className="group h-full">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-accent-1/20 bg-accent-1/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-1">
              {post.category}
            </span>
            <span className="font-mono text-[10px] text-text-faint">{post.readingMinutes} min</span>
          </div>
          <h3 className="flex-1 text-base font-semibold leading-snug text-text-hi transition-colors duration-300 group-hover:text-accent-1">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-text-low">{post.excerpt}</p>
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="text-xs text-text-faint">{formatDate(post.date)}</span>
            <span className="flex items-center gap-1 font-mono text-xs text-accent-1 transition-transform duration-300 group-hover:translate-x-1">
              Read
              <ArrowRight size={11} aria-hidden />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
