/* eslint-disable @next/next/no-img-element */

import type {
    Metadata,
  } from "next";
  import Link from "next/link";
  import {
    notFound,
  } from "next/navigation";
  
  import {
    getPublicArticle,
  } from "@/lib/public-api";
  
  interface ArticlePageProps {
    params: Promise<{
      id: string;
    }>;
  }
  
  export async function generateMetadata({
    params,
  }: ArticlePageProps): Promise<Metadata> {
    const { id } = await params;
  
    const article =
      await getPublicArticle(id);
  
    if (!article) {
      return {
        title: "Maqola topilmadi",
      };
    }
  
    return {
      title: article.title,
      description:
        article.summary ||
        article.content.slice(0, 160),
    };
  }
  
  export default async function ArticlePage({
    params,
  }: ArticlePageProps) {
    const { id } = await params;
  
    const article =
      await getPublicArticle(id);
  
    if (!article) {
      notFound();
    }
  
    const paragraphs =
      article.content
        .split(/\n{2,}/)
        .map((paragraph) =>
          paragraph.trim()
        )
        .filter(Boolean);
  
    return (
      <main className="site-container public-page">
        <article className="public-article-detail">
          <header className="public-article-header">
            <Link
              href={`/n/${article.issue_nfc_slug}`}
              className="public-back-link"
            >
              ← {article.issue_year}-yil,{" "}
              {article.issue_number}-songa
              qaytish
            </Link>
  
            <span className="public-eyebrow">
              {article.category?.name ??
                article.newspaper_name}
            </span>
  
            <h1>{article.title}</h1>
  
            {article.summary ? (
              <p className="public-article-lead">
                {article.summary}
              </p>
            ) : null}
  
            <div className="public-article-detail-meta">
              {article.author ? (
                <span>
                  Muallif:{" "}
                  <strong>
                    {article.author}
                  </strong>
                </span>
              ) : null}
  
              <span>
                {article.issue_year}-yil,{" "}
                {article.issue_number}-son
              </span>
            </div>
          </header>
  
          {article.main_image ? (
            <figure className="public-article-main-image">
              <img
                src={article.main_image}
                alt={article.title}
              />
            </figure>
          ) : null}
  
          <div className="public-article-body">
            {paragraphs.length > 0 ? (
              paragraphs.map(
                (
                  paragraph,
                  paragraphIndex,
                ) => (
                  <p key={paragraphIndex}>
                    {paragraph}
                  </p>
                ),
              )
            ) : (
              <p>
                Maqola matni mavjud emas.
              </p>
            )}
          </div>
  
          {article.audio ? (
            <section className="public-article-audio">
              <h2>
                Maqolani tinglash
              </h2>
  
              <audio
                controls
                src={article.audio}
                className="public-audio-player"
              />
            </section>
          ) : null}
  
          <footer className="public-article-footer">
            <Link
              href={`/n/${article.issue_nfc_slug}`}
              className="public-secondary-button"
            >
              Gazeta sonini ko‘rish
            </Link>
          </footer>
        </article>
      </main>
    );
  }