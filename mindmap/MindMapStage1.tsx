"use client";

import { motion, useAnimationControls, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    FolderKanban,
    FileText,
    UserRound,
    MessagesSquare,
    Settings,
} from "lucide-react";
import type { NodeModel } from "./types";
import MindMapLink from "./minMapLink";

function useContainerDimensions() {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    useLayoutEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver((entries) => {
            const { contentRect } = entries[0];
            setDimensions({
                width: contentRect.width,
                height: contentRect.height,
            });
        });

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, dimensions };
}

type PositionedNode = NodeModel & { x: number; y: number };

const HUB = { x: 0, y: 0, r: 56, label: "Explore" };

// SIMPLIFIED: Removed Contact micro-nodes logic
const baseNodes: NodeModel[] = [
    { id: "contact", label: "Contact", color: "#78e08f", icon: MessagesSquare, aria: "Get in Touch" },
    { id: "about", label: "About", color: "#ffd166", icon: UserRound, aria: "Learn About Me" },
    { id: "projects", label: "Projects", color: "#ff6b6b", icon: FolderKanban, aria: "Open Projects" },
    { id: "cv", label: "Resume", color: "#cfd8e3", icon: FileText, aria: "View CV" },
];

function generateRadialNodes(radius: number): PositionedNode[] {
    return baseNodes.map((node, i) => {
        const angle = (2 * Math.PI * i) / baseNodes.length;
        return {
            ...node,
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };
    });
}

type HubButtonProps = {
    label: string;
    icon: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    expanded?: boolean;
    motionProps?: any;
};

const HubButton = ({ label, icon, onClick, expanded = false, motionProps = {} }: HubButtonProps) => (
    <motion.button
        type="button"
        aria-label="Hub"
        onClick={onClick}
        {...motionProps}
        style={{
            width: HUB.r * 2,
            height: HUB.r * 2,
            minWidth: HUB.r * 2,
            minHeight: HUB.r * 2,
            borderColor: "#ffffff",
            padding: 0,
        }}
        className="relative flex items-center justify-center space-x-2 bg-neutral-900/40 backdrop-blur-lg border border-white/10 hover:border-white/30 shadow-md text-white rounded-full overflow-hidden"
    >
        {/* Animated gradient background */}
        <motion.div
            className="absolute inset-0 rounded-full opacity-20"
            animate={{
                background: expanded
                    ? [
                        "radial-gradient(circle at 20% 50%, #ff6b6b 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, #78e08f 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 20%, #ffd166 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 80%, #cfd8e3 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, #ff6b6b 0%, transparent 50%)",
                    ]
                    : "radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)"
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsing ring when expanded */}
        {expanded && (
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.35, 0, 0.35],
                }}
                transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        )}

        <motion.span
            animate={expanded ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10"
        >
            {icon}
        </motion.span>
        <span className="relative z-10 text-lg font-bold text-white">
            {label}
        </span>
    </motion.button>
);

export default function MindMapStage1() {
    const { ref: containerRef, dimensions } = useContainerDimensions();

    const router = useRouter();

    const hubCtrl = useAnimationControls();
    const linkCtrl = useAnimationControls();
    const nodeCtrl = useAnimationControls();

    const [expanded, setExpanded] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [armed, setArmed] = useState(false);
    const [nodeSizes, setNodeSizes] = useState<Record<string, { width: number; height: number }>>({});
    const sizeObservers = useRef<Record<string, ResizeObserver>>({});

    const getNodeRef = useCallback((id: string) => {
        return (el: HTMLElement | null) => {
            sizeObservers.current[id]?.disconnect();
            delete sizeObservers.current[id];

            if (!el) return;

            const rect = el.getBoundingClientRect();
            setNodeSizes(prev => ({ ...prev, [id]: { width: rect.width, height: rect.height } }));

            const ro = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const cr = entry.contentRect;
                    setNodeSizes(prev => {
                        const cur = prev[id];
                        if (cur && cur.width === cr.width && cur.height === cr.height) return prev;
                        return { ...prev, [id]: { width: cr.width, height: cr.height } };
                    });
                }
            });
            ro.observe(el);
            sizeObservers.current[id] = ro;
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 85%", "center 50%"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (!armed) return;
        if (v < 0.05 && expanded) {
            collapse();
        }
    });

    const radius = useMemo(() => {
        const { width, height } = dimensions;
        return Math.min(width, height) * 0.25;
    }, [dimensions]);

    const NODES: PositionedNode[] = useMemo(() => generateRadialNodes(radius), [radius]);

    const linkLens = useMemo(() => NODES.map((n) => Math.hypot(n.x - HUB.x, n.y - HUB.y) * 1.4), [NODES]);

    useEffect(() => {
        linkCtrl.set(() => ({
            strokeDasharray: 1,
            strokeDashoffset: 1,
        }));
        nodeCtrl.set({ x: 0, y: 0, opacity: 0, scale: 0.8 });
        hubCtrl.set({ scale: 1, opacity: 1 });
    }, [linkCtrl, nodeCtrl, hubCtrl, linkLens]);

    useEffect(() => {
        const onArm = () => setArmed(true);
        const onDisarm = () => setArmed(false);
        window.addEventListener("map:arm", onArm);
        window.addEventListener("map:disarm", onDisarm);
        return () => {
            window.removeEventListener("map:arm", onArm);
            window.removeEventListener("map:disarm", onDisarm);
        };
    }, []);

    const expand = useCallback(async () => {
        setExpanded(true);

        await hubCtrl.start({
            scale: [1, 1.03, 1],
            transition: { duration: 0.24, ease: "easeOut" }
        });

        await linkCtrl.start((i) => ({
            strokeDasharray: 1,
            strokeDashoffset: 0,
            transition: {
                duration: 0.38,
                ease: "easeOut",
                delay: i * 0.04,
            },
        }));

        nodeCtrl.start((i) => ({
            x: NODES[i].x,
            y: NODES[i].y,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.32, ease: "easeOut", delay: i * 0.05 },
        }));
    }, [hubCtrl, linkCtrl, nodeCtrl, NODES]);

    const collapse = useCallback(async () => {
        setExpanded(false);

        await nodeCtrl.start((i) => ({
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.18,
                ease: "easeInOut",
                delay: (NODES.length - 1 - i) * 0.025,
            },
        }));

        linkCtrl.start(() => ({
            strokeDashoffset: 1,
            transition: { duration: 0.22, ease: "easeIn" },
        }));
    }, [linkCtrl, nodeCtrl, NODES.length]);

    const onExploreClick = () => {
        if (!armed) setArmed(true);
        if (!expanded) {
            expand();
        } else {
            collapse();
        }
    };

    const handleNodeClick = (id: string) => {
        if (id === "about") {
            router.push("/components/about");
            return;
        }
        if (id === "projects") {
            router.push("/components/projects");
            return;
        }
        if (id === "cv") {
            router.push("/components/cv");
            return;
        }
        if (id === "contact") {
            router.push("/components/contact");
            return;
        }
    };

    return (
        <div id="mindmap_section" ref={containerRef} className="relative w-full h-screen overflow-hidden">

            {/* SVG Links Layer - Only main nodes */}
            <svg className="absolute inset-0 w-full h-full" viewBox={`-${dimensions.width / 2} -${dimensions.height / 2} ${dimensions.width} ${dimensions.height}`}>
                {NODES.map((n, i) => (
                    <MindMapLink
                        key={`link-${n.id}`}
                        hub={HUB}
                        node={n}
                        nodePos={{ x: n.x, y: n.y }}
                        index={i}
                        animateCtrl={linkCtrl}
                        edgeMargin={0}
                        hoveredId={hoveredId}
                        curveFactor={0.5}
                        show={expanded}
                        measuredWidth={nodeSizes[n.id]?.width}
                        measuredHeight={nodeSizes[n.id]?.height}
                    />
                ))}
            </svg>

            {/* Hub Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <HubButton
                    label={HUB.label}
                    icon={<Settings size={24} strokeWidth={2} />}
                    onClick={onExploreClick}
                    expanded={expanded}
                    motionProps={{
                        animate: hubCtrl,
                        whileHover: {
                            scale: 1.05,
                            boxShadow: '0 0 18px rgba(255,255,255,0.15)',
                            transition: { duration: 0.2 }
                        },
                        whileTap: { scale: 0.92 },
                        initial: { scale: 1, opacity: 1 },
                    }}
                />
            </div>

            {/* Main Nodes Layer */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                {NODES.map((n, i) => (
                    <motion.button
                        ref={getNodeRef(n.id)}
                        key={`node-${n.id}`}
                        type="button"
                        onClick={() => handleNodeClick(n.id)}
                        onMouseEnter={() => setHoveredId(n.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onFocus={() => setHoveredId(n.id)}
                        onBlur={() => setHoveredId(null)}
                        animate={nodeCtrl}
                        custom={i}
                        initial={false}
                        className="absolute inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-neutral-800/50 to-neutral-900/70 px-4 py-2.5 text-white shadow-lg backdrop-blur-md -translate-x-1/2 -translate-y-1/2 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-200"
                        whileHover={{
                            scale: 1.08,
                            borderColor: n.color,
                            boxShadow: `0 0 14px ${n.color}35`,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.91 }}
                        aria-label={n.aria ?? n.label}
                    >
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: 6 }}
                            transition={{ duration: 0.22 }}
                        >
                            {n.icon ? (
                                <n.icon size={20} strokeWidth={2.5} style={{ color: n.color }} />
                            ) : null}
                        </motion.div>
                        <span className="text-sm font-semibold" style={{ color: n.color }}>
                            {n.label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}