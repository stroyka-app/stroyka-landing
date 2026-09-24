"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {AnimatePresence, motion, useInView} from "motion/react";
import FlapText from "../ui/FlapText";
import { makeBody, step, type Body } from "./physics";
import { useReduced } from "../ui/useReduced";

type Cat = "labor" | "materials" | "fuel" | "equipment";
type Kind = "receipt" | "note" | "text";

/** The mess. Amounts are real-looking and add up per category below. */
const SCRAPS: readonly { cat: Cat; amount: number; kind: Kind }[] = [
  { cat: "materials", amount: 412.88, kind: "receipt" },
  { cat: "labor", amount: 332.5, kind: "text" },
  { cat: "fuel", amount: 86.4, kind: "receipt" },
  { cat: "materials", amount: 1120, kind: "note" },
  { cat: "equipment", amount: 385, kind: "receipt" },
  { cat: "labor", amount: 610, kind: "note" },
  { cat: "materials", amount: 1240, kind: "text" },
  { cat: "fuel", amount: 64.1, kind: "receipt" },
  { cat: "equipment", amount: 140, kind: "receipt" },
  { cat: "materials", amount: 790, kind: "receipt" },
  { cat: "labor", amount: 256, kind: "text" },
  { cat: "equipment", amount: 95, kind: "note" },
];
const CATS: readonly Cat[] = ["labor", "materials", "fuel", "equipment"];

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/**
 * THE SHOEBOX — job costing as most crews do it today, as a pile you can
 * grab and throw. "Sort it out" turns the same scraps into four clean
 * columns with totals: the before/after of the whole product in one widget.
 */
export default function Shoebox() {
  const t = useTranslations("site.shoebox");
  const reduced = useReduced();
  const arenaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const size = useRef({ width: 0, height: 0, card: { w: 150, h: 92 } });
  const [sorted, setSorted] = useState(false);
  const [small, setSmall] = useState(false);
  const sortedRef = useRef(false);
  const inView = useInView(arenaRef, { margin: "-15% 0px" });
  const dropped = useRef(false);

  const paint = useCallback(() => {
    bodies.current.forEach((b, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      el.style.transform = `translate3d(${Math.round(b.x - b.w / 2)}px, ${Math.round(b.y - b.h / 2)}px, 0) rotate(${b.a}rad)`;
    });
  }, []);

  /** Column slot for card i when sorted. */
  const sortedSlot = useCallback((i: number) => {
    const { width, card } = size.current;
    const cat = SCRAPS[i].cat;
    const col = CATS.indexOf(cat);
    const inCol = SCRAPS.slice(0, i).filter((s) => s.cat === cat).length;
    const colW = width / 4;
    return { x: colW * col + colW / 2, y: 64 + card.h / 2 + inCol * (card.h * 0.42) };
  }, []);

  // Measure the arena; lay the pile out (above the arena, ready to drop).
  useEffect(() => {
    const el = arenaRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const small = r.width < 560;
      // Phones: one card per sorted column, a touch narrower than it.
      const card = small ? { w: Math.floor(r.width / 4) - 10, h: 66 } : { w: 150, h: 92 };
      setSmall(small);
      size.current = { width: r.width, height: r.height, card };
      cardRefs.current.forEach((c) => {
        if (!c) return;
        c.style.width = `${card.w}px`;
        c.style.height = `${card.h}px`;
      });
      if (bodies.current.length === 0) {
        bodies.current = SCRAPS.map((_, i) => {
          const x = card.w / 2 + ((i * 97) % Math.max(1, r.width - card.w));
          const y = reduced ? r.height - card.h / 2 - (i % 3) * card.h * 0.6 : -card.h * (1 + i * 0.9);
          return makeBody(x, y, card.w, card.h, ((i * 37) % 60 - 30) * (Math.PI / 180));
        });
      } else {
        bodies.current.forEach((b) => {
          b.w = card.w;
          b.h = card.h;
          b.r = Math.min(card.w, card.h) * 0.62;
          b.x = Math.min(b.x, r.width - card.w / 2);
        });
      }
      if (sortedRef.current) {
        bodies.current.forEach((b, i) => Object.assign(b, sortedSlot(i), { a: 0 }));
      }
      paint();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [paint, reduced, sortedSlot]);

  // The simulation runs only while the arena is on screen and unsorted.
  useEffect(() => {
    if (!inView || sorted || reduced) return;
    dropped.current = true;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      // Two substeps keep fast throws from tunnelling.
      step(bodies.current, size.current, dt / 2);
      step(bodies.current, size.current, dt / 2);
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, sorted, reduced, paint]);

  // Drag & throw.
  const onPointerDown = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (sortedRef.current) return;
    const b = bodies.current[i];
    const arena = arenaRef.current;
    if (!b || !arena) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = arena.getBoundingClientRect();
    const ox = e.clientX - rect.left - b.x;
    const oy = e.clientY - rect.top - b.y;
    b.held = true;
    b.va = 0;
    let lx = e.clientX;
    let ly = e.clientY;
    let lt = performance.now();
    const el = e.currentTarget;
    el.style.zIndex = "30";
    const move = (ev: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lt) / 1000;
      b.vx = (ev.clientX - lx) / dt;
      b.vy = (ev.clientY - ly) / dt;
      b.x = ev.clientX - rect.left - ox;
      b.y = ev.clientY - rect.top - oy;
      b.a += (ev.clientX - lx) * 0.002;
      lx = ev.clientX;
      ly = ev.clientY;
      lt = now;
      if (reduced) paint();
    };
    const up = () => {
      b.held = false;
      b.vx = Math.max(-2600, Math.min(2600, b.vx));
      b.vy = Math.max(-2600, Math.min(2600, b.vy));
      b.va = b.vx * 0.004;
      el.style.zIndex = "";
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  const toggleSort = () => {
    const next = !sortedRef.current;
    sortedRef.current = next;
    setSorted(next);
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.transition = reduced
        ? "none"
        : `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${next ? i * 35 : 0}ms`;
    });
    if (next) {
      bodies.current.forEach((b, i) => {
        Object.assign(b, sortedSlot(i), { a: 0, vx: 0, vy: 0, va: 0 });
      });
      paint();
    } else {
      // Kick everything back into a pile.
      bodies.current.forEach((b, i) => {
        b.vx = ((i * 131) % 900) - 450;
        b.vy = -600 - ((i * 71) % 500);
        b.va = ((i % 5) - 2) * 3;
      });
      window.setTimeout(() => cardRefs.current.forEach((el) => el && (el.style.transition = "")), 60);
    }
  };

  const totals = CATS.map((c) => SCRAPS.filter((s) => s.cat === c).reduce((a, s) => a + s.amount, 0));

  return (
    <section id="shoebox" className="relative overflow-hidden bg-site-night py-24 text-site-paper md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col justify-center">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("kicker")}</p>
          <FlapText
            lines={sorted ? [t("afterA"), t("afterB")] : [t("headA"), t("headB")]}
            key={sorted ? "after" : "before"}
            immediate={dropped.current}
            className="font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.025em] [font-variation-settings:'wdth'_110]"
          />
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-site-paper/75">{sorted ? t("afterBody") : t("body")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={toggleSort}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-site-vis pl-6 pr-2 text-[15px] font-medium text-site-on-vis transition-[background-color,transform] duration-200 hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night"
            >
              {sorted ? t("unsort") : t("sort")}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-site-on-vis text-site-vis transition-transform duration-300 group-hover:rotate-180">
                ⇅
              </span>
            </button>
            {!sorted && <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-site-paper/45">{t("hint")}</span>}
          </div>
        </div>

        <div
          ref={arenaRef}
          className="relative h-[440px] touch-none select-none overflow-hidden rounded-[28px] bg-site-slab ring-1 ring-site-paper/[0.08] md:h-[560px]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--site-paper) / 0.035) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--site-paper) / 0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {/* Column heads, only once sorted */}
          <AnimatePresence>
            {sorted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="absolute inset-x-0 top-0 grid grid-cols-4"
              >
                {CATS.map((c, i) => (
                  <div key={c} className="border-r border-site-paper/[0.06] px-2 pt-4 text-center last:border-r-0 md:px-3">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-site-paper/55 md:text-[10.5px]">{t(`cats.${c}`)}</div>
                    <div className="mt-0.5 font-flex text-[15px] font-semibold tabular-nums text-site-vis md:text-[19px]">{money(totals[i])}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {SCRAPS.map((s, i) => (
            <div
              key={i}
              ref={(el) => void (cardRefs.current[i] = el)}
              onPointerDown={onPointerDown(i)}
              className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
              style={{ width: size.current.card.w, height: size.current.card.h, willChange: "transform" }}
            >
              <Scrap kind={s.kind} label={t(`items.${i}`)} amount={money(s.amount)} tag={t(`cats.${s.cat}`)} sorted={sorted} small={small} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Scrap({
  kind,
  label,
  amount,
  tag,
  sorted,
  small,
}: {
  kind: Kind;
  label: string;
  amount: string;
  tag: string;
  sorted: boolean;
  small: boolean;
}) {
  if (small) {
    const tone =
      kind === "text"
        ? "rounded-[12px] rounded-bl-[3px] bg-[var(--scrap-text)] text-[#F1ECDD]"
        : kind === "note"
          ? "bg-[var(--scrap-note)] text-[var(--scrap-ink)]"
          : "bg-[var(--scrap-receipt)] text-[var(--scrap-ink)]";
    return (
      <div className={`flex h-full w-full flex-col justify-between p-1.5 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.6)] ${tone}`}>
        <span className="line-clamp-2 font-mono text-[8.5px] leading-[1.2]">{label}</span>
        <span className="font-mono text-[11px] font-bold tabular-nums">{amount}</span>
      </div>
    );
  }
  if (kind === "text") {
    return (
      <div className="flex h-full w-full flex-col justify-between rounded-[16px] rounded-bl-[4px] bg-[var(--scrap-text)] p-2.5 text-[#F1ECDD] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/5 md:p-3">
        <span className="line-clamp-2 text-[11px] leading-snug md:text-[12.5px]">{label}</span>
        <span className="flex items-center justify-between font-mono text-[10px] text-[#F1ECDD]/60 md:text-[11px]">
          <span>{amount}</span>
          <span>{sorted ? tag : "✓✓"}</span>
        </span>
      </div>
    );
  }
  if (kind === "note") {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-[var(--scrap-note)] p-2.5 text-[var(--scrap-ink)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] md:p-3">
        <span className="line-clamp-2 font-mono text-[10.5px] leading-snug md:text-[12px]">{label}</span>
        <span className="font-mono text-[12px] font-bold md:text-[14px]">{amount}</span>
      </div>
    );
  }
  return (
    <div
      className="flex h-full w-full flex-col justify-between bg-[var(--scrap-receipt)] p-2.5 text-[var(--scrap-ink)] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] md:p-3"
      style={{
        // Torn bottom edge.
        clipPath:
          "polygon(0 0,100% 0,100% 92%,95% 100%,90% 92%,85% 100%,80% 92%,75% 100%,70% 92%,65% 100%,60% 92%,55% 100%,50% 92%,45% 100%,40% 92%,35% 100%,30% 92%,25% 100%,20% 92%,15% 100%,10% 92%,5% 100%,0 92%)",
      }}
    >
      <span className="line-clamp-2 font-mono text-[10px] uppercase leading-snug tracking-[0.04em] md:text-[11px]">{label}</span>
      <span className="flex items-baseline justify-between border-t border-dashed border-black/20 pb-1.5 pt-1 font-mono text-[11px] md:text-[13px]">
        <span className="opacity-60">{sorted ? tag : "TOTAL"}</span>
        <span className="font-bold">{amount}</span>
      </span>
    </div>
  );
}
