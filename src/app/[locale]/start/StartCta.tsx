"use client";

import { useEffect, useState } from "react";
import { withAttribution, withAttributionPath } from "@/lib/attribution";
import { SIGNUP_URL } from "@/lib/appLinks";

/**
 * The one client island on /start: the CTA's href.
 *
 * Server-rendered as the locale's `/get` (UA store redirect), because the
 * page exists for paid mobile traffic and a tap before hydration must still
 * land in a store. After hydration the href picks up the visitor's utm_* and
 * click ids (see lib/attribution) and a desktop visitor is re-pointed at the
 * web signup, where a phone app would be a dead end. Same routing as the
 * home hero's `useSignupHref`, with the pre-hydration default flipped for
 * this audience. No next-intl Link, no framer: the island must stay a few
 * hundred bytes.
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
    const search = window.location.search;
    setHref(
      isMobileVisitor()
        ? withAttributionPath(storePath, search)
        : withAttribution(SIGNUP_URL, search),
    );
  }, [storePath]);

  return (
    <a href={href} className={className} data-cta="start-primary">
      {label}
    </a>
  );
}

function isMobileVisitor(): boolean {
  const ua = navigator.userAgent || "";
  if (/android|iphone|ipod|ipad/i.test(ua)) return true;
  // iPadOS reports itself as a Mac; multi-touch is the tell.
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}
