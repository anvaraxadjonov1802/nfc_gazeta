"use client";

/* eslint-disable @next/next/no-img-element */

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
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
import { recordProgress } from "@/lib/reading-history";

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
  const readingWordRef =
    useRef<HTMLSpanElement | null>(null);
  const hardcoverRef = useRef<HTMLDivElement | null>(
    null,
  );
  const panOriginRef = useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isReadingMode, setIsReadingMode] =
    useState(false);
  const [readingWordIndex, setReadingWordIndex] =
    useState(0);

  const currentPage = useMemo(
    () => pages[currentIndex] ?? null,
    [currentIndex, pages],
  );

  const prevDisabled = currentIndex <= 0;
  const nextDisabled =
    currentIndex >= pages.length - 1;

  // On desktop, bookend the real pages with a pair of blank "cover" slots so
  // page 1 always lands on the right and the last page on the left — just
  // like an actual book. A trailing cover is only added when it keeps the
  // total item count even, otherwise the flip library forces a rigid
  // "hard" flip on whatever page is left dangling alone at the end. Mobile
  // (isImmersive) skips this entirely and shows the real pages as-is.
  const showBookCovers = !isImmersive;

  const flipItems = useMemo(() => {
    if (!showBookCovers) {
      return pages.map((page) => ({
        kind: "page" as const,
        page,
      }));
    }

    const items: Array<
      | { kind: "page"; page: (typeof pages)[number] }
      | { kind: "cover-front" }
      | { kind: "cover-back" }
    > = [{ kind: "cover-front" }];

    for (const page of pages) {
      items.push({ kind: "page", page });
    }

    if (pages.length % 2 === 0) {
      items.push({ kind: "cover-back" });
    }

    return items;
  }, [pages, showBookCovers]);

  const flipIndexOffset = showBookCovers ? 1 : 0;

  const readingWords = useMemo(() => {
    const text = currentPage?.final_text?.trim();

    if (!text) {
      return [];
    }

    return text.split(/\s+/).filter(Boolean);
  }, [currentPage]);

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
    if (!currentPage) {
      return;
    }

    recordProgress(issue, currentIndex, pages.length);
  }, [currentIndex, currentPage, issue, pages.length]);

  const resetAudioPlayback = useCallback(() => {
    setIsAudioPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    // Detect the mobile breakpoint after mount only, so the server-rendered
    // (non-immersive) markup matches the client's first paint and we avoid
    // a hydration mismatch, then switch to immersive mode right after.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsImmersive(
      window.matchMedia("(max-width: 767px)").matches,
    );
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

  useEffect(() => {
    if (isImmersive) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsFabOpen(false);
      setIsReadingMode(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [isImmersive]);

  const selectPage = useCallback(
    (pageIndex: number) => {
      resetAudioPlayback();
      setCurrentIndex(
        clamp(
          pageIndex,
          0,
          Math.max(pages.length - 1, 0),
        ),
      );
    },
    [pages.length, resetAudioPlayback],
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

  useEffect(() => {
    if (!isFullscreen) {
      const timeout = window.setTimeout(() => {
        setZoomLevel(1);
      }, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [isFullscreen]);

  // Drag-to-pan while zoomed in. react-pageflip attaches its own raw
  // mousedown/touchstart listeners to interpret drags as page turns, so a
  // plain mousemove/mouseup pair here is not enough — the pan has to start
  // by stopping that drag from ever reaching react-pageflip's handler (see
  // handleZoomPanStart/handleZoomTouchStart below), then this effect just
  // follows the pointer to scroll the zoomed book into view.
  useEffect(() => {
    function handlePanMove(event: MouseEvent) {
      const origin = panOriginRef.current;
      const container = hardcoverRef.current;

      if (!origin || !container) {
        return;
      }

      container.scrollLeft =
        origin.scrollLeft - (event.clientX - origin.x);
      container.scrollTop =
        origin.scrollTop - (event.clientY - origin.y);
    }

    function handlePanEnd() {
      panOriginRef.current = null;
    }

    window.addEventListener("mousemove", handlePanMove);
    window.addEventListener("mouseup", handlePanEnd);

    return () => {
      window.removeEventListener("mousemove", handlePanMove);
      window.removeEventListener("mouseup", handlePanEnd);
    };
  }, []);

  const handleZoomPanStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (zoomLevel <= 1) {
        return;
      }

      // Block this drag from ever reaching react-pageflip's own mousedown
      // handler on the flipbook (a descendant element), so it isn't read
      // as a page-turn swipe — then track it ourselves for panning.
      event.stopPropagation();

      const container = hardcoverRef.current;

      if (!container) {
        return;
      }

      panOriginRef.current = {
        x: event.clientX,
        y: event.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      };
    },
    [zoomLevel],
  );

  const handleZoomTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (zoomLevel <= 1) {
        return;
      }

      // Same idea for touch: once react-pageflip's touchstart handler
      // never fires, the browser's native touch-scroll takes over the
      // now-scrollable, zoomed-in container on its own.
      event.stopPropagation();
    },
    [zoomLevel],
  );

  // Drive the karaoke-style reading simulation: tick through the current
  // page's words on a fixed cadence, then hand off to the "reached the end"
  // effect below once every word has been marked as read.
  useEffect(() => {
    if (!isReadingMode) {
      return;
    }

    if (readingWords.length === 0) {
      return;
    }

    let interval: number | undefined;

    const startTimeout = window.setTimeout(() => {
      setReadingWordIndex(0);

      interval = window.setInterval(() => {
        setReadingWordIndex((index) => {
          if (index + 1 >= readingWords.length) {
            if (interval) {
              window.clearInterval(interval);
            }

            return readingWords.length - 1;
          }

          return index + 1;
        });
      }, 230);
    }, 0);

    return () => {
      window.clearTimeout(startTimeout);

      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isReadingMode, currentIndex, readingWords.length]);

  // Once the last word on a page has been marked (or the page has no text
  // at all), pause briefly and auto-advance — exactly like a real reader
  // turning the page — or stop cleanly at the final page.
  useEffect(() => {
    if (!isReadingMode) {
      return;
    }

    const isAtLastWord =
      readingWords.length === 0 ||
      readingWordIndex >= readingWords.length - 1;

    if (!isAtLastWord) {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (nextDisabled) {
        setIsReadingMode(false);
        return;
      }

      goToNextPage();
    }, readingWords.length === 0 ? 1100 : 850);

    return () => window.clearTimeout(timeout);
  }, [
    isReadingMode,
    readingWordIndex,
    readingWords.length,
    nextDisabled,
    goToNextPage,
  ]);

  useEffect(() => {
    if (!isReadingMode) {
      return;
    }

    readingWordRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [isReadingMode, readingWordIndex]);

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

  async function shareIssue() {
    if (typeof window === "undefined") {
      return;
    }

    const url = window.location.href;
    const shareData = {
      title: issue.newspaper_name,
      text: `${issue.newspaper_name} — ${issue.year}-yil, ${issue.issue_number}-son`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User dismissed the native share sheet — nothing to do.
    } finally {
      setIsFabOpen(false);
    }
  }

  if (!currentPage || pages.length === 0) {
    return (
      <section className="hairline-box rounded-sm bg-paper p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--gz-paper-warm)] text-[var(--gz-ink-soft)]">
          <Icon name="file-text" size={30} />
        </div>
        <h2 className="font-display mt-4 text-xl font-bold text-[var(--gz-ink)]">
          Gazeta betlari topilmadi
        </h2>
        <p className="font-body-serif mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--gz-ink-soft)]">
          Ushbu nashr betlari hali ommaviy ko‘rish uchun tayyorlanmagan.
        </p>
      </section>
    );
  }

  const content = (
    <section
      className={`issue-reader ${
        isFullscreen
          ? "h-screen w-screen overflow-y-auto bg-paper p-4 sm:p-6 lg:p-8"
          : isImmersive
            ? "fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-[var(--gz-ink)]"
            : "hairline-box rounded-sm bg-paper p-3 sm:p-5 lg:p-6"
      }`}
      ref={viewerRef}
    >
      <audio
        onEnded={() => setIsAudioPlaying(false)}
        ref={audioRef}
        src={currentPage.audio ?? undefined}
      />

      {!isImmersive ? (
        <div
          className={`paper-panel mb-4 flex flex-col gap-3 rounded-sm border border-[var(--gz-hairline)] px-3 py-3 sm:mb-6 sm:px-4 xl:flex-row xl:items-center xl:justify-between ${
            isFullscreen ? "sticky top-0 z-30 backdrop-blur-sm" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              aria-label="Oldingi bet"
              className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--gz-hairline)] text-[var(--gz-ink)] transition hover:bg-[var(--gz-paper-warm)] disabled:cursor-not-allowed disabled:opacity-30"
              disabled={prevDisabled}
              onClick={goToPreviousPage}
              type="button"
            >
              <Icon name="chevron-left" />
            </button>
            <span className="masthead-label min-w-24 text-center">
              {currentPage.page_number} / {pages.length}
            </span>
            <button
              aria-label="Keyingi bet"
              className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--gz-hairline)] text-[var(--gz-ink)] transition hover:bg-[var(--gz-paper-warm)] disabled:cursor-not-allowed disabled:opacity-30"
              disabled={nextDisabled}
              onClick={goToNextPage}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>

            <span className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--gz-ink-soft)] sm:inline-flex">
              <Icon
                className="text-[var(--gz-bronze)]"
                name="nfc"
                size={14}
              />
              NFC elektron o‘quvchi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-sm border border-[var(--gz-hairline)] p-1">
              <button
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-sm px-3 text-[10px] font-bold uppercase tracking-wide transition ${
                  mode === "image"
                    ? "bg-[var(--gz-ink)] text-[var(--gz-paper)]"
                    : "text-[var(--gz-ink-soft)] hover:bg-[var(--gz-paper-warm)]"
                }`}
                onClick={() => setMode("image")}
                type="button"
              >
                <Icon name="newspaper" size={15} />
                Gazeta
              </button>
              <button
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-sm px-3 text-[10px] font-bold uppercase tracking-wide transition ${
                  mode === "text"
                    ? "bg-[var(--gz-ink)] text-[var(--gz-paper)]"
                    : "text-[var(--gz-ink-soft)] hover:bg-[var(--gz-paper-warm)]"
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
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[10px] font-black uppercase tracking-wide transition ${
                  isAudioPlaying
                    ? "border border-[var(--gz-hairline)] text-[var(--gz-ink)]"
                    : "bg-[var(--gz-ink)] text-[var(--gz-paper)] hover:bg-[var(--gz-ink-soft)]"
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

            {isFullscreen ? (
              <div className="flex items-center gap-1 rounded-full border border-[var(--gz-hairline)] p-1">
                <button
                  aria-label="Kichraytirish"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--gz-ink)] transition hover:bg-[var(--gz-paper-warm)] disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={zoomLevel <= 1}
                  onClick={() =>
                    setZoomLevel((value) =>
                      clamp(
                        Math.round((value - 0.2) * 10) / 10,
                        1,
                        2,
                      ),
                    )
                  }
                  type="button"
                >
                  <Icon name="zoom-out" size={15} />
                </button>
                <span className="min-w-9 text-center text-[10px] font-black text-[var(--gz-ink-soft)]">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  aria-label="Kattalashtirish"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--gz-ink)] transition hover:bg-[var(--gz-paper-warm)] disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={zoomLevel >= 2}
                  onClick={() =>
                    setZoomLevel((value) =>
                      clamp(
                        Math.round((value + 0.2) * 10) / 10,
                        1,
                        2,
                      ),
                    )
                  }
                  type="button"
                >
                  <Icon name="zoom-in" size={15} />
                </button>
              </div>
            ) : null}

            <button
              aria-label={
                isFullscreen ? "Yopish" : "To‘liq ekran"
              }
              className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--gz-hairline)] text-[var(--gz-ink)] transition hover:bg-[var(--gz-paper-warm)]"
              onClick={() => {
                void toggleFullscreen();
              }}
              type="button"
            >
              <Icon
                name={isFullscreen ? "close" : "fullscreen"}
                size={17}
              />
            </button>
          </div>
        </div>
      ) : null}

      <div className={isImmersive ? "h-full w-full" : "min-w-0"}>
        {mode === "image" ? (
          <div
            className={`hardcover relative flex items-center justify-center bg-[var(--gz-ink)] shadow-2xl ${
              isImmersive
                ? "h-full w-full rounded-none px-1 py-3"
                : `mx-auto min-h-[480px] w-full rounded-sm px-3 py-6 sm:min-h-[620px] sm:px-8 sm:py-10 lg:min-h-[800px] lg:py-12 ${
                    isFullscreen ? "overflow-auto" : "overflow-hidden"
                  } ${zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : ""}`
            }`}
            onMouseDownCapture={handleZoomPanStart}
            onTouchStartCapture={handleZoomTouchStart}
            ref={hardcoverRef}
          >
            <div className="pointer-events-none absolute inset-y-6 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-black/0 via-black/45 to-black/0 blur-sm" />
            <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.4em] text-white/10 sm:bottom-3 sm:text-[10px]">
              Temiryo‘lchi
            </span>

            <button
              aria-label="Oldingi varaq"
              className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[var(--gz-hairline)] bg-white text-[var(--gz-ink)] shadow-md transition hover:scale-105 hover:bg-[var(--gz-paper-warm)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:h-11 sm:w-11 lg:left-6"
              disabled={prevDisabled}
              onClick={goToPreviousPage}
              type="button"
            >
              <Icon name="chevron-left" />
            </button>

            <div
              className="w-full max-w-full transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
              }}
            >
              <HTMLFlipBook
                className="mx-auto"
                drawShadow
                flippingTime={700}
                height={700}
                maxHeight={1350}
                maxShadowOpacity={0.5}
                maxWidth={1500}
                minHeight={420}
                minWidth={280}
                mobileScrollSupport={false}
                onFlip={(event) => {
                  resetAudioPlayback();
                  setCurrentIndex(
                    clamp(
                      event.data - flipIndexOffset,
                      0,
                      Math.max(pages.length - 1, 0),
                    ),
                  );
                }}
                ref={flipBookRef}
                showCover={false}
                size="stretch"
                startPage={currentIndex + flipIndexOffset}
                style={{}}
                useMouseEvents
                usePortrait
                width={480}
              >
                {flipItems.map((item) => {
                  if (item.kind === "page") {
                    const page = item.page;

                    return (
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
                        <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-[var(--gz-ink-soft)]/70">
                          {page.page_number}-bet
                        </span>
                      </FlipPage>
                    );
                  }

                  return (
                    <FlipPage key={item.kind}>
                      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--gz-ink)] px-6 text-center">
                        {item.kind === "cover-front" ? (
                          <>
                            <span className="masthead-label text-[var(--gz-bronze-soft)]">
                              {issue.newspaper_name}
                            </span>
                            <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
                              Temiryo‘lchi
                            </h2>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                              {issue.year}-yil · {issue.issue_number}-son
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/25">
                            Temiryo‘lchi
                          </span>
                        )}
                      </div>
                    </FlipPage>
                  );
                })}
              </HTMLFlipBook>
            </div>

            <button
              aria-label="Keyingi varaq"
              className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[var(--gz-hairline)] bg-white text-[var(--gz-ink)] shadow-md transition hover:scale-105 hover:bg-[var(--gz-paper-warm)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:h-11 sm:w-11 lg:right-6"
              disabled={nextDisabled}
              onClick={goToNextPage}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>

            {isReadingMode ? (
              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 sm:inset-x-8 sm:bottom-8 lg:inset-x-16">
                <div className="pointer-events-auto mx-auto max-h-28 max-w-2xl overflow-y-auto rounded-sm border border-white/10 bg-[var(--gz-ink)]/92 px-4 py-3 shadow-2xl backdrop-blur sm:max-h-36 sm:px-6 sm:py-4">
                  {readingWords.length > 0 ? (
                    <p className="font-body-serif text-[13px] leading-6 sm:text-sm">
                      {readingWords.map((word, index) => (
                        <span
                          className={
                            index < readingWordIndex
                              ? "text-white/30"
                              : index === readingWordIndex
                                ? "gz-reading-active rounded-[2px] bg-[var(--gz-bronze-soft)] px-1 text-[var(--gz-ink)]"
                                : "text-white/55"
                          }
                          key={`${currentIndex}-${index}`}
                          ref={
                            index === readingWordIndex
                              ? readingWordRef
                              : undefined
                          }
                        >
                          {word}{" "}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-white/40">
                      Bu bet uchun matn mavjud emas — keyingi betga o‘tilmoqda…
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <article className="custom-scrollbar max-h-[80vh] overflow-y-auto bg-[var(--gz-paper-warm)] px-3 py-6 sm:px-8 sm:py-10 lg:max-h-none lg:px-10 lg:py-12">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[var(--gz-hairline)] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[var(--gz-hairline)] px-5 py-4">
                <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gz-ink)] text-base font-bold text-[var(--gz-bronze-soft)]">
                  T
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--gz-ink)]">
                    {issue.newspaper_name}
                  </p>
                  <p className="text-[11px] text-[var(--gz-ink-soft)]">
                    {issue.year}-yil, {issue.issue_number}-son
                  </p>
                </div>
                <span className="paper-chip shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold">
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
                <h2 className="font-display text-lg font-bold text-[var(--gz-ink)] sm:text-xl">
                  {currentPage.page_number}-bet matni
                </h2>

                <div className="font-body-serif mt-4 space-y-4 text-[15px] leading-7 text-[var(--gz-ink)]">
                  {currentPage.final_text ? (
                    currentPage.final_text
                      .split(/\n{2,}/)
                      .map((paragraph) =>
                        paragraph.trim(),
                      )
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p
                          className={
                            index === 0 ? "drop-cap" : undefined
                          }
                          key={index}
                        >
                          {paragraph}
                        </p>
                      ))
                  ) : (
                    <p className="text-[var(--gz-ink-soft)]">
                      Ushbu bet uchun matn mavjud emas.
                    </p>
                  )}
                </div>

                {currentPage.audio ? (
                  <p className="mt-6 text-xs font-semibold text-[var(--gz-bronze)]">
                    Bu betni yuqoridagi “Ovozda tinglash” tugmasi orqali tinglashingiz mumkin.
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--gz-hairline)] px-5 py-3 text-[11px] text-[var(--gz-ink-soft)]">
                <span>{issue.newspaper_name}</span>
                <span>
                  {currentPage.page_number} / {pages.length} bet
                </span>
              </div>
            </div>
          </article>
        )}
      </div>

      {!isImmersive ? (
        <footer className="mt-4 flex flex-col gap-2 border-t border-[var(--gz-hairline)] pt-3 text-[10px] text-[var(--gz-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <span>Klaviatura: ← → varaq almashtirish</span>
          <span>
            {issue.newspaper_name} · {issue.year}-yil, {issue.issue_number}-son
          </span>
        </footer>
      ) : null}

      {isImmersive ? (
        <div className="pointer-events-none fixed bottom-5 right-4 z-[80] flex flex-col items-end gap-2.5">
          {isFabOpen && !isReadingMode ? (
            <div className="pointer-events-auto flex flex-col items-end gap-2.5">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--gz-ink)]/95 px-4 py-2 text-[11px] font-bold text-[var(--gz-bronze-soft)] shadow-xl backdrop-blur transition hover:bg-[var(--gz-ink)]"
                onClick={() => {
                  setIsFabOpen(false);
                  setIsImmersive(false);
                }}
                type="button"
              >
                Chiqish
                <Icon name="close" size={15} />
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--gz-ink)]/95 px-4 py-2 text-[11px] font-bold text-[var(--gz-bronze-soft)] shadow-xl backdrop-blur transition hover:bg-[var(--gz-ink)]"
                onClick={() => {
                  void shareIssue();
                }}
                type="button"
              >
                Ulashish
                <Icon name="share" size={15} />
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--gz-ink)]/95 px-4 py-2 text-[11px] font-bold text-[var(--gz-bronze-soft)] shadow-xl backdrop-blur transition hover:bg-[var(--gz-ink)]"
                onClick={() => {
                  setMode("image");
                  setIsReadingMode(true);
                  setIsFabOpen(false);
                }}
                type="button"
              >
                Kitobni o‘qib berish
                <Icon name="volume" size={15} />
              </button>
            </div>
          ) : null}

          <button
            aria-label={
              isReadingMode
                ? "O‘qishni to‘xtatish"
                : isFabOpen
                  ? "Menyuni yopish"
                  : "Menyu"
            }
            className={`pointer-events-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-[var(--gz-ink)] text-[var(--gz-bronze-soft)] shadow-2xl transition ${
              !isFabOpen && !isReadingMode ? "gz-fab-glow" : ""
            }`}
            onClick={() => {
              if (isReadingMode) {
                setIsReadingMode(false);
                return;
              }

              setIsFabOpen((open) => !open);
            }}
            type="button"
          >
            <Icon
              name={
                isReadingMode
                  ? "pause"
                  : isFabOpen
                    ? "close"
                    : "book"
              }
              size={20}
            />
          </button>
        </div>
      ) : null}
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
