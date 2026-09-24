"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { MutableRefObject } from "react";
import type { SceneBridge } from "../scene/CraneScene";
import { BUDGET, LOADS } from "../scene/choreo";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * Labels pinned to points in the 3D scene. The scene writes each element's
 * `transform` (projected position) and `data-visible` every frame; this
 * component only supplies the content. CSS handles the fade on
 * `data-visible`, so nothing here re-renders per frame.
 */
export default function SceneTags({
  bridge,
  spent,
  landed,
  opacity,
}: {
  bridge: MutableRefObject<SceneBridge>;
  spent: MotionValue<number>;
  landed: number;
  opacity: MotionValue<number>;
}) {
  const t = useTranslations("site.lift");
  const carrying = landed < LOADS.length ? LOADS[landed] : null;
  const spentLabel = useTransform(spent, (v) => usd(Math.round(v)));

  const base =
    "pointer-events-none absolute left-0 top-0 transition-opacity duration-300 data-[visible=0]:opacity-0 data-[visible=1]:opacity-100 will-change-transform";

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 hidden md:block">
      {/* The load on the hook */}
      <div ref={(el) => void (bridge.current.hook = el)} data-visible="0" className={base}>
        {carrying && (
          <div className="ml-6 -translate-y-1/2 whitespace-nowrap rounded-full bg-site-night/85 py-1.5 pl-2 pr-3.5 text-[12px] text-site-paper ring-1 ring-site-paper/15 backdrop-blur">
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-[3px] align-[-1px]" style={{ background: carrying.color }} />
            {t(`loads.${carrying.id}.name`)}
            <span className="ml-2 font-mono text-site-vis">{usd(carrying.cost)}</span>
          </div>
        )}
      </div>

      {/* Top of the budget envelope */}
      <div ref={(el) => void (bridge.current.budget = el)} data-visible="0" className={base}>
        <div className="-translate-y-full pb-2 pl-3">
          <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.18em] text-site-paper/85">
            <span className="h-px w-6 bg-site-paper/60" />
            {t("tags.budget")} · {usd(BUDGET)}
          </div>
        </div>
      </div>

      {/* Top of the real building */}
      <div ref={(el) => void (bridge.current.stack = el)} data-visible="0" className={base}>
        <div className="-translate-y-1/2 pl-2">
          <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.18em] text-site-vis">
            <span className="h-px w-6 bg-site-vis/80" />
            <span className="rounded-full bg-site-night/75 px-2.5 py-1 ring-1 ring-site-vis/25 backdrop-blur-sm">
              {t("tags.spent")} · <motion.span>{spentLabel}</motion.span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
