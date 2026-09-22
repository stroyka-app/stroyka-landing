/**
 * Where the visitor is, for consent purposes only.
 *
 * The EEA and the UK require opt-IN before advertising cookies are set. We do
 * not run a consent banner, so the honest alternative is not to set them there
 * at all — which costs us nothing, because every campaign we run is targeted
 * at the United States.
 */

/** EU 27 + the three EEA states + the UK. */
const CONSENT_REQUIRED = new Set([
  // EU
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // EEA, not EU
  'IS', 'LI', 'NO',
  // UK — post-Brexit, PECR still requires opt-in
  'GB',
]);

/** The cookie the middleware writes. Two letters, nothing else. */
export const GEO_COOKIE = 'sx_geo';

/**
 * True when advertising cookies must not be set without consent.
 *
 * UNKNOWN COUNTRY COUNTS AS CONSENT-REQUIRED. The header is absent in local
 * dev and could be absent behind some proxy; defaulting to "load the pixel"
 * would mean a misconfiguration silently reopens the exact hole this closes.
 * Failing closed costs us a few US visitors' attribution at worst.
 */
export function consentRequired(country: string | undefined | null): boolean {
  if (!country) return true;
  return CONSENT_REQUIRED.has(country.toUpperCase());
}
