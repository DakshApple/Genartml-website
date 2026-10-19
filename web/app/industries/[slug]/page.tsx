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
  const publishedSlugs = Object.keys(siteConfig.industries).filter(
    (slug) => siteConfig.industries[slug]
  );
  return publishedSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES_DETAIL[slug];
  if (!ind || !siteConfig.industries[slug]) return {};

  return buildMetadata({
    title: `${ind.name} AI & Software Systems — Genartml`,
    description: ind.sub,
    path: `/industries/${slug}/`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES_DETAIL[slug];
  if (!ind || !siteConfig.industries[slug]) notFound();

  const waUrl = whatsappUrl();

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <Link
            href="/#industries"
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-small font-medium text-ink-70 transition-colors hover:border-ink hover:text-ink"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
            <span>All industries</span>
          </Link>
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            Industry Solution · {ind.name}
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            {ind.headline}
          </h1>
          <p className="max-w-2xl text-body text-ink-70 leading-relaxed">
            {ind.sub}
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

      {/* 2. THE PROBLEM (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-sm">
          <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
            The Challenge
          </span>
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
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              What We Build
            </span>
            <h2 className="text-h2 font-light tracking-tight">
              Bespoke systems for {ind.name.toLowerCase()}.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ind.whatWeBuild.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col gap-3 rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-xl"
              >
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">
                  0{idx + 1}
                </span>
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
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              Sample Workflow
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Four-step integrated flow.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ind.sampleWorkflow.map((step, idx) => (
              <div
                key={idx}
                className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1"
              >
                <span className="text-xs font-mono text-paper/60 uppercase">{step.step}</span>
                <h3 className="text-body font-medium text-paper">{step.title}</h3>
                <p className="text-small text-paper/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. FITTING PACKAGE (White) */}
      <Section tone="white">
        <div className="rounded-3xl border border-neutral-200/90 bg-neutral-50/50 p-8 md:p-12 max-w-3xl shadow-sm">
          <span className="rounded-full bg-neutral-200/70 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
            Recommended Package
          </span>
          <h2 className="text-h2 font-light tracking-tight mt-3">
            {ind.fittingPackage.serviceName} — {ind.fittingPackage.packageName}
          </h2>
          <p className="text-body text-ink-70 mt-4 leading-relaxed">
            {ind.fittingPackage.why}
          </p>
          <div className="mt-6">
            <Button href="/pricing/" variant="primary" on="white">
              View scope & deliverables →
            </Button>
          </div>
        </div>
      </Section>

      {/* 6. FAQ (White) */}
      <Section tone="white" className="border-t border-ink/10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              Questions
            </span>
            <h2 className="text-h2 font-light tracking-tight">
              Common questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ind.faq.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all duration-200 hover:border-ink/40"
              >
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
