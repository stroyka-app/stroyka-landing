"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useReduced } from "../ui/useReduced";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Space above the card for the trolley, cable and hook (px). */
const HEAD = 96;
/** The trolley on the beam. */
const TROLLEY_H = 12;
/** The hook's top — the pivot the tag swings from — sits this far above the card. */
const PIVOT = 34;
/** Cable length at rest: trolley bottom → hook top. */
const CABLE = HEAD - PIVOT - TROLLEY_H;
/** How high a tag starts before the crane lowers it in. */
const DROP = 110;

/**
 * A price tag hanging from the crane: trolley on a beam, a cable, a hook
 * through the card's eye. Used by the home pricing and /get-started.
 *
 * - Lowered in on its cable the first time it scrolls into view (a spring,
 *   so it bounces on the cable like a real load), one after another.
 * - Swings when `swingKey` changes (the billing toggle), pivoting on the hook.
 * - Hover straightens it and lifts it a little; `selected` hoists it higher.
 *   The cable always spans trolley → hook, so it shortens as the tag rises.
 *
 * SSR renders it hanging at rest (visible without JS); the drop is armed
 * before paint on the client. Reduced motion: it just hangs there.
 */
export default function Hanging({
  index,
  swingKey,
  selected = false,
  className = "",
  children,
}: {
  index: number;
  swingKey?: string;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  // 0 = up in the air, 1 = lowered to rest (overshoots a touch on the spring).
  const lowered = useMotionValue(1);
  const lift = useMotionValue(0);
  const swing = useMotionValue(0);
  const armed = useRef(false);

  useIsoLayoutEffect(() => {
    if (reduced || inView || armed.current) return;
    armed.current = true;
    lowered.set(0);
  }, [reduced, inView, lowered]);

  useEffect(() => {
    if (reduced) {
      lowered.set(1);
      return;
    }
    if (!inView || !armed.current) return;
    const c = animate(lowered, 1, { type: "spring", stiffness: 110, damping: 11, mass: 0.9, delay: 0.1 + index * 0.14 });
    return () => c.stop();
  }, [inView, reduced, index, lowered]);

  useEffect(() => {
    if (reduced) {
      lift.set(selected ? -12 : 0);
      return;
    }
    const c = animate(lift, selected ? -12 : 0, { type: "spring", stiffness: 300, damping: 22 });
    return () => c.stop();
  }, [selected, reduced, lift]);

  // Swing on every change of swingKey after the first render.
  const firstKey = useRef(swingKey);
  useEffect(() => {
    if (reduced || swingKey === firstKey.current) return;
    firstKey.current = swingKey;
    const dir = index % 2 === 0 ? 1 : -1;
    const c = animate(swing, [0, 3.2 * dir, -2.2 * dir, 1.1 * dir, -0.4 * dir, 0], {
      duration: 1.4,
      ease: "easeOut",
      delay: index * 0.07,
    });
    return () => c.stop();
  }, [swingKey, reduced, index, swing]);

  const y = useTransform([lowered, lift] as const, ([l, s]: number[]) => Math.round(-DROP * (1 - l) + s));
  const opacity = useTransform(lowered, (l) => Math.min(1, Math.max(0, l * 1.6)));
  const cable = useTransform(y, (v) => Math.max(0.04, (CABLE + v) / CABLE));

  const onHoverStart = () => {
    if (reduced) return;
    animate(swing, 0, { type: "spring", stiffness: 260, damping: 18 });
    if (!selected) animate(lift, -6, { type: "spring", stiffness: 300, damping: 22 });
  };
  const onHoverEnd = () => {
    if (reduced || selected) return;
    animate(lift, 0, { type: "spring", stiffness: 300, damping: 22 });
  };

  return (
    <div ref={ref} className={`relative flex flex-col ${className}`} style={{ paddingTop: HEAD }}>
      {/* Trolley riding the beam */}
      <span aria-hidden className="absolute left-1/2 top-0 h-3 w-12 -translate-x-1/2 rounded-[3px] bg-site-paper/80">
        <span className="absolute -bottom-1 left-2 h-2 w-2 rounded-full bg-site-paper" />
        <span className="absolute -bottom-1 right-2 h-2 w-2 rounded-full bg-site-paper" />
      </span>
      {/* Cable: trolley → hook, always */}
      <motion.span
        aria-hidden
        className="absolute left-1/2 w-[2px] -translate-x-1/2 origin-top bg-site-paper/55"
        style={{ top: TROLLEY_H, height: CABLE, scaleY: cable }}
      />
      <motion.div
        className="relative flex flex-1 flex-col"
        style={{ y, rotate: swing, opacity, transformOrigin: `50% -${PIVOT}px` }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      >
        {/* Hook through the tag's eye */}
        <svg aria-hidden viewBox="0 0 24 36" className="absolute left-1/2 h-9 w-6 -translate-x-1/2" style={{ top: -PIVOT - 2 }}>
          <rect x="7" y="0" width="10" height="9" rx="2" className="fill-site-paper/80" />
          <path d="M12 9 V20 A6 6 0 1 1 6 26" fill="none" strokeWidth="2.6" strokeLinecap="round" className="stroke-site-paper/80" />
        </svg>
        <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-[2.5px] border-site-paper/60 bg-site-night" />
        {children}
      </motion.div>
    </div>
  );
}
