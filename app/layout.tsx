import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/chrome/SmoothScrollProvider";
import { Cursor } from "@/components/chrome/Cursor";
import { Header } from "@/components/chrome/Header";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-0 text-text-hi antialiased">
        <ThemeProvider>
          <Cursor />
          <Header />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
