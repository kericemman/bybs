import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageSquarePlus, Quote } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicTestimonials } from "../../api/testimonial.api";
import { FALLBACK_TESTIMONIALS, testimonialCategoryLabel } from "../../config/testimonials";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [publishedTestimonials, setPublishedTestimonials] = useState([]);

  useEffect(() => {
    let active = true;
    fetchPublicTestimonials()
      .then(({ data }) => {
        if (active && Array.isArray(data)) setPublishedTestimonials(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const testimonials = useMemo(
    () => (publishedTestimonials.length ? publishedTestimonials : FALLBACK_TESTIMONIALS),
    [publishedTestimonials]
  );
  const current = testimonials[currentTestimonial] || testimonials[0];
  const isPartnerLogo = current?.category === "partner";

  useEffect(() => {
    setCurrentTestimonial(0);
  }, [testimonials]);

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((previous) => (previous + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setCurrentTestimonial((previous) => (previous === 0 ? testimonials.length - 1 : previous - 1));
  };

  if (!current) return null;

  return (
    <section className="public-section bg-white" aria-labelledby="testimonials-heading">
      <div className="public-container">
        <div className="flex flex-col gap-6 border-b border-gray-200 pb-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="public-eyebrow mb-5">Community voices</p>
            <h2
              id="testimonials-heading"
              className="text-2xl md:text-3xl lg:text-4xl public-heading"
            >
              Growth, in their own words.
            </h2>
            <p className="public-copy mt-4 text-lg">
              Experiences shared by people who have learned, served, partnered, and grown with BYBS.
            </p>
          </div>
          <Link
            to="/community/testimonials/submit"
            className="public-button-primary shrink-0 px-6 py-3"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Share your experience
          </Link>
        </div>

        <div className="relative py-7 md:py-10">
          <AnimatePresence mode="wait">
            <Motion.article
              key={current._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center lg:gap-12"
            >
              <figure className="mx-auto h-44 w-44 overflow-hidden rounded-full border-2 border-[#00337C]/20 lg:mx-0 lg:h-48 lg:w-48">
                <div className="h-full w-full overflow-hidden rounded-full">
                  {current.profilePhoto?.url ? (
                    <img
                      src={current.profilePhoto.url}
                      alt={`${current.name}, ${testimonialCategoryLabel(current.category)}`}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-center ${isPartnerLogo ? "object-contain p-5" : "object-cover"}`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-light text-[#00337C]">
                      {current.name?.charAt(0) || "B"}
                    </div>
                  )}
                </div>
              </figure>

              <div className="max-w-3xl">
                <Quote className="h-7 w-7 text-[#D67A00]" aria-hidden="true" />
                <blockquote className="mt-4 max-w-2xl text-base leading-8 text-gray-700 md:text-lg md:leading-8">
                  {current.testimonial}
                </blockquote>
                <div className="mt-6 max-w-2xl border-t border-gray-200 pt-5">
                  <p className="font-semibold text-[#00337C]">{current.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {[current.roleTitle, testimonialCategoryLabel(current.category)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            </Motion.article>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Choose a testimonial">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial._id}
                type="button"
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Show testimonial from ${testimonial.name}`}
                aria-current={index === currentTestimonial ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${index === currentTestimonial ? "w-8 bg-[#00337C]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
          {testimonials.length > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={previousTestimonial}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
