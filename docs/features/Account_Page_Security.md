# /account Page — Security Checklist

> Threat model and mitigations for the Stripe billing portal integration.
> Each item should be verified during implementation and marked complete.

## Threat Model

### 1. Token Replay / Interception
**Risk:** Token visible in URL — browser history, server logs, referer headers.

- [ ] Single-use tokens: store used token hashes in Upstash Redis with 5-min TTL. Reject if hash already exists
- [ ] Short expiry: 5-minute max lifetime on tokens
- [ ] `Referrer-Policy: no-referrer` header on /account page to prevent token leaking via referer to Stripe
- [ ] Clear token from URL immediately on page mount via `window.history.replaceState`

### 2. Token Forgery
**Risk:** Attacker crafts a token with a known `cus_` ID.

- [ ] HMAC-SHA256 with 256-bit secret (`STRIPE_PORTAL_SIGNING_SECRET`)
- [ ] Validate signature BEFORE any Stripe API call — fail fast on bad signatures
- [ ] Use `crypto.timingSafeEqual` for constant-time comparison (prevents timing attacks)

### 3. Customer ID Enumeration
**Risk:** Attacker brute-forces `cus_` IDs via the API.

- [ ] Rate limit: 5 requests per IP per minute via Upstash Redis
- [ ] Generic error messages only — never reveal whether the customer ID exists or the signature was invalid. Always return: `"Invalid or expired session"`
- [ ] All error paths return identical 403 response shape

### 4. CSRF
**Risk:** Attacker tricks user into hitting the API from another origin.

- [ ] POST-only endpoint. Return 405 for all other methods
- [ ] Validate `Origin` header against allowlist (`getstroyka.com`)
- [ ] No cookies involved (stateless token auth) — limits traditional CSRF, but origin check adds defense-in-depth

### 5. XSS on /account Page
**Risk:** If script injection occurs, attacker could steal the token from the URL.

- [ ] Token param read once on mount, used in fetch, then cleared from URL immediately
- [ ] Token is never rendered in the DOM — only used in the API fetch call body
- [ ] No `dangerouslySetInnerHTML` anywhere on the page
- [ ] All content is static React components, no dynamic HTML
- [ ] CSP headers already enforced site-wide (from Prompt A hardening)

### 6. Man-in-the-Middle
**Risk:** Intercepting the token in transit.

- [ ] HTTPS only — Vercel enforces TLS, HSTS header already configured
- [ ] Stripe portal session URLs are temporary and expire quickly — limited value even if captured

### 7. Open Redirect via Return URL
**Risk:** Attacker manipulates the return URL in the Stripe portal session.

- [ ] Hardcode return URL server-side: `https://getstroyka.com/account?status=success`
- [ ] Never accept return URL from client request body or query params
- [ ] No user-supplied URLs passed to any redirect

### 8. Stripe Secret Key Exposure
**Risk:** API key leaks via client bundle or error messages.

- [ ] `STRIPE_SECRET_KEY` only imported in server-side API route — never in client components
- [ ] Error responses never include stack traces, internal details, or Stripe error messages
- [ ] Environment variable validated at module load, not at request time
- [ ] `.env.local` in `.gitignore` (already enforced)

## API Route Implementation Checklist

```
POST /api/billing/portal
```

- [ ] Accept `POST` only — return 405 for other methods
- [ ] Validate `Origin` header against `https://getstroyka.com` allowlist
- [ ] Rate limit: 5 req/IP/min via Upstash
- [ ] Zod input validation: `{ token: z.string().min(1).max(500) }`
- [ ] Decode token → extract `{ cid, exp }` payload + signature
- [ ] Verify HMAC-SHA256 signature with `crypto.timingSafeEqual`
- [ ] Check `exp` > `Date.now()` (reject expired tokens)
- [ ] Check single-use: Redis GET on token hash → reject if exists
- [ ] Mark token as used: Redis SET token hash with 5-min TTL
- [ ] Create Stripe `billingPortal.sessions.create` with hardcoded return URL
- [ ] Return `{ url: session.url }` — no other data
- [ ] All error paths → `{ error: "Invalid or expired session" }` with HTTP 403

## Page Security Measures

- [ ] `<meta name="referrer" content="no-referrer">` on /account page
- [ ] Token cleared from URL bar on mount (`replaceState`)
- [ ] No token value logged to console
- [ ] No token value stored in localStorage/sessionStorage
- [ ] Page not indexed: excluded from sitemap.ts, disallowed in robots.ts

## Environment Variables Required

| Variable | Purpose | Where |
|----------|---------|-------|
| `STRIPE_SECRET_KEY` | Stripe API authentication | `.env.local` + Vercel |
| `STRIPE_PORTAL_SIGNING_SECRET` | HMAC token signing/verification | `.env.local` + Vercel + Flutter app |
| `UPSTASH_REDIS_REST_URL` | Rate limiting + single-use token store | Already configured |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting + single-use token store | Already configured |
