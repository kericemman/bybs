import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  ImagePlus,
  Loader2,
  MessageSquareText,
  Plus,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  createReflectionPrompt,
  deleteReflectionPrompt,
  fetchAdminReflectionPrompts,
  fetchAdminReflectionSubmissions,
  updateReflectionPrompt,
  updateReflectionSubmission,
} from "../../api/reflection.api";
import { compressImageFile } from "../../utils/imageCompression";

const emptyPrompt = {
  title: "",
  question: "",
  description: "",
  weekLabel: "",
  reflectionDate: "",
  opensAt: "",
  closesAt: "",
  status: "draft",
  featuredImage: null,
};

const toInputDate = (value, includeTime = false) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset).toISOString();
  return includeTime ? local.slice(0, 16) : local.slice(0, 10);
};

function ModalShell({ title, eyebrow, onClose, children, maxWidth = "max-w-4xl" }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/65 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`w-full ${maxWidth} rounded-lg bg-white shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase text-[#B96500]">{eyebrow}</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PromptForm({ prompt, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    prompt
      ? {
          title: prompt.title || "",
          question: prompt.question || "",
          description: prompt.description || "",
          weekLabel: prompt.weekLabel || "",
          reflectionDate: toInputDate(prompt.reflectionDate),
          opensAt: toInputDate(prompt.opensAt, true),
          closesAt: toInputDate(prompt.closesAt, true),
          status: prompt.status || "draft",
          featuredImage: null,
        }
      : emptyPrompt
  );
  const [preview, setPreview] = useState(prompt?.featuredImage?.url || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const chooseImage = async (event) => {
    const source = event.target.files?.[0];
    if (!source) return;
    const file = await compressImageFile(source);
    update("featuredImage", file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "featuredImage") {
          if (value instanceof File) data.append(key, value);
        } else data.append(key, value || "");
      });
      if (prompt) await updateReflectionPrompt(prompt._id, data);
      else await createReflectionPrompt(data);
      onSaved();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this prompt.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={prompt ? "Edit weekly prompt" : "Create weekly prompt"}
      eyebrow="Weekly Reflection"
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-7 p-5 sm:p-7">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-gray-800 md:col-span-2">
            Internal/public title
            <input
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
              placeholder="Finding courage in uncertain seasons"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800 md:col-span-2">
            Reflection question
            <textarea
              required
              rows={3}
              value={form.question}
              onChange={(event) => update("question", event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal leading-7 outline-none focus:border-[#00337C]"
              placeholder="What are you learning about..."
            />
          </label>
          <label className="text-sm font-semibold text-gray-800 md:col-span-2">
            Supporting description
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal leading-7 outline-none focus:border-[#00337C]"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Week label
            <input
              required
              value={form.weekLabel}
              onChange={(event) => update("weekLabel", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
              placeholder="Week of 21 September 2026"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Reflection date
            <input
              required
              type="date"
              value={form.reflectionDate}
              onChange={(event) => update("reflectionDate", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Opens
            <input
              required
              type="datetime-local"
              value={form.opensAt}
              onChange={(event) => update("opensAt", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Closes
            <input
              required
              type="datetime-local"
              value={form.closesAt}
              onChange={(event) => update("closesAt", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal outline-none focus:border-[#00337C]"
            />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Status
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal outline-none focus:border-[#00337C]"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
            <span className="mt-2 block text-xs font-normal leading-5 text-gray-500">
              Making this active automatically closes any other active prompt.
            </span>
          </label>
          <label className="cursor-pointer text-sm font-semibold text-gray-800">
            Featured image <span className="font-normal text-gray-400">(optional)</span>
            <span className="mt-2 flex min-h-28 items-center gap-4 rounded-lg border border-dashed border-gray-300 p-3">
              {preview ? (
                <img
                  src={preview}
                  alt="Prompt preview"
                  className="h-20 w-28 rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-20 w-28 items-center justify-center rounded-lg bg-gray-100">
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                </span>
              )}
              <span className="font-normal text-gray-600">Choose image</span>
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={chooseImage}
              className="sr-only"
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00337C] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save prompt"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function SubmissionReview({ submission, onClose, onSaved }) {
  const [form, setForm] = useState({
    status: submission.status || "pending",
    displayExcerpt: submission.displayExcerpt || "",
    internalNotes: submission.internalNotes || "",
    publishAnonymously: Boolean(submission.publishAnonymously),
    scheduledFor: toInputDate(submission.scheduledFor, true),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateReflectionSubmission(submission._id, form);
      onSaved();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update this submission.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title={`Review ${submission.name}`}
      eyebrow={submission.prompt?.weekLabel || "Reflection submission"}
      onClose={onClose}
      maxWidth="max-w-5xl"
    >
      <form onSubmit={save} className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-gray-200 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          <div className="flex items-start gap-4">
            {submission.profilePhoto?.url ? (
              <img
                src={submission.profilePhoto.url}
                alt={submission.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <UserRound className="h-7 w-7 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-950">{submission.name}</h3>
              <p className="text-sm text-gray-500">{submission.email}</p>
              <p className="mt-1 text-sm text-gray-600">
                {[submission.relationship, submission.city, submission.country]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-[#F7F9FC] p-5">
            <p className="text-xs font-semibold uppercase text-[#B96500]">Full response</p>
            <p className="mt-4 whitespace-pre-line leading-8 text-gray-800">
              {submission.response}
            </p>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
            <p>
              Publish consent: <strong>{submission.consentToPublish ? "Yes" : "No"}</strong>
            </p>
            <p>
              Image consent: <strong>{submission.consentToUseImage ? "Yes" : "No"}</strong>
            </p>
            <p>
              Anonymous preference: <strong>{submission.publishAnonymously ? "Yes" : "No"}</strong>
            </p>
            {submission.socialProfile && (
              <a
                href={submission.socialProfile}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#00337C]"
              >
                Open social profile
              </a>
            )}
          </div>
        </div>
        <div className="space-y-5 p-5 sm:p-7">
          <label className="block text-sm font-semibold text-gray-800">
            Moderation status
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="featured">Featured</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            Public excerpt <span className="font-normal text-gray-400">(optional)</span>
            <textarea
              rows={6}
              maxLength={1200}
              value={form.displayExcerpt}
              onChange={(event) => update("displayExcerpt", event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal leading-7"
              placeholder="Leave empty to publish the full response."
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            Schedule publication <span className="font-normal text-gray-400">(optional)</span>
            <input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(event) => update("scheduledFor", event.target.value)}
              className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 font-normal"
            />
          </label>
          <label className="flex gap-3 rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.publishAnonymously}
              disabled={submission.anonymousRequested}
              onChange={(event) => update("publishAnonymously", event.target.checked)}
              className="mt-1 h-4 w-4 disabled:opacity-60"
            />
            <span>
              {submission.anonymousRequested
                ? "The contributor requested anonymity. This cannot be disabled."
                : "Publish anonymously. This hides their name, location, photo, role, and social profile."}
            </span>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            Internal notes
            <textarea
              rows={5}
              maxLength={4000}
              value={form.internalNotes}
              onChange={(event) => update("internalNotes", event.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal leading-7"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving review..." : "Save review"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default function AdminReflections() {
  const [tab, setTab] = useState("prompts");
  const [prompts, setPrompts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promptModal, setPromptModal] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [filters, setFilters] = useState({ prompt: "all", status: "all", search: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [promptResponse, submissionResponse] = await Promise.all([
        fetchAdminReflectionPrompts(),
        fetchAdminReflectionSubmissions(filters),
      ]);
      setPrompts(promptResponse.data || []);
      setSubmissions(submissionResponse.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load weekly reflections.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => ({
      active: prompts.filter((prompt) => prompt.status === "active").length,
      pending: submissions.filter((submission) => submission.status === "pending").length,
      published: submissions.filter((submission) =>
        ["approved", "featured"].includes(submission.status)
      ).length,
    }),
    [prompts, submissions]
  );

  const removePrompt = async (prompt) => {
    if (
      !window.confirm(
        `Delete "${prompt.title}"? Prompts with submissions must be archived instead.`
      )
    )
      return;
    try {
      await deleteReflectionPrompt(prompt._id);
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this prompt.");
    }
  };

  const closePromptModal = () => setPromptModal(null);
  const promptSaved = async () => {
    closePromptModal();
    await load();
  };
  const reviewSaved = async () => {
    setReviewing(null);
    await load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Community engagement</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950">Weekly Reflections</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Create the weekly question, review every answer, and control exactly what appears
              publicly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPromptModal({ mode: "create" })}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New weekly prompt
          </button>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Active prompt",
              stats.active,
              <BookOpenText key="active" className="h-5 w-5 text-[#D67A00]" />,
            ],
            [
              "Awaiting review",
              stats.pending,
              <Clock3 key="pending" className="h-5 w-5 text-[#D67A00]" />,
            ],
            [
              "Published voices",
              stats.published,
              <CheckCircle2 key="published" className="h-5 w-5 text-[#D67A00]" />,
            ],
          ].map(([label, value, icon]) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
              {icon}
              <p className="mt-4 text-3xl font-semibold text-[#00337C]">{value}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab("prompts")}
            className={`min-h-12 border-b-2 px-5 text-sm font-semibold ${tab === "prompts" ? "border-[#00337C] text-[#00337C]" : "border-transparent text-gray-500"}`}
          >
            Prompts
          </button>
          <button
            type="button"
            onClick={() => setTab("submissions")}
            className={`min-h-12 border-b-2 px-5 text-sm font-semibold ${tab === "submissions" ? "border-[#00337C] text-[#00337C]" : "border-transparent text-gray-500"}`}
          >
            Submissions
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#00337C]" />
          </div>
        ) : tab === "prompts" ? (
          prompts.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {prompts.map((prompt) => (
                <article
                  key={prompt._id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="grid min-h-56 sm:grid-cols-[11rem_1fr]">
                    {prompt.featuredImage?.url ? (
                      <img
                        src={prompt.featuredImage.url}
                        alt=""
                        className="h-full min-h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex min-h-48 items-center justify-center bg-gray-100">
                        <BookOpenText className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col p-5">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${prompt.status === "active" ? "bg-green-50 text-green-700" : prompt.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {prompt.status}
                        </span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#00337C]">
                          {prompt.submissionCounts?.total || 0} responses
                        </span>
                      </div>
                      <p className="mt-3 text-xs font-semibold uppercase text-[#B96500]">
                        {prompt.weekLabel}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-gray-950">{prompt.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                        {prompt.question}
                      </p>
                      <div className="mt-auto flex gap-2 pt-5">
                        <button
                          type="button"
                          onClick={() => setPromptModal({ mode: "edit", prompt })}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTab("submissions");
                            setFilters((current) => ({ ...current, prompt: prompt._id }));
                          }}
                          aria-label={`View responses for ${prompt.title}`}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-[#00337C]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePrompt(prompt)}
                          aria-label={`Delete ${prompt.title}`}
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
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <BookOpenText className="mx-auto h-9 w-9 text-gray-300" />
              <h2 className="mt-4 font-semibold text-gray-900">No weekly prompts yet</h2>
              <p className="mt-2 text-sm text-gray-500">
                Create the first prompt when you are ready to invite reflections.
              </p>
            </div>
          )
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[1fr_14rem_12rem]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, search: event.target.value }))
                  }
                  placeholder="Search name, email, or country"
                  className="min-h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm"
                />
              </label>
              <select
                value={filters.prompt}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, prompt: event.target.value }))
                }
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="all">All weeks</option>
                {prompts.map((prompt) => (
                  <option key={prompt._id} value={prompt._id}>
                    {prompt.weekLabel}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, status: event.target.value }))
                }
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="all">All statuses</option>
                {["pending", "approved", "featured", "rejected", "archived"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            {submissions.length ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <button
                      type="button"
                      key={submission._id}
                      onClick={() => setReviewing(submission)}
                      className="grid w-full gap-4 p-5 text-left hover:bg-gray-50 md:grid-cols-[1fr_11rem_9rem_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-gray-950">
                            {submission.name}
                          </h3>
                          {submission.status === "featured" && (
                            <Star className="h-4 w-4 fill-[#D67A00] text-[#D67A00]" />
                          )}
                        </div>
                        <p className="mt-1 truncate text-sm text-gray-500">{submission.email}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                          {submission.response}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">{submission.prompt?.weekLabel}</p>
                        <p className="mt-1 text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${submission.status === "pending" ? "bg-amber-50 text-amber-700" : ["approved", "featured"].includes(submission.status) ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {submission.status}
                      </span>
                      <MessageSquareText className="h-5 w-5 text-[#00337C]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
                <MessageSquareText className="mx-auto h-9 w-9 text-gray-300" />
                <h2 className="mt-4 font-semibold text-gray-900">No matching submissions</h2>
                <p className="mt-2 text-sm text-gray-500">
                  New responses will appear here for review.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {promptModal && (
        <PromptForm prompt={promptModal.prompt} onClose={closePromptModal} onSaved={promptSaved} />
      )}
      {reviewing && (
        <SubmissionReview
          submission={reviewing}
          onClose={() => setReviewing(null)}
          onSaved={reviewSaved}
        />
      )}
    </AdminLayout>
  );
}
