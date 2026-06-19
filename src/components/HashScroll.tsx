"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

/**
 * HashScroll — corrects anchor navigation to `/#section` on the home route.
 *
 * The home page lazy-mounts a tall R3F section (#plan-to-done) behind a
 * ~60vh placeholder. A native hash jump fires before that section expands,
 * so the browser scrolls to a position computed against the short
 * placeholder — landing short of any target *below* it (Pricing → into the
 * R3F frame, FAQ → into FounderNote). This waits until the document height
 * settles (R3F expanded), then scrolls once to the real target via Lenis
 * (falling back to native), so the landing position is correct. It also
 * smooths same-page hash changes from the navbar.
 *
 * Mounted only on the home route, where the lazy R3F section lives.
 */
const NAV_OFFSET = 80;

export default function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash.length < 2) return;
      const id = decodeURIComponent(hash.slice(1));

      let tries = 0;
      let lastHeight = -1;
      let stableTicks = 0;

      const tick = () => {
        const el = document.getElementById(id);
        const height = document.documentElement.scrollHeight;

        if (height === lastHeight) {
          stableTicks += 1;
        } else {
          stableTicks = 0;
          lastHeight = height;
        }

        // Scroll once the layout has settled (R3F expanded) or we give up.
        if (el && (stableTicks >= 3 || tries >= 40)) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(el, { offset: -NAV_OFFSET });
          } else {
            const top =
              el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
            window.scrollTo({ top, behavior: "smooth" });
          }
          return;
        }

        if (tries < 60) {
          tries += 1;
          window.setTimeout(tick, 50);
        }
      };

      tick();
    };

    // Run once on mount (covers cross-route landing on /#hash) after a tick,
    // then on every same-page hash change (navbar clicks while on home).
    const initial = window.setTimeout(scrollToHash, 60);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
