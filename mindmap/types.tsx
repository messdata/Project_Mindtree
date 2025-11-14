// types.ts

import type React from "react";

export type IconCmp = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export type NodeStyle = {
  radiusPx: number;          // button radius or min width
  glow: boolean;             // node-specific halo
  gradientFrom?: string;     // link gradient override
  gradientTo?: string;
};

export type NodeModel = {
  id: string;
  label: string;
  color: string;
  icon?: IconCmp;
  aria?: string;             // a11y label, used by buttons/links
  route?: string;
  style?: Partial<NodeStyle>;
};