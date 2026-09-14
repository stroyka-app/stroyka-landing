/**
 * Single source of truth for the app-store links.
 *
 * Both apps are LIVE, so each store URL is the built-in fallback — pages work
 * even without the Vercel env vars set. The "soon" affordance (shown when a
 * URL is still "#") therefore stays dormant unless a link is explicitly
 * blanked.
 *
 * There is no web-signup link any more. The site stopped creating accounts on
 * app.getstroyka.com on 2026-09-13: ninety days of usage showed no desktop
 * audience for the web app and one returning phone user, and the web app is
 * being wound down. Every "Start free" goes to `/get` (see `useSignupHref`).
 */
export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/app/stroyka-job-costing-crew/id6783179191";

export const ANDROID_APP_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL ??
  "https://play.google.com/store/apps/details?id=com.getstroyka.app";

