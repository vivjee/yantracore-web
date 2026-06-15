import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How YantraCore handles the information you share with us.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This page explains, in plain terms, what information YantraCore collects when
        you use this site, why we collect it, and the choices you have. It is a working
        draft and will be replaced with reviewed legal copy before launch.
      </p>

      <LegalSection heading="What we collect">
        <p>
          When you submit a form (contact, consultation, or a product notify list) we
          collect what you give us — typically your name, email, and message, plus any
          optional details like company or attachments. We also collect basic, anonymous
          usage signals to understand which pages are useful.
        </p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>
          We use what you share solely to respond to you, scope work, and improve the
          site. We do not sell your information, and we don&rsquo;t share it with third
          parties except the services we use to run YantraCore (and only as needed).
        </p>
      </LegalSection>

      <LegalSection heading="Cookies & storage">
        <p>
          Your theme, font, cursor, and motion preferences are saved locally in your
          browser so the site remembers how you like it. These never leave your device.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can ask us what we hold about you, ask us to correct it, or ask us to
          delete it. Just reach out via the{" "}
          <Link href="/contact" className="text-accent-2 underline-offset-4 hover:underline">
            contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
