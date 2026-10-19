import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";

export const metadata = buildMetadata({
  title: "Terms of Service — Genartml Private Limited",
  description: "Official Terms of Service governing client engagements with Genartml Private Limited.",
  path: "/legal/terms-of-service/",
});

export default function TermsOfServicePage() {
  return (
    <Section tone="white" className="pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-small font-medium tracking-wider text-ink-70 uppercase">Legal</span>
          <h1 className="text-display font-light tracking-tight text-ink">
            Terms of Service
          </h1>
          <p className="text-small text-ink-70">
            Last updated: October 19, 2026 · <em>Subject to final legal counsel review</em>
          </p>
        </div>

        <div className="flex flex-col gap-8 text-body text-ink leading-relaxed">
          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">1. Engagement & Services</h2>
            <p>
              These Terms of Service govern all technical development, consulting, and maintenance engagements provided by Genartml Private Limited ("Genartml") to our clients. Every engagement is formally detailed in a written Statement of Work or Proposal specifying deliverables, timelines, and fixed investments.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">2. Fixed Price & Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2 text-small">
              <li>
                <strong>Milestones:</strong> Unless otherwise specified in writing, custom builds require a 50% non-refundable deposit to commence architecture and development, with the remaining 50% balance payable upon final acceptance prior to production DNS cutover and repository handover.
              </li>
              <li>
                <strong>Taxes:</strong> Indian clients are invoiced in Indian Rupees (INR) plus applicable Goods and Services Tax (GST at 18%). International clients are invoiced in US Dollars (USD) as zero-rated export of services.
              </li>
              <li>
                <strong>Third-Party Costs:</strong> Software licenses, telephony minutes, cloud hosting, and third-party API usage (e.g. OpenAI, WhatsApp API, Supabase, Twilio) are paid directly by the client to the providers at cost.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">3. Intellectual Property & Ownership</h2>
            <p>
              Upon receipt of final project payment in full, all proprietary source code, database schemas, custom frontend interfaces, and bespoke workflow logic specifically created for your project transfer entirely to you. Genartml retains no ongoing licensing claims or proprietary lock-in over your deliverables.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">4. Confidentiality & Non-Disclosure</h2>
            <p>
              Both parties agree to protect and maintain the strict confidentiality of all proprietary business data, trade secrets, software architecture, and customer records disclosed during the engagement. We will execute a standalone bilateral Non-Disclosure Agreement (NDA) upon request.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">5. Warranty & Post-Launch Support</h2>
            <p>
              Each project package includes between 30 and 90 calendar days of free post-launch support covering bug fixes, defect remediation, and system stabilization directly related to contracted deliverables. Post-launch maintenance beyond this window is available via our monthly Care Plans.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">6. Limitation of Liability</h2>
            <p>
              In no event shall Genartml be liable for any indirect, incidental, special, or consequential damages resulting from third-party API outages, telecommunication network downtime, or loss of profits. Our total aggregate liability under any engagement shall not exceed the total fees actually received by Genartml for the specific project giving rise to the claim.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-medium">7. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and any dispute arising under them shall be governed by and construed in accordance with the laws of the Republic of India. The courts located in Ahmedabad, Gujarat, India shall have exclusive jurisdiction over all legal proceedings.
            </p>
          </section>
        </div>
      </div>
    </Section>
  );
}
