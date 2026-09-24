"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * A surveyor's readout that trails the cursor over the hero: grid cell and
 * a chainage in feet-and-inches, as if the screen were the site plan. Mouse
 * only; gone once the crane starts working.
 */
export default function CursorReadout({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useRef(true);

  useMotionValueEvent(progress, "change", (v) => {
    live.current = v < 0.04;
    if (ref.current && !live.current) ref.current.style.opacity = "0";
  });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const cols = "ABCDEFGHJKLMN";
    const onMove = (e: PointerEvent) => {
      if (!live.current) return;
      const x = e.clientX;
      const y = e.clientY;
      const col = cols[Math.min(cols.length - 1, Math.floor((x / window.innerWidth) * cols.length))];
      const row = 1 + Math.floor((y / window.innerHeight) * 9);
      const inches = Math.round((x / window.innerWidth) * 1200);
      const ft = Math.floor(inches / 12);
      const inch = inches % 12;
      el.textContent = `GRID ${col}-${row} · ${ft}'${inch}"`;
      el.style.transform = `translate3d(${x + 18}px, ${y + 20}px, 0)`;
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden whitespace-nowrap rounded-[4px] bg-site-night/70 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-site-vis opacity-0 transition-opacity duration-200 md:block"
    />
  );
}
