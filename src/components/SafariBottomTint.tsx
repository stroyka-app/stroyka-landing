"use client";

import { useEffect } from "react";

/**
 * ⚠️ DO NOT DELETE OR "SIMPLIFY" THIS COMPONENT. (2026-07-31)
 *
 * It was removed once ("the bottom bar frosts content natively, this is
 * redundant") and the result was a STALE PALE-SAGE PLATE stuck over the
 * page behind the URL bar after visiting the 3D house — because iOS 26
 * re-samples its toolbar tint ONLY on render-tree changes, and this
 * component's display:none↔block toggles at section boundaries are
 * exactly those changes. It is both the tint source over the flat-dark
 * sections AND the mechanism that keeps Safari's tint in sync everywhere
 * else. Full post-mortem: tasks/lessons.md ("the old sliver was also the
 * un-latcher").
 *
 * ────────────────────────────────────────────────────────────────────
 *
 * iOS 26 ("Liquid Glass") Safari tints its bottom toolbar from the
 * background-color of a position:fixed element near the bottom edge (it ignores
 * theme-color). We want the bar to stay TRANSPARENT GLASS — showing the page
 * through it — over the hero and the light/textured sections (that already
 * looks clean), and only switch on a solid tint over the two FLAT-DARK sections
 * that otherwise frost to pale sage: the 3D-house scroll story and the footer.
 *
 * So the fixed #safari-bottom-tint sliver is inactive (display:none, set in
 * globals.css) by default — Safari then falls back to its transparent glass —
 * and we flip it to display:block with the matching color ONLY while one of
 * those sections sits under the bar. The CSS gate keeps it iOS-phone-only;
 * this effect just toggles data-active + the color.
 */
const TARGETS: ReadonlyArray<{ id: string; color: string }> = [
  { id: "plan-to-done", color: "#4E6253" }, // flat sage-olive 3D canvas
  { id: "footer", color: "#2B3D30" }, // flat forest footer
];

export default function SafariBottomTint() {
  useEffect(() => {
    const el = document.getElementById("safari-bottom-tint");
    if (!el) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      // Probe just above the very bottom edge, where the toolbar sits.
      const probeY = window.innerHeight - 2;
      let color: string | null = null;
      for (const t of TARGETS) {
        const node = document.getElementById(t.id);
        if (!node) continue;
        const r = node.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          color = t.color;
          break;
        }
      }
      if (color) {
        el.style.backgroundColor = color;
        el.dataset.active = "true";
      } else {
        el.dataset.active = "false";
        el.style.backgroundColor = "transparent";
      }
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

  return <div id="safari-bottom-tint" aria-hidden />;
}
