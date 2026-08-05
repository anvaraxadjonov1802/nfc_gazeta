/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import type {
  PublicArticleCard,
} from "@/lib/public-types";

interface ArticleCardProps {
  article: PublicArticleCard;
  featured?: boolean;
}

function formatDate(
  dateValue: string | null,
): string {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  return new Intl.DateTimeFormat(
    "uz-UZ",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

export function ArticleCard({
  article,
  featured = false,
}: ArticleCardProps) {
  return (
    <article
      className={
        featured
          ? "public-article-card public-article-card-featured"
          : "public-article-card"
      }
    >
      <Link
        href={`/maqola/${article.id}`}
        className="public-article-image"
        aria-label={article.title}
      >
        {article.main_image ? (
          <img
            src={article.main_image}
            alt={article.title}
            loading="lazy"
          />
        ) : (
          <div className="public-image-placeholder">
            TEMIRYO‘LCHI
          </div>
        )}
      </Link>

      <div className="public-article-content">
        <div className="public-article-category">
          {article.category?.name ??
            "Yangiliklar"}
        </div>

        <h3>
          <Link
            href={`/maqola/${article.id}`}
          >
            {article.title}
          </Link>
        </h3>

        {article.summary ? (
          <p>
            {article.summary.length > 180
              ? `${article.summary.slice(
                  0,
                  180,
                )}…`
              : article.summary}
          </p>
        ) : null}

        <div className="public-article-meta">
          {article.author ? (
            <span>{article.author}</span>
          ) : null}

          {article.published_at ? (
            <time>
              {formatDate(
                article.published_at,
              )}
            </time>
          ) : null}
        </div>
      </div>
    </article>
  );
}