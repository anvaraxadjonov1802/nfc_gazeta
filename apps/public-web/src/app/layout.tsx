import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Newsreader } from "next/font/google";

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
      className={`${fontSans.variable} ${fontSerif.variable}`}
      lang="uz"
    >
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
