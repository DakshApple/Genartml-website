/**
 * Analytics wrapper. Events fire only after the visitor accepts cookies.
 * Event names used across the site:
 *   cta_book_call, cta_whatsapp, cta_phone, cta_price_list, form_start,
 *   form_submit (conversion), whatsapp_click (conversion), scroll_50, scroll_90,
 *   outbound_social
 */
export const CONSENT_KEY = "genartml-consent";
export const CONSENT_EVENT = "genartml-consent-change";

export type Consent = "accepted" | "declined" | null;

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setConsent(value: "accepted" | "declined") {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || getConsent() !== "accepted") return;
  (window as GtagWindow).gtag?.("event", event, params);
}
