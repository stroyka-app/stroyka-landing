"use client";

import { MotionConfig } from "motion/react";
import HashScroll from "@/components/HashScroll";
import Navbar from "@/components/Navbar";
import Lift from "./lift/Lift";
import Ticker from "./ticker/Ticker";
import Shoebox from "./shoebox/Shoebox";
import KnowEvery from "./know/KnowEvery";
import FeatureStack from "./stack/FeatureStack";
import SeatMath from "./seats/SeatMath";
import Plans from "./plans/Plans";
import Answers from "./answers/Answers";
import Finale from "./finale/Finale";
import SiteFooter from "./finale/SiteFooter";
import PaletteSwitcher from "./ui/PaletteSwitcher";

/**
 * The dusk-site home (experiment/opus55-wow).
 *
 *   Lift ─ hero + the crane building Job 204 out of its own costs
 *   Ticker ─ the day on a real job, hi-vis tape
 *   Shoebox ─ the mess today (throwable) → sorted in one click
 *   KnowEvery ─ scroll-synced word spotlight
 *   FeatureStack ─ four stacking cards, each a working vignette
 *   SeatMath ─ drag your crew size: per-seat vs flat
 *   Plans ─ pricing
 *   Answers ─ FAQ
 *   Finale ─ hi-vis close
 */
export default function SiteHome() {
  return (
    <MotionConfig reducedMotion="user">
    <main className="relative bg-site-night">
      <HashScroll />
      <Navbar />
      <Lift />
      {/* Ground of the scene → night page. */}
      <div aria-hidden className="h-24 bg-gradient-to-b from-[var(--scene-ground)] to-site-night md:h-32" />
      <Ticker />
      <Shoebox />
      <KnowEvery />
      <FeatureStack />
      <SeatMath />
      <Plans />
      <Answers />
      <Finale />
      <SiteFooter />
      <PaletteSwitcher />
    </main>
    </MotionConfig>
  );
}
