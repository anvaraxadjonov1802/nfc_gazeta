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
    <section className="w-full bg-[#EFE6D2] py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#1B1712]">
          <Icon
            className="text-[#D9622B]"
            name="archive"
            size={17}
          />
          Mavzular bo‘yicha
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                activeSlug === category.slug
                  ? "border-[#1B1712] bg-[#1B1712] text-white"
                  : "border-[#1B1712]/15 bg-white text-[#1B1712] hover:border-[#D9622B] hover:text-[#D9622B]"
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
          <div className="animate-fade-in-up mt-8 border-t border-[#1B1712]/10 pt-8">
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
      </div>
    </section>
  );
}
