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
    badge: "Maxsus son",
    badgeSub: "2026-yil 31-iyul",
    quote: "Kasb bayramingiz muborak bo‘lsin, aziz temiryo‘lchilar!",
    quoteSecondary:
      "«Yagona Vatan, yagona xalq bo‘lib, yangi hayot va kelajak yaratamiz!»",
    description:
      "NFC orqali gazetangizning elektron sonini bir zumda oching, maqolalarni o‘qing va media materiallarni ko‘ring.",
    ctaPrimary: "So‘nggi nashrni o‘qish",
    ctaSecondary: "Videolarni ko‘rish",
    statIssues: "So‘nggi nashrlar",
    statArticles: "Maqolalar",
    statVideos: "Videolar",
    statAlways: "24/7 onlayn kirish",
    ticker: [
      "O‘zbekiston temir yo‘llari — taraqqiyot yo‘lida",
      "Har bir bosma son endi ekranda ham",
      "“Jaloliddin Manguberdi” Toshkent — Xivaga 7 yarim soatda yetib boradi",
    ],
  },
  ru: {
    title: "TEMIRYO‘LCHI",
    badge: "Спецвыпуск",
    badgeSub: "31 июля 2026",
    quote: "С праздником, дорогие железнодорожники!",
    quoteSecondary:
      "«Единым Отечеством, единым народом создадим новую жизнь и будущее!»",
    description:
      "Откройте электронный выпуск через NFC за секунду, читайте статьи и смотрите медиаматериалы.",
    ctaPrimary: "Читать последний номер",
    ctaSecondary: "Смотреть видео",
    statIssues: "Последние номера",
    statArticles: "Статьи",
    statVideos: "Видео",
    statAlways: "Доступно 24/7",
    ticker: [
      "Узбекские железные дороги — на пути прогресса",
      "Теперь каждый печатный номер доступен на экране",
      "«Жалолиддин Мангуберди» доставит из Ташкента в Хиву за 7,5 часов",
    ],
  },
  en: {
    title: "TEMIRYO‘LCHI",
    badge: "Special issue",
    badgeSub: "31 July 2026",
    quote: "Happy professional holiday, dear railway workers!",
    quoteSecondary:
      "“Being one Motherland, one people, we build a new life and future!”",
    description:
      "Open the digital issue instantly with NFC, read articles and explore media materials in one place.",
    ctaPrimary: "Read the latest issue",
    ctaSecondary: "Watch videos",
    statIssues: "Latest issues",
    statArticles: "Articles",
    statVideos: "Videos",
    statAlways: "Available 24/7",
    ticker: [
      "Uzbekistan Railways — on the path of progress",
      "Every printed issue is now on your screen too",
      "“Jaloliddin Manguberdi” reaches Khiva from Tashkent in 7.5 hours",
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
  const paperRotate = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const paperY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

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

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,14,31,0.92)_0%,rgba(10,30,58,0.8)_32%,rgba(10,30,58,0.4)_58%,rgba(10,30,58,0.12)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,31,0.1)_0%,rgba(5,14,31,0.15)_55%,rgba(5,14,31,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 wire-pattern opacity-30" />
      <div className="glow-pulse pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--gz-bronze)]/15 blur-3xl" />
      <div className="glow-pulse pointer-events-none absolute bottom-[-6rem] left-[30%] h-64 w-96 rounded-full bg-[var(--canvas-royal)]/25 blur-3xl" />

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:px-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div>
          <motion.div
            animate="show"
            className="glass-chip inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2"
            custom={0}
            initial="hidden"
            variants={fadeUp}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--gz-bronze)]/25 text-[var(--gz-bronze-soft)]">
              <Icon name="newspaper" size={13} />
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
            className="font-display mt-6 max-w-3xl text-[clamp(2.6rem,7.5vw,5.2rem)] font-black leading-[0.92] tracking-[-0.02em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
            custom={0.08}
            initial="hidden"
            variants={fadeUp}
          >
            {copy.title}
          </motion.h1>

          <motion.p
            animate="show"
            className="font-editorial mt-4 max-w-xl text-[clamp(1.35rem,3vw,1.9rem)] font-semibold italic leading-snug text-[var(--gz-bronze-soft)]"
            custom={0.16}
            initial="hidden"
            variants={fadeUp}
          >
            {copy.quote}
          </motion.p>

          <motion.p
            animate="show"
            className="font-editorial mt-3 max-w-lg text-base italic leading-7 text-white/75"
            custom={0.22}
            initial="hidden"
            variants={fadeUp}
          >
            {copy.quoteSecondary}
          </motion.p>

          <motion.p
            animate="show"
            className="mt-6 max-w-xl text-sm font-medium leading-7 text-white/70 sm:text-base sm:leading-8"
            custom={0.3}
            initial="hidden"
            variants={fadeUp}
          >
            {copy.description}
          </motion.p>

          <motion.div
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3"
            custom={0.36}
            initial="hidden"
            variants={fadeUp}
          >
            <Link
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--gz-bronze)] to-[var(--gz-bronze-soft)] px-6 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(154,107,53,0.55)] transition hover:brightness-110"
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
            custom={0.42}
            initial="hidden"
            variants={fadeUp}
          >
            {stats.map((stat) => (
              <div
                className="glass-chip min-w-[112px] rounded-2xl px-4 py-3"
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
        </div>

        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="relative hidden [perspective:1600px] lg:flex lg:items-center lg:justify-center"
          initial={{ opacity: 0, x: 40 }}
          style={{ y: paperY }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="group relative w-full max-w-[280px] overflow-hidden rounded-lg border-4 border-white/90 shadow-[0_35px_70px_-20px_rgba(0,0,0,0.65)] [transform-style:preserve-3d]"
            style={{ rotate: paperRotate }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
            initial={{ rotateY: -14, rotateX: 6 }}
            animate={{ rotateY: -14, rotateX: 6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              alt="Temiryo‘lchi gazetasining maxsus soni — birinchi sahifa"
              className="h-auto w-full object-cover"
              height={1630}
              priority
              src="/images/newspaper-front-page.webp"
              width={1200}
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-black/25 via-transparent to-white/10" />
          </motion.div>
          <span className="pointer-events-none absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-full bg-black/40 blur-xl" />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--canvas-navy-deep)] to-transparent" />

      <div
        className="glass-panel relative z-10 mx-4 mb-4 flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 sm:mx-6 sm:px-5 lg:mx-10"
        onMouseEnter={() => setIsTickerPaused(true)}
        onMouseLeave={() => setIsTickerPaused(false)}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gz-bronze)]/25 text-[var(--gz-bronze-soft)]">
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
                  ? "w-5 bg-[var(--gz-bronze-soft)]"
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
