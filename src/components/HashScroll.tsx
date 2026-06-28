"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

/**
 * HashScroll — makes hash anchor navigation land exactly on target,
 * smoothly, on the first click — from the navbar, the footer, in-page CTAs,
 * and cross-route (e.g. /demo or /get-started → /#pricing).
 *
 * Three things were breaking it:
 *  1. The lazy R3F section (#plan-to-done, height:500vh) reserved only 60vh
 *     while loading, so targets below it sat ~440vh too high until it
 *     mounted — native hash jumps landed on the hero. Fixed at the source by
 *     reserving the real height in HomeClient's loading placeholder.
 *  2. The browser's native hash jump fought Lenis on same-page clicks
 *     ("works on the second click"). Fixed here by intercepting in-page
 *     anchor clicks and driving Lenis directly — no native jump.
 *  3. Browser scroll restoration on reload fought our positioning. Fixed by
 *     taking manual control while mounted.
 *
 * Mounted on every locale home route (/  /es  /ru …), where the hash
 * targets live. Works for any href containing a `#` — locale prefix agnostic.
 */
const NAV_OFFSET = 80;

function idFromHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const m = href.match(/#(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function HashScroll() {
  useEffect(() => {
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -NAV_OFFSET });
      } else {
        const top =
          el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
      }
      return true;
    };

    // Landing on /#hash (cross-route load, hashchange, back/forward). The
    // R3F height is reserved now, so one scroll lands correctly; a single
    // corrective pass covers any minor late shift (web fonts, images).
    const settleToHash = () => {
      const id = idFromHref(window.location.hash);
      if (!id) return;
      scrollToId(id);
      window.setTimeout(() => scrollToId(id), 250);
    };

    // Intercept in-page anchor clicks so Lenis owns the scroll (no native
    // jump to fight). Only intercepts when the target section exists on the
    // current page (locale home); falls through to normal navigation otherwise
    // (cross-route: /demo → /es#pricing), then settleToHash handles landing.
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      const id = idFromHref(anchor?.getAttribute("href"));
      if (!id) return;
      // Only intercept when the target section is present on THIS page.
      // On locale homes (/  /es  /ru) the sections exist; on other pages
      // they don't, so the click falls through to a full navigation.
      if (!document.getElementById(id)) return;
      e.preventDefault();
      history.pushState(null, "", `${window.location.pathname}#${id}`);
      scrollToId(id);
    };

    const initial = window.setTimeout(settleToHash, 60);
    window.addEventListener("hashchange", settleToHash);
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", settleToHash);
      document.removeEventListener("click", onClick);
      history.scrollRestoration = prevRestoration;
    };
  }, []);

  return null;
}
