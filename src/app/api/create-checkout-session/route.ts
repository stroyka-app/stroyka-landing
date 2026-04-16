import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

const PRICE_MAP: Record<string, Record<string, string | undefined>> = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
};

const requestSchema = z.object({
  plan: z.enum(["starter", "pro"]),
  billing: z.enum(["monthly", "annual"]),
  email: z.string().email(),
  name: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  coupon: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 }
    );
  }

  const { plan, billing, email, name, companyName, coupon } = parsed.data;

  const priceId = PRICE_MAP[plan]?.[billing];
  if (!priceId) {
    return NextResponse.json(
      { error: "Invalid plan or billing cycle" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();

    // Create a fresh Stripe customer for the checkout
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "web_signup",
        company_name: companyName,
        plan,
      },
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://getstroyka.com";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/get-started/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${siteUrl}/get-started/cancel`,
      allow_promotion_codes: true,
      metadata: {
        plan,
        email,
        companyName,
      },
      subscription_data: {
        metadata: {
          plan,
          company_name: companyName,
        },
      },
    };

    // Apply coupon directly if passed (e.g. from founding member link).
    // allow_promotion_codes and discounts[] are mutually exclusive in Stripe.
    if (coupon) {
      sessionParams.discounts = [{ coupon }];
      delete sessionParams.allow_promotion_codes;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout session failed";
    console.error("[create-checkout-session]", message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
