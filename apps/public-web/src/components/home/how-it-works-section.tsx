"use client";

import { motion } from "framer-motion";

import { RevealHeading } from "@/components/ui/reveal-heading";
import { useLocale } from "@/context/locale-context";

const STEPS: {
  numeral: string;
  titleKey: "howItWorks.step1Title" | "howItWorks.step2Title" | "howItWorks.step3Title";
  textKey: "howItWorks.step1Text" | "howItWorks.step2Text" | "howItWorks.step3Text";
}[] = [
  {
    numeral: "I.",
    titleKey: "howItWorks.step1Title",
    textKey: "howItWorks.step1Text",
  },
  {
    numeral: "II.",
    titleKey: "howItWorks.step2Title",
    textKey: "howItWorks.step2Text",
  },
  {
    numeral: "III.",
    titleKey: "howItWorks.step3Title",
    textKey: "howItWorks.step3Text",
  },
];

export function HowItWorksSection() {
  const { t } = useLocale();

  return (
    <section className="relative w-full overflow-hidden bg-paper-warm py-16 sm:py-20">
      <div className="paper-texture pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="editorial-label">
            {t("howItWorks.eyebrow")}
          </span>
          <RevealHeading
            as="h2"
            className="font-display mt-3 text-3xl font-black leading-[1.05] text-[var(--gz-ink)] sm:text-4xl"
            text={t("howItWorks.title")}
          />
          <p className="font-editorial mt-4 max-w-sm text-base italic leading-relaxed text-[var(--gz-ink-soft)]">
            NFC stikerdan bosma va elektron gazetani bir zumda bog‘laydigan
            uch bosqichli jarayon.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <motion.div
              className={`hairline-box rounded-sm p-6 ${
                index === 2 ? "sm:col-span-2" : ""
              }`}
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
              <span className="font-display text-lg font-black text-[var(--gz-ink)]">
                {step.numeral}
              </span>{" "}
              <span className="masthead-label text-[var(--gz-ink-soft)]">
                {t(step.titleKey)}
              </span>
              <p className="mt-3 text-sm leading-6 text-[var(--gz-ink-soft)]">
                {t(step.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
