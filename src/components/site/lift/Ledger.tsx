"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import Odometer from "../ui/Odometer";
import { LOADS, TOTAL_SPEND } from "../scene/choreo";
import { useReduced } from "../ui/useReduced";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * Job 204's ledger. Lines stamp in as loads land; the odometer rolls to the
 * new total; the budget bar fills. When the last load lands the ledger is
 * stamped CLOSED. On phones it collapses to a single strip: total, bar and
 * the latest line.
 */
export default function Ledger({
  landed,
  spent,
  budget,
  compact,
}: {
  landed: number;
  spent: MotionValue<number>;
  budget: number;
  compact: boolean;
}) {
  const t = useTranslations("site.lift.ledger");
  const tl = useTranslations("site.lift.loads");
  const reduced = useReduced();
  const fill = useTransform(spent, (v) => Math.min(1, v / budget));
  const closed = landed >= LOADS.length;
  const last = landed > 0 ? LOADS[landed - 1] : null;
  // The odometer is decorative (aria-hidden); this is what AT announces.
  const spoken = (
    <span className="sr-only" aria-live="polite">
      {t("spent")}: {usd(LOADS.slice(0, landed).reduce((s, l) => s + l.cost, 0))}
    </span>
  );

  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Landing jolt: the card dips a few whole pixels each time a load lands.
  const jolt = useMotionValue(0);
  const joltY = useTransform(jolt, (v) => Math.round(v));
  const prevLanded = useRef(landed);
  useEffect(() => {
    if (landed > prevLanded.current && !reduced) {
      animate(jolt, [0, 3, 0], { duration: 0.42, times: [0, 0.22, 1], ease: ["easeOut", [0.22, 1, 0.36, 1]] });
    }
    prevLanded.current = landed;
  }, [landed, reduced, jolt]);

  // Hover: tilt toward the pointer + a specular spot that follows it. The 3D
  // style is attached only while tilting, so text renders flat & crisp at rest.
  const [tilting, setTilting] = useState(false);
  const leaveTimer = useRef<number | undefined>(undefined);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 220, damping: 24 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 220, damping: 24 });
  const spotX = useTransform(mx, (v) => Math.round(v * 370 - 160));
  const spotY = useTransform(my, (v) => Math.round(v * 520 - 160));
  const spotOn = useSpring(0, { stiffness: 300, damping: 30 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onEnter = () => {
    if (reduced) return;
    window.clearTimeout(leaveTimer.current);
    setTilting(true);
    spotOn.set(1);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    spotOn.set(0);
    // Let the springs settle back to flat, then drop the 3D context.
    leaveTimer.current = window.setTimeout(() => setTilting(false), 450);
  };
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  if (compact) {
    return (
      <div className="absolute inset-x-3 bottom-[calc(var(--toolbar-gap,0px)+12px)] rounded-2xl bg-site-night/85 p-4 text-site-paper ring-1 ring-site-paper/10 backdrop-blur-xl">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-paper/55">{t("job")}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-site-paper/55">
            {t("budget")} {usd(budget)}
          </span>
        </div>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <Odometer value={spent} className="font-flex text-[30px] font-semibold tracking-tight" />
          {spoken}
          <AnimatePresence mode="popLayout" initial={false}>
            {last && (
              <motion.span
                key={last.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-1 truncate text-right text-[12px] text-site-paper/75"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-[2px]" style={{ background: last.color }} />
                {tl(`${last.id}.name`)} · {usd(last.cost)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <Bar fill={fill} />
        {closed && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-site-vis">{t("under", { amount: usd(budget - TOTAL_SPEND) })}</p>}
      </div>
    );
  }

  return (
    <div data-ledger className="absolute right-6 top-1/2 w-[340px] -translate-y-1/2 lg:right-10 xl:w-[370px]">
      <motion.div style={{ y: joltY }} className="relative">
      <motion.div
        data-ledger-card
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={tilting ? { rotateX: rotX, rotateY: rotY, transformPerspective: 900, transformStyle: "preserve-3d" } : undefined}
        className="pointer-events-auto relative overflow-hidden rounded-[22px] bg-site-night/55 p-6 text-site-paper shadow-[0_30px_80px_-30px_rgb(var(--site-paper)/0.45)] ring-1 ring-site-paper/10 backdrop-blur-xl backdrop-saturate-150"
      >
        {/* Specular: a soft light spot that follows the pointer (transform + opacity only). */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-[320px] w-[320px] rounded-full"
          style={{
            x: spotX,
            y: spotY,
            opacity: spotOn,
            background: "radial-gradient(closest-side, rgb(var(--site-on-vis) / 0.55), rgb(var(--site-on-vis) / 0))",
          }}
        />
        {/* A hairline highlight along the top edge: the glass catches the sky. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--site-on-vis)/0.9)] to-transparent" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-site-paper/60">{t("job")}</span>
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-site-vis">
            <span className="h-1.5 w-1.5 rounded-full bg-site-vis" />
            {t("live")}
          </span>
        </div>

        <div className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-site-paper/50">{t("spent")}</div>
        <Odometer value={spent} className="mt-1 font-flex text-[46px] font-semibold leading-none tracking-tight" />
        {spoken}

        <Bar fill={fill} />
        <div className="mt-2 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/55">
          <span>{t("budget")} {usd(budget)}</span>
          <LeftCounter spent={spent} budget={budget} label={t("left")} />
        </div>

        <ul className="mt-5 space-y-0 border-t border-site-paper/10">
          {LOADS.map((load, i) => {
            const on = i < landed;
            return (
              <li
                key={load.id}
                data-row={i}
                ref={(el) => void (rowRefs.current[i] = el)}
                className="relative flex h-[42px] items-center justify-between overflow-hidden border-b border-site-paper/[0.07] text-[13.5px]"
              >
                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div
                      key="on"
                      className="flex w-full items-center justify-between"
                      // Printed, not faded: the line feeds down out of the slot above it.
                      initial={reduced ? false : { y: "-105%" }}
                      animate={{ y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-[3px]" style={{ background: load.color }} />
                        <span className="truncate">
                          {tl(`${load.id}.name`)}
                          <span className="ml-2 text-site-paper/45">{tl(`${load.id}.note`)}</span>
                        </span>
                      </span>
                      <span className="ml-3 font-mono tabular-nums text-site-paper/90">{usd(load.cost)}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="off"
                      className="flex w-full items-center gap-2.5 text-site-paper/25"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-site-paper/30" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em]">{t("pending")}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <AnimatePresence>
        {closed && (
          <motion.div
            key="stamp"
            initial={reduced ? false : { scale: 0, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 380, damping: 14 }}
            className="pointer-events-none absolute -bottom-[74px] left-4 origin-center"
          >
            <span className="relative block rounded-lg border-[2.5px] border-site-vis px-4 py-2 text-center font-flex text-site-vis [font-variation-settings:'wdth'_125] bg-site-night/70 backdrop-blur-sm">
              {!reduced && (
                <motion.span
                  className="absolute inset-0 rounded-lg ring-2 ring-site-vis"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.85, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
                />
              )}
              <span className="block text-[20px] font-extrabold uppercase leading-none tracking-[0.04em]">{t("closed")}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em]">
                {t("under", { amount: usd(budget - TOTAL_SPEND) })}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Bar({ fill }: { fill: MotionValue<number> }) {
  return (
    <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-site-paper/10">
      <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-site-vis" style={{ scaleX: fill }} />
      {/* Tick marks every 25% of budget. */}
      {[0.25, 0.5, 0.75].map((x) => (
        <span key={x} className="absolute inset-y-0 w-px bg-site-night/60" style={{ left: `${x * 100}%` }} />
      ))}
    </div>
  );
}

function LeftCounter({ spent, budget, label }: { spent: MotionValue<number>; budget: number; label: string }) {
  const left = useTransform(spent, (v) => `${label} $${Math.round(budget - v).toLocaleString("en-US")}`);
  return <motion.span className="tabular-nums text-site-paper/80">{left}</motion.span>;
}
