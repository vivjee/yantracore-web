import type { Metadata } from "next";
import { SiteBackground } from "@/components/backgrounds/SiteBackground";
import { TvFrame } from "@/components/layout/TvFrame";
import { BookConsultation } from "@/components/book/BookConsultation";

/**
 * Book a Consultation ( /book ) — a "channel" page (its own TV frame; keeps the
 * CRT channel-change feel, not part of the orbital group). Server-rendered for
 * SEO; the interactive estimator + intake form live in the client child.
 */
export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Shape your project, get an indicative budget in seconds, and start a conversation with YantraCore — software, AI, and infrastructure for ambitious companies.",
};

export default function BookPage() {
  return (
    <>
      <SiteBackground />
      <TvFrame>
        <BookConsultation />
      </TvFrame>
    </>
  );
}
