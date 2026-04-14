# Account & Billing Portal Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/account` page that securely bridges the Flutter app's "Manage" button to Stripe's Customer Portal via signed HMAC tokens.

**Architecture:** Client component with 4 states (loading, success, error, direct visit) driven by URL params. A single POST API route verifies tokens, enforces single-use via Redis, and creates Stripe portal sessions. HMAC-SHA256 signing utility shared between sign (Flutter) and verify (Next.js).

**Tech Stack:** Next.js 15 App Router, Stripe SDK, Framer Motion, Upstash Redis, Zod

**Spec:** `docs/superpowers/specs/2026-04-13-account-page-design.md`
**Security checklist:** `docs/features/Account_Page_Security.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/token.ts` | Create | HMAC-SHA256 verify utility |
| `src/lib/billing-ratelimit.ts` | Create | Stricter rate limiter for billing endpoint (5 req/min) |
| `src/app/api/billing/portal/route.ts` | Create | POST handler: verify token → create Stripe portal session |
| `src/components/AccountPage.tsx` | Create | Client component with 4 page states + animations |
| `src/app/account/page.tsx` | Create | Server component: metadata + renders AccountPage |
| `src/app/robots.ts` | Modify | Add `/account` to disallow list |
| `.env.example` | Modify | Add Stripe env vars |

---

### Task 1: Install Stripe SDK

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install stripe**

```bash
npm install stripe
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('stripe'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install stripe SDK"
```

---

### Task 2: Token Verification Utility

**Files:**
- Create: `src/lib/token.ts`

- [ ] **Step 1: Create the token utility**

```typescript
// src/lib/token.ts
import { createHmac, timingSafeEqual } from "crypto";

const SIGNING_SECRET = process.env.STRIPE_PORTAL_SIGNING_SECRET;

interface TokenPayload {
  cid: string;
  exp: number;
}

/**
 * Verify a signed HMAC-SHA256 token.
 * Token format: base64(JSON payload) + "." + hex(HMAC signature)
 *
 * Returns the decoded payload if valid, or null if:
 * - format is invalid
 * - signature doesn't match
 * - token is expired
 * - signing secret is not configured
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!SIGNING_SECRET) return null;

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const payloadB64 = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  // Verify signature using constant-time comparison
  const expectedSig = createHmac("sha256", SIGNING_SECRET)
    .update(payloadB64)
    .digest("hex");

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSig, "hex");

  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  // Decode and validate payload
  let payload: TokenPayload;
  try {
    const decoded = Buffer.from(payloadB64, "base64").toString("utf-8");
    payload = JSON.parse(decoded);
  } catch {
    return null;
  }

  // Validate shape
  if (
    typeof payload.cid !== "string" ||
    !payload.cid.startsWith("cus_") ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }

  // Check expiry
  if (Date.now() > payload.exp) return null;

  return payload;
}

/**
 * Hash a token for single-use tracking in Redis.
 * We hash it so we don't store the raw token.
 */
export function hashToken(token: string): string {
  return createHmac("sha256", "token-hash-salt")
    .update(token)
    .digest("hex");
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/token.ts
git commit -m "feat: add HMAC-SHA256 token verification utility"
```

---

### Task 3: Billing Rate Limiter

**Files:**
- Create: `src/lib/billing-ratelimit.ts`

- [ ] **Step 1: Create the stricter rate limiter**

The existing `ratelimit.ts` uses 3 req/hour for the demo form. The billing endpoint needs 5 req/min per IP — stricter per-minute but more lenient per-hour since legitimate users may retry.

```typescript
// src/lib/billing-ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const billingRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: false,
  prefix: "ratelimit:billing",
});
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/billing-ratelimit.ts
git commit -m "feat: add billing-specific rate limiter (5 req/min)"
```

---

### Task 4: Billing Portal API Route

**Files:**
- Create: `src/app/api/billing/portal/route.ts`

This is the security-critical route. Implements the full pipeline from the security checklist: method check → origin validation → rate limit → Zod validation → HMAC verify → expiry check → single-use check → Stripe portal session creation.

- [ ] **Step 1: Create the API route**

```typescript
// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { billingRatelimit } from "@/lib/billing-ratelimit";
import { verifyToken, hashToken } from "@/lib/token";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const session = await stripe.billingPortal.sessions.create({
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/billing/portal/route.ts
git commit -m "feat: add billing portal API route with full security pipeline"
```

---

### Task 5: AccountPage Client Component

**Files:**
- Create: `src/components/AccountPage.tsx`

The component reads URL params on mount, determines the state, and renders the appropriate view. All animations use Framer Motion with the existing site conventions.

- [ ] **Step 1: Create the AccountPage component**

```tsx
// src/components/AccountPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";

type PageState = "loading" | "success" | "error" | "direct";

function LoadingDots() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className="text-brand-forest text-2xl">...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-brand-forest"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SuccessCheckmark() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-16 h-16 mx-auto mb-6">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="#52796f"
          strokeWidth="3"
          fill="none"
          initial={prefersReduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M20 32 L28 40 L44 24"
          stroke="#84a98c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">{children}</div>
      </main>
      <Footer />
    </>
  );
}

function DirectVisitView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          Manage your subscription
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          To access billing, open the Stroyka app and tap{" "}
          <span className="text-brand-sage-mist font-medium">Manage</span> on
          your subscription card.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col items-center gap-4">
          <Button variant="primary" size="md" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <a
            href="mailto:hello@getstroyka.com"
            className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors"
          >
            Need help? hello@getstroyka.com
          </a>
        </div>
      </FadeIn>
    </PageShell>
  );
}

function LoadingView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex justify-center mb-6">
          <LoadingDots />
        </div>
        <p className="text-base text-brand-sage-mist/75">
          Redirecting to billing portal...
        </p>
      </FadeIn>
    </PageShell>
  );
}

function SuccessView() {
  return (
    <PageShell>
      <FadeIn>
        <SuccessCheckmark />
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          You&apos;re all set
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          Your billing changes have been saved.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col items-center gap-4">
          <Button variant="primary" size="md" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <a
            href="/"
            className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors"
          >
            Back to getstroyka.com
          </a>
        </div>
      </FadeIn>
    </PageShell>
  );
}

function ErrorView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          We couldn&apos;t verify your session
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          Please try again from the Stroyka app, or contact us at{" "}
          <a
            href="mailto:hello@getstroyka.com"
            className="text-brand-sage hover:text-brand-sage-mist underline underline-offset-2 transition-colors"
          >
            hello@getstroyka.com
          </a>
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <Button variant="primary" size="md" href="https://app.getstroyka.com">
          Open Stroyka
        </Button>
      </FadeIn>
    </PageShell>
  );
}

export default function AccountPage() {
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("direct");

  useEffect(() => {
    const token = searchParams.get("token");
    const status = searchParams.get("status");

    // Clear sensitive params from URL immediately
    if (token || status) {
      window.history.replaceState({}, "", "/account");
    }

    // Determine initial state
    if (status === "success") {
      setPageState("success");
      return;
    }

    if (!token) {
      setPageState("direct");
      return;
    }

    // Token present — attempt portal redirect
    setPageState("loading");

    fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Portal session failed");
        return res.json();
      })
      .then((data: { url: string }) => {
        window.location.href = data.url;
      })
      .catch(() => {
        setPageState("error");
      });
  }, [searchParams]);

  switch (pageState) {
    case "loading":
      return <LoadingView />;
    case "success":
      return <SuccessView />;
    case "error":
      return <ErrorView />;
    case "direct":
    default:
      return <DirectVisitView />;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AccountPage.tsx
git commit -m "feat: add AccountPage component with 4 states and Framer Motion animations"
```

---

### Task 6: Account Page Route (Server Component)

**Files:**
- Create: `src/app/account/page.tsx`

- [ ] **Step 1: Create the page with metadata**

```tsx
// src/app/account/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import AccountPage from "@/components/AccountPage";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Stroyka subscription and billing.",
  robots: { index: false, follow: false },
  other: {
    "referrer": "no-referrer",
  },
};

export default function AccountRoute() {
  return (
    <Suspense>
      <AccountPage />
    </Suspense>
  );
}
```

Note: `<Suspense>` is required because `AccountPage` uses `useSearchParams()` — Next.js 15 requires a Suspense boundary for client components that read search params at render time.

- [ ] **Step 2: Commit**

```bash
git add src/app/account/page.tsx
git commit -m "feat: add /account route with noindex metadata and referrer policy"
```

---

### Task 7: Update robots.ts and .env.example

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `.env.example`

- [ ] **Step 1: Update robots.ts to disallow /account**

Change the `disallow` array from `["/api/"]` to `["/api/", "/account"]`:

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/account"] },
    sitemap: "https://getstroyka.com/sitemap.xml",
  };
}
```

- [ ] **Step 2: Update .env.example with Stripe variables**

Append to the existing file:

```bash
# Stripe (billing portal)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_PORTAL_SIGNING_SECRET=your_256bit_hex_secret
```

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts .env.example
git commit -m "chore: disallow /account in robots.txt, add Stripe env vars to .env.example"
```

---

### Task 8: Build Verification & Manual Testing

**Files:** None (verification only)

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: Build succeeds with no type errors. The `/account` page should appear in the build output.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors.

- [ ] **Step 3: Start dev server and verify all 4 states**

```bash
npm run dev
```

Test each state manually:

1. **Direct visit:** Open `http://localhost:3000/account` — should show "Manage your subscription" with "Open Stroyka" button
2. **Success state:** Open `http://localhost:3000/account?status=success` — should show animated checkmark and "You're all set"
3. **Error state:** Open `http://localhost:3000/account?token=invalid` — should show "We couldn't verify your session" (API will reject the bad token)
4. **Robots check:** Open `http://localhost:3000/robots.txt` — should contain `Disallow: /account`
5. **Sitemap check:** Open `http://localhost:3000/sitemap.xml` — should NOT contain `/account`

- [ ] **Step 4: Verify URL clearing**

Open `http://localhost:3000/account?status=success` — after the page loads, the URL bar should show just `/account` (params cleared via `replaceState`).

- [ ] **Step 5: Commit verification result**

If any fixes were needed, commit them. Then update the security checklist in `docs/features/Account_Page_Security.md` — check off all items that have been implemented.

```bash
git add -A
git commit -m "feat: complete account page implementation with billing portal integration"
```

---

## Post-Implementation Notes

**What's ready now:**
- `/account` page with all 4 states, animations, and security
- API route with full security pipeline
- Stripe portal integration (works when `STRIPE_SECRET_KEY` is configured)

**What needs to happen in separate sessions:**
1. **Stripe setup** (manual): Create account, products, enable portal, get API keys — see Stripe steps given to user earlier in this session
2. **Flutter app update** (`job-costing-app` repo): Update the "Manage" button to generate signed HMAC tokens and append `?token=` to the URL
3. **Webhook integration** (future): Auto-sync plan changes from Stripe back to Supabase `companies.plan` column
