"use client";

import { useEffect, useState } from "react";

/**
 * The visitor's cookie choice for the marketing site.
 *
 * Nothing optional loads before a choice: PostHog and the Meta pixel both
 * wait for "granted" (Privacy Policy, section 12). Vercel Web Analytics and
 * Speed Insights set no cookies and are not gated.
 *
 * The choice lives in a first-party cookie for 180 days. A browser that sends
 * Global Privacy Control is treated as "denied" until the visitor says
 * otherwise in Cookie settings, so it never sees the banner.
 */
export type ConsentChoice = "granted" | "denied";

export const CONSENT_COOKIE = "sx_consent";
const CONSENT_MAX_AGE_S = 180 * 24 * 60 * 60;

/** Fired on window after a choice is saved. */
export const CONSENT_EVENT = "sx:consent";
/** Fired on window to reopen the banner (footer "Cookie settings"). */
export const OPEN_SETTINGS_EVENT = "sx:cookie-settings";

function readCookie(): ConsentChoice | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
    const v = m?.[1];
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function gpcOn(): boolean {
  try {
    return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  } catch {
    return false;
  }
}

/** The saved choice, or "denied" under GPC, or null when the visitor has not chosen. */
export function readConsent(): ConsentChoice | null {
  return readCookie() ?? (gpcOn() ? "denied" : null);
}

/** True when the visitor made an explicit choice (GPC alone does not count). */
export function hasExplicitChoice(): boolean {
  return readCookie() !== null;
}

/** Expire a cookie on this host and on the parent domain (where _fbp / ph_ live). */
function expireCookie(name: string): void {
  const host = window.location.hostname;
  const parent = host.split(".").slice(-2).join(".");
  for (const domain of ["", `; Domain=${host}`, `; Domain=.${parent}`]) {
    document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
  }
}

/** Remove what PostHog and the Meta pixel set, after consent is withdrawn. */
export function clearTrackingCookies(): void {
  try {
    for (const part of document.cookie.split("; ")) {
      const name = part.split("=")[0];
      if (name.startsWith("ph_") || name === "_fbp" || name === "_fbc") expireCookie(name);
    }
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("ph_")) window.localStorage.removeItem(key);
    }
  } catch {
    // Storage can be blocked; nothing was stored there in that case.
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE_S}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // A blocked cookie means the banner asks again next visit — still safe.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: choice }));
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Current choice, kept in sync with saves made anywhere on the page. */
export function useConsent(): ConsentChoice | null {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  useEffect(() => {
    setChoice(readConsent());
    const onSave = (e: Event) => setChoice((e as CustomEvent<ConsentChoice>).detail);
    window.addEventListener(CONSENT_EVENT, onSave);
    return () => window.removeEventListener(CONSENT_EVENT, onSave);
  }, []);
  return choice;
}
