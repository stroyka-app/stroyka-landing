/**
 * Carries acquisition params across the getstroyka.com → app.getstroyka.com hop.
 *
 * The app and the marketing site are different origins, so a visitor arriving
 * at `getstroyka.com/?utm_source=facebook` and clicking "Get started" used to
 * land on a bare `app.getstroyka.com/signup`. PostHog then recorded
 * `$initial_referring_domain: getstroyka.com` and no source at all — every
 * campaign routed through the landing page lost its attribution at the last
 * hop, which is exactly the hop that matters.
 *
 * PostHog stores `$initial_utm_*` as person properties, and person-on-events
 * carries them onto NATIVE events after the install too, so a param that
 * survives this hop is still attached when that person invites their crew
 * weeks later. Losing it here loses it everywhere.
 */

/**
 * Params worth forwarding. Deliberately a fixed allow-list rather than
 * "everything": the landing page carries its own params (`plan`, `coupon`,
 * `billing`, `token`, `status`) that mean something different on the app side,
 * and blindly forwarding them could pre-fill or corrupt a signup.
 */
const FORWARDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  // Ad-platform click ids — PostHog reads these as their own attribution.
  "gclid",
  "fbclid",
  "ttclid",
  "msclkid",
  // Our own short-links and QR codes use these.
  "ref",
  "src",
] as const;

/**
 * Returns [base] with any acquisition params from [search] appended.
 *
 * - Params already present on [base] win; we never overwrite an explicit link.
 * - Returns [base] untouched when there is nothing to forward, so ordinary
 *   organic links stay clean.
 * - Never throws: a malformed [base] or [search] yields [base].
 */
export function withAttribution(base: string, search: string): string {
  try {
    const incoming = new URLSearchParams(search);
    const url = new URL(base);

    let added = false;
    for (const key of FORWARDED_PARAMS) {
      const value = incoming.get(key);
      if (value === null || value === "") continue;
      if (url.searchParams.has(key)) continue;
      url.searchParams.set(key, value);
      added = true;
    }

    return added ? url.toString() : base;
  } catch {
    return base;
  }
}
