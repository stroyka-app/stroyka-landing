# Stroyka — Follow-Up Claude Code Prompts

> Run these **after** the main landing page is built (Landing Page Prompt → Section 5).
> Each prompt is self-contained — paste the full prompt into Claude Code in the correct repo.
> Order: A → B → C for the website. D is for the Flutter app repo.

---

## PROMPT A — Website Security & Validation Hardening
**🌐 Repo: `stroyka-landing` (the Next.js website)**
**Run this after the landing page scaffold is complete.**

---

You are hardening the security of the Stroyka marketing website — a Next.js 14 App Router project deployed to Vercel. The site has a demo request form at `/demo` that submits to `/api/demo`, which sends a Resend email and a Telegram bot notification.

Implement all of the following in one pass:

### 1. Rate Limiting on `/api/demo`

Install Upstash Redis rate limiting:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Create a rate limiter in `src/lib/ratelimit.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 requests per IP per hour
  analytics: false,
});
```

In `/api/demo/route.ts`, add rate limiting as the very first check before any processing:

```typescript
import { ratelimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
const { success } = await ratelimit.limit(ip);
if (!success) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
```

Add these environment variables to `.env.local` and document them in `.env.example`:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

> **Note for developer:** Create a free Upstash Redis database at upstash.com, copy the REST URL and token, add to Vercel environment variables.

### 2. Server-Side Input Validation with Zod

Install Zod:

```bash
npm install zod
```

Create a schema in `src/lib/schemas.ts`:

```typescript
import { z } from "zod";

export const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().min(2, "Company name required").max(200),
  crewSize: z.enum(["1-5", "5-10", "10-25", "25+"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  challenge: z.string().max(1000).optional(),
  honeypot: z.string().max(0, "Bot detected"), // Must be empty
});
```

In `/api/demo/route.ts`, validate the body:

```typescript
import { demoFormSchema } from "@/lib/schemas";

const body = await request.json();
const result = demoFormSchema.safeParse(body);
if (!result.success) {
  return Response.json(
    { error: "Invalid form data", details: result.error.flatten() },
    { status: 400 }
  );
}
const { name, company, crewSize, email, phone, challenge } = result.data;
// Use result.data from here on — never raw body values
```

### 3. Honeypot Field on the Demo Form

In the `/demo` form component, add a hidden field that real users never see:

```tsx
{/* Honeypot — hidden from real users, filled by bots */}
<input
  type="text"
  name="honeypot"
  autoComplete="off"
  tabIndex={-1}
  aria-hidden="true"
  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
/>
```

Include `honeypot` in the form's submit payload. The Zod schema will reject any submission where it's non-empty.

### 4. Security Headers in `next.config.js`

Replace/update `next.config.js` with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://api.telegram.org https://api.resend.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 5. Environment Variable Audit

Audit every environment variable in the project. Verify:

- `RESEND_API_KEY` — server-only, no `NEXT_PUBLIC_` prefix ✓
- `TELEGRAM_BOT_TOKEN` — server-only, no `NEXT_PUBLIC_` prefix ✓
- `TELEGRAM_CHAT_ID` — server-only, no `NEXT_PUBLIC_` prefix ✓
- `UPSTASH_REDIS_REST_URL` — server-only ✓
- `UPSTASH_REDIS_REST_TOKEN` — server-only ✓
- `NEXT_PUBLIC_APP_URL` — client-safe (only the app URL, not a secret) ✓

If any secret accidentally has `NEXT_PUBLIC_` prefix, remove it and update all references.

Create `.env.example` at the project root documenting all required vars with placeholder values (no real secrets):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
TELEGRAM_BOT_TOKEN=0000000000:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=-1001234567890
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://app.getstroyka.com
```

### 6. Demo Form Error Handling

The `/api/demo` route should handle partial failures gracefully. If Telegram fails but Resend succeeds, still return 200. Use this pattern:

```typescript
const [emailResult, telegramResult] = await Promise.allSettled([
  sendEmail(...),
  sendTelegram(...),
]);

// Log failures but don't fail the request if email succeeded
if (emailResult.status === "rejected") {
  console.error("Email send failed:", emailResult.reason);
  return Response.json({ error: "Failed to send. Please email us directly." }, { status: 500 });
}

if (telegramResult.status === "rejected") {
  console.error("Telegram notify failed (non-fatal):", telegramResult.reason);
  // Don't return error — Telegram failure is non-fatal
}

return Response.json({ success: true }, { status: 200 });
```

### Verification

After implementing:
1. Submit the demo form with valid data — confirm email + Telegram both fire
2. Submit the form 4 times rapidly from the same IP — confirm 4th returns 429
3. Submit with the honeypot field filled — confirm it's rejected
4. Submit with a 10,000-character company name — confirm Zod rejects it
5. Run `curl -I https://localhost:3000` and verify security headers appear in the response
6. Search entire codebase for `NEXT_PUBLIC_` — confirm no secret keys use this prefix

---

## PROMPT B — Legal Pages + SEO Infrastructure
**🌐 Repo: `stroyka-landing` (the Next.js website)**
**Run this after Prompt A is complete.**

---

You are adding legal pages and SEO infrastructure to the Stroyka marketing website — a Next.js 14 App Router project. The site is deployed at getstroyka.com.

**Stroyka context:**
- Construction job-costing and crew management SaaS for small US crews
- Collects: name, email, phone, company name via demo form
- Data stored in Supabase (AWS us-east-1)
- Third-party processors: Resend (email), Telegram (notifications), Vercel (hosting), Upstash (rate limiting)
- Subscription billing via Stripe (handled externally, not in-app for iOS)
- Target market: US construction companies (CCPA applies; GDPR may apply if EU visitors)

### 1. Vercel Analytics + Speed Insights

Install and add to root layout:

```bash
npm install @vercel/analytics @vercel/speed-insights
```

In `src/app/layout.tsx`, add to the `<body>`:

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Inside <body>, after children:
<Analytics />
<SpeedInsights />
```

These are privacy-friendly (no cookies, no GDPR issue, no cookie banner needed).

### 2. Next.js Metadata API — Root Layout

Replace any manual `<meta>` tags in `layout.tsx` with the Next.js 14 Metadata API. Set the root metadata object:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
  title: {
    default: "Stroyka — Construction Crew & Job Cost Management",
    template: "%s | Stroyka",
  },
  description:
    "Stroyka helps small construction crews track daily hours, job costs, and worker pay — all in one app. Built for US contractors with 5–25 workers.",
  keywords: ["construction management app", "crew management", "job costing", "construction payroll", "contractor app"],
  authors: [{ name: "Stroyka" }],
  creator: "Stroyka",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    title: "Stroyka — Construction Crew & Job Cost Management",
    description:
      "Track hours, job costs, and worker pay for your construction crew. Simple. Fast. Built for the field.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stroyka — Construction Management App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Crew & Job Cost Management",
    description:
      "Track hours, job costs, and worker pay for your construction crew.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};
```

Add page-level metadata to `app/demo/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Request a Demo",
  description: "See Stroyka in action. Book a 20-minute demo with the founder.",
};
```

### 3. Sitemap (`app/sitemap.ts`)

Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://getstroyka.com";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
```

### 4. Robots.txt (`app/robots.ts`)

Create `src/app/robots.ts`:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: "https://getstroyka.com/sitemap.xml",
  };
}
```

### 5. JSON-LD Structured Data

Add a JSON-LD `SoftwareApplication` schema to the Hero section or root layout for Google rich results:

```tsx
// In app/layout.tsx or the Hero component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Stroyka",
      applicationCategory: "BusinessApplication",
      operatingSystem: "iOS, Android",
      description:
        "Construction crew and job cost management app for small US contractors.",
      url: "https://getstroyka.com",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "149",
        highPrice: "299",
        priceCurrency: "USD",
        offerCount: "2",
      },
    }),
  }}
/>
```

### 6. Privacy Policy Page (`app/privacy/page.tsx`)

Create a full Privacy Policy page. Use the Stroyka brand styling (dark background, brand colors, Space Grotesk headings, Inter body). Include the Navbar and Footer components.

The Privacy Policy content must cover:

**Effective date:** April 2025 (update to actual launch date)

Sections to include, written in plain English (not legalese):

1. **What we collect** — Demo form data (name, email, phone, company, crew size); App usage data (hours logged, job assignments, worker pay rates); Account data (email, company name, role).

2. **How we use it** — To provide the Stroyka service; to respond to demo requests; to send product updates (with opt-out); to improve the product.

3. **Who we share it with** — Supabase (database, hosted on AWS us-east-1); Resend (transactional email delivery); Telegram (internal demo notifications only — your data is not stored there); Vercel (website hosting); Upstash (rate limiting — IP addresses only, not personal data); Stripe (payment processing — we never store card details). We do **not** sell your data.

4. **Data retention** — Active account data retained while account is active. Deleted within 30 days of account cancellation upon request.

5. **Your rights** — Right to access, correct, or delete your data. Email hello@getstroyka.com. CCPA: California residents can request disclosure of data categories collected. GDPR: EU residents can request data deletion and portability.

6. **Cookies** — We use no advertising cookies. Vercel Analytics uses no cookies and collects no personal data. No cookie consent banner required.

7. **Contact** — hello@getstroyka.com

### 7. Terms of Service Page (`app/terms/page.tsx`)

Create a Terms of Service page with the same brand styling. Written in plain English.

Sections to include:

1. **What Stroyka is** — A SaaS tool for construction crew management. You use it to track hours, job costs, and pay. We provide the software; you provide the data.

2. **Your account** — You are responsible for all activity under your account. Boss accounts control all data in their organization. Keep your credentials secure.

3. **Subscription and billing** — Monthly subscriptions, charged via Stripe. Auto-renews monthly. Cancel anytime — no partial refunds for unused days. Founding Member pricing ($99/month) is locked for life as long as the subscription remains active; cancellation forfeits the rate.

4. **Your data** — You own your data. We process it to provide the service. You can export or delete it at any time. We don't use your construction data to train AI or share it with competitors.

5. **Acceptable use** — Don't use Stroyka for illegal purposes, to violate labor laws, or to store data for workers you're not authorized to manage.

6. **iOS and Android** — Subscription is managed through getstroyka.com, not through the App Store or Google Play. Apple and Google are not parties to these terms.

7. **Liability** — Stroyka is provided "as is." We're not liable for data loss, business interruption, or indirect damages. Our total liability is capped at the fees you paid in the 3 months before the claim.

8. **Changes** — We'll email you 14 days before material changes to these terms.

9. **Contact** — hello@getstroyka.com

### 8. Footer Links

Update the Footer component to include links to `/privacy` and `/terms`. Place them in the bottom copyright line:

```tsx
<p className="text-sm text-brand-sage/50">
  © {new Date().getFullYear()} Stroyka. All rights reserved.{" "}
  <Link href="/privacy" className="hover:text-brand-sage transition-colors">Privacy</Link>
  {" · "}
  <Link href="/terms" className="hover:text-brand-sage transition-colors">Terms</Link>
</p>
```

### Verification

1. Visit `/sitemap.xml` — confirm all 4 URLs appear
2. Visit `/robots.txt` — confirm it disallows `/api/` and links to sitemap
3. Inspect `<head>` on homepage — confirm og:image, og:title, og:description all present
4. Visit `/privacy` — confirm it renders with Stroyka branding and covers all 7 sections
5. Visit `/terms` — confirm Founding Member pricing note is present
6. Check Footer on homepage — confirm Privacy and Terms links work
7. Run Lighthouse on homepage — target 90+ SEO score

---

## PROMPT C — Error States, UX Polish & Demo Thank-You Page
**🌐 Repo: `stroyka-landing` (the Next.js website)**
**Run this after Prompt B is complete.**

---

You are adding error states, a branded 404 page, and a demo thank-you flow to the Stroyka marketing website — a Next.js 14 App Router project. Use the existing brand styles: `bg-brand-midnight`, `text-brand-sage-mist`, Space Grotesk headings, Inter body.

### 1. Branded 404 Page (`app/not-found.tsx`)

Create `src/app/not-found.tsx`:

The page should:
- Use the dark brand background (`bg-brand-midnight`)
- Show the Stroyka Cornerstone logo mark (use the `Logo` component)
- Display a large "404" in brand colors
- Headline: "This page doesn't exist"
- Subtext: "Looks like this page got buried under a pile of blueprints."
- Two buttons: "Back to Home" (primary, links to `/`) and "Request a Demo" (secondary/ghost, links to `/demo`)
- Include the standard Navbar (so users don't feel lost)
- No Footer needed — keep it minimal

### 2. Demo Form — Success State

In the `/demo` page form component, after successful submission:

Do **not** redirect — show an inline success state that replaces the form:

```tsx
// Success state to show after form submission
<div className="text-center py-16 space-y-4">
  <div className="text-5xl">🏗️</div>
  <h2 className="font-display text-2xl font-bold text-brand-sage-mist">
    You're on the list.
  </h2>
  <p className="text-brand-sage max-w-md mx-auto">
    We'll reach out within 24 hours to schedule your demo. Check your email
    for a confirmation.
  </p>
  <p className="text-brand-sage/60 text-sm">
    In the meantime, questions? Email us at{" "}
    <a href="mailto:hello@getstroyka.com" className="text-brand-forest hover:text-brand-sage underline">
      hello@getstroyka.com
    </a>
  </p>
</div>
```

### 3. Demo Form — Error State

If the API returns an error (network failure, rate limit, server error), show:

```tsx
<div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">
  {error === 429
    ? "Too many requests. Please wait an hour and try again, or email us directly at hello@getstroyka.com."
    : "Something went wrong on our end. Please email us at hello@getstroyka.com and we'll get back to you quickly."}
</div>
```

Show this above the submit button. The form fields should remain filled so the user doesn't have to re-type.

### 4. Demo Form — Loading State

During submission (awaiting API response), the submit button should:
- Be disabled
- Show a spinner + "Sending..." text
- Prevent double-submission

```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 px-6 bg-brand-forest hover:bg-brand-deep text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {isSubmitting ? (
    <>
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Sending...
    </>
  ) : (
    "Request Demo →"
  )}
</button>
```

### 5. Global Error Page (`app/error.tsx`)

Create `src/app/error.tsx` for unexpected runtime errors:

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-midnight flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-display text-2xl font-bold text-brand-sage-mist">
          Something went wrong
        </h1>
        <p className="text-brand-sage">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-brand-forest text-white rounded-lg hover:bg-brand-deep transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-2 border border-brand-sage/30 text-brand-sage rounded-lg hover:bg-brand-deep/30 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 6. Loading State (`app/loading.tsx`)

Create `src/app/loading.tsx` for route transitions:

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-midnight flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Strata mark pulse animation */}
        <div className="space-y-2 animate-pulse">
          <div className="h-2.5 bg-brand-forest rounded-sm w-[52px]" />
          <div className="h-2.5 bg-brand-sage rounded-sm w-[39px]" />
          <div className="h-2.5 bg-brand-sage-mist/40 rounded-sm w-[26px]" />
        </div>
        <p className="text-brand-sage/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}
```

### Verification

1. Navigate to `/this-page-does-not-exist` — confirm branded 404 with logo and buttons
2. Submit the demo form successfully — confirm success state appears inline (no redirect)
3. Simulate a network error (disconnect Wi-Fi, submit form) — confirm error message appears with email fallback
4. Submit the form and immediately try to submit again — confirm button is disabled during loading
5. Confirm no browser console errors on any of the new pages


