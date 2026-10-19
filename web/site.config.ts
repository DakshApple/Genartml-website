/**
 * site.config.ts
 *
 * Every value Daksh must supply lives here. Components read from this file.
 * Rule: if a value is empty ("" or []), the element that uses it is hidden.
 * Never fill a gap with invented content.
 */

export type Currency = "INR" | "USD";

export interface Package {
  name: string;
  priceInr: number;
  priceUsd: number;
  /** true shows "from" before the price */
  from?: boolean;
  deliveryDays: string;
  supportDays: number;
}

export interface Service {
  slug: string;
  name: string;
  packages: Package[];
  /** Care Plans are billed monthly */
  monthly?: boolean;
}

export const siteConfig = {
  company: {
    legalName: "Genartml Private Limited",
    brandName: "Genartml",
    foundedYear: 2024,
    registrationNumber: "", // CIN. Supply to show.
    gstNumber: "", // Supply to show.
    udyamNumber: "", // Supply to show.
    startupRecognition: "", // Supply to show.
    metaPartner: false, // true only if Genartml is a confirmed Meta partner.
  },

  contact: {
    address: "", // Full street address for the footer and Google Business Profile.
    city: "Ahmedabad, Gujarat, India",
    phone: "",
    whatsappNumber: "", // Digits only with country code, e.g. 91XXXXXXXXXX. Empty hides the button.
    email: "team@genartml.com",
    calendarBookingUrl: "", // Empty: "Book a free call" links to /contact/.
    officeHours: "", // Real hours only.
    mapEmbedUrl: "",
    googleBusinessProfileUrl: "",
  },

  social: {
    linkedin: "",
    instagram: "",
    youtube: "",
    x: "",
    facebook: "",
    github: "",
  },

  products: {
    evoluterUrl: "https://evoluter.in",
    extuterUrl: "https://extuter.com",
    extuterLive: true,
  },

  team: [] as {
    name: string;
    role: string;
    photo: string;
    oneLine: string;
    linkedin?: string;
  }[],

  clientLogos: [] as { name: string; logoFile: string; approved: boolean }[],

  caseStudies: [] as {
    slug: string;
    client: string;
    industry: string;
    problem: string;
    built: string;
    result: string;
    quote?: string;
    approved: boolean;
  }[],

  /** Flip a sector to true only after Daksh confirms Genartml works in it. */
  industries: {
    "real-estate": true, // Confirmed: Real estate AI systems
    "clinics-healthcare": false,
    "coaching-education": false,
    solar: false,
    agritech: false,
    "small-business": false,
  } as Record<string, boolean>,

  /** false: pricing table is replaced by a form that emails the price list. */
  showPrices: true,

  analytics: {
    ga4Id: "G-7RCXB14L96", // Loads only after cookie Accept.
    searchConsoleVerification: "",
  },

  forms: {
    notifyEmail: "team@genartml.com",
    sheetOrCrmWebhook: "", // Server-side only. Set via environment variable in production.
  },

  /** Text that may be A/B tested later without touching components. */
  copy: {
    heroHeadline: "We build the software and AI systems your business runs on.",
    heroSub:
      "Fixed price. Fixed timeline. Built in Ahmedabad for clients across India and abroad.",
    primaryButton: "Book a free call",
    secondaryButton: "See our prices",
    whatsappText: "Hi Genartml, I would like to talk about a project.",
    closingHeadline: "Tell us what you need.",
    closingSub: "Fixed price. Fixed timeline.",
  },

  services: [
    {
      slug: "ai-workflows",
      name: "AI Workflows",
      packages: [
        { name: "Starter", priceInr: 35000, priceUsd: 1200, deliveryDays: "7 working days", supportDays: 30 },
        { name: "Growth", priceInr: 125000, priceUsd: 4500, deliveryDays: "20 working days", supportDays: 60 },
        { name: "Enterprise", priceInr: 350000, priceUsd: 12000, from: true, deliveryDays: "35 to 45 working days", supportDays: 90 },
      ],
    },
    {
      slug: "voice-ai-agents",
      name: "Voice AI Agents",
      packages: [
        { name: "Starter", priceInr: 45000, priceUsd: 1500, deliveryDays: "10 working days", supportDays: 30 },
        { name: "Growth", priceInr: 110000, priceUsd: 4000, deliveryDays: "20 working days", supportDays: 60 },
        { name: "Enterprise", priceInr: 275000, priceUsd: 9500, from: true, deliveryDays: "35 working days", supportDays: 90 },
      ],
    },
    {
      slug: "websites",
      name: "Websites",
      packages: [
        { name: "Launch", priceInr: 40000, priceUsd: 1200, deliveryDays: "10 working days", supportDays: 30 },
        { name: "Business", priceInr: 95000, priceUsd: 3000, deliveryDays: "20 working days", supportDays: 60 },
        { name: "Commerce or corporate", priceInr: 225000, priceUsd: 7500, from: true, deliveryDays: "35 working days", supportDays: 90 },
      ],
    },
    {
      slug: "software-development",
      name: "Software Development",
      packages: [
        { name: "Prototype", priceInr: 250000, priceUsd: 7500, deliveryDays: "30 working days", supportDays: 30 },
        { name: "Standard", priceInr: 600000, priceUsd: 18000, deliveryDays: "60 working days", supportDays: 60 },
        { name: "Enterprise", priceInr: 1500000, priceUsd: 45000, from: true, deliveryDays: "90 to 120 working days", supportDays: 90 },
      ],
    },
    {
      slug: "care-plans",
      name: "Care Plans",
      monthly: true,
      packages: [
        { name: "Care", priceInr: 10000, priceUsd: 300, deliveryDays: "Monthly", supportDays: 0 },
        { name: "Growth", priceInr: 30000, priceUsd: 900, deliveryDays: "Monthly", supportDays: 0 },
        { name: "Dedicated", priceInr: 90000, priceUsd: 2800, deliveryDays: "Monthly", supportDays: 0 },
      ],
    },
  ] as Service[],

  /** Voice AI calling minutes, billed per connected minute. */
  voiceMinuteRate: { inr: 12, usd: 0.2 },
} as const;

export type SiteConfig = typeof siteConfig;
