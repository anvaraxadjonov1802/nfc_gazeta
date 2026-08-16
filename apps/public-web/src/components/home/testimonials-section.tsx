"use client";

import { motion } from "framer-motion";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

/**
 * Placeholder testimonials — no real reader feedback has been collected
 * yet. These are generic, non-attributed sample quotes; swap with real
 * reader feedback once available.
 */
const PLACEHOLDER_TESTIMONIALS = [
  {
    initial: "D",
    name: "Temiryo‘l xodimi",
    quote:
      "Endi bosma gazetani NFC orqali telefonimda ham o‘qiy olaman — juda qulay.",
  },
  {
    initial: "N",
    name: "O‘quvchi",
    quote:
      "Audio rejimi ishga ketayotganda gazetani tinglashga imkon beradi.",
  },
  {
    initial: "S",
    name: "O‘quvchi",
    quote:
      "Gazeta arxivini istalgan vaqt qayta ochib, kerakli sonni topish oson bo‘ldi.",
  },
];

export function TestimonialsSection() {
  const { t } = useLocale();

  return (
    <section className="relative w-full overflow-hidden bg-paper py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label justify-center">
            {t("testimonials.eyebrow")}
          </span>
          <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {PLACEHOLDER_TESTIMONIALS.map((item, index) => (
            <motion.div
              className="paper-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              key={item.name + index}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex gap-1 text-[var(--gz-bronze)]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Icon
                    key={starIndex}
                    name="check"
                    size={13}
                  />
                ))}
              </div>
              <p className="font-body-serif mt-4 text-sm leading-6 text-[var(--gz-ink-soft)]">
                “{item.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gz-bronze)] to-[var(--gz-navy)] text-sm font-black text-white">
                  {item.initial}
                </span>
                <strong className="text-sm font-bold text-[var(--gz-ink)]">
                  {item.name}
                </strong>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
