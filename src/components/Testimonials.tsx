"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mike R.",
    role: "General Contractor, Denver",
    quote:
      "Stroyka replaced three different apps we were using. The crew actually uses it because it works offline at every site.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Project Manager, Austin",
    quote:
      "I finally know where every dollar goes before the project ends. No more spreadsheet nightmares.",
    stars: 5,
  },
  {
    name: "Carlos M.",
    role: "Crew Lead, Phoenix",
    quote:
      "My guys submit time and requests from their phones in 30 seconds. Even in the basement with zero signal.",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400 fill-amber-400"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-brand-forest/20 flex items-center justify-center shrink-0">
      <span className="text-sm font-heading font-semibold text-brand-sage">
        {initials}
      </span>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-6 min-w-[320px] snap-start flex flex-col">
      <StarRating count={testimonial.stars} />
      <blockquote className="text-sm text-brand-sage-mist/80 italic leading-relaxed flex-1 mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <Avatar name={testimonial.name} />
        <div>
          <p className="text-sm font-heading font-bold text-brand-sage-mist">
            {testimonial.name}
          </p>
          <p className="text-xs text-brand-sage-mist/50">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  return (
    <section id="testimonials" className="py-16 lg:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <FadeIn>
          <SectionLabel>What Crews Are Saying</SectionLabel>
        </FadeIn>
        <TextReveal
          as="h2"
          className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
        >
          Trusted by real construction teams
        </TextReveal>
      </div>

      {/* Scrollable card track with fade-edge masks */}
      <div className="relative">
        {/* Left fade mask */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--color-bg, #2f3e46), transparent)",
          }}
          aria-hidden="true"
        />
        {/* Right fade mask */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
          style={{
            background:
              "linear-gradient(to left, var(--color-bg, #2f3e46), transparent)",
          }}
          aria-hidden="true"
        />

        {prefersReduced ? (
          /* Static layout for users who prefer reduced motion */
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-8 pb-4 scrollbar-hide">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        ) : (
          /* Animated auto-scroll ticker — duplicated for seamless loop */
          <motion.div
            ref={trackRef}
            className="flex gap-6 px-8 pb-4 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
