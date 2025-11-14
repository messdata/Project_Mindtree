"use client";

import { motion, type AnimationControls } from "framer-motion";
import React, { useRef, useEffect } from "react";
import type { NodeModel } from "./types";

type Point = { x: number; y: number };

type MindMapNodeProps = {
  node: NodeModel;
  position: Point;
  animateCtrl: AnimationControls;
  index: number;
  onHoverChange?: (id: string | null) => void;
  onClick?: () => void;
  style?: string;
  onMeasure?: (id: string, size: { width: number; height: number }) => void;
};

export default function MindMapNode({
  node,
  position,
  animateCtrl,
  index,
  onHoverChange,
  onClick,
  onMeasure,
}: MindMapNodeProps) {
  const IconCmp = node.icon;
  const ref = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (onMeasure) onMeasure(node.id, { width: rect.width, height: rect.height });
  }, [ref.current]);

  return (
    <motion.div
      ref={ref}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.86 }}
      animate={animateCtrl}
      custom={index}
      onHoverStart={() => onHoverChange?.(node.id)}
      onHoverEnd={() => onHoverChange?.(null)}
    >
      <motion.button
        onClick={onClick ?? (() => { })}
        aria-label={node.aria ?? node.label}
        className="relative flex items-center justify-center rounded-full bg-neutral-900 text-white px-3 py-2 shadow-[0_0_8px_rgba(255,255,255,0.15)]"
        style={{ transform: `translate(${position.x}px, ${position.y}px)`, color: node.color }}
        whileHover={{ scale: 1.08, boxShadow: `0 0 14px ${node.color}66` }}
        whileTap={{ scale: 0.95 }}
      >
        {IconCmp && (
          <IconCmp
            size={18}
            strokeWidth={2}
            className="opacity-90"
            style={{ color: node.color }}
          />
        )}
        <span className="ml-1 font-medium text-sm opacity-90">{node.label}</span>
      </motion.button>
    </motion.div>
  );
}
