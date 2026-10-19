import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { bookCallUrl, whatsappUrl, formatPrice } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ClosingCTA } from "@/components/ClosingCTA";
import { SERVICES_DETAIL } from "@/lib/services-data";

export async function generateStaticParams() {
  return Object.keys(SERVICES_DETAIL).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DETAIL[slug];
  if (!service) return {};

  return buildMetadata({
    title: `${service.name} — Fixed price and timeline`,
    description: service.sub,
    path: `/services/${slug}/`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DETAIL[slug];
  if (!service) notFound();

  const waUrl = whatsappUrl();
  const showPrices = siteConfig.showPrices;

  // Other related services
  const relatedServices = siteConfig.services.filter((s) => s.slug !== slug);

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <Link href="/#services" className="text-small font-medium text-ink-70 underline hover:text-ink">
            ← All services
          </Link>
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
            Service · {service.name}
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            {service.headline}
          </h1>
          <p className="max-w-2xl text-body text-ink-70">
            {service.sub}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
              {siteConfig.copy.primaryButton}
            </Button>
            {waUrl ? (
              <Button href={waUrl} variant="secondary" on="white" event="cta_whatsapp" external>
                Chat on WhatsApp
              </Button>
            ) : (
              <Button href="/contact/" variant="secondary" on="white">
                Contact our team
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* 2. PACKAGES (Black) */}
      <Section tone="black" id="packages">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-paper/70 uppercase">Packages</span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Transparent packages. Written deliverables.
            </h2>
            {service.minuteRateNote && (
              <p className="text-small text-paper/70 font-medium">
                {service.minuteRateNote}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {service.packages.map((pkg, idx) => (
              <div key={idx} className="flex flex-col justify-between border border-paper/20 p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3 font-medium text-paper">{pkg.name}</h3>
                    <span className="text-small font-medium text-paper/70">{pkg.deliveryDays}</span>
                  </div>

                  {showPrices && (
                    <div className="text-display font-light text-paper">
                      {formatPrice(pkg.priceInr, "INR", { from: pkg.from, monthly: service.monthly })}
                    </div>
                  )}

                  {pkg.supportDays > 0 && (
                    <div className="text-small font-medium text-paper/70">
                      {pkg.supportDays} days of included support
                    </div>
                  )}

                  <ul className="flex flex-col gap-2.5 border-t border-paper/10 pt-6 text-small text-paper/70">
                    {pkg.includes.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="text-paper select-none font-mono" aria-hidden="true">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-paper/10">
                  <Button
                    href={bookCallUrl()}
                    variant="primary"
                    on="black"
                    className="w-full text-center"
                    event="cta_book_call"
                  >
                    Select {pkg.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 3. WHAT WE BUILD (White) */}
      <Section tone="white">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Deliverables</span>
            <h2 className="text-h2 font-light tracking-tight">
              What we build. Plain words.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {service.whatWeBuild.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3 border border-ink p-8">
                <span className="text-small font-medium text-ink-70">0{idx + 1}</span>
                <h3 className="text-body font-medium text-ink">{item.title}</h3>
                <p className="text-small text-ink-70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. HOW IT WORKS (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-paper/70 uppercase">Process</span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              How it works. Five steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {service.howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3 border border-paper/20 p-6">
                <span className="text-small font-medium text-paper/70">{step.step}</span>
                <h3 className="text-body font-medium text-paper">{step.title}</h3>
                <p className="text-small text-paper/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. RUNNING COSTS (White) */}
      <Section tone="white">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Transparency</span>
          <h2 className="text-h2 font-light tracking-tight">
            What it costs to run.
          </h2>
          <p className="text-body text-ink-70">
            {service.runningCosts}
          </p>
        </div>
      </Section>

      {/* 6. QUESTIONS (White) */}
      <Section tone="white" className="border-t border-ink/10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Questions</span>
            <h2 className="text-h2 font-light tracking-tight">
              Questions about {service.name.toLowerCase()}.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {service.faq.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 border-t border-ink/20 pt-4">
                <h3 className="text-body font-medium text-ink">{item.q}</h3>
                <p className="text-small text-ink-70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. RELATED SERVICES (White) */}
      <Section tone="white" className="border-t border-ink/10">
        <div className="flex flex-col gap-8">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Related Services</span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                href={`/services/${rel.slug}/`}
                className="flex items-center justify-between border border-ink p-5 hover:bg-ink hover:text-paper"
              >
                <span className="text-small font-medium">{rel.name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* 8. CLOSING CTA */}
      <ClosingCTA tone="black" />
    </>
  );
}
