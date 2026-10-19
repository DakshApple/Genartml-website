# Genartml website plan (Phase 1)

Date: 2026-10-19. Based on `docs/audit.md`.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript, Tailwind CSS, static export | The current site has no framework or build step. Your brief says rebuild in this case. |
| Where it lives | New app in `web/`. The current site stays untouched and live until cutover. | Nothing that works gets deleted. |
| Cutover | Point the host's publish directory at `web/out` once Phase 5 passes. | One switch, easy to undo. |
| Hosting | Not confirmed. Plan assumes Netlify or Vercel. Static export works on both. | Existing `_headers` and `_redirects` are Netlify format. |
| Blog data | Keep Supabase as the content source. Fetch at build time so articles are crawlable. Rebuild on a schedule and on publish. | Existing articles are in Supabase, not `pr/`. |
| Forms | One server endpoint (serverless function) with validation, honeypot, rate limit and bot check. Sends email, posts to webhook, sends auto-reply. | Replaces client-side Web3Forms. |
| Analytics | GA4 `G-7RCXB14L96`, loaded only after cookie Accept. | Current site loads it with no consent. |
| Admin | Moved off the public site. Auth server-side (Supabase Auth plus row-level security). Password rotated. | Hardcoded password in `js/admin.js` is public. |
| Extuter | Treated as live (`extuterLive: true`). | You confirmed the launch earlier. |

## Open items that block or shape work

1. Hosting provider (affects redirects, headers, form function).
2. Missing files from the brief: brand PDF, `knowledge/` logos, price list PDF, `pr/` articles. Logos in `assets/` are used until supplied. The price list PDF cannot be served until supplied.
3. Values in `web/site.config.ts` left empty: registration, GST, Udyam, phone, WhatsApp, address, team, clients, case studies, socials, calendar URL, map, office hours.
4. Which industries are confirmed. All are `false`, so no industry page is published until you flip them.

## Page list (build order)

1. Home
2. Services: AI Workflows, Voice AI Agents, Websites, Software Development, Care Plans
3. Pricing
4. Contact, plus thank-you page
5. About
6. Work (Evoluter, Extuter, approved case studies)
7. Blog: list, article, category pages, RSS
8. Industries (six templates, published only when confirmed)
9. Legal: Privacy Policy, Terms of Service (marked for legal review)
10. 404

Careers: not in the brief's page list. The careers page and job pages stay only if you are hiring. Otherwise removed and no link anywhere. Decision needed.

## Component list

**Global:** TopBar, Header (dropdowns, mobile full-screen menu), Footer, WhatsAppButton, CookieNotice, ClosingCTA.

**UI:** Button, Container and 12-column Grid, Section (black and white alternate), Card, Rule, FormField, Input, Select, Textarea, Accordion (questions), CurrencySwitch.

**Content blocks:** Hero, ProofStrip, ServiceCards, PromiseList, ProductsBlock, HowWeWork, IndustryTiles, WorkGrid, LogoWall, Testimonials, FAQ, PackageCards, PricingTable.

**Blog:** PostCard, ArticleLayout, TableOfContents, ShareButtons, RelatedPosts.

**System:** Seo, JsonLd (Organization, ProfessionalService, LocalBusiness, FAQPage, BreadcrumbList, Article), Analytics wrapper, UTM capture, Reveal (reduced-motion safe).

Each component reads from `site.config.ts` or `content/`. Empty value hides the element.

## Content structure

```
web/
  site.config.ts          every value Daksh supplies, hero text, prices
  content/
    services/*.md
    industries/*.md
    faq.md
    legal/*.md
  app/                    routes
  components/
  lib/                    config reader, SEO, analytics, form validation
  public/fonts/           Poppins 300, 400, 500, 700 (self-hosted)
  public/assets/          logos, product screens
```

## Order of work

1. **Phase 2:** scaffold `web/`, tokens, Poppins, layout components, cookie notice, SEO and analytics wrappers.
2. **Phase 3:** pages in the order above.
3. **Phase 4:** form endpoint, lead capture (contact, price list, newsletter) into one webhook with `source`, event tracking, UTM capture, structured data, sitemap, redirects, RSS.
4. **Phase 5:** Lighthouse above 90 on mobile, accessibility, security headers with CSP, cross-browser, mobile widths 360, 768, 1024, 1440, content check against the hard rules.
5. **Phase 6:** `docs/handover.md`, final audit, waiting-on-Daksh list.

## Redirects

Old URLs keep working:

| Old | New |
|---|---|
| `/blog.html`, `/blog/index.html` | `/blog/` |
| `/blog/post.html?slug=X`, `/blog-post.html?slug=X` | `/blog/X/` |
| `/careers/*` | Kept or removed per decision above |
| `/admin.html`, `/admin/*` | Removed from public site |
| `http://*` | `https://` (already present) |

Existing slugs: copy the list from `sitemap.xml` when building the blog.

## Copy rules to apply during rebuild

- Rewrite all copy to the voice rules. Remove "automation" (say "AI workflows" or "AI systems"), remove banned words, remove the "10x" and "velocity" claims added earlier.
- Blog slugs that contain "automation" keep their URL (breaking them hurts search). Titles and body are reviewed in Phase 5.
- No number goes live without a source.

## Risks

- Blog articles may contain "automation" in the body. Phase 5 flags each one for your decision. I won't silently rewrite your published posts.
- Pricing page depends on the price list PDF. Until supplied, the download button is hidden.
- Cutover needs the hosting answer.
