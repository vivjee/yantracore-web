import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "YantraMate AI dashboard — ask questions, explore your data.",
};

/**
 * Dashboard layout — simply passes children through.
 * The TV frame is rendered inside the page itself (like /stats and /settings)
 * so the trademark TV layout is always present.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
