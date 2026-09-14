"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, ScanLine, WifiOff } from "lucide-react";

export interface Proof {
  icon: "clock" | "scan" | "offline";
  title: string;
  detail: string;
}

const ICONS = { clock: Clock, scan: ScanLine, offline: WifiOff };
const EASE = [0.22, 1, 0.36, 1] as const;

/** Three reasons the phone and not the browser, as one strip across the foot of the hero. */
export default function ProofStrip({ items }: { items: Proof[] }) {
  const prefersReduced = useReducedMotion();
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((p, i) => {
        const Icon = ICONS[p.icon];
        return (
          <motion.li
            key={p.title}
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 + i * 0.1, ease: EASE }}
            whileHover={prefersReduced ? undefined : { y: -3 }}
            className="card-stone-sage flex items-start gap-3 rounded-[16px] px-4 py-3.5"
          >
            <span className="mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-deep text-bone">
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-[14px] font-semibold leading-tight text-ink">{p.title}</span>
              <span className="mt-1 block text-[12.5px] leading-snug text-ink-soft">{p.detail}</span>
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
