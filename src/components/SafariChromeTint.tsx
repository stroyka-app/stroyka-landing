"use client";

import { useEffect } from "react";

/**
 * iOS 26 ("Liquid Glass") Safari derives each toolbar's tint from the
 * background-color of a position:fixed element near that screen edge
 * (within ~4px of it, ≥80% viewport width, ≥3px tall). It ignores
 * theme-color entirely, and at scrollY=0 it never composites real page
 * pixels behind the top status bar — sites that look "transparent" up
 * there are really serving a tint that matches the pixels underneath
 * (1ar.io/updates/safari-26-liquid-glass-web). So we run one fixed
 * sliver per edge and keep them in sync with the page:
 *
 * BOTTOM — inactive by default (no sample source → Safari keeps its
 * transparent glass bar, which already looks right over the hero and
 * light/textured sections) and flips to a solid tint only while a
 * flat-dark section sits under the bar (those frost to pale sage
 * otherwise).
 *
 * TOP — always active on iOS: with no sample source the status-bar zone
 * frosts the root canvas (a flat green band over the hero — the "sand
 * eyebrow" in its post-canvas-fix form). At rest over the hero it wears
 * the hero's rendered top color; once the navbar's dark glass is up
 * (scrolled >50, or any non-home page where the navbar is dark from
 * scroll 0) it wears the nav glass composited over the section behind
 * the top edge, so status bar + navbar read as one continuous surface.
 *
 * The Navbar itself is deliberately invisible to Safari's sampler (its
 * glass lives on an absolute child — the "fixed element trap" fix), so
 * these slivers are the single tint source per edge. iOS-phone-only via
 * the @supports gate in globals.css.
 */

type RGB = readonly [number, number, number];

const BOTTOM_TARGETS: ReadonlyArray<{ id: string; color: string }> = [
  { id: "plan-to-done", color: "#4E6253" }, // flat sage-olive 3D canvas
  { id: "footer", color: "#2B3D30" }, // flat forest footer
];

/* Top-edge colors. Hero is Playwright-sampled from the rendered page at
   phone width (#485348) — its CSS gradient start #34453A is a lie once
   the blueprint texture lightens it. Bone sections share one mid tone;
   through the 72% nav glass the family differences vanish. */
const BONE_MID: RGB = [212, 203, 180]; // #D4CBB4
const TOP_TARGETS: ReadonlyArray<{ id: string; color: RGB }> = [
  { id: "hero", color: [72, 83, 72] }, // #485348 rendered hero top
  { id: "plan-to-done", color: [78, 98, 83] }, // #4E6253
  { id: "cta", color: [43, 61, 48] }, // #2B3D30
  { id: "footer", color: [43, 61, 48] }, // #2B3D30
];

/* Navbar scrolled glass = rgba(30,46,36,0.72) + blur. Approximate the
   blur by flat-compositing the glass over the section's base color. */
const NAV_GLASS: RGB = [30, 46, 36];
const NAV_ALPHA = 0.72;

const rgb = (c: RGB): string => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

const overNavGlass = (behind: RGB): RGB => [
  Math.round(NAV_ALPHA * NAV_GLASS[0] + (1 - NAV_ALPHA) * behind[0]),
  Math.round(NAV_ALPHA * NAV_GLASS[1] + (1 - NAV_ALPHA) * behind[1]),
  Math.round(NAV_ALPHA * NAV_GLASS[2] + (1 - NAV_ALPHA) * behind[2]),
];

const sectionColorAt = <T,>(
  probeY: number,
  targets: ReadonlyArray<{ id: string; color: T }>,
): T | null => {
  for (const t of targets) {
    const node = document.getElementById(t.id);
    if (!node) continue;
    const r = node.getBoundingClientRect();
    if (r.top <= probeY && r.bottom >= probeY) return t.color;
  }
  return null;
};

export default function SafariChromeTint() {
  useEffect(() => {
    const bottomEl = document.getElementById("safari-bottom-tint");
    const topEl = document.getElementById("safari-top-tint");
    if (!bottomEl || !topEl) return;

    let raf = 0;
    const apply = () => {
      raf = 0;

      // Bottom bar: probe just above the very bottom edge.
      const bottomColor = sectionColorAt(window.innerHeight - 2, BOTTOM_TARGETS);
      if (bottomColor) {
        bottomEl.style.backgroundColor = bottomColor;
        bottomEl.dataset.active = "true";
      } else {
        bottomEl.dataset.active = "false";
        bottomEl.style.backgroundColor = "transparent";
      }

      // Top status bar: section behind the top edge, seen through the
      // nav glass whenever the navbar carries its dark surface (mirrors
      // Navbar's `scrolled = !isHome || scrollY > 50`).
      const behind = sectionColorAt(2, TOP_TARGETS) ?? BONE_MID;
      const navGlassUp =
        !document.getElementById("hero") || window.scrollY > 50;
      topEl.style.backgroundColor = rgb(navGlassUp ? overNavGlass(behind) : behind);
      topEl.dataset.active = "true";
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="safari-top-tint" aria-hidden />
      <div id="safari-bottom-tint" aria-hidden />
    </>
  );
}
