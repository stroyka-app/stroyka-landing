"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export default function CursorDot() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const springConfig = { stiffness: 500, damping: 28 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

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
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, [data-interactive]");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [x, y, prefersReduced, visible]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        backgroundColor: hovering ? "rgba(132,169,140,0.15)" : "rgba(132,169,140,0.8)",
        boxShadow: hovering
          ? "0 0 20px rgba(132,169,140,0.2)"
          : "0 0 12px rgba(132,169,140,0.3)",
        opacity: visible ? 1 : 0,
        transition: "width 0.2s, height 0.2s, background-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}
