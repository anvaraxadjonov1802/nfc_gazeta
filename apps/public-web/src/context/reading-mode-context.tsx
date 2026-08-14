"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ReadingMode = "paper" | "white" | "night";

interface ReadingModeContextValue {
  mode: ReadingMode;
  setMode: (mode: ReadingMode) => void;
}

const STORAGE_KEY = "temiryolchi_reading_mode";

const ReadingModeContext =
  createContext<ReadingModeContextValue | null>(null);

function isReadingMode(
  value: unknown,
): value is ReadingMode {
  return (
    value === "paper" ||
    value === "white" ||
    value === "night"
  );
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

    root.classList.remove(
      "mode-white",
      "mode-night",
    );

    if (mode !== "paper") {
      root.classList.add(`mode-${mode}`);
    }

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
