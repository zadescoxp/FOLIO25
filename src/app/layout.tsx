import type { Metadata, Viewport } from "next";
import { Geist_Mono, Great_Vibes, Instrument_Serif, Inter_Tight, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import Lenis from "@/utils/lenis";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400" });
const script = Great_Vibes({ variable: "--font-script", subsets: ["latin"], weight: "400" });
const pixel = Pixelify_Sans({ variable: "--font-pixel", subsets: ["latin"] });
const text = Inter_Tight({ variable: "--font-text", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = "Zade";
const description = "AI Engineer based in Bengaluru. Folio@26.";

// The share image itself comes from opengraph-image.png and twitter-image.png in this
// folder. metadataBase turns their paths into the full URLs that platforms require.
export const metadata: Metadata = {
  metadataBase: new URL("https://zadescoxp.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: title,
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@zadescoxp",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#111110",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${script.variable} ${pixel.variable} ${text.variable} ${mono.variable}`}>
        <noscript>
          <style>{`.rise{transform:none!important}.hero-name,.hero-side,.site-nav,[data-type]{opacity:1!important;visibility:visible!important}.contact-art .emoji-window{opacity:1!important}`}</style>
        </noscript>
        <Lenis>{children}</Lenis>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
