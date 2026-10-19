import { siteConfig } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata = buildMetadata({
  title: "Work — Software and AI systems engineered by Genartml",
  description:
    "See our proprietary products Evoluter and Extuter, alongside approved client case studies across India and abroad.",
  path: "/work/",
});

export default function WorkPage() {
  const { products, caseStudies } = siteConfig;
  const approvedCaseStudies = caseStudies.filter((cs) => cs.approved);

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            Portfolio & Products
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Software and AI systems in production.
          </h1>
          <p className="max-w-2xl text-body text-ink-70 leading-relaxed">
            We build and operate our own proprietary software products, while designing custom platforms and AI workflows for select clients.
          </p>
        </div>
      </Section>

      {/* 2. OWN PRODUCTS (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              Our Own Products
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Proprietary software built and operated by Genartml.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Evoluter */}
            <div className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper/80">
                    P/01 · Edtech
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-emerald-400">
                    ● Live in production
                  </span>
                </div>
                <h3 className="text-h2 font-medium text-paper">Evoluter</h3>
                <div className="flex flex-col gap-4 text-small text-paper/70 border-t border-white/10 pt-4">
                  <div>
                    <span className="font-medium text-paper">What it is: </span>
                    AI preparation platform for UPSC and civil services aspirants.
                  </div>
                  <div>
                    <span className="font-medium text-paper">Who uses it: </span>
                    Civil service aspirants across India preparing for prelims and mains exams.
                  </div>
                  <div>
                    <span className="font-medium text-paper">What we built: </span>
                    End-to-end syllabus engine, instant answer evaluation, diagnostic study planner, and high-concurrency practice workflows.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button href={products.evoluterUrl} variant="primary" on="black" external>
                  Visit Evoluter →
                </Button>
              </div>
            </div>

            {/* Extuter */}
            <div className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper/80">
                    P/02 · Edtech
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-emerald-400">
                    ● Live in production
                  </span>
                </div>
                <h3 className="text-h2 font-medium text-paper">Extuter</h3>
                <div className="flex flex-col gap-4 text-small text-paper/70 border-t border-white/10 pt-4">
                  <div>
                    <span className="font-medium text-paper">What it is: </span>
                    AI learning companion for JEE and NEET competitive exam aspirants.
                  </div>
                  <div>
                    <span className="font-medium text-paper">Who uses it: </span>
                    Students preparing for engineering and medical entrance examinations.
                  </div>
                  <div>
                    <span className="font-medium text-paper">What we built: </span>
                    Problem-solving copilot, instant doubt clarification, step-by-step concept visualizer, and test performance analytics.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Button href={products.extuterUrl} variant="primary" on="black" external>
                  Visit Extuter →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. CLIENT CASE STUDIES (White, rendered if approved) */}
      {approvedCaseStudies.length > 0 && (
        <Section tone="white">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
                Client Results
              </span>
              <h2 className="text-h2 font-light tracking-tight">
                Verified client implementations.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {approvedCaseStudies.map((cs) => (
                <div
                  key={cs.slug}
                  className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-8 md:p-10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-ink"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between text-small text-ink-70">
                      <span className="font-medium text-ink">{cs.client}</span>
                      <span className="rounded-full bg-neutral-100 px-3 py-0.5 text-xs">{cs.industry}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-xs uppercase tracking-wider font-medium text-ink-70">The Problem</span>
                      <p className="text-small text-ink leading-relaxed">{cs.problem}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <span className="text-xs uppercase tracking-wider font-medium text-ink-70">What We Built</span>
                      <p className="text-small text-ink leading-relaxed">{cs.built}</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-5">
                      <span className="text-xs uppercase tracking-wider font-medium text-neutral-500">Measured Result</span>
                      <p className="text-h3 font-medium text-ink">{cs.result}</p>
                    </div>

                    {cs.quote && (
                      <blockquote className="border-l-2 border-ink pl-4 italic text-small text-ink-70">
                        "{cs.quote}"
                      </blockquote>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <ClosingCTA tone="white" />
    </>
  );
}
