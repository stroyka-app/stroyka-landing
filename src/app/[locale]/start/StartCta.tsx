"use client";

import { useEffect, useState } from "react";
import { withAttributionPath } from "@/lib/attribution";

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
    <a href={href} className={className} data-cta="start-primary">
      {label}
    </a>
  );
}
