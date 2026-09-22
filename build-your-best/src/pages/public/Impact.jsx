import { createElement, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Handshake,
  MapPin,
  Users,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import { fetchPublishedCommunityActions } from "../../api/communityAction.api";
import { fetchImpactMetrics } from "../../api/impact.api";

const evidenceAreas = [
  {
    title: "Fellowship impact",
    description:
      "Cohort journeys, learning milestones, graduate reflections, and outcomes show how the Fellowship develops over time.",
    icon: GraduationCap,
    to: "/programs/fellowship/cohorts",
  },
  {
    title: "Community outreach",
    description:
      "Documented initiatives show how BYBS turns growth into practical care, service, and community participation.",
    icon: HandHeart,
    to: "/programs/outreach",
  },
  {
    title: "Volunteer contribution",
    description:
      "Volunteers contribute time, skills, creative work, coordination, and professional support to real needs.",
    icon: UsersRound,
    to: "/get-involved/volunteer",
  },
  {
    title: "Partner contribution",
    description:
      "Partners expand access through training, resources, venues, networks, opportunities, and sponsorship.",
    icon: Handshake,
    to: "/get-involved/partner",
  },
];

const typeLabels = {
  outreach: "Community outreach",
  fellowship: "Fellowship",
  transformation: "Story of growth",
  volunteer: "Volunteer contribution",
  partnership: "Partnership",
  programme: "Programme impact",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(value)
      )
    : "";

function StoryMeta({ story }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
      {story.actionDate && (
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#B96500]" />
          {formatDate(story.actionDate)}
        </span>
      )}
      {story.location && (
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#B96500]" />
          {story.location}
        </span>
      )}
      {Number.isFinite(story.participantCount) && (
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-[#B96500]" />
          {story.participantCount.toLocaleString()} participants
        </span>
      )}
    </div>
  );
}

function StoryCard({ story }) {
  return (
    <article className="group border-t border-gray-200 pt-5">
      <Link to={`/impact/${story.slug}`}>
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
          <img
            src={story.coverImage.url}
            alt={story.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase text-[#B96500]">
          {typeLabels[story.contentType] || "Impact story"}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-7 text-[#00337C]">{story.title}</h3>
        <p className="public-copy mt-3 line-clamp-3 text-sm">{story.summary}</p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]">
          Read story <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </article>
  );
}

export default function Impact() {
  const [stories, setStories] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([fetchPublishedCommunityActions(50), fetchImpactMetrics()])
      .then(([storiesResult, metricsResult]) => {
        if (!active) return;
        setStories(storiesResult.status === "fulfilled" ? storiesResult.value.data || [] : []);
        setMetrics(metricsResult.status === "fulfilled" ? metricsResult.value.data || [] : []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const featuredStory = useMemo(
    () => stories.find((story) => story.isFeatured) || stories[0] || null,
    [stories]
  );
  const recentStories = useMemo(
    () => stories.filter((story) => story._id !== featuredStory?._id),
    [stories, featuredStory]
  );
  const latestVerification = useMemo(
    () =>
      metrics.reduce((latest, metric) => {
        const date = new Date(metric.verifiedAt || 0);
        return date > latest ? date : latest;
      }, new Date(0)),
    [metrics]
  );

  return (
    <div>
      <PageHero
        eyebrow="Our impact"
        title="Evidence of growth, service, and shared progress."
        description="Explore verified statistics and documented stories from BYBS programmes, Fellowship journeys, community outreach, volunteers, and partners."
        image={{ src: "/assets/commu.jpg", alt: "BYBS members participating in community work" }}
        primaryAction={{ label: "Explore impact stories", to: "#impact-stories" }}
        secondaryAction={{ label: "Support the work", to: "/support" }}
      />

      {metrics.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div className="public-container py-5 md:py-10 lg:py-15">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-[#B96500]">Verified impact</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#00337C] md:text-3xl">
                  What the evidence currently shows
                </h2>
              </div>
              {latestVerification.getTime() > 0 && (
                <p className="text-sm text-gray-500">
                  Figures verified through {formatDate(latestVerification)}
                </p>
              )}
            </div>
            <dl className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric._id}>
                  <dd className="text-4xl font-light text-[#00337C]">
                    {Number(metric.value).toLocaleString()}
                    {metric.suffix}
                  </dd>
                  <dt className="mt-2 font-semibold text-gray-900">{metric.label}</dt>
                  {metric.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">{metric.description}</p>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <SectionHeader
            eyebrow="How impact is created"
            title="Progress is documented across the BYBS ecosystem"
            description="Numbers provide scale. Programme records, photographs, participant accounts, and outcomes provide the context behind them."
          />
          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {evidenceAreas.map((area) => (
              <article key={area.title}>
                {createElement(area.icon, { className: "h-7 w-7 text-[#00337C]" })}
                <h2 className="mt-5 text-xl font-semibold text-[#00337C]">{area.title}</h2>
                <p className="public-copy mt-3 text-sm">{area.description}</p>
                <Link
                  to={area.to}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="impact-stories" className="public-section scroll-mt-24 bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Impact stories"
            title="The people and actions behind the progress"
            description="Only stories reviewed and published by the BYBS team appear here."
          />
          {loading ? (
            <LoadingState label="Loading impact stories" />
          ) : !featuredStory ? (
            <div className="mt-10">
              <EmptyState
                title="Verified impact stories are being prepared"
                message="The team can publish the first story from the Impact area in the admin dashboard when its facts, images, and permissions are ready."
              />
            </div>
          ) : (
            <>
              <article className="mt-12 grid gap-10 border-y border-gray-200 py-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={featuredStory.coverImage.url}
                    alt={featuredStory.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase text-[#B96500]">
                    Featured {typeLabels[featuredStory.contentType] || "impact story"}
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-4">
                    {featuredStory.title}
                  </h2>
                  <div className="mt-5">
                    <StoryMeta story={featuredStory} />
                  </div>
                  <p className="public-copy mt-5 text-lg">{featuredStory.summary}</p>
                  {featuredStory.quote?.text && (
                    <blockquote className="mt-6 text-lg italic leading-8 text-gray-700">
                      “{featuredStory.quote.text}”
                      {featuredStory.quote.attribution && (
                        <footer className="mt-2 text-sm not-italic text-gray-500">
                          {featuredStory.quote.attribution}
                        </footer>
                      )}
                    </blockquote>
                  )}
                  <Link
                    to={`/impact/${featuredStory.slug}`}
                    className="public-button-primary mt-7 px-6 py-3"
                  >
                    Read the full story <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
              {recentStories.length > 0 && (
                <div className="mt-14">
                  <h2 className="text-2xl font-semibold text-[#00337C]">
                    Recent initiatives and stories
                  </h2>
                  <div className="mt-7 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {recentStories.map((story) => (
                      <StoryCard key={story._id} story={story} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <CTASection
        eyebrow="Help the work grow"
        title="Contribute time, expertise, partnership, or practical support."
        actions={[
          { label: "Get involved", to: "/get-involved" },
          { label: "Support BYBS", to: "/support" },
        ]}
      />
    </div>
  );
}
