"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";
import { formatUzbekDate } from "@/lib/format";
import type { PublicIssueListItem } from "@/lib/public-types";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/arxiv", label: "Nashrlar" },
  { href: "/#maqolalar", label: "Maqolalar" },
  { href: "/#videolar", label: "Videolar" },
  { href: "/#masthead", label: "Biz haqimizda" },
];

const HERO_COPY = {
  uz: {
    badge: "Maxsus son",
    quote: "Kasb bayramingiz muborak bo‘lsin, aziz temiryo‘lchilar!",
    quoteAttribution: "— gazeta muqovasidan",
    ctaLabel: "Tayyormisiz?",
    ctaButton: "So‘nggi sonni o‘qish",
    headline: "Temiryo‘lchilar kasb bayramini yangi yutuqlar bilan kutib olmoqda.",
    byline: "Bosh muharrir: Rustam Haydarov",
    readingTime: "O‘qish vaqti: 3 daqiqa",
    lead: [
      "O‘zbekiston Respublikasi Prezidentining 2017-yil 2-avgustdagi farmoni hamda tegishli qonunga asosan, temiryo‘lchilar kasb bayrami har yili avgust oyining birinchi yakshanbasida katta tantana bilan nishonlanadi.",
      "Ushbu bayram munosabati bilan “O‘zbekiston temir yo‘llari” aksiyadorlik jamiyati boshqaruvi raisi Zufar Narzullayevning tegishli buyrug‘iga asosan, tizimda faoliyat yuritayotgan 64 mingga yaqin xodim moddiy rag‘batlantirildi. Bir guruh fidoyi kasb egalari boshqaruv raisi tomonidan tizimning eng oliy mukofoti — “Faxriy temiryo‘lchi” ko‘krak belgisi bilan taqdirlandi.",
      "Joriy yilda “Toshkent – Xiva – Toshkent” yo‘nalishida “Jaloliddin Manguberdi” poyezdi harakati yo‘lga qo‘yildi, “Samarqand – Urgut” yo‘nalishida yangi yo‘lovchi poyezdi ishga tushdi, shuningdek bir qancha yangi elektrlashtirilgan temir yo‘l liniyalari qurib bitkazildi.",
    ],
  },
  ru: {
    badge: "Спецвыпуск",
    quote: "С праздником, дорогие железнодорожники!",
    quoteAttribution: "— с обложки газеты",
    ctaLabel: "Готовы?",
    ctaButton: "Читать последний номер",
    headline: "Железнодорожники встречают профессиональный праздник новыми достижениями.",
    byline: "Главный редактор: Рустам Хайдаров",
    readingTime: "Время чтения: 3 мин",
    lead: [
      "Согласно указу Президента Республики Узбекистан от 2 августа 2017 года и соответствующему закону, профессиональный праздник железнодорожников ежегодно широко отмечается в первое воскресенье августа.",
      "По случаю праздника, по приказу председателя правления АО «Узбекистон темир йуллари» Зуфара Нарзуллаева, около 64 тысяч сотрудников системы были материально поощрены. Группа передовиков отрасли была удостоена высшей награды системы — нагрудного знака «Почётный железнодорожник».",
      "В этом году было запущено движение поезда «Жалолиддин Мангуберди» по маршруту «Ташкент — Хива — Ташкент», начал курсировать новый пассажирский поезд по направлению «Самарканд — Ургут», а также завершено строительство нескольких новых электрифицированных железнодорожных линий.",
    ],
  },
  en: {
    badge: "Special issue",
    quote: "Happy professional holiday, dear railway workers!",
    quoteAttribution: "— from the newspaper cover",
    ctaLabel: "Ready?",
    ctaButton: "Read the latest issue",
    headline: "Railway workers mark their professional holiday with new achievements.",
    byline: "Editor-in-chief: Rustam Haydarov",
    readingTime: "Reading time: 3 min",
    lead: [
      "Under the President of Uzbekistan's decree of 2 August 2017 and the related law, Railway Workers Day is celebrated every year on the first Sunday of August.",
      "For the occasion, by order of Uzbekistan Railways JSC board chairman Zufar Narzullayev, close to 64,000 employees across the system received material recognition. A group of dedicated staff were awarded the system's highest honour — the “Honoured Railway Worker” badge.",
      "This year the “Jaloliddin Manguberdi” train service launched on the Tashkent–Khiva–Tashkent route, a new passenger train began running on the Samarqand–Urgut line, and several new electrified railway lines were completed.",
    ],
  },
} as const;

interface HeroProps {
  latestIssueSlug: string | null;
  latestIssue: PublicIssueListItem | null;
  issuesCount: number;
  articlesCount: number;
  videosCount: number;
}

function FeatherIcon() {
  return (
    <svg
      className="h-3 w-3 shrink-0 text-[var(--gz-ink-soft)]/50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      viewBox="0 0 24 24"
    >
      <path d="M20 4c-6 0-14 4-16 14 4-1 8-3 10-6M6 18l12-14" />
    </svg>
  );
}

export function AnimatedBanner({
  latestIssueSlug,
  latestIssue,
  issuesCount,
  articlesCount,
  videosCount,
}: HeroProps) {
  const { locale } = useLocale();
  const copy = HERO_COPY[locale];
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const issueLine = latestIssue
    ? `${issuesCount}+ nashr · ${articlesCount}+ maqola · ${videosCount}+ video`
    : `${issuesCount}+ nashr`;

  return (
    <section
      className="relative w-full overflow-hidden bg-paper"
      ref={sectionRef}
    >
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-60" />

      {/* Masthead bar */}
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gz-ink-soft)] sm:px-6 lg:px-8">
        <span>
          {latestIssue
            ? `Son № ${latestIssue.issue_number}`
            : "Elektron nashr"}
        </span>
        <span className="hidden sm:inline">{copy.badge}</span>
        <span>
          {latestIssue
            ? formatUzbekDate(latestIssue.publication_date)
            : "2026"}
        </span>
      </div>

      {/* Giant masthead title */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-[clamp(3rem,11vw,7.5rem)] font-black leading-[0.86] tracking-[-0.01em] text-[var(--gz-ink)]">
          TEMIRYO‘LCHI
        </h1>
      </div>

      {/* Decorative nav strip */}
      <nav className="relative">
        <div className="rule-thick mx-auto w-full max-w-7xl" />
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          {NAV_LINKS.map((link, index) => (
            <span
              className="flex items-center gap-4"
              key={link.href}
            >
              {index > 0 ? <FeatherIcon /> : null}
              <Link
                className="masthead-label transition hover:text-[var(--gz-ink)]"
                href={link.href}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
        <div className="hairline-bottom mx-auto w-full max-w-7xl" />
      </nav>

      {/* Body */}
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="hairline-box overflow-hidden rounded-sm"
            style={{ y: photoY }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                alt="Jaloliddin Manguberdi tezyurar poyezdi"
                className="object-cover grayscale contrast-[1.05]"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                src="/images/jaloliddin-manguberdi-hero.webp"
              />
            </div>
          </motion.div>
          <p className="font-editorial mt-4 text-center text-lg italic leading-snug text-[var(--gz-ink-soft)]">
            “{copy.quote}”
          </p>
          <p className="masthead-label mt-2 text-center">
            {copy.quoteAttribution}
          </p>

          <div className="hairline-box mt-6 rounded-sm p-6 text-center">
            <span className="masthead-label">{copy.ctaLabel}</span>
            <Link
              className="mt-3 block border border-[var(--gz-ink)] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-[var(--gz-ink)] transition hover:bg-[var(--gz-ink)] hover:text-[var(--gz-paper)]"
              href={
                latestIssueSlug
                  ? `/n/${latestIssueSlug}`
                  : "/arxiv"
              }
            >
              {copy.ctaButton}
            </Link>
            <span className="masthead-label mt-3 block text-[9px] normal-case tracking-normal text-[var(--gz-ink-soft)]/70">
              {issueLine}
            </span>
          </div>
        </motion.div>

        <div>
          <RevealHeading
            as="h2"
            className="font-display text-[clamp(1.8rem,3.6vw,3rem)] font-black leading-[1.08] text-[var(--gz-ink)]"
            text={copy.headline}
          />

          <motion.p
            className="masthead-label mt-5 hairline-bottom pb-4"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            {copy.byline} · {copy.readingTime}
          </motion.p>

          <motion.div
            className="font-body-serif justify-columns mt-6 columns-1 gap-8 text-[15px] leading-7 text-[var(--gz-ink)] sm:columns-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-60px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="drop-cap mb-4 break-inside-avoid">
              {copy.lead[0]}
            </p>
            <p className="mb-4 break-inside-avoid">{copy.lead[1]}</p>
            <p className="break-inside-avoid">{copy.lead[2]}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
