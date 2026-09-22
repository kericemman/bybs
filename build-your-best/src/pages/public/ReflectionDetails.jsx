import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Quote, UsersRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import SEO from "../../components/SEO";
import SectionHeader from "../../components/public/SectionHeader";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import { fetchReflection, fetchPublishedReflections } from "../../api/reflection.api";
import { absoluteUrl } from "../../lib/seo";

export default function ReflectionDetails() {
  const { slug } = useParams();
  const [prompt, setPrompt] = useState(null);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchReflection(slug), fetchPublishedReflections(slug)])
      .then(([promptResponse, voicesResponse]) => {
        if (!mounted) return;
        setPrompt(promptResponse.data);
        setVoices(voicesResponse.data || []);
      })
      .catch(() => mounted && setPrompt(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  const featured = useMemo(
    () => voices.find((voice) => voice.status === "featured") || voices[0],
    [voices]
  );
  const remaining = useMemo(
    () => voices.filter((voice) => voice._id !== featured?._id),
    [voices, featured]
  );

  if (loading)
    return (
      <div className="public-section">
        <div className="public-container">
          <LoadingState label="Loading reflection" />
        </div>
      </div>
    );
  if (!prompt)
    return (
      <div className="public-section">
        <div className="public-container">
          <EmptyState
            title="Reflection not found"
            message="This weekly reflection may not be public yet."
          />
          <Link to="/community/reflections" className="public-button-secondary mt-6 px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            Back to reflections
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <SEO
        title={`${prompt.title} | BYBS Weekly Reflection`}
        description={prompt.description || prompt.question}
        canonical={absoluteUrl(`/community/reflections/${prompt.slug}`)}
        image={prompt.featuredImage?.url}
      />
      <header className="bg-[#07111F] text-white">
        <div className="public-container grid min-h-[30rem] gap-10 py-5 md:py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-15">
          <div>
            <Link
              to="/community/reflections"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Weekly Reflections
            </Link>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-[#FFD166]">
              <CalendarDays className="h-4 w-4" />
              {prompt.weekLabel}
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mt-5 font-light leading-tight">
              {prompt.question}
            </h1>
            {prompt.description && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{prompt.description}</p>
            )}
            <div className="mt-8">
              {prompt.canSubmit ? (
                <Link
                  to={`/community/reflections/submit?prompt=${prompt.slug}`}
                  className="public-button-accent px-6 py-3"
                >
                  Share your reflection <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex rounded-lg border border-white/20 px-5 py-3 text-sm text-white/70">
                  This reflection is closed for submissions
                </span>
              )}
            </div>
          </div>
          {prompt.featuredImage?.url && (
            <img
              src={prompt.featuredImage.url}
              alt={prompt.title}
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          )}
        </div>
      </header>

      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Featured Reflections"
            title="Perspectives shared by the community"
            description="Every voice below was reviewed and published with consent. Featured means selected for this conversation, not judged as better than another response."
          />
          {!featured ? (
            <div className="mt-10">
              <EmptyState
                title="Selected responses will appear here"
                message="The BYBS team is reviewing submissions with care before anything is shared publicly."
              />
            </div>
          ) : (
            <>
              <article className="mt-12 grid gap-8 border-y border-gray-200 py-10 md:grid-cols-[auto_1fr]">
                {featured.profilePhoto?.url ? (
                  <img
                    src={featured.profilePhoto.url}
                    alt={featured.displayName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F1F5F9] text-[#00337C]">
                    <UsersRound className="h-9 w-9" />
                  </div>
                )}
                <div>
                  <Quote className="h-8 w-8 text-[#D67A00]" />
                  <p className="mt-5 whitespace-pre-line text-xl font-light leading-9 text-gray-800 md:text-2xl">
                    {featured.reflection}
                  </p>
                  <p className="mt-6 font-semibold text-[#00337C]">{featured.displayName}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {[featured.relationship, featured.city, featured.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {featured.socialProfile && (
                    <a
                      href={featured.socialProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[#00337C]"
                    >
                      View profile
                    </a>
                  )}
                </div>
              </article>
              {remaining.length > 0 && (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {remaining.map((voice) => (
                    <article
                      key={voice._id}
                      className="rounded-lg border border-gray-200 p-6 md:p-8"
                    >
                      <p className="whitespace-pre-line leading-7 text-gray-700">
                        {voice.reflection}
                      </p>
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        <p className="font-semibold text-[#00337C]">{voice.displayName}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {[voice.relationship, voice.country].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
