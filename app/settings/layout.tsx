import type { Metadata } from "next";

/**
 * Metadata carrier for the (client) Settings page. Server layout so /settings
 * gets a real title/description while the preferences UI stays client-side.
 */
export const metadata: Metadata = {
  title: "Settings",
  description:
    "Tune the YantraCore experience — palette, typography, cursor, and motion preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
