"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import { useProfile } from "@/context/profile-context";
import {
  type ReadingMode,
  useReadingMode,
} from "@/context/reading-mode-context";
import { LOCALES } from "@/lib/i18n";

interface SiteHeaderProps {
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}

const READING_MODES: {
  value: ReadingMode;
  labelKey: "mode.paper" | "mode.warm";
  hintKey: "mode.paperHint" | "mode.warmHint";
  swatch: string;
}[] = [
  {
    value: "paper",
    labelKey: "mode.paper",
    hintKey: "mode.paperHint",
    swatch: "#F8F3EA",
  },
  {
    value: "warm",
    labelKey: "mode.warm",
    hintKey: "mode.warmHint",
    swatch: "#EFE7D8",
  },
];

const NAV_LINKS: {
  href: string;
  labelKey: "nav.home" | "nav.issues" | "nav.articles" | "nav.videos" | "nav.about";
}[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/arxiv", labelKey: "nav.issues" },
  { href: "/#maqolalar", labelKey: "nav.articles" },
  { href: "/#videolar", labelKey: "nav.videos" },
  { href: "/#masthead", labelKey: "nav.about" },
];

type OpenPanel = "lang" | "mode" | null;

export function SiteHeader({
  onOpenProfile,
  onOpenSearch,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const { mode, setMode } = useReadingMode();
  const { initial: profileInitial } = useProfile();
  const [openPanel, setOpenPanel] =
    useState<OpenPanel>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(
    null,
  );

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      return;
    }

    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (!openPanel) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );
    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [openPanel]);

  const chromeText = "text-[var(--gz-ink)]";
  const chromeHover = "hover:bg-[var(--gz-ink)]/8";

  return (
    <header
      className="paper-panel sticky top-0 z-50 border-b border-[var(--gz-hairline)] transition-all duration-500"
      ref={containerRef}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
          isScrolled ? "h-14" : "h-16"
        }`}
      >
        <Link
          aria-label="Temiryo‘lchi bosh sahifasi"
          className="flex min-w-0 items-center gap-2.5"
          href="/"
        >
          <span className="relative h-9 w-9 shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Image
              alt="Temiryo‘lchi logotipi"
              className="object-contain"
              fill
              priority
              src="/images/temiryolchi-logo.png"
            />
          </span>
          <strong
            className={`truncate font-display text-base font-black tracking-tight sm:text-xl ${chromeText}`}
          >
            Temiryo‘lchi
          </strong>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              className={`group relative px-3 py-2 text-[13px] font-bold uppercase tracking-[0.04em] transition ${chromeText}`}
              href={link.href}
              key={link.href}
            >
              {t(link.labelKey)}
              <span className="absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-[var(--gz-ink)] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            aria-label={t("nav.search")}
            className={`grid h-10 w-10 place-items-center rounded-full transition ${chromeText} ${chromeHover}`}
            onClick={onOpenSearch}
            type="button"
          >
            <Icon name="search" size={18} />
          </button>

          <div className="relative">
            <button
              aria-label={t("nav.language")}
              className={`grid h-10 w-10 place-items-center rounded-full transition ${chromeText} ${chromeHover} ${
                openPanel === "lang" ? "bg-[var(--gz-ink)]/8" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) =>
                  current === "lang"
                    ? null
                    : "lang",
                )
              }
              type="button"
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                width="18"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
            </button>

            {openPanel === "lang" ? (
              <div className="paper-panel absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl py-1.5 shadow-2xl">
                {LOCALES.map((entry) => (
                  <button
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold transition ${
                      entry.code === locale
                        ? "bg-[var(--gz-bronze)]/10 text-[var(--gz-ink)]"
                        : "text-[var(--gz-ink-soft)] hover:bg-[var(--gz-bronze)]/5"
                    }`}
                    key={entry.code}
                    onClick={() => {
                      setLocale(entry.code);
                      setOpenPanel(null);
                    }}
                    type="button"
                  >
                    {entry.label}
                    {entry.code === locale ? (
                      <Icon
                        className="text-[var(--gz-bronze)]"
                        name="check"
                        size={15}
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              aria-label={t("nav.readingMode")}
              className={`grid h-10 w-10 place-items-center rounded-full transition ${chromeText} ${chromeHover} ${
                openPanel === "mode" ? "bg-[var(--gz-ink)]/8" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) =>
                  current === "mode"
                    ? null
                    : "mode",
                )
              }
              type="button"
            >
              <Icon name="eye" size={18} />
            </button>

            {openPanel === "mode" ? (
              <div className="paper-panel absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl py-1.5 shadow-2xl">
                {READING_MODES.map((entry) => (
                  <button
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      entry.value === mode
                        ? "bg-[var(--gz-bronze)]/10"
                        : "hover:bg-[var(--gz-bronze)]/5"
                    }`}
                    key={entry.value}
                    onClick={() => {
                      setMode(entry.value);
                      setOpenPanel(null);
                    }}
                    type="button"
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-[var(--gz-ink)]/15 shadow-inner"
                      style={{
                        background: entry.swatch,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[var(--gz-ink)]">
                        {t(entry.labelKey)}
                      </span>
                      <span className="block text-[11px] text-[var(--gz-ink-soft)]">
                        {t(entry.hintKey)}
                      </span>
                    </span>
                    {entry.value === mode ? (
                      <Icon
                        className="shrink-0 text-[var(--gz-bronze)]"
                        name="check"
                        size={15}
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            aria-label={t("nav.profile")}
            className="ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gz-bronze)] to-[var(--gz-navy)] text-sm font-black text-white shadow-md ring-2 ring-transparent transition hover:ring-white/30"
            onClick={onOpenProfile}
            type="button"
          >
            {profileInitial}
          </button>
        </div>
      </div>
    </header>
  );
}
