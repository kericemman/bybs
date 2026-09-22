import { createElement, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  createCommunityAction,
  deleteCommunityAction,
  deleteCommunityActionGalleryImage,
  fetchAdminCommunityActions,
  updateCommunityAction,
} from "../../api/communityAction.api";
import {
  createImpactMetric,
  deleteImpactMetric,
  fetchAdminImpactMetrics,
  updateImpactMetric,
} from "../../api/impact.api";
import { compressImageFile } from "../../utils/imageCompression";

const contentTypes = [
  "outreach",
  "fellowship",
  "transformation",
  "volunteer",
  "partnership",
  "programme",
];
const metricCategories = ["general", "fellowship", "community", "volunteer", "mentor", "partner"];
const label = (value) =>
  String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");
const fieldClass =
  "mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15";
const textareaClass = `${fieldClass} py-3 leading-6`;

const emptyStory = {
  title: "",
  summary: "",
  contentType: "outreach",
  story: "",
  whatHappened: "",
  whyItMattered: "",
  actionDate: "",
  location: "",
  participantCount: "",
  participantsDescription: "",
  beneficiaryCount: "",
  beneficiaries: "",
  partners: "",
  resourcesContributed: "",
  outcomes: "",
  relatedProgramme: "",
  quoteText: "",
  quoteAttribution: "",
  ctaLabel: "Learn more",
  ctaUrl: "",
  seoTitle: "",
  metaDescription: "",
  status: "draft",
  isFeatured: false,
  coverImage: null,
};

const emptyMetric = {
  label: "",
  value: "",
  suffix: "",
  description: "",
  category: "general",
  displayOrder: "0",
  status: "draft",
  verificationNote: "",
  verifiedAt: "",
};

function ModalHeader({ eyebrow, title, titleId, onClose }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
      <div>
        <p className="text-xs font-semibold uppercase text-[#B96500]">{eyebrow}</p>
        <h2 id={titleId} className="mt-1 text-xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close form"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function Field({ label: fieldLabel, htmlFor, help, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800">
        {fieldLabel}
      </label>
      {children}
      {help && <p className="mt-1 text-xs leading-5 text-gray-500">{help}</p>}
    </div>
  );
}

function MetricForm({ metric, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    metric
      ? {
          label: metric.label || "",
          value: metric.value ?? "",
          suffix: metric.suffix || "",
          description: metric.description || "",
          category: metric.category || "general",
          displayOrder: metric.displayOrder ?? 0,
          status: metric.status || "draft",
          verificationNote: metric.verificationNote || "",
          verifiedAt: toDateInput(metric.verifiedAt),
        }
      : emptyMetric
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (metric) await updateImpactMetric(metric._id, form);
      else await createImpactMetric(form);
      onSaved();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this statistic.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/65 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="metric-form-title"
    >
      <form onSubmit={submit} className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
        <ModalHeader
          eyebrow="Verified statistic"
          title={metric ? "Edit impact statistic" : "Add impact statistic"}
          titleId="metric-form-title"
          onClose={onClose}
        />
        <div className="space-y-6 p-5 sm:p-7">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
            <Field label="Metric label *" htmlFor="metric-label">
              <input
                id="metric-label"
                required
                maxLength={80}
                value={form.label}
                onChange={(event) => update("label", event.target.value)}
                placeholder="Fellows trained"
                className={fieldClass}
              />
            </Field>
            <Field label="Display order" htmlFor="metric-order">
              <input
                id="metric-order"
                type="number"
                min="0"
                max="999"
                value={form.displayOrder}
                onChange={(event) => update("displayOrder", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_8rem_1fr]">
            <Field label="Verified value *" htmlFor="metric-value">
              <input
                id="metric-value"
                required
                type="number"
                min="0"
                step="any"
                value={form.value}
                onChange={(event) => update("value", event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Suffix" htmlFor="metric-suffix">
              <input
                id="metric-suffix"
                maxLength={12}
                value={form.suffix}
                onChange={(event) => update("suffix", event.target.value)}
                placeholder="+"
                className={fieldClass}
              />
            </Field>
            <Field label="Category" htmlFor="metric-category">
              <select
                id="metric-category"
                value={form.category}
                onChange={(event) => update("category", event.target.value)}
                className={fieldClass}
              >
                {metricCategories.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field
            label="Public context"
            htmlFor="metric-description"
            help="A short explanation shown beneath the number."
          >
            <textarea
              id="metric-description"
              rows={3}
              maxLength={240}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className={textareaClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Status" htmlFor="metric-status">
              <select
                id="metric-status"
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className={fieldClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Date verified" htmlFor="metric-verified">
              <input
                id="metric-verified"
                type="date"
                required={form.status === "published"}
                value={form.verifiedAt}
                onChange={(event) => update("verifiedAt", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
          <Field
            label="Internal verification note"
            htmlFor="metric-note"
            help="Required to publish. Record the report, register, spreadsheet, or person used to confirm this value. This note stays private."
          >
            <textarea
              id="metric-note"
              required={form.status === "published"}
              rows={4}
              maxLength={1200}
              value={form.verificationNote}
              onChange={(event) => update("verificationNote", event.target.value)}
              className={textareaClass}
            />
          </Field>
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-gray-300 px-6 font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-6 font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save statistic"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StoryForm({ story, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    story
      ? {
          title: story.title || "",
          summary: story.summary || "",
          contentType: story.contentType || "outreach",
          story: story.story || "",
          whatHappened: story.whatHappened || "",
          whyItMattered: story.whyItMattered || "",
          actionDate: toDateInput(story.actionDate),
          location: story.location || "",
          participantCount: story.participantCount ?? "",
          participantsDescription: story.participantsDescription || "",
          beneficiaryCount: story.beneficiaryCount ?? "",
          beneficiaries: story.beneficiaries || "",
          partners: (story.partners || []).join("\n"),
          resourcesContributed: (story.resourcesContributed || []).join("\n"),
          outcomes: (story.outcomes || []).join("\n"),
          relatedProgramme: story.relatedProgramme || "",
          quoteText: story.quote?.text || "",
          quoteAttribution: story.quote?.attribution || "",
          ctaLabel: story.ctaLabel || "Learn more",
          ctaUrl: story.ctaUrl || "",
          seoTitle: story.seoTitle || "",
          metaDescription: story.metaDescription || "",
          status: story.status || "draft",
          isFeatured: Boolean(story.isFeatured),
          coverImage: null,
        }
      : emptyStory
  );
  const [coverPreview, setCoverPreview] = useState(story?.coverImage?.url || "");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState(story?.gallery || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleCover = async (event) => {
    const source = event.target.files?.[0];
    if (!source) return;
    const file = await compressImageFile(source);
    update("coverImage", file);
    setCoverPreview(URL.createObjectURL(file));
  };
  const handleGallery = async (event) => {
    const files = await Promise.all(
      Array.from(event.target.files || [])
        .slice(0, 12)
        .map((file) => compressImageFile(file))
    );
    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };
  const removeExistingImage = async (image) => {
    try {
      const { data } = await deleteCommunityActionGalleryImage(story._id, image._id);
      setExistingGallery(data.gallery || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to remove this image.");
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "coverImage") {
          if (value instanceof File) data.append(key, value);
        } else data.append(key, value ?? "");
      });
      galleryFiles.forEach((file) => data.append("gallery", file));
      if (story) await updateCommunityAction(story._id, data);
      else await createCommunityAction(data);
      onSaved();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this impact story.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/65 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-form-title"
    >
      <form onSubmit={submit} className="w-full max-w-5xl rounded-lg bg-white shadow-2xl">
        <ModalHeader
          eyebrow="Impact story"
          title={story ? "Edit impact story" : "Create impact story"}
          titleId="story-form-title"
          onClose={onClose}
        />
        <div className="space-y-9 p-5 sm:p-7">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-[#00337C]">
              Essential information
            </legend>
            <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
              <Field label="Title *" htmlFor="story-title">
                <input
                  id="story-title"
                  required
                  maxLength={140}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Story type" htmlFor="story-type">
                <select
                  id="story-type"
                  value={form.contentType}
                  onChange={(event) => update("contentType", event.target.value)}
                  className={fieldClass}
                >
                  {contentTypes.map((item) => (
                    <option key={item} value={item}>
                      {label(item)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              label="Short summary *"
              htmlFor="story-summary"
              help="Used on the homepage and Impact page preview."
            >
              <textarea
                id="story-summary"
                required
                maxLength={600}
                rows={3}
                value={form.summary}
                onChange={(event) => update("summary", event.target.value)}
                className={textareaClass}
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Story date" htmlFor="story-date">
                <input
                  id="story-date"
                  type="date"
                  value={form.actionDate}
                  onChange={(event) => update("actionDate", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Location" htmlFor="story-location">
                <input
                  id="story-location"
                  maxLength={180}
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Related programme" htmlFor="story-programme">
                <input
                  id="story-programme"
                  maxLength={160}
                  value={form.relatedProgramme}
                  onChange={(event) => update("relatedProgramme", event.target.value)}
                  placeholder="Community Outreach"
                  className={fieldClass}
                />
              </Field>
            </div>
          </fieldset>
          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">Full story</legend>
            <Field
              label="Story narrative"
              htmlFor="story-body"
              help="Write the complete public story in clear paragraphs."
            >
              <textarea
                id="story-body"
                rows={12}
                maxLength={30000}
                value={form.story}
                onChange={(event) => update("story", event.target.value)}
                className={textareaClass}
              />
            </Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="What happened" htmlFor="story-happened">
                <textarea
                  id="story-happened"
                  rows={5}
                  maxLength={5000}
                  value={form.whatHappened}
                  onChange={(event) => update("whatHappened", event.target.value)}
                  className={textareaClass}
                />
              </Field>
              <Field label="Why it mattered" htmlFor="story-mattered">
                <textarea
                  id="story-mattered"
                  rows={5}
                  maxLength={3000}
                  value={form.whyItMattered}
                  onChange={(event) => update("whyItMattered", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="grid gap-5 md:grid-cols-[1.5fr_0.5fr]">
              <Field label="Quote" htmlFor="story-quote">
                <textarea
                  id="story-quote"
                  rows={3}
                  maxLength={1000}
                  value={form.quoteText}
                  onChange={(event) => update("quoteText", event.target.value)}
                  className={textareaClass}
                />
              </Field>
              <Field label="Attribution" htmlFor="story-attribution">
                <input
                  id="story-attribution"
                  maxLength={180}
                  value={form.quoteAttribution}
                  onChange={(event) => update("quoteAttribution", event.target.value)}
                  className={fieldClass}
                />
              </Field>
            </div>
          </fieldset>
          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">
              People, resources, and outcomes
            </legend>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Participant count" htmlFor="participant-count">
                <input
                  id="participant-count"
                  type="number"
                  min="0"
                  value={form.participantCount}
                  onChange={(event) => update("participantCount", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Beneficiary count" htmlFor="beneficiary-count">
                <input
                  id="beneficiary-count"
                  type="number"
                  min="0"
                  value={form.beneficiaryCount}
                  onChange={(event) => update("beneficiaryCount", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Participants" htmlFor="participants-description">
                <textarea
                  id="participants-description"
                  rows={3}
                  maxLength={2000}
                  value={form.participantsDescription}
                  onChange={(event) => update("participantsDescription", event.target.value)}
                  placeholder="Who took part?"
                  className={textareaClass}
                />
              </Field>
              <Field label="Beneficiaries" htmlFor="beneficiaries">
                <textarea
                  id="beneficiaries"
                  rows={3}
                  maxLength={2000}
                  value={form.beneficiaries}
                  onChange={(event) => update("beneficiaries", event.target.value)}
                  placeholder="Who benefited and how?"
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Partners" htmlFor="story-partners" help="One partner per line.">
                <textarea
                  id="story-partners"
                  rows={5}
                  value={form.partners}
                  onChange={(event) => update("partners", event.target.value)}
                  className={textareaClass}
                />
              </Field>
              <Field
                label="Resources contributed"
                htmlFor="story-resources"
                help="One item per line."
              >
                <textarea
                  id="story-resources"
                  rows={5}
                  value={form.resourcesContributed}
                  onChange={(event) => update("resourcesContributed", event.target.value)}
                  className={textareaClass}
                />
              </Field>
              <Field
                label="Outcomes"
                htmlFor="story-outcomes"
                help="One verified outcome per line."
              >
                <textarea
                  id="story-outcomes"
                  rows={5}
                  value={form.outcomes}
                  onChange={(event) => update("outcomes", event.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>
          </fieldset>
          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">Photography</legend>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center hover:border-[#00337C]">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="mb-3 h-28 w-full rounded-md object-cover"
                  />
                ) : (
                  <ImageIcon className="mb-3 h-8 w-8 text-gray-400" />
                )}
                <span className="text-sm font-semibold text-[#00337C]">Choose cover image</span>
                <span className="mt-1 text-xs text-gray-500">Required before publishing</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCover}
                  className="sr-only"
                />
              </label>
              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-center hover:border-[#00337C]">
                <Upload className="mb-3 h-8 w-8 text-gray-400" />
                <span className="text-sm font-semibold text-[#00337C]">Add gallery images</span>
                <span className="mt-1 text-xs text-gray-500">
                  Up to 12 compressed images per upload
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleGallery}
                  className="sr-only"
                />
              </label>
            </div>
            {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {existingGallery.map((image) => (
                  <div
                    key={image._id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={image.url}
                      alt="Existing gallery item"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      aria-label="Remove gallery image"
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {galleryPreviews.map((preview) => (
                  <img
                    key={preview}
                    src={preview}
                    alt="New gallery preview"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </fieldset>
          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">
              Publication and search
            </legend>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="SEO title" htmlFor="story-seo">
                <input
                  id="story-seo"
                  maxLength={70}
                  value={form.seoTitle}
                  onChange={(event) => update("seoTitle", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Meta description" htmlFor="story-meta">
                <input
                  id="story-meta"
                  maxLength={180}
                  value={form.metaDescription}
                  onChange={(event) => update("metaDescription", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Button label" htmlFor="story-cta-label">
                <input
                  id="story-cta-label"
                  maxLength={60}
                  value={form.ctaLabel}
                  onChange={(event) => update("ctaLabel", event.target.value)}
                  className={fieldClass}
                />
              </Field>
              <Field label="Button destination" htmlFor="story-cta-url">
                <input
                  id="story-cta-url"
                  value={form.ctaUrl}
                  onChange={(event) => update("ctaUrl", event.target.value)}
                  placeholder="/support or https://..."
                  className={fieldClass}
                />
              </Field>
              <Field label="Status" htmlFor="story-status">
                <select
                  id="story-status"
                  value={form.status}
                  onChange={(event) => {
                    update("status", event.target.value);
                    if (event.target.value === "draft") update("isFeatured", false);
                  }}
                  className={fieldClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              <label
                className={`mt-7 flex min-h-11 items-center gap-3 rounded-lg border px-4 ${form.status === "published" ? "cursor-pointer border-gray-300" : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"}`}
              >
                <input
                  type="checkbox"
                  disabled={form.status !== "published"}
                  checked={form.isFeatured}
                  onChange={(event) => update("isFeatured", event.target.checked)}
                  className="h-5 w-5 accent-[#00337C]"
                />
                <span className="text-sm font-medium">Feature on homepage and Impact page</span>
              </label>
            </div>
          </fieldset>
        </div>
        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-gray-300 px-6 font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-6 font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : story ? "Save story" : "Create story"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminImpact() {
  const [tab, setTab] = useState("stories");
  const [stories, setStories] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [storyForm, setStoryForm] = useState({ open: false, item: null });
  const [metricForm, setMetricForm] = useState({ open: false, item: null });

  const load = async () => {
    setLoading(true);
    setError("");
    const [storiesResult, metricsResult] = await Promise.allSettled([
      fetchAdminCommunityActions(),
      fetchAdminImpactMetrics(),
    ]);
    if (storiesResult.status === "fulfilled") setStories(storiesResult.value.data || []);
    else
      setError(storiesResult.reason?.response?.data?.message || "Unable to load impact stories.");
    if (metricsResult.status === "fulfilled") setMetrics(metricsResult.value.data || []);
    else
      setError(
        (current) =>
          current ||
          metricsResult.reason?.response?.data?.message ||
          "Unable to load impact statistics."
      );
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const filteredStories = useMemo(
    () =>
      stories.filter((story) => {
        const term = search.trim().toLowerCase();
        return (
          (status === "all" || story.status === status) &&
          (type === "all" || story.contentType === type) &&
          (!term ||
            [story.title, story.summary, story.location, story.relatedProgramme]
              .filter(Boolean)
              .some((value) => value.toLowerCase().includes(term)))
        );
      }),
    [search, status, stories, type]
  );

  const removeStory = async (story) => {
    if (!window.confirm(`Delete “${story.title}”? This cannot be undone.`)) return;
    try {
      await deleteCommunityAction(story._id);
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this impact story.");
    }
  };
  const removeMetric = async (metric) => {
    if (!window.confirm(`Delete “${metric.label}”? This cannot be undone.`)) return;
    try {
      await deleteImpactMetric(metric._id);
      load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this impact statistic.");
    }
  };
  const closeFormsAndReload = () => {
    setStoryForm({ open: false, item: null });
    setMetricForm({ open: false, item: null });
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">
              Evidence and storytelling
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950">Impact</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Publish verified statistics and document outreach, Fellowship, volunteer, partner, and
              transformation stories.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              tab === "stories"
                ? setStoryForm({ open: true, item: null })
                : setMetricForm({ open: true, item: null })
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white"
          >
            <Plus className="h-5 w-5" />
            {tab === "stories" ? "Create impact story" : "Add statistic"}
          </button>
        </header>
        <div
          className="mt-7 inline-flex rounded-lg border border-gray-200 bg-white p-1"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "stories"}
            onClick={() => setTab("stories")}
            className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold ${tab === "stories" ? "bg-[#00337C] text-white" : "text-gray-600"}`}
          >
            <FileText className="h-4 w-4" />
            Impact stories
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "metrics"}
            onClick={() => setTab("metrics")}
            className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold ${tab === "metrics" ? "bg-[#00337C] text-white" : "text-gray-600"}`}
          >
            <BarChart3 className="h-4 w-4" />
            Statistics
          </button>
        </div>
        <section className="grid gap-4 py-7 sm:grid-cols-3" aria-label="Impact content statistics">
          {(tab === "stories"
            ? [
                { label: "Stories", value: stories.length, icon: FileText },
                {
                  label: "Published",
                  value: stories.filter((item) => item.status === "published").length,
                  icon: CheckCircle2,
                },
                {
                  label: "Featured",
                  value: stories.filter((item) => item.isFeatured).length,
                  icon: Star,
                },
              ]
            : [
                { label: "Statistics", value: metrics.length, icon: BarChart3 },
                {
                  label: "Published",
                  value: metrics.filter((item) => item.status === "published").length,
                  icon: CheckCircle2,
                },
                {
                  label: "Draft",
                  value: metrics.filter((item) => item.status === "draft").length,
                  icon: Edit3,
                },
              ]
          ).map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-950">{item.value}</p>
                </div>
                {createElement(item.icon, { className: "h-6 w-6 text-[#00337C]" })}
              </div>
            </div>
          ))}
        </section>
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {tab === "stories" && (
          <>
            <div className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[1fr_11rem_12rem]">
              <label className="relative">
                <span className="sr-only">Search stories</span>
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, location, programme..."
                  className="min-h-11 w-full rounded-lg border border-gray-300 pl-11 pr-4"
                />
              </label>
              <select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-4"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select
                aria-label="Filter by story type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-4"
              >
                <option value="all">All story types</option>
                {contentTypes.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <Loading />
            ) : filteredStories.length === 0 ? (
              <Empty
                icon={FileText}
                title="No impact stories found"
                message={
                  stories.length
                    ? "Adjust the filters to see more stories."
                    : "Create the first story when its facts, photography, and permissions are ready."
                }
                action={() => setStoryForm({ open: true, item: null })}
                actionLabel="Create impact story"
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredStories.map((story) => (
                  <article
                    key={story._id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="grid min-h-60 sm:grid-cols-[12rem_1fr]">
                      <div className="bg-gray-100">
                        {story.coverImage?.url ? (
                          <img
                            src={story.coverImage.url}
                            alt=""
                            className="h-full min-h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-48 items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col p-5">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${story.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                          >
                            {label(story.status)}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {label(story.contentType)}
                          </span>
                          {story.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#00337C]">
                              <Star className="h-3.5 w-3.5" />
                              Featured
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 text-xl font-semibold text-gray-950">{story.title}</h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {story.summary}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                          {story.actionDate && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(story.actionDate).toLocaleDateString()}
                            </span>
                          )}
                          {story.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {story.location}
                            </span>
                          )}
                          {Number.isFinite(story.participantCount) && (
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {story.participantCount}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto flex gap-2 pt-5">
                          <button
                            type="button"
                            onClick={() => setStoryForm({ open: true, item: story })}
                            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          {story.status === "published" && (
                            <a
                              href={`/impact/${story.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View ${story.title}`}
                              className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-[#00337C]"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => removeStory(story)}
                            aria-label={`Delete ${story.title}`}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-200 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {tab === "metrics" &&
          (loading ? (
            <Loading />
          ) : metrics.length === 0 ? (
            <Empty
              icon={BarChart3}
              title="No verified statistics yet"
              message="Add a statistic as a draft, record how it was verified, then publish it when the evidence is ready."
              action={() => setMetricForm({ open: true, item: null })}
              actionLabel="Add statistic"
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {metrics.map((metric) => (
                <article
                  key={metric._id}
                  className="rounded-lg border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl font-light text-[#00337C]">
                        {Number(metric.value).toLocaleString()}
                        {metric.suffix}
                      </p>
                      <h2 className="mt-2 font-semibold text-gray-950">{metric.label}</h2>
                      <p className="mt-1 text-xs font-semibold uppercase text-gray-400">
                        {label(metric.category)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${metric.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {label(metric.status)}
                    </span>
                  </div>
                  {metric.description && (
                    <p className="mt-4 text-sm leading-6 text-gray-600">{metric.description}</p>
                  )}
                  <div className="mt-5 flex gap-2 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setMetricForm({ open: true, item: metric })}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMetric(metric)}
                      aria-label={`Delete ${metric.label}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-200 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ))}
      </div>
      {storyForm.open && (
        <StoryForm
          story={storyForm.item}
          onClose={() => setStoryForm({ open: false, item: null })}
          onSaved={closeFormsAndReload}
        />
      )}
      {metricForm.open && (
        <MetricForm
          metric={metricForm.item}
          onClose={() => setMetricForm({ open: false, item: null })}
          onSaved={closeFormsAndReload}
        />
      )}
    </AdminLayout>
  );
}

function Loading() {
  return (
    <div className="flex min-h-64 items-center justify-center gap-3 text-gray-600">
      <Loader2 className="h-5 w-5 animate-spin text-[#00337C]" />
      Loading impact content...
    </div>
  );
}
function Empty({ icon, title, message, action, actionLabel }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      {createElement(icon, { className: "mx-auto h-10 w-10 text-gray-300" })}
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-gray-600">{message}</p>
      <button
        type="button"
        onClick={action}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </button>
    </div>
  );
}
