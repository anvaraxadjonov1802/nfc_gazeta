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
    <footer className="mt-16 border-t-4 border-double border-[#D9622B] bg-[#0F0C09] text-slate-300">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 font-serif text-lg font-black text-[#D9622B]">
            T
          </span>
          <div>
            <strong className="vintage-masthead block font-serif text-lg text-white">
              Temiryo‘lchi
            </strong>
            <small className="vintage-caps text-[9px] font-bold text-[#D9622B]">
              {t("footer.official")}
            </small>
          </div>
        </div>

        <div className="vintage-caps flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold tracking-[0.1em]">
          <Link
            className="transition hover:text-[#D9622B]"
            href="/"
          >
            {t("footer.home")}
          </Link>
          <span className="text-[#D9622B]/40">✦</span>
          <Link
            className="transition hover:text-[#D9622B]"
            href="/arxiv"
          >
            {t("footer.archive")}
          </Link>
          <span className="text-[#D9622B]/40">✦</span>
          <button
            className="transition hover:text-[#D9622B]"
            onClick={onOpenAccessibility}
            type="button"
          >
            {t("footer.accessibility")}
          </button>
          <span className="text-[#D9622B]/40">✦</span>
          <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-slate-400">
            <Icon
              className="text-[#D9622B]"
              name="nfc"
              size={14}
            />
            {t("footer.nfcTitle")}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="vintage-caps mx-auto flex min-h-12 w-full max-w-7xl flex-col justify-center gap-1.5 px-4 py-3 text-[9px] tracking-[0.1em] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="normal-case tracking-normal">
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
