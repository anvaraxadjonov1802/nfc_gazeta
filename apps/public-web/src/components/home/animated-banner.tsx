"use client";

/* eslint-disable @next/next/no-img-element */

import { useLocale } from "@/context/locale-context";

export function AnimatedBanner() {
  const { t } = useLocale();

  return (
    <section className="hero-train-banner" aria-label="Jaloliddin Manguberdi tezyurar poyezdi">
      <img
        className="hero-train-banner__photo"
        src="/images/jaloliddin-manguberdi-hero.webp"
        alt="Jaloliddin Manguberdi tezyurar poyezdi"
        loading="eager"
      />

      <div className="hero-train-banner__speed-lines" aria-hidden="true" />
      <div className="hero-train-banner__rail-glow" aria-hidden="true" />
      <div className="hero-train-banner__shade" aria-hidden="true" />
      <div className="hero-train-banner__vignette" aria-hidden="true" />

      <div className="hero-train-banner__content">
        <span className="hero-train-banner__tag">
          {t("banner.tag")}
        </span>

        <h2 className="hero-train-banner__title">
          {t("banner.title")}
        </h2>

        <p className="hero-train-banner__subtitle">
          {t("banner.subtitle")}
        </p>
      </div>

      <div className="hero-train-banner__train-label" aria-hidden="true">
        <span className="hero-train-banner__train-dot" />
        Jaloliddin Manguberdi
      </div>
    </section>
  );
}
