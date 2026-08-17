"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { RevealHeading } from "@/components/ui/reveal-heading";
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
      <span className="paper-card grid aspect-[0.72] w-full place-items-center overflow-hidden rounded-sm transition group-hover:-translate-y-2">
        {issue.cover_image ? (
          <img
            alt={issue.title}
            className="h-full w-full object-cover grayscale transition group-hover:grayscale-0"
            loading="lazy"
            src={issue.cover_image}
          />
        ) : (
          <Icon
            className="text-[var(--gz-ink)]/20"
            name="newspaper"
            size={28}
          />
        )}
      </span>
      <strong className="mt-2 block truncate text-xs font-bold text-[var(--gz-ink)]">
        {issue.issue_number}-son
      </strong>
      <span className="block text-[10px] text-[var(--gz-ink-soft)]">
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
    <section
      className="relative w-full overflow-hidden bg-paper-warm py-16 sm:py-20"
      id="nashrlar"
    >
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 h-4 bg-gradient-to-b from-[var(--gz-bronze)]/25 to-transparent"
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 pb-9 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="editorial-label">
            {t("carousel.eyebrow")}
          </span>
          <RevealHeading
            as="h2"
            className="font-display mt-3 text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl lg:text-5xl"
            text={t("carousel.title")}
          />
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[var(--gz-ink-soft)] transition hover:text-[var(--gz-bronze)]"
          href="/arxiv"
        >
          {t("carousel.viewAll")}
          <Icon name="arrow-right" size={15} />
        </Link>
      </motion.div>

      <div className="carousel-track-wrap relative overflow-hidden pl-4 sm:pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
        <div
          className="carousel-track flex w-max gap-5 pb-2"
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
