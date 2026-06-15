import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { PostCard } from "@/components/lab/PostCard";
import { fetchPost, fetchPosts } from "@/lib/api/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Map Markdown elements onto the design system (no typography plugin in use). */
const mdComponents: Components = {
  h2: ({ node, ...props }) => <h2 className="mt-3 text-xl font-semibold text-text-hi" {...props} />,
  h3: ({ node, ...props }) => <h3 className="mt-2 text-lg font-semibold text-text-hi" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-accent-2 underline-offset-4 hover:underline" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-text-faint" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="ml-5 flex list-decimal flex-col gap-2 marker:text-text-faint" {...props} />
  ),
  strong: ({ node, ...props }) => <strong className="font-semibold text-text-hi" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-accent-1/40 pl-4 italic text-text-low" {...props} />
  ),
  code: ({ node, ...props }) => (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-text-hi" {...props} />
  ),
};

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Note not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function LabPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const more = (await fetchPosts()).filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <SiteBackground />
      <TvFrame>
        <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar px-6 pb-24 pt-12 md:pt-20">
          <article className="mx-auto max-w-[720px]">
            <Link
              href="/lab"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-low transition-colors hover:text-text-hi"
            >
              <ArrowLeft size={13} aria-hidden /> All notes
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-text-low">
              <span className="text-accent-1">{post.category}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <h1
              className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-text-hi md:text-4xl"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
            >
              {post.title}
            </h1>

            <div className="mt-8 flex flex-col gap-5 text-[15px] leading-relaxed text-text-mid md:text-base">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {post.body}
              </ReactMarkdown>
            </div>

            {more.length > 0 && (
              <div className="mt-16 border-t border-white/[0.06] pt-10">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-low">
                  More notes
                </p>
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {more.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </TvFrame>
    </>
  );
}
