# Stroyka — Follow-Up Claude Code Prompts

> Run these **after** the main landing page is built (Landing Page Prompt → Section 5).
> Each prompt is self-contained — paste the full prompt into Claude Code in the correct repo.
> Order: A → B → C for the website. D is for the Flutter app repo.

---

## ~~PROMPT A — Website Security & Validation Hardening~~ ✅ DONE (2026-04-07)
**Completed:** Rate limiting (Upstash Redis), Zod validation, honeypot field, security headers (CSP, X-Frame-Options, etc.), .env.example, graceful error handling in /api/demo.

---

## ~~PROMPT B — Legal Pages + SEO Infrastructure~~ ✅ DONE (2026-04-07)
**Completed:** Vercel Analytics + Speed Insights, enhanced metadata with title template, sitemap.xml, robots.txt, JSON-LD structured data, Privacy & Terms pages redesigned with interactive sidebar layout, footer links updated.

---

## ~~PROMPT C — Error States, UX Polish & Demo Thank-You Page~~ ✅ DONE (2026-04-07)
**Completed:** Branded 404 page, global error boundary, loading state, demo form loading/error/success states with spinner, branded HTML email template for demo requests.

---

## PROMPT D — Flutter App Repo Work (that is done and habve nothing to do with that repo)
**🔧 Repo: `job-costing-app` (the Flutter app)**
**Status:** Not started — separate repo, separate session.

## ~~PROMPT E — Account & Subscription Management Page~~ ✅ DONE (2026-04-13)
**Completed:** /account page with 4 states (direct visit, loading, success with animated checkmark, error), POST /api/billing/portal with HMAC-SHA256 signed tokens, single-use via Redis, rate limiting, origin validation, Stripe Customer Portal integration, robots.txt disallow, noindex metadata.
**Security:** Full threat model in docs/features/Account_Page_Security.md — all items verified.

### Original Prompt E Spec (for reference)
🌐 Repo: stroyka-landing (the Next.js website)
Run after Prompt C. Requires a Stripe account with Customer Portal enabled.

You are adding a /account page to the Stroyka marketing website. This page lets existing paying customers manage their Stripe subscription. It uses Stripe's hosted Customer Portal — you do not build billing UI from scratch.
How it works: User visits getstroyka.com/account → clicks "Manage Billing" → your API creates a Stripe Customer Portal session → Stripe redirects them to their hosted billing portal → they update card / cancel / view invoices → Stripe sends them back to getstroyka.com/account.
1. Install Stripe
bashnpm install stripe
Add to .env.local and Vercel environment variables:
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
2. Enable Stripe Customer Portal
In your Stripe Dashboard → Settings → Billing → Customer Portal:

Enable the portal
Set return URL to: https://getstroyka.com/account
Enable: cancel subscriptions, update payment method, view invoice history

3. API Route — Create Portal Session (app/api/billing/portal/route.ts)
typescriptimport Stripe from "stripe";
import { NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { customerId } = await req.json();

  if (!customerId) {
    return Response.json({ error: "Missing customer ID" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: "https://getstroyka.com/account",
  });

  return Response.json({ url: session.url });
}
4. Account Page (app/account/page.tsx)
The page should:

Use the dark brand styling consistent with the rest of the site
Show a minimal header: Stroyka logo + "My Account"
Show the plan name and status (fetched from Stripe or passed via URL param)
Have one primary button: "Manage Billing →" that calls the portal API and redirects
Have a secondary link: "Back to getstroyka.com"
For users who arrive without a valid customer ID, show: "Can't find your account? Email hello@getstroyka.com"

tsx// Simplified structure — Claude Code should implement with full brand styling
export default function AccountPage() {
  const handleManageBilling = async () => {
    const customerId = // get from URL param or Supabase auth session
    const res = await fetch("/api/billing/portal", {
      method: "POST",
      body: JSON.stringify({ customerId }),
    });
    const { url } = await res.json();
    window.location.href = url; // redirect to Stripe portal
  };

  return (
    // Brand-styled page:
    // - Navbar
    // - "My Account" heading
    // - Plan details card (plan name, status, next billing date)
    // - "Manage Billing →" primary button → calls handleManageBilling
    // - "Need help? hello@getstroyka.com" fallback
    // - Footer
  );
}
5. How Customer IDs Get to the Account Page
For early-stage (first 20 customers), the simplest approach: when you manually create a customer in Stripe, copy their Stripe Customer ID (cus_xxxxxxxxxxxx) and store it in Supabase against their company record. The account page reads it from their Supabase auth session.
If Supabase auth is not yet wired to the website (it lives in the Flutter app), use a simpler fallback: pass the customer ID as a URL parameter (getstroyka.com/account?cid=cus_xxx) and link to this URL from within the app. Not pretty but functional for early customers.
6. Add to Sitemap
Update app/sitemap.ts — do NOT add /account to the sitemap (it's not a public page and shouldn't be indexed by Google).
Update app/robots.ts to disallow it:
typescriptdisallow: ["/api/", "/account"],
Verification

Click "Manage Billing" → confirm it redirects to Stripe's hosted portal
In the Stripe portal, update a test payment method → confirm Stripe redirects back to /account
Visit /account with no customer ID → confirm fallback email message shows
Verify /account does not appear in sitemap.xml
Verify robots.txt disallows /account

---

## Remaining Items (not from prompts)

### High Priority
- [ ] Add screenshots to the landing page — retake with iPhone 16 Pro simulator (Cmd+S export for 1170x2532 images). Screenshots component is built and hidden, just needs assets. See `tasks/lessons.md` for rejected approaches (done)
- [ ] Review OG image (`/og-image.png`) on social sharing previews

### Medium Priority
- [ ] Convert hero video to WebM for better compression (optional, needs `brew install ffmpeg`)
- [ ] Update Supabase email templates in `job-costing-app` repo to match new brand palette
- [ ] Add real testimonials when available (Testimonials section is built but hidden)

### Nice to Have
- [ ] Add social media links to footer Contact column when accounts are created
- [ ] Cookie consent banner (not required — Vercel Analytics is cookie-free, but consider for PostHog in the app)
