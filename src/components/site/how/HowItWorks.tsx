"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import FlapText from "../ui/FlapText";
import { useReduced } from "../ui/useReduced";
import Board from "./Board";
import { BEATS, FOCUS, beatAt, local } from "./beats";

const STEPS = [0, 1, 2, 3] as const;
const SMOOTH = { stiffness: 140, damping: 28, mass: 0.35 } as const;
/** Early in each beat the day tag sits on the drawing, where it happens; then it jumps to the text. */
const TAG_ON_BOARD = 0.35;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * HOW IT WORKS — the first week of Job 204, told on a drafting board.
 *
 * Desktop: the section pins (sticky is fine on desktop; phones never pin —
 * see lesson_ios_chrome_invariants) and the scroll scrubs one progress value
 * through four beats of the board (Board.tsx). The step text hops in from
 * the drawing's side on each beat, and the day tag starts ON the drawing,
 * where that thing happens, then jumps across into the text (shared layout).
 *
 * Phones: four cards, each with its own board that scrubs its beat as the
 * card scrolls through the screen (earlier beats already done, so the
 * drawing accumulates down the page). Reduced motion: the cards, each board
 * at the end of its beat, at every width.
 *
 * The <ol> of steps is the accessible content on every layout (visually
 * hidden behind the desktop stage); the stage is aria-hidden.
 */
export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const tn = useTranslations("nav");
  const td = useTranslations("site.how");
  const days = td.raw("days") as string[];
  const reduced = useReduced();

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, SMOOTH);

  const [beat, setBeat] = useState(-1);
  const [tagOnBoard, setTagOnBoard] = useState(true);
  const last = useRef({ beat: -1, onBoard: true });
  const sync = (v: number) => {
    const b = beatAt(v);
    const onBoard = b < 0 || local(v, b) < TAG_ON_BOARD;
    if (b !== last.current.beat) setBeat(b);
    if (onBoard !== last.current.onBoard) setTagOnBoard(onBoard);
    last.current = { beat: b, onBoard };
  };
  useMotionValueEvent(progress, "change", sync);
  useEffect(() => sync(progress.get()), [progress]);

  // Which "reached" rule the steps follow: the pinned stage's beat (desktop)
  // or their own card's scroll (phones). Desktop semantics until mounted.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const stacked = reduced || phone;

  return (
    <section id="how-it-works" className="relative bg-site-night pb-24 pt-24 text-site-paper md:pb-4 md:pt-16">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{tn("howItWorks")}</p>
        <FlapText
          lines={[t("heading")]}
          className="max-w-[18ch] font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        />
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-site-paper/70">{t("subhead")}</p>

        <div ref={trackRef} data-how-track className={`relative mt-14 md:mt-10 ${reduced ? "" : "md:h-[420vh]"}`}>
          {!reduced && (
            <div aria-hidden className="sticky top-0 hidden h-screen md:block">
              <Stage
                progress={progress}
                beat={beat}
                tagOnBoard={tagOnBoard}
                days={days}
                title={(i) => t(`steps.${i}.title`)}
                body={(i) => t(`steps.${i}.body`)}
              />
            </div>
          )}

          <ol className={`overflow-x-clip ${reduced ? "grid gap-16 md:grid-cols-2 md:gap-x-10" : "grid gap-16 md:sr-only"}`}>
            {STEPS.map((i) => (
              <Step
                key={i}
                i={i}
                day={days[i]}
                title={t(`steps.${i}.title`)}
                body={t(`steps.${i}.body`)}
                reduced={reduced}
                stacked={stacked}
                stageReached={i <= beat}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── desktop: the pinned stage ─────────────────────────────────────────── */

function Stage({
  progress,
  beat,
  tagOnBoard,
  days,
  title,
  body,
}: {
  progress: MotionValue<number>;
  beat: number;
  tagOnBoard: boolean;
  days: string[];
  title: (i: number) => string;
  body: (i: number) => string;
}) {
  const focus = FOCUS[Math.max(beat, 0)];
  return (
    <LayoutGroup id="how-day">
      <div className="grid h-full grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] items-center gap-12 pt-16 lg:gap-16">
        <div className="relative">
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-site-paper/45">
            <span className="text-site-vis">{pad(beat + 1)}</span> / {pad(BEATS)}
          </p>
          <div className="mt-6 h-8">{beat >= 0 && !tagOnBoard && <DayTag text={days[beat]} />}</div>
          <div className="relative mt-4 min-h-[260px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {beat >= 0 && (
                <motion.div
                  key={beat}
                  // A hop in from the drawing's side: out, up, and down onto the line.
                  initial={{ opacity: 0, x: 140, y: -16 }}
                  animate={{ opacity: [0, 1, 1], x: [140, 48, 0], y: [-16, -58, 0] }}
                  exit={{ opacity: 0, x: -36, y: 12, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="max-w-[14ch] font-flex text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[0.98] tracking-[-0.025em] [font-variation-settings:'wdth'_108]">
                    {title(beat)}
                  </h3>
                  <p className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-site-paper/70">{body(beat)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-10 grid max-w-[420px] grid-cols-4 gap-2">
            {STEPS.map((i) => (
              <BeatBar key={i} progress={progress} i={i} />
            ))}
          </div>
        </div>

        <div className="relative">
          <Board id="stage" progress={progress} decorative />
          {beat >= 0 && tagOnBoard && (
            <div className="pointer-events-none absolute" style={{ left: `${focus[0] * 100}%`, top: `${focus[1] * 100}%` }}>
              <div className="-translate-x-1/2 -translate-y-[170%]">
                <DayTag text={days[beat]} />
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutGroup>
  );
}

/** The day tag. One layoutId, so it physically jumps from the drawing to the text. */
function DayTag({ text }: { text: string }) {
  return (
    <motion.span
      layoutId="how-day-tag"
      data-day-tag
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="inline-flex whitespace-nowrap rounded-full bg-site-vis px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-site-on-vis shadow-[0_10px_30px_-12px_rgb(var(--site-vis)/0.8)]"
    >
      {text}
    </motion.span>
  );
}

/** One of four little rails under the text: fills through its beat. */
function BeatBar({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const fill = useTransform(progress, (v) => local(v, i));
  return (
    <span className="relative h-1 overflow-hidden rounded-full bg-site-paper/10">
      <motion.span className="absolute inset-0 origin-left rounded-full bg-site-vis" style={{ scaleX: fill }} />
    </span>
  );
}

/* ── phones (and reduced motion): the step cards ───────────────────────── */

function Step({
  i,
  day,
  title,
  body,
  reduced,
  stacked,
  stageReached,
}: {
  i: number;
  day: string;
  title: string;
  body: string;
  reduced: boolean;
  stacked: boolean;
  stageReached: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.7"] });
  const own = useSpring(scrollYProgress, SMOOTH);
  // Earlier beats are already done: the drawing accumulates down the page.
  const scrub = useTransform(own, (v) => (i + v) / BEATS);
  const settled = useMotionValue((i + 1) / BEATS);

  const [passed, setPassed] = useState(false);
  const lastPassed = useRef(false);
  useMotionValueEvent(own, "change", (v) => {
    const on = v > 0.02;
    if (on === lastPassed.current) return;
    lastPassed.current = on;
    setPassed(on);
  });

  const on = reduced || (stacked ? passed : stageReached);

  return (
    <li ref={ref} data-step={i} data-reached={on ? "1" : "0"} className="relative">
      <motion.div
        initial={false}
        // Phones: the text hops in as the card arrives (desktop: this list is visually hidden).
        animate={on ? { opacity: 1, x: 0, y: 0 } : { opacity: 0.55, x: 24, y: 10 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-site-vis">{pad(i + 1)}</span>
          <span className="rounded-full bg-site-vis px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-on-vis">{day}</span>
        </div>
        <h3 className="mt-4 font-flex text-[26px] font-semibold leading-tight tracking-[-0.02em] [font-variation-settings:'wdth'_108]">{title}</h3>
        <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-site-paper/70">{body}</p>
      </motion.div>
      <div className="mt-6 overflow-hidden rounded-[22px] ring-1 ring-site-paper/[0.08]">
        <Board id={`step-${i}`} progress={reduced ? settled : scrub} decorative />
      </div>
    </li>
  );
}
