import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ColorfulLogo } from "@/components/brand/ColorfulLogo";

const footerLinks = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Technologies", href: "/technologies" },
  { label: "Lab", href: "/lab" },
  { label: "Book", href: "/book" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 mt-20">
      <Container width="default">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <ColorfulLogo size={24} animate={false} />
            <span className="text-sm text-text-faint font-mono">
              © {new Date().getFullYear()} YantraCore
            </span>
          </div>

          {/* Nav links */}
          <nav
            className="flex items-center gap-6 flex-wrap justify-center"
            aria-label="Footer navigation"
          >
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-text-low transition-colors duration-200 hover:text-text-hi"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Legal */}
          <div className="flex items-center gap-4">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-text-faint transition-colors duration-200 hover:text-text-low"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
