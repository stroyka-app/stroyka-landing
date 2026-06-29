// src/lib/checkout-ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Guards POST /api/create-checkout-session against checkout/customer-creation
// spam (each call hits Stripe and creates a customer). 10/min per IP is well
// above any genuine human retry rate.
export const checkoutRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: false,
  prefix: "ratelimit:checkout",
});
