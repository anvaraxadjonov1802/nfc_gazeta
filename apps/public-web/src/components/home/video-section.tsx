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
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#9C7826]">
            {t("media.eyebrow")}
          </span>
          <h2 className="mt-1 font-serif text-2xl font-black text-[#1E4468] sm:text-3xl">
            {t("media.title")}
          </h2>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {featuredVideos.map((video) => (
          <a
            className="group overflow-hidden rounded-2xl border border-[#E7DCC3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            href={video.watchUrl}
            key={video.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="relative block aspect-video w-full overflow-hidden bg-slate-900">
              <img
                alt={video.title}
                className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                loading="lazy"
                src={video.thumbnailUrl}
              />
              <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />
              <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1E4468] shadow-lg transition group-hover:scale-110">
                <Icon name="play" size={20} />
              </span>
              <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                {t("media.videoBadge")}
              </span>
            </span>

            <div className="p-4">
              <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-[#1E4468] transition group-hover:text-[#2A5C8A]">
                {video.title}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Icon
                  className="text-[#C79A3C]"
                  name="play"
                  size={12}
                />
                {video.channel}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
