import { siteConfig } from "@/site.config";
import { bookCallUrl } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PricingView } from "@/components/PricingView";

export const metadata = buildMetadata({
  title: "Pricing — Fixed prices written before we start",
  description:
    "All official packages for AI workflows, voice agents, websites, software development and care plans. No hourly billing.",
  path: "/pricing/",
});

const pricingFaq = [
  {
    q: "Why fixed prices instead of hourly billing?",
    a: "Hourly billing penalizes efficiency and creates misaligned incentives. A fixed price written before we start means you know your exact investment upfront with zero scope surprises.",
  },
  {
    q: "What payment terms do you require?",
    a: "Standard projects are 50% upfront to initiate technical architecture and design, and 50% upon final acceptance before production handover.",
  },
  {
    q: "How does Indian GST work?",
    a: "For businesses registered in India, 18% GST is added to invoices with proper GST tax credits provided. Clients outside India are invoiced in USD with 0% Indian GST.",
  },
  {
    q: "What about ongoing software licenses and tool fees?",
    a: "Third-party APIs and platform hosting (e.g. OpenAI, WhatsApp Business API, Twilio, Supabase, Vercel) are paid directly to providers at cost in your own accounts.",
  },
];

export default function PricingPage() {
  const { showPrices } = siteConfig;

  return (
    <>
      {/* 1. Header & Hero */}
      <Section tone="white" className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="flex max-w-4xl flex-col items-start gap-6">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
            Transparent Investment
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Fixed prices. Written before we start.
          </h1>
          <p className="max-w-2xl text-body text-ink-70">
            Every package has a clear scope, delivery timeline in working days, and included post-launch support. No hourly rates. No hidden retainers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
              {siteConfig.copy.primaryButton}
            </Button>
            <a
              href="/pricing/Genartml-price-list-2026-27.pdf"
              download
              className="inline-flex min-h-11 items-center justify-center border border-ink bg-paper px-6 py-3 text-small font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Download price list (PDF) ↓
            </a>
          </div>
        </div>
      </Section>

      {/* 2. Interactive Pricing Matrix or Fallback Form */}
      <Section tone="white" className="border-t border-ink/10">
        {showPrices ? (
          <PricingView />
        ) : (
          <div className="mx-auto max-w-xl border border-ink p-8 text-center">
            <h2 className="text-h2 font-light">Request our complete price list</h2>
            <p className="mt-4 text-small text-ink-70">
              Enter your email and we will send you our official 2026-27 service price list PDF within minutes.
            </p>
            <form className="mt-8 flex flex-col gap-4">
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="min-h-11 border border-ink px-4 text-small text-ink"
              />
              <Button href="/contact/" variant="primary" on="white">
                Request price list
              </Button>
            </form>
          </div>
        )}
      </Section>

      {/* 3. Included In Every Package (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-paper/70 uppercase">Standards</span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Included in every project.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3 border border-paper/20 p-6">
              <h3 className="text-body font-medium text-paper">Full IP ownership</h3>
              <p className="text-small text-paper/70">All source code, UI designs and documentation pass to you upon final invoice settlement.</p>
            </div>
            <div className="flex flex-col gap-3 border border-paper/20 p-6">
              <h3 className="text-body font-medium text-paper">Weekly demo links</h3>
              <p className="text-small text-paper/70">Test links deployed every Friday so you can review real working progress continuously.</p>
            </div>
            <div className="flex flex-col gap-3 border border-paper/20 p-6">
              <h3 className="text-body font-medium text-paper">Direct founder review</h3>
              <p className="text-small text-paper/70">Every deploy is inspected by Daksh for code cleanliness, security, and edge performance.</p>
            </div>
            <div className="flex flex-col gap-3 border border-paper/20 p-6">
              <h3 className="text-body font-medium text-paper">Included post-launch support</h3>
              <p className="text-small text-paper/70">30 to 90 days of free bug fixes, adjustments and monitoring included with every deliverable.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Terms, GST and Costs Note (White) */}
      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col gap-3 border border-ink p-8">
            <span className="text-small font-medium text-ink-70">Payment terms</span>
            <h3 className="text-h3 font-medium">Clear milestones</h3>
            <p className="text-small text-ink-70">
              50% deposit before kickoff to initiate architecture, and 50% on final demonstration before DNS cutover and repository handover.
            </p>
          </div>

          <div className="flex flex-col gap-3 border border-ink p-8">
            <span className="text-small font-medium text-ink-70">Tax and invoicing</span>
            <h3 className="text-h3 font-medium">Indian GST & international</h3>
            <p className="text-small text-ink-70">
              18% GST applies to domestic Indian businesses with standard B2B input tax credit. International clients invoice in USD with 0% Indian GST.
            </p>
          </div>

          <div className="flex flex-col gap-3 border border-ink p-8">
            <span className="text-small font-medium text-ink-70">Provider costs</span>
            <h3 className="text-h3 font-medium">Billed at cost</h3>
            <p className="text-small text-ink-70">
              Third-party APIs (OpenAI, WhatsApp API, Twilio, hosting) are connected directly to your credit card. Zero markups.
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Pricing FAQ */}
      <Section tone="white" className="border-t border-ink/10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-ink-70 uppercase">FAQ</span>
            <h2 className="text-h2 font-light tracking-tight">
              Pricing questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pricingFaq.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 border-t border-ink/20 pt-4">
                <h3 className="text-body font-medium text-ink">{item.q}</h3>
                <p className="text-small text-ink-70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <ClosingCTA tone="black" />
    </>
  );
}
