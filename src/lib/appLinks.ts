/**
 * Single source of truth for app-store + web-signup links.
 *
 * The iOS app is LIVE, so its App Store URL is the built-in fallback — pages
 * work even without the Vercel env var set. Android isn't on Google Play yet,
 * so it falls back to "#" (the UI shows a "soon" affordance for "#"). Signup
 * happens on the web app (the iOS app is sign-in-only per App Store 3.1.1), so
 * SIGNUP_URL points there.
 */
export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/app/stroyka-job-costing-crew/id6783179191";

export const ANDROID_APP_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL ?? "#";

export const SIGNUP_URL = "https://app.getstroyka.com/signup";
