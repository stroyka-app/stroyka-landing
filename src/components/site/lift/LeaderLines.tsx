"use client";

import type { MutableRefObject } from "react";
import { motion, type MotionValue } from "motion/react";
import type { SceneBridge } from "../scene/CraneScene";
import { LOADS } from "../scene/choreo";

/**
 * One hairline per landed load, from its ledger row to its storey on the
 * building. The scene writes each path's `d` (and the dot) every frame;
 * this component only owns the draw-in, so nothing re-renders per frame.
 */
export default function LeaderLines({
  bridge,
  landed,
  opacity,
}: {
  bridge: MutableRefObject<SceneBridge>;
  landed: number;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.svg aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
      {LOADS.map((load, i) => {
        const on = i < landed;
        return (
          <g key={load.id}>
            <motion.path
              data-leader
              data-on={on ? "1" : "0"}
              ref={(el) => void (bridge.current.leaders[i] = el)}
              fill="none"
              stroke="rgb(var(--site-paper) / 0.4)"
              strokeWidth={1}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.6, delay: on ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.circle
              ref={(el) => void (bridge.current.leaderDots[i] = el)}
              r={2.5}
              fill={load.id === "labor" ? "rgb(var(--site-vis))" : load.color}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.25, delay: on ? 0.7 : 0 }}
            />
          </g>
        );
      })}
    </motion.svg>
  );
}
