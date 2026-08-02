"use client";

import { useEffect, useState } from "react";
import { withAttribution } from "../attribution";

/**
 * Decorates an outbound app link with the acquisition params the visitor
 * arrived on. See `withAttribution`.
 *
 * Reads `window.location.search` in an effect rather than `useSearchParams()`
 * on purpose: `useSearchParams()` opts the calling route out of static
 * rendering unless it sits inside a Suspense boundary, and these CTAs live on
 * the top-level marketing page, which should stay static. The trade-off is one
 * render with the undecorated URL — invisible in practice, since hydration
 * lands long before a human reads the hero and reaches for the button, and the
 * fallback is simply today's behaviour.
 */
export function useAttributedUrl(base: string): string {
  const [url, setUrl] = useState(base);

  useEffect(() => {
    setUrl(withAttribution(base, window.location.search));
  }, [base]);

  return url;
}
