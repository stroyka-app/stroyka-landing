"use client";

import { useEffect, useState } from "react";

// Colors indexed by SECTION_IDS order in src/app/page.tsx. Keep in sync.
// Interleaved dark-teal progression. Adjacent values are close enough that
// linear interpolation across a section boundary never crosses a hue —
// all values sit on the same blue-grey axis, just at different luminance.
// The R3F scene at `plan-to-done` locks its own ground/fog to #2f3e46, so
// that slot matches exactly (avoids a body-vs-canvas color mismatch).
const SECTION_COLORS = [
  "#2f3e46", // hero
  "#2a363d", // the-shift
  "#32434b", // how-it-works
  "#2d3c43", // features
  "#2f3e46", // plan-to-done  (matches the R3F canvas's own midnight backdrop)
  "#2d3c43", // comparison
  "#32434b", // founder
  "#2d3c43", // integrations
  "#2a363d", // pricing
  "#2f3e46", // guarantee
  "#32434b", // faq
  "#354f52", // cta           (brand-deep — highlights the action band)
  "#2f3e46", // footer
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1)}`;
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function useSectionColors(sectionIds: string[]): string {
  const [bgColor, setBgColor] = useState(SECTION_COLORS[0]);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY + vh / 2;

      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          const progress = (scrollY - top) / el.offsetHeight;
          const currentColor = SECTION_COLORS[i] || SECTION_COLORS[0];
          const nextColor = SECTION_COLORS[i + 1] || currentColor;
          setBgColor(interpolateColor(currentColor, nextColor, progress));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return bgColor;
}
