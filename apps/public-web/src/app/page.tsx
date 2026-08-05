/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { ArticleCard } from "@/components/article-card";
import {
  getPublicHome,
} from "@/lib/public-api";

export default async function HomePage() {
  let data;

  try {
    data = await getPublicHome();
  } catch {
    return (
      <main className="site-container public-page">
        <section className="public-error-state">
          <h1>
            Ma’lumotlarni yuklab bo‘lmadi
          </h1>

          <p>
            Backend server ishlayotganini
            tekshiring va sahifani yangilang.
          </p>
        </section>
      </main>
    );
  }

  const latestIssue =
    data.latest_issue;

  return (
    <main>
      <section className="public-hero">
        <div className="site-container public-hero-grid">
          <div className="public-hero-content">
            <span className="public-eyebrow">
              O‘zbekiston temiryo‘l gazetasi
            </span>

            <h1>
              Temiryo‘l yangiliklari endi
              elektron shaklda
            </h1>

            <p>
              Gazetaning yangi sonlarini
              o‘qing, arxivni ko‘ring va
              NFC orqali kerakli nashrni
              darhol oching.
            </p>

            <div className="public-hero-actions">
              {latestIssue ? (
                <Link
                  href={`/n/${latestIssue.nfc_slug}`}
                  className="public-primary-button"
                >
                  Eng yangi sonni o‘qish
                </Link>
              ) : null}

              <Link
                href="/arxiv"
                className="public-secondary-button"
              >
                Gazeta arxivi
              </Link>
            </div>
          </div>

          <div className="latest-issue-showcase">
            {latestIssue ? (
              <>
                <div className="latest-issue-cover">
                  {latestIssue.cover_image ? (
                    <img
                      src={
                        latestIssue.cover_image
                      }
                      alt={`${latestIssue.issue_number}-son muqovasi`}
                    />
                  ) : (
                    <div className="issue-cover-fallback">
                      <strong>
                        {
                          latestIssue
                            .issue_number
                        }
                      </strong>

                      <span>SON</span>
                    </div>
                  )}
                </div>

                <div className="latest-issue-info">
                  <span>
                    Eng yangi nashr
                  </span>

                  <h2>
                    {latestIssue.year}-yil,{" "}
                    {
                      latestIssue
                        .issue_number
                    }
                    -son
                  </h2>

                  <p>
                    {latestIssue.description ||
                      `${latestIssue.page_count} betli elektron gazeta`}
                  </p>

                  <Link
                    href={`/n/${latestIssue.nfc_slug}`}
                  >
                    Gazetani ochish →
                  </Link>
                </div>
              </>
            ) : (
              <div className="public-empty-state">
                <h2>
                  Hozircha nashr mavjud emas
                </h2>

                <p>
                  Admin paneldan birinchi
                  nashrni ommaga chiqaring.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {data.categories.length > 0 ? (
        <section className="public-category-bar">
          <div className="site-container public-category-list">
            {data.categories.map(
              (category) => (
                <span key={category.id}>
                  {category.name}
                </span>
              ),
            )}
          </div>
        </section>
      ) : null}

      {data.featured_articles.length >
      0 ? (
        <section className="site-container public-section">
          <div className="public-section-heading">
            <div>
              <span className="public-eyebrow">
                Muhim mavzular
              </span>

              <h2>Asosiy maqolalar</h2>
            </div>
          </div>

          <div className="featured-articles-grid">
            {data.featured_articles.map(
              (article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured
                />
              ),
            )}
          </div>
        </section>
      ) : null}

      <section className="site-container public-section">
        <div className="public-section-heading">
          <div>
            <span className="public-eyebrow">
              So‘nggi materiallar
            </span>

            <h2>Yangi maqolalar</h2>
          </div>
        </div>

        {data.latest_articles.length >
        0 ? (
          <div className="latest-articles-grid">
            {data.latest_articles.map(
              (article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ),
            )}
          </div>
        ) : (
          <div className="public-empty-state">
            <h3>
              Maqolalar hali nashr qilinmagan
            </h3>

            <p>
              Admin paneldan maqolalarni
              tekshirib, nashr qiling.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}