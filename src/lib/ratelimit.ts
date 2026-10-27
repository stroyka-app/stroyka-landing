import { createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: false,
});

// The demo form mails whatever address is typed in, so the per-IP limit alone
// lets a script with rotating IPs use us to mail strangers.
export const confirmationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(1, "1 d"),
  analytics: false,
  prefix: "ratelimit:demo-confirm",
});

/** Keyed by a hash so the store holds no email addresses. */
export function confirmationKey(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
