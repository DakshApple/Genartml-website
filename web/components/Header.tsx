"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { siteConfig } from "@/site.config";
import { bookCallUrl, publishedIndustries } from "@/lib/config";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const industries = publishedIndustries();
  const showPrices = siteConfig.showPrices;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper">
      <div className="container-grid flex h-20 items-center justify-between">
        {/* Left: Lockup */}
        <Logo tone="light" height={26} />

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-small font-medium text-ink hover:text-ink-70"
              aria-expanded={servicesOpen}
            >
              Services
              <span className="text-[10px]" aria-hidden="true">▼</span>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full w-64 rounded-2xl border border-neutral-200/90 bg-paper/95 p-2 shadow-2xl backdrop-blur-md">
                {siteConfig.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}/`}
                    className="block rounded-xl px-4 py-2.5 text-small font-medium text-ink transition-all hover:bg-neutral-100 hover:translate-x-1"
                    onClick={() => setServicesOpen(false)}
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Industries dropdown (rendered only if published industries exist) */}
          {industries.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setIndustriesOpen(true)}
              onMouseLeave={() => setIndustriesOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-small font-medium text-ink hover:text-ink-70"
                aria-expanded={industriesOpen}
              >
                Industries
                <span className="text-[10px]" aria-hidden="true">▼</span>
              </button>
              {industriesOpen && (
                <div className="absolute left-0 top-full w-64 rounded-2xl border border-neutral-200/90 bg-paper/95 p-2 shadow-2xl backdrop-blur-md">
                  {industries.map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries/${ind.slug}/`}
                      className="block rounded-xl px-4 py-2.5 text-small font-medium text-ink transition-all hover:bg-neutral-100 hover:translate-x-1"
                      onClick={() => setIndustriesOpen(false)}
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link href="/work/" className="text-small font-medium text-ink hover:text-ink-70">
            Work
          </Link>
          <Link href="/pricing/" className="text-small font-medium text-ink hover:text-ink-70">
            Pricing
          </Link>
          <Link href="/about/" className="text-small font-medium text-ink hover:text-ink-70">
            About
          </Link>
          <Link href="/blog/" className="text-small font-medium text-ink hover:text-ink-70">
            Blog
          </Link>
          <Link href="/contact/" className="text-small font-medium text-ink hover:text-ink-70">
            Contact
          </Link>
        </nav>

        {/* Right Desktop CTA */}
        <div className="hidden lg:block">
          <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
            {siteConfig.copy.primaryButton}
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-ink transition-colors hover:border-ink lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="font-medium text-small">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Full-Screen Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-30 z-50 flex flex-col justify-between bg-paper p-6 lg:hidden">
          <nav className="flex flex-col gap-4 overflow-y-auto">
            <span className="text-[11px] font-medium tracking-wider text-ink-70 uppercase">Services</span>
            <div className="flex flex-col gap-2 pl-3 border-l border-ink/20">
              {siteConfig.services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}/`}
                  className="py-1 text-base font-medium text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.name}
                </Link>
              ))}
            </div>

            {industries.length > 0 && (
              <>
                <span className="mt-2 text-[11px] font-medium tracking-wider text-ink-70 uppercase">Industries</span>
                <div className="flex flex-col gap-2 pl-3 border-l border-ink/20">
                  {industries.map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries/${ind.slug}/`}
                      className="py-1 text-base font-medium text-ink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <Link href="/work/" className="mt-2 text-lg font-medium text-ink" onClick={() => setMobileOpen(false)}>
              Work
            </Link>
            <Link href="/pricing/" className="text-lg font-medium text-ink" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/about/" className="text-lg font-medium text-ink" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/blog/" className="text-lg font-medium text-ink" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            <Link href="/contact/" className="text-lg font-medium text-ink" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
          </nav>

          {/* Pinned Button at Bottom */}
          <div className="pt-6 border-t border-ink/10">
            <Button
              href={bookCallUrl()}
              variant="primary"
              on="white"
              event="cta_book_call"
              className="w-full text-center"
            >
              {siteConfig.copy.primaryButton}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
