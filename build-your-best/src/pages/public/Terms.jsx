import { Link } from "react-router-dom";
import { SITE } from "../../config/site";

const sections = [
  [
    "1. Using this website",
    "Use the website lawfully and do not attempt to disrupt it, gain unauthorised access, upload harmful material, impersonate another person, or misuse private information.",
  ],
  [
    "2. Programmes and applications",
    "Submitting an application, waitlist entry, volunteer interest, mentorship interest, or partnership enquiry does not guarantee acceptance, selection, funding, placement, or a particular outcome. Programme requirements and availability may change, and the applicable page or direct communication will provide the current status.",
  ],
  [
    "3. Coaching and mentorship",
    "Coaching, mentorship, workshops, and personal-development content are educational and supportive services. They are not a substitute for medical, mental-health, legal, or financial advice. Paid and free services should be identified on the relevant page before commitment.",
  ],
  [
    "4. Shop, orders, and payments",
    "Product availability and listed prices are shown on the relevant page. The website records order requests but does not collect payment. The BYBS admin confirms availability, the final amount, payment instructions, delivery or digital access, and any applicable refund terms directly through the published WhatsApp contact.",
  ],
  [
    "5. Content and intellectual property",
    "Unless stated otherwise, BYBS owns or is authorised to use the website’s branding, written material, programme material, photographs, and media. Personal, non-commercial use is permitted, but republication, resale, removal of attribution, or misleading reuse requires permission.",
  ],
  [
    "6. Community submissions",
    "A reflection, story, photograph, application, or other submission remains private unless the person has given suitable publication permission and BYBS has approved it for publication. BYBS may moderate, decline, archive, or remove submitted material where appropriate.",
  ],
  [
    "7. External services and links",
    "The website may link to WhatsApp, social platforms, scheduling tools, or other external services. Their own terms and privacy practices apply when those services are used.",
  ],
  [
    "8. Availability and responsibility",
    "BYBS works to keep information accurate and services available but cannot promise uninterrupted access or a particular personal, professional, programme, or commercial result. Nothing in these terms excludes responsibility that cannot legally be excluded.",
  ],
  [
    "9. Changes",
    "These terms may be updated when the website, programmes, services, or legal requirements change. The current version and update date will be published on this page.",
  ],
];

export default function TermsAndConditions() {
  return (
    <div className="bg-white">
      <header className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow mb-4">Website terms</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading">Terms and Conditions</h1>
          <p className="public-copy mt-5 text-lg">
            The basic terms for using the BYBS website, programmes, content, and shop.
          </p>
          <p className="mt-4 text-sm text-gray-500">Last updated: September 21, 2026</p>
        </div>
      </header>
      <main className="public-section">
        <div className="public-container max-w-4xl">
          <div className="bg-[#FFF7E8] p-5 text-sm leading-6 text-gray-700">
            <strong>Legal review:</strong> BYBS should confirm its registered operating entity,
            jurisdiction, refund terms, and any programme-specific conditions with qualified counsel
            before treating this as a final legal document.
          </div>
          <div className="mt-10 space-y-10">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold text-[#00337C]">{title}</h2>
                <p className="public-copy mt-4 text-lg">{body}</p>
              </section>
            ))}
          </div>
          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-[#00337C]">10. Contact</h2>
            <p className="public-copy mt-4">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-[#00337C]">
                {SITE.email}
              </a>
              .
            </p>
            <Link to="/contact" className="public-button-secondary mt-6 px-6 py-3">
              Contact BYBS
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
