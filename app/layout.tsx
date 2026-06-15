import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron, Space_Grotesk, Syncopate, Syne, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/chrome/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { NowPlayingDock } from "@/components/chrome/NowPlayingDock";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { AudioPlayerProvider } from "@/lib/audio/AudioPlayerContext";
import { ShortcutsProvider } from "@/lib/shortcuts/ShortcutsProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-syncopate",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yantracore.com"),
  title: {
    default: "YantraCore — The mechanisms that move modern business",
    template: "%s — YantraCore",
  },
  description:
    "YantraCore engineers software, AI, and infrastructure for ambitious companies — and for the communities we belong to.",
  openGraph: {
    title: "YantraCore — The mechanisms that move modern business",
    description:
      "YantraCore engineers software, AI, and infrastructure for ambitious companies — and for the communities we belong to.",
    url: "https://yantracore.com",
    siteName: "YantraCore",
    images: [
      {
        url: "/images/brand/frame-hero-og.png",
        width: 1200,
        height: 630,
        alt: "YantraCore — Engineering software that matters",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YantraCore — The mechanisms that move modern business",
    description:
      "YantraCore engineers software, AI, and infrastructure for ambitious companies — and for the communities we belong to.",
    images: ["/images/brand/frame-hero-og.png"],
  },
};

// `viewportFit: "cover"` lets the layout extend under notches/rounded corners so
// our `env(safe-area-inset-*)` padding can reclaim that space deliberately.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#06070D",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${spaceGrotesk.variable} ${syncopate.variable} ${syne.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-0 text-text-hi antialiased">
        {/* Skip link — first tab stop; lets keyboard users jump past the chrome. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:border focus:border-accent-2/50 focus:bg-ink-1 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-text-hi focus:no-underline focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <AudioPlayerProvider>
            <ShortcutsProvider>
              <Cursor />
              <NowPlayingDock />
              <SmoothScrollProvider>
                {/* `display:contents` focus target — no box, so it can't disturb
                    the 100dvh / app-mode layout, but keyboard focus still lands
                    here and Tab continues into the page content. */}
                <div id="main-content" tabIndex={-1} className="contents">
                  {children}
                </div>
              </SmoothScrollProvider>
            </ShortcutsProvider>
          </AudioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
