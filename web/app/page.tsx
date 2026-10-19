import Link from "next/link";
import { siteConfig } from "@/site.config";
import { bookCallUrl, whatsappUrl, publishedIndustries } from "@/lib/config";
import { Button, TextLink } from "@/components/Button";
import { Section } from "@/components/Section";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata = {
  title: "Genartml — Software and AI systems for business",
  description:
    "We build the software and AI systems your business runs on. Fixed price. Fixed timeline. Built in Ahmedabad for clients across India and abroad.",
};

const homeFaq = [
  {
    q: "How much does it cost?",
    a: "Every project has a fixed scope, clear delivery milestones, and a guaranteed fixed investment agreed in writing before work begins. No hourly billing, unexpected retainer overages, or hidden charges.",
  },
  {
    q: "How long does it take?",
    a: "The delivery date is written into your proposal in working days. Small projects take 7 to 10 working days. Larger software takes 60 days or more.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Code, designs and content pass to you on final payment.",
  },
  {
    q: "What happens after launch?",
    a: "Every package includes free support for 30 to 90 days. After that a Care Plan keeps everything running.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is used only for your project and is never used to train AI models without your written consent. We can sign a non-disclosure agreement on request.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. International clients are invoiced in US dollars with no Indian GST.",
  },
];

export default function HomePage() {
  const { company, copy, services, products, clientLogos } = siteConfig;
  const industries = publishedIndustries();
  const waUrl = whatsappUrl();

  // Proof strip values: show only non-empty
  const proofItems: string[] = [company.legalName, `Established ${company.foundedYear}`, "Ahmedabad, Gujarat"];
  if (company.registrationNumber) proofItems.push(`CIN ${company.registrationNumber}`);
  if (company.gstNumber) proofItems.push(`GST ${company.gstNumber}`);
  if (company.udyamNumber) proofItems.push(`Udyam ${company.udyamNumber}`);
  if (company.metaPartner) proofItems.push("Meta business partner");
  if (company.startupRecognition) proofItems.push(company.startupRecognition);

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            AI systems · Software · Ahmedabad
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            {copy.heroHeadline}
          </h1>
          <p className="max-w-2xl text-body text-ink-70">
            {copy.heroSub}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
              {copy.primaryButton}
            </Button>
            <Button href="/pricing/" variant="secondary" on="white">
              {copy.secondaryButton}
            </Button>
            {waUrl && (
              <TextLink href={waUrl} on="white" event="cta_whatsapp">
                Chat on WhatsApp
              </TextLink>
            )}
          </div>
        </div>
      </Section>

      {/* 2. PROOF STRIP (Black) */}
      <div className="tone-black border-y border-paper/10 py-5">
        <div className="container-grid">
          <div className="flex flex-wrap items-center justify-between gap-3 text-small text-paper/70">
            {proofItems.map((item, idx) => (
              <span
                key={idx}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-paper backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SERVICES (White) */}
      <Section tone="white" id="services">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              01 · Services
            </span>
            <h2 className="text-h2 font-light tracking-tight">
              Five core offerings. Built to run your operations.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-ink hover:shadow-2xl"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                      S/0{idx + 1}
                    </span>
                    <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500">
                      Fixed timeline
                    </span>
                  </div>
                  <h3 className="text-h3 font-medium tracking-tight text-ink group-hover:text-black">
                    {s.name}
                  </h3>
                  <p className="text-small text-ink-70 leading-relaxed">
                    {s.slug === "ai-workflows" && "Connect every tool and process you run, eliminating manual steps."}
                    {s.slug === "voice-ai-agents" && "Natural conversational voice agents for support and bookings."}
                    {s.slug === "websites" && "High-performance websites built for clarity, speed and conversion."}
                    {s.slug === "software-development" && "Custom platforms and dashboards built for your exact operational model."}
                    {s.slug === "care-plans" && "Monthly engineering maintenance, updates, monitoring and support."}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-small font-medium text-ink">
                    View deliverables & scope
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-small transition-all duration-300 group-hover:bg-ink group-hover:text-paper group-hover:border-ink group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. OUR PROMISE (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              02 · Promise
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Our four client promises.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">01</span>
              <h3 className="text-body font-medium text-paper">Fixed scope written before we start.</h3>
              <p className="text-small text-paper/70">No hourly billing. No scope creep surprise invoices.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">02</span>
              <h3 className="text-body font-medium text-paper">Fixed delivery date in working days.</h3>
              <p className="text-small text-paper/70">Clear milestones with test links shared weekly every Friday.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">03</span>
              <h3 className="text-body font-medium text-paper">You own the code, designs and content.</h3>
              <p className="text-small text-paper/70">Full intellectual property passes to you on final payment.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">04</span>
              <h3 className="text-body font-medium text-paper">Founder review before anything goes live.</h3>
              <p className="text-small text-paper/70">Daksh personally inspects and signs off on every production deploy.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. OUR OWN PRODUCTS (White) */}
      <Section tone="white">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              03 · Products
            </span>
            <h2 className="text-h2 font-light tracking-tight">
              We build and run our own products.
            </h2>
            <p className="max-w-2xl text-body text-ink-70">
              Alongside client projects, we design, build and operate our own proprietary software products.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Evoluter */}
            <div className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ink hover:shadow-xl">
              <div className="flex flex-col gap-4">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">
                  P/01 · Edtech
                </span>
                <h3 className="text-h3 font-medium">Evoluter</h3>
                <p className="text-body text-ink-70">
                  AI-powered preparation platform for UPSC and civil services aspirants.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-100">
                <Button href={products.evoluterUrl} variant="secondary" on="white" external>
                  Visit Evoluter →
                </Button>
              </div>
            </div>

            {/* Extuter */}
            <div className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-paper p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ink hover:shadow-xl">
              <div className="flex flex-col gap-4">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 w-fit">
                  P/02 · Edtech
                </span>
                <h3 className="text-h3 font-medium">Extuter</h3>
                <p className="text-body text-ink-70">
                  AI learning companion for JEE and NEET aspirants.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-100">
                <Button href={products.extuterUrl} variant="secondary" on="white" external>
                  Visit Extuter →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. HOW WE WORK (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              04 · Process
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Simple process. Five steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">STEP 01</span>
              <h3 className="text-body font-medium text-paper">Free call</h3>
              <p className="text-small text-paper/70">A 20-minute discussion to understand your problem and confirm fit.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">STEP 02</span>
              <h3 className="text-body font-medium text-paper">Written proposal</h3>
              <p className="text-small text-paper/70">Fixed scope and delivery timeline in working days sent within 48 hours.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">STEP 03</span>
              <h3 className="text-body font-medium text-paper">Approve & deposit</h3>
              <p className="text-small text-paper/70">50% upfront to kick off architecture and interface design.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">STEP 04</span>
              <h3 className="text-body font-medium text-paper">Weekly test links</h3>
              <p className="text-small text-paper/70">Every Friday you receive a live link to test what we built that week.</p>
            </div>
            <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1">
              <span className="text-xs font-mono text-paper/60 uppercase">STEP 05</span>
              <h3 className="text-body font-medium text-paper">Launch & support</h3>
              <p className="text-small text-paper/70">Final payment, IP handover, plus 30 to 90 days of free included support.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. INDUSTRIES (White, rendered if confirmed) */}
      {industries.length > 0 && (
        <Section tone="white">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
                05 · Industries
              </span>
              <h2 className="text-h2 font-light tracking-tight">
                Specialized industry solutions.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}/`}
                  className="group flex items-center justify-between rounded-2xl border border-neutral-200/90 p-6 shadow-sm transition-all duration-200 hover:border-ink hover:bg-neutral-50 hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-body font-medium text-ink">{ind.name}</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* 8. CLIENT LOGOS & TESTIMONIALS (rendered only if approved entries exist) */}
      {clientLogos.filter((l) => l.approved).length > 0 && (
        <Section tone="white">
          <div className="flex flex-col gap-8">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              Clients
            </span>
            <div className="flex flex-wrap items-center gap-12">
              {clientLogos
                .filter((l) => l.approved)
                .map((l, idx) => (
                  <span key={idx} className="font-medium text-ink">{l.name}</span>
                ))}
            </div>
          </div>
        </Section>
      )}

      {/* 9. QUESTIONS (White) */}
      <Section tone="white" id="faq">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              06 · Questions
            </span>
            <h2 className="text-h2 font-light tracking-tight">
              Common questions. Honest answers.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {homeFaq.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all duration-200 hover:border-ink/40"
              >
                <h3 className="text-body font-medium text-ink">
                  {item.q}
                </h3>
                <p className="text-small text-ink-70">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 10. CLOSING CALL TO ACTION (Black) */}
      <ClosingCTA tone="black" />
    </>
  );
}
