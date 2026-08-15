"use client";

/* eslint-disable @next/next/no-img-element */

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";
import { featuredVideos } from "@/lib/videos-data";

export function VideoSection() {
  const { t } = useLocale();

  if (featuredVideos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D9622B]">
          {t("media.eyebrow")}
        </span>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#1B1712] sm:text-4xl">
          {t("media.title")}
        </h2>
      </div>

      <div className="space-y-4">
        {featuredVideos.map((video) => (
          <a
            className="group flex flex-col gap-4 overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:flex-row sm:items-center sm:gap-6 sm:p-5"
            href={video.watchUrl}
            key={video.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="min-w-0 flex-1 sm:order-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE6D2] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#B54D1E]">
                {video.channel}
              </span>
              <h3 className="mt-3 text-lg font-black leading-snug text-[#1B1712] transition group-hover:text-[#D9622B] sm:text-xl">
                {video.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Icon
                  className="text-[#D9622B]"
                  name="play"
                  size={13}
                />
                {t("media.watch")}
              </span>
            </div>

            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-slate-900 sm:order-2 sm:w-72">
              <img
                alt={video.title}
                className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                loading="lazy"
                src={video.thumbnailUrl}
              />
              <span className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />
              <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1B1712] shadow-lg transition group-hover:scale-110">
                <Icon name="play" size={18} />
              </span>
              <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                {t("media.videoBadge")}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
