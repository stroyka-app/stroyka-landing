# /account Page — Security Checklist

> Threat model and mitigations for the Stripe billing portal integration.
> Each item should be verified during implementation and marked complete.

## Threat Model

### 1. Token Replay / Interception
**Risk:** Token visible in URL — browser history, server logs, referer headers.

- [x] Single-use tokens: store used token hashes in Upstash Redis with 5-min TTL. Reject if hash already exists
- [x] Short expiry: 5-minute max lifetime on tokens
- [x] `Referrer-Policy: no-referrer` header on /account page to prevent token leaking via referer to Stripe
- [x] Clear token from URL immediately on page mount via `window.history.replaceState`

### 2. Token Forgery
**Risk:** Attacker crafts a token with a known `cus_` ID.

- [x] HMAC-SHA256 with 256-bit secret (`STRIPE_PORTAL_SIGNING_SECRET`)
- [x] Validate signature BEFORE any Stripe API call — fail fast on bad signatures
- [x] Use `crypto.timingSafeEqual` for constant-time comparison (prevents timing attacks)

### 3. Customer ID Enumeration
**Risk:** Attacker brute-forces `cus_` IDs via the API.

- [x] Rate limit: 5 requests per IP per minute via Upstash Redis
- [x] Generic error messages only — never reveal whether the customer ID exists or the signature was invalid. Always return: `"Invalid or expired session"`
- [x] All error paths return identical 403 response shape

### 4. CSRF
**Risk:** Attacker tricks user into hitting the API from another origin.

- [x] POST-only endpoint. Return 405 for all other methods
- [x] Validate `Origin` header against allowlist (`getstroyka.com`)
- [x] No cookies involved (stateless token auth) — limits traditional CSRF, but origin check adds defense-in-depth

### 5. XSS on /account Page
**Risk:** If script injection occurs, attacker could steal the token from the URL.

- [x] Token param read once on mount, used in fetch, then cleared from URL immediately
- [x] Token is never rendered in the DOM — only used in the API fetch call body
- [x] No `dangerouslySetInnerHTML` anywhere on the page
- [x] All content is static React components, no dynamic HTML
- [x] CSP headers already enforced site-wide (from Prompt A hardening)

### 6. Man-in-the-Middle
**Risk:** Intercepting the token in transit.

- [x] HTTPS only — Vercel enforces TLS, HSTS header already configured
- [x] Stripe portal session URLs are temporary and expire quickly — limited value even if captured

### 7. Open Redirect via Return URL
**Risk:** Attacker manipulates the return URL in the Stripe portal session.

- [x] Hardcode return URL server-side: `https://getstroyka.com/account?status=success`
- [x] Never accept return URL from client request body or query params
- [x] No user-supplied URLs passed to any redirect

### 8. Stripe Secret Key Exposure
**Risk:** API key leaks via client bundle or error messages.

- [x] `STRIPE_SECRET_KEY` only imported in server-side API route — never in client components
- [x] Error responses never include stack traces, internal details, or Stripe error messages
- [x] Environment variable validated at module load, not at request time
- [x] `.env.local` in `.gitignore` (already enforced)

## API Route Implementation Checklist

```
POST /api/billing/portal
```

- [x] Accept `POST` only — return 405 for other methods
- [x] Validate `Origin` header against `https://getstroyka.com` allowlist
- [x] Rate limit: 5 req/IP/min via Upstash
- [x] Zod input validation: `{ token: z.string().min(1).max(500) }`
- [x] Decode token → extract `{ cid, exp }` payload + signature
- [x] Verify HMAC-SHA256 signature with `crypto.timingSafeEqual`
- [x] Check `exp` > `Date.now()` (reject expired tokens)
- [x] Check single-use: Redis GET on token hash → reject if exists
- [x] Mark token as used: Redis SET token hash with 5-min TTL
- [x] Create Stripe `billingPortal.sessions.create` with hardcoded return URL
- [x] Return `{ url: session.url }` — no other data
- [x] All error paths → `{ error: "Invalid or expired session" }` with HTTP 403

## Page Security Measures

- [x] `<meta name="referrer" content="no-referrer">` on /account page
- [x] Token cleared from URL bar on mount (`replaceState`)
- [x] No token value logged to console
- [x] No token value stored in localStorage/sessionStorage
- [x] Page not indexed: excluded from sitemap.ts, disallowed in robots.ts

## Environment Variables Required

| Variable | Purpose | Where |
|----------|---------|-------|
| `STRIPE_SECRET_KEY` | Stripe API authentication | `.env.local` + Vercel |
| `STRIPE_PORTAL_SIGNING_SECRET` | HMAC token signing/verification | `.env.local` + Vercel + Flutter app |
| `UPSTASH_REDIS_REST_URL` | Rate limiting + single-use token store | Already configured |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting + single-use token store | Already configured |
