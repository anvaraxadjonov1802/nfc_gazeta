"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import { useProfile } from "@/context/profile-context";
import {
  getContinueReading,
  getReadingStats,
} from "@/lib/reading-history";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAccessibility: () => void;
}

export function ProfilePanel({
  isOpen,
  onClose,
  onOpenAccessibility,
}: ProfilePanelProps) {
  const { t } = useLocale();
  const { name, setName, initial } = useProfile();

  if (!isOpen) {
    return null;
  }

  // Read fresh from localStorage on every open rather than caching in
  // state, since this is a synchronous, cheap read and it guarantees the
  // panel always shows up-to-date progress without an effect + setState.
  const continueReading = getContinueReading();
  const stats = getReadingStats();

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label={t("profile.close")}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <aside className="custom-scrollbar relative ml-auto flex h-full w-[min(92vw,400px)] flex-col overflow-y-auto bg-[#FFFCF5] shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E4468] via-[#1E4468] to-[#163552] px-5 pb-6 pt-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#C79A3C]">
              {t("profile.title")}
            </span>
            <button
              aria-label={t("profile.close")}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"
              onClick={onClose}
              type="button"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#C79A3C] text-2xl font-black text-[#1E4468] shadow-lg">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <input
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white placeholder:text-white/50 focus:border-[#C79A3C] focus:outline-none"
                maxLength={40}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={t(
                  "profile.namePlaceholder",
                )}
                type="text"
                value={name}
              />
              <p className="mt-1.5 text-[10px] text-white/50">
                {t("profile.nameHint")}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-white/10 p-3 text-center">
            <div>
              <strong className="block text-lg font-black text-[#C79A3C]">
                {stats.issuesRead}
              </strong>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-white/70">
                {t("profile.statsIssues")}
              </span>
            </div>
            <div className="border-x border-white/15">
              <strong className="block text-lg font-black text-[#C79A3C]">
                {stats.pagesRead}
              </strong>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-white/70">
                {t("profile.statsPages")}
              </span>
            </div>
            <div>
              <strong className="block text-lg font-black text-[#C79A3C]">
                {stats.streak}
              </strong>
              <span className="text-[9px] font-semibold uppercase tracking-wide text-white/70">
                {t("profile.statsStreak")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-5 py-5">
          <h2 className="text-xs font-black uppercase tracking-[0.14em] text-[#9C7826]">
            {t("profile.continueReading")}
          </h2>

          {continueReading.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#E7DCC3] bg-white p-4 text-center text-xs text-slate-500">
              {t("profile.continueReadingEmpty")}
            </p>
          ) : (
            <div className="space-y-2.5">
              {continueReading.map((entry) => {
                const progress = Math.round(
                  ((entry.maxPageIndex + 1) /
                    Math.max(entry.totalPages, 1)) *
                    100,
                );

                return (
                  <Link
                    className="flex items-center gap-3 rounded-xl border border-[#E7DCC3] bg-white p-2.5 transition hover:-translate-y-0.5 hover:shadow-md"
                    href={`/n/${entry.nfcSlug}`}
                    key={entry.issueId}
                    onClick={onClose}
                  >
                    <span className="grid h-14 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-200">
                      {entry.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={entry.title}
                          className="h-full w-full object-cover"
                          src={entry.coverImage}
                        />
                      ) : (
                        <Icon
                          className="text-slate-400"
                          name="newspaper"
                          size={18}
                        />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-xs font-bold text-[#1E4468]">
                        {entry.newspaperName} · {entry.issueNumber}-son
                      </strong>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#C79A3C]"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                      <span className="mt-1 block text-[10px] text-slate-500">
                        {entry.maxPageIndex + 1}-{t("profile.pageOf")} /{" "}
                        {entry.totalPages} · {t("profile.continueLink")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-auto space-y-1 border-t border-[#E7DCC3] px-5 py-5">
          <Link
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-white"
            href="/arxiv"
            onClick={onClose}
          >
            <Icon
              className="text-[#1E4468]"
              name="archive"
              size={18}
            />
            {t("profile.archive")}
          </Link>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:bg-white"
            onClick={() => {
              onClose();
              onOpenAccessibility();
            }}
            type="button"
          >
            <Icon
              className="text-[#1E4468]"
              name="eye"
              size={18}
            />
            {t("profile.accessibility")}
          </button>
        </div>
      </aside>
    </div>
  );
}
