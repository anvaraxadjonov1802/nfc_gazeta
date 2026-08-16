"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ReadingMode = "paper" | "warm";

interface ReadingModeContextValue {
  mode: ReadingMode;
  setMode: (mode: ReadingMode) => void;
  toggle: () => void;
}

const STORAGE_KEY = "temiryolchi_reading_mode";

const ReadingModeContext =
  createContext<ReadingModeContextValue | null>(null);

function isReadingMode(
  value: unknown,
): value is ReadingMode {
  return value === "paper" || value === "warm";
}

export function ReadingModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setModeState] =
    useState<ReadingMode>(() => {
      if (typeof window === "undefined") {
        return "paper";
      }

      try {
        const saved = window.localStorage.getItem(
          STORAGE_KEY,
        );

        if (isReadingMode(saved)) {
          return saved;
        }
      } catch {
        // Unavailable localStorage is ignored.
      }

      return "paper";
    });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      "reading-warm",
      mode === "warm",
    );

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        mode,
      );
    } catch {
      // Unavailable localStorage is ignored.
    }
  }, [mode]);

  const value = useMemo<ReadingModeContextValue>(
    () => ({
      mode,
      setMode: (next) => setModeState(next),
      toggle: () =>
        setModeState((current) =>
          current === "paper" ? "warm" : "paper",
        ),
    }),
    [mode],
  );

  return (
    <ReadingModeContext.Provider value={value}>
      {children}
    </ReadingModeContext.Provider>
  );
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext);

  if (!context) {
    throw new Error(
      "useReadingMode must be used inside ReadingModeProvider.",
    );
  }

  return context;
}
