/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import {
  formatUzbekDate,
  issueLabel,
} from "@/lib/format";
import type {
  PublicIssueListItem,
} from "@/lib/public-types";

interface IssueCardProps {
  issue: PublicIssueListItem;
  featured?: boolean;
}

function IssueCover({
  issue,
  featured = false,
}: IssueCardProps) {
  if (issue.cover_image) {
    return (
      <img
        alt={`${issueLabel(
          issue.year,
          issue.issue_number,
        )} muqovasi`}
        className={`h-full w-full ${
          featured ? "object-contain" : "object-cover"
        }`}
        loading={featured ? "eager" : "lazy"}
        src={issue.cover_image}
      />
    );
  }

  return (
    <div className="grid h-full w-full place-content-center justify-items-center bg-gradient-to-br from-[#1B1712] to-[#004F84] text-white">
      <strong className="font-serif text-6xl font-black text-[#D9622B]">
        {issue.issue_number}
      </strong>
      <span className="mt-1 text-xs font-black tracking-[0.2em]">
        SON
      </span>
    </div>
  );
}

export function IssueCard({
  issue,
  featured = false,
}: IssueCardProps) {
  const label = issueLabel(
    issue.year,
    issue.issue_number,
  );
  const publicationDate =
    formatUzbekDate(issue.publication_date);

  if (featured) {
    return (
      <article className="overflow-hidden rounded-2xl border border-[#4A3B26] border-t-4 border-t-[#D9622B] bg-[#1B1712] text-white shadow-2xl">
        <div className="grid items-center gap-7 p-5 sm:p-8 md:grid-cols-12">
          <Link
            aria-label={`${label} nashrini ochish`}
            className="relative mx-auto aspect-[0.72] w-full max-w-[340px] overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-2xl md:col-span-5"
            href={`/n/${issue.nfc_slug}?src=web`}
          >
            <IssueCover
              featured
              issue={issue}
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/85 px-2.5 py-1 text-[10px] font-bold text-emerald-300 shadow">
              <Icon name="nfc" size={13} />
              NFC nashr
            </span>
          </Link>

          <div className="md:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9622B]/40 bg-[#D9622B]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#D9622B]">
              <Icon name="newspaper" size={14} />
              Eng yangi gazeta soni
            </span>

            <h2 className="mt-5 font-serif text-3xl font-black leading-tight sm:text-4xl">
              {issue.title || label}
            </h2>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Icon
                  className="text-[#D9622B]"
                  name="calendar"
                  size={15}
                />
                {publicationDate}
              </span>
              <span>{label}</span>
              <span>{issue.page_count} bet</span>
              <span>{issue.article_count} maqola</span>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              {issue.description ||
                "Gazetaning ushbu elektron sonini betma-bet ko‘ring yoki maqolalarni qulay matn formatida o‘qing."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D9622B] px-5 text-sm font-black text-[#1B1712] shadow transition hover:bg-[#D9B25E]"
                href={`/n/${issue.nfc_slug}?src=web`}
              >
                <Icon name="book" size={18} />
                Gazetani o‘qish
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
                href="/arxiv"
              >
                <Icon name="archive" size={18} />
                Arxivga o‘tish
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link
        aria-label={`${label} nashrini ochish`}
        className="relative block aspect-[0.72] overflow-hidden bg-slate-100"
        href={`/n/${issue.nfc_slug}?src=web`}
      >
        <IssueCover issue={issue} />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#1B1712]/90 px-2 py-1 text-[9px] font-bold text-white shadow">
          <Icon
            className="text-[#D9622B]"
            name="nfc"
            size={12}
          />
          NFC
        </span>
      </Link>

      <div className="p-5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#B54D1E]">
          {issue.newspaper_name}
        </span>
        <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-[#1B1712] transition group-hover:text-[#4A3B26]">
          <Link href={`/n/${issue.nfc_slug}?src=web`}>
            {label}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          {publicationDate} · {issue.page_count} bet · {issue.article_count} maqola
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1B1712] transition hover:text-[#D9622B]"
          href={`/n/${issue.nfc_slug}?src=web`}
        >
          Nashrni o‘qish
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </article>
  );
}
