import Link from "next/link";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <Section tone="white" className="pt-24 pb-32 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <span className="text-small font-medium tracking-wider text-ink-70 uppercase">
          404 · Page Not Found
        </span>
        <h1 className="text-display font-light tracking-tight text-ink">
          The page you are looking for does not exist.
        </h1>
        <p className="text-body text-ink-70">
          The URL may have moved or been updated. Choose from our main sections below:
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button href="/" variant="primary" on="white">
            Return to home
          </Button>
          <Button href="/pricing/" variant="secondary" on="white">
            View packages & pricing
          </Button>
          <Button href="/contact/" variant="secondary" on="white">
            Contact team
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-ink/10 pt-8 text-small font-medium">
          <Link href="/services/ai-workflows/" className="underline hover:text-ink-70">
            AI Workflows
          </Link>
          <Link href="/services/voice-ai-agents/" className="underline hover:text-ink-70">
            Voice AI Agents
          </Link>
          <Link href="/services/websites/" className="underline hover:text-ink-70">
            Websites
          </Link>
          <Link href="/services/software-development/" className="underline hover:text-ink-70">
            Software Development
          </Link>
          <Link href="/services/care-plans/" className="underline hover:text-ink-70">
            Care Plans
          </Link>
          <Link href="/blog/" className="underline hover:text-ink-70">
            Blog
          </Link>
        </div>
      </div>
    </Section>
  );
}
