import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, Quote, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "../../components/public/PageHero";
import SectionHeader from "../../components/public/SectionHeader";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import {
  fetchActiveReflection,
  fetchPublicReflections,
  fetchPublishedReflections,
} from "../../api/reflection.api";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export default function Reflections() {
  const [activePrompt, setActivePrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadReflections = async () => {
      try {
        const [activeResult, promptsResult] = await Promise.allSettled([
          fetchActiveReflection(),
          fetchPublicReflections(),
        ]);
        if (!mounted) return;

        const active = activeResult.status === "fulfilled" ? activeResult.value.data || null : null;
        const publicPrompts =
          promptsResult.status === "fulfilled" ? promptsResult.value.data || [] : [];
        setActivePrompt(active);
        setPrompts(publicPrompts);

        if (active?.slug) {
          try {
            const { data } = await fetchPublishedReflections(active.slug);
            if (mounted) setVoices(data || []);
          } catch {
            if (mounted) setVoices([]);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadReflections();
    return () => {
      mounted = false;
    };
  }, []);

  const previousPrompts = useMemo(
    () => prompts.filter((prompt) => prompt.slug !== activePrompt?.slug),
    [prompts, activePrompt]
  );
  const featuredVoice = voices.find((voice) => voice.status === "featured") || voices[0];
  const otherVoices = voices.filter((voice) => voice._id !== featuredVoice?._id).slice(0, 5);

  return (
    <div>
      <PageHero
        eyebrow="BYBS Weekly Reflection"
        title="One honest question. Many lived perspectives."
        description="Weekly Reflection creates room to pause, put experience into words, and learn from the voices within and around the BYBS community."
        image={{
          src: activePrompt?.featuredImage?.url || "/assets/c4.jpeg",
          alt: "BYBS community reflection",
        }}
        primaryAction={
          activePrompt?.canSubmit
            ? {
                label: "Share your reflection",
                to: `/community/reflections/submit?prompt=${activePrompt.slug}`,
              }
            : { label: "Explore the community", to: "/community" }
        }
        secondaryAction={{ label: "Read BYBS Insights", to: "/insights" }}
      />

      <section className="public-section bg-white">
        <div className="public-container">
          {loading ? (
            <LoadingState label="Loading this week's reflection" />
          ) : activePrompt ? (
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div>
                <p className="public-eyebrow">This week's prompt</p>
                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <p className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#B96500]" />
                    {activePrompt.weekLabel}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#B96500]" />
                    {activePrompt.canSubmit
                      ? `Closes ${formatDate(activePrompt.closesAt)}`
                      : `Opens ${formatDate(activePrompt.opensAt)}`}
                  </p>
                </div>
              </div>
              <article>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-[#00337C]">
                  {activePrompt.question}
                </h1>
                {activePrompt.description && (
                  <p className="public-copy mt-5 text-lg">{activePrompt.description}</p>
                )}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {activePrompt.canSubmit && (
                    <Link
                      to={`/community/reflections/submit?prompt=${activePrompt.slug}`}
                      className="public-button-primary px-6 py-3"
                    >
                      Share your reflection <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {!activePrompt.canSubmit && (
                    <p className="self-center text-sm font-semibold text-[#B96500]">
                      Sharing opens {formatDate(activePrompt.opensAt)}
                    </p>
                  )}
                  <Link
                    to={`/community/reflections/${activePrompt.slug}`}
                    className="public-button-secondary px-6 py-3"
                  >
                    View this week
                  </Link>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Every submission is reviewed. Nothing is published automatically, and you can
                  choose to appear anonymously.
                </p>
              </article>
            </div>
          ) : (
            <EmptyState
              title="The next weekly prompt is being prepared"
              message="Return soon for a new question and selected reflections from the BYBS community."
            />
          )}
        </div>
      </section>

      {featuredVoice && (
        <section className="public-section bg-[#F7F9FC]">
          <div className="public-container">
            <SectionHeader
              eyebrow="Featured Reflections"
              title="A community voice from this week"
              description="Selected for its honesty and perspective, not as a competition or ranking."
            />
            <article className="mt-10 grid gap-8 border-y border-gray-200 py-9 md:grid-cols-[auto_1fr] md:items-start">
              {featuredVoice.profilePhoto?.url ? (
                <img
                  src={featuredVoice.profilePhoto.url}
                  alt={featuredVoice.displayName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00337C] text-white">
                  <UsersRound className="h-8 w-8" />
                </div>
              )}
              <div>
                <Quote className="h-7 w-7 text-[#D67A00]" />
                <p className="mt-4 text-xl font-light leading-8 text-gray-800 md:text-2xl">
                  {featuredVoice.reflection}
                </p>
                <p className="mt-5 font-semibold text-[#00337C]">{featuredVoice.displayName}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {[featuredVoice.relationship, featuredVoice.city, featuredVoice.country]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </article>
            {otherVoices.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {otherVoices.map((voice) => (
                  <article
                    key={voice._id}
                    className="rounded-lg border border-gray-200 bg-white p-6"
                  >
                    <p className="line-clamp-5 leading-7 text-gray-700">{voice.reflection}</p>
                    <p className="mt-5 text-sm font-semibold text-[#00337C]">{voice.displayName}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Previous weeks"
            title="Return to earlier questions and community perspectives"
          />
          {previousPrompts.length ? (
            <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
              {previousPrompts.map((prompt) => (
                <Link
                  key={prompt._id}
                  to={`/community/reflections/${prompt.slug}`}
                  className="group grid gap-4 py-6 md:grid-cols-[12rem_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#B96500]">{prompt.weekLabel}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(prompt.reflectionDate)}
                    </p>
                  </div>
                  <h2 className="text-xl font-semibold leading-7 text-[#00337C]">
                    {prompt.question}
                  </h2>
                  <ArrowRight className="h-5 w-5 text-[#00337C] transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="No previous reflections yet"
                message="Earlier weekly prompts will build into a public archive here."
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
