"use client";

import { motion } from "framer-motion";

import { Icon, type IconName } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

const STEPS: {
  icon: IconName;
  titleKey:
    | "howItWorks.step1Title"
    | "howItWorks.step2Title"
    | "howItWorks.step3Title";
  textKey:
    | "howItWorks.step1Text"
    | "howItWorks.step2Text"
    | "howItWorks.step3Text";
}[] = [
  {
    icon: "nfc",
    titleKey: "howItWorks.step1Title",
    textKey: "howItWorks.step1Text",
  },
  {
    icon: "zoom-in",
    titleKey: "howItWorks.step2Title",
    textKey: "howItWorks.step2Text",
  },
  {
    icon: "book",
    titleKey: "howItWorks.step3Title",
    textKey: "howItWorks.step3Text",
  },
];

export function HowItWorksSection() {
  const { t } = useLocale();

  return (
    <section className="relative w-full overflow-hidden bg-paper py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--gz-navy)]/25" />
        <span
          className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--gz-navy)]/25"
          style={{ animationDelay: "0.9s" }}
        />
        <span
          className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--gz-navy)]/25"
          style={{ animationDelay: "1.8s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label justify-center">
            {t("howItWorks.eyebrow")}
          </span>
          <h2 className="font-display mt-3 text-3xl font-black leading-tight text-[var(--gz-ink)] sm:text-4xl lg:text-5xl">
            {t("howItWorks.title")}
          </h2>
        </motion.div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-[var(--gz-ink)]/12 to-transparent sm:block" />

          {STEPS.map((step, index) => (
            <motion.div
              className="paper-card relative rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              key={step.titleKey}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-60px" }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--gz-navy)] to-[var(--gz-navy-deep)] text-white shadow-[0_15px_35px_-10px_rgba(22,58,99,0.5)]">
                <Icon name={step.icon} size={26} />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--gz-bronze)] text-[11px] font-black text-white">
                  {index + 1}
                </span>
              </span>
              <h3 className="font-display mt-5 text-lg font-black text-[var(--gz-ink)]">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--gz-ink-soft)]">
                {t(step.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
