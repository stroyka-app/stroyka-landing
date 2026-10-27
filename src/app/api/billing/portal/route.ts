// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { z } from "zod";
import { guardTake } from "@/lib/guard";
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
async function claimToken(token: string): Promise<"ok" | "used" | "unavailable"> {
  // Links live 5 minutes; landing-guard remembers a claim for 24 hours.
  const result = await guardTake(ROUTE, "billing_token", hashToken(token));
  if (result === "allowed") return "ok";
  return result === "denied" ? "used" : "unavailable";
}

export async function POST(request: Request) {
  // 1. Origin validation
  const headersList = await headers();
  const origin = headersList.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return DENIED();
  }

  // 2. Rate limit (fail-open: the single-use claim below fails closed anyway)
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  if ((await guardTake(ROUTE, "billing_ip", ip)) === "denied") {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
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
  const claim = await claimToken(token);
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
