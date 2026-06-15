import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Rise } from "@/components/motion/Rise";
import { PostCard } from "@/components/lab/PostCard";
import { fetchPosts } from "@/lib/api/posts";

/**
 * Lab ( /lab ) — the blog index. A channel page (own TV frame, internal scroll),
 * server-rendered for SEO, rendering every note from `lib/api/posts.ts`. The
 * content source swaps to a CMS later without touching this view.
 */
export const metadata: Metadata = {
  title: "Lab",
  description:
    "Notes from the workshop — on craft, AI, and the work of building things that last.",
};

export default async function LabPage() {
  const posts = await fetchPosts();

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar px-6 pb-24 pt-12 md:pt-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Rise delay={0.08}>
                <Eyebrow>Lab Notes</Eyebrow>
              </Rise>
              <Rise delay={0.16}>
                <h1
                  className="mt-3 font-display text-4xl font-bold tracking-tight text-text-hi md:text-5xl"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
                >
                  The Lab
                </h1>
              </Rise>
              <Rise delay={0.24}>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-mid md:text-base">
                  Notes from the workshop — on craft, AI, and the work of building things
                  that last.
                </p>
              </Rise>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Rise key={post.slug} delay={0.32 + i * 0.08} className="h-full">
                  <PostCard post={post} />
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </TvFrame>
    </>
  );
}
