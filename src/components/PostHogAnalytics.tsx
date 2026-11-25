"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { CONSENT_EVENT, type ConsentChoice, useConsent } from "@/lib/consent";

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
 * PRIVACY: nothing loads until the visitor accepts cookies in CookieBanner
 * (lib/consent.ts), everywhere — not only in the EU/UK. Withdrawing consent
 * reloads the page without this. `person_profiles: 'identified_only'` (the
 * SDK default, stated here because it matters) means anonymous visitors do
 * not get a person profile. Session recording is NOT enabled.
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
  const consent = useConsent();

  useEffect(() => {
    if (!key || started.current || consent !== "granted") return;
    started.current = true;
    posthog.init(key, {
      api_host: host,
      // Pageviews are fired below on pathname change instead. The App Router
      // does not do a full document load between routes, so the SDK's own
      // initial-load capture would record the first page and nothing after.
      capture_pageview: false,
      person_profiles: "identified_only",
      // Session replay OFF, asserted here rather than left to the project
      // toggle — a dashboard switch is one click from recording every
      // visitor's screen again, and nobody would notice.
      //
      // We were recording. Nothing read the recordings: they carry zero
      // interactions, and the app does not record at all, so the one time we
      // went looking for a replay of a real user session there was none. All
      // exposure, no return.
      //
      // Replay is not covered by our privacy policy or the cookie banner, and
      // reaches EU visitors (IE/SE/SK/EE in the last fortnight). Screen
      // recording is also the most actively litigated item in US
      // session-tracking claims, and our ad spend is US-targeted.
      disable_session_recording: true,
    });
    // A visitor who withdrew earlier carries PostHog's opt-out marker; an
    // Accept now is a fresh consent, so lift it (without an extra event).
    if (posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
    // The page the visitor accepted on: the pathname effect below has
    // already run for it, before PostHog existed.
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [key, host, consent]);

  // Withdrawal: stop capturing at once, before CookieBanner clears the
  // cookies and reloads. CONSENT_EVENT is dispatched synchronously by
  // saveConsent, so this runs before the reload — a React state update
  // through useConsent would not.
  useEffect(() => {
    const onChoice = (e: Event) => {
      if (!started.current) return;
      if ((e as CustomEvent<ConsentChoice>).detail !== "denied") return;
      try {
        posthog.opt_out_capturing();
      } catch {
        // The reload that follows stops the SDK anyway.
      }
    };
    window.addEventListener(CONSENT_EVENT, onChoice);
    return () => window.removeEventListener(CONSENT_EVENT, onChoice);
  }, []);

  useEffect(() => {
    if (!key || !started.current) return;
    // Full href, not `pathname`: the query string is where utm_source lives,
    // and attributing a campaign is the entire point of adding this.
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [key, pathname]);

  return null;
}
