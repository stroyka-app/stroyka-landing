/**
 * Single source of truth for app-store + web-signup links.
 *
 * Both apps are LIVE, so each store URL is the built-in fallback — pages work
 * even without the Vercel env vars set. The "soon" affordance (shown when a
 * URL is still "#") therefore stays dormant unless a link is explicitly
 * blanked.
 *
 * SIGNUP_URL is the WEB signup, and it is still the right destination for a
 * desktop visitor — who cannot install a phone app, and who accounted for the
 * large majority of signups as of 2026-09. It is no longer the only one: the
 * iOS app was sign-in-only under App Store 3.1.1 until 1.0.27 shipped in-app
 * signup, and 1.0.28 was approved with StoreKit purchases on 2026-09-06, so
 * that constraint is retired. Phones now go to the stores instead — see
 * `useSignupHref`, which routes by device rather than choosing one for
 * everybody.
 */
export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/app/stroyka-job-costing-crew/id6783179191";

export const ANDROID_APP_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL ??
  "https://play.google.com/store/apps/details?id=com.getstroyka.app";

export const SIGNUP_URL = "https://app.getstroyka.com/signup";
