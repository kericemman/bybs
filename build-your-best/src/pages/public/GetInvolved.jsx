import {
  ArrowRight,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Users,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";

const paths = [
  {
    title: "Join BYBS",
    who: "For people seeking learning, reflection, connection, and structured personal growth.",
    commitment: "Participate in a programme or community activity with consistency and respect.",
    contribution: "Your presence, perspective, and willingness to put learning into practice.",
    next: "Explore the community and current programmes before choosing the right entry point.",
    to: "/community",
    icon: Users,
  },
  {
    title: "Volunteer",
    who: "For people ready to contribute practical skills to a defined BYBS need.",
    commitment: "One-time, project-based, or ongoing, depending on the opportunity.",
    contribution:
      "Skills across programmes, outreach, creative work, technology, events, and operations.",
    next: "Submit the volunteer form for review and role matching.",
    to: "/get-involved/volunteer",
    icon: HandHeart,
  },
  {
    title: "Mentor",
    who: "For experienced professionals and practitioners who can guide responsibly.",
    commitment: "A workshop, a short project, or an agreed series of mentorship sessions.",
    contribution: "Professional insight, constructive feedback, and dependable availability.",
    next: "Share your expertise and mentorship interests for a suitable match.",
    to: "/get-involved/mentor",
    icon: GraduationCap,
  },
  {
    title: "Partner",
    who: "For organizations that share a practical goal with BYBS.",
    commitment: "A scoped collaboration with clear responsibilities and outcomes.",
    contribution:
      "Training, opportunities, funding, resources, space, networks, or strategic support.",
    next: "Send a partnership enquiry so the team can assess fit and scope.",
    to: "/get-involved/partner",
    icon: Waypoints,
  },
  {
    title: "Support",
    who: "For individuals and organizations that want to enable a verified BYBS need.",
    commitment: "Support can be financial, material, professional, or in kind.",
    contribution:
      "A contribution matched transparently to a Fellow, cohort, outreach activity, or priority.",
    next: "Submit a support enquiry before any contribution is arranged.",
    to: "/support",
    icon: HeartHandshake,
  },
];

export default function GetInvolved() {
  return (
    <div>
      <PageHero
        eyebrow="Get involved"
        title="Choose a meaningful way to take part in BYBS."
        description="Learn with the community, share your skills, mentor someone, build a partnership, or support practical work."
        image={{ src: "/assets/c2.jpeg", alt: "BYBS community members together" }}
        primaryAction={{ label: "Explore the pathways", to: "#pathways" }}
        secondaryAction={{ label: "See BYBS impact", to: "/impact" }}
      />
      <section id="pathways" className="public-section scroll-mt-24 bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Participation pathways"
            title="Start with the role that fits you"
            description="Every pathway sets out who it is for, what it asks of you, and what happens next."
          />
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {paths.map((path) => {
              const Icon = path.icon;
              return (
                <article key={path.title} className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5F9FF] text-[#00337C]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-2xl font-semibold text-[#00337C]">{path.title}</h2>
                  </div>
                  <dl className="mt-6 space-y-4 text-sm leading-6">
                    <div>
                      <dt className="font-semibold text-gray-900">Who it is for</dt>
                      <dd className="mt-1 text-gray-600">{path.who}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">Commitment</dt>
                      <dd className="mt-1 text-gray-600">{path.commitment}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">Your contribution</dt>
                      <dd className="mt-1 text-gray-600">{path.contribution}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900">What happens next</dt>
                      <dd className="mt-1 text-gray-600">{path.next}</dd>
                    </div>
                  </dl>
                  <Link
                    to={path.to}
                    className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
                  >
                    Explore {path.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
