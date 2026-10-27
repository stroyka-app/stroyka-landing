// src/lib/billing-ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const billingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: false,
  prefix: "ratelimit:billing",
});
