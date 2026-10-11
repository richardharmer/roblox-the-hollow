import type { Metadata } from "next";
import { origin } from "./content";
export function metadata(
  title: string,
  description: string,
  path: string,
  noindex = false,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: origin + path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url: origin + path,
      title,
      description,
      siteName: "The Hollow Guide",
      locale: "en_US",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "The Hollow — unofficial 2026 Roblox Halloween event guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
