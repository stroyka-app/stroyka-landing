import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // connect.facebook.net / facebook.com entries are the Meta Pixel
              // (src/components/MetaPixel.tsx): the loader script, the noscript
              // tracking <img>, and the beacon it POSTs events to. All three
              // directives are required — dropping any one silently kills the
              // pixel with a CSP violation in the console.
              // us-assets.i.posthog.com serves the PostHog bundle and its
              // lazily-loaded extensions; us.i.posthog.com receives the
              // events. BOTH hosts must appear in script-src AND connect-src.
              // Miss either and PostHog fails SILENTLY — no error surfaces to
              // the page, the script just never loads, and the site looks
              // instrumented while sending nothing. That is the exact failure
              // mode we were already living with, unmeasured, until
              // 2026-08-30.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://connect.facebook.net https://us-assets.i.posthog.com https://us.i.posthog.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://www.facebook.com",
              "worker-src 'self' blob:",
              "connect-src 'self' data: blob: https://api.telegram.org https://api.resend.com https://*.upstash.io https://vitals.vercel-insights.com https://va.vercel-scripts.com https://connect.facebook.net https://www.facebook.com https://us.i.posthog.com https://us-assets.i.posthog.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
