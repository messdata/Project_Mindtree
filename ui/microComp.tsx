"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollOrchestrator
 * - Observes a target section by id.
 * - Emits optional window events on enter/leave (map:start / map:collapse or custom).
 * - Renders a self-hiding scroll hint bubble when desired.
 *
 * Usage (Hero/Welcome):
 * <ScrollOrchestrator
 *   targetId="mindmap_section"
 *   showHint
 *   hintText="Scroll Down ↓"
 *   showWhen="out"
 *   onEnterEvent="map:start"
 * />
 *
 * Usage (MindMap section if you want an "Up" hint):
 * <ScrollOrchestrator
 *   targetId="mindmap_section"
 *   showHint
 *   hintText="Scroll Up ↑"
 *   showWhen="in"
 *   onLeaveEvent="map:collapse"
 * />
 */
export type ScrollOrchestratorProps = {
  /** DOM id of the section we observe (e.g., "mindmap_section") */
  targetId: string;

  /** Whether to draw a hint bubble */
  showHint?: boolean;
  /** Hint copy */
  hintText?: string;
  /**
   * When the hint should be visible relative to target visibility:
   *  - "out": show while target is NOT in view (default)
   *  - "in":  show while target IS in view
   */
  showWhen?: "in" | "out";

  /** IntersectionObserver threshold (0..1 or array) */
  threshold?: number | number[];
  /** Observer root margin (e.g., "0px 0px -10% 0px") */
  rootMargin?: string;

  /** Optional window event names to dispatch */
  onEnterEvent?: string;   // e.g., "map:start"
  onLeaveEvent?: string;   // e.g., "map:collapse"

  /** Optional classnames */
  containerClassName?: string; // wrapper for the hint
  hintClassName?: string;      // the bubble itself
};

export default function ScrollOrchestrator({
  targetId,
  showHint = true,
  hintText = "Scroll Down ↓",
  showWhen = "out",
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  onEnterEvent,
  onLeaveEvent,
  containerClassName,
  hintClassName,
}: ScrollOrchestratorProps) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const nowInView = !!entry?.isIntersecting;
        setInView(nowInView);

        // Fire optional global events so other modules can react
        if (nowInView && onEnterEvent) {
          window.dispatchEvent(new Event(onEnterEvent));
        } else if (!nowInView && onLeaveEvent) {
          window.dispatchEvent(new Event(onLeaveEvent));
        }
      },
      { threshold, root: null, rootMargin }
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [targetId, threshold, rootMargin, onEnterEvent, onLeaveEvent]);

  const shouldShow = showWhen === "in" ? inView : !inView;

  if (!showHint || !hintText) return null;
  if (!shouldShow) return null;

  return (
    <div
      className={
        containerClassName ??
        "fixed inset-x-0 bottom-6 z-20 flex justify-center pointer-events-none select-none"
      }
      aria-hidden="true"
    >
      <div
        className={
          hintClassName ??
          "rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md border border-white/15 shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]"
        }
      >
        {hintText}
      </div>
    </div>
  );
}