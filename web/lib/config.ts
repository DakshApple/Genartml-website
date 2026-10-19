import { siteConfig } from "@/site.config";

export const INDUSTRY_LABELS: Record<string, string> = {
  "real-estate": "Real estate",
  "clinics-healthcare": "Clinics and healthcare",
  "coaching-education": "Coaching and education",
  solar: "Solar",
  agritech: "Agritech",
  "small-business": "Small business",
};

/** Industries Daksh has confirmed. Only these get a page and a menu entry. */
export function publishedIndustries() {
  return Object.entries(siteConfig.industries)
    .filter(([, on]) => on)
    .map(([slug]) => ({ slug, name: INDUSTRY_LABELS[slug] ?? slug }));
}

export function whatsappUrl(text: string = siteConfig.copy.whatsappText) {
  const n = siteConfig.contact.whatsappNumber.replace(/\D/g, "");
  if (!n) return "";
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

/** Where "Book a free call" goes. Falls back to the contact page. */
export function bookCallUrl() {
  return siteConfig.contact.calendarBookingUrl || "/contact/";
}

export function formatPrice(
  amount: number,
  currency: "INR" | "USD",
  opts: { from?: boolean; monthly?: boolean } = {},
) {
  const num =
    currency === "INR"
      ? new Intl.NumberFormat("en-IN").format(amount)
      : new Intl.NumberFormat("en-US").format(amount);
  const symbol = currency === "INR" ? "₹" : "$";
  return `${opts.from ? "from " : ""}${symbol}${num}${opts.monthly ? " a month" : ""}`;
}

export const SITE_URL = "https://genartml.com";
