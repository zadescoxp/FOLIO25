import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Bodoni_Moda,
  Climate_Crisis,
} from "next/font/google";
// import localFont from "next/font/local";
import "./globals.css";
import Lenis from "@/utils/lenis";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  preload: true,
});

const ClimateCrisis = Climate_Crisis({
  variable: "--font-climate-crisis",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Zade Scoxp",
  description:
    "I'm Zade, a creative technologist passionate about design, development, and exploring new technologies. I love turning ideas into clean, functional experiences, and when I'm not building, I'm into football, music, and innovating just for fun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable} ${ClimateCrisis.variable} antialiased`}
      >
        <Lenis>{children}</Lenis>
      </body>
    </html>
  );
}
