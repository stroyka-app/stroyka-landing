// src/lib/token.ts
import { createHmac, timingSafeEqual } from "crypto";

const SIGNING_SECRET = process.env.STRIPE_PORTAL_SIGNING_SECRET;

interface TokenPayload {
  cid: string;
  exp: number;
}

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

export function hashToken(token: string): string {
  return createHmac("sha256", "token-hash-salt")
    .update(token)
    .digest("hex");
}
