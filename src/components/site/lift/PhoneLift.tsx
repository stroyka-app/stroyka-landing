"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { SceneBridge } from "../scene/CraneScene";
import { BUDGET, HERO_END, beatAt, craneAt, spentAfter } from "../scene/choreo";
import LiftHero from "./LiftHero";
import Ledger from "./Ledger";
import Beats from "./Beats";

const CraneScene = dynamic(() => import("../scene/CraneScene"), { ssr: false });

/**
 * Each block is the visible viewport plus 140px, so its scene also runs
 * under Safari's floating toolbar (glass shows the crane, not a strip of
 * the next block); bottom UI keeps clear of the bar via --toolbar-gap.
 */
const BLOCK = { height: "calc(100svh + 140px)", ["--toolbar-gap" as string]: "140px" } as const;

/** One full pass of the six lifts and the close, in seconds. */
const RUN_SECONDS = 19;

/**
 * THE LIFT on phones — nothing pinned.
 *
 * On iOS 26 no way of pinning a full-screen WebGL scene is both flicker-free
 * and native: `position: sticky` turns Safari's toolbar into a solid plate,
 * and the scroll-driven transform pin (desktop) shimmers on iPhone GPUs
 * (Maks's on-device bisection, 2026-09-24). So phones get two ordinary
 * blocks that scroll with the page, and the glass toolbar stays clean:
 *
 *   1. the hero — headline over the idling crane;
 *   2. "Job 204" — its own scene that PLAYS the six lifts when it comes into
 *      view (time-driven, not scroll-scrubbed): the ledger fills, the job
 *      closes at night. Pauses if you scroll away, replays when you come
 *      back after it finished, and has a Replay button.
 *
 * Two canvases; each only renders while on screen.
 */
export default function PhoneLift() {
  return (
    <section id="how-it-works" aria-label="Stroyka" className="relative">
      <HeroBlock />
      <StoryBlock />
    </section>
  );
}

function Sky({ night }: { night?: MotionValue<number> }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 18% 46%, rgb(var(--sky-sun) / 0.42), rgb(var(--sky-sun) / 0) 70%), linear-gradient(to bottom, var(--sky-top) 0%, var(--sky-mid) 26%, var(--sky-haze) 46%, var(--sky-haze) 100%)",
        }}
      />
      {night && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: night,
            background:
              "linear-gradient(to bottom, var(--sky-night-top) 0%, var(--sky-night-mid) 30%, var(--sky-night-haze) 46%, var(--sky-night-haze) 100%)",
          }}
        />
      )}
    </>
  );
}

function HeroBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { margin: "100px 0px" });
  const idle = useMotionValue(0);
  const bridge = useRef<SceneBridge>({ hook: null, budget: null, stack: null });

  return (
    <div ref={ref} className="relative min-h-[600px] overflow-hidden" style={BLOCK}>
      <Sky />
      <div className="absolute inset-0">
        <CraneScene progress={idle} bridge={bridge} reduced={false} compact heroShift={false} active={active} />
      </div>
      <div className="absolute inset-0">
        <LiftHero />
      </div>
    </div>
  );
}

function StoryBlock() {
  const t = useTranslations("site.lift");
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "100px 0px" });
  // "Watching" = most of the block on screen.
  const watching = useInView(ref, { amount: 0.6 });
  const progress = useMotionValue(HERO_END);
  const ctl = useRef<AnimationPlaybackControls | null>(null);
  const [finished, setFinished] = useState(false);
  const bridge = useRef<SceneBridge>({ hook: null, budget: null, stack: null });

  const play = (from?: number) => {
    ctl.current?.stop();
    if (from !== undefined) progress.set(from);
    setFinished(false);
    const remaining = 1 - progress.get();
    ctl.current = animate(progress, 1, {
      duration: (remaining / (1 - HERO_END)) * RUN_SECONDS,
      ease: "linear",
      onComplete: () => setFinished(true),
    });
  };

  useEffect(() => {
    if (watching) {
      // Came back after it finished → run it again from the top.
      play(progress.get() >= 1 ? HERO_END : undefined);
    } else {
      ctl.current?.stop();
    }
    return () => ctl.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watching]);

  const [landed, setLanded] = useState(0);
  const [beat, setBeat] = useState(0);
  const nightMV = useMotionValue(0);
  useMotionValueEvent(progress, "change", (v) => {
    setLanded(craneAt(v).landed);
    setBeat(beatAt(v));
    nightMV.set(Math.max(0, Math.min(0.85, ((v - 0.86) / 0.14) * 0.85)));
  });

  const spent = useMotionValue(0);
  useEffect(() => {
    const c = animate(spent, spentAfter(landed), { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [landed, spent]);

  return (
    <div ref={ref} className="relative min-h-[600px] overflow-hidden" style={BLOCK}>
      <Sky night={nightMV} />
      <div className="absolute inset-0">
        <CraneScene progress={progress} bridge={bridge} reduced={false} compact heroShift={false} active={near} />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <Beats beat={Math.max(0, beat)} compact />
        <Ledger landed={landed} spent={spent} budget={BUDGET} compact />
      </div>
      {finished && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => play(HERO_END)}
          className="absolute right-4 top-[calc(50%-20px)] flex items-center gap-2 rounded-full bg-site-night/85 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-site-paper ring-1 ring-site-paper/15 backdrop-blur active:scale-[0.97]"
        >
          <RotateCcw size={14} />
          {t("replay")}
        </motion.button>
      )}
    </div>
  );
}
