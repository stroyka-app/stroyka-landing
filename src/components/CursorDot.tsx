"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

/**
 * CursorDot — a fixed sage dot trailing the pointer. It animates ONLY
 * transform (scale) and opacity; the hover-grow is a spring, not a
 * width/height CSS transition. Hidden on touch and for reduced motion.
 */
export default function CursorDot() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useSpring(0, { stiffness: 500, damping: 28 });
  const y = useSpring(0, { stiffness: 500, damping: 28 });
  // Hover grows the dot from base (0.3) to ring (1.0). Spring so the
  // grow has momentum and is interruptible, instead of an `ease` flip.
  const scale = useSpring(0.3, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, [data-interactive]",
      );
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [x, y, prefersReduced, visible]);

  useEffect(() => {
    scale.set(hovering ? 1 : 0.3);
  }, [hovering, scale]);

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full w-10 h-10"
      style={{
        x,
        y,
        scale,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: hovering
          ? "rgba(132,169,140,0.15)"
          : "rgba(132,169,140,0.8)",
        boxShadow: hovering
          ? "0 0 20px rgba(132,169,140,0.2)"
          : "0 0 12px rgba(132,169,140,0.3)",
        opacity: visible ? 1 : 0,
        transition:
          "background-color 0.2s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s cubic-bezier(0.23,1,0.32,1), opacity 0.2s cubic-bezier(0.23,1,0.32,1)",
      }}
    />
  );
}
