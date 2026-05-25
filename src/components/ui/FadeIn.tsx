"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  /**
   * Skip the useInView gate and animate immediately on mount. Use for
   * above-the-fold content (Hero, etc.) where the -80px viewport margin
   * would otherwise trap elements in the bottom dead-zone on shorter
   * viewports — they'd wait for a scroll event before fading in.
   */
  triggerOnMount?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  triggerOnMount = false,
}: FadeInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const shouldAnimate = triggerOnMount || inView;

  const dirs = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: 28 },
    right: { x: -28 },
    none: {},
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={shouldAnimate ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
