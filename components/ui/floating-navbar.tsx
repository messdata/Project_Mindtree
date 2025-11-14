"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollY } = useScroll();       // Use pixel scroll position
  const [visible, setVisible] = useState(true);  // Start visible
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      const diff = current - lastY;        // >0 = scrolling down, <0 = scrolling up
      const delta = Math.abs(diff);

      if (current < 50) {
        // Near the very top: keep it visible
        setVisible(true);
      } else if (delta > 2) {
        if (diff > 0) {
          // Scrolling down → reveal
          setVisible(true);
        } else {
          // Scrolling up → hide
          setVisible(false);
        }
      }

      setLastY(current);
    }
  });

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -120 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -120 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed top-6 inset-x-0 mx-auto z-[5000] max-w-fit",
            "bg-white/10 dark:bg-black/30 backdrop-blur-lg -webkit-backdrop-filter border border-white/20 dark:border-black/40 rounded-xl shadow-lg px-6 py-3 flex items-center justify-center space-x-4",
            className
          )}
        >
          {navItems.map((item, idx) => (
            <a
              key={`nav-${idx}`}
              href={item.link}
              className={cn(
                "flex items-center space-x-1 text-white dark:text-white transition hover:text-neutral-200",
                idx === 0 && "ml-0"
              )}
            >
              {item.icon && <span className="block sm:hidden">{item.icon}</span>}
              <span className="hidden sm:block text-sm">{item.name}</span>
            </a>
          ))}
          <button className="border text-sm font-medium border-neutral-500 dark:border-white/[0.7] text-white dark:text-white px-4 py-2 rounded-full">
            <span>Login</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};