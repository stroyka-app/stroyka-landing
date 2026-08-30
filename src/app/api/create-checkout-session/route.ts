import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { checkoutRatelimit } from "@/lib/checkout-ratelimit";
import { routing } from "@/i18n/routing";

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

// Coupon IDs this endpoint will honour when one arrives in the URL.
//
// The `coupon` query param is attacker-controlled: it used to be passed
// straight to Stripe, so ANY coupon ID a visitor knew or guessed would be
// applied. Comma-separated env var, empty by default — with FOUNDING99
// retired (2026-08-30) we intend to honour none, and adding a future one is
// a config change rather than a deploy.
//
// This is not the only discount path: `allow_promotion_codes` stays on, so
// customer-facing promo codes are still redeemable on Stripe's own page,
// where Stripe validates them and shows the result before anyone pays.
const ALLOWED_COUPONS = (process.env.STRIPE_ALLOWED_COUPONS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Resolve the URL `coupon` param to something safe to send to Stripe, or null.
 *
 * Never throws and never blocks checkout. A stale discount link must degrade
 * to "no discount", never to "checkout is broken" — deleting FOUNDING99 on
 * 2026-08-30 turned every old founding-member link into a hard 500, because
 * the dead coupon went to Stripe unchecked and sessions.create threw. Links
 * we posted publicly are still out there; they now just pay list price.
 */
async function resolveCoupon(
  stripe: Stripe,
  coupon: string | undefined
): Promise<string | null> {
  if (!coupon) return null;

  if (!ALLOWED_COUPONS.includes(coupon)) {
    console.warn(
      `[create-checkout-session] ignoring coupon "${coupon}": not in STRIPE_ALLOWED_COUPONS`
    );
    return null;
  }

  try {
    const found = await stripe.coupons.retrieve(coupon);
    if (!found.valid) {
      console.warn(
        `[create-checkout-session] ignoring coupon "${coupon}": Stripe reports it invalid/expired`
      );
      return null;
    }
    return found.id;
  } catch {
    console.warn(
      `[create-checkout-session] ignoring coupon "${coupon}": not found in Stripe`
    );
    return null;
  }
}

const requestSchema = z.object({
  plan: z.enum(["starter", "pro"]),
  billing: z.enum(["monthly", "annual"]),
  email: z.string().email(),
  name: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  coupon: z.string().max(100).optional(),
  // The locale the buyer was reading when they decided to pay. Optional so an
  // older cached client that does not send it still checks out fine.
  //
  // Derived from routing.locales, never re-typed here: a hardcoded copy would
  // silently 400 the WHOLE checkout the day a fourth locale is added, which is
  // the same drift that left GetStartedFlow quoting stale prices.
  locale: z.enum(routing.locales).optional(),
});

export async function POST(req: NextRequest) {
  // Rate limit (fail-open: if Redis is down, skip rate limiting)
  if (process.env.UPSTASH_REDIS_REST_URL) {
    try {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success } = await checkoutRatelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch (err) {
      console.error("[create-checkout-session] rate limit check failed:", err);
    }
  }

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

  const { plan, billing, email, name, companyName, coupon, locale } =
    parsed.data;

  const priceId = PRICE_MAP[plan]?.[billing];
  if (!priceId) {
    return NextResponse.json(
      { error: "Invalid plan or billing cycle" },
      { status: 400 }
    );
  }

  // Customers created by THIS request, so the catch below can undo them.
  // Nothing else cleans these up: the customer is created before the session,
  // so any later failure used to strand a customer with no subscription.
  let createdCustomerId: string | null = null;

  try {
    const stripe = getStripe();

    // Resolve the coupon FIRST — before creating anything. An unknown or
    // expired coupon is now dropped here, so it can neither fail the session
    // nor strand a customer on the way.
    const appliedCoupon = await resolveCoupon(stripe, coupon);

    // Reuse this email's existing Stripe customer instead of minting a new
    // one per attempt.
    //
    // This used to be an unconditional customers.create(), so every click on
    // "subscribe" produced another customer. Our first paying customer
    // (2026-08-08) generated FIVE for one purchase, and the resulting mess —
    // payment recorded against a customer id our app had never seen — is what
    // left him billed and stuck on the free plan.
    //
    // customers.list is immediately consistent (customers.search is not, and
    // lags by up to a minute — useless for someone retrying twice in three
    // minutes, which is exactly the pattern here). Stripe's email filter is
    // case-sensitive, so we also try the lowercased form: the customer typed
    // "Leone_david@…" while our own records lowercase.
    const seen = new Map<string, Stripe.Customer>();
    for (const candidate of [email, email.toLowerCase()]) {
      const found = await stripe.customers.list({ email: candidate, limit: 10 });
      for (const c of found.data) if (!c.deleted) seen.set(c.id, c);
      if (candidate === email.toLowerCase()) break;
    }
    // Newest first: if duplicates already exist from before this fix, prefer
    // the most recent, which is the one carrying any active subscription.
    const existing = [...seen.values()].sort((a, b) => b.created - a.created);

    let customer = existing[0] ?? null;

    if (customer) {
      // Refuse to sell a second subscription to someone who already has one.
      // Nothing anywhere else stops this: Stripe will happily bill the same
      // person twice, and our app has no concept of a company holding two
      // subscriptions. The customer above ended up on $149 AND $99
      // simultaneously and had to email us to sort it out.
      for (const c of existing) {
        const active = await stripe.subscriptions.list({
          customer: c.id,
          status: "active",
          limit: 1,
        });
        const trialing = active.data.length
          ? active
          : await stripe.subscriptions.list({
              customer: c.id,
              status: "trialing",
              limit: 1,
            });
        if (trialing.data.length > 0) {
          return NextResponse.json(
            {
              error: "already_subscribed",
              message:
                "This email already has an active Stroyka subscription. " +
                "Sign in to the app, or email support@getstroyka.com and " +
                "we'll sort it out.",
            },
            { status: 409 }
          );
        }
      }
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        // Stripe picks the language for receipts and invoices from
        // preferred_locales, and only falls back to the Dashboard's "Default
        // language" when it is absent. We never set it, so EVERY customer got
        // English — including the Spanish-speaking ones the site is
        // translated for. Set from the locale they were actually reading.
        ...(locale ? { preferred_locales: [locale] } : {}),
        metadata: {
          source: "web_signup",
          company_name: companyName,
          plan,
        },
      });
      createdCustomerId = customer.id;
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://getstroyka.com";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customer.id,
      mode: "subscription",
      // Without this Checkout defaults to `auto`, i.e. the BROWSER's language
      // — so someone who deliberately switched our site to Spanish but runs an
      // English phone would hand their card over on an English page. The
      // language they chose is the better signal than the one their OS shipped
      // with.
      ...(locale ? { locale } : {}),
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

    // Only ever an allow-listed coupon Stripe has confirmed is still valid;
    // resolveCoupon returned null for anything else and we sell at list price.
    // allow_promotion_codes and discounts[] are mutually exclusive in Stripe.
    if (appliedCoupon) {
      sessionParams.discounts = [{ coupon: appliedCoupon }];
      delete sessionParams.allow_promotion_codes;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout session failed";
    console.error("[create-checkout-session]", message);

    // Undo a customer this request created but never got to use. Without
    // this, every failed attempt leaves a customer with no subscription —
    // exactly the debris that made the 2026-08-08 billing incident hard to
    // read. Best-effort: a cleanup failure must not mask the real error.
    if (createdCustomerId) {
      try {
        await getStripe().customers.del(createdCustomerId);
      } catch (cleanupErr) {
        console.error(
          `[create-checkout-session] could not remove orphaned customer ${createdCustomerId}:`,
          cleanupErr
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
