/* eslint-disable no-unused-vars -- dynamic Lucide components are used in JSX below */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, HeartHandshake, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import { fetchPublishedCommunityActions } from "../../api/communityAction.api";

const supportAreas = [
  {
    icon: Lightbulb,
    title: "Mindset and confidence",
    description:
      "Reflection and learning that strengthen self-awareness, confidence, resilience, and decision-making.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Practical skills",
    description:
      "Skills-based learning delivered directly or with trusted partners, according to the needs of each initiative.",
  },
  {
    icon: Users,
    title: "Mentorship and community",
    description:
      "Access to guidance, peer connection, useful networks, and continued encouragement beyond a single activity.",
  },
  {
    icon: HeartHandshake,
    title: "Pathways to opportunity",
    description:
      "Partnerships, information, referrals, tools, or practical support that can help women move forward.",
  },
];

const isEmpowerHer = (story) =>
  /empower\s*her/i.test(story.relatedProgramme || "") ||
  (story.contentType === "programme" && /women|woman/i.test(`${story.title} ${story.summary}`));

export default function EmpowerHerInitiative() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    fetchPublishedCommunityActions(50)
      .then(({ data }) => {
        if (active) setStories((data || []).filter(isEmpowerHer));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const outcomes = useMemo(
    () => [...new Set(stories.flatMap((story) => story.outcomes || []))].slice(0, 6),
    [stories]
  );

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="EmpowerHer"
        title="Supporting women to build confidence, capability, and a steadier path forward."
        description="EmpowerHer connects inner growth with practical learning, community, and opportunity. Activities are shaped around real needs and delivered with appropriate partners."
        image={{
          src: "/assets/empower-1600.jpg",
          alt: "Women taking part in an EmpowerHer activity",
        }}
        primaryAction={{ label: "Explore the approach", to: "#approach" }}
        secondaryAction={{
          label: "Partner with EmpowerHer",
          to: "/get-involved/partner?source=empowerher",
        }}
      />

      <section className="public-section bg-white">
        <div className="public-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            eyebrow="Purpose"
            title="Personal agency and practical opportunity belong together"
            description="Confidence without access can stall. Skills without self-belief can be hard to use. EmpowerHer brings both sides together so women can make informed choices, strengthen their capacity, and pursue stability with support."
          />
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Who it serves</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#00337C]">
              Women navigating growth, transition, or economic pressure
            </h2>
            <p className="public-copy mt-4">
              Specific eligibility can differ by activity. BYBS may work with young women, mothers,
              early-stage entrepreneurs, jobseekers, or women rebuilding after a difficult season.
              Each published opportunity should state its audience clearly.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
            >
              Ask about current opportunities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="approach" className="public-section scroll-mt-24 bg-[#F7F9FC]">
        <div className="public-container">
          <SectionHeader
            eyebrow="Types of support"
            title="A flexible model built around what women need"
            description="Not every activity includes every form of support. Published initiatives explain exactly what is being offered."
          />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {supportAreas.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <Icon className="h-7 w-7 text-[#00337C]" />
                <h2 className="mt-5 text-xl font-semibold text-[#00337C]">{title}</h2>
                <p className="public-copy mt-3 text-sm">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Published work"
            title="EmpowerHer activities, outcomes, and stories"
            description="This section is drawn from impact stories reviewed and published by the BYBS team."
          />
          {loading ? (
            <LoadingState label="Loading EmpowerHer stories" />
          ) : stories.length ? (
            <>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <article key={story._id} className="group border-t border-gray-200 pt-5">
                    <Link to={`/impact/${story.slug}`}>
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={story.coverImage?.url || "/assets/empower.jpg"}
                          alt={story.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <h2 className="mt-5 text-xl font-semibold text-[#00337C]">{story.title}</h2>
                      <p className="public-copy mt-3 line-clamp-3 text-sm">{story.summary}</p>
                      <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]">
                        Read the full story
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
              {outcomes.length > 0 && (
                <div className="mt-14 border-y border-gray-200 py-9">
                  <h2 className="text-2xl font-semibold text-[#00337C]">Documented outcomes</h2>
                  <ul className="mt-6 grid gap-4 md:grid-cols-2">
                    {outcomes.map((outcome) => (
                      <li key={outcome} className="leading-7 text-gray-700">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="EmpowerHer stories are being prepared"
                message="When the BYBS team publishes an EmpowerHer impact story, its activity, evidence, images, partners, and outcomes will appear here."
              />
            </div>
          )}
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="For partners"
              title="Bring useful capacity, access, or resources"
              description="Training organisations, employers, community groups, funders, and practitioners can support activities through skills, venues, tools, referrals, networks, sponsorship, or opportunities."
            />
            <Link
              to="/get-involved/partner?source=empowerher"
              className="public-button-primary mt-7 px-6 py-3"
            >
              Discuss a partnership
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <SectionHeader
              eyebrow="For supporters"
              title="Help well-designed initiatives reach the right women"
              description="Support can fund practical delivery, learning materials, participant access, documentation, or follow-through. BYBS publishes verified stories as the work is completed."
            />
            <Link to="/support" className="public-button-secondary mt-7 px-6 py-3">
              Support the work
            </Link>
          </div>
        </div>
      </section>
      <CTASection
        eyebrow="EmpowerHer"
        title="Build confidence and opportunity with women, not only for them."
        actions={[
          { label: "Partner with BYBS", to: "/get-involved/partner?source=empowerher" },
          { label: "Contact the team", to: "/contact" },
        ]}
      />
    </div>
  );
}
