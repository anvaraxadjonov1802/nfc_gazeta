"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import type { PublicIssueListItem } from "@/lib/public-types";

interface IssueCarouselProps {
  issues: PublicIssueListItem[];
}

function IssueMini({
  issue,
}: {
  issue: PublicIssueListItem;
}) {
  return (
    <Link
      className="group w-32 shrink-0 sm:w-40"
      href={`/n/${issue.nfc_slug}`}
    >
      <span className="grid aspect-[0.72] w-full place-items-center overflow-hidden rounded-xl border border-[#CBB98A] bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
        {issue.cover_image ? (
          <img
            alt={issue.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={issue.cover_image}
          />
        ) : (
          <Icon
            className="text-slate-300"
            name="newspaper"
            size={28}
          />
        )}
      </span>
      <strong className="mt-2 block truncate text-xs font-bold text-[#1B1712]">
        {issue.issue_number}-son
      </strong>
      <span className="block text-[10px] text-slate-500">
        {issue.year}-yil
      </span>
    </Link>
  );
}

export function IssueCarousel({
  issues,
}: IssueCarouselProps) {
  const { t } = useLocale();

  if (issues.length === 0) {
    return null;
  }

  const shouldLoop = issues.length >= 3;
  const track = shouldLoop
    ? [...issues, ...issues]
    : issues;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b-2 border-double border-[#1B1712] pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#6B4F1F]">
            {t("carousel.eyebrow")}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-black text-[#1B1712] sm:text-3xl">
            {t("carousel.title")}
          </h2>
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#1B1712] transition hover:text-[#8B6A2F]"
          href="/arxiv"
        >
          {t("carousel.viewAll")}
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>

      <div className="carousel-track-wrap overflow-hidden">
        <div
          className="carousel-track flex w-max gap-4"
          style={
            shouldLoop
              ? undefined
              : { animation: "none" }
          }
        >
          {track.map((issue, index) => (
            <IssueMini
              issue={issue}
              key={`${issue.id}-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
