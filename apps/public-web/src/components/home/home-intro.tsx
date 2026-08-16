"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "temiryolchi_intro_seen";
const TITLE = "TEMIRYO‘LCHI";

type Phase = "paper" | "logo" | "type" | "slide" | "done";

export function HomeIntro() {
  const [phase, setPhase] = useState<Phase>("paper");
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let alreadySeen = false;

    try {
      alreadySeen =
        window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (reduceMotion || alreadySeen) {
      return;
    }

    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Unavailable sessionStorage is ignored.
    }

    const timers = [
      window.setTimeout(() => setShouldRender(true), 0),
      window.setTimeout(() => setPhase("logo"), 350),
      window.setTimeout(() => setPhase("type"), 950),
      window.setTimeout(() => setPhase("slide"), 2100),
      window.setTimeout(() => setPhase("done"), 2850),
    ];

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (!shouldRender || phase === "done") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{
          y: phase === "slide" ? "-100%" : "0%",
        }}
        aria-hidden="true"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-paper"
        initial={{ y: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="paper-texture pointer-events-none absolute inset-0 opacity-70" />

        <motion.span
          animate={{
            opacity: phase !== "paper" ? 1 : 0,
            scale: phase !== "paper" ? 1 : 0.82,
          }}
          className="relative h-16 w-16 sm:h-20 sm:w-20"
          initial={{ opacity: 0, scale: 0.82 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            alt="Temiryo‘lchi logotipi"
            className="object-contain"
            fill
            priority
            src="/images/temiryolchi-logo.png"
          />
        </motion.span>

        <div className="relative flex items-center">
          <h1 className="font-display flex overflow-hidden text-3xl font-black tracking-[0.08em] text-[var(--gz-ink)] sm:text-4xl">
            {TITLE.split("").map((letter, index) => (
              <motion.span
                animate={
                  phase === "type" ||
                  phase === "slide"
                    ? { opacity: 1, y: 0 }
                    : {}
                }
                initial={{ opacity: 0, y: 10 }}
                key={`${letter}-${index}`}
                transition={{
                  duration: 0.28,
                  delay: index * 0.055,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
          </h1>
          <motion.span
            animate={{
              opacity:
                phase === "type" ? [1, 0, 1] : 0,
            }}
            className="ml-1 h-6 w-[2px] bg-[var(--gz-bronze)] sm:h-8"
            transition={{
              duration: 0.9,
              repeat:
                phase === "type" ? Infinity : 0,
              ease: "linear",
            }}
          />
        </div>

        <motion.span
          animate={{
            opacity:
              phase === "type" || phase === "slide"
                ? 1
                : 0,
          }}
          className="editorial-label"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          Elektron gazeta
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
