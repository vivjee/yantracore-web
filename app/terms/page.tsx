import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of the YantraCore website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="June 2026">
      <p>
        These terms govern your use of this website. They are a working draft and will
        be replaced with reviewed legal copy before launch.
      </p>

      <LegalSection heading="Using this site">
        <p>
          You&rsquo;re welcome to browse, read, and get in touch. Please don&rsquo;t
          attempt to disrupt the site, scrape it at scale, or use it in ways that break
          the law or harm others.
        </p>
      </LegalSection>

      <LegalSection heading="Our work & content">
        <p>
          The brand, copy, visuals, and code on this site belong to YantraCore unless
          stated otherwise. Product names and client marks belong to their respective
          owners. Nothing here is a binding offer or quote — engagements are agreed in
          writing.
        </p>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          The site is provided &ldquo;as is.&rdquo; We work hard to keep it accurate and
          available, but we can&rsquo;t guarantee it will always be error-free or
          uninterrupted.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          If anything here is unclear, reach out via the{" "}
          <Link href="/contact" className="text-accent-2 underline-offset-4 hover:underline">
            contact page
          </Link>{" "}
          and we&rsquo;ll be glad to help.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
