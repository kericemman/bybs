/* eslint-disable no-unused-vars -- dynamic Lucide components are used in JSX below */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, HandHeart, Handshake, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import CTASection from "../../components/public/CTASection";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import { fetchPublishedCommunityActions } from "../../api/communityAction.api";
import { fetchImpactMetrics } from "../../api/impact.api";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
        new Date(value)
      )
    : "";

function StoryMeta({ story }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
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

function StoryCard({ story, label = "Completed initiative" }) {
  return (
    <article className="group border-t border-gray-200 pt-5">
      <Link to={`/impact/${story.slug}`}>
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
          <img
            src={story.coverImage?.url || "/assets/commu.jpg"}
            alt={story.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase text-[#B96500]">{label}</p>
        <h3 className="mt-2 text-xl font-semibold text-[#00337C]">{story.title}</h3>
        <div className="mt-3">
          <StoryMeta story={story} />
        </div>
        <p className="public-copy mt-3 line-clamp-3 text-sm">{story.summary}</p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]">
          Read the full impact story
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </article>
  );
}

export default function CommunityOutreach() {
  const [stories, setStories] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    Promise.allSettled([fetchPublishedCommunityActions(50), fetchImpactMetrics()])
      .then(([storyResult, metricResult]) => {
        if (!active) return;
        const published = storyResult.status === "fulfilled" ? storyResult.value.data || [] : [];
        setStories(published.filter((story) => story.contentType === "outreach"));
        setMetrics(
          metricResult.status === "fulfilled"
            ? (metricResult.value.data || []).filter((metric) =>
                ["community", "volunteer", "partner"].includes(metric.category)
              )
            : []
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const now = Date.now();
  const upcoming = useMemo(
    () => stories.filter((story) => story.actionDate && new Date(story.actionDate).getTime() > now),
    [stories, now]
  );
  const completed = useMemo(
    () =>
      stories.filter((story) => !story.actionDate || new Date(story.actionDate).getTime() <= now),
    [stories, now]
  );
  const featured = completed.find((story) => story.isFeatured) || completed[0] || null;
  const previous = completed.filter((story) => story._id !== featured?._id);
  const partners = useMemo(
    () => [...new Set(stories.flatMap((story) => story.partners || []))],
    [stories]
  );
  const gallery = useMemo(
    () =>
      stories
        .flatMap((story) =>
          [story.coverImage, ...(story.gallery || [])]
            .filter((image) => image?.url)
            .map((image) => ({ ...image, title: story.title }))
        )
        .slice(0, 8),
    [stories]
  );

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Community outreach"
        title="Personal growth becomes meaningful when it moves into service."
        description="BYBS works with volunteers, partners, and communities to respond to practical needs through care, learning, giving, and shared action."
        image={{ src: "/assets/commu.jpg", alt: "BYBS community outreach participants" }}
        primaryAction={{ label: "See published initiatives", to: "#initiatives" }}
        secondaryAction={{ label: "Volunteer with BYBS", to: "/get-involved/volunteer" }}
      />

      <section className="public-section bg-white">
        <div className="public-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeader
            eyebrow="Why service matters"
            title="Growth should strengthen the communities around us"
            description="Outreach is where reflection, empathy, and leadership become practical. BYBS approaches service through listening, responsible collaboration, and work that can be documented honestly."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Principle
              icon={HandHeart}
              title="Respond to real needs"
              text="Activities should begin with the people and context involved, not with assumptions about what help should look like."
            />
            <Principle
              icon={Handshake}
              title="Work in partnership"
              text="Local knowledge, trusted organisations, volunteers, and useful resources make action more relevant and sustainable."
            />
          </div>
        </div>
      </section>

      {metrics.length > 0 && (
        <section className="border-y border-gray-200 bg-[#F7F9FC]">
          <div className="public-container py-5 md:py-10 lg:py-15">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-[#B96500]">
                  Verified outreach figures
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#00337C]">
                  Evidence published by the BYBS team
                </h2>
              </div>
              <Link
                to="/impact"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
              >
                See all impact evidence
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <dl className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
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

      <section id="initiatives" className="public-section scroll-mt-24 bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Current and previous initiatives"
            title="Every completed initiative links to its evidence"
            description="Published stories provide the context behind an activity: what happened, who took part, who benefited, what partners contributed, and what outcomes were recorded."
          />
          {loading ? (
            <LoadingState label="Loading outreach initiatives" />
          ) : !featured ? (
            <div className="mt-10">
              <EmptyState
                title="Published outreach stories are being prepared"
                message="The team can publish a completed initiative from the Impact area in the admin dashboard when its facts, images, and permissions are ready."
              />
            </div>
          ) : (
            <>
              <article className="mt-12 grid gap-10 border-y border-gray-200 py-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={featured.coverImage?.url || "/assets/commu.jpg"}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase text-[#B96500]">
                    Featured completed initiative
                  </p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-4">
                    {featured.title}
                  </h2>
                  <div className="mt-5">
                    <StoryMeta story={featured} />
                  </div>
                  <p className="public-copy mt-5 text-lg">{featured.summary}</p>
                  <Link
                    to={`/impact/${featured.slug}`}
                    className="public-button-primary mt-7 px-6 py-3"
                  >
                    Read the impact story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
              {previous.length > 0 && (
                <div className="mt-14">
                  <h2 className="text-2xl font-semibold text-[#00337C]">Previous initiatives</h2>
                  <div className="mt-7 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {previous.map((story) => (
                      <StoryCard key={story._id} story={story} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <SectionHeader
            eyebrow="Upcoming outreach"
            title="Ways to participate in the next action"
            description="Future-dated outreach stories published by the BYBS team appear here. Volunteer only through the official opportunity link or BYBS contact channel."
          />
          {upcoming.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((story) => (
                <StoryCard key={story._id} story={story} label="Upcoming initiative" />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="No upcoming outreach has been announced"
                message="Volunteer with BYBS to share your availability, or check back after the next initiative is confirmed."
              />
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/get-involved/volunteer" className="public-button-primary px-6 py-3">
              Volunteer with BYBS
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/support" className="public-button-secondary px-6 py-3">
              Support an initiative
            </Link>
          </div>
        </div>
      </section>

      {(gallery.length > 0 || partners.length > 0) && (
        <section className="public-section bg-white">
          <div className="public-container">
            {gallery.length > 0 && (
              <>
                <SectionHeader eyebrow="Outreach gallery" title="The work, documented" />
                <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {gallery.map((image, index) => (
                    <figure
                      key={`${image.url}-${index}`}
                      className="overflow-hidden rounded-lg bg-gray-100"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || image.title}
                        loading="lazy"
                        className="aspect-square h-full w-full object-cover"
                      />
                    </figure>
                  ))}
                </div>
              </>
            )}
            {partners.length > 0 && (
              <div className="mt-14 border-y border-gray-200 py-8">
                <p className="text-sm font-semibold uppercase text-[#B96500]">
                  Published initiative partners
                </p>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                  {partners.map((partner) => (
                    <span key={partner} className="font-semibold text-gray-700">
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Volunteer stories"
              title="Contribution is part of the impact"
              description="Volunteer reflections and contributions are published in the wider Impact library when the team has reviewed them."
            />
            <Link
              to="/impact"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
            >
              Explore volunteer impact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <SectionHeader
              eyebrow="Partner with outreach"
              title="Bring local insight, expertise, access, or resources"
              description="Partnerships can support delivery, safeguarding, logistics, venues, professional services, essential items, documentation, or follow-through."
            />
            <Link
              to="/get-involved/partner?source=outreach"
              className="public-button-secondary mt-6 px-6 py-3"
            >
              Discuss a partnership
            </Link>
          </div>
        </div>
      </section>
      <CTASection
        eyebrow="Put growth into action"
        title="Contribute your time, skills, partnership, or practical support."
        actions={[
          { label: "Volunteer", to: "/get-involved/volunteer" },
          { label: "Support BYBS", to: "/support" },
        ]}
      />
    </div>
  );
}

function Principle({ icon: Icon, title, text }) {
  return (
    <article>
      <Icon className="h-7 w-7 text-[#00337C]" />
      <h2 className="mt-4 text-xl font-semibold text-[#00337C]">{title}</h2>
      <p className="public-copy mt-3 text-sm">{text}</p>
    </article>
  );
}
