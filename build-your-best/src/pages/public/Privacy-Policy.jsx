import { Link } from "react-router-dom";
import { SITE } from "../../config/site";

const sections = [
  [
    "1. Information BYBS collects",
    [
      "Contact details and messages submitted through contact, waitlist, community, programme, volunteer, mentor, partnership, or support forms.",
      "Fellowship application answers and administrative review information.",
      "Order and delivery information needed for the admin team to follow up on shop requests.",
      "Newsletter subscription information.",
      "Technical information normally produced when a website is used, such as IP address, browser information, and server logs.",
    ],
  ],
  [
    "2. Why the information is used",
    [
      "To respond to enquiries and provide requested information.",
      "To review programme and participation applications.",
      "To process order requests, bookings, delivery, and related communication.",
      "To operate BYBS programmes, community activities, and administrative workflows.",
      "To send updates where a person has subscribed or otherwise given permission.",
      "To protect the website, prevent misuse, and meet applicable obligations.",
    ],
  ],
  [
    "3. Services that may process information",
    [
      "WhatsApp is used when a person chooses to continue an order, coaching, or support conversation with the BYBS admin.",
      "Cloudinary stores media uploaded through supported website workflows.",
      "Resend delivers transactional and subscribed email communication.",
      "MongoDB infrastructure stores website and administration records.",
      "Hosting and infrastructure providers may process technical logs needed to operate the website.",
    ],
  ],
  [
    "4. Sharing and publication",
    [
      "BYBS does not automatically publish fellowship applications, contact messages, reflection submissions, volunteer information, or other private submissions.",
      "Community stories, photographs, quotes, and reflections should only be published after appropriate review and permission.",
      "Information may be shared with service providers only where needed to operate the website or deliver the requested service.",
    ],
  ],
  [
    "5. Retention and security",
    [
      "Information should be kept only for as long as it is reasonably needed for the purpose for which it was collected, administration, dispute handling, or applicable record-keeping duties.",
      "BYBS uses access controls and protected administrative routes, but no internet service can promise absolute security.",
    ],
  ],
  [
    "6. Your choices",
    [
      "You may ask BYBS to correct, update, or delete information where applicable.",
      "You may unsubscribe from marketing or community emails using the method provided in the message or by contacting BYBS.",
      "You may withdraw future publication permission for a submitted story or image, subject to material already lawfully published or distributed.",
    ],
  ],
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      <header className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
        <div className="public-container max-w-4xl">
          <p className="public-eyebrow mb-4">Privacy</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading">Privacy Policy</h1>
          <p className="public-copy mt-5 text-lg">
            How Build Your Best Self handles information submitted through this website.
          </p>
          <p className="mt-4 text-sm text-gray-500">Last updated: September 21, 2026</p>
        </div>
      </header>
      <main className="public-section">
        <div className="public-container max-w-4xl">
          <div className="bg-[#FFF7E8] p-5 text-sm leading-6 text-gray-700">
            <strong>Legal review:</strong> This policy describes the website’s current technical
            workflows. BYBS should have it reviewed by qualified counsel for its operating
            jurisdiction and organisational structure.
          </div>
          <p className="public-copy mt-8 text-lg">
            This policy applies to buildyourbestself.org and the public forms, programme workflows,
            shop, email subscriptions, and administration services connected to it.
          </p>
          <div className="mt-10 space-y-10">
            {sections.map(([title, items]) => (
              <section key={title}>
                <h2 className="text-2xl font-semibold text-[#00337C]">{title}</h2>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-gray-700">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-[#00337C]">7. Contact</h2>
            <p className="public-copy mt-4">
              For privacy questions or requests, email{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-[#00337C]">
                {SITE.email}
              </a>
              . Please do not send passwords, card details, or other unnecessary sensitive
              information by email.
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
