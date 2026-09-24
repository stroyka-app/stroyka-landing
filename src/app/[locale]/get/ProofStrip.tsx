"use client";

import { motion } from "framer-motion";
import { Clock, ScanLine, WifiOff } from "lucide-react";
import { useReduced } from "@/components/site/ui/useReduced";

export interface Proof {
  icon: "clock" | "scan" | "offline";
  title: string;
  detail: string;
}

const ICONS = { clock: Clock, scan: ScanLine, offline: WifiOff };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Three reasons the phone and not the browser, as one strip across the foot
 * of the hero. Morning Bone: slab tiles on the bone page, a forest medallion,
 * a Flex title and a mono index in the corner like a sheet number.
 */
export default function ProofStrip({ items }: { items: Proof[] }) {
  const reduced = useReduced();
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {items.map((p, i) => {
        const Icon = ICONS[p.icon];
        return (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: EASE }}
            whileHover={reduced ? undefined : { y: -3 }}
            className="relative flex items-start gap-3.5 rounded-[20px] bg-site-slab px-5 py-4 ring-1 ring-site-paper/[0.08]"
          >
            <span className="mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-site-vis text-site-on-vis">
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-flex lg:pr-7 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-site-paper">
                {p.title}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-site-paper/65">{p.detail}</span>
            </span>
            <span
              aria-hidden
              className="absolute right-4 top-4 hidden font-mono lg:block text-[10px] tabular-nums tracking-[0.16em] text-site-paper/35"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
