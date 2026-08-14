"use client";

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
    <footer className="mt-16 border-t-4 border-[#C79A3C] bg-[#163552] text-slate-300">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 font-serif text-lg font-black text-[#C79A3C]">
            T
          </span>
          <div>
            <strong className="block font-serif text-lg text-white">
              Temiryo‘lchi
            </strong>
            <small className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#C79A3C]">
              {t("footer.official")}
            </small>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold">
          <Link
            className="transition hover:text-[#C79A3C]"
            href="/"
          >
            {t("footer.home")}
          </Link>
          <Link
            className="transition hover:text-[#C79A3C]"
            href="/arxiv"
          >
            {t("footer.archive")}
          </Link>
          <button
            className="transition hover:text-[#C79A3C]"
            onClick={onOpenAccessibility}
            type="button"
          >
            {t("footer.accessibility")}
          </button>
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Icon
              className="text-[#C79A3C]"
              name="nfc"
              size={14}
            />
            {t("footer.nfcTitle")}
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex min-h-12 w-full max-w-7xl flex-col justify-center gap-1.5 px-4 py-3 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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
