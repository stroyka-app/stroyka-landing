"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import CrewCostCalculator from "@/components/compare/CrewCostCalculator";
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

export default function CostContent() {
  const signupUrl = useSignupHref();
  const track = useCtaTracker("compare-cost");
  const prefersReduced = useReducedMotion();

  return (
    <>
      <Navbar />
      {/* ONE CONTINUOUS RAMP, TOP TO BOTTOM.
          #E3DCC9 → #D4CBB4 → #BFB49C → forest → #2B3D30, where every
          section's `to` colour is the next section's `from`. The site's home
          page has worked this way since v4 (see HomeClient's Bridge helper):
          there is no hard edge anywhere, because a hard edge between two warm
          stones reads as a rendering mistake rather than a section break.
          The first version of this page set three of its five sections to a
          flat bone and dropped straight into the dark CTA, which is exactly
          what Maks caught on 2026-09-23. */}
      <main className="bg-bone">
      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-clip px-6 pb-16 pt-28 sm:pt-36"
        style={{ background: "linear-gradient(to bottom, #E3DCC9, #E3DCC9)" }}
      >
        {/* Ambient warmth behind the hero. Pure decoration, transform-free. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] opacity-70"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 40%, rgba(138,170,145,0.22), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn triggerOnMount>
            <SectionLabel>Cost comparison · 2026</SectionLabel>
          </FadeIn>

          <FadeIn triggerOnMount delay={0.05}>
            <h1 className="font-display text-[40px] font-light leading-[1.08] tracking-[-0.01em] text-ink sm:text-[58px]">
              What job costing software
              <br className="hidden sm:block" />{" "}
              <span className="italic">actually costs</span> for a
              <br className="hidden sm:block" /> 10-person crew
            </h1>
          </FadeIn>

          <FadeIn triggerOnMount delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl font-body text-[17px] leading-relaxed text-ink-soft">
              Most construction software charges per person. Hire a fourth
              framer and the bill goes up — again. Here is the arithmetic, with
              every figure taken from the vendor&rsquo;s own published page.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ THE CALCULATOR ════════════════════════════════════════════ */}
      <section
        className="px-6 pb-24"
        style={{ background: "linear-gradient(to bottom, #E3DCC9, #E3DCC9)" }}
      >
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <CrewCostCalculator />
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="mt-5 text-center font-body text-[12.5px] leading-relaxed text-ink-muted">
              Drag to your crew size. Prices verified{" "}
              <time dateTime="2026-09-23">23 September 2026</time> from each
              vendor&rsquo;s published pricing — sources listed below.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ WHY THE SHAPE OF THE BILL MATTERS ═════════════════════════ */}
      <section
        className="px-6 py-24"
        style={{ background: "linear-gradient(to bottom, #E3DCC9, #D4CBB4)" }}
      >
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <SectionLabel>The shape of the bill</SectionLabel>
            <h2 className="font-display text-[30px] font-light leading-tight text-ink sm:text-[38px]">
              Per-seat pricing taxes you for growing
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mt-8 space-y-5 font-body text-[16px] leading-relaxed text-ink-soft">
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
              <p className="font-medium text-ink">
                Stroyka is flat. Free covers a crew of five, Starter covers
                fifteen, Pro is unlimited. Adding a labourer on Monday does not
                change what you pay on the first.
              </p>
            </div>
          </FadeIn>

          {/* Plan ladder */}
          <FadeIn delay={0.14}>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {STROYKA_PLANS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-bone-warm/45 bg-bone/70 p-5"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-muted">
                    {p.name}
                  </p>
                  <p className="mt-2 font-display text-[30px] font-light leading-none text-ink">
                    ${p.monthly}
                    <span className="ml-1 font-body text-[13px] text-ink-muted">/mo</span>
                  </p>
                  <p className="mt-3 font-body text-[13px] leading-snug text-ink-soft">
                    {p.maxWorkers === Infinity
                      ? "Unlimited workers"
                      : `Up to ${p.maxWorkers} workers`}
                  </p>
                  <p className="mt-1 font-body text-[12.5px] leading-snug text-ink-muted">
                    {p.caps}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ THE ONES THAT WON'T TELL YOU ══════════════════════════════ */}
      <section
        className="px-6 py-24"
        style={{ background: "linear-gradient(to bottom, #D4CBB4, #BFB49C)" }}
      >
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <SectionLabel>The quote wall</SectionLabel>
            <h2 className="font-display text-[30px] font-light leading-tight text-ink sm:text-[38px]">
              Most of this category won&rsquo;t tell you the price at all
            </h2>
            <p className="mt-6 font-body text-[16px] leading-relaxed text-ink-soft">
              Not as a comparison point — as a fact about your Sunday evening.
              You cannot find out what these cost without booking a call and
              sitting through a demo:
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="mt-8 divide-y divide-bone-warm/40 border-y border-bone-warm/40">
              {HIDDEN_PRICING.map((h, i) => (
                <motion.li
                  key={h.name}
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.035 * i, duration: 0.4 }}
                  className="flex items-start gap-3 py-3.5"
                >
                  <Lock size={14} className="mt-1 flex-shrink-0 text-ink-muted" strokeWidth={2} />
                  <span className="font-heading text-[15px] font-medium text-ink">{h.name}</span>
                  <span className="ml-auto text-right font-body text-[13px] leading-snug text-ink-muted">
                    {h.detail}
                  </span>
                </motion.li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="mt-5 font-body text-[12.5px] leading-relaxed text-ink-muted">
              Compiled from{" "}
              <a
                href={HIDDEN_PRICING_SOURCE}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-ink-muted/40 underline-offset-2 hover:text-ink-soft"
              >
                Workyard&rsquo;s own comparison of job costing software
              </a>
              , 23 September 2026.
            </p>
          </FadeIn>

          <FadeIn delay={0.16}>
            <div className="mt-10 rounded-2xl border border-brand-sage/40 bg-brand-sage-mist/30 p-6">
              <p className="flex items-start gap-3 font-body text-[15px] leading-relaxed text-ink">
                <Check size={16} className="mt-1 flex-shrink-0 text-brand-forest" strokeWidth={2.5} />
                <span>
                  Stroyka&rsquo;s prices are on this page, on the pricing page,
                  and in both app stores. You never have to ask anyone what it
                  costs.
                </span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ WHEN TO PICK THEM INSTEAD ═════════════════════════════════ */}
      <section
        className="px-6 py-24"
        style={{ background: "linear-gradient(to bottom, #BFB49C, #BFB49C)" }}
      >
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <SectionLabel>Honestly</SectionLabel>
            <h2 className="font-display text-[30px] font-light leading-tight text-ink sm:text-[38px]">
              When you should pick one of them instead
            </h2>
            <p className="mt-6 font-body text-[16px] leading-relaxed text-ink-soft">
              Cheaper is not the same as right. Four cases where we are the
              wrong answer:
            </p>
          </FadeIn>

          <div className="mt-9 space-y-6">
            {WHEN_THEY_WIN.map((w, i) => (
              <FadeIn key={w.who} delay={0.05 * i}>
                <div className="border-l-2 border-clay/50 pl-5">
                  <p className="font-heading text-[15px] font-semibold text-ink">{w.who}</p>
                  <p className="mt-1.5 font-body text-[15px] leading-relaxed text-ink-soft">
                    {w.why}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOURCES ═══════════════════════════════════════════════════ */}
      <section
        className="px-6 pb-28 pt-4"
        style={{ background: "linear-gradient(to bottom, #BFB49C, #B3AC93)" }}
      >
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
              Sources
            </h2>
            <ul className="mt-4 space-y-3">
              {COMPETITORS.map((c) => (
                <li key={c.id} className="font-body text-[13px] leading-relaxed text-ink-muted">
                  <span className="font-medium text-ink-soft">{c.name}</span> — {c.model}.{" "}
                  {c.note}{" "}
                  <a
                    href={c.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-ink-muted/40 underline-offset-2 hover:text-ink-soft"
                  >
                    Source
                  </a>
                  , verified {c.verifiedOn}.
                </li>
              ))}
            </ul>
            <p className="mt-6 font-body text-[12.5px] leading-relaxed text-ink-muted">
              Prices change. If you find a figure here that is out of date or
              wrong, tell us and we will correct it — a comparison nobody can
              trust is worth nothing to anybody.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════ */}
      {/* The stone-to-forest descent, lifted verbatim from CTABanner so the
          two CTAs on the site land the same way. A flat `bg-brand-deep` here
          cut straight from warm stone to dark green in one pixel and read as
          a broken image — the whole point of the ramp is that the page
          arrives at the dark rather than jumping to it. The drafting grid is
          the home CTA's motif too, masked out before the footer so no
          horizontal seam appears where the pattern stops. */}
      <section className="relative overflow-hidden px-6 pb-40 pt-8">
        {/* THE DESCENT. Nine stops, not four, and none of them grey.
            The first attempt reused CTABanner's ramp verbatim, whose midpoint
            is #8A8A74 — a desaturated olive. Between warm stone and forest
            green that colour has no chroma to carry the eye across, so it
            read as a dirty band rather than a transition (Maks, 2026-09-23).
            On the home page it survives because it sits under a full-bleed
            headline; here it was bare.

            This path instead ADDS green while it drops lightness, one step
            at a time, so every adjacent pair is close enough to blend and no
            step is a colour the palette does not already contain. It also
            starts from #B3AC93 — the colour the Sources section above ends
            on — so there is no boundary to see, and it runs over a taller
            section so the shift is gradual rather than compressed. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, #B3AC93 0%, #ADA78F 8%, #A2A087 17%, #8F9779 26%, #778A6C 36%, #5C7458 46%, #475B48 56%, #384A3B 65%, #2F4134 72%, #2B3D30 78%, #2B3D30 100%)",
          }}
        />
        {/* The grid now carries the GREEN as well as the dark. Held back to
            the bottom half, it left the mid-green stretch as an untextured
            wash, and a large flat field of one colour reads as "too much
            green" even when the ramp itself is correct — Maks diagnosed it
            exactly ("maybe bc the 3d grid takes too less space", 2026-09-24).
            Starting it at 14% gives that region structure to sit on.

            It is still fully gone by 88% — well before the section ends. The
            footer is flat #2B3D30 with no texture, so a grid still running
            at the boundary makes a seam out of a colour match: the tone is
            identical either side, and the eye reads the texture stopping as
            an edge. That is the line Maks saw under the CTA on 2026-09-23.
            Same reason CTABanner masks its own grid; mine simply stopped too
            late. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.085]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E3DCC9 1px, transparent 1px), linear-gradient(to bottom, #E3DCC9 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 14%, black 34%, black 74%, transparent 88%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 14%, black 34%, black 74%, transparent 88%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl pt-[22vh] text-center sm:pt-[26vh]">
          <FadeIn>
            <h2 className="font-display text-[32px] font-light leading-tight text-bone sm:text-[44px]">
              Run one job through it
            </h2>
            <p className="mx-auto mt-5 max-w-md font-body text-[16px] leading-relaxed text-brand-sage-mist">
              Free covers three active jobs and a crew of five, with job costing
              and invoicing included. No card, no call.
            </p>
            <div className="mt-9 flex justify-center">
              <Button href={signupUrl} onClick={() => track("compare_cost_cta")}>
                Start free
                <ArrowRight size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
