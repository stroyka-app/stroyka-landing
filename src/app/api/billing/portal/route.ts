// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { billingRatelimit } from "@/lib/billing-ratelimit";
import { verifyToken, hashToken } from "@/lib/token";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

const ALLOWED_ORIGINS = [
  "https://getstroyka.com",
  "http://localhost:3000",
];

const RETURN_URL = "https://getstroyka.com/account?status=success";

const requestSchema = z.object({
  token: z.string().min(1).max(500),
});

// Generic error — never reveal specifics
const DENIED = NextResponse.json(
  { error: "Invalid or expired session" },
  { status: 403 }
);

export async function POST(request: Request) {
  // 1. Origin validation
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return DENIED;
  }

  // 2. Rate limit
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await billingRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // 3. Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return DENIED;
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return DENIED;
  }

  const { token } = parsed.data;

  // 4. Verify HMAC signature + expiry
  const payload = verifyToken(token);
  if (!payload) {
    console.error("[billing/portal] token verification failed", {
      tokenLength: token.length,
      hasDot: token.includes("."),
      secretConfigured: !!process.env.STRIPE_PORTAL_SIGNING_SECRET,
      secretLength: process.env.STRIPE_PORTAL_SIGNING_SECRET?.length ?? 0,
    });
    return DENIED;
  }

  // 5. Single-use check via Redis
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const redis = Redis.fromEnv();
    const tokenHash = hashToken(token);
    const alreadyUsed = await redis.get<string>(`billing:token:${tokenHash}`);
    if (alreadyUsed) {
      return DENIED;
    }
    // Mark as used with 5-minute TTL
    await redis.set(`billing:token:${tokenHash}`, "1", { ex: 300 });
  }

  // 6. Create Stripe Customer Portal session
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: payload.cid,
      return_url: RETURN_URL,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return DENIED;
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
