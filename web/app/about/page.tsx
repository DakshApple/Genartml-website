import Image from "next/image";
import { siteConfig } from "@/site.config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { ClosingCTA } from "@/components/ClosingCTA";

export const metadata = buildMetadata({
  title: "About Genartml — Engineering software and AI systems in Ahmedabad",
  description:
    "Founded in 2024. Genartml builds custom software, AI workflows, and proprietary products for businesses across India and abroad.",
  path: "/about/",
});

export default function AboutPage() {
  const { company, contact, products, team } = siteConfig;

  return (
    <>
      {/* 1. HERO (White) */}
      <Section tone="white" className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="flex max-w-4xl flex-col items-start gap-8">
          <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase">
            About · Genartml Private Limited
          </span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Software and AI systems engineered to run businesses.
          </h1>
          <p className="max-w-2xl text-body text-ink-70 leading-relaxed">
            Founded in Ahmedabad in 2024, Genartml is an engineering and AI systems studio. We partner with founders and business operators across India and abroad to automate manual operations, build proprietary software, and deliver tangible operational leverage.
          </p>
        </div>
      </Section>

      {/* 2. THE STORY & PHILOSOPHY (Black) */}
      <Section tone="black">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              Our Story
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Built on plain words and accountable engineering.
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-body text-paper/70 leading-relaxed">
            <p>
              Most technology agencies sell hours and technical jargon. When projects run late or over budget, the client bears the cost.
            </p>
            <p>
              We founded Genartml with an opposite model: fixed scope, fixed timeline in working days, and full ownership of code and designs passed to the client upon delivery. Every project is personally reviewed by our founder Daksh Suthar before going live.
            </p>
            <p>
              We do not use buzzwords or sell theoretical AI capabilities. If an existing software tool or a simple database solves your bottleneck, we recommend that first. When custom AI workflows or software applications are required, we build them with clean, maintainable architecture.
            </p>
          </div>
        </div>
      </Section>

      {/* 3. TEAM GRID (White, rendered if supplied) */}
      {team.length > 0 && (
        <Section tone="white">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
                Team
              </span>
              <h2 className="text-h2 font-light tracking-tight">Leadership & Engineering</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-3xl border border-neutral-200/90 bg-paper p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-ink"
                >
                  <div className="relative aspect-square w-full grayscale overflow-hidden rounded-2xl">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-6 flex flex-col gap-1">
                    <h3 className="text-body font-medium text-ink">{member.name}</h3>
                    <span className="text-small text-ink-70">{member.role}</span>
                    <p className="mt-2 text-small text-ink-70">{member.oneLine}</p>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 text-small text-ink underline"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* 4. COMPANY DETAILS BLOCK (White) */}
      <Section tone="white">
        <div className="flex flex-col gap-8 rounded-3xl border border-neutral-200/90 bg-neutral-50/50 p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="rounded-full bg-neutral-200/70 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              Official Details
            </span>
            <h2 className="text-h2 font-light tracking-tight">Company registration and legal identity</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-small">
            <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
              <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Legal Entity Name</span>
              <span className="text-body text-ink font-medium">{company.legalName}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
              <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Year of Establishment</span>
              <span className="text-body text-ink">{company.foundedYear}</span>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
              <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Registered City & State</span>
              <span className="text-body text-ink">{contact.city}</span>
            </div>
            {company.registrationNumber && (
              <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
                <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Registration Number (CIN)</span>
                <span className="text-body text-ink">{company.registrationNumber}</span>
              </div>
            )}
            {company.gstNumber && (
              <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
                <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">GST Identification</span>
                <span className="text-body text-ink">{company.gstNumber}</span>
              </div>
            )}
            {company.udyamNumber && (
              <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
                <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Udyam Registration</span>
                <span className="text-body text-ink">{company.udyamNumber}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200/70 bg-paper p-5">
              <span className="font-medium text-ink-70 text-xs uppercase tracking-wider">Official Contact Email</span>
              <a href={`mailto:${contact.email}`} className="text-body text-ink underline">
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 5. OUR OWN PRODUCTS (Black) */}
      <Section tone="black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wider text-white uppercase w-fit">
              Products
            </span>
            <h2 className="text-h2 font-light tracking-tight text-paper">
              Our proprietary platforms.
            </h2>
            <p className="max-w-2xl text-body text-paper/70">
              In addition to building software for clients, we design and operate our own software products in education.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="flex flex-col gap-4">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper/80 w-fit">
                  P/01 · Edtech
                </span>
                <h3 className="text-h3 font-medium text-paper">Evoluter</h3>
                <p className="text-body text-paper/70">
                  AI-powered preparation platform for UPSC and civil services aspirants across India.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <Button href={products.evoluterUrl} variant="secondary" on="black" external>
                  Visit Evoluter →
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="flex flex-col gap-4">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper/80 w-fit">
                  P/02 · Edtech
                </span>
                <h3 className="text-h3 font-medium text-paper">Extuter</h3>
                <p className="text-body text-paper/70">
                  AI learning companion for JEE and NEET competitive exam aspirants.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <Button href={products.extuterUrl} variant="secondary" on="black" external>
                  Visit Extuter →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <ClosingCTA tone="white" />
    </>
  );
}
