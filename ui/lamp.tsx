"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * Lamp
 * Background spotlight/glow container that renders behind children.
 * Place interactive content as children; glow stays underneath.
 */
type LampProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Lamp({ children, className = "" }: LampProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" aria-hidden="true" />

      {/* Soft radial glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(227, 227, 227, 0.45), rgba(237, 229, 229, 0.12) 55%, rgba(234, 237, 241, 0) 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Subtle beam under the button */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        className="pointer-events-none absolute left-1/2 top-[56%] h-12 w-[44rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.6), rgba(59,130,246,0.15) 60%, rgba(15,23,42,0) 75%)",
          filter: "blur(10px)",
        }}
      />

      {/* Foreground slot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}