"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  phrases: string[];
  intervalMs?: number;
  className?: string;
};

export default function RotatingTypewriter({
  phrases,
  intervalMs = 1800,
  className = "",
}: Props) {
  const [index, setIndex] = React.useState(0);
  const prefersReduced = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  React.useEffect(() => {
    if (!phrases?.length || prefersReduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs);
    return () => clearInterval(id);
  }, [phrases, intervalMs, prefersReduced]);

  if (!phrases?.length) return null;

  const text = phrases[index];

  if (prefersReduced) {
    return (
      <span className={`inline-block align-middle ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <span 
      aria-live="polite"
      aria-atomic
      className={`inline-block align-middle ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ 
            opacity: 0, 
            y: 20,
            filter: "blur(4px)"
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            filter: "blur(0px)"
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            filter: "blur(4px)"
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}