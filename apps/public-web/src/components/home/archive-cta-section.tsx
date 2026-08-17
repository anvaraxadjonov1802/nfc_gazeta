"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { useLocale } from "@/context/locale-context";

const COPY = {
  uz: {
    title: "Har bir yakshanba — yangi son",
    text: "Nashrlar arxivini kuzatib boring: har bir chop etilgan son sana bo‘yicha saqlanadi va istalgan vaqt qayta ochiladi.",
    cta: "Arxivni ko‘rish",
  },
  ru: {
    title: "Каждое воскресенье — новый номер",
    text: "Следите за архивом номеров: каждый опубликованный выпуск сохраняется по дате и открывается в любое время.",
    cta: "Открыть архив",
  },
  en: {
    title: "A new issue, every week",
    text: "Follow the issues archive: every published edition is kept by date and ready to reopen anytime.",
    cta: "Browse the archive",
  },
} as const;

export function ArchiveCtaSection() {
  const { locale } = useLocale();
  const copy = COPY[locale];

  return (
    <section className="relative w-full bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        className="hairline-box mx-auto w-full max-w-3xl rounded-sm p-10 text-center sm:p-14"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-2xl font-black leading-tight text-[var(--gz-ink)] sm:text-3xl">
          {copy.title}
        </h2>
        <p className="font-editorial mt-4 text-base italic leading-relaxed text-[var(--gz-ink-soft)]">
          {copy.text}
        </p>
        <Link
          className="mt-7 inline-block border border-[var(--gz-ink)] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--gz-ink)] transition hover:bg-[var(--gz-ink)] hover:text-[var(--gz-paper)]"
          href="/arxiv"
        >
          {copy.cta}
        </Link>
      </motion.div>
    </section>
  );
}
