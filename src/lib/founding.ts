/**
 * Founding-20 counter — single source of truth.
 *
 * The number MUST reflect real paid founding subscriptions. A scarcity
 * counter showing spots that nobody has claimed is a false claim: it is the
 * same category of statement as putting a fake testimonial on the page, and
 * fabricated "X spots remaining" urgency is a deceptive practice under FTC
 * guidance.
 *
 * Default is 0 deliberately. If the env var is unset we under-claim rather
 * than over-claim. Update NEXT_PUBLIC_FOUNDING_SPOTS_TAKEN when a founding
 * subscription is actually paid, or wire it to Stripe and delete the env var.
 *
 * At zero the UI switches to invitation framing ("all 20 open · be the first
 * crew in") instead of rendering an empty progress bar and a counter that
 * animates to nothing. For an early adopter weighing a v1 app from a solo
 * founder, "you'd be first and you get my direct attention" is a stronger
 * offer than "14 left" — and it has the advantage of being true.
 */
export const FOUNDING_SPOTS_TOTAL = 20;

export const FOUNDING_SPOTS_TAKEN = Math.min(
  FOUNDING_SPOTS_TOTAL,
  Math.max(0, Number(process.env.NEXT_PUBLIC_FOUNDING_SPOTS_TAKEN ?? 0) || 0),
);

export const FOUNDING_SPOTS_REMAINING = Math.max(
  0,
  FOUNDING_SPOTS_TOTAL - FOUNDING_SPOTS_TAKEN,
);

/** No spots claimed yet — render invitation framing, not scarcity framing. */
export const FOUNDING_NONE_CLAIMED = FOUNDING_SPOTS_TAKEN === 0;
