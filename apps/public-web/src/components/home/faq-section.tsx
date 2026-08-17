"use client";

import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";

const FAQ_UZ = [
  {
    q: "NFC gazeta qanday ishlaydi?",
    a: "Har bir bosma sonning muqovasida NFC stiker bor. Telefoningizni stikerga yaqinlashtirsangiz, o‘sha sonning elektron nusxasi brauzeringizda avtomatik ochiladi.",
  },
  {
    q: "Ilova o‘rnatish shartmi?",
    a: "Yo‘q. Tizim to‘liq brauzer orqali ishlaydi — na ilova, na ro‘yxatdan o‘tish talab qilinmaydi.",
  },
  {
    q: "Eski sonlarni qayerdan topsam bo‘ladi?",
    a: "“Nashrlar” arxivida barcha e’lon qilingan sonlar sana bo‘yicha saqlanadi va istalgan vaqt qayta ochish mumkin.",
  },
  {
    q: "O‘qish rejimi nima uchun kerak?",
    a: "Yorug‘lik sharoitiga qarab “Qog‘oz” va “Iliq qog‘oz” fonlari orasida almashtirib, ko‘zga yumshoqroq o‘qish tajribasini tanlashingiz mumkin.",
  },
];

const FAQ_RU = [
  {
    q: "Как работает NFC-газета?",
    a: "На обложке каждого печатного номера есть NFC-стикер. Поднесите телефон к стикеру — электронная версия этого номера автоматически откроется в браузере.",
  },
  {
    q: "Нужно ли устанавливать приложение?",
    a: "Нет. Система работает полностью через браузер — не требуется ни приложение, ни регистрация.",
  },
  {
    q: "Где найти прошлые номера?",
    a: "В архиве «Номера» хранятся все опубликованные выпуски по датам, их можно открыть в любое время.",
  },
  {
    q: "Зачем нужен режим чтения?",
    a: "В зависимости от освещения можно переключаться между фонами «Бумага» и «Тёплая бумага» для более комфортного чтения.",
  },
];

const FAQ_EN = [
  {
    q: "How does the NFC newspaper work?",
    a: "Every printed issue's cover carries an NFC sticker. Tap your phone on it and the digital edition of that exact issue opens automatically in your browser.",
  },
  {
    q: "Do I need to install an app?",
    a: "No. The whole system runs in the browser — no app and no sign-up required.",
  },
  {
    q: "Where can I find past issues?",
    a: "The Issues archive keeps every published edition by date, ready to reopen anytime.",
  },
  {
    q: "Why does the reading mode matter?",
    a: "Depending on the light, you can switch between the Paper and Warm Paper backgrounds for a gentler reading experience.",
  },
];

const FAQ_BY_LOCALE = { uz: FAQ_UZ, ru: FAQ_RU, en: FAQ_EN } as const;

const EYEBROW = {
  uz: "Savol-javob",
  ru: "Вопросы и ответы",
  en: "Questions & answers",
} as const;

const TITLE = {
  uz: "Ko‘p so‘raladigan savollar",
  ru: "Часто задаваемые вопросы",
  en: "Frequently asked questions",
} as const;

export function FaqSection() {
  const { locale } = useLocale();
  const items = FAQ_BY_LOCALE[locale];

  return (
    <section className="relative w-full overflow-hidden bg-paper-warm py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label">
            {EYEBROW[locale]}
          </span>
          <RevealHeading
            as="h2"
            className="font-display mt-3 text-3xl font-black leading-[1.05] text-[var(--gz-ink)] sm:text-4xl"
            text={TITLE[locale]}
          />
        </motion.div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              className="hairline-box rounded-sm p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              key={item.q}
              transition={{
                duration: 0.5,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <p className="masthead-label text-[var(--gz-ink)]">
                Q: {item.q}
              </p>
              <p className="font-body-serif mt-2.5 text-sm leading-6 text-[var(--gz-ink-soft)]">
                A: {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
