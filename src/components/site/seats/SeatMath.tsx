"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {animate, motion, useMotionValue, useMotionValueEvent} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import FlapText from "../ui/FlapText";
import { WORKYARD, stroykaPlanFor } from "@/data/competitors";
import { useReduced } from "../ui/useReduced";
import { useCrew } from "../plans/CrewContext";

const MAX = 40;
const AXIS = 300; // $/mo, fixed so the bars visibly grow as you drag

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
    const c = animate(mv, value, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [value, mv, reduced]);
  return <span className="tabular-nums">${shown.toLocaleString("en-US")}</span>;
}

/**
 * Drag your crew size. A per-seat bill (Workyard's own published formula)
 * grows with every hire; Stroyka steps Free → Starter → Pro and then stops.
 * Where the per-seat app is cheaper, the widget says so instead of hiding it.
 */
export default function SeatMath() {
  const t = useTranslations("site.seats");
  const reduced = useReduced();
  const [crew, setCrew] = useState(12);
  // Pricing personalises for the crew size the visitor actually chose.
  const { setCrew: shareCrew } = useCrew();
  const theirs = WORKYARD.costFor(crew);
  const plan = stroykaPlanFor(crew);
  const ours = plan.monthly;
  const yearly = (theirs - ours) * 12;

  return (
    <section id="math" className="relative bg-site-night py-24 text-site-paper md:pb-36 md:pt-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("kicker")}</p>
          <FlapText
            lines={[t("headA"), t("headB")]}
            className="font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
          />
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-site-paper/75">{t("body")}</p>
        </div>

        <div className="rounded-[28px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] md:p-10">
          <div className="flex items-end justify-between">
            <label htmlFor="crew" className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/60">
              {t("crew")}
            </label>
            <span className="font-flex text-[44px] font-semibold leading-none tabular-nums md:text-[56px]">
              {crew}
              <span className="ml-2 text-[15px] font-normal text-site-paper/55">{t("workers")}</span>
            </span>
          </div>
          <input
            id="crew"
            type="range"
            min={1}
            max={MAX}
            value={crew}
            onChange={(e) => {
              const n = Number(e.target.value);
              setCrew(n);
              shareCrew(n);
            }}
            className="vis-range mt-6 w-full"
            style={{ ["--fill" as string]: `${((crew - 1) / (MAX - 1)) * 100}%` }}
          />
          {/* Ticks at their true positions: where the plan steps happen. */}
          <div className="relative mt-2 h-4 font-mono text-[10px] text-site-paper/40">
            {[1, 5, 15, MAX].map((n) => (
              <span
                key={n}
                className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                style={{ left: `${((n - 1) / (MAX - 1)) * 100}%` }}
              >
                {n}
              </span>
            ))}
          </div>

          <div className="mt-10 space-y-7">
            <Row
              name={t("them")}
              sub={t("themNote")}
              amount={theirs}
              pct={Math.min(1, theirs / AXIS)}
              tone="them"
              reduced={!!reduced}
              perMonth={t("perMonth")}
            />
            <Row
              name={`Stroyka ${plan.name}`}
              sub={t(`caps.${plan.name}`)}
              amount={ours}
              pct={Math.min(1, ours / AXIS)}
              tone="us"
              reduced={!!reduced}
              perMonth={t("perMonth")}
            />
          </div>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-site-paper/10 pt-6">
            <span className="text-[15px] text-site-paper/75">{yearly > 0 ? t("keep") : t("even")}</span>
            {yearly > 0 && (
              <span className="font-flex text-[34px] font-semibold text-site-vis md:text-[40px]">
                <Count value={yearly} />
                <span className="ml-1.5 text-[14px] font-normal text-site-paper/55">{t("perYear")}</span>
              </span>
            )}
          </div>
          <p className="mt-4 font-mono text-[10px] leading-relaxed text-site-paper/35">
            {t("source", { date: WORKYARD.verifiedOn })}
          </p>
          {/* The long-form, sourced version of this argument (SEO page). */}
          <Link
            href="/compare/construction-job-costing-cost"
            className="group mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-site-vis"
          >
            {t("compareLink")}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({
  name,
  sub,
  amount,
  pct,
  tone,
  reduced,
  perMonth,
}: {
  name: string;
  sub: string;
  amount: number;
  pct: number;
  tone: "them" | "us";
  reduced: boolean;
  perMonth: string;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <div className={`text-[15px] font-medium ${tone === "us" ? "text-site-vis" : ""}`}>{name}</div>
          <div className="text-[12.5px] leading-snug text-site-paper/50">{sub}</div>
        </div>
        <div className="font-flex text-[24px] font-semibold">
          <Count value={amount} />
          <span className="ml-1 text-[12px] font-normal text-site-paper/50">{perMonth}</span>
        </div>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-site-paper/[0.07]">
        <motion.div
          className={`absolute inset-y-0 left-0 w-full origin-left rounded-full ${tone === "us" ? "bg-site-vis" : "bg-site-paper/45"}`}
          animate={{ scaleX: Math.max(0.004, pct) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
        />
      </div>
    </div>
  );
}
