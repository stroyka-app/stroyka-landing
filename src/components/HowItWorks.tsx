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
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // Amber progress rail (0..100) from when container enters viewport
      // until its bottom passes the upper viewport
      const raw =
        (vh * 0.5 - rect.top) / Math.max(1, container.offsetHeight * 0.8);
      setProgress(Math.max(0, Math.min(1, raw)) * 100);

      // Pick the step whose midpoint is closest to 45% of the viewport
      const els = container.querySelectorAll<HTMLElement>("[data-step]");
      let closest = 0;
      let best = Infinity;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const d = Math.abs(mid - vh * 0.45);
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
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            Four steps from signup to signed timesheet.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75">
              No 30-day implementation. No &ldquo;customer success&rdquo; call.
              You and your crew are running in an afternoon.
            </p>
          </FadeIn>
        </div>

        {/* Stage */}
        <div className="grid md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-12 lg:gap-24 items-start">
          {/* Steps column */}
          <div
            ref={stepsRef}
            className="flex flex-col gap-20 lg:gap-28 pb-[30vh]"
          >
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <div
                  key={step.num}
                  data-step={i}
                  className={`relative pl-16 transition-opacity duration-500 ease-out ${
                    isActive ? "opacity-100" : "opacity-35"
                  }`}
                >
                  {/* Vertical rail */}
                  <span
                    aria-hidden
                    className="absolute left-5 top-0 bottom-0 w-px bg-brand-sage-mist/10"
                  />
                  {/* Step number badge */}
                  <span
                    className={`absolute left-0 top-0 w-[42px] h-[42px] rounded-full flex items-center justify-center font-heading font-bold text-sm border z-10 transition-all duration-300 ${
                      isActive
                        ? "bg-brand-amber text-[#1a1108] border-brand-amber shadow-[0_0_24px_rgba(217,119,6,0.45)]"
                        : "bg-brand-midnight-dark text-brand-sage border-brand-sage/25"
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-3.5">
                    {step.title}
                  </h3>
                  <p className="text-brand-sage-mist/70 text-base leading-relaxed max-w-md">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Sticky phone */}
          <div className="hidden md:flex sticky top-[120px] justify-center items-start">
            <div className="relative w-[300px] lg:w-[340px]">
              {/* Amber progress rail on left edge of phone */}
              <div className="absolute -left-4 top-2 bottom-2 w-0.5 rounded bg-brand-sage-mist/10 overflow-hidden">
                <div
                  className="absolute inset-x-0 top-0 bg-gradient-to-b from-brand-amber-bright to-brand-amber transition-[height] duration-[250ms] ease-linear"
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
                      sizes="(min-width: 1024px) 340px, 300px"
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

          {/* Mobile: inline screenshot per step */}
          <div className="md:hidden flex flex-col gap-8">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="relative mx-auto w-[260px] rounded-[40px] p-[8px] bg-gradient-to-br from-[#3a4a52] to-[#24313a] shadow-xl"
              >
                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-20 h-[18px] bg-[#0e1518] rounded-[12px] z-10" />
                <div className="relative w-full aspect-[1206/2150] rounded-[32px] overflow-hidden bg-black/40">
                  <Image
                    src={s.screenshot}
                    alt={s.alt}
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
