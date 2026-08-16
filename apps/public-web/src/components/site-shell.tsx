"use client";

import { type ReactNode, useState } from "react";

import { AccessibilityToolbar } from "@/components/accessibility-toolbar";
import { ProfilePanel } from "@/components/profile-panel";
import { ScrollProgress } from "@/components/scroll-progress";
import { SearchDialog } from "@/components/search-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AccessibilityProvider } from "@/context/accessibility-context";
import { LocaleProvider } from "@/context/locale-context";
import { ProfileProvider } from "@/context/profile-context";
import { ReadingModeProvider } from "@/context/reading-mode-context";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const [isAccessibilityOpen, setIsAccessibilityOpen] =
    useState(false);
  const [isSearchOpen, setIsSearchOpen] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] =
    useState(false);

  return (
    <LocaleProvider>
      <ReadingModeProvider>
        <ProfileProvider>
          <AccessibilityProvider>
            <div className="flex min-h-screen flex-col bg-paper text-[var(--gz-ink)] selection:bg-[var(--gz-bronze)] selection:text-white">
              <ScrollProgress />
              <SiteHeader
                onOpenProfile={() =>
                  setIsProfileOpen(true)
                }
                onOpenSearch={() =>
                  setIsSearchOpen(true)
                }
              />

              <div className="flex-1">{children}</div>

              <SiteFooter
                onOpenAccessibility={() =>
                  setIsAccessibilityOpen(true)
                }
              />

              <AccessibilityToolbar
                isOpen={isAccessibilityOpen}
                onClose={() =>
                  setIsAccessibilityOpen(false)
                }
              />
              <SearchDialog
                isOpen={isSearchOpen}
                onClose={() =>
                  setIsSearchOpen(false)
                }
              />
              <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() =>
                  setIsProfileOpen(false)
                }
                onOpenAccessibility={() =>
                  setIsAccessibilityOpen(true)
                }
              />
            </div>
          </AccessibilityProvider>
        </ProfileProvider>
      </ReadingModeProvider>
    </LocaleProvider>
  );
}
