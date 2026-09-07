"use client";

import { useEffect, useState } from "react";
import { withAttribution, withAttributionPath } from "../attribution";
import { SIGNUP_URL } from "../appLinks";

/** `/get` UA-detects and forwards to the right store. */
const STORE_REDIRECT_PATH = "/get";

/**
 * Where "Start free" should send this visitor.
 *
 * Phones and tablets go to `/get`, which forwards to their store; everyone
 * else keeps the web signup on app.getstroyka.com.
 *
 * **Both destinations stay, deliberately.** Since 1.0.28 a phone can sign up
 * AND subscribe entirely in-app, so pushing a phone visitor through a mobile
 * web form is the worse path. But the web app is not a fallback we are winding
 * down: on 2026-09-06, **17 of the previous 45 days' 23 signups (74%) were
 * web-only** — companies with no native device registered at all — and a
 * desktop visitor cannot install a phone app in the first place. Removing web
 * signup would have put a dead end in front of three quarters of signups.
 *
 * Client-side because it reads the UA, which inherits the trade-off already
 * documented on `useAttributedUrl`: the first render carries the desktop URL
 * and hydration corrects it, long before a human finishes reading the hero.
 * The pre-hydration value is the SAFE one — web signup works on a phone, while
 * the reverse (a desktop visitor sent to a store page) would be a dead end.
 */
export function useSignupHref(): string {
  const [href, setHref] = useState(SIGNUP_URL);

  useEffect(() => {
    const search = window.location.search;
    setHref(
      isMobileVisitor()
        ? withAttributionPath(STORE_REDIRECT_PATH, search)
        : withAttribution(SIGNUP_URL, search),
    );
  }, []);

  return href;
}

function isMobileVisitor(): boolean {
  const ua = navigator.userAgent || "";
  if (/android|iphone|ipod/i.test(ua)) return true;
  // iPadOS 13+ ships a desktop UA string ("Macintosh") by default, so the
  // obvious /ipad/ test misses every modern iPad — including the iPad Air
  // App Review used. Multi-touch on a "Mac" is the standard tell.
  if (/ipad/i.test(ua)) return true;
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}
