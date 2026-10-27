"use client";

import type { MouseEvent } from "react";

/** Every route's `<main>` carries this id (and `tabIndex={-1}` so it can take focus). */
export const MAIN_ID = "main";

/**
 * "Skip to content" — the first focusable element on every page (WCAG 2.4.1).
 * Invisible until it receives keyboard focus, then a sage pill in the top-left
 * corner above the nav.
 *
 * Focus is moved by hand: on the home page HashScroll intercepts in-page
 * anchor clicks to drive Lenis, which would scroll without moving focus, and
 * a skip link that does not move focus skips nothing for a keyboard user.
 */
export default function SkipLink({ label }: { label: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById(MAIN_ID);
    if (!main) return;
    e.preventDefault();
    main.focus();
  };

  return (
    <a
      href={`#${MAIN_ID}`}
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[calc(env(safe-area-inset-top,0px)+12px)] focus:z-[200] focus:rounded-full focus:bg-site-vis focus:px-5 focus:py-3 focus:text-[14px] focus:font-medium focus:text-site-on-vis focus:outline-none focus:ring-2 focus:ring-site-vis focus:ring-offset-2 focus:ring-offset-site-night"
    >
      {label}
    </a>
  );
}
