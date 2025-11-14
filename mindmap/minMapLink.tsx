"use client";

import { motion } from "framer-motion";
import React from "react";
import type { NodeModel } from "./types";

type AnimationControls = ReturnType<typeof import("framer-motion").useAnimation>;

type Point = { x: number; y: number };

type MindMapLinkProps = {
  hub: Point;
  node: NodeModel;
  nodePos: Point;
  index: number;
  animateCtrl: AnimationControls;
  hoveredId?: string | null;
  curveFactor?: number;
  show?: boolean;
  speedMs?: number;
  edgeMargin?: number;
  delayMs?: number;
  measuredWidth?: number;
  measuredHeight?: number;
};

export default function MindMapLink({
  hub,
  node,
  nodePos,
  index,
  animateCtrl,
  hoveredId,
  curveFactor = 0.5,
  show = true,
  speedMs = 800,
  edgeMargin: edgeMarginProp = 0,
  delayMs = 0,
  measuredWidth,
  measuredHeight,
}: MindMapLinkProps) {
  const dx = nodePos.x - hub.x;
  const dy = nodePos.y - hub.y;

  const baseLen = Math.hypot(dx, dy) || 1;

  const unitDx = dx / baseLen;
  const unitDy = dy / baseLen;
  const perpDx = -unitDy;
  const perpDy = unitDx;

  const fallbackCharW = 7;
  const fallbackIconW = 16;
  const fallbackPadX = 32;
  const approxW = fallbackIconW + fallbackPadX + (node.label?.length || 0) * fallbackCharW;

  const hw = (measuredWidth ? measuredWidth / 2 : Math.max(48, approxW / 2));
  const hh = (measuredHeight ? measuredHeight / 2 : 22);

  const eps = 1e-4;

  const alongX = hw / Math.max(Math.abs(unitDx), eps);
  const alongY = hh / Math.max(Math.abs(unitDy), eps);
  const distToEdge = Math.min(alongX, alongY);

  const edgeMargin = edgeMarginProp;

  const endInset = distToEdge + edgeMargin;
  const endLen = Math.max(0, baseLen - endInset);

  // --- Dynamic Curve Factor ---
  const angle = Math.atan2(dy, dx);
  const dynamicCurveFactor = curveFactor * (1 + 0.5 * Math.abs(Math.sin(2 * angle)));

  const cp1Dist = endLen / 3;
  const cp2Dist = (endLen * 2) / 3;
  const offset = baseLen * dynamicCurveFactor * 0.5;

  const cx1 = hub.x + unitDx * cp1Dist + perpDx * offset;
  const cy1 = hub.y + unitDy * cp1Dist + perpDy * offset;

  const cx2 = hub.x + unitDx * cp2Dist + perpDx * offset;
  const cy2 = hub.y + unitDy * cp2Dist + perpDy * offset;

  const ex = hub.x + unitDx * endLen;
  const ey = hub.y + unitDy * endLen;
  const d = `M ${hub.x} ${hub.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${ex} ${ey}`;

  const isActive = hoveredId === node.id || hoveredId == null;
  const strokeOpacity = hoveredId ? (isActive ? 1 : 0.2) : 0.55;
  const strokeWidth = isActive ? 2.6 : 1.8;

  const gradId = `grad-${node.id}`;
  const glowId = `glow-${node.id}`;
  const delaySec = delayMs / 1000;
  const durationSec = speedMs / 1000;

  return (
    <>
      <defs>
        <linearGradient id={gradId} x1={hub.x} y1={hub.y} x2={ex} y2={ey} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="60%" stopColor={node.color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={node.color} stopOpacity="0.95" />
        </linearGradient>

        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow layer */}
      <motion.path
        d={d}
        fill="none"
        stroke={node.color}
        strokeOpacity={0.1}
        strokeWidth={7}
        strokeLinecap="round"
        pathLength={1}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
        animate={show ? {
          strokeDashoffset: 0,
          opacity: 0.4,
        } : {
          strokeDashoffset: 1,
          opacity: 0
        }}
        transition={{
          duration: durationSec,
          ease: "easeOut",
          delay: delaySec + 0.06,
        }}
        filter={`url(#${glowId})`}
      />

      {/* Main link path with gradient */}
      <motion.path
        id={`link-${node.id}`}
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeWidth={hoveredId === node.id ? 2.8 : strokeWidth}
        initial={{ strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }}
        animate={show ? {
          strokeDashoffset: 0,
          opacity: strokeOpacity
        } : {
          strokeDashoffset: 1,
          opacity: 0
        }}
        transition={{
          duration: durationSec,
          ease: [0.22, 1, 0.36, 1],
          delay: delaySec,
        }}
        filter={`url(#${glowId})`}
      />

      {/* Hover particle flow */}
      {show && hoveredId === node.id && (
        <motion.path
          d={d}
          fill="none"
          stroke={node.color}
          strokeLinecap="round"
          pathLength={1}
          strokeWidth={1.2}
          initial={{ strokeDasharray: "0.04 0.96", strokeDashoffset: 0, opacity: 0 }}
          animate={{
            strokeDashoffset: [-1, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      )}
    </>
  );
}