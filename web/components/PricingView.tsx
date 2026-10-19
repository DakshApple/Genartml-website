"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";
import { bookCallUrl } from "@/lib/config";
import { Button } from "@/components/Button";
import { SERVICES_DETAIL } from "@/lib/services-data";

export function PricingView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { services } = siteConfig;

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.slug === selectedCategory);

  return (
    <div className="flex flex-col gap-12">
      {/* Category Filter Pills with smooth transitions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-5 py-2 text-small font-medium transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-ink text-paper shadow-md"
                : "border border-neutral-200 bg-paper text-ink hover:border-neutral-400 hover:bg-neutral-50"
            }`}
          >
            All offerings
          </button>
          {services.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSelectedCategory(s.slug)}
              className={`rounded-full px-5 py-2 text-small font-medium transition-all duration-200 ${
                selectedCategory === s.slug
                  ? "bg-ink text-paper shadow-md"
                  : "border border-neutral-200 bg-paper text-ink hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-600">
          Fixed scope · Guaranteed delivery in working days
        </span>
      </div>

      {/* Services and Package Grid */}
      <div className="flex flex-col gap-16">
        {filteredServices.map((service) => {
          const detail = SERVICES_DETAIL[service.slug];

          return (
            <div key={service.slug} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
                  {service.name}
                </span>
                <h2 className="text-h2 font-light tracking-tight text-ink">
                  {service.name} Scope Tiers
                </h2>
                <p className="max-w-2xl text-body text-ink-70">
                  {detail?.sub || "Production-grade engineering built for longevity, speed, and complete client ownership."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {service.packages.map((pkg, idx) => {
                  const detailPkg = detail?.packages[idx];
                  const deliverables = detailPkg?.includes || [
                    "Production architecture & system implementation",
                    "Complete source code and assets handover",
                    "Milestone demos every Friday",
                    `${pkg.supportDays} days included post-launch support`,
                  ];

                  return (
                    <div
                      key={idx}
                      className="group flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink hover:shadow-2xl"
                    >
                      <div className="flex flex-col gap-6">
                        {/* Header: Tier name and Timeline pill */}
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-h3 font-medium text-ink tracking-tight">
                            {pkg.name} Tier
                          </h3>
                          <span className="rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 whitespace-nowrap">
                            {pkg.deliveryDays}
                          </span>
                        </div>

                        {/* Value proposition headline */}
                        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4">
                          <span className="text-xs uppercase font-medium tracking-wider text-neutral-500 block mb-1">
                            Scope model
                          </span>
                          <span className="text-body font-medium text-ink block">
                            Fixed scope & timeline
                          </span>
                          <span className="text-xs text-neutral-600 block mt-0.5">
                            Written agreement before kickoff with zero surprise invoices.
                          </span>
                        </div>

                        {/* Support badge */}
                        {pkg.supportDays > 0 && (
                          <div className="flex items-center gap-2 text-small font-medium text-ink-70">
                            <span className="h-2 w-2 rounded-full bg-neutral-400" />
                            <span>{pkg.supportDays} days included engineering support</span>
                          </div>
                        )}

                        {/* Deliverables list */}
                        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5">
                          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            Included deliverables
                          </span>
                          <ul className="flex flex-col gap-2.5 text-small text-ink-70">
                            {deliverables.map((item, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2.5">
                                <span className="text-ink select-none font-bold text-xs mt-0.5" aria-hidden="true">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8 pt-6 border-t border-neutral-100">
                        <Button
                          href={`/contact/?service=${encodeURIComponent(service.name)}&tier=${encodeURIComponent(pkg.name)}`}
                          variant="primary"
                          on="white"
                          className="w-full text-center"
                          event="cta_request_proposal"
                        >
                          Request {pkg.name} proposal →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tailored Scope Calculator / Consultation Card */}
      <div className="rounded-3xl border border-ink bg-neutral-900 p-8 md:p-12 text-paper shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-6 max-w-2xl relative z-10">
          <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
            Custom Requirements
          </span>
          <h3 className="text-h2 font-light tracking-tight text-white">
            Need a custom architecture or enterprise workflow?
          </h3>
          <p className="text-body text-neutral-300">
            Tell us about your operations, tool stack, and ideal launch timeline. We will review your requirements and provide a fixed-scope technical proposal within 48 hours.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="black" event="cta_book_call">
              Book a 20-minute discovery call
            </Button>
            <Button href="/contact/" variant="secondary" on="black">
              Send us your project brief →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
