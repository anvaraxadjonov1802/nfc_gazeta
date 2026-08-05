/* eslint-disable @next/next/no-img-element */

import type {
    Metadata,
  } from "next";
  import Link from "next/link";
  
  import {
    getPublicIssues,
  } from "@/lib/public-api";
  import type {
    PublicIssueListItem,
  } from "@/lib/public-types";
  
  export const metadata: Metadata = {
    title: "Gazeta arxivi",
  };
  
  function groupIssuesByYear(
    issues: PublicIssueListItem[],
  ): Record<string, PublicIssueListItem[]> {
    return issues.reduce<
      Record<string, PublicIssueListItem[]>
    >(
      (groups, issue) => {
        const year = String(issue.year);
  
        groups[year] ??= [];
        groups[year].push(issue);
  
        return groups;
      },
      {},
    );
  }
  
  export default async function ArchivePage() {
    let issues: PublicIssueListItem[];
  
    try {
      issues = await getPublicIssues();
    } catch {
      return (
        <main className="site-container public-page">
          <section className="public-error-state">
            <h1>
              Gazeta arxivini yuklab
              bo‘lmadi
            </h1>
  
            <p>
              Backend server ishlayotganini
              tekshiring.
            </p>
          </section>
        </main>
      );
    }
  
    const groupedIssues =
      groupIssuesByYear(issues);
  
    const years = Object.keys(
      groupedIssues,
    ).sort(
      (firstYear, secondYear) =>
        Number(secondYear) -
        Number(firstYear),
    );
  
    return (
      <main className="site-container public-page">
        <header className="public-page-heading">
          <span className="public-eyebrow">
            Elektron kutubxona
          </span>
  
          <h1>Gazeta arxivi</h1>
  
          <p>
            Temiryo‘lchi gazetasining barcha
            elektron sonlarini yil bo‘yicha
            ko‘ring.
          </p>
        </header>
  
        {issues.length === 0 ? (
          <section className="public-empty-state">
            <h2>
              Arxivda nashr mavjud emas
            </h2>
  
            <p>
              Ommaga chiqarilgan nashrlar
              shu yerda ko‘rinadi.
            </p>
          </section>
        ) : (
          <div className="archive-years">
            {years.map((year) => (
              <section
                key={year}
                className="archive-year-section"
              >
                <div className="archive-year-heading">
                  <h2>{year}-yil</h2>
  
                  <span>
                    {
                      groupedIssues[year]
                        .length
                    }{" "}
                    ta nashr
                  </span>
                </div>
  
                <div className="archive-issues-grid">
                  {groupedIssues[year].map(
                    (issue) => (
                      <article
                        key={issue.id}
                        className="archive-issue-card"
                      >
                        <Link
                          href={`/n/${issue.nfc_slug}`}
                          className="archive-issue-cover"
                        >
                          {issue.cover_image ? (
                            <img
                              src={
                                issue.cover_image
                              }
                              alt={`${issue.issue_number}-son`}
                              loading="lazy"
                            />
                          ) : (
                            <div className="issue-cover-fallback">
                              <strong>
                                {
                                  issue
                                    .issue_number
                                }
                              </strong>
  
                              <span>SON</span>
                            </div>
                          )}
                        </Link>
  
                        <div className="archive-issue-content">
                          <span>
                            {
                              issue
                                .newspaper_name
                            }
                          </span>
  
                          <h3>
                            <Link
                              href={`/n/${issue.nfc_slug}`}
                            >
                              {issue.year}-yil,{" "}
                              {
                                issue
                                  .issue_number
                              }
                              -son
                            </Link>
                          </h3>
  
                          <p>
                            {issue.page_count} bet
                            · {issue.article_count}{" "}
                            maqola
                          </p>
  
                          <Link
                            href={`/n/${issue.nfc_slug}`}
                            className="archive-read-link"
                          >
                            Nashrni o‘qish →
                          </Link>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    );
  }