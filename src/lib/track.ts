import posthog from "posthog-js";

/**
 * Conversion events for the marketing funnel.
 *
 * One call fans out to both sinks we run: PostHog gets every event under its
 * own name, and the Meta Pixel gets the handful of standard events it can
 * optimise against. Each sink is guarded on its own, so a page with only one
 * of them configured still records to that one, and a server render records
 * to neither.
 *
 * Callers pass `location` (which component the click came from) and `locale`
 * so the same event can be split by placement and language. The
 * `useCtaTracker` hook fills both in; call this directly only outside React.
 */

export type CtaProps = Record<string, string | number | boolean>;

/** Meta standard events we emit. Anything else stays PostHog-only. */
const META_EVENT: Record<string, "Lead" | "InitiateCheckout" | "Contact" | "Purchase"> = {
  cta_start_free: "Lead",
  store_badge_clicked: "Lead",
  plan_selected: "InitiateCheckout",
  demo_submitted: "Contact",
  checkout_success: "Purchase",
};

type Fbq = (action: "track", event: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function trackCta(name: string, props: CtaProps = {}): void {
  if (typeof window === "undefined") return;
  capturePostHog(name, props);
  captureMeta(name, props);
}

function capturePostHog(name: string, props: CtaProps): void {
  // `__loaded` flips once `posthog.init` has run (PostHogAnalytics, gated on
  // NEXT_PUBLIC_POSTHOG_KEY). Capturing before that would queue into an SDK
  // that never initialises on preview builds.
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !posthog.__loaded) return;
  try {
    posthog.capture(name, props);
  } catch {
    // Analytics must never break a click.
  }
}

function captureMeta(name: string, props: CtaProps): void {
  const metaEvent = META_EVENT[name];
  const fbq = window.fbq;
  if (!metaEvent || typeof fbq !== "function") return;

  const params = metaParams(metaEvent, props);
  if (params === null) return;

  try {
    fbq("track", metaEvent, params);
  } catch {
    // Analytics must never break a click.
  }
}

/**
 * Returns the Meta payload for [metaEvent], or `null` when the event must not
 * fire. Purchase without a value would teach Meta's optimiser that our
 * conversions are worth nothing, so it is skipped rather than sent empty.
 */
function metaParams(
  metaEvent: string,
  props: CtaProps,
): Record<string, unknown> | null {
  switch (metaEvent) {
    case "InitiateCheckout":
      return typeof props.plan === "string" ? { content_name: props.plan } : {};
    case "Purchase":
      return typeof props.value === "number" && props.value > 0
        ? { value: props.value, currency: "USD" }
        : null;
    default:
      return {};
  }
}
