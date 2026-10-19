import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";

export const metadata = buildMetadata({
  title: "Privacy Policy — Genartml Private Limited",
  description: "Official Privacy Policy explaining how Genartml collects, processes, and protects client data.",
  path: "/legal/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  return (
    <Section tone="white" className="pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Legal</span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="text-small text-ink-70">
            Last updated: October 19, 2026 · <em>Subject to final legal counsel review</em>
          </p>
        </div>

        <div className="flex flex-col gap-8 text-body text-ink leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">1. Overview</h2>
            <p>
              Genartml Private Limited ("Genartml", "we", "our", or "us") operates genartml.com and provides software development and AI workflow services. This Privacy Policy outlines our transparent policies regarding the collection, use, and protection of information when you visit our website or engage our engineering services.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">2. Client Data & AI Protections</h2>
            <p>
              We treat client intellectual property and internal operational data with strict confidentiality:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-small">
              <li>
                <strong>No AI Model Training:</strong> Any proprietary documents, code, customer records or operational data provided to us during an engagement are used exclusively to deliver your contracted system. Your data is <strong>never</strong> used to train, fine-tune or improve third-party AI models without explicit, written prior consent.
              </li>
              <li>
                <strong>Enterprise API Boundaries:</strong> In our AI workflows, we interface only with zero-data-retention or commercial enterprise API tiers where providers explicitly disclaim training rights over customer payload transmissions.
              </li>
              <li>
                <strong>Data Minimization:</strong> We only process data elements strictly necessary to execute the automated workflows and software interfaces we build for you.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">3. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-small">
              <li>
                <strong>Enquiry Details:</strong> When you submit our contact or pricing request forms, we collect your name, work email address, telephone/WhatsApp number, company name, and project description.
              </li>
              <li>
                <strong>Aggregated Website Analytics:</strong> We use Google Analytics 4 (GA4) only after you click "Accept" on our cookie consent banner. This gathers anonymized metrics such as browser type, pages viewed, and referral sources to help us improve site navigation.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">4. Third-Party Infrastructure</h2>
            <p className="text-small">
              To deliver high-availability software, we work with established infrastructure providers including Cloudflare, Vercel, Supabase, and Web3Forms. Each processor adheres to rigorous security and encryption standards.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">5. Your Rights & Data Deletion</h2>
            <p className="text-small">
              You retain full rights to request a copy of the personal data we hold about you, request corrections, or instruct us to permanently delete your contact records and historical staging data. Contact us at <a href="mailto:team@genartml.com" className="underline">team@genartml.com</a> to exercise these rights.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">6. Contact Information</h2>
            <p className="text-small">
              For any questions regarding this Privacy Policy, please contact our team at:
              <br />
              <strong>Genartml Private Limited</strong>
              <br />
              Email: team@genartml.com
              <br />
              Location: Ahmedabad, Gujarat, India
            </p>
          </section>
        </div>
      </div>
    </Section>
  );
}
