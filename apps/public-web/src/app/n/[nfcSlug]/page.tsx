import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article-card";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import { IssueViewer } from "@/components/issues/issue-viewer";
import { Icon } from "@/components/ui/icon";
import {
  formatUzbekDate,
  issueLabel,
} from "@/lib/format";
import { getPublicIssue } from "@/lib/public-api";
import type { AnalyticsSource } from "@/lib/analytics-client";

interface IssuePageProps {
  params: Promise<{
    nfcSlug: string;
  }>;
  searchParams: Promise<{
    src?: string | string[];
    source?: string | string[];
    utm_source?: string | string[];
  }>;
}

function resolveTrackingSource(
  value: string | string[] | undefined,
): AnalyticsSource {
  const normalized = Array.isArray(value)
    ? value[0]?.toLowerCase()
    : value?.toLowerCase();

  if (normalized === "web") {
    return "WEB";
  }

  if (normalized === "direct") {
    return "DIRECT";
  }

  if (normalized === "external" || normalized === "social") {
    return "EXTERNAL";
  }

  if (normalized === "unknown") {
    return "UNKNOWN";
  }

  return "NFC";
}

export async function generateMetadata({
  params,
}: IssuePageProps): Promise<Metadata> {
  const { nfcSlug } = await params;

  try {
    const issue = await getPublicIssue(nfcSlug);

    if (!issue) {
      return {
        title: "Nashr topilmadi",
      };
    }

    return {
      title: issueLabel(
        issue.year,
        issue.issue_number,
      ),
      description:
        issue.description ||
        `${issue.newspaper_name} gazetasining elektron nashri`,
    };
  } catch {
    return {
      title: "Elektron nashr",
    };
  }
}

export default async function IssuePage({
  params,
  searchParams,
}: IssuePageProps) {
  const { nfcSlug } = await params;
  const query = await searchParams;
  const trackingSource = resolveTrackingSource(
    query.src ?? query.source ?? query.utm_source,
  );

  let issue;

  try {
    issue = await getPublicIssue(nfcSlug);
  } catch {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="hairline-box rounded-sm p-10 text-center">
          <h1 className="font-display text-2xl font-black text-[var(--gz-ink)]">
            Nashrni yuklab bo‘lmadi
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--gz-ink-soft)]">
            Backend server bilan aloqa mavjudligini tekshiring.
          </p>
        </section>
      </main>
    );
  }

  if (!issue) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-0 py-0 md:px-6 md:py-10 lg:px-8">
      <AnalyticsTracker
        eventType="ISSUE_OPEN"
        issueId={issue.id}
        source={trackingSource}
      />

      <div className="hidden md:mb-5 md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
        <Link
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[var(--gz-ink)] transition hover:text-[var(--gz-bronze)]"
          href="/arxiv"
        >
          <Icon name="arrow-left" size={16} />
          Gazeta arxiviga qaytish
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="paper-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider">
            <Icon name="nfc" size={14} />
            {trackingSource === "NFC"
              ? "NFC orqali ochilgan nashr"
              : "Elektron gazeta nashri"}
          </span>
          <span className="masthead-label hairline-box rounded-full px-3 py-1.5">
            {formatUzbekDate(issue.publication_date)}
          </span>
        </div>
      </div>

      <IssueViewer
        issue={issue}
        trackingSource={trackingSource}
      />

      <header className="hidden md:mt-8 md:block md:rounded-sm md:border md:border-[var(--gz-hairline)] md:bg-paper md:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <span className="editorial-label">
              {issue.newspaper_name}
            </span>
            <h1 className="font-display mt-3 text-4xl font-black tracking-tight text-[var(--gz-ink)] sm:text-5xl lg:text-6xl">
              {issueLabel(
                issue.year,
                issue.issue_number,
              )}
            </h1>
            <p className="font-body-serif mt-4 max-w-3xl text-sm leading-7 text-[var(--gz-ink-soft)] sm:text-base">
              {issue.description ||
                `${issue.page_count} betli rasmiy elektron gazeta soni.`}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col lg:items-end">
            {issue.original_pdf ? (
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--gz-ink)] px-5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--gz-ink)] transition hover:bg-[var(--gz-ink)] hover:text-[var(--gz-paper)]"
                href={issue.original_pdf}
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="download" size={17} />
                Original PDF
              </a>
            ) : null}
            <code className="masthead-label border border-[var(--gz-hairline)] px-3 py-2">
              /n/{issue.nfc_slug}
            </code>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--gz-hairline)] pt-5 text-xs sm:grid-cols-4">
          <div className="border border-[var(--gz-hairline)] p-3">
            <span className="masthead-label block">
              Nashr soni
            </span>
            <strong className="font-display mt-1.5 block text-[var(--gz-ink)]">
              {issue.issue_number}-son
            </strong>
          </div>
          <div className="border border-[var(--gz-hairline)] p-3">
            <span className="masthead-label block">
              Gazeta betlari
            </span>
            <strong className="font-display mt-1.5 block text-[var(--gz-ink)]">
              {issue.page_count} bet
            </strong>
          </div>
          <div className="border border-[var(--gz-hairline)] p-3">
            <span className="masthead-label block">
              Elektron maqolalar
            </span>
            <strong className="font-display mt-1.5 block text-[var(--gz-ink)]">
              {issue.article_count} ta
            </strong>
          </div>
          <div className="border border-[var(--gz-hairline)] p-3">
            <span className="masthead-label block">
              Holati
            </span>
            <strong className="font-display mt-1.5 block text-[var(--gz-ink)]">
              Ommaga ochiq
            </strong>
          </div>
        </div>
      </header>

      {issue.articles.length > 0 ? (
        <section className="hidden md:mt-10 md:block md:space-y-6">
          <div className="hairline-bottom flex items-end justify-between gap-4 pb-3">
            <div>
              <span className="editorial-label">
                Ushbu gazeta sonida
              </span>
              <h2 className="font-display mt-2 text-2xl font-black text-[var(--gz-ink)] sm:text-3xl">
                Elektron maqolalar
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {issue.articles.map((article) => (
              <ArticleCard
                article={article}
                key={article.id}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
