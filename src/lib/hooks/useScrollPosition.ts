"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/**
 * Current vertical scroll position.
 *
 * Uses useSyncExternalStore so the value reflects the *actual* window.scrollY
 * on every render — including the first render after a remount (e.g. a locale
 * switch). The previous useState(0) + scroll-listener version reset to 0 on
 * remount and only corrected once the user scrolled, which made the navbar
 * briefly drop its scrolled background after switching language.
 */
export function useScrollPosition(): number {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY, // client: live value, correct immediately on mount
    () => 0 // server snapshot
  );
}
