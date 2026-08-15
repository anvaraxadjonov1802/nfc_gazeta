"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import type { PublicArticleCard } from "@/lib/public-types";

interface MediaArticleRowProps {
  article: PublicArticleCard;
}

export function MediaArticleRow({
  article,
}: MediaArticleRowProps) {
  const { t } = useLocale();
  const href = `/maqola/${article.id}`;
  const hasVideo = Boolean(article.video_url);

  return (
    <article className="grid gap-5 rounded-2xl border border-[#CBB98A] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-8">
      <div className="min-w-0">
        {article.category ? (
          <span className="inline-flex rounded-full bg-[#EFE6D2] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#6B4F1F]">
            {article.category.name}
          </span>
        ) : null}
        <Link href={href}>
          <h3 className="mt-2 font-serif text-lg font-black leading-snug text-[#1B1712] transition hover:text-[#8B6A2F] sm:text-xl">
            {article.title}
          </h3>
        </Link>
        {article.summary ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {article.summary}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-400">
          {article.author ? (
            <span>{article.author}</span>
          ) : null}
          <span>
            {article.newspaper_name} · {article.issue_number}-son
          </span>
        </div>
      </div>

      <Link
        className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-slate-900"
        href={
          hasVideo
            ? article.video_url ?? href
            : href
        }
        target={hasVideo ? "_blank" : undefined}
        rel={hasVideo ? "noopener noreferrer" : undefined}
      >
        {article.main_image ? (
          <img
            alt={article.title}
            className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
            loading="lazy"
            src={article.main_image}
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-slate-600">
            <Icon name="newspaper" size={32} />
          </span>
        )}

        {hasVideo ? (
          <>
            <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1B1712] shadow-lg transition group-hover:scale-110">
              <Icon name="play" size={20} />
            </span>
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
              {t("media.videoBadge")}
            </span>
          </>
        ) : null}
      </Link>
    </article>
  );
}
