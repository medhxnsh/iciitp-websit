/**
 * robots.txt generator — disallows admin and API routes from crawlers.
 * Served at /robots.txt by Next.js automatically.
 */
import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iciitp.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
