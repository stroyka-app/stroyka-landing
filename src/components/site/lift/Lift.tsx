"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {animate, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform} from "motion/react";
import type { SceneBridge } from "../scene/CraneScene";
import { BUDGET, beatAt, craneAt, spentAfter } from "../scene/choreo";
import LiftHero from "./LiftHero";
import Ledger from "./Ledger";
import Beats from "./Beats";
import SceneTags from "./SceneTags";
import CursorReadout from "./CursorReadout";
import { useReduced } from "../ui/useReduced";

const CraneScene = dynamic(() => import("../scene/CraneScene"), { ssr: false });

/**
 * THE LIFT — hero and product story as one pinned scene.
 *
 * The section is tall; its first screen is the hero (crane idling at dusk,
 * headline on the left). Scrolling runs the crane: six loads, each one a
 * cost on Job 204, travel from the laydown yard to the building. Each one
 * that lands stamps a line into the ledger, rolls the odometer and grows the
 * building inside the dashed budget envelope. The last screen is the close:
 * night falls, windows light, and the job finishes under budget.
 *
 * One progress value drives everything (scene, ledger, captions, tags),
 * so nothing can drift out of sync. Reduced motion gets the finished job,
 * unpinned, with the full ledger.
 */
export default function Lift() {
  const reduced = useReduced();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const done = useMotionValue(1);
  const progress = reduced ? done : smooth;

  const active = useInView(sectionRef, { margin: "200px 0px" });
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const [landed, setLanded] = useState(reduced ? 6 : 0);
  const [beat, setBeat] = useState(reduced ? 6 : -1);
  const sync = (v: number) => {
    setLanded(craneAt(v).landed);
    setBeat(beatAt(v));
  };
  useMotionValueEvent(progress, "change", sync);
  useEffect(() => sync(progress.get()), [progress]);

  const spent = useMotionValue(0);
  useEffect(() => {
    const target = spentAfter(landed);
    if (reduced) {
      spent.set(target);
      return;
    }
    const ctl = animate(spent, target, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => ctl.stop();
  }, [landed, reduced, spent]);

  const bridge = useRef<SceneBridge>({ hook: null, budget: null, stack: null });

  const heroOpacity = useTransform(progress, [0, 0.055], [1, 0]);
  const heroY = useTransform(progress, [0, 0.07], [0, -60]);
  const hudOpacity = useTransform(progress, [0.06, 0.1], [0, 1]);
  const night = useTransform(progress, [0.86, 1], [0, 0.85]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-label="Stroyka"
      className="relative"
      style={{ height: reduced ? "auto" : "760vh" }}
    >
      {/* 100lvh, not svh: iOS 26 draws the page UNDER its floating toolbar,
          so a small-viewport box left a strip of bone page under the URL bar
          (a "solid bar" over the scene). The scene now runs under the glass;
          --toolbar-gap keeps bottom UI above the bar when it's expanded. */}
      <div
        className={`${reduced ? "relative" : "sticky"} top-0 h-[100lvh] min-h-[600px] overflow-hidden`}
        // iOS 26 goes to a SOLID toolbar tint over this pinned stage; the
        // colour comes from SafariBottomTint (target #how-it-works =
        // --lift-floor), and the scene fades into exactly that colour below,
        // so the tint reads as the ground running on under the glass.
        style={{ ["--toolbar-gap" as string]: "calc(100lvh - 100svh)", backgroundColor: "var(--lift-floor)" }}
      >
        {/* Sky. Starts at #485348 — the body colour iOS paints behind the
            status bar — so the top of the phone and the sky are one. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 18% 46%, rgb(var(--sky-sun) / 0.42), rgb(var(--sky-sun) / 0) 70%), linear-gradient(to bottom, var(--sky-top) 0%, var(--sky-mid) 26%, var(--sky-haze) 46%, var(--sky-haze) 100%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: night,
            background: "linear-gradient(to bottom, var(--sky-night-top) 0%, var(--sky-night-mid) 30%, var(--sky-night-haze) 46%, var(--sky-night-haze) 100%)",
          }}
        />

        <div className="absolute inset-0">
          <CraneScene
            progress={progress}
            bridge={bridge}
            reduced={reduced}
            compact={compact}
            heroShift={!compact}
            active={active}
          />
        </div>

        {/* Bottom fade into the night page below. */}
        <div
          aria-hidden
          // Dissolves the scene into the floor colour BEFORE the toolbar line
          // (the visible bottom, 100svh), then holds it underneath: with the
          // tint = --lift-floor, nothing is cut by the toolbar edge, so no band.
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "calc(var(--toolbar-gap) + 170px)",
            background: "linear-gradient(to bottom, transparent 0, var(--lift-floor) 170px, var(--lift-floor) 100%)",
          }}
        />

        {!reduced && <SceneTags bridge={bridge} spent={spent} landed={landed} opacity={hudOpacity} />}

        {/* Reduced motion: no pin, no scrub. The finished job sits behind
            the headline and the full ledger is on the right. */}
        <motion.div style={reduced ? undefined : { opacity: heroOpacity, y: heroY }} className="absolute inset-0">
          <LiftHero />
        </motion.div>

        {!reduced && (
          <motion.div style={{ opacity: hudOpacity }} className="pointer-events-none absolute inset-0">
            <Beats beat={beat} compact={compact} />
            <Ledger landed={landed} spent={spent} budget={BUDGET} compact={compact} />
          </motion.div>
        )}

        {!reduced && <CursorReadout progress={progress} />}
      </div>
    </section>
  );
}
