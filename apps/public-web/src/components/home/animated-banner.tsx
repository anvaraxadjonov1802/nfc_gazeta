"use client";

import Image from "next/image";

import { useLocale } from "@/context/locale-context";

const HERO_COPY = {
  uz: {
    title: "TEMIRYO‘LCHI",
    accent: "Elektron gazeta",
    description:
      "NFC orqali gazetangizning elektron sonini bir zumda oching, maqolalarni o‘qing va media materiallarni ko‘ring.",
  },
  ru: {
    title: "TEMIRYO‘LCHI",
    accent: "Электронная газета",
    description:
      "Откройте электронный выпуск через NFC за секунду, читайте статьи и смотрите медиаматериалы.",
  },
  en: {
    title: "TEMIRYO‘LCHI",
    accent: "Digital newspaper",
    description:
      "Open the digital issue instantly with NFC, read articles and explore media materials in one place.",
  },
} as const;

export function AnimatedBanner() {
  const { locale } = useLocale();
  const copy = HERO_COPY[locale];

  return (
    <section className="relative isolate min-h-[560px] overflow-hidden rounded-[2rem] bg-[#0A2A47] shadow-[0_30px_80px_rgba(15,46,75,0.25)] sm:min-h-[620px] lg:min-h-[660px]">
      <Image
        alt="Jaloliddin Manguberdi tezyurar poyezdi"
        className="object-cover object-[68%_center] sm:object-[64%_center] lg:object-[60%_center]"
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
        src="/images/jaloliddin-manguberdi-hero.webp"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,38,0.86)_0%,rgba(6,34,57,0.68)_34%,rgba(8,37,61,0.22)_58%,rgba(8,37,61,0.03)_78%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,27,46,0.04)_42%,rgba(4,20,34,0.46)_100%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(2,18,31,0.28)]" />

      <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[34%] h-52 w-80 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative z-10 flex min-h-[560px] items-end px-4 py-5 sm:min-h-[620px] sm:px-6 sm:py-7 lg:min-h-[660px] lg:items-center lg:px-10 lg:py-10">
        <div className="w-full max-w-[610px] rounded-[1.8rem] border border-white/25 bg-[#092F50]/72 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-9 lg:p-11">
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#1EA7FF] via-[#5FC5FF] to-transparent" />

          <h1 className="mt-5 text-[clamp(2.7rem,7vw,5.2rem)] font-black leading-[0.93] tracking-[-0.045em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)]">
            {copy.title}
          </h1>

          <p className="mt-3 bg-gradient-to-r from-[#22B9FF] via-[#36A8FF] to-[#8BD9FF] bg-clip-text text-[clamp(2rem,5vw,4rem)] font-black leading-[1.02] tracking-[-0.035em] text-transparent">
            {copy.accent}
          </p>

          <p className="mt-7 max-w-[520px] text-sm font-medium leading-7 text-slate-100/92 sm:text-base sm:leading-8 lg:text-lg">
            {copy.description}
          </p>
        </div>
      </div>
    </section>
  );
}
