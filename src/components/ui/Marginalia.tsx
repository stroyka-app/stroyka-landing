"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MarginaliaProps {
  /** The field-journal note, e.g. "06:15 — crew clocked in · 12/12" */
  note: string;
  /** Folio counter, e.g. "03" — rendered as FIELD JOURNAL · 03 */
  folio: string;
  /** Which margin the note sits in on desktop */
  side?: "left" | "right";
  /** Extra classes for per-placement spacing (e.g. pulling up into a void) */
  className?: string;
}

/**
 * Field-journal marginalia — sparse mono annotations that live in the
 * breathing room between sections, turning empty gaps into the margins of
 * one bound journal (the device the footer masthead already declares).
 * Decorative texture: aria-hidden, deliberately not translated.
 */
export default function Marginalia({
  note,
  folio,
  side = "left",
  className = "",
}: MarginaliaProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div aria-hidden className={`relative ${className}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          className={`flex items-baseline gap-4 ${
            side === "right" ? "justify-end text-right" : ""
          }`}
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {side === "left" && (
            <motion.span
              className="hidden sm:block w-10 h-px bg-ink/25 self-center origin-left"
              initial={prefersReduced ? false : { scaleX: 0 }}
              whileInView={prefersReduced ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="font-mono text-[11px] tracking-[0.08em] text-ink/45 leading-relaxed">
            {note}
          </span>
          <span className="hidden md:inline font-mono text-[9.5px] tracking-[0.22em] uppercase text-ink/30">
            · Field journal {folio}
          </span>
          {side === "right" && (
            <motion.span
              className="hidden sm:block w-10 h-px bg-ink/25 self-center origin-right"
              initial={prefersReduced ? false : { scaleX: 0 }}
              whileInView={prefersReduced ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
