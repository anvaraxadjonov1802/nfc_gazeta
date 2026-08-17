"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";
import type { PublicArticleCard } from "@/lib/public-types";

interface ArticlesSectionProps {
  articles: PublicArticleCard[];
}

function ArticleCard({
  article,
  index,
}: {
  article: PublicArticleCard;
  index: number;
}) {
  return (
    <motion.div
      className="paper-card group flex flex-col overflow-hidden rounded-sm"
      initial={{ opacity: 0, y: 30 }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
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
          <span className="grid h-full w-full place-items-center text-[var(--gz-ink)]/15">
            <Icon name="newspaper" size={36} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {article.category ? (
          <span className="editorial-label">
            {article.category.name}
          </span>
        ) : null}

        <Link href={`/maqola/${article.id}`}>
          <h3 className="font-display mt-3 text-lg font-black leading-snug text-[var(--gz-ink)] transition group-hover:text-[var(--gz-bronze)]">
            {article.title}
          </h3>
        </Link>

        {article.summary ? (
          <p className="font-body-serif mt-2.5 line-clamp-3 text-sm leading-6 text-[var(--gz-ink-soft)]">
            {article.summary}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="editorial-rule mb-3" />
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-[11px] font-semibold text-[var(--gz-ink-soft)]/80">
              {article.newspaper_name} · {article.issue_number}-son
            </span>
            <Link
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[var(--gz-bronze)] transition group-hover:gap-1.5"
              href={`/maqola/${article.id}`}
            >
              O‘qish
              <Icon name="arrow-right" size={13} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ArticlesSection({
  articles,
}: ArticlesSectionProps) {
  const { t } = useLocale();

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-paper-warm py-16 sm:py-20"
      id="maqolalar"
    >
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label">
            {t("articles.eyebrow")}
          </span>
          <RevealHeading
            as="h2"
            className="font-display mt-3 text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl lg:text-5xl"
            text={t("articles.title")}
          />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard
              article={article}
              index={index}
              key={article.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
