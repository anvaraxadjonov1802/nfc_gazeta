import { CategoryFilter } from "@/components/category-filter";
import { AnimatedBanner } from "@/components/home/animated-banner";
import { IssueCarousel } from "@/components/home/issue-carousel";
import { MediaArticleRow } from "@/components/home/media-article-row";
import { VideoSection } from "@/components/home/video-section";
import { Icon } from "@/components/ui/icon";
import {
  getPublicHome,
  getPublicIssues,
} from "@/lib/public-api";
import type { PublicArticleCard } from "@/lib/public-types";
import { featuredVideos } from "@/lib/videos-data";

import styles from "./home-hero.module.css";

export default async function HomePage() {
  let data;
  let issues;

  try {
    [data, issues] = await Promise.all([
      getPublicHome(),
      getPublicIssues(),
    ]);
  } catch {
    return (
      <main className="mx-auto w-full max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-700">
            <Icon name="close" size={28} />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-black text-red-900">
            Ma’lumotlarni yuklab bo‘lmadi
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">
            Backend server ishlayotganini tekshiring va sahifani yangilang.
          </p>
        </section>
      </main>
    );
  }

  const articlesById = new Map<
    number,
    PublicArticleCard
  >();

  for (const article of [
    ...data.featured_articles,
    ...data.latest_articles,
  ]) {
    if (!articlesById.has(article.id)) {
      articlesById.set(article.id, article);
    }
  }

  const mediaArticles = Array.from(
    articlesById.values(),
  ).slice(0, 6);

  const latestIssueHref = data.latest_issue
    ? `/n/${data.latest_issue.nfc_slug}`
    : "/arxiv";

  return (
    <main className="w-full">
      <section className={styles.heroViewport}>
        <AnimatedBanner
          latestIssueHref={latestIssueHref}
          issueCount={issues.length}
          articleCount={articlesById.size}
          videoCount={featuredVideos.length}
        />
      </section>

      <div className="mx-auto w-full max-w-[1500px] space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <IssueCarousel issues={issues} />

        {data.categories.length > 0 ? (
          <CategoryFilter categories={data.categories} />
        ) : null}

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#9C7826]">
                So‘nggi materiallar
              </span>
              <h2 className="mt-1 font-serif text-2xl font-black text-[#1E4468] sm:text-3xl">
                Yangi maqolalar va tahlillar
              </h2>
            </div>
          </div>

          {mediaArticles.length > 0 ? (
            <div className="space-y-4">
              {mediaArticles.map((article) => (
                <MediaArticleRow
                  article={article}
                  key={article.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm text-slate-500">
                Hozircha maqolalar nashr qilinmagan.
              </p>
            </div>
          )}
        </section>

        <div id="videolar" className="scroll-mt-24">
          <VideoSection />
        </div>

        <section className="relative overflow-hidden rounded-2xl border-b-4 border-[#C79A3C] bg-[#1E4468] p-7 text-white shadow-xl sm:p-10">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C79A3C]/10 blur-3xl" />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C79A3C] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#1E4468]">
              <Icon name="nfc" size={14} />
              Rasmiy NFC integratsiya
            </span>
            <h2 className="mt-5 font-serif text-2xl font-black leading-tight sm:text-4xl">
              Bosma gazeta va elektron nashr bir tizimda
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
              Har bir bosma sonning muqovasidagi NFC stiker foydalanuvchini aynan o‘sha gazetaning elektron nusxasiga olib boradi. Betlarni asl ko‘rinishda ko‘rish, matnni qulay o‘qish va audio shaklini tinglash mumkin.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-[#C79A3C]">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="shield" size={16} />
                Rasmiy elektron nusxa
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="book" size={16} />
                Betma-bet o‘qish
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="eye" size={16} />
                Maxsus imkoniyatlar
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
