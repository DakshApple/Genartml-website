import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { SITE_URL } from "@/lib/config";

type SeoInput = {
  title: string;
  description: string;
  /** Path with leading and trailing slash, e.g. "/pricing/" */
  path: string;
  noindex?: boolean;
};

/** One call per page. Gives a unique title, description, canonical and share card. */
export function buildMetadata({ title, description, path, noindex }: SeoInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const full = path === "/" ? title : `${title} | ${siteConfig.company.brandName}`;
  return {
    title: full,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: full,
      description,
      url,
      siteName: siteConfig.company.brandName,
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/assets/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [`${SITE_URL}/assets/og-image.png`],
    },
  };
}

/** Organization schema. Only includes values that are filled in. */
export function organizationJsonLd() {
  const { company, contact, social } = siteConfig;
  const sameAs = Object.values(social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brandName,
    legalName: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    foundingDate: String(company.foundedYear),
    email: contact.email || undefined,
    telephone: contact.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address || undefined,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}
