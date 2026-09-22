import ProgramCard from "../public/ProgramCard";
import SectionHeader from "../public/SectionHeader";

const programs = [
  {
    title: "BYBS Fellowship",
    description:
      "Structured personal and professional development through guided learning, reflection, mentorship, and community.",
    to: "/programs/fellowship",
    image: "/assets/fell.jpg",
    cta: "Explore the Fellowship",
  },
  {
    title: "Mentorship & Coaching",
    description:
      "Guidance, accountability, and access to experienced people across community, Fellowship, and private support.",
    to: "/programs/mentorship",
    image: "/assets/men-1600.jpg",
    cta: "See mentorship options",
  },
  {
    title: "EmpowerHer",
    description:
      "Practical support for women building confidence, skills, stability, and new possibilities.",
    to: "/programs/empowerher",
    image: "/assets/empower-1600.jpg",
    cta: "Discover EmpowerHer",
  },
  {
    title: "Community Outreach",
    description:
      "Putting BYBS values into practice through service, giving, learning, and community care.",
    to: "/programs/outreach",
    image: "/assets/commu.jpg",
    cta: "See outreach work",
  },
];

export default function Services() {
  return (
    <section className="public-section bg-white">
      <div className="public-container">
        <SectionHeader
          eyebrow="How BYBS creates impact"
          title="Growth that moves from the individual into the community"
          description="Four connected areas help people build confidence, practical skills, leadership, resilience, and meaningful support systems."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {programs.map((program) => (
            <ProgramCard key={program.title} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}
