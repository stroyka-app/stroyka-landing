"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

/**
 * PostHog on the marketing site.
 *
 * WHY THIS EXISTS. Until 2026-08-30 this site had NO analytics at all beyond
 * the Meta Pixel — a growth audit checked the live HTML and found
 * `posthog: 0`, `gtag: 0`, `googletagmanager: 0`. Every visitor number we
 * thought we had was the web APP on app.getstroyka.com, a different origin.
 * We had never once measured the marketing funnel, which meant no SEO or
 * campaign work could be told apart from noise.
 *
 * Same project as the app (365357), deliberately: a person who reads the
 * landing page and then signs up is ONE funnel, and splitting them across two
 * projects would make that join impossible.
 *
 * Inert unless NEXT_PUBLIC_POSTHOG_KEY is set — the same shape MetaPixel
 * uses, so local dev and preview builds don't pollute production data.
 *
 * PRIVACY: `person_profiles: 'identified_only'` (the SDK default, stated here
 * because it matters) means anonymous visitors do not get a person profile.
 * Session recording is NOT enabled. If we ever market into the EU/UK this
 * needs the same consent gate MetaPixel does.
 *
 * CSP: `next.config.ts` must allow the PostHog hosts in BOTH `script-src` and
 * `connect-src`. Miss either and this fails silently — the script simply
 * never loads and the site looks instrumented while sending nothing.
 */
export default function PostHogAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const pathname = usePathname();
  const started = useRef(false);

  useEffect(() => {
    if (!key || started.current) return;
    started.current = true;
    posthog.init(key, {
      api_host: host,
      // Pageviews are fired below on pathname change instead. The App Router
      // does not do a full document load between routes, so the SDK's own
      // initial-load capture would record the first page and nothing after.
      capture_pageview: false,
      person_profiles: "identified_only",
    });
  }, [key, host]);

  useEffect(() => {
    if (!key || !started.current) return;
    // Full href, not `pathname`: the query string is where utm_source lives,
    // and attributing a campaign is the entire point of adding this.
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [key, pathname]);

  return null;
}
