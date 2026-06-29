"use client";

import { useEffect } from "react";

/**
 * Keeps <meta name="theme-color"> in sync with whatever section sits behind the
 * iOS Safari bottom toolbar (the bottom edge of the viewport). iOS frosts the
 * bar, so it's never a pixel-perfect match — but tracking the section's color
 * means the bar *follows* the page (dark over the footer, light over light
 * sections) instead of being a single fixed mismatched tint. This is how sites
 * like Slack make the bar read as "transparent": a scroll-driven theme-color,
 * not actual transparency (which the web can't do for the bottom bar).
 */

const BONE = "#E3DCC9"; // bg-bone — the light default

// Sections whose visible background is dark but painted via CSS gradients or a
// WebGL canvas, so DOM background-color sampling can't see it. Mapped to the
// representative color the user sees at that section's edge.
const DARK_SECTIONS: Record<string, string> = {
  hero: "#2f3e46",
  "plan-to-done": "#2f3e46", // R3F canvas backdrop
  cta: "#2B3D30",
  footer: "#2B3D30",
};

function rgbToHex(rgb: string): string | null {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return null;
  const [r, g, b, a] = m.map(Number);
  if (a === 0) return null; // fully transparent → keep looking up the tree
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

// Walk up from the element at the bottom-center of the viewport to the nearest
// ancestor with a solid background color. Handles all solid-bg sections
// (including the #2B3D30 footer) directly.
function sampleBottomBg(): string {
  const x = Math.round(window.innerWidth / 2);
  const y = window.innerHeight - 2;
  let node = document.elementFromPoint(x, y) as Element | null;
  while (node && node !== document.documentElement) {
    const hex = rgbToHex(getComputedStyle(node).backgroundColor);
    if (hex) return hex;
    node = node.parentElement;
  }
  return BONE;
}

// Dark gradient/canvas sections that sampling would miss → explicit color.
function darkSectionAtBottom(): string | null {
  const y = window.innerHeight - 2;
  for (const [id, color] of Object.entries(DARK_SECTIONS)) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom >= y) return color;
  }
  return null;
}

export default function DynamicThemeColor() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const color = darkSectionAtBottom() ?? sampleBottomBg();
      meta!.setAttribute("content", color);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
