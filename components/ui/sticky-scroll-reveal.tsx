"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  fullScreen = false,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
  fullScreen?: boolean;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // track the internal scroll container (the root motion.div)
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  const containerClass = fullScreen
    ? "relative flex h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth rounded-md p-10"
    : "relative flex h-[30rem] overflow-y-auto rounded-md p-10";

  const sectionClass = fullScreen
    ? "h-screen snap-start flex items-center justify-between gap-12"
    : "my-20 flex items-start justify-between gap-8";

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) =>
      cardLength > 1 ? index / (cardLength - 1) : 0
    );
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#4b5979ff",
    "#ea7373ff",
    "#171717",
  ];
  const linearGradients = [
    "linear-gradient(to bottom right, #050606ff, #0e100fff)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className={containerClass}
      ref={ref}
    >
      <div className="relative mx-auto flex w-full max-w-7xl">
        <div className="w-full lg:w-[58%] max-w-3xl px-4">
          {content.map((item, index) => (
            <section key={item.title + index} className={sectionClass}>
              <div className="w-full">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.4 }}
                  className="text-2xl md:text-3xl font-bold text-white"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.4 }}
                  className="mt-4 max-w-xl text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-line"
                >
                  {item.description}
                </motion.p>
              </div>
            </section>
          ))}
        </div>
        <div
          style={{ background: backgroundGradient }}
          className={cn(
            "sticky top-[20%] overflow-y-hidden h-20 w-40 rounded-md bg-white lg:block",
            contentClassName,
          )}
        >
          {content[activeCard].content ?? null}
        </div>
      </div>
    </motion.div>
  );
};
