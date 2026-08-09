import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Disallow == "never fetch this", which also means Google never sees the
      // page's own `noindex` — a blocked URL that gets linked can still be
      // indexed URL-only (bare link, no title/snippet). So the rule is:
      //   credential-bearing or never-linked  -> Disallow (don't fetch at all)
      //   publicly shareable                  -> allow the crawl, let noindex work
      // /account takes a signed HMAC ?token= from an email link and /get-started/
      // success|cancel are post-Stripe returns — none are ever linked publicly,
      // so blocking the fetch outright is the stronger control. /get is the
      // opposite case: it's the QR-code / short-link store handoff, built to be
      // shared, so it must stay crawlable for its noindex to be honored.
      disallow: ["/api/", "/account", "/get-started/success", "/get-started/cancel"],
    },
    sitemap: "https://www.getstroyka.com/sitemap.xml",
  };
}
