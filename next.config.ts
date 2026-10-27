import { readdirSync } from "fs";
import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Only `next dev` needs eval (React Refresh). Production was checked without
// it on 2026-10-26: home, /demo, /get-started, /get and /start with the Meta
// Pixel, PostHog, motion, the three.js crane and the BotID challenge script
// loaded, and no CSP violation.
const DEV_EVAL = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

// Every page path under src/app/[locale], read from the filesystem at build
// time so a new page can never be 404'd by a stale hand-kept list. "*" is a
// dynamic segment, "**" a nested catch-all. The root [...rest] is left out on
// purpose: it is where misses land. The middleware uses this to give unknown
// URLs a real 404 status.
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

function pagePaths(dir: string, prefix: string[] = []): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const here = entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))
    ? [prefix.join("/")]
    : [];
  const below = entries
    .filter((e) => e.isDirectory() && !/^[_@]/.test(e.name))
    .flatMap((e) => {
      const sub = path.join(dir, e.name);
      if (/^\[\[?\.\.\./.test(e.name)) {
        return prefix.length ? [[...prefix, "**"].join("/")] : [];
      }
      if (e.name.startsWith("(")) return pagePaths(sub, prefix);
      return pagePaths(sub, [...prefix, e.name.startsWith("[") ? "*" : e.name]);
    });
  return [...here, ...below];
}

const nextConfig: NextConfig = {
  env: {
    PAGE_PATHS: JSON.stringify(
      pagePaths(path.join(process.cwd(), "src/app/[locale]"))
    ),
  },
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
              `script-src 'self' 'unsafe-inline'${DEV_EVAL} https://vercel.live https://va.vercel-scripts.com https://connect.facebook.net https://us-assets.i.posthog.com https://us.i.posthog.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://www.facebook.com",
              "worker-src 'self' blob:",
              // Telegram, Resend and Upstash are called from the server only;
              // the browser never needs them.
              "connect-src 'self' data: blob: https://vitals.vercel-insights.com https://va.vercel-scripts.com https://connect.facebook.net https://www.facebook.com https://us.i.posthog.com https://us-assets.i.posthog.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
