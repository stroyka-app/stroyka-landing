"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Step {
  num: string;
  title: string;
  body: string;
  screenshot: string;
  alt: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Create your first project",
    body:
      "Name, address, plan number, and a rough budget. You're set up in under a minute — no onboarding call, no sales demo.",
    screenshot: "/screenshots/projects.jpeg",
    alt: "Projects list screen",
  },
  {
    num: "02",
    title: "Invite your crew",
    body:
      "Text them a link. They install in 30 seconds and tap their name. Workers only see what matters to them — their tasks, their hours, their paystub.",
    screenshot: "/screenshots/worker-view.jpeg",
    alt: "Worker home screen",
  },
  {
    num: "03",
    title: "Run the day, on the phone",
    body:
      "Crew clocks in, logs materials and fuel, closes tasks. Everything works offline and syncs when signal comes back — no lost data, no duplicated entries.",
    screenshot: "/screenshots/tasks.jpeg",
    alt: "Tasks and requests screen",
  },
  {
    num: "04",
    title: "Run the numbers",
    body:
      "End of week, open the Report tab. Labor, materials, fuel, plan vs. actual — ready to export as PDF or CSV for your bookkeeper.",
    screenshot: "/screenshots/reports.jpeg",
    alt: "Reports and P&L screen",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const container = stepsRef.current;
      if (!container) return;
      const vh = window.innerHeight;
      const targetY = vh * 0.45;

      const els = container.querySelectorAll<HTMLElement>("[data-step]");
      if (els.length < 2) return;

      const firstRect = els[0].getBoundingClientRect();
      const lastRect = els[els.length - 1].getBoundingClientRect();
      const firstMid = firstRect.top + firstRect.height / 2;
      const lastMid = lastRect.top + lastRect.height / 2;

      // Progress rail maps the focus-line's position between the midpoint of
      // step 1 (0%) and the midpoint of step 4 (100%). That way each step
      // owns exactly a 1/(N-1) slice of the rail and the bar fills in lock-
      // step with the step you're looking at, not with how far the container
      // has scrolled.
      const denom = lastMid - firstMid;
      const p = denom > 0 ? (targetY - firstMid) / denom : 0;
      setProgress(Math.max(0, Math.min(1, p)) * 100);

      // Active step = step whose midpoint is closest to the focus line
      let closest = 0;
      let best = Infinity;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - targetY);
        if (d < best) {
          best = d;
          closest = i;
        }
      });
      setActive(closest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="how-it-works" className="relative bg-bone py-28 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-20 lg:mb-24">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            Four steps from signup to signed timesheet.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              No 30-day implementation. No &ldquo;customer success&rdquo; call.
              You and your crew are running in an afternoon.
            </p>
          </FadeIn>
        </div>

        {/* Stage — phone column widened so it reads as a proper counterpart
            to the text, not a postage stamp in the corner. */}
        <div className="grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_460px] gap-10 lg:gap-20 items-start">
          {/* Steps column */}
          <div
            ref={stepsRef}
            className="flex flex-col gap-16 md:gap-20 lg:gap-28 md:pb-[30vh]"
          >
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <div
                  key={step.num}
                  data-step={i}
                  className={`relative md:pl-16 transition-opacity duration-500 ease-out ${
                    // Active-opacity dimming only applies on desktop where the
                    // sticky phone provides the "active" visual anchor. On
                    // mobile, every step has its own inline screenshot so every
                    // step should be fully legible.
                    isActive ? "opacity-100" : "md:opacity-35 opacity-100"
                  }`}
                >
                  <div className="pl-16 md:pl-0">
                    {/* Vertical rail */}
                    <span
                      aria-hidden
                      className="absolute left-5 md:left-5 top-0 bottom-0 w-px bg-ink/15"
                    />
                    {/* Step number badge */}
                    <span
                      className={`absolute left-0 top-0 w-[44px] h-[44px] rounded-full flex items-center justify-center font-mono text-[12px] tracking-[0.08em] z-10 transition-all duration-300 ${
                        isActive
                          ? "bg-ink text-bone border border-ink"
                          : "bg-bone-soft text-ink-muted border border-ink/20"
                      }`}
                    >
                      {step.num}
                    </span>
                    <h3 className="font-display text-3xl lg:text-4xl leading-[1.05] text-ink mb-4">
                      {step.title}
                    </h3>
                    <p className="text-ink-soft text-[16px] leading-relaxed max-w-md">
                      {step.body}
                    </p>
                  </div>

                  {/* Mobile inline screenshot — lives WITH its step, not dumped
                      at the bottom. Hidden on desktop where the sticky phone
                      handles the visual. */}
                  <div className="md:hidden mt-6 flex justify-center">
                    <div className="relative w-[240px] rounded-[36px] p-[8px] bg-gradient-to-br from-[#3a4a52] to-[#24313a] shadow-xl">
                      <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-16 h-[15px] bg-[#0e1518] rounded-[10px] z-10" />
                      <div className="relative w-full aspect-[1206/2150] rounded-[28px] overflow-hidden bg-black/40">
                        <Image
                          src={step.screenshot}
                          alt={step.alt}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky phone — desktop only */}
          <div className="hidden md:flex sticky top-[120px] justify-center items-start">
            <div className="relative w-[360px] lg:w-[420px]">
              {/* Ink progress rail on left edge of phone */}
              <div className="absolute -left-4 top-2 bottom-2 w-0.5 rounded bg-ink/15 overflow-hidden">
                <div
                  className="absolute inset-x-0 top-0 bg-ink transition-[height] duration-[250ms] ease-linear"
                  style={{ height: `${progress}%` }}
                />
              </div>

              {/* Phone body */}
              <div className="relative rounded-[44px] p-[10px] bg-gradient-to-br from-[#3a4a52] to-[#24313a] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(202,210,197,0.08),0_0_80px_rgba(82,121,111,0.18)]">
                {/* Notch */}
                <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-24 h-[22px] bg-[#0e1518] rounded-[14px] z-10" />

                {/* Screen */}
                <div className="relative w-full aspect-[1206/2150] rounded-[34px] overflow-hidden bg-black/40">
                  {STEPS.map((s, i) => (
                    <Image
                      key={s.num}
                      src={s.screenshot}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 420px, 360px"
                      priority={i === 0}
                      className={`object-cover transition-opacity duration-[600ms] ease-out ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
