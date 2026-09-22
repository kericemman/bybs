import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Loader2,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  deleteAdminTestimonial,
  fetchAdminTestimonials,
  updateAdminTestimonial,
} from "../../api/testimonial.api";
import {
  TESTIMONIAL_CATEGORIES,
  TESTIMONIAL_MAX_WORDS,
  TESTIMONIAL_MIN_WORDS,
  countTestimonialWords,
  testimonialCategoryLabel,
} from "../../config/testimonials";

const statuses = ["all", "pending", "approved", "featured", "rejected", "archived"];
const editableStatuses = statuses.slice(1);
const label = (value) =>
  String(value || "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
const statusStyles = {
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-700",
  featured: "bg-blue-50 text-[#00337C]",
  rejected: "bg-red-50 text-red-700",
  archived: "bg-gray-100 text-gray-600",
};

function ReviewModal({ item, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    roleTitle: item.roleTitle || "",
    testimonial: item.testimonial,
    status: item.status,
    internalNotes: item.internalNotes || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const wordCount = countTestimonialWords(form.testimonial);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const updateCopy = (value) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    update(
      "testimonial",
      words.length > TESTIMONIAL_MAX_WORDS ? words.slice(0, TESTIMONIAL_MAX_WORDS).join(" ") : value
    );
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await updateAdminTestimonial(item._id, form);
      onSaved(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This testimonial could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${item.name}'s testimonial? This cannot be undone.`)) return;
    setDeleting(true);
    setError("");
    try {
      await deleteAdminTestimonial(item._id);
      onDeleted(item._id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This testimonial could not be deleted.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/65 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-review-title"
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase text-[#B96500]">Testimonial review</p>
            <h2 id="testimonial-review-title" className="mt-1 text-xl font-semibold text-gray-950">
              {item.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">Received {formatDate(item.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close testimonial review"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-start">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                {item.profilePhoto?.url ? (
                  <img
                    src={item.profilePhoto.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <UserRound className="h-9 w-9 text-gray-300" />
                  </div>
                )}
              </div>
              <dl className="grid gap-4 rounded-lg bg-gray-50 p-5 sm:grid-cols-2">
                <Detail term="Email" value={item.email} />
                <Detail term="Category" value={testimonialCategoryLabel(item.category)} />
                <Detail term="Role or title" value={item.roleTitle || "Not provided"} />
                <Detail term="Words" value={`${item.wordCount} words`} />
              </dl>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Display name" htmlFor="testimonial-admin-name">
                <input
                  id="testimonial-admin-name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  maxLength={140}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3"
                />
              </Field>
              <Field label="Category" htmlFor="testimonial-admin-category">
                <select
                  id="testimonial-admin-category"
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
                >
                  {TESTIMONIAL_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Role or title" htmlFor="testimonial-admin-role">
              <input
                id="testimonial-admin-role"
                value={form.roleTitle}
                onChange={(event) => update("roleTitle", event.target.value)}
                maxLength={160}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3"
              />
            </Field>
            <Field label="Testimonial" htmlFor="testimonial-admin-copy">
              <textarea
                id="testimonial-admin-copy"
                rows={9}
                value={form.testimonial}
                onChange={(event) => updateCopy(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 leading-7"
              />
              <span
                className={`mt-2 block text-right text-xs font-semibold ${wordCount < TESTIMONIAL_MIN_WORDS ? "text-red-700" : "text-gray-500"}`}
              >
                {wordCount} / {TESTIMONIAL_MAX_WORDS} words
              </span>
            </Field>
          </div>

          <aside className="border-t border-gray-200 bg-gray-50 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <h3 className="text-lg font-semibold text-gray-950">Publication</h3>
            <Field label="Status" htmlFor="testimonial-admin-status">
              <select
                id="testimonial-admin-status"
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3"
              >
                {editableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {label(status)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Internal notes" htmlFor="testimonial-admin-notes">
              <textarea
                id="testimonial-admin-notes"
                rows={9}
                value={form.internalNotes}
                onChange={(event) => update("internalNotes", event.target.value)}
                maxLength={4000}
                placeholder="Review context or editing notes"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 leading-6"
              />
            </Field>
            {item.reviewedAt && (
              <p className="mt-3 text-xs leading-5 text-gray-500">
                Last reviewed {formatDate(item.reviewedAt)}
                {item.reviewedBy?.name ? ` by ${item.reviewedBy.name}` : ""}.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving || deleting || wordCount < TESTIMONIAL_MIN_WORDS}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save testimonial"
              )}
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={saving || deleting}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 font-semibold text-red-700 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete testimonial"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label: fieldLabel, htmlFor, children }) {
  return (
    <label className="mt-5 block text-sm font-semibold text-gray-800" htmlFor={htmlFor}>
      {fieldLabel}
      {children}
    </label>
  );
}

function Detail({ term, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-gray-500">{term}</dt>
      <dd className="mt-1 break-words text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (category !== "all") params.category = category;
      if (query) params.search = query;
      const { data } = await fetchAdminTestimonials(params);
      setItems(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Testimonial submissions could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }, [category, query, status]);

  useEffect(() => {
    load();
  }, [load]);
  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      published: items.filter((item) => ["approved", "featured"].includes(item.status)).length,
    }),
    [items]
  );
  const onSaved = (updated) => {
    setItems((current) =>
      current.map((item) => {
        if (item._id === updated._id) return updated;
        if (updated.status === "featured" && item.status === "featured") {
          return { ...item, status: "approved" };
        }
        return item;
      })
    );
    setSelected(updated);
  };
  const onDeleted = (id) => {
    setItems((current) => current.filter((item) => item._id !== id));
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Community voices</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950">Testimonials</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Review incoming stories, refine display copy, and control which testimonials appear
              publicly.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800"
          >
            Refresh
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={UserRound} label="In this view" value={counts.total} />
          <Stat icon={Clock3} label="Pending" value={counts.pending} />
          <Stat icon={CheckCircle2} label="Published" value={counts.published} />
        </section>

        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(search.trim());
            }}
            className="grid gap-4 lg:grid-cols-[1fr_12rem_14rem_auto] lg:items-end"
          >
            <label
              className="text-xs font-semibold uppercase text-gray-500"
              htmlFor="testimonial-search"
            >
              Search
              <input
                id="testimonial-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email, title, or words..."
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm font-normal normal-case"
              />
            </label>
            <label
              className="text-xs font-semibold uppercase text-gray-500"
              htmlFor="testimonial-status"
            >
              Status
              <select
                id="testimonial-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal normal-case"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All statuses" : label(item)}
                  </option>
                ))}
              </select>
            </label>
            <label
              className="text-xs font-semibold uppercase text-gray-500"
              htmlFor="testimonial-category-filter"
            >
              Category
              <select
                id="testimonial-category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal normal-case"
              >
                <option value="all">All categories</option>
                {TESTIMONIAL_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 text-sm font-semibold text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading testimonials...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-700">{error}</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="mx-auto h-9 w-9 text-gray-300" />
              <h2 className="mt-4 font-semibold text-gray-900">No testimonials found</h2>
              <p className="mt-2 text-sm text-gray-500">
                Adjust the filters or check again after new stories are submitted.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="grid w-full gap-4 px-5 py-5 text-left transition hover:bg-gray-50 sm:grid-cols-[3rem_1.2fr_0.9fr_0.7fr_auto] sm:items-center"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                    {item.profilePhoto?.url ? (
                      <img
                        src={item.profilePhoto.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <UserRound className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-950">{item.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{item.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Category</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {testimonialCategoryLabel(item.category)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {item.status === "featured" && <Star className="h-3.5 w-3.5" />}
                      {label(item.status)}
                    </span>
                    <p className="mt-2 text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#00337C]">Review</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
      {selected && (
        <ReviewModal
          item={selected}
          onClose={() => setSelected(null)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </AdminLayout>
  );
}

function Stat({ icon, label: statLabel, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{statLabel}</span>
        {createElement(icon, { className: "h-5 w-5 text-[#00337C]" })}
      </div>
      <p className="mt-3 text-3xl font-semibold text-gray-950">{value}</p>
    </div>
  );
}
