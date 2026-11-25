/**
 * Owner fill-ins for the legal pages (privacy, terms, delete-account, DPA,
 * sub-processors). Every value in `{CURLY_CAPS}` renders LITERALLY until it
 * is replaced, so before deploying: `grep -rn "{[A-Z_]*}" src/lib/legal.ts`
 * must print nothing.
 */

/** Business address of Dalen Meridian LLC (the PO Box used in our email signature). */
export const POSTAL_ADDRESS = "PO Box 5203, Round Rock, TX 78683, USA";

/** GDPR Art. 27 representative in the EU: name, postal address, email. Needs a paid representative service. */
export const EU_REPRESENTATIVE = "{EU_REPRESENTATIVE}";
/** UK GDPR Art. 27 representative in the UK: name, postal address, email. */
export const UK_REPRESENTATIVE = "{UK_REPRESENTATIVE}";

/**
 * The date the deferred changes take effect: 30 days after the documents are
 * published AND the notice email is sent (Terms 15.1 and Privacy 15.1
 * promise 30 days' notice of material changes). One date for every deferred
 * change — the worker-account-deletion change (Privacy 9.3/9.6, Terms 7.6,
 * /delete-account §3, DPA 4.3), the mass-arbitration clause (Terms 16.7) and
 * the arbitration opt-out deadline for existing users (Terms 16.6), our right
 * to end the Service on notice (Terms 17.3) and the new change-notice rules
 * (Terms 15.2, Privacy 15.2). Written out in each language, e.g.
 * "8 January 2027" / "8 de enero de 2027" / "8 января 2027 г.".
 */
export const NOTICE_EFFECTIVE_EN = "{EFFECTIVE_DATE}";
export const NOTICE_EFFECTIVE_ES = "{EFFECTIVE_DATE}";
export const NOTICE_EFFECTIVE_RU = "{EFFECTIVE_DATE}";

/** The publication date shown as "Last updated". Set it to the deploy date. */
export const LAST_UPDATED_EN = "24 November 2026";
export const LAST_UPDATED_ES = "24 de noviembre de 2026";
export const LAST_UPDATED_RU = "24 ноября 2026 г.";

/**
 * How long PostHog keeps analytics events and Sentry keeps crash reports, as
 * configured in each tool (PostHog: project settings → data retention;
 * Sentry: organization plan). Written in each language, e.g. "12 months".
 */
export const RETENTION = {
  en: { posthog: "{POSTHOG_RETENTION}", sentry: "{SENTRY_RETENTION}" },
  es: { posthog: "{POSTHOG_RETENTION}", sentry: "{SENTRY_RETENTION}" },
  ru: { posthog: "{POSTHOG_RETENTION}", sentry: "{SENTRY_RETENTION}" },
} as const;

/**
 * Texas county whose courts hear claims that are not arbitrated (Terms 16.8).
 * EN takes the full name ("Williamson County"); the ES and RU sentences
 * already say "condado de" / "в округе", so give only the name there
 * ("Williamson" / "Уильямсон").
 */
export const VENUE_COUNTY = {
  en: "{VENUE_COUNTY}",
  es: "{VENUE_COUNTY}",
  ru: "{VENUE_COUNTY}",
} as const;
