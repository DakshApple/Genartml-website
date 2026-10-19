import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { bookCallUrl, whatsappUrl } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ClosingCTA } from "@/components/ClosingCTA";
import { INDUSTRIES_DETAIL } from "@/lib/industries-data";

export async function generateStaticParams() {
  // Only publish confirmed industry sectors per hard rule
  return Object.entries(siteConfig.industries)
    .filter(([, on]) => on)
    .map(([slug]) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES_DETAIL[slug];
  if (!ind || !siteConfig.industries[slug]) return {};

  return buildMetadata({
    title: `${ind.name} AI Systems & Software — Genartml`,
    description: `Specialized AI workflows, voice agents, and software systems engineered for ${ind.name.toLowerCase()}.`,
    path: `/industries/${slug}/`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES_DETAIL[slug];
  const isConfirmed = siteConfig.industries[slug];

  if (!ind || !isConfirmed) notFound();

  const waUrl = whatsappUrl();

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <Link href="/" className="text-small font-medium text-ink-70 underline hover:text-ink">
            ← Home
          </Link>
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
            Industry Solution · {ind.name}
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            AI systems engineered for {ind.name.toLowerCase()}.
          </h1>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
              {siteConfig.copy.primaryButton}
            </Button>
            {waUrl && (
              <Button href={waUrl} variant="secondary" on="white" event="cta_whatsapp" external>
                Chat on WhatsApp
              </Button>
            )}
          </div>
        </div>
      </Section>

      {/* 2. THE PROBLEM (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-6 max-w-3xl">
          <span className="text-small font-medium tracking-wider text-paper/70 uppercase">The Challenge</span>
          <h2 className="text-h2 font-light tracking-tight text-paper">
            The operational bottleneck.
          </h2>
          <p className="text-body text-paper/70 leading-relaxed">
            {ind.problem}
          </p>
        </div>
      </Section>

      {/* 3. WHAT WE BUILD (White) */}
      <Section tone="white">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-ink-70 uppercase">What We Build</span>
            <h2 className="text-h2 font-light tracking-tight">
              Bespoke systems for {ind.name.toLowerCase()}.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ind.whatWeBuild.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3 border border-ink p-8">
                <span className="text-small font-medium text-ink-70">0{idx + 1}</span>
                <h3 className="text-body font-medium text-ink">{item.title}</h3>
                <p className="text-small text-ink-70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. SAMPLE WORKFLOW (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-paper/70 uppercase">Sample Workflow</span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Four-step automated flow.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ind.sampleWorkflow.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3 border border-paper/20 p-6">
                <span className="text-small font-medium text-paper/70">{step.step}</span>
                <h3 className="text-body font-medium text-paper">{step.title}</h3>
                <p className="text-small text-paper/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. FITTING PACKAGE (White) */}
      <Section tone="white">
        <div className="border border-ink p-8 md:p-12 max-w-3xl">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Recommended Package</span>
          <h2 className="text-h2 font-light tracking-tight mt-2">
            {ind.fittingPackage.serviceName} — {ind.fittingPackage.packageName}
          </h2>
          <p className="text-body text-ink-70 mt-4">
            {ind.fittingPackage.why}
          </p>
          <div className="mt-6">
            <Button href="/pricing/" variant="primary" on="white">
              View package details & pricing →
            </Button>
          </div>
        </div>
      </Section>

      {/* 6. FAQ (White) */}
      <Section tone="white" className="border-t border-ink/10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Questions</span>
            <h2 className="text-h2 font-light tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ind.faq.map((item, idx) => (
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
