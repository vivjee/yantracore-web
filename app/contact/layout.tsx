import type { Metadata } from "next";

/**
 * Metadata carrier for the (client) Contact page. Server layout so /contact
 * gets a real title/description for SEO while the form stays a client component.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with YantraCore — questions, collaborations, or a project you have in mind.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
