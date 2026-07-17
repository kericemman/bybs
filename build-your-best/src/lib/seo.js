export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://buildyourbestself.org").replace(/\/$/, "");
export const SITE_NAME = "Build Your Best Self";
export const DEFAULT_IMAGE = "/assets/Logo1.png";
export const DEFAULT_DESCRIPTION =
  "Build Your Best Self helps women, youth, and purpose-driven professionals grow through coaching, fellowship programs, articles, and practical personal development resources.";

export const absoluteUrl = (path = "/") => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const stripHtml = (value = "") =>
  String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (value = "", maxLength = 155) => {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 3).trim()}...`;
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(DEFAULT_IMAGE),
  description: DEFAULT_DESCRIPTION,
  sameAs: [
    "https://www.instagram.com/buildyourbestself_25",
    "https://www.facebook.com/share/176ZP54B6X/",
    "https://www.tiktok.com/@buildyourbestselfblog",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@buildyourbestselfblog.com",
    contactType: "customer support",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/articles?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const publicRouteSeo = {
  "/": {
    title: "Build Your Best Self | Coaching, Fellowship, Articles and Growth",
    description: DEFAULT_DESCRIPTION,
    keywords: "personal growth, coaching, fellowship, women empowerment, youth development, self discovery",
  },
  "/about": {
    title: "About Build Your Best Self | Founder, Mission and Story",
    description:
      "Learn about the Build Your Best Self mission, founder story, values, and work supporting women and youth through healing, confidence, purpose, and growth.",
    keywords: "Build Your Best Self founder, women empowerment, personal development mission",
  },
  "/founder": {
    title: "Build Your Best Self Mission | Personal Growth and Empowerment",
    description:
      "Explore the mission behind Build Your Best Self and the work helping people heal, grow, and build lives rooted in confidence and purpose.",
    keywords: "Build Your Best Self mission, healing, confidence, purpose",
  },
  "/coaching": {
    title: "Coaching | Build Your Best Self",
    description:
      "Book practical coaching support for self-awareness, confidence, career clarity, healing, boundaries, and intentional personal growth.",
    keywords: "coaching, personal growth coaching, confidence coaching, career clarity",
  },
  "/fellowship": {
    title: "BYBS Fellowship | Build Your Best Self",
    description:
      "Join the BYBS Fellowship, a guided growth journey for self-awareness, resilience, purpose, confidence, and intentional development.",
    keywords: "BYBS Fellowship, personal development cohort, youth fellowship, women empowerment fellowship",
  },
  "/fellowship/apply": {
    title: "Apply for BYBS Fellowship | Build Your Best Self",
    description:
      "Complete your application for the BYBS Fellowship and share your goals, story, availability, and growth focus.",
    keywords: "BYBS Fellowship application, cohort application, personal growth program",
  },
  "/cohorts": {
    title: "BYBS Cohorts | Fellowship Reflections and Graduate Stories",
    description:
      "Explore BYBS cohort reflections, achievements, graduate stories, galleries, and the journey of previous fellowship communities.",
    keywords: "BYBS cohorts, fellowship graduates, cohort reflections",
  },
  "/articles": {
    title: "Articles | Build Your Best Self",
    description:
      "Read BYBS articles on self-discovery, confidence, healing, purpose, boundaries, empowerment, and building a grounded life.",
    keywords: "self discovery articles, healing articles, personal growth blog, confidence articles",
  },
  "/shop": {
    title: "Shop | BYBS Ebooks and Merchandise",
    description:
      "Shop BYBS ebooks, resources, and merchandise that support personal growth, reflection, and the BYBS charity mission.",
    keywords: "BYBS shop, personal growth ebooks, charity merchandise",
  },
  "/charity-merch": {
    title: "Charity Merchandise | Build Your Best Self",
    description:
      "Support the BYBS charity campaign through merchandise purchases that help Divine Mercy Charity Home and community outreach work.",
    keywords: "charity merchandise, BYBS charity campaign, Divine Mercy Charity Home",
  },
  "/contact": {
    title: "Contact Build Your Best Self",
    description:
      "Contact Build Your Best Self for coaching, fellowship questions, partnerships, charity work, and community support.",
    keywords: "contact Build Your Best Self, coaching inquiry, fellowship inquiry",
  },
  "/checkout": {
    title: "Checkout | Build Your Best Self",
    description: "Complete your BYBS order securely.",
    noindex: true,
  },
  "/payment/success": {
    title: "Payment Successful | Build Your Best Self",
    description: "Your BYBS payment was successful.",
    noindex: true,
  },
  "/coaching-success": {
    title: "Coaching Booking Received | Build Your Best Self",
    description: "Your BYBS coaching booking has been received.",
    noindex: true,
  },
  "/discovery": {
    title: "Self Discovery Quiz | Build Your Best Self",
    description:
      "Use the BYBS discovery experience to reflect on your current season, growth needs, and next steps.",
    keywords: "self discovery quiz, growth reflection, personal development quiz",
  },
  "/empowerher": {
    title: "EmpowerHer Initiative | Build Your Best Self",
    description:
      "Discover the EmpowerHer initiative supporting women through confidence, healing, leadership, and personal growth.",
    keywords: "EmpowerHer, women empowerment, confidence, healing",
  },
  "/outreach": {
    title: "Community Outreach | Build Your Best Self",
    description:
      "Learn about BYBS outreach work supporting vulnerable families, youth, and communities through practical care and emotional support.",
    keywords: "community outreach, youth support, vulnerable families",
  },
  "/faqs": {
    title: "FAQs | Build Your Best Self",
    description:
      "Find answers to common questions about BYBS coaching, fellowship programs, shop orders, applications, and support.",
    keywords: "BYBS FAQ, coaching questions, fellowship questions",
  },
  "/privacy": {
    title: "Privacy Policy | Build Your Best Self",
    description: "Read the Build Your Best Self privacy policy and how personal information is handled.",
  },
  "/terms": {
    title: "Terms and Conditions | Build Your Best Self",
    description: "Read the Build Your Best Self website, coaching, shop, and service terms and conditions.",
  },
};

export const getSeoForPathname = (pathname = "/") => {
  if (publicRouteSeo[pathname]) return publicRouteSeo[pathname];
  if (/^\/articles\/[^/]+/.test(pathname)) return publicRouteSeo["/articles"];
  if (/^\/shop\/[^/]+/.test(pathname)) return publicRouteSeo["/shop"];
  if (/^\/cohorts\/[^/]+\/apply/.test(pathname)) return publicRouteSeo["/fellowship/apply"];
  if (/^\/cohorts\/[^/]+/.test(pathname)) return publicRouteSeo["/cohorts"];
  if (/^\/fellowship\/[^/]+\/apply/.test(pathname)) return publicRouteSeo["/fellowship/apply"];
  return publicRouteSeo["/"];
};

export const breadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
