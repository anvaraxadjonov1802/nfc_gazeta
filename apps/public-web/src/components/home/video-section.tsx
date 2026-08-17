"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";
import { featuredVideos } from "@/lib/videos-data";

export function VideoSection() {
  const { t } = useLocale();
  const [openVideoId, setOpenVideoId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!openVideoId) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenVideoId(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
      document.body.style.overflow = "";
    };
  }, [openVideoId]);

  if (featuredVideos.length === 0) {
    return null;
  }

  const openVideo = featuredVideos.find(
    (video) => video.id === openVideoId,
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-paper py-16 sm:py-20"
      id="videolar"
    >
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label">
            {t("media.eyebrow")}
          </span>
          <RevealHeading
            as="h2"
            className="font-display mt-3 text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl lg:text-5xl"
            text={t("media.title")}
          />
        </motion.div>

        <div className="flex flex-col gap-6">
          {featuredVideos.map((video, index) => (
            <motion.div
              className="paper-card group flex flex-col overflow-hidden rounded-sm sm:flex-row sm:items-stretch"
              initial={{ opacity: 0, y: 30 }}
              key={video.id}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <button
                aria-label={`${video.title} — video ko‘rish`}
                className="relative aspect-video w-full shrink-0 overflow-hidden bg-[var(--gz-ink)]/10 sm:aspect-auto sm:w-[46%]"
                onClick={() => setOpenVideoId(video.id)}
                type="button"
              >
                <img
                  alt={video.title}
                  className="h-full w-full object-cover grayscale opacity-90 transition group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                  src={video.thumbnailUrl}
                />
                <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--gz-navy)] shadow-lg transition group-hover:scale-110 sm:h-16 sm:w-16">
                  <Icon name="play" size={22} />
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                  {t("media.videoBadge")}
                </span>
              </button>

              <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-8">
                <span className="paper-chip inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide">
                  {video.channel}
                </span>
                <a
                  className="mt-4 block text-xl font-black leading-snug text-[var(--gz-ink)] transition hover:text-[var(--gz-bronze)] sm:text-2xl"
                  href={video.watchUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {video.title}
                </a>
                <button
                  className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-[var(--gz-ink-soft)] transition hover:text-[var(--gz-bronze)]"
                  onClick={() => setOpenVideoId(video.id)}
                  type="button"
                >
                  <Icon
                    className="text-[var(--gz-bronze)]"
                    name="play"
                    size={13}
                  />
                  {t("media.watch")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openVideo ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setOpenVideoId(null)}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-3xl"
              exit={{ opacity: 0, scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.96 }}
              onClick={(
                event: MouseEvent<HTMLDivElement>,
              ) => event.stopPropagation()}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between pb-3">
                <h3 className="truncate pr-4 text-sm font-bold text-white">
                  {openVideo.title}
                </h3>
                <button
                  aria-label={t("video.close")}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  onClick={() => setOpenVideoId(null)}
                  type="button"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${openVideo.id}?autoplay=1&rel=0`}
                  title={openVideo.title}
                />
              </div>
              <p className="mt-3 text-center text-[11px] font-semibold text-white/50">
                {t("video.modalHint")}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
