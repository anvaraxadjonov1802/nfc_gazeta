"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

const HERO_COPY = {
  uz: {
    title: "TEMIRYO‘LCHI",
    accent: "Elektron gazeta",
    description:
      "NFC orqali gazetangizning elektron sonini bir zumda oching, maqolalarni o‘qing va media materiallarni ko‘ring.",
    ctaPrimary: "So‘nggi nashrni o‘qish",
    ctaSecondary: "Videolarni ko‘rish",
    badge: "Jaloliddin Manguberdi",
    badgeSub: "Yuqori tezlikdagi poyezd",
    statIssues: "So‘nggi nashrlar",
    statArticles: "Maqolalar",
    statVideos: "Videolar",
    statAlways: "24/7 onlayn kirish",
    ticker: [
      "O‘zbekiston temir yo‘llari — taraqqiyot yo‘lida",
      "Har bir bosma son endi ekranda ham",
    ],
  },
  ru: {
    title: "TEMIRYO‘LCHI",
    accent: "Электронная газета",
    description:
      "Откройте электронный выпуск через NFC за секунду, читайте статьи и смотрите медиаматериалы.",
    ctaPrimary: "Читать последний номер",
    ctaSecondary: "Смотреть видео",
    badge: "Джалолиддин Мангуберди",
    badgeSub: "Высокоскоростной поезд",
    statIssues: "Последние номера",
    statArticles: "Статьи",
    statVideos: "Видео",
    statAlways: "Доступно 24/7",
    ticker: [
      "Узбекские железные дороги — на пути прогресса",
      "Теперь каждый печатный номер доступен на экране",
    ],
  },
  en: {
    title: "TEMIRYO‘LCHI",
    accent: "Digital newspaper",
    description:
      "Open the digital issue instantly with NFC, read articles and explore media materials in one place.",
    ctaPrimary: "Read the latest issue",
    ctaSecondary: "Watch videos",
    badge: "Jaloliddin Manguberdi",
    badgeSub: "High-speed train",
    statIssues: "Latest issues",
    statArticles: "Articles",
    statVideos: "Videos",
    statAlways: "Available 24/7",
    ticker: [
      "Uzbekistan Railways — on the path of progress",
      "Every printed issue is now on your screen too",
    ],
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface HeroProps {
  latestIssueSlug: string | null;
  issuesCount: number;
  articlesCount: number;
  videosCount: number;
}

export function AnimatedBanner({
  latestIssueSlug,
  issuesCount,
  articlesCount,
  videosCount,
}: HeroProps) {
  const { locale } = useLocale();
  const copy = HERO_COPY[locale];
  const sectionRef = useRef<HTMLElement | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  useEffect(() => {
    if (isTickerPaused) {
      return;
    }

    const id = window.setInterval(() => {
      setTickerIndex(
        (current) => (current + 1) % copy.ticker.length,
      );
    }, 4500);

    return () => window.clearInterval(id);
  }, [copy.ticker.length, isTickerPaused]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { label: copy.statIssues, value: `${issuesCount}+` },
    { label: copy.statArticles, value: `${articlesCount}+` },
    { label: copy.statVideos, value: `${videosCount}+` },
  ];

  return (
    <section
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-canvas"
      ref={sectionRef}
    >
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <Image
          alt="Jaloliddin Manguberdi tezyurar poyezdi"
          className="object-cover object-[68%_center] sm:object-[64%_center] lg:object-[60%_center]"
          fill
          priority
          sizes="100vw"
          src="/images/jaloliddin-manguberdi-hero.webp"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,31,0.92)_0%,rgba(10,30,58,0.78)_32%,rgba(10,30,58,0.32)_58%,rgba(10,30,58,0.08)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,31,0.1)_0%,rgba(5,14,31,0.15)_55%,rgba(5,14,31,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-0 wire-pattern opacity-40" />
      <div className="glow-pulse pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--canvas-electric)]/20 blur-3xl" />
      <div className="glow-pulse pointer-events-none absolute bottom-[-6rem] left-[30%] h-64 w-96 rounded-full bg-[var(--canvas-royal)]/25 blur-3xl" />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-28 sm:px-6 lg:px-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          animate="show"
          className="glass-chip inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2"
          custom={0}
          initial="hidden"
          variants={fadeUp}
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--canvas-electric)]/20 text-[var(--canvas-electric-soft)]">
            <Icon name="nfc" size={13} />
          </span>
          <span className="text-xs font-bold text-white">
            {copy.badge}
          </span>
          <span className="hidden text-xs text-white/50 sm:inline">
            · {copy.badgeSub}
          </span>
        </motion.div>

        <motion.h1
          animate="show"
          className="mt-6 max-w-3xl text-[clamp(2.8rem,8vw,5.5rem)] font-black leading-[0.92] tracking-[-0.04em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
          custom={0.08}
          initial="hidden"
          variants={fadeUp}
        >
          {copy.title}
        </motion.h1>

        <motion.p
          animate="show"
          className="mt-2 max-w-3xl bg-gradient-to-r from-[var(--canvas-electric)] via-[var(--canvas-electric-soft)] to-white bg-clip-text text-[clamp(1.9rem,5vw,3.6rem)] font-black leading-[1.02] tracking-[-0.03em] text-transparent"
          custom={0.16}
          initial="hidden"
          variants={fadeUp}
        >
          {copy.accent}
        </motion.p>

        <motion.p
          animate="show"
          className="mt-6 max-w-xl text-sm font-medium leading-7 text-white/80 sm:text-base sm:leading-8"
          custom={0.24}
          initial="hidden"
          variants={fadeUp}
        >
          {copy.description}
        </motion.p>

        <motion.div
          animate="show"
          className="mt-8 flex flex-wrap items-center gap-3"
          custom={0.32}
          initial="hidden"
          variants={fadeUp}
        >
          <Link
            className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--canvas-electric)] to-[var(--canvas-royal)] px-6 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(34,185,255,0.55)] transition hover:brightness-110"
            href={
              latestIssueSlug
                ? `/n/${latestIssueSlug}`
                : "/arxiv"
            }
          >
            {copy.ctaPrimary}
            <Icon
              className="transition group-hover:translate-x-0.5"
              name="arrow-right"
              size={16}
            />
          </Link>
          <a
            className="glass-chip inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-bold text-white transition hover:border-white/40"
            href="#videolar"
          >
            <Icon name="play" size={15} />
            {copy.ctaSecondary}
          </a>
        </motion.div>

        <motion.div
          animate="show"
          className="mt-12 flex flex-wrap gap-3"
          custom={0.4}
          initial="hidden"
          variants={fadeUp}
        >
          {stats.map((stat) => (
            <div
              className="glass-chip min-w-[128px] rounded-2xl px-4 py-3"
              key={stat.label}
            >
              <strong className="block text-xl font-black text-white">
                {stat.value}
              </strong>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-white/60">
                {stat.label}
              </span>
            </div>
          ))}
          <div className="glass-chip flex min-w-[128px] items-center gap-2 rounded-2xl px-4 py-3">
            <span className="relative grid h-2.5 w-2.5 place-items-center">
              <span className="absolute h-2 w-2 rounded-full bg-emerald-400" />
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-white/80">
              {copy.statAlways}
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--canvas-navy-deep)] to-transparent" />

      <div
        className="glass-panel relative z-10 mx-4 mb-4 flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 sm:mx-6 sm:px-5 lg:mx-10"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--canvas-electric)]/20 text-[var(--canvas-electric-soft)]">
          <Icon name="newspaper" size={14} />
        </span>
        <div className="relative min-h-5 min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="truncate text-xs font-semibold text-white/85 sm:text-sm"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key={tickerIndex}
              transition={{ duration: 0.4 }}
            >
              {copy.ticker[tickerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {copy.ticker.map((message, index) => (
            <button
              aria-label={`Xabar ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === tickerIndex
                  ? "w-5 bg-[var(--canvas-electric)]"
                  : "w-1.5 bg-white/25"
              }`}
              key={message}
              onClick={() => setTickerIndex(index)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label={isTickerPaused ? "Davom ettirish" : "To‘xtatish"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          onClick={() => setIsTickerPaused((current) => !current)}
          type="button"
        >
          <Icon
            name={isTickerPaused ? "play" : "pause"}
            size={12}
          />
        </button>
      </div>
    </section>
  );
}
