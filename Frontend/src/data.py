# Genartml website content. Prices, tiers and timelines come from the approved
# client price list (pricing/Genartml-price-list-2026-27.pdf, effective 19 October 2026).
# Public copy rules: no "automation", no exclamation marks, none of the banned words,
# no invented clients, numbers or registrations.

SITE_URL = "https://genartml.com"
EMAIL = "team@genartml.com"
LEGAL_NAME = "Genartml Private Limited"

STEPS_HOME = [
    ("20-minute discovery call", "We ask about the work your team does by hand today, the tools you use and the date you need it live. Free, no obligation."),
    ("Written proposal in 48 hours", "A fixed price, a fixed delivery date in working days and the exact list of what is included and what is not."),
    ("Approve and pay the deposit", "You sign the scope and pay the first instalment. Work starts the same week."),
    ("Live test links every Friday", "You see working software every week, not a status update. Feedback goes straight into the next build."),
    ("Launch, IP handover, support", "Go-live, full handover of code, designs and data, and 30 to 90 days of included support."),
]

def T(id, name, inr, usd, delivery, delivery_short, support, items, featured=False, kind="project", inr_note=""):
    return dict(id=id, name=name, inr=inr, usd=usd, delivery=delivery, deliveryShort=delivery_short,
                support=support, items=items, featured=featured, kind=kind)

SERVICES = [
    dict(
        slug="ai-workflows", code="S/01", name="AI Workflows", contact="ai-workflows",
        short="Connected systems that take over repeat work.",
        value="Your tools talk to each other, so every enquiry gets answered, logged and assigned without anyone copying data.",
        from_inr="₹35,000", from_usd="$1,200", days="7 to 45 working days",
        h1="Every enquiry answered, logged and assigned. Nobody copying data between apps.",
        intro="We connect the tools you already use, so a new enquiry gets an instant reply, lands in your CRM and alerts the right person. The repeat steps your team does by hand today, such as forwarding, re-typing, chasing and reporting, run on their own, with an AI step where judgement is needed and a person in the loop where it matters.",
        seo_title="AI workflows for Indian businesses, fixed price | Genartml",
        seo_desc="AI workflows that connect WhatsApp, your CRM, sheets and email so enquiries are answered and logged without manual work. Fixed price, delivered in 7 working days.",
        tiers=[
            T("starter", "Starter", "₹35,000", "$1,200", "7 working days", "7 working days", "30 days",
              ["One workflow connecting up to 3 tools", "Example: website enquiry to an instant WhatsApp reply, a Google Sheet row and a team alert", "Built on the tools you already use", "Tested on a live link before go-live"]),
            T("growth", "Growth", "₹1,25,000", "$4,500", "20 working days", "20 working days", "60 days",
              ["Up to 4 connected workflows", "One AI step: sorting enquiries, drafting replies or reading documents", "CRM connection", "Simple results dashboard"], featured=True),
            T("enterprise", "Enterprise", "From ₹3,50,000", "From $12,000", "35 to 45 working days", "35 to 45 working days", "90 days",
              ["Department-wide, up to 10 workflows", "AI assistant trained on your documents", "User roles and an audit log", "Error alerts on every workflow", "Starts with a paid discovery, adjusted against the project"]),
        ],
        uses=[
            ("Instant enquiry response", "A lead from your website, Justdial or IndiaMART gets a WhatsApp reply in seconds, a row in your sheet and an alert to the right salesperson.", ["Form", "WhatsApp", "Sheet", "Alert"]),
            ("Real estate lead triage", "Every portal lead is sorted by budget, location and intent, then assigned to the agent who covers that area, with a follow-up reminder.", ["Portal", "AI sort", "CRM", "Agent"]),
            ("Invoices into your books", "Bills and purchase orders arriving on email or WhatsApp are read, checked and entered into Excel or Tally. Mismatches are flagged, not guessed.", ["Email", "AI read", "Check", "Tally"]),
            ("Morning owner report", "At 9am the owner gets a short WhatsApp note: collections, pending orders and anything that slipped since yesterday.", ["Sheets", "CRM", "Summary", "WhatsApp"]),
        ],
        build_step="We connect your tools with accounts in your name: WhatsApp Business, CRM, sheets, email and any AI step.",
        costs_intro="Workflow tools, AI usage and WhatsApp fees are billed by each provider directly to your account at their own price. Our fee never changes because of them.",
        costs=[("Workflow tool subscription", "Paid to the provider"), ("AI model usage", "Paid to the provider, per use"), ("WhatsApp Business fees", "Paid to Meta or your provider"), ("Paid software seats", "Paid to the vendor")],
        faqs=[
            ("Do I have to change the software my team uses?", "No. We build on the tools you already use, such as WhatsApp, Google Sheets, your CRM and email. If a tool cannot connect, we tell you before the proposal, not after."),
            ("What happens if a connected tool goes down?", "The workflow stops at that step instead of sending something wrong. Enterprise builds include error alerts on every workflow, and with a Care plan we watch for failures and fix them within the plan's response time."),
            ("Can the AI step work in Hindi?", "Yes. Sorting enquiries, drafting replies and reading documents work in English, Hindi and Hinglish. We test with your real messages before go-live."),
            ("Who can see my data?", "Only the tools you already pay for and the AI provider used for the AI step. Everything runs in accounts in your name, and a mutual NDA is available at no charge."),
            ("What if I need another workflow later?", "Each extra workflow is a fixed-price add-on with 5 working days delivery, or included in a Growth Care plan."),
        ],
    ),
    dict(
        slug="voice-ai-agents", code="S/02", name="Voice AI Agents", contact="voice-ai-agents",
        short="Phone agents in English, Hindi and Hinglish.",
        value="A voice agent answers or makes calls, books appointments and writes every call into your sheet or CRM.",
        from_inr="₹45,000", from_usd="$1,500", days="10 to 35 working days",
        h1="Every call answered, in English, Hindi or Hinglish.",
        intro="A voice agent picks up inbound calls or calls new enquiries back, asks the right questions one at a time, books the appointment and writes every call into your sheet or CRM with a summary. It says plainly that it is an AI assistant, never quotes a price it was not given, and hands the call to a person when it should. Your team speaks only to people who are ready.",
        seo_title="Voice AI agents in Hindi and English | Genartml, Ahmedabad",
        seo_desc="Voice AI agents that answer and make calls in English, Hindi and Hinglish, book appointments and log every call to your CRM. Fixed price, live in 10 working days.",
        tiers=[
            T("starter", "Starter", "₹45,000", "$1,500", "10 working days", "10 working days", "30 days",
              ["One agent doing one job: inbound enquiries or outbound callback", "English plus Hindi or Hinglish", "Answers up to 15 common questions", "Every call logged with a summary"]),
            T("growth", "Growth", "₹1,10,000", "$4,000", "20 working days", "20 working days", "60 days",
              ["Inbound and outbound agents", "Appointment booking on Google Calendar", "WhatsApp follow-up after each call", "CRM update and transfer to a person", "Weekly call report"], featured=True),
            T("enterprise", "Enterprise", "From ₹2,75,000", "From $9,500", "35 working days", "35 working days", "90 days",
              ["Several agents across teams", "Custom voice, regional language on request", "Compliant calling number setup", "Two-way CRM sync", "Quality scoring on every call"]),
        ],
        uses=[
            ("24/7 clinic appointment booking", "Patients call at any hour, the agent checks the doctor's calendar, books the slot and sends a WhatsApp confirmation.", ["Call", "Calendar", "Booking", "WhatsApp"]),
            ("Callback to every new enquiry", "Each new lead gets a call back, a few qualifying questions and a booked slot with your sales team. Busy callers get a callback at their time.", ["Lead", "Call", "Qualify", "Slot"]),
            ("Site-visit scheduling for real estate", "The agent confirms budget, configuration and preferred day, then books the site visit and tells the right agent.", ["Enquiry", "Call", "Visit", "Agent"]),
            ("Reminders and confirmations", "Payment, renewal and appointment reminders by phone, with the answer logged so your team only follows up on the ones that need it.", ["List", "Call", "Answer", "Log"]),
        ],
        build_step="We set up the calling number, voice, language and the rules the agent must follow, and connect your calendar, WhatsApp and CRM.",
        costs_intro="Calling minutes, AI usage and WhatsApp messages cost money every time they run. You can pay the calling platform directly at its own rate, so there is no markup, or let us bill minutes at a fixed rate written into your proposal.",
        costs=[("Calling minutes", "Your platform account, or a fixed per-minute rate"), ("AI model usage", "Paid to the provider"), ("WhatsApp follow-up messages", "Paid to Meta or your provider"), ("CRM seats", "Paid to the vendor")],
        faqs=[
            ("Which languages can the agent speak?", "English, Hindi and Hinglish on every package, including callers who switch mid-sentence. Other regional languages are available on Enterprise on request, and we test them with your real callers before committing."),
            ("Will callers know they are talking to an AI?", "Yes, when they ask, the agent says so plainly in one line and carries on. Hiding it is the fastest way to lose a customer's trust."),
            ("What happens when the agent does not know an answer?", "It never makes one up. It says the team will confirm, logs the question and, on Growth and Enterprise, transfers the call to a person or books a callback."),
            ("What if the calling platform goes down?", "During the build we agree a number that calls forward to if the platform cannot answer, so callers reach your team instead of silence. With an agent Care plan we monitor and fix it within the plan's response time."),
            ("Can it make outbound promotional calls?", "Yes, within TRAI rules for commercial calls. Your scope names who owns each registration and which number is used."),
        ],
    ),
    dict(
        slug="websites", code="S/03", name="Websites", contact="websites",
        short="Business sites, landing pages and online stores.",
        value="Business sites, landing pages and online stores that send every enquiry straight to your team.",
        from_inr="₹40,000", from_usd="$1,200", days="10 to 35 working days",
        h1="A website that sends every enquiry straight to your team.",
        intro="Most business websites collect enquiries into an inbox nobody checks. We build fast, mobile-first sites where every form goes to WhatsApp and a sheet the moment it is filled, with search basics and analytics set up from day one. Domain and hosting are in your name, and the source files are yours on final payment.",
        seo_title="Business websites with a fixed price and timeline | Genartml",
        seo_desc="Mobile-first business websites, landing pages and online stores where every enquiry goes to WhatsApp and a sheet. Fixed price, delivered in 10 working days.",
        tiers=[
            T("launch", "Launch", "₹40,000", "$1,200", "10 working days", "10 working days", "30 days",
              ["Up to 5 pages, mobile-first", "Contact form that sends enquiries to WhatsApp and a sheet", "Basic search optimisation", "Google Analytics set up"]),
            T("business", "Business", "₹95,000", "$3,000", "20 working days", "20 working days", "60 days",
              ["Up to 12 pages", "Editable blog or case-study section", "Copy polish for every page", "Mobile page speed score above 90", "One enquiry workflow included"], featured=True),
            T("commerce", "Commerce or corporate", "₹2,25,000", "From $7,500", "35 working days", "35 working days", "90 days",
              ["Online store up to 100 products with payments", "Or a corporate site up to 25 pages", "Two languages", "Careers page", "Admin training for your team"]),
        ],
        uses=[
            ("Manufacturer catalogue site", "Product ranges, specifications and downloadable sheets, with a quote request that lands on the sales team's WhatsApp.", ["Catalogue", "Quote form", "WhatsApp"]),
            ("Campaign landing page", "One page for one offer, built to load fast on a phone, with every lead captured into a sheet and followed up the same day.", ["Ad", "Landing", "Sheet", "Follow-up"]),
            ("Online store", "Up to 100 products with payments, order alerts on WhatsApp and an admin your team is trained to use.", ["Products", "Payments", "Orders"]),
            ("Corporate site in two languages", "Up to 25 pages in English and one more language, with a careers page and an editable news section.", ["Pages", "Languages", "Careers"]),
        ],
        build_step="We design and build every page, connect the enquiry form to WhatsApp and a sheet, and set up domain, hosting, SSL and analytics in your name.",
        costs_intro="Domain and hosting are set up in your own name and billed to you by the provider at its own price. We add nothing on top.",
        costs=[("Domain and hosting", "Paid yearly to the provider"), ("Paid themes or plugins", "Only if you choose them"), ("Stock photos", "Paid to the library"), ("Professional photography", "Booked by you or through us at cost")],
        faqs=[
            ("How many design changes do I get?", "Two rounds of design changes are included with every website. Further rounds are quoted at a fixed price before we start them."),
            ("Can I edit the site myself?", "Yes. Business and Commerce sites include an editable blog or news section, and we train your team. Launch sites can be edited through a Care plan."),
            ("Can the site be in Hindi as well as English?", "Yes. Two languages are included in the Commerce or corporate package. For other packages, a second language is quoted at a fixed price."),
            ("What happens if the site goes down?", "Hosting is in your name, so you always have access. With a Care plan we monitor uptime and respond within 48 hours, 24 hours or 4 working hours depending on the plan."),
            ("Do I own the website?", "Yes. Domain and hosting are in your name from day one, and the full source files pass to you on final payment."),
        ],
    ),
    dict(
        slug="software-development", code="S/04", name="Software Development", contact="software-development",
        short="Web apps, portals and internal tools.",
        value="Web apps, admin panels, client portals and internal tools built to a written specification, with AI where it helps.",
        from_inr="₹2,50,000", from_usd="$7,500", days="30 to 120 working days",
        h1="Web apps and internal tools, built to a written specification.",
        intro="When spreadsheets and WhatsApp groups stop scaling, the work needs its own software. We write the specification and screen designs first, you approve them, and only then do we write code. You get a working test link every week, and the code repository, designs and documentation are yours on final payment.",
        seo_title="Custom software development, fixed price | Genartml, Ahmedabad",
        seo_desc="Web apps, client portals, admin panels and internal tools built to a written specification with weekly test links. A working prototype in 30 working days, at a fixed price.",
        tiers=[
            T("prototype", "Prototype", "₹2,50,000", "$7,500", "30 working days", "30 working days", "30 days",
              ["A working web app with one core user journey", "5 to 8 screens", "Login and a database", "Ready to show investors or test with real users"]),
            T("standard", "Standard", "₹6,00,000", "$18,000", "60 working days", "60 working days", "60 days",
              ["Production web app with up to 4 user journeys", "Admin panel", "Payments", "Email and WhatsApp notifications", "Deployed on your cloud account"], featured=True),
            T("enterprise", "Enterprise", "From ₹15,00,000", "From $45,000", "90 to 120 working days", "90 to 120 working days", "90 days",
              ["Multi-role platform on web, Android and iOS", "Third-party integrations and AI features", "Security review and load testing", "Built in fixed-price phases", "Starts with a paid discovery, adjusted against the build"]),
        ],
        uses=[
            ("Client portal", "Your clients log in to see project status, documents and invoices instead of asking on WhatsApp.", ["Login", "Status", "Documents"]),
            ("Operations admin panel", "One screen for orders, dispatch and stock, replacing three spreadsheets and a daily phone call.", ["Orders", "Dispatch", "Stock"]),
            ("Booking or ordering app", "Customers book or order online and pay, your team gets notified, and every record lands in one database.", ["Booking", "Payment", "Notify"]),
            ("Internal tool with an AI step", "Field reports, applications or documents are read and summarised so your team reviews instead of re-typing.", ["Upload", "AI read", "Review"]),
        ],
        build_step="We build against the approved specification and screen designs, deploy to your cloud account and update the test link every Friday.",
        costs_intro="Cloud hosting, app store fees and third-party services are billed to your own accounts at their published prices. Nothing is resold through us.",
        costs=[("Cloud hosting", "Paid to your cloud provider"), ("Apple App Store", "Yearly fee, paid to Apple"), ("Google Play", "One-time fee, paid to Google"), ("Third-party services", "Paid to each provider")],
        faqs=[
            ("What if my requirements change halfway?", "Anything outside the signed scope is quoted as a fixed-price change request and starts only after your written approval. The original price and date stay as they were."),
            ("Which technology do you use?", "We pick a widely used, well-supported stack so any good developer can maintain it after handover. The specification names it before you approve."),
            ("Can you build Android and iOS apps?", "Yes. Enterprise builds include web, Android and iOS. An existing web app can also be turned into Android and iOS apps as a fixed-price add-on in 15 working days."),
            ("How do you handle downtime and security?", "Standard and Enterprise builds deploy on your own cloud account. Enterprise includes a security review and load testing. After the free support period, a Care plan covers monitoring and fixes."),
            ("Do I get the source code?", "Yes. The code repository, designs and documentation transfer to you on final payment."),
        ],
    ),
    dict(
        slug="care-plans", code="S/05", name="Care Plans", contact="care-plans",
        short="Monthly support after launch.",
        value="A monthly plan that keeps your workflows, agents, websites and apps running, with fixes and small changes included.",
        from_inr="₹10,000 a month", from_usd="$300 a month", days="First response in 4 to 48 hours",
        h1="Your systems, kept running after launch.",
        intro="Software needs looking after once it is live. A Care plan covers uptime monitoring, bug fixes, security updates and a set number of changes every month, so you never get an hourly bill for keeping things working. Plans are billed monthly in advance with a 3-month minimum.",
        seo_title="Care plans for websites, apps and AI systems | Genartml",
        seo_desc="Monthly care plans with uptime monitoring, bug fixes, security updates and new features. Fixed monthly fee, with first response in 4 to 48 hours.",
        tiers=[
            T("care", "Care", "₹10,000", "$300", "Monthly", "per month", "48 hours",
              ["Uptime monitoring", "Bug fixes and security updates", "2 small changes a month", "Monthly health report"], kind="care"),
            T("growth", "Growth", "₹30,000", "$900", "Monthly", "per month", "24 hours",
              ["Everything in Care", "One new workflow or feature a month", "AI tuning", "Monthly results call"], featured=True, kind="care"),
            T("dedicated", "Dedicated", "₹90,000", "$2,800", "Monthly", "per month", "4 working hours",
              ["A dedicated builder on your roadmap", "A delivery every 2 weeks", "Priority fixes", "Quarterly roadmap review"], kind="care"),
        ],
        uses=[
            ("Website and app upkeep", "Uptime watched, security updates applied, bugs fixed and two small changes made every month.", ["Monitor", "Fix", "Update"]),
            ("Voice agent tuning", "New questions added, answers adjusted from real call logs and quality checked every month.", ["Call logs", "Tune", "Test"]),
            ("A new workflow every month", "On Growth, one new workflow or feature ships every month, so the system keeps up with the business.", ["Request", "Build", "Ship"]),
            ("A builder on your roadmap", "On Dedicated, one builder works on your priorities with a delivery every two weeks and a quarterly roadmap review.", ["Roadmap", "Build", "Review"]),
        ],
        build_step="We audit what is running, connect monitoring and alerts, and agree the list of systems the plan covers.",
        costs_intro="Hosting, AI usage, calling and app store fees stay billed to your own accounts. The plan fee covers our time only and never moves with usage.",
        costs=[("Hosting and cloud", "Paid to the provider"), ("AI model usage", "Paid to the provider"), ("Calling and WhatsApp", "Paid to the platform"), ("Software licences", "Paid to the vendor")],
        faqs=[
            ("Can I get a Care plan for something Genartml did not build?", "Yes, after a short audit of what is running. If something needs fixing first, we quote that at a fixed price before the plan starts."),
            ("How fast do you respond?", "First response within 48 hours on Care, 24 hours on Growth and 4 working hours on Dedicated."),
            ("What counts as a small change?", "Something that takes a few hours, such as a new field on a form, a copy update or a new question for a voice agent. Larger work is quoted at a fixed price."),
            ("How do I stop a plan?", "Plans have a 3-month minimum and then need 30 days notice. Everything we built and maintain stays yours."),
            ("Is there a plan just for voice agents?", "Yes. Agent care plans come in three levels, each at a fixed monthly fee, covering monitoring, answer updates and call quality checks."),
        ],
    ),
]

SERVICE_STEPS = [
    ("Discovery", "A 20-minute call to understand the work your team does by hand today and what a good result looks like."),
    ("Architecture", "A written scope: what we build, which tools it connects, what it costs and the delivery date in working days."),
    ("Connect", None),  # filled from service.build_step
    ("Sandbox testing", "Every Friday you get a live test link. We test with your real examples, not made-up ones."),
    ("Go live", "Launch, founder review, handover of everything to your accounts, and included support starts."),
]

HOME_FAQ = [
    ("How do I know what it will cost?", "Every project has a fixed price agreed in writing before we start. You will not receive an hourly bill, and nothing is added later unless you ask for something outside the agreed scope. Every package, with its scope and delivery date, is listed on the packages page, and your price comes in a written proposal within 48 hours of the call."),
    ("How long does a project take?", "The delivery date is written into your proposal in working days. A single workflow or a small website takes 7 to 10 working days. Larger software takes 60 working days or more, built in fixed-price phases."),
    ("Who owns the code, designs and data?", "You do. Full ownership of the code, designs, content and database passes to you on final payment, and everything runs in accounts in your name."),
    ("Is my data safe with you?", "Your data is used only to deliver your project and is never used to train AI models without your written consent. A mutual NDA is available on request at no charge."),
    ("Do you work with clients outside India?", "Yes. International clients are invoiced in US dollars with 0% Indian GST, because services exported from India are zero-rated. The dollar price is fixed in the quote, so currency moves do not change it."),
    ("What happens after launch?", "Every package includes free bug fixes for 30, 60 or 90 days from go-live. After that, a monthly Care plan keeps everything running."),
]

PRICING_FAQ = [
    ("Why fixed scope instead of hourly billing?", "Hourly billing rewards the builder for taking longer. A fixed scope puts the risk of estimating on us: if something takes longer than we planned, that is our cost, not yours."),
    ("What if I need something outside the scope?", "We quote it as a fixed-price change request. It starts only after your written approval, and the original price and date do not move."),
    ("What if my side is late with content or access?", "If content, access or feedback is more than 5 working days late, the delivery date moves by the same number of days. The price does not change."),
    ("Is there a rush option?", "Yes. Rush delivery cuts the timeline by up to 40%, at a fixed price agreed before kickoff."),
]

ADDONS = [
    ("Extra workflow", "₹15,000", "$500", "5 working days"),
    ("Extra tool or CRM connection", "₹10,000", "$300", "3 working days"),
    ("WhatsApp Business setup and template approval", "₹12,000", "$400", "5 working days"),
    ("AI assistant trained on your documents (website or WhatsApp)", "₹40,000", "$1,300", "10 working days"),
    ("Extra voice agent language", "₹15,000", "$500", "5 working days"),
    ("Extra website page", "₹4,000", "$100", "2 working days"),
    ("Copywriting, per page", "₹2,500", "$100", "2 working days"),
    ("Search optimisation setup (keywords, Search Console, 10 pages)", "₹15,000", "$500", "5 working days"),
    ("Admin dashboard for any build", "₹40,000", "$1,300", "10 working days"),
    ("Android and iOS app from an existing web app", "₹75,000", "$2,500", "15 working days"),
    ("Data move from an old system", "₹20,000", "$700", "5 working days"),
    ("Team training session, live and recorded", "₹5,000", "$200", "Same week"),
]

PRODUCTS = [
    dict(name="Evoluter", url="https://evoluter.in", domain="evoluter.in", tag="UPSC preparation",
         line="An AI preparation engine for UPSC civil services aspirants.",
         problem="UPSC preparation is long, lonely and expensive, and most aspirants cannot get regular, personal feedback on where they are going wrong.",
         audience="Individual UPSC aspirants on a self-serve subscription, and coaching institutes that license it for their students by the seat.",
         built="Product design, the web platform, the AI layer behind practice and feedback, subscriptions and seat licensing for institutes."),
    dict(name="Extuter", url="https://extuter.com", domain="extuter.com", tag="JEE and NEET",
         line="An AI doubt-solving companion for JEE and NEET students.",
         problem="A student stuck on a problem at 11pm has nobody to ask, and one teacher cannot sit with every student.",
         audience="Students preparing for JEE and NEET, and the families and institutes supporting them.",
         built="Product design, the student app, the AI doubt-solving layer and the question bank behind it."),
]

INDUSTRIES = [
    dict(slug="real-estate", name="Real estate", short="Lead response, site visits and follow-up for builders, brokers and channel partners."),
]

BLOG_CATS = ["AI Voice Agents", "AI Systems", "Engineering Process"]
