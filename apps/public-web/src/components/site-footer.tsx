"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

interface SiteFooterProps {
  onOpenAccessibility: () => void;
}

export function SiteFooter({
  onOpenAccessibility,
}: SiteFooterProps) {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();
  const goToTopLabel =
    locale === "en"
      ? "Go to top"
      : locale === "ru"
        ? "Наверх"
        : "Yuqoriga";

  return (
    <footer
      className="relative w-full overflow-hidden bg-[var(--gz-navy-deep)] text-white/70"
      id="masthead"
    >
      <div aria-hidden="true" className="h-[3px] w-full bg-white/80" />

      <div className="rail-lines pointer-events-none absolute inset-0 opacity-10" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8 pb-6">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0">
              <Image
                alt="Temiryo‘lchi logotipi"
                className="object-contain"
                fill
                src="/images/temiryolchi-logo.png"
              />
            </span>
            <div>
              <strong className="block font-display text-xl font-black text-white">
                Temiryo‘lchi
              </strong>
              <small className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gz-bronze-soft)]">
                {t("footer.official")} · {t("footer.issueLabel")}
              </small>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.1em]">
            <Link
              className="transition hover:text-[var(--gz-bronze-soft)]"
              href="/"
            >
              {t("footer.home")}
            </Link>
            <Link
              className="transition hover:text-[var(--gz-bronze-soft)]"
              href="/arxiv"
            >
              {t("footer.archive")}
            </Link>
            <button
              className="transition hover:text-[var(--gz-bronze-soft)]"
              onClick={onOpenAccessibility}
              type="button"
            >
              {t("footer.accessibility")}
            </button>
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-white/50">
              <Icon
                className="text-[var(--gz-bronze-soft)]"
                name="nfc"
                size={14}
              />
              {t("footer.nfcTitle")}
            </span>
          </div>
        </div>

      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex min-h-12 w-full max-w-7xl flex-col justify-center gap-1.5 px-4 py-4 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {year} Temiryo‘lchi. {t("footer.rights")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shield" size={13} />
            {t("footer.official")}
          </span>
        </div>
      </div>

      <a
        className="group relative flex flex-col items-center gap-1.5 py-8 text-white/50 transition hover:text-white/85"
        href="#top"
      >
        <svg
          className="go-to-top-doodle h-6 w-6 stroke-current transition group-hover:-translate-y-1"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M12 19V5M6 10l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="masthead-label text-white/50">
          {goToTopLabel}
        </span>
      </a>
    </footer>
  );
}
