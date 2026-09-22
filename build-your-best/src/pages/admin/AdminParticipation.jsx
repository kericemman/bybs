import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Search,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  fetchParticipationApplications,
  updateParticipationApplication,
} from "../../api/participation.api";

const types = ["all", "volunteer", "mentor", "partner", "support"];
const statuses = [
  "all",
  "new",
  "reviewing",
  "contacted",
  "accepted",
  "active",
  "inactive",
  "declined",
];
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
  new: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-800",
  contacted: "bg-violet-50 text-violet-700",
  accepted: "bg-emerald-50 text-emerald-700",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-700",
  declined: "bg-red-50 text-red-700",
};

const detailFields = {
  volunteer: [
    ["Skills", "skills"],
    ["Areas of interest", "interestAreas"],
    ["Volunteer type", "volunteerType"],
    ["Availability", "availability"],
    ["Relevant experience", "experience"],
    ["Motivation", "motivation"],
    ["LinkedIn / portfolio", "profileUrl", "url"],
  ],
  mentor: [
    ["Professional background", "professionalBackground"],
    ["Areas of expertise", "expertise"],
    ["Years of experience", "yearsExperience"],
    ["Mentorship interests", "mentorshipInterests"],
    ["Availability", "availability"],
    ["Motivation", "motivation"],
    ["Professional profile", "profileUrl", "url"],
  ],
  partner: [
    ["Organization", "organizationName"],
    ["Organization type", "organizationType"],
    ["Role / title", "roleTitle"],
    ["Partnership areas", "partnershipAreas"],
    ["Organization website", "organizationWebsite", "url"],
    ["Proposed collaboration", "proposal"],
  ],
  support: [
    ["Organization", "organizationName"],
    ["Role / title", "roleTitle"],
    ["Support area", "supportArea"],
    ["Contribution details", "contributionDetails"],
  ],
};

function ReviewModal({ application, onClose, onSaved }) {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.internalNotes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await updateParticipationApplication(application._id, {
        status,
        internalNotes: notes,
      });
      onSaved(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "This submission could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-gray-950/65 px-4 py-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Review ${application.name}`}
    >
      <div className="w-full max-w-5xl rounded-lg bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase text-[#B96500]">
              {label(application.type)} submission
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-950">{application.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Received {formatDate(application.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-5 sm:p-7">
            <section>
              <h3 className="text-sm font-semibold uppercase text-gray-500">Contact details</h3>
              <dl className="mt-4 grid gap-4 rounded-lg bg-gray-50 p-5 sm:grid-cols-2">
                <Detail label="Email" value={application.email} />
                <Detail label="Phone" value={application.phone} />
                <Detail label="Country" value={application.country} />
                <Detail label="City" value={application.city || "Not provided"} />
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${application.email}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#00337C] px-4 text-sm font-semibold text-white"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                <a
                  href={`tel:${application.phone}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </div>
            </section>
            <section className="mt-8">
              <h3 className="text-sm font-semibold uppercase text-gray-500">Submission answers</h3>
              <dl className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                {detailFields[application.type].map(([fieldLabel, key, kind]) => (
                  <Answer key={key} label={fieldLabel} value={application[key]} kind={kind} />
                ))}
              </dl>
            </section>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
              Consent recorded at submission.
            </div>
          </div>
          <aside className="border-t border-gray-200 bg-gray-50 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <h3 className="text-lg font-semibold text-gray-950">Review</h3>
            <label className="mt-5 block text-sm font-semibold text-gray-800">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal outline-none focus:border-[#00337C]"
              >
                {editableStatuses.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-5 block text-sm font-semibold text-gray-800">
              Internal notes
              <textarea
                rows={10}
                maxLength={5000}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Record review context, follow-up, or placement notes. These are never shown publicly."
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 font-normal leading-6 outline-none focus:border-[#00337C]"
              />
            </label>
            {application.reviewedAt && (
              <p className="mt-3 text-xs leading-5 text-gray-500">
                Last reviewed {formatDate(application.reviewedAt)}
                {application.reviewedBy?.name ? ` by ${application.reviewedBy.name}` : ""}.
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
              disabled={saving}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save review"
              )}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Detail({ label: fieldLabel, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-gray-500">{fieldLabel}</dt>
      <dd className="mt-1 break-words text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function Answer({ label: fieldLabel, value, kind }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className="py-5 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
      <dt className="text-sm font-semibold text-gray-800">{fieldLabel}</dt>
      <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600 sm:mt-0">
        {kind === "url" && display ? (
          <a
            href={display}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#00337C] underline underline-offset-4"
          >
            Open link <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          display || "Not provided"
        )}
      </dd>
    </div>
  );
}

export default function AdminParticipation() {
  const [applications, setApplications] = useState([]);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
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
      if (type !== "all") params.type = type;
      if (status !== "all") params.status = status;
      if (query) params.search = query;
      const { data } = await fetchParticipationApplications(params);
      setApplications(data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Participation submissions could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }, [query, status, type]);

  useEffect(() => {
    load();
  }, [load]);
  const counts = useMemo(
    () => ({
      total: applications.length,
      new: applications.filter((item) => item.status === "new").length,
      active: applications.filter((item) => ["accepted", "active"].includes(item.status)).length,
    }),
    [applications]
  );
  const submitSearch = (event) => {
    event.preventDefault();
    setQuery(search.trim());
  };
  const onSaved = (updated) => {
    setApplications((current) =>
      current.map((item) => (item._id === updated._id ? updated : item))
    );
    setSelected(updated);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#B96500]">Get involved</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-950">Participation</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Review volunteer, mentor, partner, and support submissions from one structured
              workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Refresh
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={UsersRound} label="In this view" value={counts.total} />
          <Stat icon={Clock3} label="New" value={counts.new} />
          <Stat icon={CheckCircle2} label="Accepted or active" value={counts.active} />
        </section>

        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end">
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Pathway</p>
              <div className="flex flex-wrap gap-2">
                {types.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`min-h-10 rounded-lg px-4 text-sm font-semibold ${type === item ? "bg-[#00337C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {label(item)}
                  </button>
                ))}
              </div>
            </div>
            <label className="text-xs font-semibold uppercase text-gray-500">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 block min-h-11 w-full min-w-48 rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal normal-case text-gray-900"
              >
                <option value="all">All statuses</option>
                {editableStatuses.map((item) => (
                  <option key={item} value={item}>
                    {label(item)}
                  </option>
                ))}
              </select>
            </label>
            <form onSubmit={submitSearch} className="flex min-w-0 gap-2 xl:w-80">
              <label className="sr-only" htmlFor="participation-search">
                Search
              </label>
              <input
                id="participation-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email, organization..."
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading submissions...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-700">{error}</div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <UserRound className="mx-auto h-9 w-9 text-gray-300" />
              <h2 className="mt-4 font-semibold text-gray-900">No submissions found</h2>
              <p className="mt-2 text-sm text-gray-500">
                Adjust the filters or check again after new public submissions arrive.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <button
                  key={application._id}
                  type="button"
                  onClick={() => setSelected(application)}
                  className="grid w-full gap-4 px-5 py-5 text-left transition hover:bg-gray-50 sm:grid-cols-[1.2fr_0.8fr_0.7fr_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-950">{application.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {application.organizationName || application.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Pathway</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {label(application.type)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[application.status]}`}
                    >
                      {label(application.status)}
                    </span>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(application.createdAt)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#00337C]">Review</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
      {selected && (
        <ReviewModal application={selected} onClose={() => setSelected(null)} onSaved={onSaved} />
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
