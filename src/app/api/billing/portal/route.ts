// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";
import { billingRatelimit } from "@/lib/billing-ratelimit";
import { redis, redisConfigured } from "@/lib/redis";
import { reportRedisDown } from "@/lib/ops-alert";
import { verifyToken, hashToken } from "@/lib/token";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

const ALLOWED_ORIGINS = [
  "https://getstroyka.com",
  "https://www.getstroyka.com",
  "http://localhost:3000",
];

const RETURN_URL = "https://getstroyka.com/account?status=success";

const requestSchema = z.object({
  token: z.string().min(1).max(500),
});

const ROUTE = "api/billing/portal";

// Generic error — never reveal specifics. A function, not a shared constant:
// a Response body can be read once, so a reused instance breaks the second
// denial in a warm function.
const DENIED = () =>
  NextResponse.json({ error: "Invalid or expired session" }, { status: 403 });

const UNAVAILABLE = () =>
  NextResponse.json(
    {
      error: "temporarily_unavailable",
      message:
        "We couldn't open billing right now. Please try again in a few minutes, " +
        "or email support@getstroyka.com.",
    },
    { status: 503 }
  );

/**
 * Marks the token used, atomically. Fails CLOSED: if we cannot record the
 * use, a leaked link could be replayed for its whole lifetime, and opening a
 * customer's billing portal cannot be undone. The portal can wait.
 */
async function claimToken(token: string, exp: number): Promise<"ok" | "used" | "unavailable"> {
  if (!redisConfigured()) {
    return process.env.NODE_ENV === "production" ? "unavailable" : "ok";
  }
  try {
    const ttl = Math.max(60, Math.ceil((exp - Date.now()) / 1000) + 60);
    const claimed = await redis.set(`billing:token:${hashToken(token)}`, "1", {
      nx: true,
      ex: ttl,
    });
    return claimed === "OK" ? "ok" : "used";
  } catch (err) {
    await reportRedisDown(ROUTE, err);
    return "unavailable";
  }
}

export async function POST(request: Request) {
  // 1. Origin validation
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return DENIED();
  }

  // 2. Rate limit (fail-open: the single-use claim below fails closed anyway)
  if (redisConfigured()) {
    try {
      const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await billingRatelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch (err) {
      await reportRedisDown(ROUTE, err);
    }
  }

  // 3. Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return DENIED();
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return DENIED();
  }

  const { token } = parsed.data;

  // 4. Verify HMAC signature + expiry
  const payload = verifyToken(token);
  if (!payload) {
    return DENIED();
  }

  // 5. Single-use check
  const claim = await claimToken(token, payload.exp);
  if (claim === "used") return DENIED();
  if (claim === "unavailable") return UNAVAILABLE();

  // 6. Create Stripe Customer Portal session
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: payload.cid,
      return_url: RETURN_URL,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return DENIED();
  }
}

// Reject all non-POST methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
