import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/site.config";

export function Footer() {
  const { company, contact, social, services, products } = siteConfig;
  const year = new Date().getFullYear();

  // Legal numbers line: show only what is filled
  const legalParts = [company.legalName];
  if (company.registrationNumber) legalParts.push(`CIN ${company.registrationNumber}`);
  if (company.gstNumber) legalParts.push(`GST ${company.gstNumber}`);
  if (company.udyamNumber) legalParts.push(`Udyam ${company.udyamNumber}`);
  const legalLine = legalParts.join(". ") + ".";

  // Social links that are filled
  const socialEntries = Object.entries(social).filter(([, url]) => Boolean(url));

  return (
    <footer className="tone-black border-t border-paper/20 pt-16 pb-12" role="contentinfo">
      <div className="container-grid flex flex-col gap-12">
        {/* Top block */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand lockup & one line */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo tone="dark" height={26} />
            <p className="max-w-sm text-small text-paper/70">
              We build the software and AI systems your business runs on. Fixed price. Fixed timeline.
            </p>
            {socialEntries.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                {socialEntries.map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small font-medium text-paper underline capitalize hover:text-paper/70"
                  >
                    {network}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-medium tracking-wider text-paper/70 uppercase">Services</span>
            <ul className="flex flex-col gap-2 text-small">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}/`} className="hover:text-paper/70">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-medium tracking-wider text-paper/70 uppercase">Company</span>
            <ul className="flex flex-col gap-2 text-small">
              <li>
                <Link href="/about/" className="hover:text-paper/70">
                  About
                </Link>
              </li>
              <li>
                <Link href="/work/" className="hover:text-paper/70">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/pricing/" className="hover:text-paper/70">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-paper/70">
                  Blog
                </Link>
              </li>
              {products.evoluterUrl && (
                <li>
                  <a href={products.evoluterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper/70">
                    Evoluter ↗
                  </a>
                </li>
              )}
              {products.extuterUrl && (
                <li>
                  <a href={products.extuterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper/70">
                    Extuter ↗
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Legal & Contact Column */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-medium tracking-wider text-paper/70 uppercase">Legal & Contact</span>
            <ul className="flex flex-col gap-2 text-small">
              <li>
                <Link href="/legal/privacy-policy/" className="hover:text-paper/70">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms-of-service/" className="hover:text-paper/70">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-paper/70">
                  Contact
                </Link>
              </li>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-paper/70">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.googleBusinessProfileUrl && (
                <li>
                  <a
                    href={contact.googleBusinessProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-paper/70"
                  >
                    Google Business Profile ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom rules & copyright line */}
        <div className="border-t border-paper/10 pt-6 flex flex-col justify-between gap-3 text-small text-paper/70 sm:flex-row">
          <div>{legalLine}</div>
          <div className="flex gap-4">
            <span>© {year} {company.legalName}.</span>
            <span>Built in Ahmedabad.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
