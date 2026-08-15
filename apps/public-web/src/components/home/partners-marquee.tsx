"use client";

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

/**
 * Placeholder partner marks — no real partnership data exists yet. Swap the
 * PLACEHOLDER_PARTNERS list with real names/logos once available.
 */
const PLACEHOLDER_PARTNERS = [
  "Hamkor tashkilot",
  "Hamkor tashkilot",
  "Hamkor tashkilot",
  "Hamkor tashkilot",
  "Hamkor tashkilot",
  "Hamkor tashkilot",
];

export function PartnersMarquee() {
  const { t } = useLocale();
  const track = [...PLACEHOLDER_PARTNERS, ...PLACEHOLDER_PARTNERS];

  return (
    <section className="relative w-full overflow-hidden bg-canvas py-16">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--canvas-electric-soft)]">
            {t("partners.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">
            {t("partners.title")}
          </h2>
        </motion.div>
      </div>

      <div className="marquee-track-wrap relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--canvas-navy-deep)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--canvas-navy-deep)] to-transparent" />

        <div className="marquee-track-slow flex w-max items-center gap-6">
          {track.map((name, index) => (
            <div
              className="glass-chip flex h-16 w-52 shrink-0 items-center justify-center gap-2.5 rounded-2xl px-5 text-sm font-bold text-white/60"
              key={`${name}-${index}`}
            >
              <Icon name="shield" size={16} />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
