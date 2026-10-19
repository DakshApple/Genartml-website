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
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink bg-paper p-4 text-ink shadow-md"
        >
          <div className="container-grid flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-small text-ink max-w-2xl">
              We use cookies to measure website traffic and understand visitor interest. We never sell your data.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDecline}
                className="min-h-11 border border-ink bg-paper px-4 py-2 text-small font-medium text-ink hover:bg-ink hover:text-paper"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="min-h-11 border border-ink bg-ink px-4 py-2 text-small font-medium text-paper hover:bg-paper hover:text-ink"
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
