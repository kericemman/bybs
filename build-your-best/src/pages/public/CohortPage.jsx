import { motion as Motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/axios";
import SEO from "../../components/SEO";
import { absoluteUrl, breadcrumbSchema, truncate } from "../../lib/seo";
import { cohortStage, orderCohorts } from "../../lib/cohorts";
import BrandLoader from "../../components/public/BrandLoader";

const formatDate = (value) => {
  if (!value) return "Date to be announced";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return "Dates to be announced";
  if (startDate && !endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const statusStyles = {
  upcoming: "bg-amber-50 text-amber-700",
  ongoing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const applicationStyles = {
  "opening-soon": "bg-amber-50 text-amber-800",
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
  "invite-only": "bg-purple-50 text-purple-700",
};

const applicationLabel = (status) =>
  ({
    "opening-soon": "Applications opening soon",
    open: "Applications open",
    closed: "Applications closed",
    "invite-only": "Applications by invitation",
  })[status] || "Applications closed";

export default function CohortsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/cohorts");
      const incoming = Array.isArray(data) ? data : [];
      setCohorts(incoming);
    } catch (fetchError) {
      console.error("Error fetching cohorts:", fetchError);
      setError(fetchError.response?.data?.message || "Unable to load cohorts right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCohorts();
  }, []);

  const orderedCohorts = useMemo(() => orderCohorts(cohorts), [cohorts]);
  const heroCohort =
    orderedCohorts.find((cohort) => cohort.coverImage?.url) || orderedCohorts[0] || null;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#061C3D] text-white">
        <div className="absolute inset-0">
          {heroCohort?.coverImage?.url && (
            <img
              src={heroCohort.coverImage.url}
              alt={heroCohort.title}
              className="h-full w-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-[#061C3D] via-[#00337C]/96 to-[#1E4B9E]/86" />
        </div>

        <div className="relative public-container py-5 md:py-10 lg:py-15">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="public-eyebrow mb-5 text-white/70">BYBS Cohorts</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
              Preview the journey of every BYBS cohort.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Browse cohort reflections, achievements, graduate stories, and galleries. Open each
              cohort to see the full journey.
            </p>
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-[#F7FAFC]">
        <div className="public-container">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchCohorts} />
          ) : cohorts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {orderedCohorts.map((cohort) => (
                <CohortPreviewCard key={cohort._id} cohort={cohort} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function CohortDetailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { cohortSlug } = useParams();
  const [cohort, setCohort] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const fetchCohort = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`/cohorts/${cohortSlug}`);
      setCohort(data);
    } catch (fetchError) {
      console.error("Error fetching cohort:", fetchError);
      setError(fetchError.response?.data?.message || "Unable to load this cohort right now.");
    } finally {
      setLoading(false);
    }
  }, [cohortSlug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCohort();
  }, [fetchCohort]);

  const galleryImages = useMemo(() => {
    if (!cohort) return [];
    const gallery = cohort.gallery || [];
    if (gallery.length) return gallery;
    if (cohort.coverImage?.url) {
      return [
        {
          _id: `${cohort._id}-cover`,
          url: cohort.coverImage.url,
          caption: cohort.title,
        },
      ];
    }
    return [];
  }, [cohort]);

  useEffect(() => {
    setCurrentImage(0);
  }, [cohort?._id]);

  useEffect(() => {
    if (!isAutoPlaying || galleryImages.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % galleryImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [galleryImages.length, isAutoPlaying]);

  const nextImage = () => {
    if (!galleryImages.length) return;
    setCurrentImage((current) => (current + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (!galleryImages.length) return;
    setCurrentImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const onTouchStart = (event) => {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  };

  const onTouchMove = (event) => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
  };

  const cohortUrl = absoluteUrl(`/programs/fellowship/cohorts/${cohort?.slug || cohortSlug}`);
  const cohortDescription = truncate(
    cohort?.tagline ||
      cohort?.overview ||
      cohort?.description ||
      "Explore this BYBS cohort reflection, achievements, stories, and gallery.",
    155
  );
  const cohortSchema = cohort
    ? [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: cohort.title,
          description: cohortDescription,
          url: cohortUrl,
          image: cohort.coverImage?.url,
          about: {
            "@type": "EducationalOrganization",
            name: "Build Your Best Self",
            url: absoluteUrl("/"),
          },
        },
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Cohorts", path: "/programs/fellowship/cohorts" },
          { name: cohort.title, path: `/programs/fellowship/cohorts/${cohort.slug || cohortSlug}` },
        ]),
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={cohort ? `${cohort.title} | BYBS Cohorts` : "BYBS Cohort | Build Your Best Self"}
        description={cohortDescription}
        canonical={cohortUrl}
        image={cohort?.coverImage?.url}
        noindex={Boolean(error) && !cohort}
        schema={cohortSchema}
      />
      <section className="relative overflow-hidden bg-[#061C3D] text-white">
        <div className="absolute inset-0">
          {cohort?.coverImage?.url && (
            <img
              src={cohort.coverImage.url}
              alt={cohort.title}
              className="h-full w-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-[#061C3D] via-[#00337C]/96 to-[#1E4B9E]/86" />
        </div>

        <div className="relative public-container py-5 md:py-10 lg:py-15">
          <Link
            to="/programs/fellowship/cohorts"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cohorts
          </Link>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <p className="public-eyebrow mb-5 text-white/70">Cohort Details</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight">
              {cohort?.title || "Cohort reflection"}
            </h1>
            {cohort?.tagline && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{cohort.tagline}</p>
            )}
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-[#F7FAFC]">
        <div className="public-container">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchCohort} />
          ) : !cohort ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              <CohortDetails cohort={cohort} />
              <CohortTrackRecord cohort={cohort} />
              <CohortAudience cohort={cohort} />
              <SuccessStories cohort={cohort} />
              <CohortGallery
                cohort={cohort}
                images={galleryImages}
                currentImage={currentImage}
                setCurrentImage={setCurrentImage}
                isAutoPlaying={isAutoPlaying}
                setIsAutoPlaying={setIsAutoPlaying}
                nextImage={nextImage}
                prevImage={prevImage}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
              <ProgramDetails cohort={cohort} />
            </div>
          )}
        </div>
      </section>

      {cohort && (
        <section className="bg-[#E9EEF5] py-5 text-gray-900 md:py-10 lg:py-15">
          <div className="public-container">
            <div className="rounded-lg border border-[#00337C]/10 bg-white/55 p-6 md:flex md:items-center md:justify-between md:p-8">
              <div>
                <h2 className="text-3xl font-light text-[#00337C]">Ready to apply?</h2>
                <p className="mt-3 max-w-2xl text-gray-600">
                  When applications are open, you can continue to the full application form.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
                {cohort.applicationStatus === "open" && cohort.slug ? (
                  <Link
                    to={`/programs/fellowship/cohorts/${cohort.slug}/apply`}
                    className="public-button-primary px-6 py-3"
                  >
                    Continue to Application
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link to="/programs/fellowship" className="public-button-secondary px-6 py-3">
                    {cohortStage(cohort).label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CohortPreviewCard({ cohort }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-56 bg-gray-100">
        {cohort.coverImage?.url ? (
          <img
            src={cohort.coverImage.url}
            alt={cohort.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[cohort.status] || "bg-gray-100 text-gray-600"}`}
          >
            {cohort.status || "completed"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStyles[cohort.applicationStatus] || "bg-gray-100 text-gray-600"}`}
          >
            {applicationLabel(cohort.applicationStatus)}
          </span>
        </div>

        <h2 className="text-2xl font-light text-[#00337C]">{cohort.title}</h2>
        {cohort.tagline && (
          <p className="mt-2 text-sm font-medium text-[#B76E79]">{cohort.tagline}</p>
        )}
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
          {cohort.description ||
            cohort.overview ||
            "Open the cohort details to read the reflection."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Dates"
            value={formatDateRange(cohort.startDate, cohort.endDate)}
          />
          <InfoCard
            icon={<Users className="h-4 w-4" />}
            label={cohort.status === "completed" ? "Participants" : "Planned places"}
            value={cohort.capacity ? `${cohort.capacity}` : "Not recorded"}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/programs/fellowship/cohorts/${cohort.slug}`}
            className="public-button-primary justify-center px-5 py-3"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
          {cohort.applicationStatus === "open" && (
            <Link
              to={`/programs/fellowship/cohorts/${cohort.slug}/apply`}
              className="public-button-secondary justify-center px-5 py-3"
            >
              Apply
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function CohortDetails({ cohort }) {
  if (!cohort) return null;

  const canApply = cohort.applicationStatus === "open";

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {cohort.coverImage?.url && (
        <img src={cohort.coverImage.url} alt={cohort.title} className="h-72 w-full object-cover" />
      )}

      <div className="p-5 md:p-7">
        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[cohort.status] || "bg-gray-100 text-gray-600"}`}
          >
            {cohort.status || "draft"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStyles[cohort.applicationStatus] || "bg-gray-100 text-gray-600"}`}
          >
            {applicationLabel(cohort.applicationStatus)}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#00337C]">
          {cohort.title}
        </h2>
        {cohort.tagline && (
          <p className="mt-3 text-lg font-medium text-[#B76E79]">{cohort.tagline}</p>
        )}
        <p className="mt-5 whitespace-pre-line text-base leading-8 text-gray-700">
          {cohort.overview || cohort.description || "Details for this cohort will be added soon."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="Dates"
            value={formatDateRange(cohort.startDate, cohort.endDate)}
          />
          <InfoCard
            icon={<Clock className="h-4 w-4" />}
            label="Deadline"
            value={formatDate(cohort.applicationDeadline)}
          />
          <InfoCard
            icon={<Users className="h-4 w-4" />}
            label="Capacity"
            value={cohort.capacity ? `${cohort.capacity} spots` : "To be confirmed"}
          />
          <InfoCard
            icon={<MapPin className="h-4 w-4" />}
            label="Format"
            value={
              [cohort.format, cohort.location].filter(Boolean).join(" • ") || "To be confirmed"
            }
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {canApply ? (
            <Link
              to={`/programs/fellowship/cohorts/${cohort.slug}/apply`}
              className="public-button-primary justify-center px-6 py-3"
            >
              Open Full Application
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CohortAudience({ cohort }) {
  if (!cohort) return null;

  const sections = [
    { title: "Who is it for?", items: cohort.whoIsItFor || [] },
    { title: "Who can apply?", items: cohort.whoCanApply || [] },
    { title: "Commitment", items: cohort.commitment || [] },
  ].filter((section) => section.items.length);

  if (!sections.length) return null;

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-[#00337C]">{section.title}</h3>
          <div className="mt-4 space-y-3">
            {section.items.map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                <Check className="mt-1 h-4 w-4 flex-none text-[#00337C]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function CohortTrackRecord({ cohort }) {
  if (!cohort) return null;

  const sections = [
    {
      title: "Previous cohort reflections",
      description: "Notes from earlier fellowship seasons and the growth they shaped.",
      items: cohort.previousCohorts || [],
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Journey achievements",
      description: "Milestones and proof points gathered across the fellowship journey.",
      items: cohort.achievements || [],
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Impact moments",
      description: "Visible growth, alumni stories, and community wins worth carrying forward.",
      items: cohort.impactHighlights || [],
      icon: <Check className="h-5 w-5" />,
    },
  ].filter((section) => section.items.length);

  if (!sections.length) return null;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
      <p className="public-eyebrow mb-3">Our Journey So Far</p>
      <h2 className="text-2xl font-light text-[#00337C]">Reflections from previous cohorts</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
        A living record of what BYBS has learned, built, and witnessed through earlier fellowship
        cohorts.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-xl border border-gray-100 bg-[#F7FAFC] p-5"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#00337C] shadow-sm">
              {section.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#10233F]">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">{section.description}</p>
            <ul className="mt-4 space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#B76E79]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function SuccessStories({ cohort }) {
  if (!cohort?.successStories?.length) return null;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
      <p className="public-eyebrow mb-3">Success Stories</p>
      <h2 className="text-2xl font-light text-[#00337C]">What graduates carry forward</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {cohort.successStories.map((story) => (
          <blockquote
            key={story}
            className="rounded-xl bg-[#F7FAFC] p-5 text-sm leading-7 text-gray-700"
          >
            "{story}"
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function CohortGallery({
  cohort,
  images,
  currentImage,
  setCurrentImage,
  isAutoPlaying,
  setIsAutoPlaying,
  nextImage,
  prevImage,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) {
  const activeImage = images[currentImage];

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="public-eyebrow mb-2">Graduate Gallery</p>
          <h2 className="text-2xl font-light text-[#00337C]">{cohort?.title}</h2>
        </div>
        {images.length > 1 && (
          <button
            onClick={() => setIsAutoPlaying((current) => !current)}
            className="rounded-full border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        )}
      </div>

      {activeImage ? (
        <>
          <div
            className="relative overflow-hidden rounded-xl bg-gray-100"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={activeImage.url}
              alt={activeImage.caption || cohort?.title}
              className="aspect-[4/3] w-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/60"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/60"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-sm text-white">
                  {currentImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-6">
              {images.map((image, index) => (
                <button
                  key={image._id || image.url}
                  onClick={() => setCurrentImage(index)}
                  className={`overflow-hidden rounded-lg border ${
                    currentImage === index
                      ? "border-[#00337C] ring-2 ring-[#00337C]/20"
                      : "border-gray-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption || "Gallery thumbnail"}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-xl bg-gray-50 text-center">
          <div>
            <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-600">No gallery images yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Images added in the admin cohort gallery will appear here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function ProgramDetails({ cohort }) {
  if (!cohort) return null;

  const sections = [
    { title: "Features", items: cohort.features || [], icon: <Award className="h-4 w-4" /> },
    { title: "Eligibility", items: cohort.eligibility || [], icon: <Users className="h-4 w-4" /> },
    { title: "Curriculum", items: cohort.curriculum || [], icon: <Calendar className="h-4 w-4" /> },
    { title: "Outcomes", items: cohort.outcomes || [], icon: <Award className="h-4 w-4" /> },
  ].filter((section) => section.items.length);

  if (!sections.length && !cohort.facilitators?.length && !cohort.schedule) return null;

  return (
    <section className="grid gap-5 md:grid-cols-2">
      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-[#00337C]">
            {section.icon}
            <h3 className="font-semibold">{section.title}</h3>
          </div>
          <ul className="space-y-3">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#B76E79]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {cohort.facilitators?.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#00337C]">
            <Users className="h-4 w-4" />
            <h3 className="font-semibold">Facilitators</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cohort.facilitators.map((facilitator) => (
              <span
                key={facilitator}
                className="rounded-full bg-[#EAF1FF] px-3 py-1 text-sm font-medium text-[#00337C]"
              >
                {facilitator}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-[#F7FAFC] p-4">
      <div className="mb-2 flex items-center gap-2 text-[#00337C]">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
      <BrandLoader label="Loading cohorts" minHeight="h-72" />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <p className="text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#00337C] px-5 py-3 text-sm font-semibold text-white"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h2 className="text-2xl font-light text-[#00337C]">No cohorts published yet</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
        Once a cohort is marked as published in the admin dashboard, it will appear here
        automatically.
      </p>
    </div>
  );
}
