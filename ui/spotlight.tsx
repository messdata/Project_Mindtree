"use client";
import React from "react";
// NOTE: You must ensure this path and component name are correct in your project.
import { Spotlight } from "@/components/ui/spotlight-new";

type SpotlightBackgroundProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * SpotlightBackground
 * Renders the dark background, grid, and the Spotlight effect
 * behind the content provided in 'children'.
 */
export default function SpotlightBackground({ children, className = "" }: SpotlightBackgroundProps) {
  return (
    // Base container, inheriting the background styles from the example
    <div className={`
        relative 
        w-full 
        overflow-hidden 
        bg-black/[0.76] 
        antialiased 
        bg-grid-white/[10] 
        ${className} 
      `}
    >
      {/* 1. The Spotlight component for the visual effect */}
      {/* We need to ensure the Spotlight itself is positioned absolutely 
          and covers the background area, similar to the original demo's structure.
          I'm using the original component name from your example: <Spotlight />
      */}
      <div aria-hidden="true" className="absolute inset-0">
        <Spotlight />
      </div>

      {/* 2. The Foreground slot for the Hero content (Title, Button, etc.) */}
      {/* We apply z-10 to ensure the children sit above the background and spotlight. */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}