"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ProfileContextValue {
  name: string;
  setName: (name: string) => void;
  initial: string;
}

const STORAGE_KEY = "temiryolchi_profile_name";

const ProfileContext =
  createContext<ProfileContextValue | null>(null);

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [name, setNameState] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      return (
        window.localStorage.getItem(STORAGE_KEY) ?? ""
      );
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, name);
    } catch {
      // Unavailable localStorage is ignored.
    }
  }, [name]);

  const value = useMemo<ProfileContextValue>(() => {
    const trimmed = name.trim();

    return {
      name,
      setName: setNameState,
      initial: trimmed
        ? trimmed[0]!.toUpperCase()
        : "T",
    };
  }, [name]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside ProfileProvider.",
    );
  }

  return context;
}
