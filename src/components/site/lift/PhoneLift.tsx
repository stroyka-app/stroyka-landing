"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import type { SceneBridge } from "../scene/CraneScene";
import { BUDGET, HERO_END, craneAt, spentAfter } from "../scene/choreo";
import LiftHero from "./LiftHero";
import { useTranslations } from "next-intl";
import Odometer from "../ui/Odometer";

const CraneScene = dynamic(() => import("../scene/CraneScene"), { ssr: false });

/** One pass of the six lifts and the close, in seconds. */
const RUN_SECONDS = 19;
/** Hold on the finished job before looping. */
const HOLD_MS = 2600;

/**
 * THE LIFT on phones — the hero IS the crane story, nothing pinned.
 *
 * On iOS 26 no way of pinning a full-screen WebGL scene is both flicker-free
 * and native (`sticky` = solid toolbar plate; the scroll-driven transform
 * pin = crane shimmer on iPhone GPUs — Maks's on-device bisection,
 * 2026-09-24). So on phones the hero is one ordinary block: headline and
 * CTAs on top, and behind them the crane builds Job 204 on a loop — six
 * lifts, the ledger strip rolling at the bottom, the night close, a short
 * hold, a fade, again. Time-driven, runs only while the hero is on screen.
 *
 * The block is the visible viewport + 140px so the scene also runs under
 * Safari's floating toolbar; the ledger keeps clear of it (--toolbar-gap).
 */
export default function PhoneLift() {
  const ref = useRef<HTMLElement>(null);
  const onScreen = useInView(ref, { margin: "100px 0px" });
  const progress = useMotionValue(HERO_END);
  const veil = useMotionValue(0);
  const ctl = useRef<AnimationPlaybackControls | null>(null);
  const bridge = useRef<SceneBridge>({ hook: null, budget: null, stack: null, rows: [], leaders: [], leaderDots: [] });

  useEffect(() => {
    if (!onScreen) {
      ctl.current?.stop();
      return;
    }
    let cancelled = false;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      if (cancelled) return;
      const remaining = 1 - progress.get();
      ctl.current = animate(progress, 1, {
        duration: (remaining / (1 - HERO_END)) * RUN_SECONDS,
        ease: "linear",
        onComplete: () => {
          hold = setTimeout(async () => {
            if (cancelled) return;
            // Fade the scene out, reset the job, fade back in, go again.
            await animate(veil, 1, { duration: 0.45 });
            progress.set(HERO_END);
            await animate(veil, 0, { duration: 0.6, delay: 0.15 });
            run();
          }, HOLD_MS);
        },
      });
    };
    // A beat after arriving so the headline lands first.
    const start = setTimeout(run, progress.get() === HERO_END ? 1200 : 0);
    return () => {
      cancelled = true;
      clearTimeout(start);
      if (hold) clearTimeout(hold);
      ctl.current?.stop();
    };
  }, [onScreen, progress, veil]);

  const [landed, setLanded] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setLanded(craneAt(v).landed));

  const spent = useMotionValue(0);
  useEffect(() => {
    const c = animate(spent, spentAfter(landed), { duration: landed === 0 ? 0.3 : 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [landed, spent]);

  return (
    <section
      id="lift"
      ref={ref}
      aria-label="Stroyka"
      className="relative min-h-[640px] overflow-hidden"
      style={{ height: "calc(100svh + 140px)", ["--toolbar-gap" as string]: "140px" }}
    >
      <div className="absolute inset-0">
        <CraneScene progress={progress} bridge={bridge} reduced={false} compact heroShift={false} heroCamera active={onScreen} />
      </div>
      {/* Loop veil: the page colour, fading over the scene at the reset. */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-site-night" style={{ opacity: veil }} />
      <div className="absolute inset-0">
        <LiftHero showCue={false} />
      </div>
      <LedgerStrip spent={spent} landed={landed} />
    </section>
  );
}

/** One line of ledger under the scene: job, rolling spend, budget bar. */
function LedgerStrip({ spent, landed }: { spent: MotionValue<number>; landed: number }) {
  const t = useTranslations("site.lift.ledger");
  const fill = useTransform(spent, (v) => Math.min(1, v / BUDGET));
  const closed = landed >= 6;
  return (
    <div
      className="pointer-events-none absolute inset-x-4 rounded-full bg-site-night/85 px-4 py-2.5 ring-1 ring-site-paper/10 backdrop-blur-xl"
      style={{ bottom: "calc(var(--toolbar-gap) + 14px)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.16em] text-site-paper/55">{t("job")}</span>
        <span className="flex items-baseline gap-1.5">
          <Odometer value={spent} className="font-flex text-[17px] font-semibold tracking-tight" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-site-paper/45">/ ${BUDGET.toLocaleString("en-US")}</span>
        </span>
      </div>
      <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-site-paper/10">
        <motion.div
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${closed ? "bg-site-vis" : "bg-site-vis/80"}`}
          style={{ scaleX: fill }}
        />
      </div>
    </div>
  );
}
