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
    <section className="relative w-full overflow-hidden bg-canvas py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--canvas-electric)]/40" />
        <span
          className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--canvas-electric)]/40"
          style={{ animationDelay: "0.9s" }}
        />
        <span
          className="nfc-wave absolute h-40 w-40 rounded-full border border-[var(--canvas-electric)]/40"
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
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--canvas-electric-soft)]">
            {t("howItWorks.eyebrow")}
          </span>
          <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("howItWorks.title")}
          </h2>
        </motion.div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:block" />

          {STEPS.map((step, index) => (
            <motion.div
              className="glass-card relative rounded-3xl p-6 text-center"
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
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--canvas-electric)] to-[var(--canvas-royal)] text-white shadow-[0_15px_35px_-10px_rgba(34,185,255,0.5)]">
                <Icon name={step.icon} size={26} />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] font-black text-[var(--canvas-navy)]">
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-5 text-lg font-black text-white">
                {t(step.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {t(step.textKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
