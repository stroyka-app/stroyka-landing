"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { trackCta, type CtaProps } from "../track";

/**
 * `trackCta` bound to one component.
 *
 * Every conversion event carries `location` (the component the click came
 * from) and `locale`; this hook fills both in so call sites read as
 * `track("cta_start_free")` and cannot forget either.
 */
export function useCtaTracker(location: string) {
  const locale = useLocale();
  return useCallback(
    (name: string, props: CtaProps = {}) =>
      trackCta(name, { location, locale, ...props }),
    [location, locale],
  );
}
