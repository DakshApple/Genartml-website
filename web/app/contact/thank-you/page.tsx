import { bookCallUrl, whatsappUrl } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";

export const metadata = buildMetadata({
  title: "Thank you — We have received your message",
  description: "Thank you for contacting Genartml. A person from our team will reply within 24 hours.",
  path: "/contact/thank-you/",
  noindex: true,
});

export default function ThankYouPage() {
  const waUrl = whatsappUrl();

  return (
    <Section tone="white" className="pt-24 pb-32 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
          Message Received
        </span>
        <h1 className="text-h1 font-light tracking-tight text-ink">
          Thank you. We have your message.
        </h1>
        <p className="text-body text-ink-70">
          A person from our engineering team will review your project details and reply within 24 hours.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button href={bookCallUrl()} variant="primary" on="white" event="cta_book_call">
            Book a call now →
          </Button>
          {waUrl && (
            <Button href={waUrl} variant="secondary" on="white" event="cta_whatsapp" external>
              Chat on WhatsApp
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
