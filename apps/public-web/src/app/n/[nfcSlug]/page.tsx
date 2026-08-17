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
        <section className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <h1 className="font-serif text-2xl font-black text-red-900">
            Nashrni yuklab bo‘lmadi
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-red-700">
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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <AnalyticsTracker
        eventType="ISSUE_OPEN"
        issueId={issue.id}
        source={trackingSource}
      />
      <div className="animate-fade-in-up mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1B1712] transition hover:text-[#D9622B]"
          href="/arxiv"
        >
          <Icon name="arrow-left" size={16} />
          Gazeta arxiviga qaytish
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
            <Icon name="nfc" size={14} />
            {trackingSource === "NFC"
              ? "NFC orqali ochilgan nashr"
              : "Elektron gazeta nashri"}
          </span>
          <span className="rounded-full bg-[#F8F2E2] px-3 py-1.5 text-[10px] font-bold text-[#5C6673]">
            {formatUzbekDate(issue.publication_date)}
          </span>
        </div>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.08s" }}
      >
        <IssueViewer
          issue={issue}
          trackingSource={trackingSource}
        />
      </div>

      <header
        className="animate-fade-in-up mt-8 rounded-2xl border border-[#CBB98A] border-t-4 border-t-[#D9622B] bg-[#F8F2E2] p-5 shadow-sm sm:p-7"
        style={{ animationDelay: "0.16s" }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#B54D1E]">
              {issue.newspaper_name}
            </span>
            <h1 className="mt-2 font-serif text-4xl font-black tracking-tight text-[#1B1712] sm:text-5xl lg:text-6xl">
              {issueLabel(
                issue.year,
                issue.issue_number,
              )}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {issue.description ||
                `${issue.page_count} betli rasmiy elektron gazeta soni.`}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col lg:items-end">
            {issue.original_pdf ? (
              <a
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#CBB98A] bg-white px-5 text-xs font-bold text-[#1B1712] transition hover:border-[#1B1712]"
                href={issue.original_pdf}
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="download" size={17} />
                Original PDF
              </a>
            ) : null}
            <code className="rounded-lg bg-[#EFE6D2] px-3 py-2 text-[10px] text-slate-500">
              /n/{issue.nfc_slug}
            </code>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#CBB98A] pt-5 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-[#EFE6D2] p-3">
            <span className="block text-[10px] text-slate-500">
              Nashr soni
            </span>
            <strong className="mt-1 block text-[#1B1712]">
              {issue.issue_number}-son
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFE6D2] p-3">
            <span className="block text-[10px] text-slate-500">
              Gazeta betlari
            </span>
            <strong className="mt-1 block text-[#1B1712]">
              {issue.page_count} bet
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFE6D2] p-3">
            <span className="block text-[10px] text-slate-500">
              Elektron maqolalar
            </span>
            <strong className="mt-1 block text-[#1B1712]">
              {issue.article_count} ta
            </strong>
          </div>
          <div className="rounded-xl bg-[#EFE6D2] p-3">
            <span className="block text-[10px] text-slate-500">
              Holati
            </span>
            <strong className="mt-1 block text-emerald-700">
              Ommaga ochiq
            </strong>
          </div>
        </div>
      </header>

      {issue.articles.length > 0 ? (
        <section
          className="animate-fade-in-up mt-10 space-y-6"
          style={{ animationDelay: "0.24s" }}
        >
          <div className="flex items-end justify-between gap-4 border-b border-[#CBB98A] pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#B54D1E]">
                Ushbu gazeta sonida
              </span>
              <h2 className="mt-1 font-serif text-2xl font-black text-[#1B1712] sm:text-3xl">
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