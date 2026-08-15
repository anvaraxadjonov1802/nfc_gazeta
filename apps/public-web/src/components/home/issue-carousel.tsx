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
      className="group w-32 shrink-0 sm:w-44"
      href={`/n/${issue.nfc_slug}`}
    >
      <span className="grid aspect-[0.72] w-full place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition group-hover:-translate-y-1 group-hover:border-[#D9622B]/60">
        {issue.cover_image ? (
          <img
            alt={issue.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={issue.cover_image}
          />
        ) : (
          <Icon
            className="text-white/30"
            name="newspaper"
            size={28}
          />
        )}
      </span>
      <strong className="mt-2 block truncate text-xs font-bold text-white">
        {issue.issue_number}-son
      </strong>
      <span className="block text-[10px] text-white/50">
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
    <section className="w-full bg-[#0F0C09] py-14">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 pb-8 sm:px-6 lg:px-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D9622B]">
            {t("carousel.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("carousel.title")}
          </h2>
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-white/70 transition hover:text-[#D9622B]"
          href="/arxiv"
        >
          {t("carousel.viewAll")}
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>

      <div className="carousel-track-wrap overflow-hidden pl-4 sm:pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        <div
          className="carousel-track flex w-max gap-5"
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
