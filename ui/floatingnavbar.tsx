"use client";

import React from "react";
import { FloatingNav } from "../../../components/ui/floating-navbar";
import { IconArrowBackUp } from "@tabler/icons-react";

export function FloatingBackNav() {
  const navItems = [
    {
      name: "Back",
      link: "/",
      icon: (
        <IconArrowBackUp className="h-4 w-4 text-neutral-200 dark:text-white" />
      ),
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav
        navItems={navItems}
        className="rounded-full border border-white/15 bg-slate-900/70 backdrop-blur-md text-white"
      />
    </div>
  );
}