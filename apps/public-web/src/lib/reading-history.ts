import type { PublicIssueDetail } from "@/lib/public-types";

export interface ReadingHistoryEntry {
  issueId: number;
  nfcSlug: string;
  newspaperName: string;
  issueNumber: number;
  year: number;
  title: string;
  coverImage: string | null;
  pageIndex: number;
  maxPageIndex: number;
  totalPages: number;
  updatedAt: string;
}

interface StreakState {
  lastActiveDate: string;
  streak: number;
}

const HISTORY_KEY = "temiryolchi_reading_history";
const STREAK_KEY = "temiryolchi_reading_streak";
const MAX_ENTRIES = 20;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readHistory(): ReadingHistoryEntry[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry): entry is ReadingHistoryEntry =>
        !!entry &&
        typeof entry === "object" &&
        typeof (entry as ReadingHistoryEntry).issueId ===
          "number",
    );
  } catch {
    return [];
  }
}

function writeHistory(
  entries: ReadingHistoryEntry[],
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
  } catch {
    // Unavailable localStorage is ignored.
  }
}

function bumpStreak(): number {
  if (!isBrowser()) {
    return 0;
  }

  const today = new Date().toISOString().slice(0, 10);

  let state: StreakState = {
    lastActiveDate: today,
    streak: 1,
  };

  try {
    const raw = window.localStorage.getItem(STREAK_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as StreakState;

      if (parsed.lastActiveDate === today) {
        return parsed.streak;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday
        .toISOString()
        .slice(0, 10);

      state = {
        lastActiveDate: today,
        streak:
          parsed.lastActiveDate === yesterdayKey
            ? parsed.streak + 1
            : 1,
      };
    }

    window.localStorage.setItem(
      STREAK_KEY,
      JSON.stringify(state),
    );
  } catch {
    // Unavailable localStorage is ignored.
  }

  return state.streak;
}

export function recordProgress(
  issue: Pick<
    PublicIssueDetail,
    | "id"
    | "nfc_slug"
    | "newspaper_name"
    | "issue_number"
    | "year"
    | "title"
    | "cover_image"
  >,
  pageIndex: number,
  totalPages: number,
): void {
  if (!isBrowser() || totalPages <= 0) {
    return;
  }

  const entries = readHistory();
  const existing = entries.find(
    (entry) => entry.issueId === issue.id,
  );

  const nextEntry: ReadingHistoryEntry = {
    issueId: issue.id,
    nfcSlug: issue.nfc_slug,
    newspaperName: issue.newspaper_name,
    issueNumber: issue.issue_number,
    year: issue.year,
    title: issue.title,
    coverImage: issue.cover_image,
    pageIndex,
    maxPageIndex: Math.max(
      existing?.maxPageIndex ?? 0,
      pageIndex,
    ),
    totalPages,
    updatedAt: new Date().toISOString(),
  };

  const rest = entries.filter(
    (entry) => entry.issueId !== issue.id,
  );

  writeHistory([nextEntry, ...rest]);
  bumpStreak();
}

export function getContinueReading(
  limit = 5,
): ReadingHistoryEntry[] {
  return readHistory()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export interface ReadingStats {
  issuesRead: number;
  pagesRead: number;
  streak: number;
}

export function getReadingStats(): ReadingStats {
  const entries = readHistory();
  const pagesRead = entries.reduce(
    (sum, entry) => sum + entry.maxPageIndex + 1,
    0,
  );

  let streak = 0;

  if (isBrowser()) {
    try {
      const raw = window.localStorage.getItem(STREAK_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as StreakState;
        const today = new Date()
          .toISOString()
          .slice(0, 10);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday
          .toISOString()
          .slice(0, 10);

        if (
          parsed.lastActiveDate === today ||
          parsed.lastActiveDate === yesterdayKey
        ) {
          streak = parsed.streak;
        }
      }
    } catch {
      // Unavailable localStorage is ignored.
    }
  }

  return {
    issuesRead: entries.length,
    pagesRead,
    streak,
  };
}
