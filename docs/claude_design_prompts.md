# Genartml — Master Claude Design & UI Prompt System

> **Design Directives:**
> 1. **Palette:** Strict Black (`#0A0A0A`) & Pure White (`#FFFFFF`). Secondary text at 70% opacity (`rgba(10,10,10,0.7)` on white, `rgba(255,255,255,0.7)` on black).
> 2. **Typography:** Poppins only (font-weight: 300 Light, 400 Regular, 500 Medium, 600 SemiBold).
> 3. **Curvature:** Pill radius (`rounded-full`) for all buttons, badges, filter pills, and search bars. `rounded-3xl` (24px–32px) for cards, dialogs, and feature blocks. `rounded-2xl` (16px) for form inputs.
> 4. **No Numeric Prices:** Zero currency symbols (`₹`, `$`) or rates. Replace with **Scope Tiers**, **Turnkey Milestones in Working Days**, and **Guaranteed Written Deliverables**.
> 5. **Dynamics & Micro-Animations:** Fluid ease-out springs, subtle -4px hover lifts with 24px soft drop shadows, sliding arrow micro-interactions (`group-hover:translate-x-1.5`), and active tactile scales (`active:scale-[0.98]`).

---

## Global System Prompt (Base Context for Claude Design)

```markdown
Role: Senior Staff Product Designer & Design Technologist.
Brand: Genartml Private Limited (Ahmedabad, India).
Style: Premium, hyper-minimalist black-and-white SaaS/Studio aesthetic (Linear / Vercel / Apple inspired).
Colors: Strictly #0A0A0A (Ink) and #FFFFFF (Paper). Borders in rgba(10,10,10,0.08) or rgba(255,255,255,0.12).
Typography: Poppins exclusively. Clean typographic contrast (ultra-light large display headlines paired with crisp medium small labels).
Corners: Pill rounded-full for all buttons and chips; rounded-3xl (24px) for all content cards and panels; rounded-2xl (16px) for inputs.
Interactivity: Smooth micro-interactions, subtle hover elevations (-4px translateY), group arrow shifts (→ transforms right 4px on hover), and tactile active presses (scale 0.98).
Pricing Rule: NEVER show monetary prices. All offerings are presented by Scope, Features, Working Day Timelines, and Written Deliverables.
```

---

## 1. Global Navigation & Header Prompt

### Claude Design Prompt:
```markdown
Create a sticky, ultra-premium navigation header for Genartml.
- Background: Pure white with 90% opacity and subtle backdrop-blur (12px).
- Border: 1px bottom border rgba(10,10,10,0.08).
- Left: Genartml wordmark with the 8-node interconnected AI logo (26px height).
- Center Navigation:
  * "Services" (Dropdown with pill badge indicator)
  * "Industries" (Dropdown)
  * "Work" (Link)
  * "Pricing & Scope" (Link)
  * "About" (Link)
  * "Blog" (Link)
  * "Contact" (Link)
- Right: Primary CTA button.

BUTTONS & INTERACTIVE ELEMENTS:
1. "Services" Dropdown Trigger:
   - Style: Ghost link, 14px Poppins Medium, accompanied by a subtle downward chevron.
   - Hover: Text shifts to black, chevron smoothly rotates 180 degrees.
   - Dropdown Menu: rounded-2xl floating card with 1px border, 16px padding, subtle shadow-2xl. Contains 5 service items (AI Workflows, Voice AI Agents, Websites, Software Development, Care Plans) with rounded-xl hover background states.
2. "Industries" Dropdown Trigger:
   - Style: Ghost link with chevron. Opens rounded-2xl container listing "Real estate" and industry accelerators.
3. "Book a free call" Primary CTA:
   - Style: rounded-full pill, solid #0A0A0A background, crisp white text, 14px Poppins Medium, 44px height, px-7.
   - Dynamics: On hover, elevates translateY(-2px) with soft 16px black drop shadow. On click, scales to 0.98.
4. Mobile Hamburger (Viewport < 1024px):
   - Style: 44x44px rounded-full border border-neutral-300 flex items-center justify-center. Smoothly transforms into an '✕' on tap, expanding a full-height rounded-b-3xl drawer.
```

---

## 2. Home Page (`/`) Prompt

### Claude Design Prompt:
```markdown
Design the homepage for Genartml.com showcasing production-grade AI systems and custom software engineering.

SECTIONS:
1. Hero Section (White background):
   - Category Chip: rounded-full pill (border border-neutral-200, bg-neutral-100, px-4, py-1.5, 12px uppercase): "AI SYSTEMS · SOFTWARE · AHMEDABAD".
   - Headline: Display 64px Poppins Light: "We build the software and AI systems your business runs on."
   - Subtitle: 18px text at 70% opacity: "Fixed price. Fixed timeline. Built in Ahmedabad for clients across India and abroad."
   - Button Group:
     * Button 1 (Primary): "Book a free call" -> rounded-full, solid black, white text, 48px height, px-8.
     * Button 2 (Secondary): "See what we build" -> rounded-full, white background, 1px border border-neutral-300, black text.
     * Button 3 (Text link): "Chat on WhatsApp →" -> Underlined link with smooth animated arrow.

2. Proof Strip (Black background):
   - 100% full width black bar with rounded-full pill badges floating horizontally:
     * "Genartml Private Limited"
     * "Established 2024"
     * "Ahmedabad, Gujarat"
     * "CIN Registered"
     * "Founder-Reviewed Delivery"

3. Core Services Grid (White background):
   - Headline: "01 · Services — Five core offerings. Built to run your operations."
   - Grid: 3-column layout of rounded-3xl cards (bg: #FFFFFF, border: 1px solid #E5E5E5, padding: 32px).
   - Card Content:
     * Top row: S/01 pill badge on left, "Fixed timeline" pill on right.
     * Service title: 22px Poppins Medium (e.g. "AI Workflows", "Voice AI Agents", "Websites").
     * Descriptive copy: 14px text at 70% opacity.
     * Card Bottom CTA: "View deliverables & scope" paired with a rounded-full 36px circular arrow button (shifts right on card hover).
     * Dynamics: Entire card lifts -6px on hover with a rich 24px ambient drop-shadow.

4. Client Promises (Black background):
   - 4-column cards with rounded-2xl borders (bg: rgba(255,255,255,0.04), border: 1px rgba(255,255,255,0.12)):
     * 01: "Fixed scope written before we start."
     * 02: "Fixed delivery date in working days."
     * 03: "You own the code, designs and content."
     * 04: "Founder review before anything goes live."

5. Proprietary Products (White background):
   - 2 large rounded-3xl spotlight cards for Evoluter and Extuter.
   - Pill badge: "P/01 · Edtech", "Live in production".
   - Button: "Visit Evoluter →" (Secondary pill button).

6. Five-Step Process (Black background):
   - 5 horizontal sequential rounded-2xl cards (Free Call -> Written Proposal -> Approve & Deposit -> Weekly Test Links -> Launch & Support).

7. FAQ Accordion (White background):
   - 6 rounded-2xl FAQ blocks. No prices mentioned. Explicit focus on guaranteed written milestones and IP handover.

8. Closing CTA (Black background):
   - Centered headline: "Tell us what you need. Fixed scope. Fixed timeline."
   - Button 1: "Book a free call" (White pill button, black text).
   - Button 2: "Contact our team" (Ghost pill button, white outline).
```

---

## 3. Services Pages (`/services/[slug]/`) Prompt

### Claude Design Prompt:
```markdown
Design the service detail template for Genartml (e.g., AI Workflows, Voice AI Agents, Custom Websites, Software Development, Care Plans).

SECTIONS:
1. Breadcrumb & Hero:
   - Breadcrumb Pill: "← All services" in a rounded-full chip.
   - Headline: 56px Poppins Light describing the operational outcome.
   - Button 1: "Book a free call" (Primary black pill).
   - Button 2: "Chat on WhatsApp" or "Contact our team" (Secondary outline pill).

2. Transparent Packages & Scope Tiers (Black background):
   - Section Badge: "Scope Tiers" (white pill).
   - 3-column package cards (Starter, Growth, Enterprise):
     * Container: rounded-3xl, bg: rgba(255,255,255,0.05), border: 1px rgba(255,255,255,0.12), p-8.
     * Header: Tier title + Delivery pill badge (e.g. "10 working days", "20 working days").
     * Scope Guarantee Box: rounded-2xl inner container with "Fixed scope & timeline. Written agreement before kickoff with zero surprise invoices."
     * Support Indicator: Bullet showing "30 to 90 days included engineering support".
     * Deliverables List: Clean Poppins text with checkmarks (✓).
     * Card CTA Button: "Select [Tier] →" -> rounded-full white pill button with black text, hover translateY(-2px).

3. "What We Build — Plain Words" (White background):
   - 4 rounded-3xl cards with numbered badges (01, 02, 03, 04) explaining concrete use cases in simple English without jargon.

4. "How It Works" 5-Step Process (Black background):
   - Step cards with rounded-2xl borders and monospace step indicators.

5. "What It Costs to Run" Transparency Box:
   - A rounded-3xl container with neutral-50 background detailing third-party APIs and carrier minutes billed directly at transparent provider cost with zero agency markup.

6. Service FAQs:
   - Interactive rounded-2xl cards answering domain-specific concerns.
```

---

## 4. Investment & Scope (Pricing) Page (`/pricing/`) Prompt

### Claude Design Prompt:
```markdown
Design the official Investment & Scope Guide page for Genartml.com.
GOAL: High-trust transparent commercial guide WITHOUT showing arbitrary dollar/rupee figures. Focus on fixed-scope certainty.

SECTIONS:
1. Header & Hero:
   - Pill Badge: "Transparent Scope & Delivery".
   - Headline: "Fixed scope. Written before we start."
   - Subhead: "Every package has a clear deliverable scope, delivery timeline in working days, and included post-launch engineering support. No hourly rates. No hidden retainers."
   - Buttons:
     * "Book a free call" (Primary pill)
     * "Request a custom proposal →" (Secondary outline pill)

2. Interactive Offering Tabs:
   - Floating horizontal pill bar with active tab states:
     * [All offerings] (Active: solid black pill, white text)
     * [AI Workflows]
     * [Voice AI Agents]
     * [Websites]
     * [Software Development]
     * [Care Plans]
   - Right side indicator: "Fixed scope · Guaranteed delivery in working days".

3. Scope Matrix Grid:
   - 3 rounded-3xl cards per service category.
   - Header: Tier name (e.g. Starter Tier) + Delivery Days pill.
   - Inner card: Highlighted rounded-2xl box: "SCOPE MODEL: Fixed scope & timeline".
   - Deliverables checklist: Concrete features included.
   - Button: "Request [Tier] proposal →" (Pill button with animated right arrow).

4. Custom Architecture Consultation Card:
   - Full-width dark rounded-3xl luxury container with ambient glow.
   - Headline: "Need a custom architecture or enterprise workflow?"
   - Copy: "Tell us about your operations, tool stack, and ideal launch timeline. We will review your requirements and provide a fixed-scope technical proposal within 48 hours."
   - Buttons:
     * "Book a 20-minute discovery call" (White pill)
     * "Send us your project brief →" (Transparent outline pill)

5. Project Standards (Black background):
   - 4 rounded-2xl cards: "Full IP ownership", "Weekly demo links", "Direct founder review", "Included post-launch support".

6. Commercial Terms:
   - 3 rounded-3xl cards: Payment terms (50/50 milestone), Taxation (GST & USD), Provider costs (direct at cost).
```

---

## 5. Work & Products Page (`/work/`) Prompt

### Claude Design Prompt:
```markdown
Design the Work & Products portfolio page for Genartml.
Tone: Engineering-driven studio portfolio. Proof over claims.

SECTIONS:
1. Hero:
   - Chip: "Portfolio & Products"
   - Headline: "Software and AI systems in production."
   - Subhead: "We build and operate our own proprietary software products, while designing custom platforms and AI workflows for select clients."

2. Proprietary Products Showcase (Black background):
   - 2 large rounded-3xl cards (Evoluter & Extuter):
     * Header: "P/01 · Edtech" pill on left, "● Live in production" green pulse pill on right.
     * Title: 32px Poppins Medium.
     * Structured Specs (4 rows):
       - "What it is"
       - "Who uses it"
       - "What we built"
     * Button: "Visit Evoluter →" / "Visit Extuter →" (Primary white pill button).

3. Client Results (White background):
   - 2-column rounded-3xl case study cards with:
     * Client name & Industry pill.
     * "The Problem" section.
     * "What We Built" section.
     * "Measured Result" highlighted in a rounded-2xl callout container.
```

---

## 6. About Page (`/about/`) Prompt

### Claude Design Prompt:
```markdown
Design the About page for Genartml Private Limited.
GOAL: Establish ten-second corporate legitimacy, legal clarity, and founder-led accountability.

SECTIONS:
1. Hero:
   - Badge: "About · Genartml Private Limited"
   - Headline: "Software and AI systems engineered to run businesses."
   - Subhead: "Founded in Ahmedabad in 2024, Genartml is an engineering and AI systems studio..."

2. Story & Engineering Philosophy (Black background):
   - 2-column editorial split.
   - Left: "Built on plain words and accountable engineering."
   - Right: 3 paragraphs highlighting fixed-scope certainty, rejection of buzzwords, and direct founder code reviews by Daksh Suthar.

3. Official Legal Identity Container:
   - A rounded-3xl card with 6 rounded-2xl metadata blocks:
     * Legal Entity Name: Genartml Private Limited
     * Year of Establishment: 2024
     * Registered City & State: Ahmedabad, Gujarat, India
     * Corporate Identity Number (CIN block)
     * GST Identification block
     * Official Contact Email: team@genartml.com
```

---

## 7. Contact & Consultation Page (`/contact/`) Prompt

### Claude Design Prompt:
```markdown
Design the Contact & Project Discovery page for Genartml.

LAYOUT: 12-column grid.
Left Column (5 cols):
- Badge: "Contact"
- Headline: "Tell us what you need."
- Subtitle: "We reply with a clear, written proposal and guaranteed delivery timeline within 48 hours."
- Direct Channels: Email, Phone, WhatsApp link ("Chat directly on WhatsApp →"), Physical Address (Ahmedabad, Gujarat), and Office Hours.

Right Column (7 cols) — Interactive Consultation Card:
- Container: rounded-3xl card with soft neutral border and subtle shadow.
- Form Inputs:
  * Name input: rounded-2xl, 48px height, 1px border border-neutral-300, focus:ring-4 focus:ring-neutral-200.
  * Work email input: rounded-2xl.
  * Phone/WhatsApp input: rounded-2xl.
  * Company name input: rounded-2xl.
  * Service selector dropdown: rounded-2xl.
  * Message textarea: rounded-2xl, 5 rows.
  * Privacy consent checkbox: rounded-md with link to Privacy Policy.
  * Submit Button:
    - Text: "Send message →"
    - Style: rounded-full pill button, solid black, white text, 48px height, px-8, group hover arrow transition.
```

---

## 8. Blog Listing & Article Pages (`/blog/` & `/blog/[slug]/`) Prompt

### Claude Design Prompt:
```markdown
Design the Blog listing and article view for Genartml.
Tone: Deep-dive technical engineering essays, practical deployment breakdowns, no marketing fluff.

LISTING PAGE:
- 3-column article cards with rounded-3xl curvature.
- Aspect-video image with rounded-2xl top corners and subtle 1.05x hover zoom.
- Category chip (e.g. "Engineering", "Case Breakdown") + Date.
- Title with hover underline.
- 3-line excerpt.
- Bottom footer with read time and "Read article →" arrow pill.

ARTICLE VIEW:
- Header: "← Back to all posts" rounded-full chip.
- Title: 44px Poppins Light.
- Meta bar: Category chip, Published date, Author ("Team Genartml"), Read time.
- Share Pills: rounded-full chips for LinkedIn, X (Twitter), and "Copy link".
- Featured Image: rounded-3xl border with priority load.
- Typography: Prose layout with custom Poppins styles, bold lead paragraph, pull quotes with black left border.
- Bottom: Related articles in rounded-3xl cards + Closing CTA block.
```

---

## 9. Button & Micro-Interaction Component Specification

| Button Type | Border Radius | Padding & Height | Color Palette | Hover Dynamics | Click / Active |
|---|---|---|---|---|---|
| **Primary Pill** | `rounded-full` (9999px) | `px-7 py-3` (min 44px) | `#0A0A0A` background, `#FFFFFF` text | `translateY(-2px)`, shadow-xl, hover:bg-neutral-900 | `scale-[0.98]`, `translateY(0)` |
| **Secondary Pill** | `rounded-full` (9999px) | `px-7 py-3` (min 44px) | `#FFFFFF` bg, 1px border `#E5E5E5`, text `#0A0A0A` | `translateY(-2px)`, border-black, bg-neutral-50 | `scale-[0.98]` |
| **Dark Primary Pill** | `rounded-full` (9999px) | `px-7 py-3` (min 44px) | `#FFFFFF` bg, text `#0A0A0A` | `translateY(-2px)`, shadow-xl, bg-neutral-100 | `scale-[0.98]` |
| **Dark Secondary Pill**| `rounded-full` (9999px) | `px-7 py-3` (min 44px) | Transparent bg, 1px border `rgba(255,255,255,0.25)`, text `#FFFFFF` | `translateY(-2px)`, border-white, bg-white/10 | `scale-[0.98]` |
| **Arrow Circle Button** | `rounded-full` (36x36px) | Flex center | 1px border `#E5E5E5`, text `#0A0A0A` | Background `#0A0A0A`, text `#FFFFFF`, arrow shifts `translateX(3px)` | `scale-90` |
| **Floating WhatsApp** | `rounded-full` (56x56px) | Flex center | Border `#404040`, bg `#0A0A0A`, text `#FFFFFF` | `scale-110`, shadow-2xl, shadow-black/50 | `scale-95` |
| **Filter Tab Pill** | `rounded-full` | `px-5 py-2` | Inactive: border `#E5E5E5`, text `#0A0A0A`. Active: solid `#0A0A0A`, text `#FFFFFF` | Inactive: border-neutral-400, bg-neutral-50 | Instant tab transition |
