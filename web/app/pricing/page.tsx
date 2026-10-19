import { siteConfig } from "@/site.config";
import { bookCallUrl } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PricingView } from "@/components/PricingView";

export const metadata = buildMetadata({
  title: "Investment & Scope — Fixed scope written before we start",
  description:
    "Explore our scope tiers and deliverables for AI workflows, voice agents, websites, software development and care plans. Guaranteed written delivery.",
  path: "/pricing/",
});

const pricingFaq = [
  {
    q: "Why fixed scope & investment instead of hourly billing?",
    a: "Hourly billing penalizes speed and efficiency, and introduces misaligned incentives. A fixed scope agreed in writing before we start means you know your exact deliverables, timeline, and investment upfront with zero surprises.",
  },
  {
    q: "What payment terms do you require?",
    a: "Standard projects are 50% upfront to initiate technical architecture and design, and 50% upon final acceptance before production handover and DNS cutover.",
  },
  {
    q: "How does Indian GST work?",
    a: "For businesses registered in India, 18% GST is added to invoices with proper GST input tax credits provided. Clients outside India are invoiced in USD with 0% Indian GST.",
  },
  {
    q: "What about ongoing software licenses and tool fees?",
    a: "Third-party APIs and platform hosting (such as OpenAI, WhatsApp Business API, Twilio, Supabase, Vercel) are paid directly to providers at cost in your own accounts with zero markup.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* 1. Header & Hero */}
      <Section tone="white" className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="flex max-w-4xl flex-col items-start gap-6">
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            Transparent Scope & Delivery
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Fixed scope. Written before we start.
          </h1>
          <p className="max-w-2xl text-body text-ink-70">
            Every package has a clear deliverable scope, delivery timeline in working days, and included post-launch engineering support. No hourly rates. No hidden retainers.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
              {siteConfig.copy.primaryButton}
            </Button>
            <Button href="/contact/" variant="secondary" on="white">
              Request a custom proposal →
            </Button>
          </div>
        </div>
      </Section>

      {/* 2. Interactive Scope & Delivery Matrix (No Prices) */}
      <Section tone="white" className="border-t border-ink/10 pt-12">
        <PricingView />
      </Section>

      {/* 3. Included In Every Package (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              Engineering Standards
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Included in every project.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">Standard 01</span>
              <h3 className="text-body font-medium text-paper">Full IP ownership</h3>
              <p className="text-small text-paper/70">All source code, UI designs and documentation pass to you upon final invoice settlement.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">Standard 02</span>
              <h3 className="text-body font-medium text-paper">Weekly demo links</h3>
              <p className="text-small text-paper/70">Test links deployed every Friday so you can review real working progress continuously.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">Standard 03</span>
              <h3 className="text-body font-medium text-paper">Direct founder review</h3>
              <p className="text-small text-paper/70">Every deploy is inspected by Daksh for code cleanliness, security, and edge performance.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">Standard 04</span>
              <h3 className="text-body font-medium text-paper">Included post-launch support</h3>
              <p className="text-small text-paper/70">30 to 90 days of free bug fixes, adjustments and monitoring included with every deliverable.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Terms, GST and Costs Note (White) */}
      <Section tone="white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-ink">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">Terms</span>
            <h3 className="text-h3 font-medium">Clear milestones</h3>
            <p className="text-small text-ink-70">
              50% deposit before kickoff to initiate architecture, and 50% on final demonstration before DNS cutover and repository handover.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-ink">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">Taxation</span>
            <h3 className="text-h3 font-medium">Indian GST & international</h3>
            <p className="text-small text-ink-70">
              18% GST applies to domestic Indian businesses with standard B2B input tax credit. International clients invoice in USD with 0% Indian GST.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-ink">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">Provider costs</span>
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
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">FAQ</span>
            <h2 className="text-h2 font-light tracking-tight">
              Investment & Scope questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {pricingFaq.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all duration-200 hover:border-ink/40">
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
