import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import CTASection from "../../components/public/CTASection";
import { LoadingState } from "../../components/public/ContentState";
import {
  fetchCommunityAction,
  fetchPublishedCommunityActions,
} from "../../api/communityAction.api";
import { absoluteUrl } from "../../lib/seo";

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

function ListSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="border-t border-gray-200 pt-7">
      <h2 className="text-xl font-semibold text-[#00337C]">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3 leading-7 text-gray-700">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D67A00]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ImpactDetails() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    Promise.allSettled([fetchCommunityAction(slug), fetchPublishedCommunityActions(12)])
      .then(([storyResult, storiesResult]) => {
        if (!active) return;
        if (storyResult.status === "fulfilled") setStory(storyResult.value.data);
        else setNotFound(storyResult.reason?.response?.status === 404);
        if (storiesResult.status === "fulfilled") setAllStories(storiesResult.value.data || []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  const related = useMemo(
    () => allStories.filter((item) => item._id !== story?._id).slice(0, 3),
    [allStories, story]
  );
  if (loading)
    return (
      <div className="public-section">
        <LoadingState label="Loading impact story" />
      </div>
    );
  if (notFound || !story)
    return (
      <div className="public-section">
        <div className="public-container max-w-2xl text-center">
          <p className="public-eyebrow">Impact story</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
            This story is not available
          </h1>
          <p className="public-copy mt-5">
            It may still be under review or may no longer be published.
          </p>
          <Link to="/impact" className="public-button-primary mt-7 px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            Return to impact
          </Link>
        </div>
      </div>
    );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.metaDescription || story.summary,
    image: story.coverImage?.url,
    datePublished: story.publishedAt || story.actionDate,
    dateModified: story.updatedAt,
    author: { "@type": "Organization", name: "Build Your Best Self" },
    publisher: { "@type": "Organization", name: "Build Your Best Self" },
    mainEntityOfPage: absoluteUrl(`/impact/${story.slug}`),
  };
  const cta = story.ctaUrl ? (
    story.ctaUrl.startsWith("http") ? (
      <a
        href={story.ctaUrl}
        target="_blank"
        rel="noreferrer"
        className="public-button-primary px-6 py-3"
      >
        {story.ctaLabel || "Take action"}
        <ArrowRight className="h-4 w-4" />
      </a>
    ) : (
      <Link to={story.ctaUrl} className="public-button-primary px-6 py-3">
        {story.ctaLabel || "Take action"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )
  ) : null;

  return (
    <div>
      <SEO
        title={story.seoTitle || `${story.title} | BYBS Impact`}
        description={story.metaDescription || story.summary}
        canonical={absoluteUrl(`/impact/${story.slug}`)}
        image={story.coverImage?.url}
        type="article"
        schema={schema}
      />
      <header className="bg-[#07111F] text-white">
        <div className="public-container grid min-h-[34rem] gap-10 py-5 md:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-15">
          <div>
            <Link
              to="/impact"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All impact stories
            </Link>
            <p className="mt-7 text-sm font-semibold uppercase text-[#FFD166]">
              {typeLabels[story.contentType] || "Impact story"}
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-light leading-[1.08]">
              {story.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">{story.summary}</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/70">
              {story.actionDate && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#FFD166]" />
                  {formatDate(story.actionDate)}
                </span>
              )}
              {story.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FFD166]" />
                  {story.location}
                </span>
              )}
              {Number.isFinite(story.participantCount) && (
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#FFD166]" />
                  {story.participantCount.toLocaleString()} participants
                </span>
              )}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white/5">
            <img
              src={story.coverImage.url}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="public-section bg-white">
        <div className="public-container grid gap-12 lg:grid-cols-[1fr_19rem] lg:items-start">
          <article className="max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-9 text-gray-700">
              {story.story || story.whatHappened}
            </p>
            {story.story && story.whatHappened && (
              <section className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-[#00337C]">What happened</h2>
                <p className="public-copy mt-4 whitespace-pre-line">{story.whatHappened}</p>
              </section>
            )}
            {story.whyItMattered && (
              <section className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-[#00337C]">Why it mattered</h2>
                <p className="public-copy mt-4 whitespace-pre-line">{story.whyItMattered}</p>
              </section>
            )}
            {story.quote?.text && (
              <blockquote className="my-10 text-2xl font-light italic leading-10 text-[#00337C]">
                “{story.quote.text}”
                {story.quote.attribution && (
                  <footer className="mt-3 text-sm font-normal not-italic text-gray-500">
                    {story.quote.attribution}
                  </footer>
                )}
              </blockquote>
            )}
            <ListSection title="Outcomes" items={story.outcomes} />
            <ListSection title="Resources contributed" items={story.resourcesContributed} />
            {cta && <div className="mt-10">{cta}</div>}
          </article>
          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-lg bg-[#F7F9FC] p-6">
              <h2 className="font-semibold text-[#00337C]">Story details</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-gray-900">Related programme</dt>
                  <dd className="mt-1 text-gray-600">
                    {story.relatedProgramme || "BYBS community"}
                  </dd>
                </div>
                {story.participantsDescription && (
                  <div>
                    <dt className="font-semibold text-gray-900">Participants</dt>
                    <dd className="mt-1 leading-6 text-gray-600">
                      {story.participantsDescription}
                    </dd>
                  </div>
                )}
                {story.beneficiaries && (
                  <div>
                    <dt className="font-semibold text-gray-900">Who benefited</dt>
                    <dd className="mt-1 leading-6 text-gray-600">
                      {Number.isFinite(story.beneficiaryCount)
                        ? `${story.beneficiaryCount.toLocaleString()} - `
                        : ""}
                      {story.beneficiaries}
                    </dd>
                  </div>
                )}
                {story.partners?.length > 0 && (
                  <div>
                    <dt className="font-semibold text-gray-900">Partners</dt>
                    <dd className="mt-1 leading-6 text-gray-600">{story.partners.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </main>

      {story.gallery?.length > 0 && (
        <section className="public-section bg-[#F7F9FC]">
          <div className="public-container">
            <p className="public-eyebrow">Story gallery</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
              Moments from the work
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
              {story.gallery.map((image, index) => (
                <figure
                  key={image._id || image.url}
                  className={index === 0 ? "col-span-2 row-span-2" : ""}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `${story.title}, image ${index + 1}`}
                    loading="lazy"
                    className="aspect-square h-full w-full rounded-lg object-cover"
                  />
                  {image.caption && (
                    <figcaption className="mt-2 text-sm text-gray-500">{image.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="public-section bg-white">
          <div className="public-container">
            <h2 className="text-3xl font-semibold text-[#00337C]">Related impact stories</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/impact/${item.slug}`}
                  className="group border-t border-gray-200 pt-5"
                >
                  <img
                    src={item.coverImage.url}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full rounded-lg object-cover"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-[#00337C]">{item.title}</h3>
                  <p className="public-copy mt-2 line-clamp-2 text-sm">{item.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00337C]">
                    Read story <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTASection
        eyebrow="Continue the impact"
        title="Help BYBS turn growth into practical opportunity and service."
        actions={[
          { label: "Get involved", to: "/get-involved" },
          { label: "Support BYBS", to: "/support" },
        ]}
      />
    </div>
  );
}
