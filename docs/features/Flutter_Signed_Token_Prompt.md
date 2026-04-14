# Flutter App — Signed Token for Billing Portal

> Paste this prompt into a Claude Code session in the `job-costing-app` repo.

---

## Context

The Stroyka marketing website (`getstroyka.com`) has an `/account` page that creates Stripe Customer Portal sessions. It requires a signed HMAC-SHA256 token to verify the request is legitimate.

**Current state in the Flutter app:**
- `lib/features/settings/settings_screen.dart` line ~165 has a "Manage" button that opens `https://getstroyka.com/account` via `launchUrl`
- The `companies` table has a `plan` column ('starter' or 'pro')
- A new `stripe_customer_id` column has been added to `companies` (text, unique)
- The app uses Supabase auth — users are authenticated

**What needs to happen:**
The "Manage" button should open `https://getstroyka.com/account?token=<signed_token>` where the token is generated server-side by a Supabase Edge Function (NOT in the Flutter app — the signing secret must never be in client code).

## Token Format

```
base64(JSON payload) + "." + hex(HMAC-SHA256 signature)
```

**Payload:** `{ "cid": "cus_xxxxxxxxxxxx", "exp": 1776135000 }`
- `cid`: Stripe customer ID from the `companies.stripe_customer_id` column
- `exp`: Unix timestamp in milliseconds, 5 minutes from now (`Date.now() + 5 * 60 * 1000`)

**Signing:** HMAC-SHA256 using the secret stored in the Edge Function's environment variable `STRIPE_PORTAL_SIGNING_SECRET`

The signing secret is: (same value as in the Next.js site's .env.local — check with Maks or look at the Supabase Edge Function secrets)

## Implementation Plan

### 1. Create Supabase Edge Function: `billing-token`

Create a new Edge Function that:
- Requires authentication (checks the Supabase JWT)
- Looks up the authenticated user's company
- Gets the `stripe_customer_id` from the `companies` table
- Generates a signed token (HMAC-SHA256)
- Returns `{ "url": "https://getstroyka.com/account?token=<signed_token>" }`

```typescript
// supabase/functions/billing-token/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const SIGNING_SECRET = Deno.env.get("STRIPE_PORTAL_SIGNING_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  // Auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Create Supabase client with the user's JWT
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Look up company's stripe_customer_id
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("stripe_customer_id")
    .single();

  if (companyError || !company?.stripe_customer_id) {
    return new Response(
      JSON.stringify({ error: "No billing account found" }),
      { status: 404 }
    );
  }

  // Generate signed token
  const payload = JSON.stringify({
    cid: company.stripe_customer_id,
    exp: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  const payloadB64 = base64Encode(new TextEncoder().encode(payload));
  const signature = await hmacSign(payloadB64, SIGNING_SECRET);
  const signedToken = `${payloadB64}.${signature}`;

  const url = `https://getstroyka.com/account?token=${encodeURIComponent(signedToken)}`;

  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### 2. Deploy and Set Secret

```bash
supabase functions deploy billing-token
supabase secrets set STRIPE_PORTAL_SIGNING_SECRET=<the_hex_secret>
```

### 3. Update Flutter Settings Screen

In `lib/features/settings/settings_screen.dart`, update the "Manage" button's `onTap`:

**Before:**
```dart
onTap: () => launchUrl(
  Uri.parse('https://getstroyka.com/account'),
  mode: LaunchMode.externalApplication,
),
```

**After:**
```dart
onTap: () async {
  try {
    final response = await Supabase.instance.client.functions
        .invoke('billing-token');
    final url = response.data['url'] as String?;
    if (url != null) {
      await launchUrl(
        Uri.parse(url),
        mode: LaunchMode.externalApplication,
      );
    }
  } catch (e) {
    // Fallback to plain account page
    await launchUrl(
      Uri.parse('https://getstroyka.com/account'),
      mode: LaunchMode.externalApplication,
    );
  }
},
```

### 4. Verification

1. Run the app, go to Settings → Subscription → Manage
2. It should open `getstroyka.com/account?token=...` in the browser
3. The website should show loading dots → redirect to Stripe Customer Portal
4. After managing billing in Stripe, user should return to `getstroyka.com/account` with the success checkmark

### Notes

- The signing secret must be the SAME value in both the Supabase Edge Function and the Next.js site's `.env.local`
- The Edge Function approach keeps the signing secret server-side — it never touches the Flutter app binary
- The RLS policy on `companies` should already scope queries to the authenticated user's company
- The token expires in 5 minutes and is single-use (the Next.js API tracks used tokens in Redis)
