/**
 * SEO metadata builder for public pages.
 * Wraps Next.js Metadata with IC IITP defaults (OG tags, canonical URL, locale).
 */
import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iciitp.com";

interface BuildMetadataOptions {
  title: string;
  description: string;
  locale: string;
  path: string;
  keywords?: string;
  image?: string;
}

export function buildMetadata({
  title,
  description,
  locale,
  path,
  keywords,
  image = "/og/default.png",
}: BuildMetadataOptions): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        hi: `${BASE_URL}/hi${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale,
      type: "website",
      images: [{ url: `${BASE_URL}${image}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}${image}`],
    },
  };
}
