"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { RevealHeading } from "@/components/ui/reveal-heading";
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
    <section className="relative w-full bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        className="dark-panel relative mx-auto w-full max-w-7xl overflow-hidden rounded-sm"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-[0.14]">
          <Image
            alt=""
            className="object-cover grayscale"
            fill
            src="/images/featured-story-xiva.webp"
          />
        </div>

        <div className="relative p-6 sm:p-10 lg:p-14">
          <div className="hairline-bottom flex items-center justify-between border-white/15 pb-6">
            <RevealHeading
              as="h2"
              className="font-display text-3xl font-black text-[#f1ece1] sm:text-4xl"
              text={t("featured.eyebrow")}
            />
            <span className="masthead-label hidden text-white/50 sm:inline">
              Tanlangan voqea
            </span>
          </div>

          <div className="mt-8">
            <span className="masthead-label text-white/50">
              Jaloliddin Manguberdi · 2026
            </span>
            <h3 className="font-editorial mt-3 max-w-3xl text-2xl italic leading-snug text-[#f1ece1] sm:text-3xl">
              {t("featured.title")}
            </h3>
            <p className="font-body-serif mt-4 max-w-3xl text-[15px] leading-7 text-white/70">
              {t("featured.lead")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong className="font-display block text-3xl font-black text-[#f1ece1] sm:text-4xl">
                  {stat.value}
                </strong>
                <span className="masthead-label mt-1 block text-white/45">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            className="group mt-10 inline-flex items-center gap-1.5 border-b border-white/40 pb-1 text-xs font-bold uppercase tracking-[0.1em] text-[#f1ece1] transition hover:border-white"
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
              size={13}
            />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
