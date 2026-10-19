"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { track } from "@/lib/analytics";

export function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UTM tracking state
  const [utm, setUtm] = useState({ source: "", medium: "", campaign: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUtm({
        source: params.get("utm_source") || "",
        medium: params.get("utm_medium") || "",
        campaign: params.get("utm_campaign") || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Honeypot check
    if (formData.get("hp_website")) {
      // Bot detected - simulate success
      router.push("/contact/thank-you/");
      return;
    }

    try {
      track("form_submit", { form: "contact", ...utm });

      // Using Web3Forms endpoint for static export
      formData.append("access_key", "653ea76b-fbc1-4ebb-a13b-58712e49ccd9");
      formData.append("subject", "New enquiry from Genartml.com Contact Form");
      formData.append("from_name", "Genartml Lead Engine");
      formData.append("utm_source", utm.source);
      formData.append("utm_medium", utm.medium);
      formData.append("utm_campaign", utm.campaign);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const res = await response.json();
      if (res.success) {
        router.push("/contact/thank-you/");
      } else {
        setError(res.message || "Failed to submit enquiry. Please email us directly at team@genartml.com.");
      }
    } catch {
      setError("Network error. Please email us directly at team@genartml.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" onFocus={() => track("form_start", { form: "contact" })}>
      {/* Honeypot field (hidden from humans) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_website">Do not fill this</label>
        <input type="text" id="hp_website" name="hp_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-name" className="text-small font-medium text-ink">
            Your name <span className="text-ink-70">*</span>
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Daksh Suthar"
            className="min-h-11 border border-ink bg-paper px-4 text-small text-ink"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-email" className="text-small font-medium text-ink">
            Work email <span className="text-ink-70">*</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="min-h-11 border border-ink bg-paper px-4 text-small text-ink"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="f-phone" className="text-small font-medium text-ink">
            Phone or WhatsApp
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className="min-h-11 border border-ink bg-paper px-4 text-small text-ink"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-company" className="text-small font-medium text-ink">
            Company name
          </label>
          <input
            id="f-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Acme Corp"
            className="min-h-11 border border-ink bg-paper px-4 text-small text-ink"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="f-need" className="text-small font-medium text-ink">
          What do you need? <span className="text-ink-70">*</span>
        </label>
        <select
          id="f-need"
          name="service"
          required
          defaultValue=""
          className="min-h-11 border border-ink bg-paper px-4 text-small text-ink"
        >
          <option value="" disabled>
            Select a service
          </option>
          <option value="AI Workflows">AI Workflows</option>
          <option value="Voice AI Agent">Voice AI Agent</option>
          <option value="Website">Website</option>
          <option value="Software Development">Software Development</option>
          <option value="Care Plan">Care Plan</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="f-message" className="text-small font-medium text-ink">
          Tell us a little more <span className="text-ink-70">*</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          rows={5}
          placeholder="Describe your current manual workflow, what you want to build, and any specific timelines."
          className="border border-ink bg-paper p-4 text-small text-ink"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="f-consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 border border-ink"
        />
        <label htmlFor="f-consent" className="text-small text-ink-70">
          I consent to Genartml handling my details to reply to this enquiry in accordance with the{" "}
          <Link href="/legal/privacy-policy/" className="text-ink underline hover:text-ink-70">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {error && (
        <div className="border border-ink bg-paper p-4 text-small font-medium text-ink">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center border border-ink bg-ink px-8 py-3 text-small font-medium text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send message →"}
        </button>
      </div>
    </form>
  );
}
