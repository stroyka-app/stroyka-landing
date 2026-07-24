/**
 * Single source of truth for app-store + web-signup links.
 *
 * Both apps are LIVE, so each store URL is the built-in fallback — pages work
 * even without the Vercel env vars set. The "soon" affordance (shown when a
 * URL is still "#") therefore stays dormant unless a link is explicitly
 * blanked. Signup happens on the web app (the iOS app is sign-in-only per App
 * Store 3.1.1), so SIGNUP_URL points there.
 */
export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/app/stroyka-job-costing-crew/id6783179191";

export const ANDROID_APP_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL ??
  "https://play.google.com/store/apps/details?id=com.getstroyka.app";

export const SIGNUP_URL = "https://app.getstroyka.com/signup";
