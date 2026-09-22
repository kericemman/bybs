import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";

const pageContent = {
  reflections: {
    eyebrow: "BYBS Weekly Reflection",
    title: "A regular pause for honest learning and shared perspective.",
    description:
      "Weekly Reflection will connect Thursday BYBS Insights with Friday community voices. Submissions will be reviewed before anything is published.",
    heading: "The reflection system is being prepared",
    body: "The next phase will add active prompts, response submissions, consent controls, moderation, featured reflections, and previous weeks.",
  },
  stories: {
    eyebrow: "Community stories",
    title: "The people behind the growth, service, and shared work.",
    description:
      "This space will bring together verified stories from fellows, alumni, volunteers, mentors, and community members.",
    heading: "Community stories are being documented",
    body: "Stories will only be published with appropriate permission and will distinguish real experience from promotional claims.",
  },
};

export default function CommunityComingSoon({ type }) {
  const page = pageContent[type];
  return (
    <div>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        image={{ src: "/assets/c4.jpeg", alt: page.eyebrow }}
        primaryAction={{ label: "Explore the community", to: "/community" }}
        secondaryAction={{ label: "Read BYBS Insights", to: "/insights" }}
      />
      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            align="center"
            eyebrow="Coming soon"
            title={page.heading}
            description={page.body}
          />
          <div className="mt-8 text-center">
            <Link to="/contact" className="public-button-secondary px-6 py-3">
              Stay connected with BYBS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
