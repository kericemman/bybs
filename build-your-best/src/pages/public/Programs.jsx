import { useEffect, useState } from "react";
import PageHero from "../../components/public/PageHero";
import ProgramCard from "../../components/public/ProgramCard";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";
import api from "../../utils/axios";
import { cohortStage, currentCohort } from "../../lib/cohorts";

const programmeData = [
  {
    title: "BYBS Fellowship",
    description:
      "A structured personal and professional development experience built around reflection, practical learning, mentorship, and community.",
    image: "/assets/fell.jpg",
    imageAlt: "BYBS Fellowship participants learning together",
    to: "/programs/fellowship",
    cta: "Explore the Fellowship",
    audience: "Young adults and women ready for structured personal growth.",
    experience: "Guided cohort learning, reflection, mentorship, and peer community.",
    outcome: "Greater self-awareness, resilience, direction, and intentional action.",
  },
  {
    title: "Mentorship & Coaching",
    description:
      "Guidance, accountability, and practical support through community mentorship, Fellowship mentorship, and private coaching where available.",
    image: "/assets/men-1600.jpg",
    imageAlt: "Mentorship conversation",
    to: "/programs/mentorship",
    cta: "Understand the options",
    status: "Free and paid pathways",
    audience: "Community members, fellows, and people seeking focused private support.",
    experience: "Community mentorship, Fellowship support, or paid one-to-one coaching.",
    outcome: "Practical clarity, accountability, and next steps suited to your season.",
  },
  {
    title: "EmpowerHer",
    description:
      "An initiative supporting women as they build confidence, strengthen skills, and move toward personal and economic stability.",
    image: "/assets/empower-1600.jpg",
    imageAlt: "Women participating in an EmpowerHer activity",
    to: "/programs/empowerher",
    cta: "Discover EmpowerHer",
    status: "Partnership-led",
    audience: "Women building confidence, skills, stability, and economic opportunity.",
    experience: "Mindset preparation, practical skills, and supported pathways forward.",
    outcome: "Stronger agency, useful skills, and access to community or opportunity.",
  },
  {
    title: "Community Outreach",
    description:
      "Practical service that brings BYBS values into communities through support, learning, giving, and shared action.",
    image: "/assets/commu.jpg",
    imageAlt: "BYBS community outreach activity",
    to: "/programs/outreach",
    cta: "See the outreach work",
    status: "Active through published initiatives",
    audience: "Communities, volunteers, and partners responding to practical needs.",
    experience: "Service, workshops, giving, volunteering, and collaborative action.",
    outcome: "Documented support, shared learning, and stronger community connection.",
  },
];

export default function Programs() {
  const [fellowshipStatus, setFellowshipStatus] = useState("Loading current cohort status");

  useEffect(() => {
    let active = true;
    api
      .get("/cohorts")
      .then(({ data }) => {
        if (active) setFellowshipStatus(cohortStage(currentCohort(data || [])).label);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const programs = programmeData.map((program) =>
    program.title === "BYBS Fellowship" ? { ...program, status: fellowshipStatus } : program
  );

  return (
    <div>
      <PageHero
        eyebrow="BYBS programmes"
        title="Find the right way to grow, learn, and contribute."
        description="BYBS brings personal development, mentorship, fellowship learning, women’s empowerment, and community service into one connected ecosystem."
        image={{ src: "/assets/c1.jpeg", alt: "Members of the BYBS community" }}
        primaryAction={{ label: "Explore the Fellowship", to: "/programs/fellowship" }}
        secondaryAction={{ label: "Join the community", to: "/community" }}
      />
      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Choose your pathway"
            title="Four ways BYBS creates room for growth"
            description="Each programme serves a different need while staying rooted in Inspire, Heal, Evolve."
          />
          <div className="mt-12 grid gap-x-10 gap-y-14 lg:grid-cols-2">
            {programs.map((program) => (
              <ProgramCard key={program.title} program={program} />
            ))}
          </div>
        </div>
      </section>
      <CTASection
        eyebrow="Not sure where to begin?"
        title="Tell us what kind of support or opportunity you are looking for."
        actions={[
          { label: "Contact BYBS", to: "/contact" },
          { label: "Get involved", to: "/get-involved" },
        ]}
      />
    </div>
  );
}
