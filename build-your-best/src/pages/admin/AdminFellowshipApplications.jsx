import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  deleteFellowshipApplication,
  getFellowshipApplications,
  sendFellowshipInvite,
  updateFellowshipApplication,
} from "../../api/fellowshipApplication.api";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Mail,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";

const statuses = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "invited", label: "Invited" },
  { value: "declined", label: "Declined" },
];

const statusStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  reviewing: "bg-amber-50 text-amber-700 border-amber-100",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  invited: "bg-teal-50 text-teal-700 border-teal-100",
  declined: "bg-red-50 text-red-700 border-red-100",
};

const fixedCohortSchedule = "Saturday and Sunday every week, 2:00 PM - 4:00 PM CAT";
const formatAvailability = (value) => {
  if (value === "yes") return "Yes, can commit";
  if (value === "mostly") return "Mostly, with minor constraints";
  if (value === "not-sure") return "Not sure yet";
  return value || "Not provided";
};

const escapeCsv = (value = "") => `"${String(value).replaceAll('"', '""')}"`;

export default function AdminFellowshipApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getFellowshipApplications();
      setApplications(data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const visibleApplications = useMemo(() => {
    let results = [...applications];

    if (statusFilter !== "all") {
      results = results.filter((application) => application.status === statusFilter);
    }

    if (!searchTerm.trim()) return results;

    const term = searchTerm.toLowerCase();
    return results.filter((application) =>
      [
        application.firstName,
        application.lastName,
        application.email,
        application.phone,
        application.country,
        application.occupation,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [applications, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return applications.reduce(
      (summary, application) => ({
        ...summary,
        [application.status]: (summary[application.status] || 0) + 1,
        total: summary.total + 1,
      }),
      { total: 0 }
    );
  }, [applications]);

  const updateStatus = async (application, status) => {
    try {
      const { data } = await updateFellowshipApplication(application._id, { status });
      setApplications((current) =>
        current.map((item) => (item._id === data._id ? data : item))
      );
      setSelectedApplication((current) => (current?._id === data._id ? data : current));
    } catch (updateError) {
      alert(updateError.response?.data?.message || "Failed to update status.");
    }
  };

  const saveNotes = async () => {
    if (!selectedApplication) return;

    try {
      setSavingNotes(true);
      const { data } = await updateFellowshipApplication(selectedApplication._id, {
        adminNotes: selectedApplication.adminNotes || "",
      });
      setApplications((current) =>
        current.map((item) => (item._id === data._id ? data : item))
      );
      setSelectedApplication(data);
    } catch (updateError) {
      alert(updateError.response?.data?.message || "Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (application) => {
    if (!window.confirm("Delete this fellowship application? This cannot be undone.")) return;

    try {
      await deleteFellowshipApplication(application._id);
      setApplications((current) => current.filter((item) => item._id !== application._id));
      if (selectedApplication?._id === application._id) setSelectedApplication(null);
    } catch (deleteError) {
      alert(deleteError.response?.data?.message || "Failed to delete application.");
    }
  };

  const handleSendInvite = async (application) => {
    if (!window.confirm(`Send invite to ${application.firstName} ${application.lastName}?`)) return;

    try {
      const { data } = await sendFellowshipInvite(application._id, {
        subject: `Invitation: ${application.cohort || "BYBS Fellowship"}`,
      });
      setApplications((current) =>
        current.map((item) => (item._id === data.application._id ? data.application : item))
      );
      setSelectedApplication((current) =>
        current?._id === data.application._id ? data.application : current
      );
    } catch (inviteError) {
      alert(inviteError.response?.data?.message || "Failed to send invite.");
    }
  };

  const exportCsv = () => {
    const headers = [
      "Cohort",
      "Name",
      "Email",
      "Phone",
      "Country",
      "City",
      "Profile Link",
      "Age Range",
      "Occupation",
      "Current Stage",
      "Status",
      "Cohort Schedule",
      "Can Commit To Schedule",
      "Growth Focus Areas",
      "Why They Want To Join",
      "Growth Goals",
      "Current Challenge",
      "Community Contribution",
      "How They Heard About This",
      "Submitted",
    ];
    const rows = visibleApplications.map((application) => [
      application.cohort,
      `${application.firstName} ${application.lastName}`,
      application.email,
      application.phone,
      application.country,
      application.city,
      application.linkedinUrl,
      application.ageRange,
      application.occupation,
      application.currentStage,
      application.status,
      application.cohortSchedule || fixedCohortSchedule,
      formatAvailability(application.availability),
      application.focusAreas?.join(", "),
      application.motivation,
      application.growthGoals,
      application.challenge,
      application.contribution,
      application.heardFrom,
      new Date(application.createdAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bybs-fellowship-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#00337C]">Fellowship Applications</h1>
            <p className="mt-1 text-gray-600">
              Review answers submitted from the BYBS fellowship application form.
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total" value={counts.total || 0} icon={<Users className="h-5 w-5" />} tone="blue" />
          <StatCard label="New" value={counts.new || 0} icon={<Clock className="h-5 w-5" />} tone="amber" />
          <StatCard label="Shortlisted" value={counts.shortlisted || 0} icon={<Eye className="h-5 w-5" />} tone="purple" />
          <StatCard label="Accepted" value={counts.accepted || 0} icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, email, phone, country, role..."
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00337C] border-t-transparent" />
          </div>
        ) : visibleApplications.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h2 className="text-xl font-light text-gray-700">No applications found</h2>
            <p className="mt-2 text-gray-500">Applications will appear here when people submit a cohort form.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.05fr_1.2fr_0.75fr_0.7fr_0.7fr] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
              <span>Applicant</span>
              <span>Apply-cohort answers</span>
              <span>Status</span>
              <span>Submitted</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-gray-100">
              {visibleApplications.map((application) => (
                <div
                  key={application._id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.05fr_1.2fr_0.75fr_0.7fr_0.7fr] lg:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#10233F]">
                      {application.firstName} {application.lastName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      {application.email}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-[#10233F]">
                      {formatAvailability(application.availability)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {application.focusAreas?.length
                        ? application.focusAreas.join(", ")
                        : "No focus areas selected"}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-gray-400">
                      {application.challenge || "No challenge answer"}
                    </p>
                  </div>
                  <select
                    value={application.status}
                    onChange={(event) => updateStatus(application, event.target.value)}
                    className={`w-full rounded-full border px-3 py-2 text-xs font-semibold capitalize outline-none ${statusStyles[application.status]}`}
                  >
                    {statuses.filter((status) => status.value !== "all").map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-start gap-2 lg:justify-end">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#00337C]"
                      title="View application"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSendInvite(application)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-[#00337C]"
                      title="Send invite"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(application)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationDrawer
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onChange={setSelectedApplication}
          onSaveNotes={saveNotes}
          savingNotes={savingNotes}
          onStatusChange={(status) => updateStatus(selectedApplication, status)}
          onSendInvite={() => handleSendInvite(selectedApplication)}
        />
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value, icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-light text-gray-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ApplicationDrawer({ application, onClose, onChange, onSaveNotes, savingNotes, onStatusChange, onSendInvite }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-3xl overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white p-5">
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">Apply-cohort answers</p>
            <h2 className="mt-1 text-2xl font-light text-[#00337C]">
              {application.firstName} {application.lastName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{application.cohort}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl border border-gray-100 p-4">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                value={application.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              >
                {statuses.filter((status) => status.value !== "all").map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button
                onClick={onSendInvite}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E]"
              >
                <Send className="h-4 w-4" />
                Send invite
              </button>
            </div>
          </div>

          <AnswerGrid
            title="Personal Details"
            items={[
              ["Name", `${application.firstName} ${application.lastName}`],
              ["Email", application.email],
              ["Phone / WhatsApp", application.phone],
              ["Country", application.country],
              ["City", application.city],
              ["Professional profile link", application.linkedinUrl],
              ["Age range", application.ageRange],
              ["Occupation / current role", application.occupation],
              ["Current stage of life", application.currentStage],
            ]}
          />

          <LongAnswer title={`Why ${application.cohort}`} value={application.motivation} />
          <LongAnswer title="Growth goals" value={application.growthGoals} />
          <LongAnswer title="Current challenge" value={application.challenge} />
          <LongAnswer title="Contribution to the cohort community" value={application.contribution} />

          <AnswerGrid
            title="Schedule and Focus"
            items={[
              ["Cohort schedule", application.cohortSchedule || fixedCohortSchedule],
              ["Can commit to schedule", formatAvailability(application.availability)],
              ["Growth focus areas", application.focusAreas?.join(", ")],
              ["How they heard about this", application.heardFrom],
              ["Submitted", application.createdAt ? new Date(application.createdAt).toLocaleString() : ""],
            ]}
          />

          {application.inviteSentAt && (
            <AnswerGrid
              title="Invite Tracking"
              items={[
                ["Invite sent", new Date(application.inviteSentAt).toLocaleString()],
                ["Invite subject", application.inviteSubject],
                ["Invite message", application.inviteMessage],
              ]}
            />
          )}

          <div className="rounded-xl border border-gray-100 p-4">
            <label className="text-sm font-medium text-gray-700">Admin notes</label>
            <textarea
              value={application.adminNotes || ""}
              onChange={(event) => onChange({ ...application, adminNotes: event.target.value })}
              rows={5}
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              placeholder="Add review notes, interview outcome, or follow-up reminders..."
            />
            <button
              onClick={onSaveNotes}
              disabled={savingNotes}
              className="mt-3 rounded-lg bg-[#00337C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1E4B9E] disabled:opacity-60"
            >
              {savingNotes ? "Saving..." : "Save notes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerGrid({ title, items }) {
  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[#00337C]">{title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            {label === "Professional profile link" && value ? (
              <a href={value} target="_blank" rel="noreferrer" className="mt-1 block break-words text-sm font-medium text-[#00337C]">
                {value}
              </a>
            ) : (
              <p className="mt-1 whitespace-pre-line break-words text-sm font-medium leading-6 text-gray-800">
                {value || "Not provided"}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function LongAnswer({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-[#10233F]">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
        {value || "Not provided"}
      </p>
    </div>
  );
}
