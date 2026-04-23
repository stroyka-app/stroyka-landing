"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Options {
  /** Target number to count up to */
  to: number;
  /** Duration in ms */
  duration?: number;
  /** Fire only when element scrolls into view */
  triggerOnView?: boolean;
}

/**
 * Animates a number from 0 → `to` when the attached element enters the
 * viewport. Returns a ref to attach and the current displayed value.
 *
 *   const { ref, value } = useCountUp({ to: 428 });
 *   <span ref={ref}>{value}</span>
 */
export function useCountUp<T extends HTMLElement>({
  to,
  duration = 1400,
  triggerOnView = true,
}: Options): { ref: React.RefObject<T | null>; value: number } {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(to * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!triggerOnView) {
      run();
      return;
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, triggerOnView, prefersReduced]);

  return { ref, value };
}
