"use client";

import {motion, useInView} from "motion/react";
import { useRef } from "react";
import { useReduced } from "./useReduced";

/**
 * Headlines that open like a site board: each line sits under a solid plate
 * that splits at the middle and folds away (top half up, bottom half down),
 * line after line. Under reduced motion the text is simply there.
 *
 * Plates are painted in `plate` so they read as a physical cover on
 * whatever surface the heading sits on.
 */
export default function FlapText({
  lines,
  as = "h2",
  className = "",
  lineClassName = "",
  plate = "#D4EE5E",
  delay = 0,
  immediate = false,
}: {
  lines: readonly React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  plate?: string;
  delay?: number;
  /** Open on mount instead of on scroll into view (above the fold). */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReduced();
  const open = immediate || inView;
  const Tag = as as "h2";

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => {
        const d = delay + i * 0.11;
        return (
          <span key={i} className={`relative block w-fit ${lineClassName}`}>
            <motion.span
              className="block"
              initial={reduced ? false : { opacity: 0 }}
              animate={open ? { opacity: 1 } : undefined}
              transition={{ duration: 0.01, delay: d + 0.12 }}
            >
              {line}
            </motion.span>
            {!reduced && (
              <span aria-hidden className="pointer-events-none absolute inset-0 [perspective:600px]">
                <motion.span
                  className="absolute inset-x-[-0.08em] top-0 h-1/2 origin-top"
                  style={{ background: plate }}
                  initial={{ rotateX: 0 }}
                  animate={open ? { rotateX: -92, opacity: 0 } : undefined}
                  transition={{ duration: 0.42, delay: d + 0.1, ease: [0.7, 0, 0.84, 0] }}
                />
                <motion.span
                  className="absolute inset-x-[-0.08em] bottom-0 h-1/2 origin-bottom"
                  style={{ background: plate }}
                  initial={{ rotateX: 0 }}
                  animate={open ? { rotateX: 92, opacity: 0 } : undefined}
                  transition={{ duration: 0.42, delay: d + 0.1, ease: [0.7, 0, 0.84, 0] }}
                />
                {/* The plate's seam: a hairline that flashes as it splits. */}
                <motion.span
                  className="absolute inset-x-[-0.08em] top-1/2 h-px bg-black/40"
                  initial={{ opacity: 1 }}
                  animate={open ? { opacity: 0 } : undefined}
                  transition={{ duration: 0.2, delay: d + 0.1 }}
                />
              </span>
            )}
          </span>
        );
      })}
    </Tag>
  );
}
