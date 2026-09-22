import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Quote,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";
import { fetchActiveReflection, fetchPublishedReflections } from "../../api/reflection.api";
import { fetchPublishedCommunityActions } from "../../api/communityAction.api";

const communityAreas = [
  {
    title: "Fellowship alumni",
    description:
      "Stay connected after a cohort and contribute to the growth of future participants.",
    icon: GraduationCap,
    to: "/programs/fellowship/cohorts",
  },
  {
    title: "Weekly Reflection",
    description:
      "Pause with one useful question, share what you are learning, and hear from other community voices.",
    icon: BookOpenText,
    to: "/community/reflections",
  },
  {
    title: "Mentors and volunteers",
    description:
      "Meet people who contribute experience, time, care, and practical skills to BYBS work.",
    icon: HandHeart,
    to: "/get-involved",
  },
  {
    title: "Activities and outreach",
    description:
      "Take part in conversations, learning sessions, community activities, and practical service.",
    icon: CalendarDays,
    to: "/programs/outreach",
  },
];

export default function CommunityPage() {
  const [featuredVoice, setFeaturedVoice] = useState(null);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchActiveReflection(), fetchPublishedCommunityActions(3)])
      .then(async ([promptResponse, actionResponse]) => {
        if (!mounted) return;
        const prompt = promptResponse.data || null;
        setActions(actionResponse.data || []);
        if (prompt?.slug) {
          const { data } = await fetchPublishedReflections(prompt.slug);
          if (mounted)
            setFeaturedVoice(
              (data || []).find((voice) => voice.status === "featured") || data?.[0] || null
            );
        }
      })
      .catch(() => {
        if (mounted) {
          setFeaturedVoice(null);
          setActions([]);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const upcomingActions = useMemo(() => {
    const now = new Date();
    return actions.filter((action) => action.actionDate && new Date(action.actionDate) >= now);
  }, [actions]);

  return (
    <div>
      <PageHero
        eyebrow="BYBS Community"
        title="Growth continues when people keep showing up for one another."
        description="BYBS is more than a programme. It is a growing community of fellows, alumni, mentors, volunteers, professionals, supporters, and friends learning and contributing together."
        image={{ src: "/assets/c5.jpeg", alt: "Members of the BYBS community" }}
        primaryAction={{ label: "Stay connected", to: "/contact" }}
        secondaryAction={{ label: "Share a reflection", to: "/community/reflections" }}
      />
      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Belonging beyond programmes"
            title="A community that learns, reflects, and contributes"
            description="People can remain involved before, during, and after a formal BYBS programme."
          />
          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2">
            {communityAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article key={area.title} className="border-t border-gray-200 pt-6">
                  <Icon className="h-7 w-7 text-[#D67A00]" />
                  <h2 className="mt-4 text-xl font-semibold text-[#00337C]">{area.title}</h2>
                  <p className="public-copy mt-3">{area.description}</p>
                  <Link
                    to={area.to}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00337C]"
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="alumni" className="public-section scroll-mt-24 bg-[#F7F9FC]">
        <div className="public-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <img
            src="/assets/fell.jpg"
            alt="BYBS Fellowship alumni and participants"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <div>
            <UsersRound className="h-8 w-8 text-[#D67A00]" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
              Fellowship does not have to end at graduation
            </h2>
            <p className="public-copy mt-5 text-lg">
              The cohort archive preserves previous journeys while alumni can return to reflections,
              community activities, volunteering, and mentorship. At BYBS we take the journey beyond
              graduation and help our community continue growing and contributing to the community.
            </p>
            <Link
              to="/programs/fellowship/cohorts"
              className="public-button-primary mt-7 px-6 py-3"
            >
              Explore previous cohorts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      {featuredVoice && (
        <section className="public-section bg-[#F7F9FC]">
          <div className="public-container">
            <SectionHeader
              eyebrow="Featured community voice"
              title="A perspective worth sitting with"
              description="Featured voices are selected for relevance and honesty, never ranked as better than another person's experience."
            />
            <article className="mt-10 grid gap-7 border-y border-gray-200 py-9 md:grid-cols-[auto_1fr]">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#00337C] text-white">
                {featuredVoice.profilePhoto?.url ? (
                  <img
                    src={featuredVoice.profilePhoto.url}
                    alt={featuredVoice.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UsersRound className="h-8 w-8" />
                )}
              </div>
              <div>
                <Quote className="h-7 w-7 text-[#D67A00]" />
                <p className="mt-4 text-xl font-light leading-8 text-gray-800 md:text-2xl">
                  {featuredVoice.reflection}
                </p>
                <p className="mt-5 font-semibold text-[#00337C]">{featuredVoice.displayName}</p>
                <p className="mt-1 text-sm text-gray-500">{featuredVoice.relationship}</p>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Community activities"
            title="Learn together, contribute together"
            description="Published community actions and upcoming opportunities are managed by the BYBS team and updated here."
          />
          {actions.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {actions.map((action) => (
                <article
                  key={action._id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={action.coverImage?.url}
                    alt={action.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="p-5">
                    {action.actionDate && (
                      <p className="inline-flex items-center gap-2 text-xs font-semibold text-[#B96500]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(action.actionDate).toLocaleDateString()}
                      </p>
                    )}
                    <h3 className="mt-3 text-xl font-semibold text-[#00337C]">{action.title}</h3>
                    <p className="public-copy mt-3 text-sm">{action.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 border-y border-gray-200 py-8">
              <p className="font-semibold text-[#00337C]">
                Community activities will appear here as they are published.
              </p>
            </div>
          )}
          {upcomingActions.length > 0 && (
            <div className="mt-8">
              <Link to="/impact" className="public-button-primary px-6 py-3">
                View upcoming activities <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
      <CTASection
        eyebrow="Join the community"
        title="Stay close to the conversations, opportunities, and work that matter to you."
        actions={[
          { label: "Contact BYBS", to: "/contact" },
          { label: "Get involved", to: "/get-involved" },
        ]}
      />
    </div>
  );
}
