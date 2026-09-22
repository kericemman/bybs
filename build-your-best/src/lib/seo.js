const runtimeEnv = import.meta.env || {};
const processEnv = globalThis.process?.env || {};

export const SITE_URL = (
  runtimeEnv.VITE_SITE_URL ||
  processEnv.VITE_SITE_URL ||
  processEnv.SITE_URL ||
  "https://buildyourbestself.org"
).replace(/\/$/, "");
export const SITE_NAME = "Build Your Best Self";
export const DEFAULT_IMAGE = "/assets/Logo1.png";
export const DEFAULT_DESCRIPTION =
  "Build Your Best Self is a personal and professional growth community supporting young people and women through fellowship, mentorship, empowerment, insights, and community action.";

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
    "https://www.linkedin.com/company/109732355",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@buildyourbestself.org",
    contactType: "general enquiries",
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
    target: `${SITE_URL}/insights?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const publicRouteSeo = {
  "/": {
    title: "Build Your Best Self | Community, Growth and Impact",
    description: DEFAULT_DESCRIPTION,
    image: "/assets/home-hero-1600.jpg",
    keywords:
      "personal growth, coaching, fellowship, women empowerment, youth development, self discovery",
  },
  "/about": {
    title: "About Build Your Best Self | Founder, Mission and Story",
    description:
      "Learn about the Build Your Best Self mission, founder story, values, and work supporting women and youth through healing, confidence, purpose, and growth.",
    image: "/assets/about-1600.jpg",
    keywords: "Build Your Best Self founder, women empowerment, personal development mission",
  },
  "/founder": {
    title: "Build Your Best Self Mission | Personal Growth and Empowerment",
    description:
      "Explore the mission behind Build Your Best Self and the work helping people heal, grow, and build lives rooted in confidence and purpose.",
    image: "/assets/AB.jpg",
    keywords: "Build Your Best Self mission, healing, confidence, purpose",
  },
  "/coaching": {
    title: "Coaching | Build Your Best Self",
    description:
      "Book practical coaching support for self-awareness, confidence, career clarity, healing, boundaries, and intentional personal growth.",
    image: "/assets/men-1600.jpg",
    keywords: "coaching, personal growth coaching, confidence coaching, career clarity",
  },
  "/programs": {
    title: "BYBS Programs | Fellowship, Mentorship, EmpowerHer and Outreach",
    description:
      "Explore BYBS Fellowship, mentorship and coaching, EmpowerHer, and community outreach programmes.",
    image: "/assets/c1.jpeg",
  },
  "/programs/fellowship": {
    title: "BYBS Fellowship | Personal and Professional Development",
    description:
      "Explore the BYBS Fellowship, current cohort status, previous cohorts, programme format, learning, and application information.",
    image: "/assets/fell.jpg",
  },
  "/programs/fellowship/cohorts": {
    title: "BYBS Cohorts | Fellowship Reflections and Graduate Stories",
    description:
      "Explore BYBS cohort reflections, achievements, graduate stories, galleries, and the journey of previous fellowship communities.",
    image: "/assets/fell.jpg",
    keywords: "BYBS cohorts, fellowship graduates, cohort reflections",
  },
  "/programs/mentorship": {
    title: "BYBS Mentorship and Coaching",
    description:
      "Understand BYBS community mentorship, Fellowship mentorship, and private coaching options.",
    image: "/assets/men-1600.jpg",
  },
  "/programs/empowerher": {
    title: "EmpowerHer | Build Your Best Self",
    description:
      "Learn about EmpowerHer support for women building confidence, skills, stability, and opportunity.",
    image: "/assets/empower-1600.jpg",
  },
  "/programs/outreach": {
    title: "BYBS Community Outreach",
    description:
      "See how BYBS puts personal growth into action through community service, learning, giving, and practical support.",
    image: "/assets/commu.jpg",
  },
  "/community": {
    title: "BYBS Community | Learn, Reflect and Contribute",
    description:
      "Connect with BYBS fellows, alumni, mentors, volunteers, weekly reflections, stories, activities, and opportunities to contribute.",
    image: "/assets/c5.jpeg",
  },
  "/community/reflections": {
    title: "BYBS Weekly Reflection",
    description:
      "Join the BYBS Weekly Reflection and explore selected community voices and previous prompts.",
    image: "/assets/c4.jpeg",
  },
  "/community/reflections/submit": {
    title: "Share a Weekly Reflection | BYBS",
    description: "Submit a private response to the current BYBS Weekly Reflection for review.",
    image: "/assets/c4.jpeg",
    noindex: true,
  },
  "/community/testimonials/submit": {
    title: "Share Your BYBS Experience",
    description:
      "Share how your experience with Build Your Best Self influenced your growth, contribution, or community journey.",
    image: "/assets/c5.jpeg",
    noindex: true,
  },
  "/community/stories": {
    title: "BYBS Community Stories",
    description:
      "Read verified stories from BYBS fellows, alumni, mentors, volunteers, and community members.",
    image: "/assets/c5.jpeg",
  },
  "/impact": {
    title: "BYBS Impact | Programmes, Outreach and Stories",
    description:
      "Explore verified BYBS impact through Fellowship journeys, community outreach, contribution, and stories of growth.",
    image: "/assets/commu.jpg",
  },
  "/insights": {
    title: "BYBS Insights | Growth, Leadership and Community",
    description:
      "Read practical BYBS insights on personal growth, career, leadership, wellbeing, professional development, and community.",
    image: "/assets/aligned-1600.jpg",
  },
  "/get-involved": {
    title: "Get Involved With BYBS",
    description:
      "Join BYBS, volunteer, become a mentor, build a partnership, or support the mission.",
    image: "/assets/c2.jpeg",
  },
  "/get-involved/volunteer": {
    title: "Volunteer With BYBS",
    description:
      "Contribute time and skills to BYBS programmes, outreach, events, content, technology, and administration.",
    image: "/assets/commu.jpg",
  },
  "/get-involved/mentor": {
    title: "Become a BYBS Mentor",
    description:
      "Contribute professional experience, practical guidance, and encouragement as a BYBS mentor.",
    image: "/assets/men-1600.jpg",
  },
  "/get-involved/partner": {
    title: "Partner With BYBS",
    description:
      "Explore partnership opportunities across Fellowship, mentorship, outreach, training, resources, and career access.",
    image: "/assets/c2.jpeg",
  },
  "/support": {
    title: "Support BYBS",
    description:
      "Support BYBS Fellowship learning, community outreach, practical resources, and future initiatives.",
    image: "/assets/commu.jpg",
  },
  "/fellowship": {
    title: "BYBS Fellowship | Build Your Best Self",
    description:
      "Join the BYBS Fellowship, a guided growth journey for self-awareness, resilience, purpose, confidence, and intentional development.",
    image: "/assets/fell.jpg",
    keywords:
      "BYBS Fellowship, personal development cohort, youth fellowship, women empowerment fellowship",
  },
  "/fellowship/apply": {
    title: "Apply for BYBS Fellowship | Build Your Best Self",
    description:
      "Complete your application for the BYBS Fellowship and share your goals, story, availability, and growth focus.",
    image: "/assets/fell.jpg",
    keywords: "BYBS Fellowship application, cohort application, personal growth program",
  },
  "/cohorts": {
    title: "BYBS Cohorts | Fellowship Reflections and Graduate Stories",
    description:
      "Explore BYBS cohort reflections, achievements, graduate stories, galleries, and the journey of previous fellowship communities.",
    image: "/assets/fell.jpg",
    keywords: "BYBS cohorts, fellowship graduates, cohort reflections",
  },
  "/articles": {
    title: "Articles | Build Your Best Self",
    description:
      "Read BYBS articles on self-discovery, confidence, healing, purpose, boundaries, empowerment, and building a grounded life.",
    image: "/assets/aligned-1600.jpg",
    keywords:
      "self discovery articles, healing articles, personal growth blog, confidence articles",
  },
  "/shop": {
    title: "Shop BYBS | Purchases That Power Our Programmes",
    description:
      "Shop BYBS ebooks, resources, and merchandise. Every purchase helps sustain Fellowship, EmpowerHer, youth development, mentorship, and community outreach.",
    image: "/assets/not1.png",
    keywords:
      "BYBS shop, purpose driven merchandise, personal growth ebooks, support women and youth",
  },
  "/contact": {
    title: "Contact Build Your Best Self",
    description:
      "Contact Build Your Best Self for coaching, fellowship questions, partnerships, charity work, and community support.",
    image: "/assets/about-1600.jpg",
    keywords: "contact Build Your Best Self, coaching inquiry, fellowship inquiry",
  },
  "/order-request": {
    title: "Order Request | Build Your Best Self",
    description: "Send a BYBS shop order request and continue with the admin team on WhatsApp.",
    image: "/assets/not1.png",
    noindex: true,
  },
  "/discovery": {
    title: "Self Discovery Quiz | Build Your Best Self",
    description:
      "Use the BYBS discovery experience to reflect on your current season, growth needs, and next steps.",
    image: "/assets/rebuild-1600.jpg",
    keywords: "self discovery quiz, growth reflection, personal development quiz",
  },
  "/empowerher": {
    title: "EmpowerHer Initiative | Build Your Best Self",
    description:
      "Discover the EmpowerHer initiative supporting women through confidence, healing, leadership, and personal growth.",
    image: "/assets/empower-1600.jpg",
    keywords: "EmpowerHer, women empowerment, confidence, healing",
  },
  "/outreach": {
    title: "Community Outreach | Build Your Best Self",
    description:
      "Learn about BYBS outreach work supporting vulnerable families, youth, and communities through practical care and emotional support.",
    image: "/assets/commu.jpg",
    keywords: "community outreach, youth support, vulnerable families",
  },
  "/faqs": {
    title: "FAQs | Build Your Best Self",
    description:
      "Find answers to common questions about BYBS coaching, fellowship programs, shop orders, applications, and support.",
    image: "/assets/about-1600.jpg",
    keywords: "BYBS FAQ, coaching questions, fellowship questions",
  },
  "/privacy": {
    title: "Privacy Policy | Build Your Best Self",
    description:
      "Read the Build Your Best Self privacy policy and how personal information is handled.",
  },
  "/terms": {
    title: "Terms and Conditions | Build Your Best Self",
    description:
      "Read the Build Your Best Self website, coaching, shop, and service terms and conditions.",
  },
};

export const getSeoForPathname = (pathname = "/") => {
  if (publicRouteSeo[pathname]) return publicRouteSeo[pathname];
  if (/^\/articles\/[^/]+/.test(pathname)) return publicRouteSeo["/articles"];
  if (/^\/insights\/[^/]+/.test(pathname)) return publicRouteSeo["/insights"];
  if (/^\/community\/reflections\/submit/.test(pathname))
    return publicRouteSeo["/community/reflections/submit"];
  if (/^\/community\/reflections\/[^/]+/.test(pathname))
    return publicRouteSeo["/community/reflections"];
  if (/^\/impact\/[^/]+/.test(pathname)) return publicRouteSeo["/impact"];
  if (/^\/shop\/[^/]+/.test(pathname)) return publicRouteSeo["/shop"];
  if (/^\/programs\/fellowship\/cohorts\/[^/]+\/apply/.test(pathname))
    return publicRouteSeo["/fellowship/apply"];
  if (/^\/programs\/fellowship\/cohorts\/[^/]+/.test(pathname)) return publicRouteSeo["/cohorts"];
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
