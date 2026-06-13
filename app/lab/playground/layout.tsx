import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Glass primitives review surface.",
};

export default function LabPlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
