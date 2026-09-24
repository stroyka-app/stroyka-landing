"use client";

import { useEffect, useState } from "react";
import { withAttributionPath } from "@/lib/attribution";
import { trackCta } from "@/lib/track";

/**
 * The one client island on /start: the CTA's href.
 *
 * Server-rendered as the locale's `/get` (phones forward to their store,
 * desktops see the two badges), because the page exists for paid mobile
 * traffic and a tap before hydration must still land in a store. After
 * hydration the href picks up the visitor's utm_* and click ids (see
 * lib/attribution). It no longer re-points desktops at the web signup: the
 * site stopped creating web accounts on 2026-09-13 (see `useSignupHref`).
 * No next-intl Link, no framer: the island must stay a few hundred bytes.
 * `trackCta` adds nothing to that budget — posthog-js is already in this
 * route's bundle via PostHogAnalytics, which sits outside SiteChrome and so
 * still runs here even though the motion chrome does not.
 *
 * THE TAP IS THE ONLY CONVERSION THIS PAGE CAN REPORT. `/start` exists for
 * paid traffic, and `cta_start_free` maps to the Meta standard event `Lead`
 * (lib/track), so firing it is what lets the pixel optimise toward people who
 * act instead of people whose page merely finished loading. The September
 * review traced $57 of wasted Meta spend to exactly that: "Meta has been
 * optimising toward page loaded, because that is all it can see." The home
 * page was instrumented in that pass and this island was missed — it is the
 * one page built solely for ads, so it is the one that could least afford it.
 */
export default function StartCta({
  locale,
  label,
  className,
}: {
  locale: string;
  label: string;
  className: string;
}) {
  const storePath = locale === "en" ? "/get" : `/${locale}/get`;
  const [href, setHref] = useState(storePath);

  useEffect(() => {
    setHref(withAttributionPath(storePath, window.location.search));
  }, [storePath]);

  return (
    <a
      href={href}
      className={className}
      data-cta="start-primary"
      onClick={() => trackCta("cta_start_free", { location: "start", locale })}
    >
      <span>{label}</span>
      {/* The site's CTA knob (VisButton's shape) without its runtime: an
          inline arrow that slips out of the corner and back on hover, pure
          CSS, so the island stays a few hundred bytes. */}
      <span
        aria-hidden
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-site-on-vis text-site-vis"
      >
        <Arrow className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6 group-hover:translate-x-6 motion-reduce:transition-none" />
        <Arrow className="absolute -translate-x-6 translate-y-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none" />
      </span>
    </a>
  );
}

function Arrow({ className }: { className: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
