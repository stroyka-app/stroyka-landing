"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import FlapText from "../ui/FlapText";
import VisButton from "../ui/VisButton";
import { useReduced } from "../ui/useReduced";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { getLenis } from "@/lib/lenis";
import { activeAt, progressFor, stripPos } from "./strip";

const SCREENS = ["01-jobs", "02-job-costs", "03-my-day", "04-materials", "05-requests", "06-report"] as const;
const N = SCREENS.length;
const SRC = (s: string) => `/screenshots/strip/${s}.webp`;
/** Phone auto-advance on phones (ms). */
const DWELL_MS = 3200;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * «THE STRIP» — the real app, as a strip of film running through a phone.
 *
 * The phone is a gate: the screen inside it is sharp; the screens above and
 * below stay visible outside the frame, faded and a touch smaller, so it
 * reads as a reel moving through the product, not a gallery. Maks's own
 * captures (assets/screenshots → public/screenshots/strip, webp).
 *
 * Desktop: pinned; the scroll pulls the film through the gate, each screen
 * dwelling (strip.ts); the caption hops in per screen; the index jumps.
 * Phones: nothing pinned; the film advances every few seconds while on
 * screen, tap the phone to pause, dots to jump. Reduced motion: no pin,
 * no auto-advance, dots switch screens instantly.
 */
export default function Showcase() {
  const t = useTranslations("site.strip");
  const reduced = useReduced();
  const items = t.raw("items") as { title: string; line: string; alt: string }[];

  // Desktop: scroll → film position.
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const scrolled = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.35 });
  const deskPos = useTransform(scrolled, (p) => stripPos(p, N));
  const [deskActive, setDeskActive] = useState(0);
  useMotionValueEvent(deskPos, "change", (v) => {
    const a = activeAt(v);
    if (a !== deskActive) setDeskActive(a);
  });

  const jumpDesk = (k: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const y = top + progressFor(k, N) * (track.offsetHeight - window.innerHeight);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="app" className="relative bg-site-night pb-24 pt-24 text-site-paper md:pb-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("kicker")}</p>
        <FlapText
          lines={[t("head")]}
          className="max-w-[18ch] font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        />
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-site-paper/70">{t("sub")}</p>
      </div>

      {/* Desktop: pinned reel. */}
      {!reduced && (
        <div ref={trackRef} data-strip-track className="relative hidden md:block md:h-[560vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-12 px-10 pt-14">
              <Caption active={deskActive} items={items} onJump={jumpDesk} />
              <div className="flex justify-center">
                <Phone pos={deskPos} alts={items.map((i) => i.alt)} active={deskActive} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phones (and reduced motion everywhere): the self-running reel. */}
      <div className={reduced ? "" : "md:hidden"}>
        <PhoneReel items={items} reduced={reduced} />
      </div>
    </section>
  );
}

/* ── caption column (desktop) ──────────────────────────────────────────── */

function Caption({
  active,
  items,
  onJump,
}: {
  active: number;
  items: { title: string; line: string }[];
  onJump: (k: number) => void;
}) {
  const t = useTranslations("site.lift");
  const signupHref = useSignupHref();
  const track = useCtaTracker("app_strip");
  return (
    <div>
      <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-site-paper/45">
        <span className="text-site-vis">{pad(active + 1)}</span> / {pad(N)}
      </p>
      <div className="relative mt-5 min-h-[190px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            data-strip-caption={active}
            initial={{ opacity: 0, x: 120, y: -10 }}
            animate={{ opacity: [0, 1, 1], x: [120, 36, 0], y: [-10, -46, 0] }}
            exit={{ opacity: 0, x: -30, y: 10, transition: { duration: 0.2 } }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="max-w-[16ch] font-flex text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-[0.98] tracking-[-0.025em] [font-variation-settings:'wdth'_108]">
              {items[active].title}
            </h3>
            <p className="mt-4 max-w-[30rem] text-[16px] leading-relaxed text-site-paper/70">{items[active].line}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The reel's index: every screen, the current one lit; click to jump. */}
      <ol className="mt-8 space-y-1.5">
        {items.map((it, k) => (
          <li key={k}>
            <button
              type="button"
              onClick={() => onJump(k)}
              className={`group flex items-center gap-3 text-left text-[14px] transition-colors duration-200 ${
                k === active ? "text-site-paper" : "text-site-paper/40 hover:text-site-paper/75"
              }`}
            >
              <span className={`h-px transition-[width,background-color] duration-300 ${k === active ? "w-10 bg-site-vis" : "w-4 bg-site-paper/25"}`} />
              <span className="font-mono text-[11px] tracking-[0.16em]">{pad(k + 1)}</span>
              {it.title}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <VisButton href={signupHref} onClick={() => track("cta_start_free")}>
          {t("startFree")}
        </VisButton>
        <VisButton href="/demo" variant="ghost" onClick={() => track("cta_book_demo")}>
          {t("bookDemo")}
        </VisButton>
      </div>
    </div>
  );
}

/* ── the phone + film ──────────────────────────────────────────────────── */

/** Phone width: as big as fits the viewport height, never more than 300px. */
const PHONE_W = "min(300px, calc((100svh - 190px) * 0.4617))";

function Phone({
  pos,
  alts,
  active,
  onTap,
  paused,
  width = PHONE_W,
}: {
  pos: MotionValue<number>;
  alts: string[];
  active: number;
  onTap?: () => void;
  paused?: boolean;
  width?: string;
}) {
  const y = useTransform(pos, (v) => `${(-v * 100) / N}%`);
  return (
    <div className="relative" style={{ width }}>
      {/* The film outside the gate: faded, a touch smaller, fading with distance. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[11px] top-[11px]" style={{ aspectRatio: "640 / 1387" }}>
        <motion.div className="absolute inset-x-0 top-0 flex flex-col" style={{ y, height: `${N * 100}%` }}>
          {SCREENS.map((s, k) => (
            <OuterFrame key={s} k={k} pos={pos} src={SRC(s)} />
          ))}
        </motion.div>
      </div>

      {/* The phone: bezel, the gate (sharp film), the notch. */}
      <button
        type="button"
        onClick={onTap}
        disabled={!onTap}
        aria-label={onTap ? (paused ? "Play" : "Pause") : undefined}
        className="relative block w-full rounded-[46px] bg-site-paper p-[11px] shadow-[0_50px_90px_-40px_rgb(var(--site-paper)/0.6)] disabled:cursor-default"
      >
        <div className="relative overflow-hidden rounded-[36px] bg-site-paper" style={{ aspectRatio: "640 / 1387" }}>
          <motion.div className="absolute inset-x-0 top-0 flex flex-col" style={{ y, height: `${N * 100}%` }}>
            {SCREENS.map((s, k) => (
              <div key={s} className="relative w-full flex-1">
                <Image
                  src={SRC(s)}
                  alt={k === active ? alts[k] : ""}
                  aria-hidden={k !== active}
                  fill
                  sizes="300px"
                  className="object-cover object-top"
                  priority={k === 0}
                />
              </div>
            ))}
          </motion.div>
          <span aria-hidden className="absolute left-1/2 top-2.5 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-site-paper" />
        </div>
      </button>
    </div>
  );
}

function OuterFrame({ k, pos, src }: { k: number; pos: MotionValue<number>; src: string }) {
  const d = useTransform(pos, (v) => Math.abs(k - v));
  // Hidden while it's in (or entering) the gate — the sharp copy covers it —
  // then fades with distance: neighbours at ~40%, two away at ~15%.
  const opacity = useTransform(d, (x) => (x < 0.6 ? 0 : Math.max(0, 0.42 - (x - 1) * 0.27)));
  const scale = useTransform(d, (x) => (x < 0.6 ? 1 : 0.9));
  return (
    <motion.div className="relative w-full flex-1 overflow-hidden rounded-[30px]" style={{ opacity, scale }}>
      <Image src={src} alt="" fill sizes="300px" className="object-cover object-top" />
    </motion.div>
  );
}

/* ── phones: the self-running reel ─────────────────────────────────────── */

function PhoneReel({ items, reduced }: { items: { title: string; line: string; alt: string }[]; reduced: boolean }) {
  const t = useTranslations("site.strip");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const pos = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (k: number) => {
    setActive(k);
    animate(pos, k, reduced ? { duration: 0 } : { duration: 0.75, ease: [0.65, 0, 0.35, 1] });
  };

  useEffect(() => {
    if (reduced || paused || !inView) return;
    const id = window.setTimeout(() => go((active + 1) % N), DWELL_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused, inView, reduced]);

  return (
    <div ref={ref} data-strip-reel className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center overflow-x-clip px-5 md:mt-20 md:px-10">
      {/* The film peeks out above and below the phone, then is cut off
          (it would otherwise run behind the caption). */}
      <div className="w-full overflow-hidden py-14 [mask-image:linear-gradient(to_bottom,transparent,#000_56px,#000_calc(100%-56px),transparent)]">
        <div className="flex justify-center">
        <Phone width="min(250px, 64vw)" pos={pos} alts={items.map((i) => i.alt)} active={active} onTap={reduced ? undefined : () => setPaused((p) => !p)} paused={paused} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3">
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="grid h-8 w-8 place-items-center rounded-full bg-site-slab text-site-paper/70 ring-1 ring-site-paper/10"
            aria-label={paused ? t("play") : t("pause")}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        )}
        {items.map((it, k) => (
          <button
            key={k}
            type="button"
            onClick={() => go(k)}
            aria-label={it.title}
            aria-current={k === active}
            data-strip-dot={k}
            className="grid h-8 w-6 place-items-center"
          >
            <span className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${k === active ? "w-5 bg-site-vis" : "w-1.5 bg-site-paper/25"}`} />
          </button>
        ))}
      </div>
      <div className="relative mt-6 min-h-[130px] w-full max-w-md text-center" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            data-strip-caption={active}
            initial={reduced ? false : { opacity: 0, x: 60, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] text-site-vis">
              {pad(active + 1)} / {pad(N)}
            </p>
            <h3 className="mt-2 font-flex text-[24px] font-semibold leading-tight tracking-[-0.02em] [font-variation-settings:'wdth'_108]">{items[active].title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-site-paper/70">{items[active].line}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
