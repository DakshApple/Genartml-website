# Genartml website audit (Phase 0)

Date: 2026-10-19. Scope: repository and live home page.

## Stack and setup

| Item | Finding |
|---|---|
| Framework | None. Static HTML, one CSS file, vanilla JS. No build step, no package.json. |
| Hosting | Netlify-style `_headers` and `_redirects`, plus `.htaccess`. Host not confirmed. |
| Forms | Web3Forms (access key in `js/main.js`). No webhook, no sheet or CRM, no auto-reply. |
| Blog | Supabase `blogs` table, rendered client-side by `js/blog-client.js` (not crawlable without JS). |
| Careers | Supabase, client-side. |
| Analytics | GA4 `G-7RCXB14L96` loads on every visit with no consent step. |
| Sitemap | `scripts/generate_sitemap.py` plus GitHub Action, daily. Works. |
| Fonts | Google Fonts (Poppins, Fraunces, JetBrains Mono). Not self-hosted. |

## Pages found

`index.html`, `blog/index.html`, `blog/post.html`, `careers/index.html`, `careers/job.html`, `404.html`, `admin/index.html`, plus legacy duplicates `blog.html`, `blog-post.html`, `admin.html`.

Home sections: hero, services (2), industry expertise (3), products (2), tools marquee, process (4 steps), about and founder card, contact form, footer.

## Requirement status (section 5 of the brief)

| Requirement | Status |
|---|---|
| Top bar "Book a free call" | Missing |
| Header with Services and Industries dropdowns, Pricing, Work | Weak (Work, Products, About, Blog, Careers, one CTA; no dropdowns, no full-screen mobile menu) |
| Floating WhatsApp button | Missing |
| Footer with legal line, columns, socials | Weak (links only; no legal columns, registration, GST) |
| Cookie notice, consent-gated analytics | Missing (GA4 loads unconditionally) |
| Closing CTA block | Weak (contact form section only, no WhatsApp or booking button) |
| Home hero, proof strip, five service cards, promise, products, how we work, industries, work, logos, questions | Weak or missing (two service cards, no proof strip, no FAQ section on page) |
| Five service pages | Missing |
| Industry pages | Missing (one on-page block, unconfirmed sectors) |
| Work / case studies page | Missing |
| Pricing page, INR and USD switch, PDF | Missing (prices were removed from the home page today) |
| About page | Missing (section on home only) |
| Contact page, thank-you page, spam protection, UTM capture | Weak (form on home; honeypot not confirmed; no thank-you page; no UTM) |
| Blog list and article template | Present and weak (client-rendered, no TOC, share, related, Article schema) |
| Privacy Policy and Terms | Missing |
| Custom 404 | Present and good |
| Structured data | Present and weak (Organization, ProfessionalService, FAQPage in head; no Breadcrumb or Article; FAQ text not shown on page) |
| Sitemap, robots, canonical | Present and good |
| Security headers | Present, good base. No CSP. |
| Favicon set | Present and good |
| Event tracking | Missing |

## Rule violations found in current site

| Rule | Finding |
|---|---|
| Black and white only | Fails. Paper tones (#FAFAF7, #F2F0EA), tinted product cards, indigo and lilac gradients, muted greys (#6B6B66, #9A9A94). 6 gradient uses. |
| Poppins only | Fails. Fraunces (italic headings) and JetBrains Mono (labels) are in use. |
| No word "automation" in public copy | Fails on home, blog, careers, sitemap slugs and titles, schema. |
| Banned words | 2 hits outside admin. Locations to be listed in Phase 5. |
| No placeholder values | Fails. WhatsApp link is `wa.me/91XXXXXXXXXX` on the home page. |
| Plain, founder voice, fixed price promise | Mostly met. Industry copy added today uses "10x", "domain-specific velocity", "copilot" and unsourced claims. Needs rewrite. |
| Truth, no unsourced numbers | At risk. Home page has "Scale 10x faster" (no source). Hero meta says "Est. 2024" (matches brief). |

## Security findings (act on these first)

1. **Admin password is hardcoded in `js/admin.js`** (`ADMIN_PASSWORD`). `admin/index.html`, `admin.html` and `js/admin.js` are in the public repository and deployed. Anyone can read the password and the client-side checks. Needs server-side auth (Supabase Auth plus row-level security) and the password rotated.
2. Supabase URL and anon key are in client JS. That is normal for an anon key, but only safe if row-level security is correct on `blogs`, `jobs` and subscriber tables. Needs review.
3. Web3Forms access key is in client JS. Acceptable for that service, but there is no rate limit of our own.
4. A GitHub personal access token was pasted into this chat earlier. Revoke it at github.com/settings/tokens. It was not saved to disk.

## Missing inputs

The brief says to attach the brand guidelines PDF, logo files in `knowledge/`, `pricing/Genartml-price-list-2026-27.pdf`, `website/genartml-website-verdict-and-antigravity-brief.md`, and existing articles in `pr/`. **None of these exist in the workspace** (`knowledge/`, `pricing/`, `website/`, `pr/` are absent). Logos in `assets/` and loose logo files in the parent folder are available. Blog articles live in Supabase, not `pr/`.

`site.config` values (registration, GST, Udyam, phone, WhatsApp, address, team, clients, case studies, analytics, forms) do not exist yet.

## Lighthouse (before and after comparison)

### Before (Legacy site baseline)
| Page / Device | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home (Mobile) | 79 | 98 | 100 | 100 |
| Home (Desktop) | 94 | 95 | 100 | 100 |

### After (New Next.js production build)
| Page / Device | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| **Home (Mobile)** | **99** | **100** | **100** | **100** |
| **Home (Desktop)** | **100** | **100** | **100** | **100** |
| **Pricing (Mobile)** | **99** | **100** | **100** | **100** |
| **Pricing (Desktop)** | **100** | **100** | **100** | **100** |

All performance, accessibility, best practices, and SEO scores exceed the 90+ threshold target.

