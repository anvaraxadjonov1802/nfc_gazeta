"use client";

import { useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { Icon } from "@/components/ui/icon";
import type {
  PublicArticleCard,
  PublicCategory,
} from "@/lib/public-types";

interface CategoryFilterProps {
  categories: PublicCategory[];
}

export function CategoryFilter({
  categories,
}: CategoryFilterProps) {
  const [activeSlug, setActiveSlug] = useState<
    string | null
  >(null);
  const [articles, setArticles] = useState<
    PublicArticleCard[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(false);
  const [hasError, setHasError] =
    useState(false);

  async function handleSelect(
    category: PublicCategory,
  ) {
    if (activeSlug === category.slug) {
      setActiveSlug(null);
      setArticles([]);
      return;
    }

    setActiveSlug(category.slug);
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(
        `/api/articles?category=${encodeURIComponent(
          category.slug,
        )}`,
      );

      if (!response.ok) {
        throw new Error("request failed");
      }

      const data =
        (await response.json()) as PublicArticleCard[];
      setArticles(data);
    } catch {
      setHasError(true);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#CBB98A] bg-[#F8F2E2] p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#1B1712]">
        <Icon
          className="text-[#8B6A2F]"
          name="archive"
          size={17}
        />
        Mavzular bo‘yicha ruknlar
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeSlug === category.slug
                ? "bg-[#1B1712] text-white"
                : "bg-[#EFE6D2] text-slate-700 hover:bg-[#1B1712] hover:text-white"
            }`}
            key={category.id}
            onClick={() =>
              void handleSelect(category)
            }
            type="button"
          >
            {category.name}
          </button>
        ))}
      </div>

      {activeSlug ? (
        <div className="animate-fade-in-up mt-5 border-t border-[#CBB98A] pt-5">
          {isLoading ? (
            <p className="text-sm text-slate-500">
              Yuklanmoqda…
            </p>
          ) : hasError ? (
            <p className="text-sm text-red-600">
              Maqolalarni yuklab bo‘lmadi.
            </p>
          ) : articles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  article={article}
                  key={article.id}
                  variant="compact"
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Ushbu rukn bo‘yicha maqolalar
              topilmadi.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
