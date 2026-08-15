"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import type { PublicArticleCard } from "@/lib/public-types";

interface ArticlesSectionProps {
  articles: PublicArticleCard[];
}

function ArticleRow({
  article,
  index,
}: {
  article: PublicArticleCard;
  index: number;
}) {
  const isReversed = index % 2 === 1;

  return (
    <motion.div
      className={`glass-card grid gap-6 overflow-hidden rounded-3xl p-5 sm:p-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-8 ${
        isReversed ? "lg:[direction:rtl]" : ""
      }`}
      initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <Link
        className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 lg:[direction:ltr]"
        href={`/maqola/${article.id}`}
      >
        {article.main_image ? (
          <img
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={article.main_image}
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-white/20">
            <Icon name="newspaper" size={36} />
          </span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </Link>

      <div className="min-w-0 lg:[direction:ltr]">
        {article.category ? (
          <span className="glass-chip inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--canvas-electric-soft)]">
            {article.category.name}
          </span>
        ) : null}

        <Link href={`/maqola/${article.id}`}>
          <h3 className="mt-3 text-xl font-black leading-snug text-white transition hover:text-[var(--canvas-electric-soft)] sm:text-2xl">
            {article.title}
          </h3>
        </Link>

        {article.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/65">
            {article.summary}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-white/45">
          {article.author ? <span>{article.author}</span> : null}
          <span>
            {article.newspaper_name} · {article.issue_number}-son
          </span>
        </div>

        <Link
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-white transition hover:text-[var(--canvas-electric-soft)]"
          href={`/maqola/${article.id}`}
        >
          Batafsil o‘qish
          <Icon name="arrow-right" size={14} />
        </Link>
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
    <section className="relative w-full overflow-hidden bg-canvas py-16">
      <div className="wire-pattern pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--canvas-electric-soft)]">
            {t("articles.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("articles.title")}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {articles.map((article, index) => (
            <ArticleRow
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
