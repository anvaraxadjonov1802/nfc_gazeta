import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Cormorant_Garamond,
  Inter,
  Newsreader,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const fontCormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const fontSourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Temiryo‘lchi — elektron gazeta",
    template: "%s | Temiryo‘lchi",
  },
  description:
    "Temiryo‘lchi gazetasining elektron nashrlari, arxivi va maqolalari.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      className={`${fontSans.variable} ${fontSerif.variable} ${fontPlayfair.variable} ${fontCormorant.variable} ${fontSourceSerif.variable}`}
      lang="uz"
    >
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
