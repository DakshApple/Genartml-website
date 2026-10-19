import { bookCallUrl, whatsappUrl } from "@/lib/config";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { siteConfig } from "@/site.config";

export function ClosingCTA({ tone = "black" }: { tone?: "black" | "white" }) {
  const waUrl = whatsappUrl();

  return (
    <Section tone={tone} className="text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h2 className="text-h1 font-light tracking-tight">
          {siteConfig.copy.closingHeadline}
        </h2>
        <p className="text-body text-paper/70">
          {siteConfig.copy.closingSub}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          <Button
            href={bookCallUrl()}
            variant="primary"
            on={tone}
            event="cta_book_call"
          >
            {siteConfig.copy.primaryButton}
          </Button>
          {waUrl ? (
            <Button
              href={waUrl}
              variant="secondary"
              on={tone}
              event="cta_whatsapp"
              external
            >
              Chat on WhatsApp
            </Button>
          ) : (
            <Button
              href="/contact/"
              variant="secondary"
              on={tone}
            >
              Contact our team
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
