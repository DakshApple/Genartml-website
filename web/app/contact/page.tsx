import { siteConfig } from "@/site.config";
import { whatsappUrl } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";

export const metadata = buildMetadata({
  title: "Contact Genartml — Book a call or send an enquiry",
  description:
    "Tell us about your project. Direct founder review, fixed price proposals, and straightforward communication.",
  path: "/contact/",
});

export default function ContactPage() {
  const { contact, social } = siteConfig;
  const waUrl = whatsappUrl();
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url));

  return (
    <Section tone="white" className="pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        {/* Left column: narrative & contact details */}
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div className="flex flex-col gap-4">
            <span className="rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase w-fit">
              Contact
            </span>
            <h1 className="text-display font-light tracking-tight text-ink">
              Tell us what you need.
            </h1>
            <p className="text-body text-ink-70 leading-relaxed">
              We reply with a clear, written proposal and guaranteed delivery timeline within 48 hours. If we cannot solve your problem, we tell you straight away.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-t border-ink/10 pt-8 text-small">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-ink-70">Email</span>
              <a href={`mailto:${contact.email}`} className="text-body font-medium text-ink underline">
                {contact.email}
              </a>
            </div>

            {contact.phone && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-ink-70">Phone</span>
                <a href={`tel:${contact.phone}`} className="text-body font-medium text-ink underline">
                  {contact.phone}
                </a>
              </div>
            )}

            {waUrl && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-ink-70">WhatsApp</span>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-body font-medium text-ink underline">
                  Chat directly on WhatsApp →
                </a>
              </div>
            )}

            {contact.address && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-ink-70">Office address</span>
                <span className="text-body text-ink">{contact.address}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <span className="font-medium text-ink-70">City</span>
              <span className="text-body text-ink">{contact.city}</span>
            </div>

            {contact.officeHours && (
              <div className="flex flex-col gap-1">
                <span className="font-medium text-ink-70">Office hours</span>
                <span className="text-body text-ink">{contact.officeHours}</span>
              </div>
            )}

            {socialEntries.length > 0 && (
              <div className="flex flex-col gap-2 pt-4">
                <span className="font-medium text-ink-70">Social profiles</span>
                <div className="flex flex-wrap gap-4">
                  {socialEntries.map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small font-medium text-ink underline capitalize"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: form */}
        <div className="rounded-3xl border border-neutral-200/90 bg-neutral-50/40 p-8 md:p-12 shadow-sm lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
