import { createElement, useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock3,
  HandHeart,
  HeartHandshake,
  UsersRound,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { fetchPublishedArticles } from "../../api/pubclicArticle.api";
import { fetchFeaturedCommunityAction } from "../../api/communityAction.api";
import { fetchActiveReflection } from "../../api/reflection.api";
import { fetchImpactMetrics } from "../../api/impact.api";
import SectionHeader from "../public/SectionHeader";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const readingTime = (content = "") =>
  `${Math.max(1, Math.ceil(stripHtml(content).split(/\s+/).filter(Boolean).length / 200))} min read`;

export function ImpactProof() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    let active = true;
    fetchImpactMetrics()
      .then(({ data }) => active && setMetrics((data || []).slice(0, 4)))
      .catch(() => active && setMetrics([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-y border-gray-200 bg-[#F7F9FC]">
      <div className="public-container py-5 md:py-10 lg:py-15">
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Impact with evidence</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#00337C] md:text-3xl">
              Real stories, cohort journeys, and community action
            </h2>
          </div>
          <div className="md:text-right">
            <Link to="/impact" className="public-button-secondary px-6 py-3">
              Explore our impact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {metrics.length > 0 && (
          <dl className="mt-8 grid gap-5 border-t border-gray-200 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric._id}>
                <dd className="text-3xl font-light text-[#00337C]">
                  {Number(metric.value).toLocaleString()}
                  {metric.suffix}
                </dd>
                <dt className="mt-1 text-sm font-semibold text-gray-800">{metric.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

export function FeaturedImpact() {
  const [action, setAction] = useState(null);

  useEffect(() => {
    let active = true;
    fetchFeaturedCommunityAction()
      .then(({ data }) => active && setAction(data || null))
      .catch(() => active && setAction(null));
    return () => {
      active = false;
    };
  }, []);

  if (!action) return null;

  return (
    <section className="public-section bg-[#F7F9FC]">
      <div className="public-container grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <img
          src={action.coverImage.url}
          alt={action.title}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />
        <div>
          <p className="public-eyebrow mb-5">Recent Community Program</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading">{action.title}</h2>
          <p className="public-copy mt-5 text-lg">{action.summary}</p>
          {(action.actionDate || action.location) && (
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
              {action.actionDate && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#B96500]" />
                  {new Date(action.actionDate).toLocaleDateString()}
                </span>
              )}
              {action.location && <span>{action.location}</span>}
            </div>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to={`/impact/${action.slug}`} className="public-button-primary px-6 py-3">
              Read impact story <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/impact" className="public-button-secondary px-6 py-3">
              More impact stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommunityPreview() {
  const items = [
    ["Fellowship alumni", "Continue learning and contribute after a cohort.", UsersRound],
    [
      "Weekly Reflection",
      "Pause, share what you are learning, and hear community voices.",
      BookOpenText,
    ],
    ["Mentorship", "Learn with people willing to share experience and encouragement.", Waypoints],
    ["Outreach", "Turn personal growth into practical service.", HandHeart],
  ];
  return (
    <section className="public-section bg-white">
      <div className="public-container">
        <SectionHeader
          eyebrow="The BYBS community"
          title="Grow with a community that keeps showing up"
          description="Belonging continues beyond one programme, one conversation, or one season."
        />
        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, description, Icon]) => (
            <div key={title} className="border-t border-gray-200 pt-5">
              {createElement(Icon, { className: "h-6 w-6 text-[#D67A00]" })}
              <h3 className="mt-4 font-semibold text-[#00337C]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
        <Link to="/community" className="public-button-primary mt-9 px-6 py-3">
          Join the BYBS community <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function LatestInsights() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    let active = true;
    fetchPublishedArticles()
      .then(({ data }) => active && setArticles(data.slice(0, 3)))
      .catch(() => active && setArticles([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="public-section bg-[#F7F9FC]">
      <div className="public-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="BYBS Insights"
            title="Ideas for the work of becoming and contributing"
            description="Practical perspectives on personal growth, career, leadership, wellbeing, and community."
          />
          <Link to="/insights" className="public-button-secondary shrink-0 px-5 py-3">
            View all insights <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.map((article) => (
              <article key={article._id} className="group border-t border-gray-200 pt-5">
                <Link to={`/insights/${article.slug}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                    {article.coverImage?.url ? (
                      <img
                        src={article.coverImage.url}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#00337C]">
                        BYBS Insight
                      </div>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {readingTime(article.content)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-7 text-[#00337C]">
                    {article.title}
                  </h3>
                  <p className="public-copy mt-3 text-sm">
                    {stripHtml(article.excerpt || article.description || article.content).slice(
                      0,
                      145
                    )}
                    ...
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 border-y border-gray-200 py-8">
            <h3 className="font-semibold text-[#00337C]">BYBS Insights are coming soon.</h3>
            <p className="public-copy mt-2">
              Practical stories, reflections, and lessons from the BYBS community will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function WeeklyReflectionPreview() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    let active = true;
    fetchActiveReflection()
      .then(({ data }) => active && setPrompt(data || null))
      .catch(() => active && setPrompt(null));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="public-section bg-white">
      <div className="public-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="public-eyebrow mb-4">BYBS Weekly Reflection</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading">
            Make room to notice what is changing
          </h2>
        </div>
        <div>
          <p className="text-2xl font-light leading-9 text-[#00337C]">
            {prompt?.question || "A new community question will be shared here each week."}
          </p>
          <p className="public-copy mt-4">
            {prompt?.description ||
              "Community responses are reviewed before selected reflections are shared. The experience is designed for honesty, not competition."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {prompt?.canSubmit && (
              <Link
                to={`/community/reflections/submit?prompt=${prompt.slug}`}
                className="public-button-primary px-6 py-3"
              >
                Share your reflection <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/community/reflections"
              className={
                prompt?.canSubmit
                  ? "public-button-secondary px-6 py-3"
                  : "public-button-primary px-6 py-3"
              }
            >
              Explore Weekly Reflection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GetInvolvedPreview() {
  const paths = [
    ["Join", "Participate in programmes and community.", UsersRound, "/community"],
    ["Volunteer", "Contribute time, skills, or expertise.", HandHeart, "/get-involved/volunteer"],
    ["Partner", "Work with BYBS to expand impact.", Waypoints, "/get-involved/partner"],
    ["Support", "Contribute financial or practical resources.", HeartHandshake, "/support"],
  ];
  return (
    <section className="public-section bg-[#F7F9FC]">
      <div className="public-container">
        <SectionHeader
          eyebrow="Get involved"
          title="There is more than one way to be part of BYBS"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {paths.map(([title, description, Icon, to]) => (
            <Link
              key={title}
              to={to}
              className="group rounded-lg border border-gray-200 bg-white p-6 hover:border-[#00337C]/35"
            >
              {createElement(Icon, { className: "h-7 w-7 text-[#D67A00]" })}
              <h3 className="mt-5 text-xl font-semibold text-[#00337C]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
              <ArrowRight className="mt-5 h-4 w-4 text-[#00337C] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StayConnected() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await api.post("/subscribers", { email, source: "homepage" });
      setEmail("");
      setStatus({ type: "success", message: "You are now connected to BYBS updates." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Subscription could not be completed.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className="bg-[#E9EEF5] text-gray-900">
      <div className="public-container grid gap-8 py-5 md:py-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:py-15">
        <div>
          <p className="text-sm font-semibold uppercase text-[#B96500]">Stay connected with BYBS</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 font-light text-[#00337C]">
            Follow the insights, opportunities, and community work.
          </h2>
          <p className="mt-4 max-w-xl text-gray-600">
            Receive relevant updates from BYBS. You can unsubscribe from future messages.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="rounded-lg bg-white p-5 text-gray-900 shadow-[0_10px_30px_rgba(0,51,124,0.07)]"
        >
          <label htmlFor="home-email" className="block text-sm font-semibold text-gray-800">
            Email address
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id="home-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="min-h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-[#00337C]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="public-button-primary shrink-0 px-6 py-3 disabled:opacity-60"
            >
              {submitting ? "Joining..." : "Subscribe"}
            </button>
          </div>
          {status.message && (
            <p
              role="status"
              className={`mt-3 text-sm ${status.type === "success" ? "text-green-700" : "text-red-700"}`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
