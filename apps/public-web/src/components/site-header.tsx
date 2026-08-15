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
    swatch: "#F7F1E3",
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

const ARTICLE_LABELS = {
  uz: "Maqolalar",
  ru: "Статьи",
  en: "Articles",
} as const;

type OpenPanel = "lang" | "mode" | null;

export function SiteHeader({
  onOpenProfile,
  onOpenSearch,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const { mode, setMode } = useReadingMode();
  const { initial: profileInitial } = useProfile();
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const localeInfo = LOCALES.find((entry) => entry.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!openPanel) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPanel(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

  const navItems = [
    {
      href: "/",
      label: t("nav.home"),
      icon: "book" as const,
      active: pathname === "/",
    },
    {
      href: "/arxiv",
      label: t("nav.archive"),
      icon: "newspaper" as const,
      active: pathname.startsWith("/arxiv") || pathname.startsWith("/n/"),
    },
    {
      href: "/#maqolalar",
      label: ARTICLE_LABELS[locale],
      icon: "file-text" as const,
      active: pathname.startsWith("/maqola/"),
    },
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-4" ref={containerRef}>
      <div className="mx-auto flex h-[74px] w-full max-w-7xl items-center justify-between gap-3 rounded-[1.65rem] border border-white/80 bg-white/92 px-4 shadow-[0_18px_45px_rgba(17,56,91,0.14)] backdrop-blur-xl sm:px-5 lg:h-[78px] lg:px-6">
        <Link
          aria-label="Temiryo‘lchi bosh sahifasi"
          className="flex min-w-0 items-center gap-3"
          href="/"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1D67B1] via-[#17518A] to-[#0C355C] font-serif text-lg font-black text-[#F2C65F] shadow-md ring-1 ring-[#0E3D68]/20 sm:h-12 sm:w-12">
            T
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-[15px] font-black tracking-[-0.03em] text-[#102A56] sm:text-lg">
              TEMIRYO‘LCHI
            </strong>
            <span className="hidden truncate text-[10px] font-medium text-slate-500 sm:block">
              O‘zbekiston temir yo‘l gazetasi
            </span>
          </span>
        </Link>

        <nav className="hidden items-stretch self-stretch lg:flex">
          {navItems.map((item) => (
            <Link
              className={`relative flex items-center gap-2 px-4 text-sm font-semibold transition-colors ${
                item.active
                  ? "text-[#0868DE]"
                  : "text-[#223857] hover:text-[#0868DE]"
              }`}
              href={item.href}
              key={item.href}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
              {item.active ? (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#1677F2]" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            aria-label={t("nav.search")}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white text-[#173A64] shadow-sm transition hover:border-[#B8D6F5] hover:bg-[#F2F8FF] hover:text-[#0868DE] sm:h-11 sm:w-11"
            onClick={onOpenSearch}
            type="button"
          >
            <Icon name="search" size={19} />
          </button>

          <div className="relative">
            <button
              aria-label={t("nav.language")}
              className={`flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-black text-[#173A64] transition hover:bg-[#F2F8FF] sm:h-11 sm:px-3 ${
                openPanel === "lang" ? "bg-[#F2F8FF]" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) => (current === "lang" ? null : "lang"))
              }
              type="button"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#15A85A] text-[9px] text-white shadow-sm">
                {localeInfo.shortLabel}
              </span>
              <span className="hidden sm:inline">{localeInfo.shortLabel}</span>
              <Icon name="chevron-right" size={13} className="rotate-90" />
            </button>

            {openPanel === "lang" ? (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl">
                {LOCALES.map((entry) => (
                  <button
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold transition ${
                      entry.code === locale
                        ? "bg-[#F2F8FF] text-[#155EAA]"
                        : "text-slate-600 hover:bg-slate-50"
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
                      <Icon className="text-[#1677F2]" name="check" size={15} />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              aria-label={t("nav.readingMode")}
              className={`grid h-10 w-10 place-items-center rounded-full text-[#173A64] transition hover:bg-[#F2F8FF] sm:h-11 sm:w-11 ${
                openPanel === "mode" ? "bg-[#F2F8FF]" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) => (current === "mode" ? null : "mode"))
              }
              type="button"
            >
              <Icon name="eye" size={19} />
            </button>

            {openPanel === "mode" ? (
              <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl">
                {READING_MODES.map((entry) => (
                  <button
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      entry.value === mode ? "bg-[#F2F8FF]" : "hover:bg-slate-50"
                    }`}
                    key={entry.value}
                    onClick={() => {
                      setMode(entry.value);
                      setOpenPanel(null);
                    }}
                    type="button"
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-black/10 shadow-inner"
                      style={{ background: entry.swatch }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#1E4468]">
                        {t(entry.labelKey)}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {t(entry.hintKey)}
                      </span>
                    </span>
                    {entry.value === mode ? (
                      <Icon className="shrink-0 text-[#1677F2]" name="check" size={15} />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            aria-label={t("nav.profile")}
            className="ml-0.5 flex h-10 items-center gap-2 rounded-full bg-[#0868DE] px-1.5 text-white shadow-[0_8px_20px_rgba(8,104,222,0.25)] transition hover:bg-[#075CBC] sm:h-11 sm:pr-3"
            onClick={onOpenProfile}
            type="button"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-white/12 text-xs font-black sm:h-8 sm:w-8">
              {profileInitial}
            </span>
            <span className="hidden text-sm font-bold xl:inline">{t("nav.profile")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
