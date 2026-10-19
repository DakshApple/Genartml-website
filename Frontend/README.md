# Genartml website

Static site: plain HTML, CSS and JavaScript. No framework, no build step needed to deploy.

## Folders
- `dist/` is the website. Upload this folder as it is to any static host (Netlify, Cloudflare Pages, Vercel, Hostinger, cPanel). It must be served from the root of genartml.com because links start with `/`.
- `src/` is the source. `python3 src/build.py` rebuilds `dist/` and `preview.html` (needs Python 3 and Pillow). Page text is in `src/data.py` (services, prices, FAQs) and `src/blog.py` (articles). Layout and pages are in `src/build.py`. Styles: `src/static/assets/css/site.css`. Behaviour: `src/static/assets/js/site.js`.
- `preview.html` is the single-file clickable preview.

## Filling in company details (no rebuild needed)
Edit `dist/assets/js/config.js` (and `src/static/assets/js/config.js` so the next build keeps it). Every field left empty stays hidden on the site:

| Field | Shows on |
| --- | --- |
| `officeAddress` | Footer, contact page, about page |
| `officeHours` | Footer and contact page |
| `whatsapp` (10 digits) | Floating button, top bar, hero, contact, CTAs |
| `phone` | Contact page and footer |
| `calendarUrl` | Every "Book a free call" button (otherwise they open /contact/) |
| `cin`, `gst` | Home proof strip, about page, footer |
| `team` | About page team grid |
| `caseStudies` | Work page and home page |
| `social` | Footer icons |
| `formEndpoint` | Where the contact form posts |
| `ga4Id` | Google Analytics, loaded only after cookie consent |

## Contact form
- With `formEndpoint` empty, Send message opens the visitor's email app addressed to team@genartml.com with everything filled in, then shows /contact/thank-you/.
- To receive submissions directly, create a form at Formspree, Getform or Web3Forms (or your own API), paste its URL into `formEndpoint`. The form POSTs JSON with fields: name, email, phone, company, service, service_label, package, brief, consent. On success it redirects to /contact/thank-you/.
- Spam: hidden honeypot field. Add your provider's spam filter or captcha if volume grows.

## Included
- 20 pages: home, services index, 5 service pages, pricing, work, about, contact, thank-you, blog, 3 articles, real estate industry page, privacy, terms, 404.
- SEO: unique title and description per page, canonical links, Open Graph image, sitemap.xml, robots.txt, structured data (ProfessionalService, Service with offer catalogue, FAQPage, BreadcrumbList, Article).
- Self-hosted Poppins (300, 400, 500, 700) including the rupee sign.
- `_headers` with security and caching headers (Netlify and Cloudflare Pages read it).
- Price list PDF at /assets/docs/Genartml-price-list-2026-27.pdf.

## Before going live
- Have a lawyer review /privacy/ and /terms/.
- Confirm the legal name, Extuter's live status, and the Evoluter and Extuter descriptions.
- Add a 1200x630 social image if you want something other than the default at /assets/img/og-default.png.
