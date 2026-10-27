import { Redis } from "@upstash/redis";

// One quick retry instead of the client's default five with exponential
// backoff: when the database vanished (2026-10, NXDOMAIN) every request sat
// ~4 s in retries before failing.
export const redis = Redis.fromEnv({
  retry: { retries: 1, backoff: () => 100 },
});

export function redisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL);
}
