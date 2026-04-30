"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import { Pin } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/* ────────────────────────────────────────────────────────────────────────────
 * Workshop Pinboard — each integration is a tactile sticker pinned to a
 * corkboard, slightly rotated, with a LIVE micro-demo of what flows out
 * of Stroyka into that tool. The data flow is implicit because each card
 * SHOWS data moving inside it — no spokes, no curves, no logo wall.
 * ──────────────────────────────────────────────────────────────────────── */

interface Tool {
  name: string;
  caption: string;
  status: "live" | "soon";
  rotation: number;
  bobPeriod: number;
  bobOffset: number;
  Demo: React.FC<{ active: boolean }>;
}

/* ── Live micro-demos (code-rendered SVG, no assets) ─────────────────── */

/**
 * QuickBooks-style ledger — three rows of debit/credit. The bottom row
 * scrolls in every 2.4s; oldest scrolls off the top. Reads as live posting.
 */
function LedgerDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  const rows = [
    { ref: "INV-0142", amt: "+$2,180", label: "concrete" },
    { ref: "INV-0143", amt: "+$4,820", label: "lumber" },
    { ref: "INV-0144", amt: "+$3,640", label: "roof" },
  ];
  return (
    <div className="relative h-[64px] overflow-hidden rounded-md bg-bone-soft/60 border border-ink/10 px-2.5 py-2 font-mono text-[10.5px]">
      <motion.div
        animate={
          prefersReduced || !active
            ? undefined
            : { y: [0, -22, -44, -22] }
        }
        transition={
          prefersReduced || !active
            ? undefined
            : {
                duration: 7.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1],
              }
        }
        className="flex flex-col gap-1"
      >
        {[...rows, ...rows].map((r, i) => (
          <div
            key={i}
            className="flex justify-between items-baseline tracking-[0.04em]"
          >
            <span className="text-ink/55">{r.ref}</span>
            <span className="text-ink/40 capitalize">{r.label}</span>
            <span className="text-brand-forest font-semibold tabular-nums">
              {r.amt}
            </span>
          </div>
        ))}
      </motion.div>
      {/* top fade mask */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-3"
        style={{
          background:
            "linear-gradient(to bottom, rgba(238,232,219,0.95), transparent)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3"
        style={{
          background:
            "linear-gradient(to top, rgba(238,232,219,0.95), transparent)",
        }}
      />
    </div>
  );
}

/**
 * Xero-style invoice ticker — a single big invoice number that ticks up.
 */
function InvoiceTickerDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  const numbers = [42, 43, 44, 45, 46];
  return (
    <div className="relative h-[64px] overflow-hidden rounded-md bg-bone-soft/60 border border-ink/10 px-3 py-2 font-mono text-[10.5px]">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-ink/50 tracking-[0.1em] text-[10px] uppercase">
          Invoice
        </span>
        <span className="relative inline-flex w-1.5 h-1.5">
          {!prefersReduced && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-60 animate-ping" />
          )}
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
        </span>
      </div>
      <div className="relative h-5 overflow-hidden">
        <motion.div
          animate={
            prefersReduced || !active
              ? undefined
              : { y: [0, -20, -40, -60, -80] }
          }
          transition={
            prefersReduced || !active
              ? undefined
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute inset-x-0 top-0"
        >
          {numbers.map((n) => (
            <div
              key={n}
              className="h-5 flex items-center font-display font-light text-[18px] text-ink tabular-nums tracking-tight"
            >
              INV-00{n}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Sheet-cell wave — 4×4 grid of cells fills with values diagonally,
 * resets, restarts. Reads as data populating a spreadsheet.
 */
function SheetWaveDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  // 4x4 = 16 cells. Each cell has a fill delay computed from (i + j) so
  // the wave moves diagonally.
  const cells: { row: number; col: number; val: string }[] = [];
  const samples = ["428", "$2.1k", "32h", "12", "$840", "1.4k", "98%", "44h", "$5k", "320", "9", "$310", "16", "$1.8k", "27h", "$640"];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push({ row: r, col: c, val: samples[r * 4 + c] });
    }
  }
  return (
    <div className="relative h-[64px] rounded-md bg-bone-soft/60 border border-ink/10 p-2 grid grid-cols-4 gap-[3px]">
      {cells.map((cell, i) => {
        const wave = (cell.row + cell.col) * 0.18;
        return (
          <motion.div
            key={i}
            animate={
              prefersReduced || !active
                ? { backgroundColor: "rgba(132,169,140,0.18)", opacity: 0.6 }
                : {
                    backgroundColor: [
                      "rgba(132,169,140,0)",
                      "rgba(132,169,140,0.55)",
                      "rgba(132,169,140,0.55)",
                      "rgba(132,169,140,0)",
                    ],
                    opacity: [0, 1, 1, 0],
                  }
            }
            transition={
              prefersReduced || !active
                ? { duration: 0.3 }
                : {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: wave,
                    times: [0, 0.25, 0.7, 1],
                  }
            }
            className="rounded-[3px] border border-ink/8 flex items-center justify-center font-mono text-[9px] tabular-nums text-ink/65"
          >
            {cell.val}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Stripe card swipe — payment card silhouette with a "✓ paid" chip
 * sliding across periodically.
 */
function StripeCardDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="relative h-[64px] rounded-md bg-bone-soft/60 border border-ink/10 px-3 py-2 overflow-hidden">
      <div className="relative h-[40px] rounded-[5px] bg-gradient-to-br from-ink to-ink/70 shadow-inner overflow-hidden">
        {/* Card chip */}
        <div className="absolute top-1.5 left-2 w-3.5 h-2.5 rounded-[1.5px] bg-gradient-to-br from-[#d4b774] to-[#a48d50]" />
        {/* Magnetic stripe shimmer */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-[40%]"
          style={{
            background:
              "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          }}
          animate={
            prefersReduced || !active
              ? undefined
              : { x: ["-110%", "260%"] }
          }
          transition={
            prefersReduced || !active
              ? undefined
              : {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }
          }
        />
        {/* Last-4 */}
        <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-baseline font-mono text-[10px] text-bone/90 tabular-nums tracking-widest">
          <span>•••• 4242</span>
          <span className="text-bone/55 text-[8.5px]">VISA</span>
        </div>
      </div>
      {/* Paid chip — slides in from right, holds, slides out */}
      <motion.div
        aria-hidden
        className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded-full bg-brand-sage-bright/95 text-brand-midnight-dark font-mono text-[9.5px] font-bold tracking-[0.08em]"
        animate={
          prefersReduced || !active
            ? { x: 0, opacity: 1 }
            : { x: [60, 0, 0, 60], opacity: [0, 1, 1, 0] }
        }
        transition={
          prefersReduced || !active
            ? undefined
            : {
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.75, 1],
              }
        }
      >
        ✓ paid
      </motion.div>
    </div>
  );
}

/**
 * PDF page fan — three stacked sheets fan out (rotation), reset.
 */
function PdfFanDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  const sheets = [
    { rot: -8, x: -10 },
    { rot: 0, x: 0 },
    { rot: 8, x: 10 },
  ];
  return (
    <div className="relative h-[64px] rounded-md bg-bone-soft/60 border border-ink/10 flex items-center justify-center overflow-hidden">
      {sheets.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-9 h-12 rounded-[3px] bg-bone border border-ink/30 shadow-sm"
          style={{ transformOrigin: "bottom center" }}
          initial={false}
          animate={
            prefersReduced || !active
              ? { rotate: s.rot, x: s.x }
              : {
                  rotate: [0, s.rot, s.rot, 0],
                  x: [0, s.x, s.x, 0],
                }
          }
          transition={
            prefersReduced || !active
              ? { duration: 0.3 }
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: [0.34, 1.4, 0.64, 1],
                  times: [0, 0.35, 0.7, 1],
                  delay: i * 0.1,
                }
          }
        >
          {/* Page lines */}
          <div className="absolute inset-1.5 flex flex-col gap-0.5">
            <span className="h-px bg-ink/40" />
            <span className="h-px bg-ink/25 w-3/4" />
            <span className="h-px bg-ink/25 w-1/2" />
            <span className="mt-1 h-px bg-ink/25 w-2/3" />
            <span className="h-px bg-ink/25 w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Cloud sync — a sage arc draws around a circle, settling into a check.
 */
function CloudSyncDemo({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="relative h-[64px] rounded-md bg-bone-soft/60 border border-ink/10 flex items-center justify-center overflow-hidden">
      <svg width="46" height="46" viewBox="0 0 42 42" fill="none">
        <circle
          cx="21"
          cy="21"
          r="16"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <motion.circle
          cx="21"
          cy="21"
          r="16"
          stroke="#52796f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 21 21)"
          initial={false}
          animate={
            prefersReduced || !active
              ? { pathLength: 1 }
              : { pathLength: [0, 1, 1, 0] }
          }
          transition={
            prefersReduced || !active
              ? { duration: 0.3 }
              : {
                  duration: 4.4,
                  repeat: Infinity,
                  ease: [0.65, 0, 0.35, 1],
                  times: [0, 0.55, 0.85, 1],
                }
          }
        />
        <motion.path
          d="M14 21 L19 26 L29 16"
          stroke="#52796f"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={
            prefersReduced || !active
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }
          }
          transition={
            prefersReduced || !active
              ? { duration: 0.3 }
              : {
                  duration: 4.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.55, 0.7, 0.85, 1],
                }
          }
        />
      </svg>
    </div>
  );
}

/* ── Tool table ──────────────────────────────────────────────────────── */

const TOOLS: Tool[] = [
  {
    name: "QuickBooks",
    caption: "CSV export today · direct sync on roadmap",
    status: "soon",
    rotation: -2.4,
    bobPeriod: 5.1,
    bobOffset: 0,
    Demo: LedgerDemo,
  },
  {
    name: "Xero",
    caption: "CSV export today · direct sync on roadmap",
    status: "soon",
    rotation: 1.8,
    bobPeriod: 4.3,
    bobOffset: 1.2,
    Demo: InvoiceTickerDemo,
  },
  {
    name: "Excel / Sheets",
    caption: "CSV export — every project, every timesheet",
    status: "live",
    rotation: -1.2,
    bobPeriod: 6.2,
    bobOffset: 2.0,
    Demo: SheetWaveDemo,
  },
  {
    name: "Stripe",
    caption: "Your Stroyka subscription, billed through Stripe",
    status: "live",
    rotation: 2.6,
    bobPeriod: 4.8,
    bobOffset: 0.8,
    Demo: StripeCardDemo,
  },
  {
    name: "PDF reports",
    caption: "Timesheet, P&L, materials — one click",
    status: "live",
    rotation: -2.2,
    bobPeriod: 3.7,
    bobOffset: 1.6,
    Demo: PdfFanDemo,
  },
  {
    name: "Cloud backup",
    caption: "Encrypted backup on Supabase storage",
    status: "live",
    rotation: 0.8,
    bobPeriod: 3.9,
    bobOffset: 2.4,
    Demo: CloudSyncDemo,
  },
];

/* ── Sticker card ────────────────────────────────────────────────────── */

function StickerCard({
  tool,
  isHovered,
  isAnyHovered,
  onHover,
  onLeave,
}: {
  tool: Tool;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  // Magnetic micro-tilt toward cursor (3° max), composed on top of the
  // sticker's resting rotation. We track raw mouse position normalized to
  // [-0.5, 0.5] and let the parent rotate combine via CSS transform stack.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(my, { stiffness: 220, damping: 20 });
  const tiltY = useSpring(mx, { stiffness: 220, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 6); // ±3deg
    my.set(((e.clientY - r.top) / r.height - 0.5) * -6);
  };

  // Resting rotation when not hovered, 0 when hovered (card straightens)
  const restRotate = isHovered ? 0 : tool.rotation;

  // Scale: hovered = up; another card hovered = recede; default = 1
  const targetScale = isHovered ? 1.04 : isAnyHovered ? 0.985 : 1;

  // Ambient bob — translateY oscillation, unique period per card
  const bobAmplitude = prefersReduced || isHovered ? 0 : 2.2;

  // CRISPNESS: only attach the magnetic 3D tilt while actually hovering.
  // At rest, the card sits in the 2D rendering pipeline (no preserve-3d,
  // no rotateX/Y MotionValues) — that keeps text rendering through the
  // standard subpixel antialiasing path instead of GPU-composited 3D
  // sampling, which is what was blurring the demo content.
  const restingStyle = { zIndex: 1 } as const;
  const hoveredStyle = prefersReduced
    ? ({ zIndex: 2 } as const)
    : {
        transformStyle: "preserve-3d" as const,
        rotateX: tiltX,
        rotateY: tiltY,
        zIndex: 2,
      };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onHover}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
        onLeave();
      }}
      onMouseMove={onMove}
      animate={{
        rotate: restRotate,
        scale: targetScale,
        y: 0,
      }}
      transition={{
        rotate: { type: "spring", stiffness: 220, damping: 22 },
        scale: { type: "spring", stiffness: 280, damping: 24 },
      }}
      style={isHovered ? hoveredStyle : restingStyle}
      className="relative cursor-pointer"
    >
      {/* Ambient bob — wraps the card so it doesn't fight the resting rotate.
          Whole-pixel y values (no fractions) so text never lands on subpixel
          coords. Bob disabled while hovered (the magnetic tilt takes over). */}
      <motion.div
        animate={
          prefersReduced || !inView || isHovered
            ? { y: 0 }
            : { y: [0, -Math.round(bobAmplitude), 0, Math.round(bobAmplitude * 0.6), 0] }
        }
        transition={
          prefersReduced || !inView || isHovered
            ? { duration: 0.3 }
            : {
                duration: tool.bobPeriod,
                delay: tool.bobOffset,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        className="card-stone relative rounded-2xl border border-ink/15 p-5 pt-7 hover:border-brand-sage/55 transition-colors"
        style={{
          boxShadow: isHovered
            ? "0 24px 48px -16px rgba(46,38,28,0.35), 0 0 0 1px rgba(132,169,140,0.25)"
            : "0 12px 28px -14px rgba(46,38,28,0.32)",
          transition: "box-shadow 220ms",
          // Crisp text inside transformed cards
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "geometricPrecision",
        }}
      >
        {/* Thumbtack — sage pin top-center */}
        <div
          aria-hidden
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-[2]"
        >
          <div className="relative">
            <span
              className="absolute inset-0 -m-1 rounded-full bg-ink/20 blur-[3px]"
              aria-hidden
            />
            <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-brand-forest border border-brand-sage-bright/40 shadow-inner">
              <Pin
                size={9}
                strokeWidth={2.4}
                className="text-brand-sage-mist"
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="font-display text-[16px] leading-tight text-ink">
            {tool.name}
          </p>
          {tool.status === "soon" && <SoonBadge />}
        </div>

        {/* Live demo */}
        <tool.Demo active={inView} />

        {/* Caption */}
        <p className="mt-3 font-mono text-[10.5px] tracking-[0.04em] text-ink-muted leading-snug">
          {tool.caption}
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * "Soon" badge with a sage arc that traces around its border continuously
 * — reads as in-progress build, not just a label.
 */
function SoonBadge() {
  const prefersReduced = useReducedMotion();
  return (
    <span className="relative inline-flex items-center font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-brand-forest px-1.5 py-0.5 rounded bg-brand-sage/15 border border-brand-sage/40">
      Soon
      {!prefersReduced && (
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          preserveAspectRatio="none"
        >
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="3"
            ry="3"
            fill="none"
            stroke="#52796f"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{ pathLength: 0.35, pathOffset: [0, 1] }}
            transition={{
              pathLength: { duration: 0.4 },
              pathOffset: { duration: 3.2, repeat: Infinity, ease: "linear" },
            }}
            style={{ opacity: 0.7 }}
          />
        </svg>
      )}
    </span>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */

export default function Integrations() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="relative bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] py-20 lg:py-28 overflow-hidden"
    >
      {/* Faint paper-grain corkboard texture — kept very subtle so it reads
          as material, not pattern. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 35%, #6B5C42 0px, transparent 1px), radial-gradient(circle at 70% 65%, #6B5C42 0px, transparent 1px), radial-gradient(circle at 45% 85%, #6B5C42 0px, transparent 1px)",
          backgroundSize: "8px 8px, 11px 11px, 7px 7px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <FadeIn>
            <SectionLabel>Plays well with others</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-4">
              Send your numbers where they need to go.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[15px] text-ink-soft max-w-lg leading-relaxed">
              CSV and PDF export today. Native integrations rolling out in 2026 — email us to move yours up the list.
            </p>
          </FadeIn>
        </div>

        {/* Pinboard. CSS grid with each sticker free to rotate beyond the
            grid bounds — neighbors recede on hover. */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8 md:gap-x-7 md:gap-y-10 [perspective:1200px]">
            {TOOLS.map((tool, i) => (
              <StickerCard
                key={tool.name}
                tool={tool}
                isHovered={hoverIdx === i}
                isAnyHovered={hoverIdx !== null}
                onHover={() => setHoverIdx(i)}
                onLeave={() => setHoverIdx(null)}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// MotionValue type pulled in to keep types tidy; not used externally.
export type _IntegrationsMV = MotionValue<number>;
