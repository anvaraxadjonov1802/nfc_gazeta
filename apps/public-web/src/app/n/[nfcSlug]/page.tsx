import type {
    Metadata,
  } from "next";
  import Link from "next/link";
  import {
    notFound,
  } from "next/navigation";
  
  import { ArticleCard } from "@/components/article-card";
  import { IssueViewer } from "@/components/issues/issue-viewer";
  import {
    getPublicIssue,
  } from "@/lib/public-api";
  
  interface IssuePageProps {
    params: Promise<{
      nfcSlug: string;
    }>;
  }
  
  export async function generateMetadata({
    params,
  }: IssuePageProps): Promise<Metadata> {
    const { nfcSlug } = await params;
  
    const issue =
      await getPublicIssue(nfcSlug);
  
    if (!issue) {
      return {
        title: "Nashr topilmadi",
      };
    }
  
    return {
      title:
        `${issue.year}-yil, ${issue.issue_number}-son`,
      description:
        issue.description ||
        `${issue.newspaper_name} gazetasining elektron nashri`,
    };
  }
  
  export default async function IssuePage({
    params,
  }: IssuePageProps) {
    const { nfcSlug } = await params;
  
    const issue =
      await getPublicIssue(nfcSlug);
  
    if (!issue) {
      notFound();
    }
  
    return (
      <main className="site-container public-page">
        <header className="public-issue-heading">
          <div>
            <Link
              href="/arxiv"
              className="public-back-link"
            >
              ← Gazeta arxiviga qaytish
            </Link>
  
            <span className="public-eyebrow">
              {issue.newspaper_name}
            </span>
  
            <h1>
              {issue.year}-yil,{" "}
              {issue.issue_number}-son
            </h1>
  
            <p>
              {issue.description ||
                `${issue.page_count} betli elektron nashr`}
            </p>
          </div>
  
          <div className="public-issue-actions">
            {issue.original_pdf ? (
              <a
                href={issue.original_pdf}
                target="_blank"
                rel="noreferrer"
                className="public-secondary-button"
              >
                Original PDF
              </a>
            ) : null}
  
            <span className="public-nfc-label">
              NFC: /n/{issue.nfc_slug}
            </span>
          </div>
        </header>
  
        <IssueViewer issue={issue} />
  
        {issue.articles.length > 0 ? (
          <section className="public-section issue-articles-section">
            <div className="public-section-heading">
              <div>
                <span className="public-eyebrow">
                  Ushbu nashrda
                </span>
  
                <h2>Elektron maqolalar</h2>
              </div>
            </div>
  
            <div className="latest-articles-grid">
              {issue.articles.map(
                (article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ),
              )}
            </div>
          </section>
        ) : null}
      </main>
    );
  }