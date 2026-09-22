import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Edit3,
  Eye,
  HandHeart,
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
import { compressImageFile } from "../../utils/imageCompression";

const emptyForm = {
  title: "",
  summary: "",
  whatHappened: "",
  whyItMattered: "",
  actionDate: "",
  location: "",
  participantCount: "",
  quoteText: "",
  quoteAttribution: "",
  ctaLabel: "Learn more",
  ctaUrl: "",
  status: "draft",
  isFeatured: false,
  coverImage: null,
};

const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

function ActionForm({ action, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    action
      ? {
          title: action.title || "",
          summary: action.summary || "",
          whatHappened: action.whatHappened || "",
          whyItMattered: action.whyItMattered || "",
          actionDate: toDateInput(action.actionDate),
          location: action.location || "",
          participantCount: action.participantCount ?? "",
          quoteText: action.quote?.text || "",
          quoteAttribution: action.quote?.attribution || "",
          ctaLabel: action.ctaLabel || "Learn more",
          ctaUrl: action.ctaUrl || "",
          status: action.status || "draft",
          isFeatured: Boolean(action.isFeatured),
          coverImage: null,
        }
      : emptyForm
  );
  const [coverPreview, setCoverPreview] = useState(action?.coverImage?.url || "");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState(action?.gallery || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

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
      const { data } = await deleteCommunityActionGalleryImage(action._id, image._id);
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
          return;
        }
        data.append(key, value ?? "");
      });
      galleryFiles.forEach((file) => data.append("gallery", file));

      if (action) await updateCommunityAction(action._id, data);
      else await createCommunityAction(data);
      onSaved();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save this community action.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-gray-950/60 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-action-form-title"
    >
      <form onSubmit={submit} className="w-full max-w-4xl rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase text-[#B96500]">Community action</p>
            <h2
              id="community-action-form-title"
              className="mt-1 text-xl font-semibold text-gray-900"
            >
              {action ? "Edit action" : "Add community action"}
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

        <div className="space-y-8 p-5 sm:p-7">
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
            <div>
              <label htmlFor="action-title" className="block text-sm font-medium text-gray-800">
                Title *
              </label>
              <input
                id="action-title"
                required
                maxLength={140}
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              />
            </div>
            <div>
              <label htmlFor="action-summary" className="block text-sm font-medium text-gray-800">
                Short summary *
              </label>
              <textarea
                id="action-summary"
                required
                maxLength={600}
                rows={3}
                value={form.summary}
                onChange={(event) => update("summary", event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used on the homepage and impact page preview.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="action-date" className="block text-sm font-medium text-gray-800">
                  Date
                </label>
                <input
                  id="action-date"
                  type="date"
                  value={form.actionDate}
                  onChange={(event) => update("actionDate", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
              <div>
                <label
                  htmlFor="action-location"
                  className="block text-sm font-medium text-gray-800"
                >
                  Location
                </label>
                <input
                  id="action-location"
                  maxLength={180}
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
              <div>
                <label
                  htmlFor="action-participants"
                  className="block text-sm font-medium text-gray-800"
                >
                  Participants
                </label>
                <input
                  id="action-participants"
                  type="number"
                  min="0"
                  value={form.participantCount}
                  onChange={(event) => update("participantCount", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">The story</legend>
            <div>
              <label htmlFor="action-happened" className="block text-sm font-medium text-gray-800">
                What happened
              </label>
              <textarea
                id="action-happened"
                rows={5}
                maxLength={5000}
                value={form.whatHappened}
                onChange={(event) => update("whatHappened", event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="action-mattered" className="block text-sm font-medium text-gray-800">
                Why it mattered
              </label>
              <textarea
                id="action-mattered"
                rows={4}
                maxLength={3000}
                value={form.whyItMattered}
                onChange={(event) => update("whyItMattered", event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-[1.5fr_0.5fr]">
              <div>
                <label htmlFor="action-quote" className="block text-sm font-medium text-gray-800">
                  Quote
                </label>
                <textarea
                  id="action-quote"
                  rows={3}
                  maxLength={1000}
                  value={form.quoteText}
                  onChange={(event) => update("quoteText", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="action-attribution"
                  className="block text-sm font-medium text-gray-800"
                >
                  Attribution
                </label>
                <input
                  id="action-attribution"
                  maxLength={180}
                  value={form.quoteAttribution}
                  onChange={(event) => update("quoteAttribution", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-5 border-t border-gray-200 pt-7">
            <legend className="text-base font-semibold text-[#00337C]">Images</legend>
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
                <span className="mt-1 text-xs text-gray-500">Up to 12 images per upload</span>
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
              Publication and action
            </legend>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="action-cta-label"
                  className="block text-sm font-medium text-gray-800"
                >
                  Button label
                </label>
                <input
                  id="action-cta-label"
                  maxLength={60}
                  value={form.ctaLabel}
                  onChange={(event) => update("ctaLabel", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
              <div>
                <label htmlFor="action-cta-url" className="block text-sm font-medium text-gray-800">
                  Button destination
                </label>
                <input
                  id="action-cta-url"
                  placeholder="/support or https://..."
                  value={form.ctaUrl}
                  onChange={(event) => update("ctaUrl", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-4"
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="action-status" className="block text-sm font-medium text-gray-800">
                  Status
                </label>
                <select
                  id="action-status"
                  value={form.status}
                  onChange={(event) => {
                    update("status", event.target.value);
                    if (event.target.value === "draft") update("isFeatured", false);
                  }}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
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
                <span className="text-sm font-medium">Feature on the homepage</span>
              </label>
            </div>
          </fieldset>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-gray-300 px-6 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-6 font-semibold text-white hover:bg-[#002760] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : action ? "Save changes" : "Create action"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCommunityActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

  const loadActions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await fetchAdminCommunityActions();
      setActions(data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load community actions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  const filteredActions = useMemo(
    () =>
      actions.filter((action) => {
        const matchesStatus = status === "all" || action.status === status;
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          [action.title, action.summary, action.location]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term));
        return matchesStatus && matchesSearch;
      }),
    [actions, search, status]
  );

  const openForm = (action = null) => {
    setEditing(action);
    setFormOpen(true);
  };
  const closeForm = () => {
    setEditing(null);
    setFormOpen(false);
  };
  const handleSaved = () => {
    closeForm();
    loadActions();
  };

  const removeAction = async (action) => {
    if (!window.confirm(`Delete “${action.title}”? This cannot be undone.`)) return;
    try {
      await deleteCommunityAction(action._id);
      loadActions();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this community action.");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Impact content</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950">Community Actions</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Create and publish verified outreach and community activity for the public website.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openForm()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white hover:bg-[#002760]"
          >
            <Plus className="h-5 w-5" />
            Add community action
          </button>
        </header>

        <section
          className="grid gap-4 py-7 sm:grid-cols-3"
          aria-label="Community action statistics"
        >
          {[
            {
              label: "Total",
              value: actions.length,
              icon: <HandHeart className="h-6 w-6 text-[#00337C]" />,
            },
            {
              label: "Published",
              value: actions.filter((item) => item.status === "published").length,
              icon: <CheckCircle2 className="h-6 w-6 text-[#00337C]" />,
            },
            {
              label: "Featured",
              value: actions.filter((item) => item.isFeatured).length,
              icon: <Star className="h-6 w-6 text-[#00337C]" />,
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-950">{value}</p>
                </div>
                {icon}
              </div>
            </div>
          ))}
        </section>

        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search community actions</span>
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, summary, or location"
              className="min-h-11 w-full rounded-lg border border-gray-300 pl-11 pr-4 outline-none focus:border-[#00337C]"
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-4 sm:w-44"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        {loading ? (
          <div
            className="flex min-h-64 items-center justify-center gap-3 text-gray-600"
            role="status"
          >
            <Loader2 className="h-6 w-6 animate-spin text-[#00337C]" />
            Loading community actions
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <HandHeart className="mx-auto h-10 w-10 text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No community actions found</h2>
            <p className="mt-2 text-gray-600">
              {actions.length
                ? "Adjust the search or status filter."
                : "Add the first verified community action when it is ready."}
            </p>
            {actions.length === 0 && (
              <button
                type="button"
                onClick={() => openForm()}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Add community action
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredActions.map((action) => (
              <article
                key={action._id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="grid min-h-56 sm:grid-cols-[12rem_1fr]">
                  <div className="bg-gray-100">
                    {action.coverImage?.url ? (
                      <img
                        src={action.coverImage.url}
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${action.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                      >
                        {action.status}
                      </span>
                      {action.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#00337C]">
                          <Star className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 text-xl font-semibold text-gray-950">{action.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {action.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                      {action.actionDate && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(action.actionDate).toLocaleDateString()}
                        </span>
                      )}
                      {action.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {action.location}
                        </span>
                      )}
                      {Number.isFinite(action.participantCount) && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {action.participantCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2 pt-5">
                      <button
                        type="button"
                        onClick={() => openForm(action)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      {action.status === "published" && action.ctaUrl && (
                        <a
                          href={action.ctaUrl}
                          target={action.ctaUrl.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          aria-label={`View ${action.title}`}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-[#00337C] hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAction(action)}
                        aria-label={`Delete ${action.title}`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
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
      </div>
      {formOpen && <ActionForm action={editing} onClose={closeForm} onSaved={handleSaved} />}
    </AdminLayout>
  );
}
