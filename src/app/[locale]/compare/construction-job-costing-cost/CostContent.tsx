"use client";

import { motion } from "motion/react";
import { Lock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CrewCostCalculator from "@/components/compare/CrewCostCalculator";
import FlapText from "@/components/site/ui/FlapText";
import VisButton from "@/components/site/ui/VisButton";
import { useReduced } from "@/components/site/ui/useReduced";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import {
  COMPETITORS,
  HIDDEN_PRICING,
  HIDDEN_PRICING_SOURCE,
  STROYKA_PLANS,
} from "@/data/competitors";

/**
 * /compare/construction-job-costing-cost
 *
 * WHY THIS PAGE EXISTS. On 2026-09-23 we finally ran the test the ChatGPT
 * signal had been asking for since August: three unbranded queries a
 * contractor would actually type, in English and Russian. Stroyka appeared in
 * none of them. Ask for us BY NAME and the answer is accurate and
 * flattering — so the site is not the problem, the problem is that nobody
 * knows the name to type.
 *
 * What did appear, over and over, was one shape of page: a vendor's own
 * "7 best X" comparison. Workyard owned five of nine results on the first
 * query. The assistant cites those listicles as neutral sources. That is the
 * mechanic, and it is reproducible.
 *
 * So this is our entry in that format — built on the one axis where the
 * incumbents' own pages hand us the comparison, and where a small contractor
 * actually makes the decision. Not offline-first: Maks's call, 2026-09-23,
 * and he is right that nobody in the trade shops for an architecture. They
 * shop for a tool that works and a bill they can live with.
 *
 * THE PAGE'S CREDIBILITY IS ITS ONLY ASSET. Every figure traces to
 * src/data/competitors.ts, every competitor claim is quoted from a published
 * page, and the "when to pick them instead" section is sincere. A comparison
 * page that only flatters its author is an ad, and assistants are getting
 * better at telling the difference.
 *
 * LOOK (2026-09-24): Morning Bone, the home's system. One bone page, the
 * calculator as the hero object on a slab card, editorial sections set as
 * kicker + headline on the left and argument on the right, hairline lists,
 * mono footnotes, and the forest close the home ends on.
 */

const WHEN_THEY_WIN = [
  {
    who: "Workyard",
    why: "You need GPS accuracy as a payroll-grade audit trail — theirs is the strongest in the category, and if disputed hours are your actual problem, that is worth paying per seat for.",
  },
  {
    who: "Knowify",
    why: "You run AIA billing, lien waivers or progress invoicing against contracts. That is a specialised workflow we do not have and are not building.",
  },
  {
    who: "Procore · Buildertrend",
    why: "You are coordinating subs, submittals, RFIs and drawings across large commercial jobs. Different product, different problem, and a crew of ten is not who they are for.",
  },
  {
    who: "A spreadsheet",
    why: "One job, one guy, and you already know where the money went. Genuinely — do not pay for software to tell you something you can hold in your head.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const H2 =
  "font-flex text-[clamp(2rem,3.8vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.03em] [font-variation-settings:'wdth'_110]";

const LINK =
  "underline decoration-site-paper/30 underline-offset-[3px] transition-colors hover:text-site-vis hover:decoration-site-vis/60";

/** Rise-in on scroll. Opacity + transform only; instant under reduced motion. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReduced();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Mono section kicker: index, then name, in the accent. */
function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">
      <span className="text-site-paper/40">{n}</span>
      <span aria-hidden className="h-px w-6 bg-site-vis/40" />
      {children}
    </p>
  );
}

/**
 * An editorial section: kicker + headline on the left (sticky on desktop so
 * it stays with its argument), the argument itself on the right.
 */
function Section({
  n,
  kicker,
  title,
  children,
}: {
  n: string;
  kicker: string;
  title: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid gap-10 border-t border-site-paper/10 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Kicker n={n}>{kicker}</Kicker>
          <FlapText lines={title} className={H2} />
        </div>
        <div className="min-w-0 lg:pt-10">{children}</div>
      </div>
    </section>
  );
}

export default function CostContent() {
  const signupUrl = useSignupHref();
  const track = useCtaTracker("compare-cost");
  const reduced = useReduced();

  return (
    <>
      <Navbar />
      <main className="bg-site-night text-site-paper">
        {/* ══ HERO + THE CALCULATOR ═══════════════════════════════════════ */}
        <section className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-32 md:px-10 md:pb-12 md:pt-40">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, delay: 0.05, ease: EASE }}
            className="mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-site-vis" />
            Cost comparison · 2026
          </motion.p>

          {/* Trailing spaces keep the h1's text content a sentence for
              crawlers and assistants; the lines are blocks visually. */}
          <FlapText
            as="h1"
            immediate
            delay={0.1}
            lines={[
              "What job costing software ",
              <>
                <span className="text-site-vis">actually costs</span> for a{" "}
              </>,
              "10-person crew",
            ]}
            className="max-w-[16ch] font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110] sm:max-w-none"
          />

          {/* Phones read intro → calculator → footnote; desktop puts the
              footnote under the intro, beside the calculator. */}
          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.45, ease: EASE }}
              className="max-w-md text-[17px] leading-relaxed text-site-paper/75 lg:col-start-1 lg:row-start-1"
            >
              Most construction software charges per person. Hire a fourth
              framer and the bill goes up — again. Here is the arithmetic, with
              every figure taken from the vendor&rsquo;s own published page.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.3, ease: EASE }}
              className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <CrewCostCalculator />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.6, ease: EASE }}
              className="-mt-4 max-w-md font-mono text-[11.5px] leading-relaxed text-site-paper/50 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-start lg:border-t lg:border-site-paper/10 lg:pt-5"
            >
              Drag to your crew size. Prices verified{" "}
              <time dateTime="2026-09-23">23 September 2026</time> from each
              vendor&rsquo;s published pricing — sources listed below.
            </motion.p>
          </div>
        </section>

        {/* ══ WHY THE SHAPE OF THE BILL MATTERS ═══════════════════════════ */}
        <Section
          n="01"
          kicker="The shape of the bill"
          title={["Per-seat pricing ", "taxes you ", "for growing"]}
        >
          <Reveal>
            <div className="max-w-[640px] space-y-5 text-[16.5px] leading-relaxed text-site-paper/70">
              <p>
                Construction crews are not fixed. You are eight people in
                February and fifteen in July, and a per-seat contract turns
                every seasonal hire into a line item someone has to remember to
                cancel in October.
              </p>
              <p>
                It also puts the software quietly at odds with you. The tool
                that is supposed to tell you whether a job made money gets more
                expensive precisely when you take on more work.
              </p>
              <p className="font-medium text-site-paper">
                Stroyka is flat. Free covers a crew of five, Starter covers
                fifteen, Pro is unlimited. Adding a labourer on Monday does not
                change what you pay on the first.
              </p>
            </div>
          </Reveal>

          {/* Plan ladder */}
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {STROYKA_PLANS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={
                  reduced ? { duration: 0 } : { delay: 0.06 * i, duration: 0.45, ease: EASE }
                }
                className="flex flex-col rounded-[22px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55">
                  {p.name}
                </p>
                <p className="mt-4 leading-none">
                  <span className="font-flex text-[44px] font-semibold tracking-[-0.02em] tabular-nums">
                    ${p.monthly}
                  </span>
                  <span className="ml-1 text-[13px] text-site-paper/50">/mo</span>
                </p>
                <div className="mt-5 border-t border-site-paper/10 pt-4">
                  <p className="text-[14px] font-medium leading-snug text-site-vis">
                    {p.maxWorkers === Infinity
                      ? "Unlimited workers"
                      : `Up to ${p.maxWorkers} workers`}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-site-paper/55">{p.caps}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ══ THE ONES THAT WON'T TELL YOU ════════════════════════════════ */}
        <Section
          n="02"
          kicker="The quote wall"
          title={["Most of this ", "category won’t ", "tell you the ", "price at all"]}
        >
          <Reveal>
            <p className="max-w-[640px] text-[16.5px] leading-relaxed text-site-paper/70">
              Not as a comparison point — as a fact about your Sunday evening.
              You cannot find out what these cost without booking a call and
              sitting through a demo:
            </p>
          </Reveal>

          <ul className="mt-9 border-t border-site-paper/15">
            {HIDDEN_PRICING.map((h, i) => (
              <motion.li
                key={h.name}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={reduced ? { duration: 0 } : { delay: 0.035 * i, duration: 0.4, ease: EASE }}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-b border-site-paper/10 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-4"
              >
                <Lock
                  size={13}
                  strokeWidth={2}
                  className="translate-y-[1px] self-center text-site-paper/40"
                  aria-hidden
                />
                <span className="text-[16px] font-medium">{h.name}</span>
                <span className="col-start-2 text-[13.5px] leading-snug text-site-paper/55 sm:col-start-3 sm:max-w-[22rem] sm:text-right">
                  {h.detail}
                </span>
              </motion.li>
            ))}
          </ul>

          <Reveal>
            <p className="mt-5 font-mono text-[11.5px] leading-relaxed text-site-paper/50">
              Compiled from{" "}
              <a
                href={HIDDEN_PRICING_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                Workyard&rsquo;s own comparison of job costing software
              </a>
              , 23 September 2026.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 flex items-start gap-4 rounded-[22px] bg-site-vis/[0.07] p-6 ring-1 ring-inset ring-site-vis/25 md:p-7">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-site-vis text-site-on-vis">
                <Check size={14} strokeWidth={2.75} aria-hidden />
              </span>
              <p className="text-[16px] leading-relaxed text-site-paper">
                Stroyka&rsquo;s prices are on this page, on the pricing page,
                and in both app stores. You never have to ask anyone what it
                costs.
              </p>
            </div>
          </Reveal>
        </Section>

        {/* ══ WHEN TO PICK THEM INSTEAD ═══════════════════════════════════ */}
        <Section
          n="03"
          kicker="Honestly"
          title={["When you should ", "pick one of ", "them instead"]}
        >
          <Reveal>
            <p className="max-w-[640px] text-[16.5px] leading-relaxed text-site-paper/70">
              Cheaper is not the same as right. Four cases where we are the
              wrong answer:
            </p>
          </Reveal>

          <ol className="mt-9 border-t border-site-paper/15">
            {WHEN_THEY_WIN.map((w, i) => (
              <li key={w.who} className="border-b border-site-paper/10 last:border-b-0">
                <Reveal
                  delay={0.05 * i}
                  className="grid gap-2 py-6 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-site-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-flex text-[19px] font-semibold leading-tight tracking-[-0.01em]">
                      {w.who}
                    </span>
                  </p>
                  <p className="text-[15.5px] leading-relaxed text-site-paper/70">{w.why}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Section>

        {/* ══ SOURCES ═════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid gap-8 border-t border-site-paper/10 pb-24 pt-14 md:pb-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
            <h2 className="flex h-fit items-center gap-3 font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-site-vis">
              <span className="text-site-paper/40">04</span>
              <span aria-hidden className="h-px w-6 bg-site-vis/40" />
              Sources
            </h2>
            <Reveal>
              <ol className="space-y-4">
                {COMPETITORS.map((c, i) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] font-mono text-[12px] leading-relaxed text-site-paper/55"
                  >
                    <span className="text-site-paper/35">[{i + 1}]</span>
                    <span>
                      <span className="font-medium text-site-paper/85">{c.name}</span> — {c.model}.{" "}
                      {c.note}{" "}
                      <a href={c.source} target="_blank" rel="noopener noreferrer" className={LINK}>
                        Source
                      </a>
                      , <span className="whitespace-nowrap">verified {c.verifiedOn}.</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 max-w-[560px] border-t border-site-paper/10 pt-5 text-[13.5px] leading-relaxed text-site-paper/55">
                Prices change. If you find a figure here that is out of date or
                wrong, tell us and we will correct it — a comparison nobody can
                trust is worth nothing to anybody.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══ CTA ═════════════════════════════════════════════════════════ */}
        {/* The forest close, same field the home's Finale ends on, so the
            two routes land the same way. */}
        <section className="relative overflow-hidden bg-site-vis text-site-on-vis">
          <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
            <FlapText
              lines={["Run one job ", "through it"]}
              plate="rgb(var(--site-on-vis))"
              className="font-flex text-[clamp(2.8rem,8vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.04em] [font-variation-settings:'wdth'_118]"
            />
            <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <p className="max-w-md text-[17px] leading-relaxed text-site-on-vis/80 md:text-[18px]">
                Free covers three active jobs and a crew of five, with job costing
                and invoicing included. No card, no call.
              </p>
              <div>
                <VisButton
                  href={signupUrl}
                  variant="dark"
                  size="lg"
                  onClick={() => track("compare_cost_cta")}
                >
                  Start free
                </VisButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
