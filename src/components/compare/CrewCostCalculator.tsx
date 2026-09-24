"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useReduced } from "@/components/site/ui/useReduced";
import {
  COMPETITORS,
  KNOWIFY_PUBLISHED_MAX,
  MAX_CREW,
  DEFAULT_CREW,
  stroykaPlanFor,
} from "@/data/competitors";

/**
 * The argument of the whole page, as one control.
 *
 * Drag the crew size and the per-seat bars grow while ours stays where it is.
 * That is not a decorative chart — it IS the claim: a per-seat bill is a
 * function of how many people you employ, and a flat one is not. Telling a
 * contractor that costs a paragraph he will not read; letting him drag his
 * own crew size costs him two seconds.
 *
 * The axis is FIXED at $350 rather than fitted to the current values, so the
 * bars stay comparable as you drag. A self-scaling axis would keep the
 * longest bar full-width at every crew size and hide the growth — which is
 * the one thing worth showing.
 *
 * Styled as the big sibling of the home's SeatMath (Morning Bone): same
 * slab card, same `.vis-range` slider, same bars and rolling counts.
 */

/** Fixed axis maximum, in $/month. Knowify at 10 ($329) is the tallest bar. */
const AXIS_MAX = 350;

/** Slider ticks at their true positions: Stroyka's plan steps, and ten. */
const TICKS = [1, 5, 10, 15, MAX_CREW] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** A dollar figure that rolls to its new value (same as SeatMath's Count). */
function Count({ value }: { value: number }) {
  const reduced = useReduced();
  const mv = useMotionValue(value);
  const [shown, setShown] = useState(value);
  useMotionValueEvent(mv, "change", (v) => setShown(Math.round(v)));
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.45, ease: EASE });
    return () => c.stop();
  }, [value, mv, reduced]);
  return <span className="tabular-nums">${shown.toLocaleString("en-US")}</span>;
}

function Bar({
  label,
  sublabel,
  amount,
  tone,
  delay,
  estimated = false,
}: {
  label: string;
  sublabel: string;
  amount: number | null;
  tone: "ours" | "theirs";
  delay: number;
  /** Derived by us from two published points, not published at this size. */
  estimated?: boolean;
}) {
  const reduced = useReduced();
  const ours = tone === "ours";
  const pct = amount === null ? 0 : Math.min(1, amount / AXIS_MAX);

  return (
    <div>
      <div className="mb-2.5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className={`text-[15px] font-medium ${ours ? "text-site-vis" : "text-site-paper"}`}>
            {label}
          </div>
          <div className="mt-1 font-mono text-[10.5px] uppercase leading-snug tracking-[0.12em] text-site-paper/50">
            {sublabel}
          </div>
        </div>
        <div className="shrink-0 whitespace-nowrap text-right leading-none">
          {amount === null ? (
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-site-paper/45">
              not published
            </span>
          ) : (
            <>
              {/* The ONE derived figure on the page wears a "~" wherever it
                  is shown, not just in a footnote. Knowify publishes $99 at
                  one user and $329 at ten and nothing in between; printing an
                  unmarked interpolation next to a competitor's name would be
                  presenting our arithmetic as their price, which is the exact
                  thing that would make this page actionable against us. */}
              {estimated && (
                <span
                  className="mr-0.5 font-flex text-[24px] text-site-paper/45 md:text-[26px]"
                  title="Interpolated between two published price points"
                >
                  ~
                </span>
              )}
              <span
                className={`font-flex text-[24px] font-semibold tracking-[-0.01em] md:text-[26px] ${
                  ours ? "text-site-vis" : "text-site-paper"
                }`}
              >
                <Count value={amount} />
              </span>
              <span className="ml-1 text-[12px] text-site-paper/50">/mo</span>
            </>
          )}
        </div>
      </div>

      {/* Track. The bar animates scaleX from a left origin — transform only,
          never width, so it stays on the compositor. With no published price
          the track is hatched: no data, drawn as no data. */}
      <div
        className="relative h-3 overflow-hidden rounded-full bg-site-paper/[0.07]"
        style={
          amount === null
            ? {
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgb(var(--site-paper) / 0.12) 0 2px, transparent 2px 8px)",
              }
            : undefined
        }
      >
        <motion.div
          aria-hidden
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${
            ours ? "bg-site-vis" : "bg-site-paper/45"
          }`}
          initial={false}
          animate={{ scaleX: amount === null ? 0 : Math.max(0.004, pct) }}
          transition={
            reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30, delay }
          }
        />
      </div>
    </div>
  );
}

/**
 * A literal id, not `useId()`. The generated id came out different on the
 * server and on the client here and produced a hydration mismatch on every
 * load — React only guarantees `useId` stability when both renders agree on
 * the tree, and this one sits inside a motion wrapper. There is
 * exactly one of these on exactly one page, so a constant is both correct
 * and one less thing that can drift. If it is ever rendered twice on a page,
 * give it an `id` prop rather than reaching for useId again.
 */
const SLIDER_ID = "crew-size";

export default function CrewCostCalculator() {
  const [crew, setCrew] = useState(DEFAULT_CREW);
  // Stable literal, not useId() — see SLIDER_ID above.

  const plan = stroykaPlanFor(crew);
  const ourCost = plan.monthly;

  const rows = COMPETITORS.map((c) => {
    const unavailable = c.id === "knowify" && crew > KNOWIFY_PUBLISHED_MAX;
    // Knowify publishes exactly two points. Anything strictly between them
    // is ours, not theirs, and is marked as such.
    const estimated =
      c.id === "knowify" && crew > 1 && crew < KNOWIFY_PUBLISHED_MAX;
    return {
      id: c.id,
      name: c.name,
      model: c.model,
      amount: unavailable ? null : c.costFor(crew),
      estimated,
    };
  });

  // The headline number: the cheapest published alternative, minus us.
  // Only PUBLISHED figures feed the headline saving. An estimate of ours is
  // fine as context on a bar; it is not fine as the basis of a claim.
  const published = rows
    .filter((r) => !r.estimated)
    .map((r) => r.amount)
    .filter((a): a is number => a !== null);
  const cheapestOther = published.length ? Math.min(...published) : null;
  const saving = cheapestOther === null ? null : cheapestOther - ourCost;

  const progress = (crew - 1) / (MAX_CREW - 1);

  return (
    <div className="rounded-[28px] bg-site-slab p-6 text-site-paper ring-1 ring-site-paper/[0.08] md:p-10">
      {/* ── Crew size control ─────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-3">
        <label
          htmlFor={SLIDER_ID}
          className="pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/60"
        >
          Your crew
        </label>
        <p className="leading-none">
          <span className="font-flex text-[44px] font-semibold tabular-nums tracking-[-0.02em] md:text-[56px]">
            {crew}
          </span>
          <span className="ml-2 text-[15px] text-site-paper/55">
            {crew === 1 ? "person" : "people"}
          </span>
        </p>
      </div>

      <input
        id={SLIDER_ID}
        type="range"
        min={1}
        max={MAX_CREW}
        step={1}
        value={crew}
        onChange={(e) => setCrew(Number(e.target.value))}
        aria-label="Crew size"
        aria-valuetext={`${crew} ${crew === 1 ? "person" : "people"}`}
        className="vis-range mt-6 w-full"
        style={{ ["--fill" as string]: `${progress * 100}%` }}
      />
      {/* Ticks at their true positions: where Stroyka's plan steps happen. */}
      <div aria-hidden className="relative mt-2 h-4 font-mono text-[10px] text-site-paper/40">
        {TICKS.map((n) => (
          <span
            key={n}
            className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${((n - 1) / (MAX_CREW - 1)) * 100}%` }}
          >
            {n === MAX_CREW ? `${n}+` : n}
          </span>
        ))}
      </div>

      {/* ── The bars ──────────────────────────────────────────────────── */}
      <div className="mt-10 space-y-7">
        <Bar
          label="Stroyka"
          sublabel={`${plan.name} — flat, any crew size`}
          amount={ourCost}
          tone="ours"
          delay={0}
        />
        {rows.map((r, i) => (
          <Bar
            key={r.id}
            label={r.name}
            sublabel={r.model}
            amount={r.amount}
            estimated={r.estimated}
            tone="theirs"
            delay={0.04 * (i + 1)}
          />
        ))}
      </div>

      {/* ── The takeaway ──────────────────────────────────────────────── */}
      {saving !== null && saving > 0 && (
        <div className="mt-10 border-t border-site-paper/10 pt-6">
          <p className="text-[16px] leading-relaxed text-site-paper/75 md:text-[17px]">
            At {crew} {crew === 1 ? "person" : "people"}, the cheapest published
            alternative costs{" "}
            <span className="font-flex font-semibold text-site-paper">
              <Count value={saving} />
            </span>{" "}
            a month more than Stroyka —{" "}
            <span className="font-flex text-[1.3em] font-semibold leading-none text-site-vis">
              <Count value={saving * 12} />
            </span>{" "}
            a year.
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-site-paper/55">
            {plan.maxWorkers === Infinity ? (
              <>Hire another ten and that gap grows. Ours stops moving here — Pro is unlimited.</>
            ) : (
              <>
                Hire two more people and that gap grows. Ours does not move
                until you pass {plan.maxWorkers}.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
