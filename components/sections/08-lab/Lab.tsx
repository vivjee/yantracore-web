import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { fetchPosts } from "@/lib/api/posts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function Lab() {
  const posts = await fetchPosts(3);

  return (
    <section id="lab" className="relative py-32 md:py-48 overflow-hidden">
      <Container width="default" className="relative z-10">
        {/* Two-column layout: text + posts on left, large illustration on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 items-start">
          {/* Left column */}
          <div>
            {/* Header */}
            <Reveal>
              <Eyebrow>08 — Lab Notes</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h2
                className="mt-6 font-semibold text-text-hi tracking-tight leading-[1.1]"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                }}
              >
                We think, too.
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 text-lg text-text-mid max-w-2xl leading-relaxed">
                Notes from the workshop — on craft, AI, and the work of building
                things that last.
              </p>
            </Reveal>

            {/* Post cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={240 + i * 100}>
                  <Link
                    href={`/lab/${post.slug}`}
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 rounded-3xl"
                  >
                    <GlassCard variant="light" className="h-full group">
                      <div className="flex flex-col gap-4 h-full">
                        {/* Category chip */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-1 px-2 py-0.5 rounded-full bg-accent-1/10 border border-accent-1/20">
                            {post.category}
                          </span>
                          <span className="text-[10px] font-mono text-text-faint">
                            {post.readingMinutes} min
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-text-hi leading-snug flex-1 group-hover:text-accent-1 transition-colors duration-300">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-text-low leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Date + read more */}
                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-xs text-text-faint">
                            {formatDate(post.date)}
                          </span>
                          <span className="text-xs text-accent-1 font-mono flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                            Read
                            <ArrowRight size={11} aria-hidden />
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* All notes CTA */}
            <Reveal delay={450} className="mt-12">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2.5 text-sm font-medium text-text-mid transition-colors duration-300 hover:text-accent-1 font-mono group"
              >
                <BookOpen size={14} aria-hidden />
                All notes
                <ArrowRight
                  size={13}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          {/* Right column: large atmospheric illustration */}
          <Reveal delay={150} className="hidden lg:block">
            <div className="sticky top-24 relative">
              {/* Glow behind the illustration */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(110,86,255,0.18) 0%, rgba(0,224,203,0.08) 50%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              {/* Social / content illustration */}
              <Image
                src="/images/brand/illus-social.svg"
                alt="Content and ideas illustration"
                width={340}
                height={300}
                className="w-full h-auto relative z-10"
                style={{ filter: "brightness(1.05) saturate(0.9)" }}
              />

              {/* A second illustration for depth */}
              <div className="mt-6 relative">
                <div
                  aria-hidden
                  className="absolute -inset-4"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,180,84,0.12) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <Image
                  src="/images/brand/illus-branding.svg"
                  alt="Branding illustration"
                  width={340}
                  height={280}
                  className="w-full h-auto relative z-10 opacity-70"
                  style={{ filter: "brightness(1.0) saturate(0.85)" }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
