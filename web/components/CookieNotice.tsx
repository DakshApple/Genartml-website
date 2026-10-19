"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsent, setConsent, CONSENT_EVENT } from "@/lib/analytics";
import { siteConfig } from "@/site.config";

export function CookieNotice() {
  const [consent, setLocalConsent] = useState<"accepted" | "declined" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalConsent(getConsent());

    const onConsentChange = () => setLocalConsent(getConsent());
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  const handleAccept = () => setConsent("accepted");
  const handleDecline = () => setConsent("declined");

  const ga4Id = siteConfig.analytics.ga4Id;

  return (
    <>
      {/* Load GA4 only after Accept */}
      {consent === "accepted" && ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}

      {/* Cookie Banner */}
      {mounted && consent === null && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-3xl border border-neutral-200/90 bg-paper/95 p-6 text-ink shadow-2xl backdrop-blur-md md:bottom-6"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-small text-ink max-w-md">
              We use cookies to measure website traffic and understand visitor interest. We never sell your data.
            </p>
            <div className="flex gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDecline}
                className="min-h-11 rounded-full border border-neutral-300 bg-paper px-5 py-2 text-small font-medium text-ink transition-colors hover:border-ink hover:bg-neutral-50"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="min-h-11 rounded-full border border-ink bg-ink px-5 py-2 text-small font-medium text-paper transition-all hover:bg-neutral-900 hover:shadow-md"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
