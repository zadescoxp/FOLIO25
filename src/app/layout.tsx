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
  title: "Zade",
  description:
    "I build random shit !!!",
  openGraph: {
    images: ["https://pub-2c7c82dc6e1b454aa49b18934e696d3d.r2.dev/Portfolio%20Meta%20Image.png"]
  }
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
