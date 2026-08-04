"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getApiErrorMessage } from "@/lib/auth";
import type {
  IssueListItem,
  IssueStatus,
} from "@/lib/issues";

function getStatusClass(
  status: IssueStatus,
): string {
  const statusClasses: Record<
    IssueStatus,
    string
  > = {
    DRAFT: "status-draft",
    PROCESSING: "status-processing",
    REVIEW: "status-review",
    PUBLISHED: "status-published",
    FAILED: "status-failed",
    ARCHIVED: "status-archived",
  };

  return statusClasses[status];
}

function formatDate(
  dateValue: string,
): string {
  const date = new Date(
    `${dateValue}T00:00:00`,
  );

  return new Intl.DateTimeFormat(
    "uz-UZ",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

async function requestIssues(): Promise<
  IssueListItem[]
> {
  const response = await fetch(
    "/api/issues",
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(
        data,
        "Nashrlar ro‘yxatini olib bo‘lmadi.",
      ),
    );
  }

  return data as IssueListItem[];
}

export function IssueList() {
  const [issues, setIssues] =
    useState<IssueListItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadIssues = useCallback(
    async () => {
      setIsLoading(true);
      setError("");

      try {
        const data =
          await requestIssues();

        setIssues(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Kutilmagan xatolik.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let isCancelled = false;

    void requestIssues()
      .then((data) => {
        if (!isCancelled) {
          setIssues(data);
        }
      })
      .catch((loadError: unknown) => {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Kutilmagan xatolik.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="content-panel">
        <div className="form-loading-state">
          <div className="loading-spinner" />
          <p>
            Nashrlar yuklanmoqda...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content-panel">
        <div className="loading-error issue-load-error">
          <h2>
            Nashrlarni olib bo‘lmadi
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              void loadIssues();
            }}
          >
            Qayta urinish
          </button>
        </div>
      </section>
    );
  }

  if (issues.length === 0) {
    return (
      <section className="content-panel">
        <div className="empty-state large-empty-state">
          <div className="empty-state-icon">
            ＋
          </div>

          <h2>
            Hali nashr qo‘shilmagan
          </h2>

          <p>
            Birinchi gazeta sonini yaratish uchun yuqoridagi “Yangi nashr” tugmasini bosing.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="issue-list"
      aria-label="Gazeta nashrlari"
    >
      {issues.map((issue) => (
        <article
          key={issue.id}
          className="issue-list-card"
        >
          <div className="issue-cover-placeholder">
            <span>
              {issue.issue_number}
            </span>
            <small>SON</small>
          </div>

          <div className="issue-card-content">
            <div className="issue-card-top">
              <div>
                <span className="issue-newspaper-name">
                  {issue.newspaper.name}
                </span>

                <h2>
                  {issue.year}-yil,{" "}
                  {issue.issue_number}-son
                </h2>
              </div>

              <span
                className={`status-badge ${getStatusClass(
                  issue.status,
                )}`}
              >
                {issue.status_display}
              </span>
            </div>

            <div className="issue-metadata">
              <span>
                Nashr sanasi:{" "}
                <strong>
                  {formatDate(
                    issue.publication_date,
                  )}
                </strong>
              </span>

              <span>
                PDF:{" "}
                <strong>
                  {issue.has_pdf
                    ? "Yuklangan"
                    : "Yuklanmagan"}
                </strong>
              </span>

              <span>
                Betlar:{" "}
                <strong>
                  {issue.page_count}
                </strong>
              </span>
            </div>

            {issue.description ? (
              <p className="issue-description">
                {issue.description}
              </p>
            ) : null}

            <div className="issue-card-footer">
              <code>
                NFC: /n/{issue.nfc_slug}
              </code>

              <span>
                {issue.created_by_name
                  ? `Yaratdi: ${issue.created_by_name}`
                  : ""}
              </span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}