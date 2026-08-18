/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import {
  estimateReadingMinutes,
  formatUzbekDate,
} from "@/lib/format";
import type {
  PublicArticleCard,
} from "@/lib/public-types";

interface ArticleCardProps {
  article: PublicArticleCard;
  variant?:
    | "standard"
    | "horizontal"
    | "compact";
}

export function ArticleCard({
  article,
  variant = "standard",
}: ArticleCardProps) {
  const category =
    article.category?.name ?? "Yangiliklar";
  const date = formatUzbekDate(
    article.published_at,
  );
  const readingMinutes =
    estimateReadingMinutes(
      `${article.title} ${article.summary}`,
    );

  if (variant === "compact") {
    return (
      <article className="group hairline-bottom py-4 last:border-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 masthead-label">
          <span>{category}</span>
          <span className="text-[var(--gz-ink)]/25">•</span>
          <span className="normal-case tracking-normal text-[var(--gz-ink-soft)]">
            {article.issue_year}-yil, {article.issue_number}-son
          </span>
        </div>
        <h3 className="font-display text-sm font-bold leading-snug text-[var(--gz-ink)] transition group-hover:text-[var(--gz-bronze)]">
          <Link href={`/maqola/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--gz-ink-soft)]/70">
          {date ? <span>{date}</span> : null}
          <span>{readingMinutes} daqiqa</span>
        </div>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="paper-card group overflow-hidden rounded-sm transition hover:-translate-y-0.5 sm:flex">
        <Link
          aria-label={article.title}
          className="relative block h-52 overflow-hidden bg-[var(--gz-paper-warm)] sm:h-auto sm:w-2/5"
          href={`/maqola/${article.id}`}
        >
          {article.main_image ? (
            <img
              alt={article.title}
              className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              loading="lazy"
              src={article.main_image}
            />
          ) : (
            <div className="font-display grid h-full min-h-48 place-items-center text-sm font-black tracking-[0.14em] text-[var(--gz-ink)]/30">
              TEMIRYO‘LCHI
            </div>
          )}
          <span className="paper-panel absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--gz-ink)]">
            {category}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div>
            <div className="masthead-label mb-2 flex flex-wrap items-center gap-3 normal-case tracking-normal">
              {date ? (
                <span className="inline-flex items-center gap-1">
                  <Icon
                    className="text-[var(--gz-bronze)]"
                    name="calendar"
                    size={14}
                  />
                  {date}
                </span>
              ) : null}
              <span>{readingMinutes} daqiqa o‘qish</span>
            </div>

            <h3 className="font-display text-lg font-bold leading-snug text-[var(--gz-ink)] transition group-hover:text-[var(--gz-bronze)]">
              <Link href={`/maqola/${article.id}`}>
                {article.title}
              </Link>
            </h3>

            {article.summary ? (
              <p className="font-body-serif mt-2 line-clamp-3 text-sm leading-6 text-[var(--gz-ink-soft)]">
                {article.summary}
              </p>
            ) : null}
          </div>

          <div className="editorial-rule mt-5 flex items-center justify-between gap-3 pt-4 text-xs">
            <span className="truncate text-[var(--gz-ink-soft)]">
              {article.author || "Tahririyat"}
            </span>
            <Link
              className="inline-flex shrink-0 items-center gap-1 font-bold text-[var(--gz-ink)] transition hover:text-[var(--gz-bronze)]"
              href={`/maqola/${article.id}`}
            >
              O‘qish
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="paper-card group flex h-full flex-col overflow-hidden rounded-sm transition duration-200 hover:-translate-y-1">
      <Link
        aria-label={article.title}
        className="relative block aspect-[16/10] overflow-hidden bg-[var(--gz-paper-warm)]"
        href={`/maqola/${article.id}`}
      >
        {article.main_image ? (
          <img
            alt={article.title}
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
            src={article.main_image}
          />
        ) : (
          <div className="font-display grid h-full place-items-center text-xs font-black tracking-[0.15em] text-[var(--gz-ink)]/30">
            TEMIRYO‘LCHI
          </div>
        )}
        <span className="paper-panel absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--gz-ink)]">
          {category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="masthead-label mb-2 flex flex-wrap items-center gap-3 normal-case tracking-normal">
          {date ? (
            <span className="inline-flex items-center gap-1">
              <Icon
                className="text-[var(--gz-bronze)]"
                name="calendar"
                size={14}
              />
              {date}
            </span>
          ) : null}
          <span>{readingMinutes} daq.</span>
        </div>

        <h3 className="font-display text-lg font-bold leading-snug text-[var(--gz-ink)] transition group-hover:text-[var(--gz-bronze)]">
          <Link href={`/maqola/${article.id}`}>
            {article.title}
          </Link>
        </h3>

        {article.summary ? (
          <p className="font-body-serif mt-2 line-clamp-3 text-sm leading-6 text-[var(--gz-ink-soft)]">
            {article.summary}
          </p>
        ) : null}

        <div className="editorial-rule mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
          <span className="truncate text-[var(--gz-ink-soft)]">
            {article.author || "Tahririyat"}
          </span>
          <Link
            className="inline-flex shrink-0 items-center gap-1 font-bold text-[var(--gz-ink)] transition hover:text-[var(--gz-bronze)]"
            href={`/maqola/${article.id}`}
          >
            Batafsil
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
