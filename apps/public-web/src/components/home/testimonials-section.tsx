"use client";

import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";

/**
 * Placeholder testimonials — no real reader feedback has been collected
 * yet. These are generic, non-attributed sample quotes; swap with real
 * reader feedback once available.
 */
const PLACEHOLDER_TESTIMONIALS = [
  {
    name: "Temiryo‘l xodimi",
    quote:
      "Endi bosma gazetani NFC orqali telefonimda ham o‘qiy olaman — juda qulay.",
  },
  {
    name: "O‘quvchi",
    quote:
      "Audio rejimi ishga ketayotganda gazetani tinglashga imkon beradi.",
  },
];

export function TestimonialsSection() {
  const { t } = useLocale();

  return (
    <section className="relative w-full overflow-hidden bg-paper py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hairline-bottom flex items-center justify-between pb-4">
          <RevealHeading
            as="h2"
            className="font-display text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl"
            text={t("testimonials.title")}
          />
          <span className="masthead-label hidden sm:inline">
            {t("testimonials.eyebrow")}
          </span>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {PLACEHOLDER_TESTIMONIALS.map((item, index) => (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 30 }}
              key={item.name + index}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span
                aria-hidden="true"
                className="font-display shrink-0 text-5xl leading-none text-[var(--gz-ink)]/25"
              >
                “
              </span>
              <div>
                <p className="font-editorial text-lg italic leading-snug text-[var(--gz-ink)]">
                  {item.quote}
                </p>
                <span className="masthead-label mt-4 inline-block border border-[var(--gz-hairline)] px-3 py-1.5 text-[var(--gz-ink-soft)]">
                  — {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
