"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { WORKYARD, stroykaPlanFor } from "@/data/competitors";
import { useReduced } from "@/components/site/ui/useReduced";

/**
 * The hook into /compare/construction-job-costing-cost.
 *
 * THE MOTION IS THE ARGUMENT, not decoration. The crew size cycles by itself
 * and the two figures chase it: theirs climbs every step, ours sits still
 * until a plan boundary. Nobody has to read the words "per seat" to get it —
 * watching one number move while the other does not IS the claim, and it
 * lands in about two seconds, which is all a scrolling reader gives you.
 *
 * Why not a slider here. There is a real calculator on the deep page; putting
 * a second one on the home page spends the payoff before the click and asks
 * the reader to do work before they know why they should. This asks nothing —
 * it plays, it makes its point, it hands over. (Maks, 2026-09-23: "not a
 * duplicate dynamic calculator… something more like a hook that's hard to
 * skip".)
 *
 * The crew sizes are NOT cherry-picked. 25 is in the rotation even though the
 * gap is narrowest there ($149 vs $200), because a comparison that only shows
 * its best case is an advertisement, and this whole line of work only has
 * value if it survives being checked.
 *
 * It pauses on hover and on keyboard focus, holds still for
 * prefers-reduced-motion, and never animates anything but opacity and
 * transform.
 *
 * ALL THREE VALUES SWAP ATOMICALLY, keyed on the crew size. The first
 * version sprang each figure independently so the numbers counted up, which
 * looked better and was wrong: mid-flight the label read "a crew of 10" while
 * the figures still showed $0 and $80, the crew-of-5 values. Three hundred
 * milliseconds of a false price is still a false price, and on a component
 * whose entire job is to be checkable it is the one defect that cannot be
 * tolerated. Caught by a scripted read of the live component, not by eye —
 * it is far too quick to see.
 */

/** Crew sizes to cycle, small → large. Honest spread, not a flattering one. */
const CREWS = [5, 10, 15, 25] as const;

/** Milliseconds each crew size holds before advancing. */
const DWELL = 2600;

/** Widest published figure in the rotation, for the relative bars. */
const SCALE_MAX = Math.max(...CREWS.map((n) => WORKYARD.costFor(n)));

function Figure({
  value,
  tone,
}: {
  value: number;
  tone: "ours" | "theirs";
}) {
  const prefersReduced = useReduced();
  return (
    <span className="inline-flex items-baseline">
      <motion.span
        key={value}
        className={`inline-block font-flex text-[20px] font-semibold leading-none tracking-[-0.01em] tabular-nums ${
          tone === "ours" ? "text-site-vis" : "text-site-paper"
        }`}
        initial={prefersReduced ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        ${value.toLocaleString("en-US")}
      </motion.span>
      <span
        className="ml-0.5 text-[12px] font-normal text-site-paper/50"
      >
        /mo
      </span>
    </span>
  );
}

/** A 2px rule under each figure, scaled to its share of the widest bill. */
function Rule({ value, tone }: { value: number; tone: "ours" | "theirs" }) {
  const prefersReduced = useReduced();
  return (
    <span className="relative mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-site-paper/[0.08]">
      <motion.span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${
          tone === "ours" ? "bg-site-vis" : "bg-site-paper/45"
        }`}
        initial={false}
        animate={{ scaleX: Math.max(0.02, value / SCALE_MAX) }}
        transition={
          prefersReduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 180, damping: 26, mass: 0.7 }
        }
      />
    </span>
  );
}

export default function CostTeaser() {
  const prefersReduced = useReduced();
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { margin: "-15%" });
  const [i, setI] = useState(1); // start on a crew of 10
  const [paused, setPaused] = useState(false);

  // Only runs while on screen: a timer ticking behind three screens of scroll
  // is wasted work, and arriving mid-rotation would show a number with no
  // context for how it got there.
  const running = inView && !paused && !prefersReduced;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setI((n) => (n + 1) % CREWS.length), DWELL);
    return () => clearInterval(id);
  }, [running]);

  const crew = CREWS[i];
  const plan = stroykaPlanFor(crew);
  const ours = plan.monthly;
  const theirs = WORKYARD.costFor(crew);

  return (
    <Link
      ref={ref}
      href="/compare/construction-job-costing-cost"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label={`A crew of ${crew} costs $${ours} a month on Stroyka and $${theirs} on Workyard. Price your own crew against the full comparison.`}
      className="group relative mt-7 inline-flex max-w-full flex-wrap items-center gap-x-6 gap-y-4 overflow-hidden rounded-[22px] bg-site-slab py-4 pl-5 pr-4 text-site-paper no-underline ring-1 ring-inset ring-site-paper/[0.08] transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:ring-site-vis/40 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-vis"
    >
      {/* Dwell indicator — a hairline that fills over each step, so the
          movement reads as deliberate rather than as something glitching.
          Keyed on the index so it restarts cleanly every cycle. */}
      {!prefersReduced && (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-site-vis/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: running ? 1 : 0.999 }}
          transition={{ duration: running ? DWELL / 1000 : 0, ease: "linear" }}
        />
      )}

      {/* Crew size — the only thing the reader is told to watch. */}
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-site-paper/55">
          A crew of
        </span>
        <span className="relative inline-block w-[2.2ch] text-left">
          <motion.span
            key={crew}
            className="inline-block font-flex text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-site-paper"
            initial={prefersReduced ? false : { y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {crew}
          </motion.span>
        </span>
      </span>

      {/* The two bills. Ours barely moves; theirs climbs every step — which
          is the entire point, made without a sentence. */}
      <span className="flex items-end gap-5">
        <span className="min-w-[6rem]">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-site-vis">
            Stroyka
          </span>
          <Figure value={ours} tone="ours" />
          <Rule value={ours} tone="ours" />
        </span>
        <span className="min-w-[6rem]">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-site-paper/50">
            Workyard
          </span>
          <Figure value={theirs} tone="theirs" />
          <Rule value={theirs} tone="theirs" />
        </span>
      </span>

      <span className="ml-auto flex items-center gap-2.5 pl-1">
        {/* "Price your crew", not "see the arithmetic". The teaser cycles
            four crew sizes and lets you pick none of them, so the itch it
            leaves is "what about MY nine guys" — and the page behind the
            link answers exactly that with a slider. A CTA that names what
            the reader gets beats one that describes what the page contains.
            ("see the arithmetic" was the first attempt; Maks asked for
            something else, 2026-09-24.) */}
        <span className="hidden text-[14px] font-medium text-site-paper/75 transition-colors group-hover:text-site-paper sm:inline">
          Price your crew
        </span>
        <span className="relative grid h-9 w-9 flex-shrink-0 place-items-center overflow-hidden rounded-full bg-site-vis text-site-on-vis transition-colors duration-200 group-hover:bg-site-vis-hover">
          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6 group-hover:translate-x-6"
          />
          <ArrowUpRight
            size={16}
            strokeWidth={2.2}
            className="absolute -translate-x-6 translate-y-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </span>
      </span>
    </Link>
  );
}
