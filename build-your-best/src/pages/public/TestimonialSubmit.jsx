import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { submitTestimonial } from "../../api/testimonial.api";
import { compressImageFile } from "../../utils/imageCompression";
import {
  TESTIMONIAL_CATEGORIES,
  TESTIMONIAL_MAX_WORDS,
  TESTIMONIAL_MIN_WORDS,
  countTestimonialWords,
} from "../../config/testimonials";

const emptyForm = {
  name: "",
  email: "",
  category: "",
  roleTitle: "",
  testimonial: "",
  consentToPublish: false,
};

const fieldClass =
  "mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15";

export default function TestimonialSubmit() {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const wordCount = countTestimonialWords(form.testimonial);

  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview]
  );

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateTestimonial = (value) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    update(
      "testimonial",
      words.length > TESTIMONIAL_MAX_WORDS ? words.slice(0, TESTIMONIAL_MAX_WORDS).join(" ") : value
    );
  };

  const choosePhoto = async (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setCompressing(true);
    setError("");
    try {
      const compressed = await compressImageFile(selected, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.78,
      });
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhoto(compressed);
      setPhotoPreview(URL.createObjectURL(compressed));
    } catch {
      setError("This image could not be prepared. Please choose another JPG, PNG, or WebP file.");
    } finally {
      setCompressing(false);
      event.target.value = "";
    }
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (wordCount < TESTIMONIAL_MIN_WORDS) {
      setError(`Please write at least ${TESTIMONIAL_MIN_WORDS} words about your experience.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
      if (photo) payload.append("profilePhoto", photo);
      await submitTestimonial(payload);
      setSubmitted(true);
      setForm(emptyForm);
      removePhoto();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Your testimonial could not be submitted right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Share Your BYBS Experience"
        description="Share how your experience with Build Your Best Self influenced your growth, contribution, or community journey."
        noindex
      />
      <main className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
        <div className="public-container">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to BYBS
          </Link>

          {submitted ? (
            <section className="mx-auto mt-5 max-w-2xl rounded-lg border border-gray-200 bg-white p-7 text-center shadow-sm md:p-10">
              <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
              <h1 className="mt-5 text-2xl font-light text-[#00337C] md:text-3xl lg:text-4xl">
                Thank you for sharing your experience.
              </h1>
              <p className="public-copy mx-auto mt-4 max-w-lg">
                Your story helps capture the many ways people learn, contribute, connect, and grow
                through BYBS.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="public-button-secondary px-6 py-3"
                >
                  Share another experience
                </button>
                <Link to="/" className="public-button-primary px-6 py-3">
                  Return home
                </Link>
              </div>
            </section>
          ) : (
            <div className="mt-5 grid gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
              <header className="lg:sticky lg:top-28">
                <p className="public-eyebrow">Community voices</p>
                <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
                  Share your BYBS experience.
                </h1>
                <p className="public-copy mt-5 text-lg">
                  Tell us what changed, what you learned, or what your connection with BYBS made
                  possible.
                </p>
                <div className="mt-7 border-y border-gray-200 py-5 text-sm leading-7 text-gray-600">
                  <p>Write in your own voice and focus on one clear experience.</p>
                  <p className="mt-2">
                    A portrait photo is optional, but it helps people connect your words with the
                    person behind them.
                  </p>
                </div>
              </header>

              <form
                onSubmit={submit}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7 md:p-9"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="testimonial-name">
                    Full name *
                    <input
                      id="testimonial-name"
                      required
                      maxLength={140}
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </label>
                  <label
                    className="text-sm font-semibold text-gray-800"
                    htmlFor="testimonial-email"
                  >
                    Email address *
                    <input
                      id="testimonial-email"
                      required
                      type="email"
                      maxLength={220}
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      autoComplete="email"
                      className={fieldClass}
                    />
                    <span className="mt-2 block text-xs font-normal text-gray-500">
                      Your email is kept private.
                    </span>
                  </label>
                  <label
                    className="text-sm font-semibold text-gray-800"
                    htmlFor="testimonial-category"
                  >
                    Your relationship with BYBS *
                    <select
                      id="testimonial-category"
                      required
                      value={form.category}
                      onChange={(event) => update("category", event.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select a category</option>
                      {TESTIMONIAL_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-gray-800" htmlFor="testimonial-role">
                    Role or title
                    <input
                      id="testimonial-role"
                      maxLength={160}
                      value={form.roleTitle}
                      onChange={(event) => update("roleTitle", event.target.value)}
                      placeholder="Optional"
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label
                  className="mt-6 block text-sm font-semibold text-gray-800"
                  htmlFor="testimonial-copy"
                >
                  Your testimonial *
                  <textarea
                    id="testimonial-copy"
                    required
                    rows={8}
                    value={form.testimonial}
                    onChange={(event) => updateTestimonial(event.target.value)}
                    placeholder="What was your experience, and what changed for you?"
                    className={`${fieldClass} py-3 leading-7`}
                  />
                </label>
                <div className="mt-2 flex items-center justify-between gap-4 text-xs">
                  <span
                    className={
                      wordCount > 0 && wordCount < TESTIMONIAL_MIN_WORDS
                        ? "text-amber-700"
                        : "text-gray-500"
                    }
                  >
                    {TESTIMONIAL_MIN_WORDS}-word minimum
                  </span>
                  <span
                    className={`font-semibold ${wordCount === TESTIMONIAL_MAX_WORDS ? "text-[#B96500]" : "text-gray-600"}`}
                  >
                    {wordCount} / {TESTIMONIAL_MAX_WORDS} words
                  </span>
                </div>

                <fieldset className="mt-7 border-t border-gray-200 pt-6">
                  <legend className="text-sm font-semibold text-gray-800">Portrait photo</legend>
                  {photoPreview ? (
                    <div className="mt-3 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                      <img
                        src={photoPreview}
                        alt="Selected portrait preview"
                        className="h-24 w-20 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {photo?.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">Ready to upload</p>
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        aria-label="Remove selected photo"
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 text-center hover:border-[#00337C]"
                      htmlFor="testimonial-photo"
                    >
                      {compressing ? (
                        <Loader2 className="h-7 w-7 animate-spin text-[#00337C]" />
                      ) : (
                        <ImagePlus className="h-7 w-7 text-[#00337C]" />
                      )}
                      <span className="mt-2 text-sm font-semibold text-[#00337C]">
                        {compressing ? "Preparing photo..." : "Choose a portrait photo"}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP</span>
                      <input
                        id="testimonial-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={choosePhoto}
                        disabled={compressing}
                        className="sr-only"
                      />
                    </label>
                  )}
                </fieldset>

                <label className="mt-6 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  <input
                    type="checkbox"
                    required
                    checked={form.consentToPublish}
                    onChange={(event) => update("consentToPublish", event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#00337C]"
                  />
                  <span>
                    I give BYBS permission to feature my name, testimonial, category, role, and
                    selected photo in its website and communications.
                  </span>
                </label>

                {error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting || compressing || wordCount < TESTIMONIAL_MIN_WORDS}
                  className="public-button-primary mt-6 w-full px-6 py-3.5 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Share my experience
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
