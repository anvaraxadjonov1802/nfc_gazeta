"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_LOCALE,
  type Locale,
  LOCALES,
  translate,
  type TranslationKey,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY = "temiryolchi_locale";

const LocaleContext =
  createContext<LocaleContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    LOCALES.some((entry) => entry.code === value)
  );
}

export function LocaleProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocaleState] =
    useState<Locale>(() => {
      if (typeof window === "undefined") {
        return DEFAULT_LOCALE;
      }

      try {
        const saved = window.localStorage.getItem(
          STORAGE_KEY,
        );

        if (isLocale(saved)) {
          return saved;
        }
      } catch {
        // Unavailable localStorage is ignored.
      }

      return DEFAULT_LOCALE;
    });

  useEffect(() => {
    document.documentElement.lang = locale;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        locale,
      );
    } catch {
      // Unavailable localStorage is ignored.
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => setLocaleState(next),
      t: (key) => translate(locale, key),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error(
      "useLocale must be used inside LocaleProvider.",
    );
  }

  return context;
}
