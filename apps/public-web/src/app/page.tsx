import { AnimatedBanner } from "@/components/home/animated-banner";
import { ArticlesSection } from "@/components/home/articles-section";
import { FeaturedStorySection } from "@/components/home/featured-story-section";
import { HomeIntro } from "@/components/home/home-intro";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { IssueCarousel } from "@/components/home/issue-carousel";
import { PartnersMarquee } from "@/components/home/partners-marquee";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { VideoSection } from "@/components/home/video-section";
import { Icon } from "@/components/ui/icon";
import {
  getPublicHome,
  getPublicIssues,
} from "@/lib/public-api";
import type { PublicArticleCard } from "@/lib/public-types";
import { featuredVideos } from "@/lib/videos-data";

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
      <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <section className="glass-card w-full max-w-lg rounded-3xl p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-300">
            <Icon name="close" size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-black text-white">
            Ma’lumotlarni yuklab bo‘lmadi
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/60">
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

  const articles = Array.from(
    articlesById.values(),
  ).slice(0, 6);

  const latestIssueSlug =
    data.latest_issue?.nfc_slug ?? null;

  return (
    <main className="w-full">
      <HomeIntro />

      <AnimatedBanner
        articlesCount={articlesById.size}
        issuesCount={issues.length}
        latestIssueSlug={latestIssueSlug}
        videosCount={featuredVideos.length}
      />

      <FeaturedStorySection
        latestIssueSlug={latestIssueSlug}
      />

      <ArticlesSection articles={articles} />

      <IssueCarousel issues={issues} />

      <VideoSection />

      <HowItWorksSection />

      <PartnersMarquee />

      <TestimonialsSection />
    </main>
  );
}
