"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface RevealHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}

/**
 * Scroll-triggered, word-by-word reveal — the signature heading
 * animation from the reference masthead template.
 */
export function RevealHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: RevealHeadingProps): ReactNode {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: 14 }}
          key={`${word}-${index}`}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
