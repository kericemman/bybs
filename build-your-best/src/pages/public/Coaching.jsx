/* eslint-disable no-unused-vars -- dynamic Lucide components are rendered from data */
import { useEffect } from "react";
import { ArrowRight, Check, GraduationCap, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import { buildCoachingWhatsAppUrl } from "../../lib/whatsapp";

const pathways = [
  {
    icon: Users,
    title: "Community mentorship",
    cost: "Free when available",
    description:
      "Shared guidance, conversations, events, and learning opportunities offered through the wider BYBS community.",
    forWhom: "For community members looking for connection, perspective, and occasional guidance.",
    action: "See ways to participate",
    to: "/get-involved",
  },
  {
    icon: GraduationCap,
    title: "Fellowship mentorship",
    cost: "Included in the Fellowship",
    description:
      "Mentorship connected to a published Fellowship cohort and shaped around that cohort's learning journey.",
    forWhom: "For accepted fellows who are actively participating in their cohort.",
    action: "Explore the Fellowship",
    to: "/programs/fellowship",
  },
  {
    icon: MessageCircle,
    title: "Private coaching",
    cost: "Arranged directly with BYBS",
    description:
      "Focused personal support for a specific decision, transition, pattern, or growth goal. This is a separate service, not the centre of BYBS.",
    forWhom:
      "For someone who wants confidential, individual attention and a defined support package.",
    action: "View coaching options",
    to: "#private-coaching",
  },
];

const packages = [
  {
    name: "Clarity Boost",
    price: "$35",
    subtitle: "One focused conversation",
    description:
      "A 60-minute session for emotional relief, decision support, and a clear next step.",
    features: ["60-minute one-to-one session", "Personalised action plan", "Email follow-up"],
    quantity: 1,
    type: "coaching",
  },
  {
    name: "Breakthrough Bundle",
    price: "$90",
    subtitle: "Three sessions for steady progress",
    description: "A short coaching sequence for building momentum in one important area.",
    features: [
      "Three 60-minute sessions",
      "Personalised growth plan",
      "Between-session support",
      "Accountability structure",
    ],
    quantity: 1,
    type: "coaching",
  },
  {
    name: "Transformation Journey",
    price: "$165",
    subtitle: "Six sessions for deeper work",
    description:
      "A longer one-to-one journey for a significant transition or sustained personal goal.",
    features: [
      "Six 60-minute sessions",
      "Initial growth assessment",
      "Weekly check-ins",
      "Tailored resources",
    ],
    quantity: 1,
    type: "coaching",
  },
];

export default function CoachingPackages() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Mentorship and coaching"
        title="Different kinds of guidance for different seasons."
        description="BYBS offers community-based mentorship, Fellowship mentorship, and a small private coaching service. Private coaching arrangements are confirmed directly with the BYBS team on WhatsApp."
        image={{ src: "/assets/men-1600.jpg", alt: "A focused mentorship conversation" }}
        primaryAction={{ label: "Compare the pathways", to: "#pathways" }}
        secondaryAction={{ label: "Explore the Fellowship", to: "/programs/fellowship" }}
      />

      <section id="pathways" className="public-section scroll-mt-24 bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Choose your pathway"
            title="Mentorship is part of the mission. Private coaching is one focused option."
            description="Each pathway explains what is included. Where a fee applies, BYBS confirms availability and payment instructions directly on WhatsApp."
          />
          <div className="mt-12 grid divide-y divide-[#00337C]/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {pathways.map(({ icon: Icon, ...path }) => (
              <article
                key={path.title}
                className="py-8 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
              >
                <Icon className="h-7 w-7 text-[#00337C]" />
                <p className="mt-5 text-xs font-semibold uppercase text-[#B96500]">{path.cost}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#00337C]">{path.title}</h2>
                <p className="public-copy mt-4">{path.description}</p>
                <p className="mt-5 text-sm leading-6 text-gray-700">
                  <span className="font-semibold text-gray-900">Best suited to: </span>
                  {path.forWhom}
                </p>
                {path.to.startsWith("#") ? (
                  <a
                    href={path.to}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
                  >
                    {path.action}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    to={path.to}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
                  >
                    {path.action}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid divide-y divide-[#00337C]/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="pb-8 lg:pb-0 lg:pr-12">
            <SectionHeader
              eyebrow="What mentorship does"
              title="Perspective, encouragement, and practical learning"
              description="Mentorship creates access to people, experience, and conversation. It can help you see possibilities and learn from someone else's journey, but it does not replace your own decisions or professional care."
            />
          </div>
          <div className="pt-8 lg:pl-12 lg:pt-0">
            <SectionHeader
              eyebrow="What coaching does"
              title="Focused attention around a defined goal"
              description="Private coaching provides a confidential space, structured questions, accountability, and practical actions. It is educational and developmental, not therapy, medical care, legal advice, or financial advice."
            />
          </div>
        </div>
      </section>

      <section id="private-coaching" className="public-section scroll-mt-24 bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Private coaching"
            title="Transparent packages for one-to-one support"
            description="Prices are shown for guidance. Select a package to ask the BYBS admin about availability, the final amount, payment instructions, and scheduling on WhatsApp."
          />
          <div className="mt-12 grid divide-y divide-[#00337C]/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {packages.map((item) => (
              <article
                key={item.name}
                className="flex flex-col py-8 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
              >
                <p className="text-sm font-semibold text-[#B96500]">{item.subtitle}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-[#00337C]">{item.name}</h2>
                  <p className="text-2xl font-light text-gray-900">{item.price}</p>
                </div>
                <p className="public-copy mt-4">{item.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm leading-6 text-gray-700">
                      <Check className="mt-1 h-4 w-4 flex-none text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={buildCoachingWhatsAppUrl(item)}
                  target="_blank"
                  rel="noreferrer"
                  className="public-button-primary mt-7 w-full px-5 py-3"
                >
                  Enquire on WhatsApp
                  <MessageCircle className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-gray-500">
            No coaching payment is collected on this website. The BYBS team confirms availability
            and next steps directly on WhatsApp.
          </p>
        </div>
      </section>

      <section className="bg-[#E9EEF5] text-gray-900">
        <div className="public-container grid gap-8 py-5 md:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:py-15">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Still deciding?</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 font-light text-[#00337C]">
              Start with the pathway that matches your need.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Ask BYBS about mentorship, Fellowship participation, or whether private coaching is an
              appropriate fit.
            </p>
          </div>
          <Link to="/contact" className="public-button-primary px-6 py-3.5">
            Contact BYBS
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
