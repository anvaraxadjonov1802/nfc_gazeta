"use client";

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
  labelKey: "mode.paper" | "mode.white" | "mode.night";
  hintKey:
    | "mode.paperHint"
    | "mode.whiteHint"
    | "mode.nightHint";
  swatch: string;
}[] = [
  {
    value: "paper",
    labelKey: "mode.paper",
    hintKey: "mode.paperHint",
    swatch: "#EFE6D2",
  },
  {
    value: "white",
    labelKey: "mode.white",
    hintKey: "mode.whiteHint",
    swatch: "#FFFFFF",
  },
  {
    value: "night",
    labelKey: "mode.night",
    hintKey: "mode.nightHint",
    swatch: "#121821",
  },
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
  const isTransparent = isHome && !isScrolled;

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "glass-panel border-b border-white/10 shadow-[0_10px_40px_-15px_rgba(2,10,25,0.6)]"
      }`}
      ref={containerRef}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          aria-label="Temiryo‘lchi bosh sahifasi"
          className="flex min-w-0 items-center gap-2.5"
          href="/"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--canvas-electric)] to-[var(--canvas-royal)] text-lg font-black text-white shadow-md">
            T
          </span>
          <strong className="truncate text-base font-black tracking-tight text-white sm:text-xl">
            Temiryo‘lchi
          </strong>
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            aria-label={t("nav.search")}
            className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10"
            onClick={onOpenSearch}
            type="button"
          >
            <Icon name="search" size={18} />
          </button>

          <div className="relative">
            <button
              aria-label={t("nav.language")}
              className={`grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10 ${
                openPanel === "lang"
                  ? "bg-white/10"
                  : ""
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
              <div className="glass-panel absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl py-1.5 shadow-2xl">
                {LOCALES.map((entry) => (
                  <button
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold transition ${
                      entry.code === locale
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5"
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
                        className="text-[var(--canvas-electric)]"
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
              className={`grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10 ${
                openPanel === "mode"
                  ? "bg-white/10"
                  : ""
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
              <div className="glass-panel absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl py-1.5 shadow-2xl">
                {READING_MODES.map((entry) => (
                  <button
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      entry.value === mode
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    }`}
                    key={entry.value}
                    onClick={() => {
                      setMode(entry.value);
                      setOpenPanel(null);
                    }}
                    type="button"
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-white/20 shadow-inner"
                      style={{
                        background: entry.swatch,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-white">
                        {t(entry.labelKey)}
                      </span>
                      <span className="block text-[11px] text-white/50">
                        {t(entry.hintKey)}
                      </span>
                    </span>
                    {entry.value === mode ? (
                      <Icon
                        className="shrink-0 text-[var(--canvas-electric)]"
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
            className="ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--canvas-electric)] to-[var(--canvas-royal)] text-sm font-black text-white shadow-md ring-2 ring-transparent transition hover:ring-white/30"
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
