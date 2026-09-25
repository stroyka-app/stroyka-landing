"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {AnimatePresence, LayoutGroup, motion, useInView} from "motion/react";
import { Check, CloudOff, CloudUpload, HardHat, Signal, SignalZero, UserRound } from "lucide-react";
import { useRef } from "react";
import { useReduced } from "../ui/useReduced";

const panel = "relative flex h-full min-h-[280px] flex-col md:min-h-[320px] overflow-hidden rounded-[22px] bg-site-night p-5 ring-1 ring-site-paper/[0.08] md:p-6";

/* ── 01 · Offline ──────────────────────────────────────────────────────── */

export function OfflineVignette() {
  const t = useTranslations("site.stack.offline");
  const entries = t.raw("entries") as string[];
  const reduced = useReduced();
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const [synced, setSynced] = useState(false);

  // While offline, the crew keeps working: an entry lands every second.
  useEffect(() => {
    if (online || queued >= entries.length) return;
    const id = window.setTimeout(() => setQueued((q) => q + 1), reduced ? 0 : 900);
    return () => window.clearTimeout(id);
  }, [online, queued, entries.length, reduced]);

  const toggle = () => {
    if (online) {
      setOnline(false);
      setSynced(false);
      setQueued(0);
    } else {
      setOnline(true);
      setSynced(true);
    }
  };

  return (
    <div className={panel}>
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] ${online ? "text-site-vis" : "text-site-alert"}`}>
          {online ? <Signal size={15} /> : <SignalZero size={15} />}
          {online ? t("online") : t("offline")}
        </span>
        <button
          type="button"
          onClick={toggle}
          className="rounded-full bg-site-paper/[0.07] px-3.5 py-1.5 text-[12.5px] text-site-paper ring-1 ring-inset ring-site-paper/15 transition-[background-color,transform] duration-200 hover:bg-site-paper/[0.14] active:scale-[0.96]"
        >
          {online ? t("kill") : t("restore")}
        </button>
      </div>

      {queued === 0 && (
        <div className="pointer-events-none absolute inset-x-5 top-[88px] bottom-16 grid place-items-center rounded-2xl border border-dashed border-site-paper/10 md:inset-x-6">
          <span className="flex flex-col items-center gap-3 text-center text-[13px] text-site-paper/40">
            <CloudUpload size={22} strokeWidth={1.6} />
            {t("empty")}
          </span>
        </div>
      )}
      <ul className="mt-6 space-y-2.5">
        <AnimatePresence initial={false}>
          {entries.slice(0, queued).map((e, i) => (
            <motion.li
              key={e}
              layout
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 30, delay: synced ? i * 0.08 : 0 }}
              className="flex items-center justify-between gap-3 rounded-xl bg-site-slab px-3.5 py-3 text-[13.5px] ring-1 ring-site-paper/[0.06]"
            >
              <span className="min-w-0 leading-snug">{e}</span>
              <span
                className={`flex flex-shrink-0 items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] ${synced ? "text-site-vis" : "text-site-paper/50"}`}
                title={synced ? t("syncedOne") : t("savedOne")}
              >
                {synced ? <Check size={14} /> : <CloudOff size={14} />}
                {/* Label from sm up; on phones the icon carries it and the
                    row's text gets the width. */}
                <span className="hidden sm:inline">{synced ? t("syncedOne") : t("savedOne")}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-site-paper/55">
        {synced ? <CloudUpload size={14} className="text-site-vis" /> : <CloudOff size={14} />}
        {queued === 0 ? t("idle") : synced ? t("synced") : t("queued", { count: queued })}
      </div>
    </div>
  );
}

/* ── 02 · Boss / Crew ──────────────────────────────────────────────────── */

export function RolesVignette() {
  const t = useTranslations("site.stack.roles");
  const [role, setRole] = useState<"boss" | "crew">("boss");
  const items = t.raw(role === "boss" ? "bossItems" : "crewItems") as { k: string; v: string }[];
  const reduced = useReduced();

  return (
    <div className={panel}>
      <LayoutGroup id="roles">
        <div className="inline-flex self-start rounded-full bg-site-slab p-1 ring-1 ring-site-paper/[0.08]">
          {(["boss", "crew"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              aria-pressed={role === r}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${role === r ? "text-site-on-vis" : "text-site-paper/70 hover:text-site-paper"}`}
            >
              {role === r && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 rounded-full bg-site-vis"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {r === "boss" ? <UserRound size={14} /> : <HardHat size={14} />}
                {t(r)}
              </span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={role}
          initial={reduced ? false : { opacity: 0, x: role === "boss" ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: role === "boss" ? 16 : -16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 space-y-2.5"
        >
          {items.map((it) => (
            <li key={it.k} className="flex items-center justify-between rounded-xl bg-site-slab px-3.5 py-3.5 ring-1 ring-site-paper/[0.06]">
              <span className="text-[13.5px] text-site-paper/70">{it.k}</span>
              <span className="ml-3 text-right text-[13.5px] font-medium text-site-paper">{it.v}</span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <p className="mt-auto pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/45">
        {t("foot")}
      </p>
    </div>
  );
}

/* ── 03 · Plan vs actual ───────────────────────────────────────────────── */

const PNL = [
  { key: "labor", plan: 12400, actual: 11820 },
  { key: "materials", plan: 16800, actual: 15930 },
  { key: "fuel", plan: 1900, actual: 2140 },
] as const;
const PNL_MAX = 17000;

export function PnlVignette() {
  const t = useTranslations("site.stack.pnl");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReduced();
  const [hover, setHover] = useState<string | null>(null);
  const on = inView || reduced;

  return (
    <div ref={ref} className={panel}>
      <div className="flex items-center gap-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/60">
        <span className="flex items-center gap-2"><span className="h-2 w-4 rounded-sm bg-site-paper/25" />{t("plan")}</span>
        <span className="flex items-center gap-2"><span className="h-2 w-4 rounded-sm bg-site-vis" />{t("actual")}</span>
      </div>
      <div className="mb-6 mt-6 space-y-5">
        {PNL.map((row, i) => {
          const over = row.actual > row.plan;
          const diff = row.actual - row.plan;
          return (
            <div key={row.key} onPointerEnter={() => setHover(row.key)} onPointerLeave={() => setHover(null)} className="group">
              <div className="mb-2 flex items-baseline justify-between text-[13.5px]">
                <span>{t(row.key)}</span>
                <span className={`font-mono text-[12px] tabular-nums ${over ? "text-site-alert" : "text-site-vis"}`}>
                  {diff > 0 ? "+" : "−"}${Math.abs(diff).toLocaleString("en-US")}
                </span>
              </div>
              <div className="relative h-[22px]">
                <motion.div
                  className="absolute left-0 top-0 h-[9px] w-full origin-left rounded-full bg-site-paper/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: on ? row.plan / PNL_MAX : 0 }}
                  transition={{ duration: reduced ? 0 : 0.9, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div
                  className={`absolute bottom-0 left-0 h-[9px] w-full origin-left rounded-full ${over ? "bg-site-alert" : "bg-site-vis"}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: on ? row.actual / PNL_MAX : 0 }}
                  transition={{ duration: reduced ? 0 : 1.1, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className={`mt-1 font-mono text-[10.5px] tabular-nums text-site-paper/50 transition-opacity duration-200 ${hover === row.key ? "opacity-100" : "opacity-0 md:opacity-0"}`}>
                {t("plan")} ${row.plan.toLocaleString("en-US")} · {t("actual")} ${row.actual.toLocaleString("en-US")}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex items-baseline justify-between border-t border-site-paper/10 pt-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/55">{t("margin")}</span>
        <span className="font-flex text-[26px] font-semibold tabular-nums text-site-vis">18.4%</span>
      </div>
    </div>
  );
}

/* ── 04 · Approvals ────────────────────────────────────────────────────── */

export function ApproveVignette() {
  const t = useTranslations("site.stack.approve");
  const reduced = useReduced();
  // null = pending; the request is decided one way or the other.
  const [decision, setDecision] = useState<null | "approved" | "rejected">(null);
  const approved = decision === "approved";

  return (
    <div className={panel}>
      <div className="relative rounded-2xl bg-site-slab p-4 ring-1 ring-site-paper/[0.08]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/50">{t("kicker")}</p>
            <p className="mt-1.5 text-[15px] font-medium">{t("item")}</p>
            <p className="mt-0.5 text-[12.5px] text-site-paper/55">{t("from")}</p>
          </div>
          <span className="font-flex text-[20px] font-semibold tabular-nums">$1,240</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setDecision((d) => (d ? null : "approved"))}
            className={`h-10 flex-1 rounded-full text-[13.5px] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${decision ? "bg-site-paper/10 text-site-paper/70" : "bg-site-vis text-site-on-vis hover:bg-site-vis-hover"}`}
          >
            {decision ? t("undo") : t("approve")}
          </button>
          <button
            type="button"
            disabled={decision !== null}
            onClick={() => setDecision("rejected")}
            className="h-10 rounded-full px-4 text-[13.5px] text-site-paper/70 ring-1 ring-inset ring-site-paper/20 transition-[background-color,transform] duration-200 hover:bg-site-alert/10 hover:text-site-alert hover:ring-site-alert/40 active:scale-[0.97] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-site-paper/70"
          >
            {t("reject")}
          </button>
        </div>

        <AnimatePresence>
          {decision && (
            <motion.div
              key={decision}
              initial={reduced ? false : { scale: 0, rotate: -24, opacity: 0 }}
              animate={{ scale: 1, rotate: -11, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 14 }}
              className="pointer-events-none absolute right-6 top-10"
            >
              <span
                className={`relative block rounded-md border-[2.5px] px-3 py-1 font-flex text-[18px] font-extrabold uppercase tracking-[0.06em] [font-variation-settings:'wdth'_125] ${approved ? "border-site-vis text-site-vis" : "border-site-alert text-site-alert"}`}
              >
                {!reduced && (
                  <motion.span
                    className={`absolute inset-0 rounded-md ring-2 ${approved ? "ring-site-vis" : "ring-site-alert"}`}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.85, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}
                {approved ? t("approved") : t("rejected")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/50">{t("ledger")}</div>
      <ul className="mt-2 divide-y divide-site-paper/[0.07] text-[13px]">
        <AnimatePresence initial={false}>
          {approved && (
            <motion.li
              key="new"
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex justify-between py-2.5 text-site-vis">
                <span>{t("row")}</span>
                <span className="font-mono tabular-nums">+$1,240</span>
              </div>
            </motion.li>
          )}
        </AnimatePresence>
        <li className="flex justify-between py-2.5 text-site-paper/60">
          <span>{t("prev0")}</span>
          <span className="font-mono tabular-nums">$412.88</span>
        </li>
        <li className="flex justify-between py-2.5 text-site-paper/60">
          <span>{t("prev1")}</span>
          <span className="font-mono tabular-nums">$1,120</span>
        </li>
      </ul>
    </div>
  );
}
