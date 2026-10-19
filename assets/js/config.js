/*
  Genartml site settings. This is the only file you need to edit to fill in company details.
  Anything left as "" (or an empty list) stays hidden on the live site. Nothing shows as a blank placeholder.
  After editing, upload this one file again. No rebuild is needed.
*/
window.GENARTML_CONFIG = {
  // Contact
  email: "team@genartml.com",
  officeAddress: "Ahmedabad, Gujarat, India",   // footer and contact page; replace with the full street address
  officeHours: "",                              // e.g. "Monday to Saturday, 10:00 to 19:00 IST"; hidden until set
  phone: "",                                    // e.g. "+91 98765 43210"; hidden until set
  whatsapp: "",                                 // 10-digit Indian mobile, e.g. "9876543210"; floating button and WhatsApp links stay hidden until set
  whatsappMessage: "Hi Genartml, I would like to talk about a project.",

  // "Book a free call" buttons open this link when set (Cal.com, Calendly, Google booking page). Empty = they open /contact/
  calendarUrl: "https://cal.com/team/genartml/discovery-meeting",

  // Registration. Shown in the proof strip, about page and footer only when filled
  cin: "",
  gst: "",

  // Contact form. Paste a form endpoint (Formspree, Getform, Web3Forms, or your own API) that accepts a POST.
  // Empty = the form opens the visitor's email app with the message filled in, addressed to the email above.
  formEndpoint: "",

  // Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Loads only after a visitor accepts cookies.
  ga4Id: "",

  // Social profiles. Icons appear in the footer only for the ones filled in
  social: { linkedin: "", instagram: "", youtube: "", x: "" },

  // Founder section on the about page. Add a photo path (e.g. "/assets/img/team/daksh.jpg", shown in colour),
  // a LinkedIn URL and, if you want, a short message in your own words. Empty fields stay hidden.
  founder: { photo: "/assets/img/team/daksh-suthar.jpg", linkedin: "", message: "" },

  // Team grid on the about page. Section stays hidden until at least one person is added. Without a photo, initials show.
  // { name: "", role: "", specialty: "", linkedin: "", photo: "/assets/img/team/name.jpg" }
  team: [
    { name: "Parth Jadeja", role: "Chief Operating Officer", specialty: "", linkedin: "", photo: "" },
    { name: "Sandeep Bhagat", role: "Chief Technology Officer", specialty: "", linkedin: "", photo: "" }
  ],

  // Client case studies on the work page and home page. Add only after the client signs off on public disclosure.
  // { industry: "", client: "", bottleneck: "", built: "", outcome: "", quote: "", quoteBy: "" }
  caseStudies: []
};
