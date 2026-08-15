"use client";

/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import { featuredVideos } from "@/lib/videos-data";

export function VideoSection() {
  const { t } = useLocale();

  if (featuredVideos.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-canvas py-16"
      id="videolar"
    >
      <div className="rail-lines pointer-events-none absolute inset-0 opacity-50" />
      <div className="glow-pulse pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[var(--canvas-royal)]/25 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--canvas-electric-soft)]">
            {t("media.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("media.title")}
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {featuredVideos.map((video, index) => (
            <motion.a
              className="glass-card group flex flex-col gap-4 overflow-hidden rounded-3xl p-4 transition hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
              href={video.watchUrl}
              initial={{ opacity: 0, y: 30 }}
              key={video.id}
              rel="noopener noreferrer"
              target="_blank"
              transition={{
                duration: 0.5,
                delay: (index % 2) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-black/30 sm:w-56">
                <img
                  alt={video.title}
                  className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                  loading="lazy"
                  src={video.thumbnailUrl}
                />
                <span className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />
                <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[var(--canvas-navy)] shadow-lg transition group-hover:scale-110">
                  <Icon name="play" size={18} />
                </span>
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                  {t("media.videoBadge")}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--canvas-electric-soft)]">
                  {video.channel}
                </span>
                <h3 className="mt-3 text-base font-black leading-snug text-white transition group-hover:text-[var(--canvas-electric-soft)] sm:text-lg">
                  {video.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/60">
                  <Icon
                    className="text-[var(--canvas-electric-soft)]"
                    name="play"
                    size={13}
                  />
                  {t("media.watch")}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
