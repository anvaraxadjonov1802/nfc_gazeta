"use client";

/* eslint-disable @next/next/no-img-element */

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";

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

const FlipPage = forwardRef<
  HTMLDivElement,
  { children: ReactNode }
>(function FlipPage({ children }, ref) {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      ref={ref}
    >
      {children}
    </div>
  );
});

export function IssueViewer({
  issue,
  trackingSource,
}: IssueViewerProps) {
  const pages = issue.pages;
  const viewerRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const flipBookRef = useRef<HTMLFlipBook | null>(
    null,
  );

  const [currentIndex, setCurrentIndex] =
    useState(0);
  const [mode, setMode] =
    useState<ViewerMode>("image");
  const [isFullscreen, setIsFullscreen] =
    useState(false);
  const [isImmersive, setIsImmersive] =
    useState(false);
  const [isAudioPlaying, setIsAudioPlaying] =
    useState(false);

  const isStageFullscreen =
    isFullscreen || isImmersive;

  const currentPage = useMemo(
    () => pages[currentIndex] ?? null,
    [currentIndex, pages],
  );

  const prevDisabled = currentIndex <= 0;
  const nextDisabled =
    currentIndex >= pages.length - 1;

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

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    if (
      window.matchMedia("(max-width: 767px)")
        .matches
    ) {
      setIsImmersive(true);
    }
  }, []);

  useEffect(() => {
    if (!isImmersive) {
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [isImmersive]);

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
    if (mode === "image") {
      flipBookRef.current
        ?.pageFlip()
        .flipPrev();
      return;
    }

    selectPage(currentIndex - 1);
  }, [currentIndex, mode, selectPage]);

  const goToNextPage = useCallback(() => {
    if (mode === "image") {
      flipBookRef.current
        ?.pageFlip()
        .flipNext();
      return;
    }

    selectPage(currentIndex + 1);
  }, [currentIndex, mode, selectPage]);

  const goToPage = useCallback(
    (index: number) => {
      if (mode === "image") {
        flipBookRef.current
          ?.pageFlip()
          .flip(index);
        return;
      }

      selectPage(index);
    },
    [mode, selectPage],
  );

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

  const content = (
    <section
      className={`issue-reader overflow-hidden border border-[#E7DCC3] bg-[#FFFCF5] shadow-2xl ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-0"
          : isImmersive
            ? "fixed inset-0 z-50 h-[100dvh] w-screen overflow-y-auto rounded-none border-0"
            : "rounded-2xl"
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
              {currentPage.page_number} / {pages.length}
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
            aria-label={
              isStageFullscreen
                ? "Yopish"
                : "To‘liq ekran"
            }
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
            onClick={() => {
              if (isImmersive) {
                setIsImmersive(false);
                return;
              }

              void toggleFullscreen();
            }}
            type="button"
          >
            <Icon
              name={
                isStageFullscreen
                  ? "close"
                  : "fullscreen"
              }
              size={17}
            />
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
                index === currentIndex
                  ? "border-[#C79A3C] shadow-md ring-2 ring-[#C79A3C]/20"
                  : "border-transparent hover:border-[#E7DCC3] hover:shadow-md"
              }`}
              key={page.id}
              onClick={() => goToPage(index)}
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

              <HTMLFlipBook
                className="mx-auto"
                drawShadow
                flippingTime={700}
                height={733}
                maxHeight={1350}
                maxShadowOpacity={0.5}
                maxWidth={1000}
                minHeight={420}
                minWidth={280}
                mobileScrollSupport={false}
                onFlip={(event) =>
                  setCurrentIndex(event.data)
                }
                ref={flipBookRef}
                showCover
                size="stretch"
                startPage={currentIndex}
                style={{}}
                useMouseEvents
                usePortrait
                width={550}
              >
                {pages.map((page) => (
                  <FlipPage key={page.id}>
                    {page.page_image ? (
                      <img
                        alt={`${page.page_number}-bet`}
                        className="h-full w-full object-contain"
                        src={page.page_image}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-slate-400">
                        Bet rasmi yo‘q
                      </div>
                    )}
                    <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[#A79E8C]">
                      {page.page_number}-bet
                    </span>
                  </FlipPage>
                ))}
              </HTMLFlipBook>

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
            <article className="custom-scrollbar max-h-[80vh] overflow-y-auto bg-[#F7F1E3] px-3 py-6 sm:px-8 sm:py-10 lg:h-[780px] lg:max-h-none lg:px-10 lg:py-12">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#E7DCC3] bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#F0EAD9] px-5 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1E4468] font-serif text-base font-bold text-[#C79A3C]">
                    T
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#1E4468]">
                      {issue.newspaper_name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {issue.year}-yil, {issue.issue_number}-son
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#F7F1E3] px-2.5 py-1 text-[10px] font-bold text-[#9C7826]">
                    {currentPage.page_number}-bet
                  </span>
                </div>

                {currentPage.page_image ? (
                  <div className="relative aspect-[16/10] w-full bg-slate-100">
                    <img
                      alt={`${currentPage.page_number}-bet`}
                      className="h-full w-full object-cover"
                      src={currentPage.page_image}
                    />
                  </div>
                ) : null}

                <div className="px-5 py-6 sm:px-7">
                  <h2 className="text-lg font-bold text-[#1E4468] sm:text-xl">
                    {currentPage.page_number}-bet matni
                  </h2>

                  <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#2B2620]">
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
                    <p className="mt-6 text-xs font-semibold text-[#9C7826]">
                      Bu betni yuqoridagi “Ovozda tinglash” tugmasi orqali tinglashingiz mumkin.
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between border-t border-[#F0EAD9] px-5 py-3 text-[11px] text-slate-400">
                  <span>{issue.newspaper_name}</span>
                  <span>
                    {currentPage.page_number} / {pages.length} bet
                  </span>
                </div>
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

  if (
    isImmersive &&
    typeof document !== "undefined"
  ) {
    return createPortal(
      content,
      document.body,
    );
  }

  return content;
}
