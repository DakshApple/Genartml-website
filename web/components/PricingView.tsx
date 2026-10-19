"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";
import { bookCallUrl, formatPrice } from "@/lib/config";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export function PricingView() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const { services, voiceMinuteRate } = siteConfig;

  return (
    <div className="flex flex-col gap-12">
      {/* Currency Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <p className="text-small text-ink-70">
          Showing all official service packages with fixed delivery timelines.
        </p>
        <div className="inline-flex border border-ink p-1">
          <button
            type="button"
            onClick={() => setCurrency("INR")}
            className={`px-4 py-1.5 text-small font-medium transition-colors ${
              currency === "INR" ? "bg-ink text-paper" : "text-ink hover:text-ink-70"
            }`}
          >
            INR (₹)
          </button>
          <button
            type="button"
            onClick={() => setCurrency("USD")}
            className={`px-4 py-1.5 text-small font-medium transition-colors ${
              currency === "USD" ? "bg-ink text-paper" : "text-ink hover:text-ink-70"
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Services and Package Tables */}
      <div className="flex flex-col gap-16">
        {services.map((service) => (
          <div key={service.slug} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
                {service.name}
              </span>
              <h2 className="text-h2 font-light tracking-tight">
                {service.name} packages
              </h2>
              {service.slug === "voice-ai-agents" && (
                <p className="text-small text-ink-70 font-medium">
                  Voice calling minutes: {currency === "INR" ? `₹${voiceMinuteRate.inr}` : `$${voiceMinuteRate.usd}`} per connected minute.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {service.packages.map((pkg, idx) => {
                const price = currency === "INR" ? pkg.priceInr : pkg.priceUsd;
                return (
                  <div key={idx} className="flex flex-col justify-between border border-ink p-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-h3 font-medium text-ink">{pkg.name}</h3>
                        <span className="text-small font-medium text-ink-70">{pkg.deliveryDays}</span>
                      </div>

                      <div className="text-h1 font-light text-ink">
                        {formatPrice(price, currency, { from: pkg.from, monthly: service.monthly })}
                      </div>

                      {pkg.supportDays > 0 && (
                        <span className="text-small font-medium text-ink-70">
                          {pkg.supportDays} days included support
                        </span>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-ink/10">
                      <Button
                        href={bookCallUrl()}
                        variant="primary"
                        on="white"
                        className="w-full text-center"
                        event="cta_book_call"
                      >
                        Book {pkg.name}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
