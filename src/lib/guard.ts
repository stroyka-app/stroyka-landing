import { reportGuardDown } from "@/lib/ops-alert";

// Rate limits and single-use claims, kept in our own Supabase by the
// landing-guard edge function (job-costing-app supabase/functions/landing-guard).
// Replaced a free Upstash Redis, which deletes databases after 14 quiet days;
// ours vanished in October 2026 and the demo form 500'd unnoticed. The limits
// themselves live server-side in landing-guard, not here.

export type GuardCheck =
  | "demo_ip"
  | "demo_confirm"
  | "checkout_ip"
  | "billing_ip"
  | "billing_token";

/** "unavailable" = the guard could not answer; each caller decides open or closed. */
export type GuardResult = "allowed" | "denied" | "unavailable";

const TIMEOUT_MS = 2500;

/**
 * Asks landing-guard whether `key` (an IP, an email, a token) may do `check`
 * again, recording the hit when it may. Never throws.
 */
export async function guardTake(
  route: string,
  check: GuardCheck,
  key: string
): Promise<GuardResult> {
  const url = process.env.LANDING_GUARD_URL;
  const secret = process.env.LANDING_GUARD_SECRET;
  if (!url || !secret) {
    if (process.env.NODE_ENV !== "production") return "allowed";
    await reportGuardDown(route, new Error("LANDING_GUARD_URL / LANDING_GUARD_SECRET not set"));
    return "unavailable";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Landing-Secret": secret },
      body: JSON.stringify({ check, key }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`landing-guard ${check}: HTTP ${res.status}`);
    const data: unknown = await res.json();
    const allowed =
      typeof data === "object" && data !== null && (data as { allowed?: unknown }).allowed === true;
    return allowed ? "allowed" : "denied";
  } catch (err) {
    await reportGuardDown(route, err);
    return "unavailable";
  } finally {
    clearTimeout(timer);
  }
}
