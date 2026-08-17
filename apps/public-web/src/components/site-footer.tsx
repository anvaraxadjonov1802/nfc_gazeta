"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/context/locale-context";

interface SiteFooterProps {
  onOpenAccessibility: () => void;
}

export function SiteFooter({
  onOpenAccessibility,
}: SiteFooterProps) {
  const { locale, t } = useLocale();
  const year = new Date().getFullYear();
  const goToTopLabel =
    locale === "en"
      ? "Go to top"
      : locale === "ru"
        ? "Наверх"
        : "Yuqoriga";

  const mastheadRoles: { role: string; name: string }[] = [
    { role: t("footer.editorInChief"), name: "Rustam Haydarov" },
    { role: t("footer.dutyEditor"), name: "Dilrabo Tolipova" },
    { role: t("footer.proofreader"), name: "Umida To‘ychiboyeva" },
    { role: t("footer.photoCorrespondent"), name: "Yoqubjon Murotov" },
    { role: t("footer.layoutDesigner"), name: "Gulzoda Boltayeva" },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden bg-[var(--gz-navy-deep)] text-white/70"
      id="masthead"
    >
      <div aria-hidden="true" className="h-[3px] w-full bg-white/80" />

      <div className="rail-lines pointer-events-none absolute inset-0 opacity-10" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8 border-b border-white/10 pb-10">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 shrink-0">
              <Image
                alt="Temiryo‘lchi logotipi"
                className="object-contain"
                fill
                src="/images/temiryolchi-logo.png"
              />
            </span>
            <div>
              <strong className="block font-display text-xl font-black text-white">
                Temiryo‘lchi
              </strong>
              <small className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--gz-bronze-soft)]">
                {t("footer.official")} · {t("footer.issueLabel")}
              </small>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.1em]">
            <Link
              className="transition hover:text-[var(--gz-bronze-soft)]"
              href="/"
            >
              {t("footer.home")}
            </Link>
            <Link
              className="transition hover:text-[var(--gz-bronze-soft)]"
              href="/arxiv"
            >
              {t("footer.archive")}
            </Link>
            <button
              className="transition hover:text-[var(--gz-bronze-soft)]"
              onClick={onOpenAccessibility}
              type="button"
            >
              {t("footer.accessibility")}
            </button>
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-white/50">
              <Icon
                className="text-[var(--gz-bronze-soft)]"
                name="nfc"
                size={14}
              />
              {t("footer.nfcTitle")}
            </span>
          </div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="editorial-label text-white/50 before:bg-[var(--gz-bronze-soft)]">
              {t("footer.masthead")}
            </span>
            <ul className="mt-4 space-y-2 text-[13px] leading-6 text-white/70">
              {mastheadRoles.map((entry) => (
                <li key={entry.role}>
                  <span className="text-white/45">
                    {entry.role}:
                  </span>{" "}
                  <span className="font-semibold text-white/85">
                    {entry.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="editorial-label text-white/50 before:bg-[var(--gz-bronze-soft)]">
              {t("footer.founders")}
            </span>
            <ul className="mt-4 space-y-3 text-[13px] leading-6 text-white/70">
              <li>“O‘zbekiston temir yo‘llari” aksiyadorlik jamiyati</li>
              <li>
                O‘zbekiston temiryo‘lchilari va transport quruvchilari
                kasaba uyushmasi Respublika Kengashi
              </li>
            </ul>
          </div>

          <div>
            <span className="editorial-label text-white/50 before:bg-[var(--gz-bronze-soft)]">
              {t("footer.address")}
            </span>
            <p className="mt-4 text-[13px] leading-6 text-white/70">
              100047, Toshkent sh.,
              <br />
              Amir Temur shohko‘chasi, 4-uy
            </p>
            <span className="editorial-label mt-5 text-white/50 before:bg-[var(--gz-bronze-soft)]">
              {t("footer.phone")}
            </span>
            <p className="mt-2 text-[13px] font-semibold leading-6 text-white/85">
              +998 71 236-48-54
            </p>
          </div>

          <div>
            <span className="editorial-label text-white/50 before:bg-[var(--gz-bronze-soft)]">
              {t("footer.registration")}
            </span>
            <p className="mt-4 text-[13px] leading-6 text-white/70">
              O‘zbekiston Matbuot va axborot agentligida 0139-raqam
              bilan 2007-yil 11-yanvarda ro‘yxatga olingan.
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex min-h-12 w-full max-w-7xl flex-col justify-center gap-1.5 px-4 py-4 text-[10px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {year} Temiryo‘lchi. {t("footer.rights")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="shield" size={13} />
            {t("footer.official")}
          </span>
        </div>
      </div>

      <a
        className="group relative flex flex-col items-center gap-1.5 py-8 text-white/50 transition hover:text-white/85"
        href="#top"
      >
        <svg
          className="go-to-top-doodle h-6 w-6 stroke-current transition group-hover:-translate-y-1"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="M12 19V5M6 10l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="masthead-label text-white/50">
          {goToTopLabel}
        </span>
      </a>
    </footer>
  );
}
