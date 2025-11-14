"use client";

import React from "react";
import MindMapStage1 from "./MindMapStage1";
import { SparklesCore } from "@/components/ui/sparkles";

export default function MindMapPage() {
  return (
    <section
      id="mindtree"
      className="relative min-h-dvh overflow-hidden bg-black text-white"
    >

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          "--haloX": "335px",
          "--haloY": "335px",
          WebkitMaskImage:
            "radial-gradient(var(--haloX) var(--haloY) at 50% 50%, rgba(230, 226, 226, 1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 50%)",
          maskImage:
            "radial-gradient(var(--haloX) var(--haloY) at 50% 50%, rgba(232, 223, 223, 1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 70%)",
        } as React.CSSProperties}
      >
        <SparklesCore
          background="transparent"
          minSize={0.25}
          maxSize={1.9}
          particleDensity={1200}
          particleColor="#f4f5f2ff"
          className="w-full h-full"
        />

      </div>
      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 grid place-items-center min-h-dvh">

        <MindMapStage1 />
      </div>
    </section>

  );
}