"use client";

import type { MutableRefObject } from "react";
import { motion } from "motion/react";
import type { SceneBridge } from "../scene/CraneScene";
import { LOADS } from "../scene/choreo";

/**
 * One hairline for the load that JUST landed, from its ledger row to its
 * storey on the building. Only one is ever shown at a time: with rows
 * running top→bottom in landing order and storeys stacking bottom→top, all
 * six lines on at once crossed in an X-bundle (concrete's row at the top
 * pairs with the bottom storey, roof's row at the bottom pairs with the top
 * storey). The scene writes each path's `d` (and the dot) every frame; this
 * component only owns the draw-in/fade-out, so nothing re-renders per frame.
 */
export default function LeaderLines({
  bridge,
  landed,
}: {
  bridge: MutableRefObject<SceneBridge>;
  landed: number;
}) {
  const active = landed - 1;
  return (
    // No opacity here — the wrapper in Lift.tsx already fades this whole HUD
    // block with hudOpacity; adding it again here squared the fade.
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
      {LOADS.map((load, i) => {
        const on = i === active;
        return (
          <g key={load.id}>
            <motion.path
              data-leader
              data-index={i}
              data-on={on ? "1" : "0"}
              ref={(el) => void (bridge.current.leaders[i] = el)}
              fill="none"
              stroke="rgb(var(--site-paper) / 0.4)"
              strokeWidth={1}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: on ? 0.6 : 0.25, delay: on ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
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
    </svg>
  );
}
