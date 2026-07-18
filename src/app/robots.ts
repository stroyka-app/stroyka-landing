import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/get-started/success", "/get-started/cancel"],
    },
    sitemap: "https://www.getstroyka.com/sitemap.xml",
  };
}
