export interface IndustryDetail {
  slug: string;
  name: string;
  headline: string;
  sub: string;
  problem: string;
  whatWeBuild: { title: string; desc: string }[];
  sampleWorkflow: { step: string; title: string; desc: string }[];
  fittingPackage: { serviceName: string; packageName: string; why: string };
  faq: { q: string; a: string }[];
}

export const INDUSTRIES_DETAIL: Record<string, IndustryDetail> = {
  "real-estate": {
    slug: "real-estate",
    name: "Real estate",
    headline: "AI workflows and software built for real estate developers and brokers.",
    sub: "Qualify inbound property buyers in seconds, automate site visit scheduling, and keep your CRM updated around the clock.",
    problem:
      "Property buyers enquire across portals, WhatsApp and property listings at all hours. When response times exceed 10 minutes, buyers move on to competitor developers and agents, causing valuable leads to drop off before site visits are booked.",
    whatWeBuild: [
      {
        title: "24/7 WhatsApp & portal lead qualification",
        desc: "Instant automated responses that verify buyer budget, location preference, and purchase timeline.",
      },
      {
        title: "Automated site visit calendar dispatch",
        desc: "Syncs directly with sales executives' Google or Outlook calendars to book verified site tours.",
      },
      {
        title: "Dynamic brochure & floorplan delivery",
        desc: "Sends matching property brochures and pricing sheets to buyers based on their expressed criteria.",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Enquiry", desc: "Buyer submits an enquiry via 99acres, MagicBricks, Meta ads or website." },
      { step: "02", title: "Instant WhatsApp triage", desc: "AI assistant reaches out within 30 seconds to confirm requirements." },
      { step: "03", title: "Site visit scheduling", desc: "Qualified buyers choose a convenient site visit slot directly." },
      { step: "04", title: "CRM synchronization", desc: "All lead notes, verified numbers and visit times update in your CRM." },
    ],
    fittingPackage: {
      serviceName: "AI Workflows",
      packageName: "Growth",
      why: "Covers multi-channel lead ingestion, WhatsApp Business API connectivity, and bi-directional CRM syncing.",
    },
    faq: [
      {
        q: "Does this work with Indian real estate CRMs?",
        a: "Yes. We integrate with LeadSquared, Salesforce, Zoho CRM, Sell.Do and Google Sheets.",
      },
      {
        q: "Can the bot answer specific questions about amenities and carpet area?",
        a: "Yes. We feed your project specifications, RERA details and floorplans into the agent's knowledge base.",
      },
    ],
  },

  "clinics-healthcare": {
    slug: "clinics-healthcare",
    name: "Clinics and healthcare",
    headline: "Voice AI agents and patient scheduling systems for healthcare practices.",
    sub: "Free up reception staff, eliminate missed phone calls, and streamline clinic appointments around the clock.",
    problem:
      "Clinic front desks are overwhelmed answering recurring phone questions about doctor availability, consultation fees, and appointment reschedules, leading to busy signals and patient frustration.",
    whatWeBuild: [
      {
        title: "Voice AI consultation booking agent",
        desc: "Handles incoming clinic calls, checks doctor schedules, and books appointment slots in real time.",
      },
      {
        title: "Automated WhatsApp appointment confirmations",
        desc: "Sends instant booking summaries with clinic location maps and pre-consultation instructions.",
      },
      {
        title: "Post-consultation follow-up flows",
        desc: "Gathers patient satisfaction feedback and schedules recurring checkup reminders automatically.",
      },
    ],
    sampleWorkflow: [
      { step: "01", title: "Inbound call", desc: "Patient dials the clinic reception line." },
      { step: "02", title: "Voice agent greeting", desc: "Voice AI confirms required doctor specialty and checks live calendar." },
      { step: "03", title: "Slot confirmation", desc: "Patient selects a time; slot is reserved instantly in clinic software." },
      { step: "04", title: "WhatsApp notification", desc: "Patient receives directions, appointment token, and instructions." },
    ],
    fittingPackage: {
      serviceName: "Voice AI Agents",
      packageName: "Starter",
      why: "Provides inbound phone line reception, doctor calendar integration, and patient notification triggers.",
    },
    faq: [
      {
        q: "Is patient medical data kept confidential?",
        a: "Yes. We do not store diagnostic or clinical history, and our workflows adhere to strict data security standards.",
      },
      {
        q: "What if a patient calls with an emergency?",
        a: "Emergency keywords immediately trigger an immediate transfer to emergency staff or advise hospital contact.",
      },
    ],
  },
};
