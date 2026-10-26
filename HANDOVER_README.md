# Genartml Website — Team Handover Guide

Welcome to the **Genartml Website** codebase! Here is a quick guide on how to test, preview, and manage the site.

---

## 1. Quick Start (Run Locally)

You can run the site with any standard local HTTP server (recommended for smooth routing and font loading).

### Option A: Using Python (Simplest, no install needed)
Run in terminal from the root folder:
```bash
python3 -m http.server 8000
```
Then open: **[http://localhost:8000](http://localhost:8000)**

### Option B: Using Node.js / npx
```bash
npx serve . -p 8000
```

### Option C: Direct File Open
You can also directly double-click `index.html` to open it in Chrome, Safari, or Brave.

---

## 2. Key Pages to Test & Review

| Page | URL | Purpose |
|------|-----|---------|
| **Home** | `/` | Hero, services, products, process, contact form |
| **Blog Listing** | `/blog/` | Fetches & displays all articles live from Supabase at the top |
| **Services** | `/services/` | AI Workflows, Voice AI Agents, Websites, Software, Care Plans |
| **Packages** | `/packages/` | Scope, matrix, pricing, and festive offer banner |
| **Careers** | `/careers/` | Dynamic job postings from Supabase |
| **Admin Panel** | `/admin/` | Content management dashboard (password-protected) |

---

## 3. Blog & Content Management

The website is backed by **Supabase PostgreSQL** for real-time content and analytics.

### Accessing the Admin Panel
1. Open **`/admin/`** (or `admin/index.html`) in your browser.
2. Enter the admin password:
   ```
   GenArtML_Admin_2026!
   ```
3. From the dashboard you can:
   - **Articles**: Create, edit, publish/draft, or delete blog posts with rich formatting & cover photos.
   - **Overview**: View total pageviews, unique visitors, published articles, and subscriber counts.
   - **Subscribers**: View and export newsletter subscriber lists to CSV.
   - **Inbox**: Review inbound contact submissions.
   - **Careers**: Add or edit job openings.

### How New Blog Posts Work
- When you publish a post from `/admin/`, it saves to Supabase and **instantly appears on `/blog/`**.
- Clicking any new post dynamically loads the content with full typography, cover image, and table of contents.
- **For SEO & Static HTML Generation**:
  To sync new Supabase articles into pre-rendered static HTML files:
  ```bash
  python3 scripts/sync_supabase_blogs.py
  python3 Frontend/src/build.py
  ```

---

## 4. Project Structure

```
Genartml-website/
├── index.html          # Main homepage
├── blog/               # Blog archive and pre-rendered article pages
│   ├── index.html      # Blog listing (dynamic Supabase sync + static fallback)
│   └── post.html       # Dynamic post viewer template
├── admin/              # Blog & dashboard admin panel
│   └── index.html      # Admin dashboard interface
├── services/           # Service detail landing pages
├── packages/           # Pricing matrix & scopes
├── careers/            # Job board & application flow
├── assets/
│   ├── css/site.css    # Main design tokens and responsive stylesheet
│   └── js/site.js      # Core interactions, currency toggle, dynamic blogs
├── js/admin.js         # Admin panel CRUD operations and Supabase client
└── scripts/            # Helper automation (sitemap & blog syncing)
```

---

## 5. Deployment

- **Repository**: `https://github.com/DakshApple/Genartml-website.git`
- **Main branch**: `main`
- Deploys automatically on git push to hosting CDN.
