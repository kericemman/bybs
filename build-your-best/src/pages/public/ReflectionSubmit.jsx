import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchActiveReflection, fetchReflection, submitReflection } from "../../api/reflection.api";
import { compressImageFile } from "../../utils/imageCompression";
import BrandLoader from "../../components/public/BrandLoader";
import { CountrySelectField } from "../../components/forms/ContactFields";

const relationships = [
  "Current Fellow",
  "Alumni",
  "Volunteer",
  "Mentor",
  "Supporter",
  "Partner",
  "Community Member",
  "Visitor / Friend of BYBS",
];
const initialForm = {
  name: "",
  email: "",
  country: "",
  city: "",
  relationship: "",
  response: "",
  socialProfile: "",
  publishAnonymously: false,
  consentToPublish: false,
  consentToUseImage: false,
  profilePhoto: null,
};

export default function ReflectionSubmit() {
  const [searchParams] = useSearchParams();
  const requestedPrompt = searchParams.get("prompt");
  const [prompt, setPrompt] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    const request = requestedPrompt ? fetchReflection(requestedPrompt) : fetchActiveReflection();
    request
      .then(({ data }) => mounted && setPrompt(data || null))
      .catch(() => mounted && setPrompt(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [requestedPrompt]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const handlePhoto = async (event) => {
    const source = event.target.files?.[0];
    if (!source) return;
    const compressed = await compressImageFile(source, {
      maxWidth: 900,
      maxHeight: 900,
      quality: 0.78,
    });
    update("profilePhoto", compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!prompt?.slug) return;
    setSubmitting(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "profilePhoto") {
          if (value instanceof File) data.append(key, value);
        } else data.append(key, value);
      });
      await submitReflection(prompt.slug, data);
      setSubmitted(true);
      setForm(initialForm);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Your reflection could not be submitted right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="public-section">
        <div className="public-container">
          <BrandLoader label="Loading the current reflection" />
        </div>
      </div>
    );
  if (!prompt?.canSubmit)
    return (
      <div className="public-section">
        <div className="public-container max-w-2xl">
          <p className="public-eyebrow">Weekly Reflection</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
            Submissions are currently closed
          </h1>
          <p className="public-copy mt-5">
            The next active prompt will appear on the Weekly Reflection page when it opens.
          </p>
          <Link to="/community/reflections" className="public-button-primary mt-7 px-6 py-3">
            <ArrowLeft className="h-4 w-4" />
            View reflections
          </Link>
        </div>
      </div>
    );
  if (submitted)
    return (
      <div className="public-section">
        <div className="public-container max-w-2xl rounded-lg border border-green-200 bg-green-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
          <h1 className="mt-5 text-2xl font-semibold text-[#00337C] md:text-3xl lg:text-4xl">
            Your reflection has been received
          </h1>
          <p className="public-copy mt-4">
            Thank you for contributing. The BYBS team will review it before deciding whether it
            should appear publicly.
          </p>
          <Link
            to={`/community/reflections/${prompt.slug}`}
            className="public-button-primary mt-7 px-6 py-3"
          >
            Return to this week
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
      <div className="public-container grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <aside className="lg:sticky lg:top-28">
          <Link
            to={`/community/reflections/${prompt.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00337C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to this week
          </Link>
          <p className="public-eyebrow mt-8">{prompt.weekLabel}</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl public-heading mt-5">
            Share your reflection
          </h1>
          <p className="mt-6 text-xl font-light leading-8 text-gray-800">{prompt.question}</p>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <ShieldCheck className="h-7 w-7 text-[#D67A00]" />
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your response is private until an administrator reviews it. You may choose anonymous
              publication. Your email is never displayed publicly.
            </p>
          </div>
        </aside>
        <form
          onSubmit={submit}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-gray-800">
              Full name
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
              />
            </label>
            <label className="text-sm font-semibold text-gray-800">
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
              />
            </label>
            <CountrySelectField
              required
              value={form.country}
              onChange={(value) => update("country", value)}
            />
            <label className="text-sm font-semibold text-gray-800">
              City <span className="font-normal text-gray-400">(optional)</span>
              <input
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
              />
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold text-gray-800">
            Relationship with BYBS
            <select
              required
              value={form.relationship}
              onChange={(event) => update("relationship", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal outline-none focus:border-[#00337C]"
            >
              <option value="">Select one</option>
              {relationships.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mt-5 block text-sm font-semibold text-gray-800">
            Your reflection
            <textarea
              required
              minLength={40}
              maxLength={8000}
              rows={10}
              value={form.response}
              onChange={(event) => update("response", event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal leading-7 outline-none focus:border-[#00337C]"
              placeholder="Write honestly and in your own voice..."
            />
            <span className="mt-1 block text-right text-xs font-normal text-gray-400">
              {form.response.length}/8000
            </span>
          </label>
          <label className="mt-5 block text-sm font-semibold text-gray-800">
            LinkedIn or social profile <span className="font-normal text-gray-400">(optional)</span>
            <input
              type="url"
              value={form.socialProfile}
              onChange={(event) => update("socialProfile", event.target.value)}
              placeholder="https://"
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
            />
          </label>
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <label className="flex cursor-pointer items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#00337C]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <ImagePlus className="h-5 w-5" />
                )}
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-800">
                  Optional profile photo
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  JPG, PNG, or WebP. It is used only with your consent.
                </span>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhoto}
                className="sr-only"
              />
            </label>
          </div>
          <div className="mt-6 space-y-4 rounded-lg bg-[#F7F9FC] p-5 text-sm leading-6 text-gray-700">
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.publishAnonymously}
                onChange={(event) => update("publishAnonymously", event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>Publish my response anonymously if it is selected.</span>
            </label>
            <label className="flex gap-3">
              <input
                required
                type="checkbox"
                checked={form.consentToPublish}
                onChange={(event) => update("consentToPublish", event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                I consent to BYBS reviewing, editing for clarity, and publishing this reflection if
                selected.
              </span>
            </label>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.consentToUseImage}
                onChange={(event) => update("consentToUseImage", event.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                I consent to BYBS using my uploaded profile photo with this reflection. Required
                only when a photo is uploaded.
              </span>
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="public-button-primary mt-6 w-full px-6 py-3.5 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
