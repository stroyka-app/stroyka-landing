"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

/**
 * HashScroll — a thin adapter that routes hash-anchor scrolling through Lenis
 * WHEN LENIS IS ACTIVE (desktop, motion on). When Lenis is off (reduced-motion
 * or touch — see SmoothScroll), clicks are left alone: the deterministic native
 * base handles anchors via CSS scroll-behavior:smooth + scroll-margin-top, so
 * there is no JS single-point-of-failure and no Lenis-vs-native fight. The one
 * native-path job is re-settling a /#hash LANDING after the post-mount layout
 * swap (see settleNativeLanding).
 *
 * Lenis-active responsibilities:
 *  1. In-page anchor clicks → drive Lenis directly (no native jump to fight).
 *  2. Cross-route / reload landing on /#hash (e.g. /demo → /es#pricing, or a
 *     reload). The lazy R3F section (#plan-to-done, 500vh) reserves its real
 *     height in HomeClient's placeholder, so one scroll lands correctly; a
 *     single corrective pass covers any minor late shift (fonts, images).
 *  3. Manual scroll restoration while mounted, so the browser doesn't restore
 *     a prior position on top of our landing.
 *
 * Mounted on every locale home route (/  /es  /ru …). Offset comes from the
 * shared --nav-offset token so it can never drift from the CSS scroll-margin.
 */
function idFromHref(href: string | null | undefined): string | null {
  if (!href) return null;
  const m = href.match(/#(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function navOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-offset")
    .trim();
  // --nav-offset is in rem; resolve against the root font size.
  const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  if (raw.endsWith("rem")) return parseFloat(raw) * rootFont;
  if (raw.endsWith("px")) return parseFloat(raw);
  return 80;
}

/** Real user scroll intent — any of these cancels a pending native landing fix. */
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;
/** How long a native /#hash landing keeps re-settling on layout changes. */
const NATIVE_SETTLE_MS = 4000;

export default function HashScroll() {
  useEffect(() => {
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const scrollToId = (id: string) => {
      const lenis = getLenis();
      if (!lenis) return; // native path owns scrolling when Lenis is off
      const el = document.getElementById(id);
      if (!el) return;
      lenis.scrollTo(el, { offset: -navOffsetPx() });
    };

    const settleToHash = () => {
      if (!getLenis()) return; // browser's native #hash jump handles it
      const id = idFromHref(window.location.hash);
      if (!id) return;
      scrollToId(id);
      window.setTimeout(() => scrollToId(id), 250);
    };

    // Native path, LANDING only (Lenis off: touch or reduced motion). The
    // browser/Next fragment jump fires against the SERVER layout, but the
    // Lift swaps its 760vh desktop markup after mount (PhoneLift on phones,
    // height:auto under reduced motion) and fonts reflow, so the target ends
    // up thousands of px away. Re-settle after layout (double rAF), then
    // after the Lift swap (~300ms) and fonts (~900ms). Those are the usual
    // beats, not guarantees: on a slow device the Lift can hydrate seconds
    // after us, so for NATIVE_SETTLE_MS a ResizeObserver on <body> also
    // re-lands on every page-height change. scrollIntoView honours
    // scroll-margin-top (= --nav-offset); "instant" because a correction
    // should snap like the fragment jump it repairs, not glide 5000px. The
    // moment the user scrolls we stop — never fight a real gesture.
    const nativeTimers: number[] = [];
    let nativeRaf = 0;
    let nativeRo: ResizeObserver | null = null;
    const cancelNative = () => {
      cancelAnimationFrame(nativeRaf);
      nativeTimers.forEach((t) => window.clearTimeout(t));
      nativeTimers.length = 0;
      nativeRo?.disconnect();
      nativeRo = null;
      USER_SCROLL_EVENTS.forEach((ev) => window.removeEventListener(ev, cancelNative));
    };
    const settleNativeLanding = () => {
      const id = idFromHref(window.location.hash);
      if (!id) return;
      const land = () => {
        // SmoothScroll's effect runs after ours (parent after child); if
        // Lenis came up after all, the Lenis branch owns the landing.
        if (getLenis()) return;
        document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
      };
      USER_SCROLL_EVENTS.forEach((ev) => window.addEventListener(ev, cancelNative, { passive: true }));
      nativeRaf = requestAnimationFrame(() => {
        nativeRaf = requestAnimationFrame(land);
      });
      nativeRo = new ResizeObserver(land);
      nativeRo.observe(document.body);
      nativeTimers.push(
        window.setTimeout(land, 300),
        window.setTimeout(land, 900),
        window.setTimeout(cancelNative, NATIVE_SETTLE_MS),
      );
    };
    settleNativeLanding();

    // Intercept in-page anchor clicks ONLY when Lenis is active; otherwise let
    // the click proceed natively (scroll-margin + CSS smooth do the work).
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
      if (!getLenis()) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      const id = idFromHref(anchor?.getAttribute("href"));
      if (!id) return;
      // Only intercept when the target exists on THIS page. On locale homes
      // the sections exist; on other pages they don't, so the click falls
      // through to a full navigation and settleToHash lands it on arrival.
      if (!document.getElementById(id)) return;
      e.preventDefault();
      history.pushState(null, "", `${window.location.pathname}#${id}`);
      scrollToId(id);
    };

    const initial = window.setTimeout(settleToHash, 60);
    window.addEventListener("hashchange", settleToHash);
    document.addEventListener("click", onClick);
    return () => {
      cancelNative();
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", settleToHash);
      document.removeEventListener("click", onClick);
      history.scrollRestoration = prevRestoration;
    };
  }, []);

  return null;
}
