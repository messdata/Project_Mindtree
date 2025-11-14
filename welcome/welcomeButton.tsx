"use client";

import React from "react";
import { motion } from "framer-motion";
import RotatingTypewriter from "./RotatingTypewriter";

type Props = {
  targetId?: string;
  onAfterScroll?: () => void;
  className?: string;
};

const LANG_WELCOME = [
  "WELCOME", "bienvenido", "bienvenue", "willkommen", "benvenuto"
];

export default function WelcomeButton({
  targetId = "mindtree",
  onAfterScroll,
  className = ""
}: Props) {
  const [isHovered, setIsHovered] = React.useState(false);

  const onClick = React.useCallback(() => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    try { window.dispatchEvent(new Event("map:arm")); } catch { }
    onAfterScroll?.();
  }, [targetId, onAfterScroll]);

  return (
    <div className={`relative mx-auto w-fit ${className}`}>
      {/* Outer Rotating Ring with enhanced glow */}
      <motion.div
        aria-hidden="true"
        initial={{ rotate: 0 }}
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "linear"
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          maskImage: "radial-gradient(circle at center, black 58%, transparent 60%)",
        }}
      >
        <motion.div
          animate={{
            opacity: isHovered ? [0.6, 0.9, 0.6] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(240, 239, 237, 0.9) 0%, rgba(187, 187, 183, 0) 60%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* Pulsing secondary ring */}
      <motion.div
        aria-hidden="true"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-400/30"
      />

      {/* CTA button with enhanced animations */}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 40px rgba(246, 246, 246, 0.6)"
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
        aria-label="Enter – scroll to MindTree"
        className="group relative grid h-32 w-32 place-items-center rounded-full 
                   border-2 border-yellow-400 bg-black/50 backdrop-blur-md 
                   transition-all duration-300 ease-in-out
                   focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/50"
      >
        {/* Inner glow effect */}
        <motion.div
          animate={{
            opacity: isHovered ? [0.2, 0.4, 0.2] : 0.1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-2 rounded-full bg-gradient-radial from-yellow-400/20 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{
              y: isHovered ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-base font-bold text-yellow-300"
          >
            <RotatingTypewriter phrases={LANG_WELCOME} className="text-base" />
          </motion.div>
        </div>

        <div className="sr-only">Welcome – click to continue</div>
      </motion.button>
    </div>
  );
}