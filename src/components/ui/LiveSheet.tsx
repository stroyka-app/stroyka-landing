"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/**
 * Counter — counts up to `to` once, when `start` flips true (default true),
 * after an optional `delay` (ms). Spring-settled, tabular figures.
 * Reduced-motion renders the final value immediately.
 */
export function Counter({
  to,
  format,
  delay = 0,
  start = true,
  className,
}: {
  to: number;
  format: (n: number) => string;
  delay?: number;
  start?: boolean;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const value = useSpring(0, { stiffness: 95, damping: 22, mass: 0.45 });
  const [display, setDisplay] = useState(format(prefersReduced ? to : 0));

  useMotionValueEvent(value, "change", (v) => setDisplay(format(v)));

  useEffect(() => {
    if (prefersReduced || !start) return;
    const id = window.setTimeout(() => value.set(to), delay);
    return () => window.clearTimeout(id);
  }, [value, to, delay, start, prefersReduced]);

  return <span className={`tabular-nums ${className ?? ""}`}>{display}</span>;
}

/**
 * Sparkline — a small inline trend line. Path draws via pathLength 0→1
 * when `start` flips true, after `delay` (ms). Whole-pixel geometry so the
 * transformed stroke stays crisp. Reduced-motion → static full line.
 */
export function Sparkline({
  points,
  delay = 0,
  start = true,
  className,
}: {
  points: number[];
  delay?: number;
  start?: boolean;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (prefersReduced || !start) return;
    const id = window.setTimeout(() => setDraw(true), delay);
    return () => window.clearTimeout(id);
  }, [delay, start, prefersReduced]);

  const W = 96;
  const H = 24;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = Math.round((i / (points.length - 1)) * W);
      const y = Math.round(H - ((p - min) / span) * H);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d={d}
        stroke="#B8D4BD"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: prefersReduced ? 1 : 0 }}
        animate={{ pathLength: prefersReduced || draw ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
