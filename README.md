# Genartml — Official Website

> AI Automation and Software Development — Ahmedabad, India  
> [genartml.com](https://genartml.com)

---

## Tech Stack

| Layer          | Technology                                                    |
|----------------|---------------------------------------------------------------|
| **Markup**     | Semantic HTML5 (`<main>`, `<article>`, `<nav>`, `<aside>`)    |
| **Styling**    | Vanilla CSS with custom properties (design tokens)            |
| **JavaScript** | Vanilla ES5+ (IIFE pattern, no build step required)           |
| **Blog CMS**   | Supabase (PostgreSQL) — `blogs` table via REST API            |
| **Forms**      | Web3Forms API                                                 |
| **Fonts**      | Google Fonts — Inter, Fraunces, JetBrains Mono                |
| **Hosting**    | Static (Vercel / Netlify / any CDN)                           |

---

## Project Structure

```
genartml-prod/
├── index.html          # Homepage — hero, services, products, process, about, contact
├── blog.html           # Blog listing — fetches published posts from Supabase
├── blog-post.html      # Individual post — fetches by ?slug= URL param
├── admin.html          # ⚠️ LOCAL ONLY — blog admin dashboard (password-protected)
│
├── css/
│   └── styles.css      # Single stylesheet — design tokens, components, responsive, a11y
│
├── js/
│   ├── main.js         # Shared logic — nav, reveals, marquee, forms, filters
│   ├── blog-client.js  # Supabase fetch + render for blog.html and blog-post.html
│   └── admin.js        # ⚠️ LOCAL ONLY — admin CRUD operations
│
├── assets/             # Static images — logos, favicons, blog covers
│
├── robots.txt          # Search engine directives (blocks /admin.html)
├── sitemap.xml         # XML sitemap for SEO
├── _headers            # Security & cache headers (Netlify format)
└── README.md           # This file
```

---

## Getting Started

### View Locally
Simply open `index.html` in any modern browser. No build step, no Node.js, no dependencies.

### Admin Panel
1. Open `admin.html` in your browser.
2. Enter the admin password.
3. Create, edit, and publish blog posts.

> **⚠️ Security:** Do NOT deploy `admin.html` or `js/admin.js` to your public hosting. These files contain API credentials and should be used locally only.

### Deploying
Upload the following files to your hosting provider:
- `index.html`, `blog.html`, `blog-post.html`
- `css/`, `js/main.js`, `js/blog-client.js`
- `assets/`
- `robots.txt`, `sitemap.xml`, `_headers`

**Do NOT upload:** `admin.html`, `js/admin.js`

---

## Design System

### Colors (Design Tokens)
| Token            | Value      | Usage                    |
|------------------|------------|--------------------------|
| `--paper`        | `#FAFAF7`  | Page background          |
| `--paper-2`      | `#F2F0EA`  | Card/section background  |
| `--ink`          | `#0A0A0A`  | Primary text             |
| `--muted`        | `#6B6B66`  | Secondary text           |
| `--line`         | `#E4E1D8`  | Borders                  |
| `--dark`         | `#0A0A0A`  | Dark sections (CTA, footer) |

### Typography
| Font             | Role                 | Weight(s)       |
|------------------|----------------------|-----------------|
| Inter            | Body, UI             | 300–600         |
| Fraunces         | Italic accents       | 400 (italic)    |
| JetBrains Mono   | Labels, code, mono   | 400–500         |

### Breakpoints
| Width    | Target           |
|----------|------------------|
| 900px    | Tablet landscape |
| 780px    | Tablet portrait  |
| 640px    | Large phone      |
| 480px    | Phone            |
| 380px    | Small phone      |

---

## SEO & Performance

- ✅ Font preloading (`rel="preload"`) to prevent FOUT
- ✅ `decoding="async"` on all non-critical images
- ✅ `loading="lazy"` on below-the-fold images
- ✅ Canonical URLs on every page
- ✅ Open Graph + Twitter Card meta on every page
- ✅ `robots.txt` with admin exclusion
- ✅ `sitemap.xml` with page priorities
- ✅ `_headers` file for security headers (CSP, HSTS, X-Frame-Options)
- ✅ `<meta name="robots" content="noindex, nofollow">` on admin page

## Accessibility

- ✅ Skip-to-content link on every page
- ✅ Semantic HTML (`<main>`, `<article>`, `<nav>`, `<aside>`, `<header>`, `<footer>`)
- ✅ `aria-label` on all interactive elements
- ✅ `aria-hidden` on decorative elements
- ✅ `role` attributes where needed
- ✅ `focus-visible` keyboard navigation styles
- ✅ `prefers-reduced-motion` support
- ✅ Color contrast passing WCAG AA

---

## Supabase Configuration

### Database Schema
```sql
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  read_time TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE
);

-- Required for the admin panel to work with the Anon key:
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
```

---

## License

© Genartml Private Limited 2026. All rights reserved.
