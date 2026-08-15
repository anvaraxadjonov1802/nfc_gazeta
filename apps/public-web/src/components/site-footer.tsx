"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

interface SiteFooterProps {
  onOpenAccessibility: () => void;
}

export function SiteFooter({
  onOpenAccessibility,
}: SiteFooterProps) {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-[var(--canvas-navy-deep)] text-white/70">
      <div
        aria-hidden="true"
        className="flex h-[3px] w-full"
      >
        <span className="h-full flex-1 bg-[var(--uz-blue)]/70" />
        <span className="h-full flex-1 bg-white/70" />
        <span className="h-full flex-1 bg-[var(--uz-green)]/70" />
      </div>

      <div className="rail-lines pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--canvas-electric)] to-[var(--canvas-royal)] text-lg font-black text-white">
            T
          </span>
          <div>
            <strong className="block text-lg font-black text-white">
              Temiryo‘lchi
            </strong>
            <small className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--canvas-electric-soft)]">
              {t("footer.official")}
            </small>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.1em]">
          <Link
            className="transition hover:text-[var(--canvas-electric-soft)]"
            href="/"
          >
            {t("footer.home")}
          </Link>
          <Link
            className="transition hover:text-[var(--canvas-electric-soft)]"
            href="/arxiv"
          >
            {t("footer.archive")}
          </Link>
          <button
            className="transition hover:text-[var(--canvas-electric-soft)]"
            onClick={onOpenAccessibility}
            type="button"
          >
            {t("footer.accessibility")}
          </button>
          <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-white/50">
            <Icon
              className="text-[var(--canvas-electric-soft)]"
              name="nfc"
              size={14}
            />
            {t("footer.nfcTitle")}
          </span>
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
    </footer>
  );
}
