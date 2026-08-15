"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
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
      <span className="glass-card grid aspect-[0.72] w-full place-items-center overflow-hidden rounded-2xl transition group-hover:-translate-y-1.5">
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
    <section className="relative w-full overflow-hidden bg-canvas py-16">
      <div className="rail-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="glow-pulse pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[var(--canvas-electric)]/10 blur-3xl" />

      <motion.div
        className="relative mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 pb-9 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--canvas-electric-soft)]">
            {t("carousel.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("carousel.title")}
          </h2>
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-white/70 transition hover:text-[var(--canvas-electric-soft)]"
          href="/arxiv"
        >
          {t("carousel.viewAll")}
          <Icon name="arrow-right" size={15} />
        </Link>
      </motion.div>

      <div className="carousel-track-wrap relative overflow-hidden pl-4 sm:pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
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
