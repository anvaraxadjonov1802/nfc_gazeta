"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

interface FeaturedStorySectionProps {
  latestIssueSlug: string | null;
}

export function FeaturedStorySection({
  latestIssueSlug,
}: FeaturedStorySectionProps) {
  const { t } = useLocale();

  const stats = [
    { value: "250", label: t("featured.stat1Label") },
    { value: "7,5", label: t("featured.stat2Label") },
    { value: "389", label: t("featured.stat3Label") },
    { value: "1022", label: t("featured.stat4Label") },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-paper py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgba(26,18,8,0.45)]"
          initial={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              alt="“Jaloliddin Manguberdi” poyezdi Xiva vokzalida"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              src="/images/featured-story-xiva.webp"
            />
          </div>
          <div className="paper-panel absolute bottom-3 left-3 right-3 rounded-lg px-4 py-2.5 text-[11px] font-semibold text-[var(--gz-ink-soft)]">
            Xiva vokzali · 2026-yil 5-may
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <span className="editorial-label">
            {t("featured.eyebrow")}
          </span>
          <h2 className="font-display mt-4 text-3xl font-black leading-[1.05] text-[var(--gz-ink)] sm:text-4xl lg:text-5xl">
            {t("featured.title")}
          </h2>
          <p className="font-body-serif mt-5 text-base leading-8 text-[var(--gz-ink-soft)] sm:text-lg">
            {t("featured.lead")}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                className="rounded-xl border border-[var(--gz-bronze)]/25 bg-white/50 px-4 py-3"
                key={stat.label}
              >
                <strong className="font-display block text-2xl font-black text-[var(--gz-navy)] sm:text-3xl">
                  {stat.value}
                </strong>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-[var(--gz-ink-soft)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--gz-navy)] px-6 text-sm font-bold text-white shadow-[0_15px_35px_-12px_rgba(22,58,99,0.6)] transition hover:brightness-110"
            href={
              latestIssueSlug
                ? `/n/${latestIssueSlug}`
                : "/arxiv"
            }
          >
            {t("featured.cta")}
            <Icon
              className="transition group-hover:translate-x-0.5"
              name="arrow-right"
              size={16}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
