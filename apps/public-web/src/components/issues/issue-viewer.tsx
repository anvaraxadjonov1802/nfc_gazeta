"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useMemo,
  useState,
} from "react";

import type {
  PublicIssueDetail,
} from "@/lib/public-types";

interface IssueViewerProps {
  issue: PublicIssueDetail;
}

type ViewerMode =
  | "image"
  | "text";

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    Math.max(value, minimum),
    maximum,
  );
}

export function IssueViewer({
  issue,
}: IssueViewerProps) {
  const pages = issue.pages;

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [zoom, setZoom] =
    useState(1);

  const [mode, setMode] =
    useState<ViewerMode>("image");

  const currentPage = useMemo(
    () => pages[currentIndex] ?? null,
    [
      currentIndex,
      pages,
    ],
  );

  function selectPage(
    pageIndex: number,
  ) {
    setCurrentIndex(
      clamp(
        pageIndex,
        0,
        Math.max(pages.length - 1, 0),
      ),
    );

    setZoom(1);
  }

  function goToPreviousPage() {
    selectPage(currentIndex - 1);
  }

  function goToNextPage() {
    selectPage(currentIndex + 1);
  }

  if (
    pages.length === 0 ||
    !currentPage
  ) {
    return (
      <section className="public-empty-state">
        <h2>
          Gazeta betlari topilmadi
        </h2>

        <p>
          Ushbu nashr betlari hali ommaga
          taqdim etilmagan.
        </p>
      </section>
    );
  }

  return (
    <section className="issue-viewer">
      <aside
        className="issue-thumbnails"
        aria-label="Gazeta betlari"
      >
        {pages.map((page, index) => (
          <button
            key={page.id}
            type="button"
            className={
              index === currentIndex
                ? "issue-thumbnail issue-thumbnail-active"
                : "issue-thumbnail"
            }
            onClick={() =>
              selectPage(index)
            }
            aria-current={
              index === currentIndex
                ? "page"
                : undefined
            }
          >
            <div>
              {page.page_image ? (
                <img
                  src={page.page_image}
                  alt={`${page.page_number}-bet`}
                  loading="lazy"
                />
              ) : (
                <span>
                  Rasm yo‘q
                </span>
              )}
            </div>

            <strong>
              {page.page_number}-bet
            </strong>
          </button>
        ))}
      </aside>

      <div className="issue-viewer-main">
        <div className="issue-viewer-toolbar">
          <div className="viewer-navigation">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentIndex === 0}
              aria-label="Oldingi bet"
            >
              ←
            </button>

            <span>
              {currentPage.page_number} /{" "}
              {pages.length}
            </span>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={
                currentIndex ===
                pages.length - 1
              }
              aria-label="Keyingi bet"
            >
              →
            </button>
          </div>

          <div className="viewer-mode-controls">
            <button
              type="button"
              className={
                mode === "image"
                  ? "viewer-control-active"
                  : ""
              }
              onClick={() =>
                setMode("image")
              }
            >
              Gazeta ko‘rinishi
            </button>

            <button
              type="button"
              className={
                mode === "text"
                  ? "viewer-control-active"
                  : ""
              }
              onClick={() =>
                setMode("text")
              }
            >
              Matn ko‘rinishi
            </button>
          </div>

          {mode === "image" ? (
            <div className="viewer-zoom-controls">
              <button
                type="button"
                onClick={() =>
                  setZoom((currentZoom) =>
                    clamp(
                      currentZoom - 0.25,
                      0.5,
                      2.5,
                    )
                  )
                }
                aria-label="Kichraytirish"
              >
                −
              </button>

              <span>
                {Math.round(zoom * 100)}%
              </span>

              <button
                type="button"
                onClick={() =>
                  setZoom((currentZoom) =>
                    clamp(
                      currentZoom + 0.25,
                      0.5,
                      2.5,
                    )
                  )
                }
                aria-label="Kattalashtirish"
              >
                +
              </button>
            </div>
          ) : null}
        </div>

        <div className="issue-viewer-canvas">
          {mode === "image" ? (
            currentPage.page_image ? (
              <div className="issue-page-scroll">
                <img
                  src={currentPage.page_image}
                  alt={`${currentPage.page_number}-bet`}
                  style={{
                    transform: `scale(${zoom})`,
                  }}
                />
              </div>
            ) : (
              <div className="public-empty-state">
                Bet rasmi mavjud emas
              </div>
            )
          ) : (
            <article className="issue-page-text">
              <h2>
                {currentPage.page_number}-bet
              </h2>

              <div>
                {currentPage.final_text ? (
                  currentPage.final_text
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map(
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
                    Ushbu bet uchun matn
                    mavjud emas.
                  </p>
                )}
              </div>

              {currentPage.audio ? (
                <audio
                  controls
                  src={currentPage.audio}
                  className="public-audio-player"
                />
              ) : null}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}