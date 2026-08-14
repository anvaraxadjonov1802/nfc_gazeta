"use client";

import { useLocale } from "@/context/locale-context";
import { Icon } from "@/components/ui/icon";

/**
 * Placeholder for the future animated banner asset. The user will supply a
 * real animation later — this keeps the layout, spacing and text ready so
 * dropping in the final asset is a one-line swap.
 */
export function AnimatedBanner() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden rounded-2xl border-b-4 border-[#C79A3C] bg-[#1E4468] p-7 text-white shadow-xl sm:p-10">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C79A3C]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 h-10 overflow-hidden opacity-70">
        <div className="banner-train flex w-max items-center gap-16 text-[#C79A3C]">
          {[0, 1, 2].map((index) => (
            <Icon
              key={index}
              name="newspaper"
              size={26}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#C79A3C] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#1E4468]">
          {t("banner.tag")}
        </span>
        <h2 className="mt-5 font-serif text-2xl font-black leading-tight sm:text-4xl">
          {t("banner.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          {t("banner.subtitle")}
        </p>
      </div>
    </section>
  );
}
