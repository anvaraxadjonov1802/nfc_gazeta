"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Icon } from "@/components/ui/icon";
import {
  type AnalyticsSource,
  trackAnalyticsEvent,
} from "@/lib/analytics-client";
import type {
  PublicIssueDetail,
} from "@/lib/public-types";

interface IssueViewerProps {
  issue: PublicIssueDetail;
  trackingSource: AnalyticsSource;
}

type ViewerMode = "image" | "text";
type FlipDirection = "next" | "prev" | null;

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
  trackingSource,
}: IssueViewerProps) {
  const pages = issue.pages;
  const viewerRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);
  const [mode, setMode] =
    useState<ViewerMode>("image");
  const [isFullscreen, setIsFullscreen] =
    useState(false);
  const [flipDirection, setFlipDirection] =
    useState<FlipDirection>(null);
  const [isAudioPlaying, setIsAudioPlaying] =
    useState(false);

  const currentPage = useMemo(
    () => pages[currentIndex] ?? null,
    [currentIndex, pages],
  );

  const spreadStart = currentIndex - (currentIndex % 2);
  const leftPage = pages[spreadStart] ?? null;
  const rightPage = pages[spreadStart + 1] ?? null;

  const step = mode === "image" ? 2 : 1;
  const prevDisabled =
    flipDirection !== null || currentIndex - step < 0;
  const nextDisabled =
    flipDirection !== null ||
    currentIndex + step >= pages.length;

  useEffect(() => {
    if (!currentPage) {
      return;
    }

    void trackAnalyticsEvent({
      eventType: "PAGE_VIEW",
      issueId: issue.id,
      pageNumber: currentPage.page_number,
      source: trackingSource,
      dedupeKey: `page:${issue.id}:${currentPage.page_number}`,
      metadata: {
        viewer_mode: mode,
      },
    });
  }, [
    currentPage,
    issue.id,
    mode,
    trackingSource,
  ]);

  useEffect(() => {
    setIsAudioPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  const selectPage = useCallback(
    (pageIndex: number) => {
      setCurrentIndex(
        clamp(
          pageIndex,
          0,
          Math.max(pages.length - 1, 0),
        ),
      );
    },
    [pages.length],
  );

  const goToPreviousPage = useCallback(() => {
    if (flipDirection) {
      return;
    }

    const navStep = mode === "image" ? 2 : 1;
    const target = currentIndex - navStep;

    if (target < 0) {
      return;
    }

    if (mode === "image") {
      setFlipDirection("prev");
      window.setTimeout(() => {
        selectPage(target);
        setFlipDirection(null);
      }, 900);
      return;
    }

    selectPage(target);
  }, [currentIndex, flipDirection, mode, selectPage]);

  const goToNextPage = useCallback(() => {
    if (flipDirection) {
      return;
    }

    const navStep = mode === "image" ? 2 : 1;
    const target = currentIndex + navStep;

    if (target >= pages.length) {
      return;
    }

    if (mode === "image") {
      setFlipDirection("next");
      window.setTimeout(() => {
        selectPage(target);
        setFlipDirection(null);
      }, 900);
      return;
    }

    selectPage(target);
  }, [
    currentIndex,
    flipDirection,
    mode,
    pages.length,
    selectPage,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        goToPreviousPage();
      }

      if (event.key === "ArrowRight") {
        goToNextPage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [goToNextPage, goToPreviousPage]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        document.fullscreenElement ===
          viewerRef.current,
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  async function toggleFullscreen() {
    const viewer = viewerRef.current;

    if (!viewer) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewer.requestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by the browser.
    }
  }

  async function toggleAudio() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsAudioPlaying(true);
      } catch {
        setIsAudioPlaying(false);
      }
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  }

  if (!currentPage || pages.length === 0) {
    return (
      <section className="rounded-2xl border border-[#E7DCC3] bg-[#FFFCF5] p-10 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
          <Icon name="file-text" size={30} />
        </div>
        <h2 className="mt-4 font-serif text-xl font-bold text-[#1E4468]">
          Gazeta betlari topilmadi
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Ushbu nashr betlari hali ommaviy ko‘rish uchun tayyorlanmagan.
        </p>
      </section>
    );
  }

  const pageRangeLabel =
    mode === "image" && rightPage
      ? `${leftPage?.page_number}–${rightPage.page_number} / ${pages.length}`
      : `${currentPage.page_number} / ${pages.length}`;

  return (
    <section
      className={`issue-reader overflow-hidden rounded-2xl border border-[#E7DCC3] bg-[#FFFCF5] shadow-2xl ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-0"
          : ""
      }`}
      ref={viewerRef}
    >
      <audio
        onEnded={() => setIsAudioPlaying(false)}
        ref={audioRef}
        src={currentPage.audio ?? undefined}
      />

      <div className="flex flex-col border-b border-[#163552] bg-[#1E4468] text-white xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 xl:border-b-0 xl:px-4">
          <div className="flex items-center gap-2">
            <button
              aria-label="Oldingi bet"
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              disabled={prevDisabled}
              onClick={goToPreviousPage}
              type="button"
            >
              <Icon name="chevron-left" />
            </button>
            <span className="min-w-24 text-center text-xs font-black">
              {pageRangeLabel}
            </span>
            <button
              aria-label="Keyingi bet"
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              disabled={nextDisabled}
              onClick={goToNextPage}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>
          </div>

          <span className="hidden items-center gap-1.5 text-[10px] text-slate-300 sm:inline-flex">
            <Icon
              className="text-[#C79A3C]"
              name="nfc"
              size={14}
            />
            NFC elektron o‘quvchi
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-3 py-3 xl:justify-end xl:px-4">
          <div className="flex rounded-lg border border-white/15 bg-white/5 p-1">
            <button
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-[10px] font-bold transition ${
                mode === "image"
                  ? "bg-[#C79A3C] text-[#1E4468]"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMode("image")}
              type="button"
            >
              <Icon name="newspaper" size={15} />
              Gazeta
            </button>
            <button
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-[10px] font-bold transition ${
                mode === "text"
                  ? "bg-[#C79A3C] text-[#1E4468]"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setMode("text")}
              type="button"
            >
              <Icon name="text" size={15} />
              Matn
            </button>
          </div>

          {currentPage.audio ? (
            <button
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[10px] font-black transition ${
                isAudioPlaying
                  ? "border border-white/20 bg-white/10 text-white"
                  : "bg-[#C79A3C] text-[#1E4468] hover:bg-[#D9B25E]"
              }`}
              onClick={() => {
                void toggleAudio();
              }}
              type="button"
            >
              <Icon
                name={isAudioPlaying ? "pause" : "volume"}
                size={15}
              />
              {isAudioPlaying
                ? "Ovozni to‘xtatish"
                : "Ovozda tinglash"}
            </button>
          ) : null}

          <button
            aria-label="To‘liq ekran"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
            onClick={() => {
              void toggleFullscreen();
            }}
            type="button"
          >
            <Icon name="fullscreen" size={17} />
          </button>
        </div>
      </div>

      <div className="issue-stage-grid grid lg:grid-cols-[150px_minmax(0,1fr)]">
        <aside className="custom-scrollbar flex gap-2 overflow-x-auto border-b border-[#E7DCC3] bg-[#F7F1E3] p-3 lg:block lg:max-h-[780px] lg:space-y-3 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          {pages.map((page, index) => (
            <button
              aria-current={
                index === currentIndex
                  ? "page"
                  : undefined
              }
              className={`w-24 shrink-0 rounded-xl border-2 bg-white p-1.5 text-left transition hover:-translate-y-0.5 lg:w-full ${
                index === spreadStart ||
                index === spreadStart + 1
                  ? "border-[#C79A3C] shadow-md ring-2 ring-[#C79A3C]/20"
                  : "border-transparent hover:border-[#E7DCC3] hover:shadow-md"
              }`}
              key={page.id}
              onClick={() =>
                selectPage(
                  mode === "image"
                    ? index - (index % 2)
                    : index,
                )
              }
              type="button"
            >
              <span className="grid aspect-[0.72] place-items-center overflow-hidden rounded-md bg-slate-200">
                {page.page_image ? (
                  <img
                    alt={`${page.page_number}-bet`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    src={page.page_image}
                  />
                ) : (
                  <Icon
                    className="text-slate-400"
                    name="file-text"
                  />
                )}
              </span>
              <strong className="mt-1.5 block text-center text-[10px] text-[#1E4468]">
                {page.page_number}-bet
              </strong>
            </button>
          ))}
        </aside>

        <div className="min-w-0 bg-[#F7F1E3]">
          {mode === "image" ? (
            <div className="issue-stage-book relative flex items-center justify-center px-3 py-6 sm:px-8 sm:py-10 lg:h-[780px] lg:py-12">
              <button
                aria-label="Oldingi varaq"
                className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#E7DCC3] bg-white text-[#1E4468] shadow-md transition hover:scale-105 hover:bg-[#FBF8F2] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:h-11 sm:w-11 lg:left-6"
                disabled={prevDisabled}
                onClick={goToPreviousPage}
                type="button"
              >
                <Icon name="chevron-left" />
              </button>

              <div
                className="relative w-full max-w-4xl"
                style={{
                  aspectRatio: "16 / 10.2",
                  perspective: "2400px",
                }}
              >
                <div className="absolute inset-0 flex overflow-hidden rounded-sm bg-white shadow-2xl">
                  <div className="relative flex-1 border-r border-[#E7DCC3] bg-white">
                    {leftPage?.page_image ? (
                      <img
                        alt={`${leftPage.page_number}-bet`}
                        className="h-full w-full object-contain"
                        src={leftPage.page_image}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-slate-400">
                        {leftPage ? "Bet rasmi yo‘q" : ""}
                      </div>
                    )}
                    {leftPage ? (
                      <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-[#A79E8C]">
                        {leftPage.page_number}-bet
                      </span>
                    ) : null}
                  </div>
                  <div className="relative flex-1 bg-white">
                    {rightPage?.page_image ? (
                      <img
                        alt={`${rightPage.page_number}-bet`}
                        className="h-full w-full object-contain"
                        src={rightPage.page_image}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-slate-400">
                        {rightPage ? "Bet rasmi yo‘q" : ""}
                      </div>
                    )}
                    {rightPage ? (
                      <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[#A79E8C]">
                        {rightPage.page_number}-bet
                      </span>
                    ) : null}
                  </div>
                </div>

                {flipDirection ? (
                  <div
                    className="absolute top-0 h-full w-1/2"
                    style={
                      flipDirection === "next"
                        ? {
                            right: 0,
                            transformStyle: "preserve-3d",
                            transformOrigin: "left center",
                            transform: "rotateY(-180deg)",
                            transition:
                              "transform 0.9s cubic-bezier(0.45,0.05,0.15,1)",
                          }
                        : {
                            left: 0,
                            transformStyle: "preserve-3d",
                            transformOrigin: "right center",
                            transform: "rotateY(180deg)",
                            transition:
                              "transform 0.9s cubic-bezier(0.45,0.05,0.15,1)",
                          }
                    }
                  >
                    <div
                      className="absolute inset-0 overflow-hidden bg-white shadow-2xl"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {(flipDirection === "next"
                        ? rightPage?.page_image
                        : leftPage?.page_image) ? (
                        <img
                          alt=""
                          className="h-full w-full object-contain"
                          src={
                            (flipDirection === "next"
                              ? rightPage?.page_image
                              : leftPage?.page_image) ?? undefined
                          }
                        />
                      ) : null}
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            flipDirection === "next"
                              ? "linear-gradient(to right, rgba(0,0,0,.14), transparent 30%)"
                              : "linear-gradient(to left, rgba(0,0,0,.14), transparent 30%)",
                        }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 bg-[#FBF8F0] shadow-2xl"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            flipDirection === "next"
                              ? "linear-gradient(to left, rgba(0,0,0,.14), transparent 30%)"
                              : "linear-gradient(to right, rgba(0,0,0,.14), transparent 30%)",
                        }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
              </div>

              <button
                aria-label="Keyingi varaq"
                className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#E7DCC3] bg-white text-[#1E4468] shadow-md transition hover:scale-105 hover:bg-[#FBF8F2] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:h-11 sm:w-11 lg:right-6"
                disabled={nextDisabled}
                onClick={goToNextPage}
                type="button"
              >
                <Icon name="chevron-right" />
              </button>
            </div>
          ) : (
            <article className="custom-scrollbar max-h-[80vh] overflow-y-auto bg-[#FFFCF5] px-5 py-8 sm:px-10 lg:h-[780px] lg:max-h-none lg:px-16 lg:py-14">
              <div className="mx-auto max-w-3xl">
                <div className="mb-7 flex items-center justify-between border-b border-[#E7DCC3] pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#9C7826]">
                      Qulay o‘qish rejimi
                    </span>
                    <h2 className="mt-1 font-serif text-2xl font-black text-[#1E4468]">
                      {currentPage.page_number}-bet
                    </h2>
                  </div>
                  <Icon
                    className="text-slate-300"
                    name="text"
                    size={28}
                  />
                </div>

                <div className="space-y-5 font-serif text-[1.05rem] leading-8 text-slate-800">
                  {currentPage.final_text ? (
                    currentPage.final_text
                      .split(/\n{2,}/)
                      .map((paragraph) =>
                        paragraph.trim(),
                      )
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>
                          {paragraph}
                        </p>
                      ))
                  ) : (
                    <p className="text-slate-500">
                      Ushbu bet uchun matn mavjud emas.
                    </p>
                  )}
                </div>

                {currentPage.audio ? (
                  <p className="mt-8 text-xs font-semibold text-[#9C7826]">
                    Bu betni yuqoridagi “Ovozda tinglash” tugmasi orqali tinglashingiz mumkin.
                  </p>
                ) : null}
              </div>
            </article>
          )}
        </div>
      </div>

      <footer className="flex flex-col gap-2 border-t border-[#E7DCC3] bg-[#FFFCF5] px-4 py-3 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Klaviatura: ← → varaq almashtirish
        </span>
        <span>
          {issue.newspaper_name} · {issue.year}-yil, {issue.issue_number}-son
        </span>
      </footer>
    </section>
  );
}
