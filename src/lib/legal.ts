/**
 * Owner fill-ins for the legal pages (privacy, terms, delete-account, DPA,
 * sub-processors). Every value in `{CURLY_CAPS}` renders LITERALLY until it
 * is replaced, so before deploying: `grep -rn "{[A-Z_]*}" src/lib/legal.ts`
 * must print nothing.
 */

/** Business address of Dalen Meridian LLC (the PO Box used in our email signature). */
export const POSTAL_ADDRESS = "PO Box 5203, Round Rock, TX 78683, USA";

/**
 * GDPR Art. 27 / UK GDPR Art. 27 representatives: NOT appointed yet (moved to
 * 1.0.63, Maks 2026-11-24). Until they are, every place that would name them
 * shows this interim sentence instead (Privacy 1, 11, 16; DPA 15.4). When a
 * representative is appointed, replace the sentence with its name, postal
 * address and email, in all three languages.
 */
export const REPRESENTATIVES_INTERIM = {
  en: "We are appointing representatives in the EU and the UK. Until then, write to our privacy contact at support@getstroyka.com with \u201cPrivacy\u201d in the subject line.",
  es: "Estamos designando representantes en la UE y el Reino Unido. Hasta entonces, escribe a nuestro contacto de privacidad en support@getstroyka.com con \u201cPrivacy\u201d en el asunto.",
  ru: "Мы назначаем представителей в ЕС и Великобритании. До их назначения пишите нашему контакту по вопросам конфиденциальности на support@getstroyka.com со словом \u00abPrivacy\u00bb в теме письма.",
} as const;

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
export const NOTICE_EFFECTIVE_EN = "27 December 2026";
export const NOTICE_EFFECTIVE_ES = "27 de diciembre de 2026";
export const NOTICE_EFFECTIVE_RU = "27 декабря 2026 г.";

/** The publication date shown as "Last updated". Set it to the deploy date. */
export const LAST_UPDATED_EN = "25 November 2026";
export const LAST_UPDATED_ES = "25 de noviembre de 2026";
export const LAST_UPDATED_RU = "25 ноября 2026 г.";

/**
 * How long PostHog keeps analytics events and Sentry keeps crash reports.
 * Verified 2026-11-24 against the vendors' public docs:
 * - PostHog: our organisation is on the Free plan (billing overview), and
 *   events are kept 1 year on Free (posthog.com/docs/data/events-retention).
 *   The person profile the events are linked to is kept until deleted —
 *   Privacy 4 says so separately. Re-check if the plan is upgraded.
 * - Sentry: 30 days on Developer, up to 90 days on Team and Business
 *   (sentry.io/pricing). Our plan tier was not visible from here, so the
 *   value is the ceiling that is true for both, "up to 90 days".
 */
export const RETENTION = {
  en: { posthog: "1 year", sentry: "up to 90 days" },
  es: { posthog: "1 año", sentry: "hasta 90 días" },
  ru: { posthog: "1 год", sentry: "до 90 дней" },
} as const;

/**
 * Texas county whose courts hear claims that are not arbitrated (Terms 16.8).
 * EN takes the full name ("Williamson County"); the ES and RU sentences
 * already say "condado de" / "в округе", so give only the name there
 * ("Williamson" / "Уильямсон").
 */
export const VENUE_COUNTY = {
  en: "Williamson County",
  es: "Williamson",
  ru: "Уильямсон",
} as const;
