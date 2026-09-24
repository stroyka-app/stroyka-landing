"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
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
 */

/** Fixed axis maximum, in $/month. Knowify at 10 ($329) is the tallest bar. */
const AXIS_MAX = 350;

function Ticker({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const prefersReduced = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 220, damping: 30, mass: 0.6 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (prefersReduced) setShown(value);
    else mv.set(value);
  }, [value, mv, prefersReduced]);

  useMotionValueEvent(spring, "change", (v) => setShown(Math.round(v)));

  return (
    <span className="tabular-nums">
      {prefix}
      {(prefersReduced ? value : shown).toLocaleString("en-US")}
    </span>
  );
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
  const prefersReduced = useReducedMotion();
  const ours = tone === "ours";
  const pct = amount === null ? 0 : Math.min(1, amount / AXIS_MAX);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <span
          className={`font-heading text-[15px] ${
            ours ? "font-semibold text-ink" : "font-medium text-ink-soft"
          }`}
        >
          {label}
        </span>
        <span
          className={`font-mono text-[15px] font-semibold ${
            ours ? "text-brand-forest" : "text-ink-soft"
          }`}
        >
          {amount === null ? (
            <span className="text-[12px] font-medium tracking-wide text-ink-muted">
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
                  className="mr-0.5 text-ink-muted"
                  title="Interpolated between two published price points"
                >
                  ~
                </span>
              )}
              <Ticker value={amount} />
              <span className="text-[11px] font-normal text-ink-muted">/mo</span>
            </>
          )}
        </span>
      </div>

      {/* Track. The bar animates scaleX from a left origin — transform only,
          never width, so it stays on the compositor. */}
      <div className="relative h-2.5 overflow-hidden rounded-full bg-bone-deep/60">
        <motion.div
          aria-hidden
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${
            ours
              ? "bg-gradient-to-r from-brand-forest to-brand-sage"
              : "bg-gradient-to-r from-bone-warm to-clay-soft"
          }`}
          initial={false}
          animate={{ scaleX: pct }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 190, damping: 28, mass: 0.7, delay }
          }
        />
      </div>

      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
        {sublabel}
      </p>
    </div>
  );
}

/**
 * A literal id, not `useId()`. The generated id came out different on the
 * server and on the client here and produced a hydration mismatch on every
 * load — React only guarantees `useId` stability when both renders agree on
 * the tree, and this one sits inside a framer-motion wrapper. There is
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
    <div className="rounded-3xl border border-bone-warm/40 bg-bone/50 p-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_18px_50px_-30px_rgba(46,38,28,0.45)] backdrop-blur-sm sm:p-9">
      {/* ── Crew size control ─────────────────────────────────────────── */}
      <div className="mb-9">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <label
            htmlFor={SLIDER_ID}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft"
          >
            Your crew
          </label>
          <p className="font-display text-[34px] font-light leading-none text-ink sm:text-[40px]">
            <Ticker value={crew} prefix="" />
            <span className="ml-2 font-body text-[14px] font-normal text-ink-muted">
              {crew === 1 ? "person" : "people"}
            </span>
          </p>
        </div>

        <div className="relative">
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
            className="crew-range w-full"
            style={{ ["--progress" as string]: `${progress * 100}%` }}
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            <span>1</span>
            <span>{MAX_CREW}+</span>
          </div>
        </div>
      </div>

      {/* ── The bars ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
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
        <div className="mt-9 border-t border-bone-warm/40 pt-6">
          <p className="font-body text-[15px] leading-relaxed text-ink-soft">
            At {crew} {crew === 1 ? "person" : "people"}, the cheapest published
            alternative costs{" "}
            <span className="font-mono font-semibold text-ink">
              <Ticker value={saving} />
            </span>{" "}
            a month more than Stroyka —{" "}
            <span className="font-mono font-semibold text-ink">
              <Ticker value={saving * 12} />
            </span>{" "}
            a year.
          </p>
          <p className="mt-3 font-body text-[13px] leading-relaxed text-ink-muted">
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
