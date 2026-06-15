import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description:
    "The YantraCore component library — a single source of truth for the buttons, badges, tags, cards, icons, and motion primitives the site is built from.",
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
