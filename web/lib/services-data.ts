export interface ServicePackage {
  name: string;
  priceInr: number;
  priceUsd: number;
  from?: boolean;
  deliveryDays: string;
  supportDays: number;
  includes: string[];
}

export interface ServiceDetail {
  slug: string;
  name: string;
  headline: string;
  sub: string;
  monthly?: boolean;
  minuteRateNote?: string;
  packages: ServicePackage[];
  whatWeBuild: { title: string; desc: string }[];
  howItWorks: { step: string; title: string; desc: string }[];
  runningCosts: string;
  faq: { q: string; a: string }[];
}

export const SERVICES_DETAIL: Record<string, ServiceDetail> = {
  "ai-workflows": {
    slug: "ai-workflows",
    name: "AI Workflows",
    headline: "AI workflows that handle your repetitive business tasks.",
    sub: "We connect your CRM, messaging tools, databases and spreadsheets so your team stops copying and pasting data between systems.",
    packages: [
      {
        name: "Starter",
        priceInr: 35000,
        priceUsd: 1200,
        deliveryDays: "7 working days",
        supportDays: 30,
        includes: [
          "One multi-step workflow across up to 3 tools",
          "Error handling and notification alerts",
          "Written documentation and handover video",
          "30 days of included post-launch support",
        ],
      },
      {
        name: "Growth",
        priceInr: 125000,
        priceUsd: 4500,
        deliveryDays: "20 working days",
        supportDays: 60,
        includes: [
          "Up to 4 interconnected workflows across your stack",
          "AI prompt engineering and data formatting logic",
          "CRM and WhatsApp business integration",
          "60 days of included post-launch support",
        ],
      },
      {
        name: "Enterprise",
        priceInr: 350000,
        priceUsd: 12000,
        from: true,
        deliveryDays: "35 to 45 working days",
        supportDays: 90,
        includes: [
          "Full departmental workflow architecture",
          "Custom API connectors and webhook handling",
          "High concurrency testing and security review",
          "90 days of dedicated included support",
        ],
      },
    ],
    whatWeBuild: [
      {
        title: "Lead capture and qualification",
        desc: "Captures enquiries from WhatsApp, forms and portals, formats the data, and updates your CRM within seconds.",
      },
      {
        title: "Document and invoice processing",
        desc: "Extracts key data from PDF invoices, contracts and purchase orders, then logs line items into your accounting software.",
      },
      {
        title: "Customer communication flows",
        desc: "Sends order confirmations, dispatch notices and appointment reminders across WhatsApp and email automatically.",
      },
      {
        title: "Daily and weekly operations reports",
        desc: "Pulls metrics from multiple sources every morning and posts a neat summary into your team Slack or WhatsApp group.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Audit", desc: "We map your current manual process step by step to identify bottlenecks." },
      { step: "02", title: "Architecture", desc: "We design the workflow logic, data formats and error-handling steps." },
      { step: "03", title: "Build", desc: "We configure the connectors, write custom scripts and test edge cases." },
      { step: "04", title: "Handover", desc: "We provide full documentation and walk your team through live operations." },
      { step: "05", title: "Support", desc: "Free monitoring and bug fixes for the full included support period." },
    ],
    runningCosts:
      "Provider running costs (such as Make, n8n, Zapier or OpenAI API usage) are paid directly to the providers at cost in your own accounts. You never pay a markup on software licenses.",
    faq: [
      {
        q: "Which tools can you connect?",
        a: "We work with any tool that has an API or webhook support, including WhatsApp Business API, HubSpot, Zoho, Salesforce, Google Workspace, Airtable, Notion and custom databases.",
      },
      {
        q: "What happens if a third-party tool changes its API?",
        a: "During your included support period, we fix breaking changes for free. After that, our Care Plans cover continuous maintenance.",
      },
      {
        q: "Do you take a markup on tool subscriptions?",
        a: "No. All tool subscriptions and API usage fees are paid directly to the providers from your own accounts.",
      },
      {
        q: "Can you sign an NDA before we share our workflows?",
        a: "Yes. We regularly execute non-disclosure agreements with clients before technical discovery.",
      },
    ],
  },

  "voice-ai-agents": {
    slug: "voice-ai-agents",
    name: "Voice AI Agents",
    headline: "Voice AI agents that speak naturally and resolve calls.",
    sub: "Deploy natural-sounding voice assistants that answer inbound questions, book appointments and qualify leads 24 hours a day.",
    minuteRateNote: "Telephony carrier minutes and AI speech models billed transparently at direct provider cost.",
    packages: [
      {
        name: "Starter",
        priceInr: 45000,
        priceUsd: 1500,
        deliveryDays: "10 working days",
        supportDays: 30,
        includes: [
          "One conversational voice agent script and knowledge base",
          "Phone number integration and inbound call routing",
          "Calendar booking or lead capture integration",
          "30 days of included support",
        ],
      },
      {
        name: "Growth",
        priceInr: 110000,
        priceUsd: 4000,
        deliveryDays: "20 working days",
        supportDays: 60,
        includes: [
          "Inbound and outbound calling agent capability",
          "Multi-branch conversation logic and CRM integration",
          "Call recording, transcription and sentiment summary",
          "60 days of included support",
        ],
      },
      {
        name: "Enterprise",
        priceInr: 275000,
        priceUsd: 9500,
        from: true,
        deliveryDays: "35 working days",
        supportDays: 90,
        includes: [
          "Multi-lingual agent capabilities (English, Hindi, regional)",
          "Real-time database lookups during active calls",
          "Custom telecom SIP trunking integration",
          "90 days of dedicated included support",
        ],
      },
    ],
    whatWeBuild: [
      {
        title: "24/7 inbound clinic & consultation booking",
        desc: "Answers incoming calls, answers patient questions, checks doctor availability and locks appointments in your calendar.",
      },
      {
        title: "Real estate lead qualification",
        desc: "Calls inbound property enquiries within two minutes, captures budget and location criteria, and schedules site visits.",
      },
      {
        title: "Service appointment reminders",
        desc: "Calls customers the day before a scheduled service to confirm attendance or offer alternative slots.",
      },
      {
        title: "Customer support triage",
        desc: "Handles common tier-one questions, resolves status inquiries and transfers complex cases to human staff.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Script design", desc: "We structure the dialogue tree, personality, FAQs and guardrails." },
      { step: "02", title: "Voice tuning", desc: "We configure voice models, pronunciation of Indian terms and cadence." },
      { step: "03", title: "Tool integration", desc: "We connect the voice agent to your live CRM, database or calendar." },
      { step: "04", title: "Pilot testing", desc: "We run simulated calls to refine latency and interrupt handling." },
      { step: "05", title: "Launch & support", desc: "We point your telephone lines and monitor real call performance." },
    ],
    runningCosts:
      "Telephony carrier minutes and speech-to-text API charges are billed at cost with no markup. You maintain full ownership of your accounts.",
    faq: [
      {
        q: "How natural does the voice sound?",
        a: "We use low-latency conversational models with human-like turn-taking, realistic pauses and accurate pronunciation of Indian names and terms.",
      },
      {
        q: "What happens when a caller asks something unexpected?",
        a: "The agent gracefully acknowledges limitations and can forward the call to your human team or log a callback request.",
      },
      {
        q: "Can the agent speak Hindi or regional languages?",
        a: "Yes. Our Growth and Enterprise packages support Hindi and regional language capabilities.",
      },
      {
        q: "How are phone numbers handled?",
        a: "We can connect your existing virtual numbers or provision fresh dedicated numbers for your business.",
      },
    ],
  },

  "websites": {
    slug: "websites",
    name: "Websites",
    headline: "Fast, clear websites built for credibility and conversion.",
    sub: "We design and engineer bespoke websites that load in under one second, explain your value plainly, and drive qualified enquiries.",
    packages: [
      {
        name: "Launch",
        priceInr: 40000,
        priceUsd: 1200,
        deliveryDays: "10 working days",
        supportDays: 30,
        includes: [
          "Bespoke single-page or 3-page marketing website",
          "Mobile-first responsive layout and local font hosting",
          "Contact form with instant email alerts and honeypot",
          "30 days of included post-launch support",
        ],
      },
      {
        name: "Business",
        priceInr: 95000,
        priceUsd: 3000,
        deliveryDays: "20 working days",
        supportDays: 60,
        includes: [
          "Up to 8 custom pages with structured data SEO",
          "Interactive package tables, calculators or enquiry forms",
          "Speed optimization targeting 95+ mobile Lighthouse score",
          "60 days of included post-launch support",
        ],
      },
      {
        name: "Commerce or corporate",
        priceInr: 225000,
        priceUsd: 7500,
        from: true,
        deliveryDays: "35 working days",
        supportDays: 90,
        includes: [
          "Full corporate or e-commerce website architecture",
          "Headless CMS integration for easy content management",
          "Payment gateway integration (Razorpay, Stripe)",
          "90 days of dedicated included support",
        ],
      },
    ],
    whatWeBuild: [
      {
        title: "Founder and agency marketing sites",
        desc: "Clean, authoritative websites that make small and mid-sized companies look established to enterprise buyers.",
      },
      {
        title: "Product launch websites",
        desc: "Focused conversion pages for software products, mobile applications and new service lines.",
      },
      {
        title: "Healthcare and clinic portals",
        desc: "Doctor profiles, procedure overviews, patient testimonials and direct appointment scheduling.",
      },
      {
        title: "D2C and specialty product stores",
        desc: "Fast, uncluttered online storefronts with Indian payment gateways and shipping integrations.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Content brief", desc: "We interview you to define your core narrative, packages and proof points." },
      { step: "02", title: "Design system", desc: "We establish typography, spacing and layout before writing code." },
      { step: "03", title: "Development", desc: "We build with clean HTML, CSS and TypeScript for maximum speed." },
      { step: "04", title: "Quality checks", desc: "We verify Lighthouse scores, accessibility, mobile layout and forms." },
      { step: "05", title: "Deploy", desc: "We configure DNS, SSL certificates and security headers for launch." },
    ],
    runningCosts:
      "Website hosting is typically free or low-cost on modern edge platforms like Cloudflare, Netlify or Vercel. Domain renewal is paid directly to your registrar.",
    faq: [
      {
        q: "Do you use templates or WordPress themes?",
        a: "No. Every website we build is written from scratch with clean, purposeful code. This ensures top performance, zero bloat and complete ownership.",
      },
      {
        q: "Will my website load fast on mobile?",
        a: "Yes. We engineer every page to achieve 90+ Lighthouse performance scores on mobile networks.",
      },
      {
        q: "Do I get full ownership of the source code?",
        a: "Yes. All source code, assets and design files pass entirely to you upon final project payment.",
      },
      {
        q: "Can I edit the content myself after launch?",
        a: "Yes. We structure copy in simple content files or connect a headless CMS so your team can make updates without code.",
      },
    ],
  },

  "software-development": {
    slug: "software-development",
    name: "Software Development",
    headline: "Custom software built around how your business actually runs.",
    sub: "We engineer proprietary web applications, internal dashboards and client portals when off-the-shelf software falls short.",
    packages: [
      {
        name: "Prototype",
        priceInr: 250000,
        priceUsd: 7500,
        deliveryDays: "30 working days",
        supportDays: 30,
        includes: [
          "Working software prototype or Minimum Viable Product",
          "Core user authentication and database architecture",
          "Primary workflow implementation and responsive UI",
          "30 days of included post-launch support",
        ],
      },
      {
        name: "Standard",
        priceInr: 600000,
        priceUsd: 18000,
        deliveryDays: "60 working days",
        supportDays: 60,
        includes: [
          "Production-ready business software application",
          "Role-based access control and multi-tenant logic",
          "Third-party API integrations, payment processing and reports",
          "60 days of included post-launch support",
        ],
      },
      {
        name: "Enterprise",
        priceInr: 1500000,
        priceUsd: 45000,
        from: true,
        deliveryDays: "90 to 120 working days",
        supportDays: 90,
        includes: [
          "Complex platform architecture with high scalability",
          "Legacy system integrations and automated data pipelines",
          "Security auditing, automated test suites and staging environment",
          "90 days of dedicated included support",
        ],
      },
    ],
    whatWeBuild: [
      {
        title: "Internal business dashboards",
        desc: "Custom operational software that unifies inventory, job scheduling, billing and staff activity into one screen.",
      },
      {
        title: "Client and partner portals",
        desc: "Secure web portals where clients log in to view project milestones, download files and approve deliverables.",
      },
      {
        title: "Proprietary SaaS products",
        desc: "End-to-end software applications with multi-tenant subscription management and usage-based billing.",
      },
      {
        title: "AI-integrated platforms",
        desc: "Custom web software that embeds proprietary language models, OCR engines and intelligent search.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Specification", desc: "We document user stories, data models and technical requirements." },
      { step: "02", title: "Architecture", desc: "We design database schemas, API contracts and security boundaries." },
      { step: "03", title: "Sprint builds", desc: "We ship testable releases every two weeks with live demonstration links." },
      { step: "04", title: "Quality testing", desc: "We run stress tests, validation checks and security hardening." },
      { step: "05", title: "Production deploy", desc: "We set up production infrastructure and hand over repository access." },
    ],
    runningCosts:
      "Cloud hosting, database services (e.g. Supabase, AWS, DigitalOcean) and third-party APIs are billed directly to your corporate accounts. We size infrastructure appropriately so you don't overpay for idle resources.",
    faq: [
      {
        q: "Which tech stack do you build with?",
        a: "We primarily build with TypeScript, Next.js, Node.js, Python and PostgreSQL. Our choices prioritize reliability, maintainability and broad developer familiarity.",
      },
      {
        q: "Who owns the code?",
        a: "You do. Full source code repositories, databases and documentation pass directly to you with no proprietary lock-in.",
      },
      {
        q: "Can you take over or refactor an existing codebase?",
        a: "Yes. We start by auditing your existing code and dependencies to determine whether refactoring or targeted rebuilds make the most business sense.",
      },
      {
        q: "How do you handle scope changes during development?",
        a: "If new requirements emerge, we evaluate them against current timelines and provide a written change proposal with fixed pricing before starting.",
      },
    ],
  },

  "care-plans": {
    slug: "care-plans",
    name: "Care Plans",
    headline: "Monthly engineering care to keep your software running.",
    sub: "Proactive maintenance, dependency updates, uptime monitoring and hands-on bug fixes for peace of mind after launch.",
    monthly: true,
    packages: [
      {
        name: "Care",
        priceInr: 10000,
        priceUsd: 300,
        deliveryDays: "Monthly retainer",
        supportDays: 0,
        includes: [
          "Uptime monitoring and daily automated backups",
          "Security patches and framework dependency updates",
          "Up to 2 hours of developer tweaks each month",
          "Standard email response within 24 business hours",
        ],
      },
      {
        name: "Growth",
        priceInr: 30000,
        priceUsd: 900,
        deliveryDays: "Monthly retainer",
        supportDays: 0,
        includes: [
          "Continuous performance, error tracking and monitoring",
          "Up to 8 hours of dedicated development each month",
          "Priority bug resolution within 8 business hours",
          "Monthly health report and performance recommendations",
        ],
      },
      {
        name: "Dedicated",
        priceInr: 90000,
        priceUsd: 2800,
        deliveryDays: "Monthly retainer",
        supportDays: 0,
        includes: [
          "Up to 25 hours of active feature development per month",
          "Direct WhatsApp channel with senior engineering team",
          "4-hour emergency turnaround for critical issues",
          "Architecture reviews and quarterly optimization audits",
        ],
      },
    ],
    whatWeBuild: [
      {
        title: "Proactive dependency and security patching",
        desc: "Regular updates to third-party libraries and server packages to prevent vulnerabilities before they happen.",
      },
      {
        title: "Workflow and API health monitoring",
        desc: "Immediate alerts and fixes when third-party tool APIs update or authentication tokens expire.",
      },
      {
        title: "Feature enhancements and tweaks",
        desc: "Ongoing implementation of small features, copy adjustments, and conversion optimizations.",
      },
      {
        title: "Database backup and disaster recovery",
        desc: "Verified daily backups with regular restore drills to ensure your business data is never at risk.",
      },
    ],
    howItWorks: [
      { step: "01", title: "Onboarding", desc: "We review repository access, environment configurations and alert monitors." },
      { step: "02", title: "Baseline check", desc: "We run security audits, clean up deprecated packages and set up backups." },
      { step: "03", title: "Active monitoring", desc: "Our automated systems monitor uptime, error logs and endpoint latency." },
      { step: "04", title: "Monthly work", desc: "We execute your monthly requested tweaks and performance tune-ups." },
      { step: "05", title: "Report", desc: "You receive a clear monthly breakdown of hours used, updates applied and health metrics." },
    ],
    runningCosts:
      "Care Plans are a flat monthly fee billed at the start of each month. There are no surprise hourly charges. You can pause or cancel anytime with 30 days notice.",
    faq: [
      {
        q: "Can unused hours roll over to the next month?",
        a: "To ensure predictable engineering capacity for all clients, hours do not roll over. However, we proactively use unused time to perform security hardening and speed optimizations.",
      },
      {
        q: "What if I need more hours in a specific month?",
        a: "You can purchase additional blocks of developer hours at your plan's discounted hourly rate with written pre-approval.",
      },
      {
        q: "Can you support software built by another agency?",
        a: "Yes. We perform an initial code audit to review structure and documentation before accepting third-party software into our Care Plans.",
      },
      {
        q: "Is there a long-term contract lock-in?",
        a: "No. All Care Plans operate month-to-month and can be adjusted or cancelled with 30 days written notice.",
      },
    ],
  },
};
