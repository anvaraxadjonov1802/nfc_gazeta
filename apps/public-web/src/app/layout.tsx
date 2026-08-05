import type {
  Metadata,
} from "next";
import type {
  ReactNode,
} from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Temiryo‘lchi — elektron gazeta",
    template:
      "%s | Temiryo‘lchi",
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
    <html lang="uz">
      <body>
        <SiteHeader />

        <div className="site-content">
          {children}
        </div>

        <SiteFooter />
      </body>
    </html>
  );
}