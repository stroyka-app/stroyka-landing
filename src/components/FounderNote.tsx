"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * FounderNote — the human-face section.
 *
 * NOTE FOR MAKS: drop a photo at /public/founder.jpeg and set `photoSrc` to
 * "/founder.jpeg" to enable the portrait. While it's `null`, the component
 * renders the "M" monogram placeholder and never attempts to load an image
 * (so no 404 in the console).
 */
const FOUNDER = {
  name: "Maks Dalen",
  title: "Founder, Stroyka",
  location: "Austin, TX",
  photoSrc: null as string | null, // e.g. "/founder.jpeg" when the asset is ready
  body: [
    "I grew up on jobsites. My family ran a framing crew out of a spreadsheet, a clipboard, and a group chat that nobody had the energy to keep clean by the end of the week.",
    "Stroyka is the tool I wanted to hand my old man — flat pricing, works offline, takes an afternoon to learn. Nothing more, nothing less.",
  ],
  signatureName: "Maks",
};

export default function FounderNote() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <section id="founder" className="relative py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>Who&rsquo;s building this</SectionLabel>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 grid md:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center rounded-3xl border border-brand-forest/15 bg-gradient-to-br from-brand-deep/60 via-brand-midnight/70 to-brand-midnight/80 p-8 lg:p-12 backdrop-blur-sm"
        >
          {/* Soft glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-forest/15 blur-[80px]"
          />

          {/* Portrait */}
          <div className="relative flex-shrink-0 flex flex-col items-center md:block md:mx-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-2 ring-brand-forest/30 shadow-xl shadow-brand-midnight-dark/50">
              {/* Fallback initial — always rendered under the img */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-forest/30 to-brand-deep/60 flex items-center justify-center">
                <span className="font-heading font-bold text-5xl text-brand-sage-mist/30">
                  {FOUNDER.name.charAt(0)}
                </span>
              </div>
              {/* Only render the img when we have a photo path AND the load
                  hasn't failed. Unmounts entirely on error so the browser
                  can't leak the "broken image" alt-text UI. */}
              {FOUNDER.photoSrc && imgOk && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={FOUNDER.photoSrc}
                  alt=""
                  aria-hidden
                  className="relative w-full h-full object-cover"
                  onError={() => setImgOk(false)}
                />
              )}
            </div>
            {/* Location / role under portrait, mobile-only */}
            <div className="mt-4 text-center md:hidden">
              <p className="font-heading font-semibold text-white">
                {FOUNDER.name}
              </p>
              <p className="text-xs text-brand-sage-mist/55">
                {FOUNDER.title} · {FOUNDER.location}
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="relative">
            <div className="hidden md:block mb-4">
              <p className="font-heading font-semibold text-white text-lg">
                {FOUNDER.name}
              </p>
              <p className="text-sm text-brand-sage-mist/55">
                {FOUNDER.title} · {FOUNDER.location}
              </p>
            </div>

            <div className="space-y-4 text-[15.5px] leading-relaxed text-brand-sage-mist/80">
              {FOUNDER.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <p className="mt-6 font-heading italic text-brand-sage text-lg">
              — {FOUNDER.signatureName}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
