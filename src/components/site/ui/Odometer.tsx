"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * A mechanical counter: every digit is a strip that physically rolls.
 *
 * The lowest digit rolls continuously with the value; each higher digit only
 * moves while everything below it is rolling over from 9 to 0, exactly like
 * the drum in a gas-pump or a truck's odometer. Transforms are written
 * straight to the DOM from the MotionValue: no React render per frame.
 */
export default function Odometer({
  value,
  digits = 5,
  prefix = "$",
  className = "",
}: {
  value: MotionValue<number>;
  digits?: number;
  prefix?: string;
  className?: string;
}) {
  const strips = useRef<(HTMLSpanElement | null)[]>([]);
  const cells = useRef<(HTMLSpanElement | null)[]>([]);

  const paint = (v: number) => {
    const n = Math.max(0, v);
    for (let k = 0; k < digits; k++) {
      const pow = Math.pow(10, k);
      let pos: number;
      if (k === 0) {
        pos = n % 10;
      } else {
        const below = n % pow;
        const carry = Math.max(0, below - (pow - 1));
        pos = (Math.floor(n / pow) % 10) + carry;
      }
      const strip = strips.current[digits - 1 - k];
      if (strip) strip.style.transform = `translate3d(0, ${(-pos * 100) / 11}%, 0)`;
      const cell = cells.current[digits - 1 - k];
      if (cell) cell.style.opacity = n >= pow || k === 0 ? "1" : "0.18";
    }
  };

  useMotionValueEvent(value, "change", paint);
  useEffect(() => paint(value.get()));

  return (
    <span className={`inline-flex items-start leading-none tabular-nums ${className}`} aria-hidden>
      {prefix && <span className="mr-[0.04em] block h-[1em] leading-none">{prefix}</span>}
      {Array.from({ length: digits }).map((_, i) => {
        const fromRight = digits - 1 - i;
        const comma = fromRight > 0 && fromRight % 3 === 0;
        return (
          <span key={i} className="inline-flex">
            <span
              ref={(el) => void (cells.current[i] = el)}
              className="relative inline-block h-[1em] overflow-hidden leading-none transition-opacity duration-300"
              style={{ width: "0.62em" }}
            >
              <span
                ref={(el) => void (strips.current[i] = el)}
                className="absolute left-0 top-0 flex w-full flex-col will-change-transform"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => (
                  <span key={j} className="block h-[1em] text-center leading-none">
                    {d}
                  </span>
                ))}
              </span>
            </span>
            {comma && <span className="block h-[1em] leading-none opacity-60">,</span>}
          </span>
        );
      })}
    </span>
  );
}
