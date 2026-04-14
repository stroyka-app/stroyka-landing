# Account & Billing Portal Page — Design Spec

**Date:** 2026-04-13
**Status:** Approved
**Repo:** stroyka-landing (Next.js)

## Purpose

Add a `/account` page to the Stroyka marketing website that serves as the bridge between the Flutter app's "Manage" button and Stripe's Customer Portal. The page is not a full account dashboard — it's a secure pass-through with 4 clear states.

## User Flow

```
Flutter app (Settings → Subscription → Manage)
  → generates signed HMAC token with cus_ ID + 5-min expiry
  → opens https://getstroyka.com/account?token=<signed_token>

/account page (Loading state)
  → reads token from URL, clears it from address bar immediately
  → POST /api/billing/portal with token
  → API verifies signature, expiry, single-use
  → creates Stripe Customer Portal session
  → redirects user to Stripe

Stripe Customer Portal
  → user updates payment, cancels, views invoices
  → Stripe redirects back to https://getstroyka.com/account?status=success

/account page (Success state)
  → animated checkmark, "You're all set" message
  → "Open Stroyka" button → app.getstroyka.com
```

## Page States

### 1. Loading (token present, verifying)
- Centered vertically on page
- 3-dot pulsing animation (brand-forest color)
- Text: "Redirecting to billing portal..."
- Auto-redirects when Stripe session URL is received
- If API fails → transitions to Error state

### 2. Success (returning from Stripe)
- Triggered by `?status=success` URL param
- SVG checkmark with draw-on path animation (0.6s, spring easing)
- Heading: "You're all set"
- Subtext: "Your billing changes have been saved"
- Primary button: "Open Stroyka" → app.getstroyka.com
- Secondary link: "Back to getstroyka.com" → /

### 3. Error (invalid token, expired, or API failure)
- Heading: "We couldn't verify your session"
- Subtext: "Please try again from the Stroyka app, or contact us"
- Primary button: "Open Stroyka" → app.getstroyka.com
- Email link: hello@getstroyka.com

### 4. Direct Visit (no token, no status param)
- Heading: "Manage your subscription"
- Subtext: "To access billing, open the Stroyka app and tap Manage on your subscription card"
- Primary button: "Open Stroyka" → app.getstroyka.com
- Email fallback: "Need help? hello@getstroyka.com"

## Layout (Approach C — Vertical Stack)

Centered vertical flow, max-width ~480px, matching the demo page pattern:

```
Navbar
  ↓
[vertical center area]
  Icon (Stroyka cornerstone mark or plan icon)
  Heading (state-dependent)
  Subtext (state-dependent)
  Plan card (loading/success states — shows plan name + status)
  Primary CTA button
  Secondary link
  ↓
Footer
```

- Same page shell as `/demo`: `<Navbar />` + `<main>` + `<Footer />`
- `pt-32 pb-12` spacing, `max-w-lg mx-auto px-6`
- All content centered both horizontally and vertically within the main area

## Animation Design (Framer Motion)

All animations use the existing site conventions:

- **Staggered FadeIn:** Reuse `FadeIn` component with 0.1s delay increments between elements. Same `[0.22, 1, 0.36, 1]` easing curve
- **Success checkmark:** `motion.path` with `pathLength` 0→1, duration 0.6s, spring easing. Stroke color: `brand-forest`
- **Loading dots:** 3 circles with staggered opacity pulse (0→1→0), 0.15s stagger, infinite loop
- **"Manage Billing" button:** Reuse existing `Button` component (spring-based magnetic hover)
- **PRO badge:** Shimmer effect on load (reuse `shimmer-streak` CSS)
- **Reduced motion:** All animations respect `useReducedMotion` — static fallbacks

No page transitions, no scroll-driven effects. Utility page — animations are polish, not spectacle.

## Technical Architecture

### New Files

| File | Type | Purpose |
|------|------|---------|
| `src/app/account/page.tsx` | Server component | Metadata, imports AccountPage |
| `src/components/AccountPage.tsx` | Client component | State machine for all 4 states |
| `src/app/api/billing/portal/route.ts` | API route | Token verification + Stripe portal session |
| `src/lib/token.ts` | Utility | HMAC-SHA256 sign/verify functions |

### Modified Files

| File | Change |
|------|--------|
| `src/app/robots.ts` | Add `/account` to disallow list |
| `.env.example` | Add `STRIPE_SECRET_KEY`, `STRIPE_PORTAL_SIGNING_SECRET` |

### Dependencies

- `stripe` (new — npm install)
- `@upstash/ratelimit` (existing — for rate limiting)
- `zod` (existing — for input validation)
- `framer-motion` (existing — for animations)

### Token Format

Base64-encoded JSON payload + HMAC-SHA256 signature:

```
base64({ cid: "cus_xxx", exp: 1776135000 }) + "." + hmac_signature
```

- Signed with `STRIPE_PORTAL_SIGNING_SECRET` (shared between Next.js site and Flutter app)
- 5-minute expiry
- Single-use (tracked via Redis hash with TTL)

### API Route: POST /api/billing/portal

Request: `{ token: string }`
Response (success): `{ url: string }`
Response (error): `{ error: "Invalid or expired session" }` (403)

Security pipeline (in order):
1. Method check → 405 if not POST
2. Origin header validation → 403 if not allowlisted
3. Rate limit (5 req/IP/min) → 429 if exceeded
4. Zod validation → 400 if malformed
5. Decode + HMAC verify (timingSafeEqual) → 403 if invalid
6. Expiry check → 403 if expired
7. Single-use check (Redis GET) → 403 if already used
8. Mark as used (Redis SET with TTL)
9. Stripe portal session create (hardcoded return URL)
10. Return `{ url }`

Full security threat model and checklist: `docs/features/Account_Page_Security.md`

### SEO / Indexing

- `/account` excluded from `sitemap.ts`
- `/account` disallowed in `robots.ts`
- `<meta name="referrer" content="no-referrer">` on the page
- `noindex, nofollow` in page metadata

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe API calls (server-side only) |
| `STRIPE_PORTAL_SIGNING_SECRET` | HMAC token signing/verification |
| `UPSTASH_REDIS_REST_URL` | Rate limiting + single-use token tracking (already configured) |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting + single-use token tracking (already configured) |

## Out of Scope

- Supabase auth on the marketing site (not needed — auth lives in the Flutter app)
- Plan switching UI (Stripe portal handles this)
- Webhook integration for plan sync (future work — Phase 2)
- Invoice display on the page (Stripe portal handles this)
- Flutter app changes to generate signed tokens (separate session in job-costing-app repo)
