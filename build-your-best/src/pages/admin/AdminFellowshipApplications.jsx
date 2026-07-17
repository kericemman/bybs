import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import RichTextEditor from "../../layouts/RichEditor";
import { useAuth } from "../../context/AuthContext";
import { isFullAdmin } from "../../utils/adminPermissions";
import { compressImageFile } from "../../utils/imageCompression";
import {
  deleteFellowshipApplication,
  getFellowshipApplications,
  screenFellowshipApplications,
  sendBulkFellowshipInvites,
  sendFellowshipInvite,
  updateFellowshipApplication,
  uploadFellowshipInviteImage,
} from "../../api/fellowshipApplication.api";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Mail,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
  XCircle,
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

const screeningGroups = [
  { value: "all", label: "All groups" },
  { value: "unscreened", label: "Unscreened" },
  { value: "accepted", label: "Accepted group" },
  { value: "not_qualified", label: "Not qualified" },
];

const statusStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  reviewing: "bg-amber-50 text-amber-700 border-amber-100",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  invited: "bg-teal-50 text-teal-700 border-teal-100",
  declined: "bg-red-50 text-red-700 border-red-100",
};

const groupStyles = {
  unscreened: "bg-slate-50 text-slate-600 border-slate-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  not_qualified: "bg-red-50 text-red-700 border-red-100",
};

const fixedCohortSchedule = "Saturday and Sunday every week, 2:00 PM - 4:00 PM CAT";
const defaultInviteMessage = `
<p>Congratulations. After reviewing your application, we are pleased to invite you to the next step of the BYBS Fellowship Cohort 4 selection process.</p>
<p>Please confirm your availability for the Saturday and Sunday sessions from 2:00 PM to 4:00 PM CAT.</p>
<p>We will share onboarding details after your confirmation.</p>
`;

const formatAvailability = (value) => {
  if (value === "yes") return "Yes, can commit";
  if (value === "mostly") return "Mostly, with minor constraints";
  if (value === "not-sure") return "Not sure yet";
  return value || "Not provided";
};

const formatGroup = (value) => {
  if (value === "accepted") return "Accepted group";
  if (value === "not_qualified") return "Not qualified";
  return "Unscreened";
};

const escapeCsv = (value = "") => `"${String(value).replaceAll('"', '""')}"`;

export default function AdminFellowshipApplications() {
  const { admin } = useAuth();
  const canDelete = isFullAdmin(admin);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [screening, setScreening] = useState(false);
  const [screeningSummary, setScreeningSummary] = useState(null);
  const [inviteSubject, setInviteSubject] = useState("Invitation: BYBS Fellowship Cohort 4");
  const [inviteMessage, setInviteMessage] = useState(defaultInviteMessage);
  const [sendingInvites, setSendingInvites] = useState(false);

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

    if (groupFilter !== "all") {
      results = results.filter(
        (application) => (application.screeningGroup || "unscreened") === groupFilter
      );
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
        application.screeningReasons?.join(" "),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [applications, groupFilter, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return applications.reduce(
      (summary, application) => {
        const group = application.screeningGroup || "unscreened";
        return {
          ...summary,
          [application.status]: (summary[application.status] || 0) + 1,
          [group]: (summary[group] || 0) + 1,
          total: summary.total + 1,
        };
      },
      { total: 0 }
    );
  }, [applications]);

  const selectedApplications = useMemo(
    () => applications.filter((application) => selectedIds.includes(application._id)),
    [applications, selectedIds]
  );

  const acceptedReadyForInvite = useMemo(
    () =>
      applications.filter(
        (application) =>
          (application.screeningGroup || "unscreened") === "accepted" &&
          application.status !== "invited"
      ),
    [applications]
  );

  const inviteTargets = selectedApplications.length ? selectedApplications : acceptedReadyForInvite;

  const mergeApplication = (updatedApplication) => {
    setApplications((current) =>
      current.map((item) => (item._id === updatedApplication._id ? updatedApplication : item))
    );
    setSelectedApplication((current) =>
      current?._id === updatedApplication._id ? updatedApplication : current
    );
  };

  const updateStatus = async (application, status) => {
    try {
      const { data } = await updateFellowshipApplication(application._id, { status });
      mergeApplication(data);
    } catch (updateError) {
      alert(updateError.response?.data?.message || "Failed to update status.");
    }
  };

  const updateScreeningGroup = async (application, screeningGroup) => {
    try {
      const status = screeningGroup === "accepted" ? "accepted" : screeningGroup === "not_qualified" ? "declined" : application.status;
      const { data } = await updateFellowshipApplication(application._id, {
        screeningGroup,
        status,
      });
      mergeApplication(data);
    } catch (updateError) {
      alert(updateError.response?.data?.message || "Failed to update screening group.");
    }
  };

  const saveNotes = async () => {
    if (!selectedApplication) return;

    try {
      setSavingNotes(true);
      const { data } = await updateFellowshipApplication(selectedApplication._id, {
        adminNotes: selectedApplication.adminNotes || "",
      });
      mergeApplication(data);
    } catch (updateError) {
      alert(updateError.response?.data?.message || "Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const runAutomatedScreening = async (force = false) => {
    try {
      setScreening(true);
      setError("");
      const { data } = await screenFellowshipApplications({ force });
      setScreeningSummary(data.summary);
      if (Array.isArray(data.applications)) {
        setApplications((current) => {
          const updates = new Map(data.applications.map((application) => [application._id, application]));
          return current.map((application) => updates.get(application._id) || application);
        });
      }
    } catch (screenError) {
      setError(screenError.response?.data?.message || "Failed to screen applications.");
    } finally {
      setScreening(false);
    }
  };

  const handleDelete = async (application) => {
    if (!window.confirm("Delete this fellowship application? This cannot be undone.")) return;

    try {
      await deleteFellowshipApplication(application._id);
      setApplications((current) => current.filter((item) => item._id !== application._id));
      setSelectedIds((current) => current.filter((id) => id !== application._id));
      if (selectedApplication?._id === application._id) setSelectedApplication(null);
    } catch (deleteError) {
      alert(deleteError.response?.data?.message || "Failed to delete application.");
    }
  };

  const sendOneInvite = async (application) => {
    if (!window.confirm(`Send invite to ${application.firstName} ${application.lastName}?`)) return;

    try {
      const { data } = await sendFellowshipInvite(application._id, {
        subject: inviteSubject,
        messageHtml: inviteMessage,
      });
      mergeApplication(data.application);
    } catch (inviteError) {
      alert(inviteError.response?.data?.message || "Failed to send invite.");
    }
  };

  const sendBulkInvites = async () => {
    const ids = inviteTargets.map((application) => application._id);

    if (!ids.length) {
      alert("No accepted applicants are ready for invitation.");
      return;
    }

    if (!window.confirm(`Send invitation email to ${ids.length} applicant${ids.length === 1 ? "" : "s"}?`)) return;

    try {
      setSendingInvites(true);
      const { data } = await sendBulkFellowshipInvites({
        ids,
        subject: inviteSubject,
        messageHtml: inviteMessage,
      });
      const sent = data.sent || [];
      setApplications((current) => {
        const updates = new Map(sent.map((application) => [application._id, application]));
        return current.map((application) => updates.get(application._id) || application);
      });
      setSelectedIds([]);
      alert(data.message || "Invitations sent.");
    } catch (inviteError) {
      alert(inviteError.response?.data?.message || "Failed to send invitations.");
    } finally {
      setSendingInvites(false);
    }
  };

  const handleInviteImageUpload = async (file) => {
    const compressedFile = await compressImageFile(file, {
      maxWidth: 1400,
      maxHeight: 1000,
      quality: 0.82,
    });
    const { data } = await uploadFellowshipInviteImage(compressedFile);

    return data.url;
  };

  const toggleSelected = (applicationId) => {
    setSelectedIds((current) =>
      current.includes(applicationId)
        ? current.filter((id) => id !== applicationId)
        : [...current, applicationId]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = visibleApplications.map((application) => application._id);
    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds]))
    );
  };

  const exportCsv = () => {
    const headers = [
      "Cohort",
      "Name",
      "Email",
      "Phone",
      "Country",
      "City",
      "Age Range",
      "Occupation",
      "Current Stage",
      "Status",
      "Screening Group",
      "Screening Score",
      "Screening Reasons",
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
      application.ageRange,
      application.occupation,
      application.currentStage,
      application.status,
      formatGroup(application.screeningGroup),
      application.screeningScore ?? 0,
      application.screeningReasons?.join("; "),
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
    link.download = `bybs-fellowship-screening-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="mt-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#00337C]">Cohort 4 Screening</h1>
            <p className="mt-1 text-gray-600">
              Auto-screen applicants, review grouped results, and send invitations after approval.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runAutomatedScreening(false)}
              disabled={screening}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E] disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {screening ? "Screening..." : "Run auto-screening"}
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total" value={counts.total || 0} icon={<Users className="h-5 w-5" />} tone="blue" />
          <StatCard label="Unscreened" value={counts.unscreened || 0} icon={<Clock className="h-5 w-5" />} tone="slate" />
          <StatCard label="Accepted group" value={counts.accepted || 0} icon={<CheckCircle2 className="h-5 w-5" />} tone="green" />
          <StatCard label="Not qualified" value={counts.not_qualified || 0} icon={<XCircle className="h-5 w-5" />} tone="red" />
        </div>

        {screeningSummary && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
            Auto-screening completed: {screeningSummary.screened} screened, {screeningSummary.accepted} accepted, {screeningSummary.notQualified} not qualified.
            <button
              onClick={() => runAutomatedScreening(true)}
              disabled={screening}
              className="ml-3 font-semibold underline"
            >
              Re-screen all
            </button>
          </div>
        )}

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-[#10233F]">Invitation email</h2>
            <p className="text-sm text-gray-500">
              Write the invitation once, then send it to selected applicants or the accepted group.
            </p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">Subject</span>
              <input
                value={inviteSubject}
                onChange={(event) => setInviteSubject(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              />
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <RichTextEditor
                content={inviteMessage}
                onChange={setInviteMessage}
                onImageUpload={handleInviteImageUpload}
                placeholder="Write the invitation email here..."
              />
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-gray-500">
                Target: {selectedApplications.length ? `${selectedApplications.length} selected` : `${acceptedReadyForInvite.length} accepted not invited`}
                . You can use {"{{firstName}}"}, {"{{fullName}}"}, and {"{{cohort}}"}.
              </p>
              <button
                onClick={sendBulkInvites}
                disabled={sendingInvites}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E4B9E] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {sendingInvites ? "Sending..." : "Send invitations"}
              </button>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, email, country, role, screening reason..."
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              />
            </div>
            <select
              value={groupFilter}
              onChange={(event) => setGroupFilter(event.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
            >
              {screeningGroups.map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
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
            <div className="hidden grid-cols-[auto_1fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
              <button onClick={toggleAllVisible} className="text-left">Select</button>
              <span>Applicant</span>
              <span>Screening</span>
              <span>Status</span>
              <span>Submitted</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-gray-100">
              {visibleApplications.map((application) => (
                <ApplicationRow
                  key={application._id}
                  application={application}
                  canDelete={canDelete}
                  isSelected={selectedIds.includes(application._id)}
                  onSelect={() => toggleSelected(application._id)}
                  onOpen={() => setSelectedApplication(application)}
                  onDelete={() => handleDelete(application)}
                  onInvite={() => sendOneInvite(application)}
                  onStatusChange={(status) => updateStatus(application, status)}
                  onGroupChange={(group) => updateScreeningGroup(application, group)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationDrawer
          application={selectedApplication}
          canDelete={canDelete}
          onClose={() => setSelectedApplication(null)}
          onChange={setSelectedApplication}
          onSaveNotes={saveNotes}
          savingNotes={savingNotes}
          onStatusChange={(status) => updateStatus(selectedApplication, status)}
          onGroupChange={(group) => updateScreeningGroup(selectedApplication, group)}
          onSendInvite={() => sendOneInvite(selectedApplication)}
        />
      )}
    </AdminLayout>
  );
}

function ApplicationRow({
  application,
  canDelete,
  isSelected,
  onSelect,
  onOpen,
  onDelete,
  onInvite,
  onStatusChange,
  onGroupChange,
}) {
  const group = application.screeningGroup || "unscreened";

  return (
    <div className="grid gap-4 px-5 py-5 lg:grid-cols-[auto_1fr_1fr_0.8fr_0.8fr_0.8fr] lg:items-center">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-gray-300 text-[#00337C]"
        />
      </label>
      <div>
        <p className="font-semibold text-[#10233F]">
          {application.firstName} {application.lastName}
        </p>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <Mail className="h-3.5 w-3.5" />
          {application.email}
        </div>
        <p className="mt-1 text-xs text-gray-400">{application.country} {application.city ? `- ${application.city}` : ""}</p>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <select
          value={group}
          onChange={(event) => onGroupChange(event.target.value)}
          className={`w-full rounded-full border px-3 py-2 text-xs font-semibold outline-none ${groupStyles[group]}`}
        >
          {screeningGroups.filter((item) => item.value !== "all").map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500">
          Score: {application.screeningScore ?? 0}/100
        </p>
        <p className="line-clamp-1 text-xs text-gray-400">
          {application.screeningReasons?.[0] || "Not screened yet"}
        </p>
      </div>
      <select
        value={application.status}
        onChange={(event) => onStatusChange(event.target.value)}
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
        <IconButton onClick={onOpen} title="View application" icon={<Eye className="h-4 w-4" />} />
        <IconButton onClick={onInvite} title="Send invite" icon={<Send className="h-4 w-4" />} />
        {canDelete && (
          <IconButton
            onClick={onDelete}
            title="Delete application"
            icon={<Trash2 className="h-4 w-4" />}
            danger
          />
        )}
      </div>
    </div>
  );
}

function IconButton({ onClick, title, icon, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors ${
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-gray-50 hover:text-[#00337C]"
      }`}
      title={title}
    >
      {icon}
    </button>
  );
}

function StatCard({ label, value, icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    slate: "bg-slate-50 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
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

function ApplicationDrawer({
  application,
  onClose,
  onChange,
  onSaveNotes,
  savingNotes,
  onStatusChange,
  onGroupChange,
  onSendInvite,
}) {
  const group = application.screeningGroup || "unscreened";

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
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Status
                <select
                  value={application.status}
                  onChange={(event) => onStatusChange(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
                >
                  {statuses.filter((status) => status.value !== "all").map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Screening group
                <select
                  value={group}
                  onChange={(event) => onGroupChange(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
                >
                  {screeningGroups.filter((item) => item.value !== "all").map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              onClick={onSendInvite}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E]"
            >
              <Send className="h-4 w-4" />
              Send invite
            </button>
          </div>

          <AnswerGrid
            title="Screening Result"
            items={[
              ["Group", formatGroup(group)],
              ["Score", `${application.screeningScore ?? 0}/100`],
              ["Screened", application.screenedAt ? new Date(application.screenedAt).toLocaleString() : "Not screened"],
              ["Mode", application.screeningMode || "manual"],
            ]}
          />

          {application.screeningReasons?.length > 0 && (
            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#00337C]">Screening reasons</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
                {application.screeningReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>
          )}

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
