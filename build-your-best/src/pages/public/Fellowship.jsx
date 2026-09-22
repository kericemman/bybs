/* eslint-disable no-unused-vars -- dynamic Lucide components are used in JSX below */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import WaitlistModal from "../../components/modal/WaitlistModal";
import SectionHeader from "../../components/public/SectionHeader";
import { EmptyState, LoadingState } from "../../components/public/ContentState";
import { fetchImpactMetrics } from "../../api/impact.api";
import { cohortAction, cohortStage, currentCohort, orderCohorts } from "../../lib/cohorts";

const pillars = [
  [
    "Self-awareness",
    "Understand the patterns, strengths, values, and experiences shaping how you live and decide.",
  ],
  [
    "Mindset and resilience",
    "Build a steadier relationship with challenge, uncertainty, confidence, and personal responsibility.",
  ],
  [
    "Purpose and direction",
    "Turn reflection into priorities, realistic goals, and choices aligned with the life you want to build.",
  ],
  [
    "Leadership and community",
    "Practise showing up with integrity, contributing to others, and learning alongside a supportive cohort.",
  ],
];

const faqs = [
  [
    "Is the Fellowship the same as private coaching?",
    "No. The Fellowship is a cohort experience with group learning, peer community, and programme mentorship. Private coaching is a separate paid one-to-one service.",
  ],
  [
    "How do I know when applications open?",
    "The current application status is published from the BYBS admin dashboard. You can also join the waitlist for the next application announcement.",
  ],
  [
    "Is the Fellowship online or in person?",
    "The format can change by cohort. Check the current cohort information below for its confirmed format, location, and schedule.",
  ],
  [
    "Where can I see earlier cohorts?",
    "The cohort archive contains published journeys, activities, mentors, outcomes, participant stories, and galleries from previous cohorts.",
  ],
];

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(value)
      )
    : "To be announced";

function ActionButton({ action, openWaitlist, dark = false }) {
  const className = dark ? "public-button-accent px-6 py-3.5" : "public-button-primary px-6 py-3.5";
  return action.type === "link" ? (
    <Link to={action.to} className={className}>
      {action.label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  ) : (
    <button type="button" onClick={openWaitlist} className={className}>
      {action.label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export default function FellowshipLanding() {
  const [cohorts, setCohorts] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    Promise.allSettled([api.get("/cohorts"), fetchImpactMetrics()])
      .then(([cohortResult, metricResult]) => {
        if (!active) return;
        setCohorts(cohortResult.status === "fulfilled" ? cohortResult.value.data || [] : []);
        setMetrics(
          metricResult.status === "fulfilled"
            ? (metricResult.value.data || []).filter((item) => item.category === "fellowship")
            : []
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const ordered = useMemo(() => orderCohorts(cohorts), [cohorts]);
  const activeCohort = useMemo(() => currentCohort(cohorts), [cohorts]);
  const stage = cohortStage(activeCohort);
  const displayedStage = loading
    ? { label: "Loading cohort status", tone: "bg-white/10 text-white" }
    : stage;
  const action = cohortAction(activeCohort);
  const previous = ordered
    .filter((cohort) => cohort._id !== activeCohort?._id && cohort.status === "completed")
    .slice(0, 3);
  const stories = ordered
    .flatMap((cohort) =>
      (cohort.successStories || []).map((story) => ({ story, cohort: cohort.title }))
    )
    .slice(0, 3);
  const learning = activeCohort?.curriculum?.length
    ? activeCohort.curriculum
    : activeCohort?.features || [];

  return (
    <div className="bg-white">
      <header className="bg-[#07111F] text-white">
        <div className="public-container grid min-h-[35rem] gap-10 py-5 md:py-10 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-15">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${displayedStage.tone}`}
            >
              {displayedStage.label}
            </span>
            <p className="mt-7 text-sm font-semibold uppercase text-[#FFD166]">BYBS Fellowship</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-light leading-[1.08]">
              A guided season of growth, reflection, and purposeful action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              The BYBS Fellowship brings people into a structured cohort where personal development
              is practised through learning, mentorship, reflection, and community.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionButton action={action} openWaitlist={() => setWaitlistOpen(true)} dark />
              <Link to="/programs/fellowship/cohorts" className="public-button-on-dark px-6 py-3.5">
                Explore cohort archive
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white/5">
            <img
              src={activeCohort?.coverImage?.url || "/assets/fell.jpg"}
              alt={activeCohort?.title || "BYBS Fellowship participants"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <section className="public-section bg-white">
        <div className="public-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="What it is"
            title="Development that moves from insight to everyday practice"
            description="The Fellowship is not a single event. It is a facilitated learning journey designed to help participants understand themselves, build useful inner skills, make intentional choices, and grow with others."
          />
          <div className="grid gap-8 sm:grid-cols-2">
            {pillars.map(([title, description], index) => (
              <article key={title}>
                <span className="text-sm font-semibold text-[#B96500]">0{index + 1}</span>
                <h2 className="mt-3 text-xl font-semibold text-[#00337C]">{title}</h2>
                <p className="public-copy mt-3 text-sm">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Who it is for"
                title="For people ready to participate, reflect, and practise"
              />
              <List
                items={
                  activeCohort?.whoIsItFor?.length
                    ? activeCohort.whoIsItFor
                    : [
                        "People seeking greater clarity about who they are and where they are going",
                        "People ready to examine patterns, strengthen resilience, and take responsibility for their growth",
                        "People willing to learn in community and contribute to a respectful cohort environment",
                      ]
                }
              />
            </div>
            <div>
              <SectionHeader
                eyebrow="What participants learn"
                title="A curriculum shaped around the current cohort"
              />
              {loading ? (
                <LoadingState label="Loading cohort learning" />
              ) : learning.length ? (
                <List items={learning} />
              ) : (
                <p className="public-copy mt-7">
                  The detailed learning plan will appear here when the next cohort is published.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container">
          <SectionHeader
            eyebrow="Format and status"
            title="One published record keeps every Fellowship update consistent"
            description="Dates, schedule, format, application availability, mentors, and cohort details below come from the same record managed by the BYBS team."
          />
          {loading ? (
            <LoadingState label="Loading current cohort" />
          ) : activeCohort ? (
            <article className="mt-10 grid gap-8 border-y border-gray-200 py-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${stage.tone}`}>
                    {stage.label}
                  </span>
                  <span className="text-sm text-gray-500">{activeCohort.title}</span>
                </div>
                <h2 className="mt-4 text-3xl font-light text-[#00337C]">
                  {activeCohort.tagline || activeCohort.title}
                </h2>
                <p className="public-copy mt-4 max-w-3xl">
                  {activeCohort.description || activeCohort.overview}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700">
                  <Meta
                    icon={CalendarDays}
                    text={`${formatDate(activeCohort.startDate)} - ${formatDate(activeCohort.endDate)}`}
                  />
                  <Meta icon={Clock} text={activeCohort.schedule || "Schedule to be announced"} />
                  <Meta
                    icon={MapPin}
                    text={
                      [activeCohort.format, activeCohort.location].filter(Boolean).join(" / ") ||
                      "Format to be announced"
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <ActionButton action={action} openWaitlist={() => setWaitlistOpen(true)} />
                <Link
                  className="public-button-secondary px-6 py-3"
                  to={`/programs/fellowship/cohorts/${activeCohort.slug}`}
                >
                  View cohort details
                </Link>
              </div>
            </article>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="The next cohort is being prepared"
                message="Join the waitlist to receive the next confirmed application announcement."
              />
            </div>
          )}
        </div>
      </section>

      {(activeCohort?.facilitators?.length > 0 || stories.length > 0) && (
        <section className="public-section bg-[#F7F9FC]">
          <div className="public-container space-y-14">
            {activeCohort?.facilitators?.length > 0 && (
              <div className="max-w-3xl">
                <SectionHeader
                  eyebrow="Mentors and facilitators"
                  title="People guiding the current journey"
                />
                <div className="mt-7 divide-y divide-gray-200 border-y border-gray-200">
                  {activeCohort.facilitators.map((name) => (
                    <div key={name} className="flex items-center gap-4 py-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00337C] text-sm font-semibold text-white">
                        {name.charAt(0)}
                      </span>
                      <span className="font-semibold text-gray-900">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {stories.length > 0 && (
              <div>
                <SectionHeader
                  eyebrow="Participant stories"
                  title="Reflections from Fellowship journeys"
                />
                <ParticipantStories stories={stories} />
              </div>
            )}
          </div>
        </section>
      )}

      {metrics.length > 0 && (
        <section className="border-y border-gray-200 bg-white">
          <div className="public-container py-5 md:py-10 lg:py-15">
            <p className="text-sm font-semibold uppercase text-[#B96500]">
              Verified Fellowship outcomes
            </p>
            <dl className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric._id}
                  className="border-l border-[#00337C]/10 pl-5 shadow-[-3px_0_8px_rgba(0,51,124,0.05)]"
                >
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

      <section className="public-section bg-white">
        <div className="public-container">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Cohort archive"
              title="The Fellowship journey over time"
              description="Each published cohort preserves its learning, people, activities, outcomes, stories, and photographs."
            />
            <Link
              to="/programs/fellowship/cohorts"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#00337C]"
            >
              View all cohorts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {previous.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {previous.map((cohort) => (
                <Link
                  key={cohort._id}
                  to={`/programs/fellowship/cohorts/${cohort.slug}`}
                  className="group border-t border-gray-200 pt-5"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={cohort.coverImage?.url || "/assets/fell.jpg"}
                      alt={cohort.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase text-[#B96500]">
                    {cohort.startDate
                      ? new Date(cohort.startDate).getFullYear()
                      : "Cohort reflection"}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#00337C]">{cohort.title}</h3>
                  <p className="public-copy mt-3 line-clamp-3 text-sm">
                    {cohort.tagline || cohort.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="Published cohort reflections will appear here"
                message="Previous cohorts can be added and published from the admin dashboard."
              />
            </div>
          )}
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeader
            eyebrow="Frequently asked questions"
            title="What to know before you apply"
          />
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#00337C]">
                  <span>{question}</span>
                  <span className="text-xl font-light group-open:rotate-45">+</span>
                </summary>
                <p className="public-copy mt-3 max-w-3xl pr-10">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E9EEF5] text-gray-900">
        <div className="public-container grid gap-8 py-5 md:py-10 lg:py-15 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Your next step</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 font-light text-[#00337C]">
              Follow the current cohort status.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Apply when applications are open. At every other stage, join the waitlist or explore
              the cohort record.
            </p>
          </div>
          <ActionButton action={action} openWaitlist={() => setWaitlistOpen(true)} />
        </div>
      </section>
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="mt-7 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7 text-gray-700">
          <Check className="mt-1 h-5 w-5 flex-none text-[#B96500]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
function Meta({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#B96500]" />
      {text}
    </span>
  );
}

function ParticipantStories({ stories }) {
  const sliderRef = useRef(null);
  const [activeStory, setActiveStory] = useState(0);

  const scrollToStory = (index) => {
    const slider = sliderRef.current;
    const story = slider?.children[index];
    if (!slider || !story) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slider.scrollTo({
      left: story.offsetLeft - slider.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveStory(index);
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider || window.innerWidth >= 1024) return;

    const closestIndex = Array.from(slider.children).reduce(
      (closest, story, index) => {
        const distance = Math.abs(story.offsetLeft - slider.offsetLeft - slider.scrollLeft);
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    ).index;

    setActiveStory(closestIndex);
  };

  const moveStory = (direction) => {
    const nextIndex = (activeStory + direction + stories.length) % stories.length;
    scrollToStory(nextIndex);
  };

  return (
    <div className="mt-8">
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
      >
        {stories.map(({ story, cohort }) => (
          <blockquote
            key={`${cohort}-${story}`}
            className="flex min-w-full snap-start flex-col rounded-lg bg-white p-6 shadow-[0_10px_30px_rgba(0,51,124,0.07)] lg:min-w-0"
          >
            <Quote aria-hidden="true" className="h-5 w-5 text-[#B96500]" />
            <p className="mt-4 flex-1 leading-7 text-gray-700">{story}</p>
            <footer className="mt-5 text-sm font-semibold text-[#00337C]">{cohort}</footer>
          </blockquote>
        ))}
      </div>

      {stories.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => moveStory(-1)}
            aria-label="Show previous participant story"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#00337C] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00337C]"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <div
            className="flex items-center gap-3"
            aria-label={`Participant story ${activeStory + 1} of ${stories.length}`}
          >
            {stories.map(({ story, cohort }, index) => (
              <button
                key={`${cohort}-${story}-control`}
                type="button"
                onClick={() => scrollToStory(index)}
                aria-label={`Show participant story ${index + 1}`}
                aria-current={activeStory === index ? "true" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00337C]"
              >
                <span
                  className={`h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none ${activeStory === index ? "w-6 bg-[#00337C]" : "w-2 bg-[#00337C]/25"}`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => moveStory(1)}
            aria-label="Show next participant story"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#00337C] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00337C]"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
