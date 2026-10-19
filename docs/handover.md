# Genartml Website — Technical Handover Guide (Phase 6)

## 1. Architecture Overview

The Genartml website is built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**, configured as a fully static export (`output: "export"` in `web/next.config.ts`).

- **Project Root**: `web/`
- **Output Directory**: `web/out/` (plain HTML, CSS, JS, and static assets)
- **Design Tokens**: `web/app/globals.css` (Strict Black `#0A0A0A` and White `#FFFFFF` only, Poppins font self-hosted).

---

## 2. Central Configuration: `web/site.config.ts`

All business variables and company information are centralized in **[`web/site.config.ts`](file:///Users/dakshsuthar/Library/Mobile%20Documents/com~apple~CloudDocs/Genartml-website-main/web/site.config.ts)**:

- **Company Identity**: Legal name, CIN, GST number, Udyam number, founding year.
- **Contact Details**: Official email, phone, WhatsApp number, street address, office hours, calendar booking URL.
- **Social Profiles**: LinkedIn, X, Instagram, YouTube, Facebook, GitHub.
- **Products**: Evoluter & Extuter live URLs and status.
- **Team**: Leadership profiles and black & white photos.
- **Client Logos & Case Studies**: Approved client proofs.
- **Industries**: Feature flags to publish confirmed industry solutions.
- **Pricing Switch**: Toggle `showPrices: true` or `false`.

> **Hard Rule**: If a field in `site.config.ts` is left empty (`""` or `[]`), its corresponding element is automatically hidden on the website. Never invent placeholder details.

---

## 3. How to Make Common Changes

### A. How to Change Package Prices
1. Open `web/site.config.ts`.
2. Locate the `services` array.
3. Update `priceInr` and `priceUsd` for the desired package.
4. Run `npm run build` inside `web/` to regenerate all static pages.

### B. How to Add a Case Study
1. Open `web/site.config.ts`.
2. Add an entry to the `caseStudies` array:
   ```ts
   {
     slug: "client-project-name",
     client: "Acme Corp",
     industry: "Real estate",
     problem: "What operational bottleneck existed...",
     built: "What custom software or AI workflows were delivered...",
     result: "Measured tangible business outcome...",
     quote: "Client testimonial...",
     approved: true // Must be true to render
   }
   ```
3. Rebuild with `npm run build`.

### C. How to Add or Edit Blog Posts
- The blog fetches posts from Supabase or reads directly from `web/content/blogs.json`.
- To update local build content:
  - Add your post to `web/content/blogs.json`, or
  - Publish via Supabase and re-run the sync script, then run `npm run build`.

### D. How to Confirm an Industry Page
1. Open `web/site.config.ts`.
2. Find the `industries` object.
3. Flip the sector to `true` (e.g. `"clinics-healthcare": true`).
4. Rebuild with `npm run build`. The route `/industries/clinics-healthcare/` will automatically generate and appear in dropdown menus.

---

## 4. How to Build & Deploy

### Local Development
```bash
cd web
npm run dev
# Opens on http://localhost:3000
```

### Production Build (Static Export)
```bash
cd web
npm run build
```
This generates production files in `web/out/`.

### Deployment Instructions
- **Netlify**: Set base directory to `web/`, build command to `npm run build`, and publish directory to `web/out/`.
- **Vercel**: Set framework to Next.js or Other with output directory `web/out/`.
- **Cloudflare Pages / Apache / Nginx**: Point document root directly to `web/out/`.

---

## 5. Security & Key Rotation

1. **Admin Credentials**: The previous plaintext admin password (`js/admin.js`) on the legacy site has been deprecated. Never commit passwords or service role secrets to the frontend.
2. **GitHub Personal Access Token**: If you previously pasted a GitHub token in chat, revoke it immediately at [github.com/settings/tokens](https://github.com/settings/tokens).
3. **Web3Forms Key**: Stored in `web/components/ContactForm.tsx`. You can rotate this key anytime on web3forms.com.
4. **Google Analytics**: GA4 ID is in `web/site.config.ts` (`analytics.ga4Id`) and only activates after visitors click "Accept" on the cookie banner.

---

## 6. Items Waiting on Daksh (Checklist)

| Item | Status | Action Needed |
|---|---|---|
| CIN Registration Number | Hidden | Add to `site.config.ts` (`company.registrationNumber`) when available |
| GST Identification Number | Hidden | Add to `site.config.ts` (`company.gstNumber`) |
| WhatsApp Phone Number | Hidden | Add international format digits to `site.config.ts` (`contact.whatsappNumber`) to activate the floating WhatsApp button |
| Full Street Address | Hidden | Add to `site.config.ts` (`contact.address`) for footer & local search schema |
| Price List PDF | Missing | Place `Genartml-price-list-2026-27.pdf` into `web/public/pricing/` |
| Client Logos & Quotes | Hidden | Add approved entries to `site.config.ts` (`clientLogos` / `caseStudies`) |
| Unconfirmed Industries | Hidden | Confirm remaining sectors in `site.config.ts` (`industries`) |
