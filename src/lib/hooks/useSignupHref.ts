"use client";

import { useEffect, useState } from "react";
import { withAttributionPath } from "../attribution";

/** `/get` forwards phones to their store and shows desktops the two badges. */
const STORE_REDIRECT_PATH = "/get";

/**
 * Where "Start free" sends this visitor: `/get`, for everyone.
 *
 * It used to split by device — phones to `/get`, desktops to the web signup
 * on app.getstroyka.com — on the argument that a desktop visitor cannot
 * install a phone app. The 2026-09-13 audit of ninety days of web-app usage
 * found nobody who used the web app from a desktop: every returning web user
 * was on an iPhone in Safari, and the desktop web signups were one-day
 * visitors who never came back. The web app is being wound down (see the
 * app repo's design decisions of that date), so the site stops creating
 * web accounts. A desktop visitor now lands on `/get`, which shows the two
 * store badges and asks them to open the link on their phone.
 *
 * Client-side only to pick up the visitor's utm_* and click ids after
 * hydration (see lib/attribution); the pre-hydration href is already the
 * right path, just without attribution.
 */
export function useSignupHref(): string {
  const [href, setHref] = useState(STORE_REDIRECT_PATH);

  useEffect(() => {
    setHref(withAttributionPath(STORE_REDIRECT_PATH, window.location.search));
  }, []);

  return href;
}
