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
  sendBulkFellowshipRegrets,
  sendFellowshipInvite,
  sendFellowshipRegret,
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
const defaultRegretMessage = `
<p>Thank you for the time, honesty, and care you put into your BYBS Fellowship Cohort 4 application.</p>
<p>After reviewing your application, we are not able to offer you a place in this cohort. This decision does not reduce the value of your story or your potential.</p>
<p>We encourage you to stay connected with BYBS and look out for future learning opportunities, articles, and community programs.</p>
`;

const isUnsuccessfulApplication = (application) =>
  (application.screeningGroup || "unscreened") === "not_qualified" ||
  application.status === "declined";

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
  const [regretSubject, setRegretSubject] = useState(
    "Update on your BYBS Fellowship Cohort 4 application"
  );
  const [regretMessage, setRegretMessage] = useState(defaultRegretMessage);
  const [sendingRegrets, setSendingRegrets] = useState(false);
  const [composerMode, setComposerMode] = useState("invite");
  const [showInviteComposer, setShowInviteComposer] = useState(false);

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

  const selectedAcceptedApplications = useMemo(
    () =>
      selectedApplications.filter(
        (application) =>
          (application.screeningGroup || "unscreened") === "accepted" &&
          application.status !== "invited"
      ),
    [selectedApplications]
  );

  const notQualifiedReadyForRegret = useMemo(
    () =>
      applications.filter(
        (application) => isUnsuccessfulApplication(application) && !application.regretSentAt
      ),
    [applications]
  );

  const selectedUnsuccessfulApplications = useMemo(
    () =>
      selectedApplications.filter(
        (application) => isUnsuccessfulApplication(application) && !application.regretSentAt
      ),
    [selectedApplications]
  );

  const inviteTargets = selectedAcceptedApplications.length
    ? selectedAcceptedApplications
    : acceptedReadyForInvite;
  const regretTargets = selectedUnsuccessfulApplications.length
    ? selectedUnsuccessfulApplications
    : notQualifiedReadyForRegret;

  const mergeApplication = (updatedApplication) => {
    setApplications((current) =>
      current.map((item) => (item._id === updatedApplication._id ? updatedApplication : item))
    );
    setSelectedApplication((current) =>
      current?._id === updatedApplication._id ? updatedApplication : current
    );
  };

  const openComposer = (mode) => {
    setComposerMode(mode);
    setShowInviteComposer(true);
  };

  const toggleComposer = (mode) => {
    setComposerMode(mode);
    setShowInviteComposer((current) => (composerMode === mode ? !current : true));
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
      const status =
        screeningGroup === "accepted"
          ? "accepted"
          : screeningGroup === "not_qualified"
            ? "declined"
            : application.status;
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
          const updates = new Map(
            data.applications.map((application) => [application._id, application])
          );
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

  const sendOneRegret = async (application) => {
    if (!isUnsuccessfulApplication(application)) {
      alert("Move this applicant to Not qualified or Declined before sending a regret email.");
      return;
    }

    if (application.regretSentAt) {
      alert("A regret email has already been sent to this applicant.");
      return;
    }

    if (!window.confirm(`Send regret email to ${application.firstName} ${application.lastName}?`))
      return;

    try {
      const { data } = await sendFellowshipRegret(application._id, {
        subject: regretSubject,
        messageHtml: regretMessage,
      });
      mergeApplication(data.application);
    } catch (regretError) {
      alert(regretError.response?.data?.message || "Failed to send regret email.");
    }
  };

  const sendBulkInvites = async () => {
    const ids = inviteTargets.map((application) => application._id);

    if (!ids.length) {
      alert("No accepted applicants are ready for invitation.");
      return;
    }

    if (
      !window.confirm(
        `Send invitation email to ${ids.length} applicant${ids.length === 1 ? "" : "s"}?`
      )
    )
      return;

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

  const sendBulkRegrets = async () => {
    const ids = regretTargets.map((application) => application._id);

    if (!ids.length) {
      alert("No not-qualified applicants are ready for regret emails.");
      return;
    }

    if (
      !window.confirm(`Send regret email to ${ids.length} applicant${ids.length === 1 ? "" : "s"}?`)
    )
      return;

    try {
      setSendingRegrets(true);
      const { data } = await sendBulkFellowshipRegrets({
        ids,
        subject: regretSubject,
        messageHtml: regretMessage,
      });
      const sent = data.sent || [];
      setApplications((current) => {
        const updates = new Map(sent.map((application) => [application._id, application]));
        return current.map((application) => updates.get(application._id) || application);
      });
      setSelectedIds([]);
      alert(data.message || "Regret emails sent.");
    } catch (regretError) {
      alert(regretError.response?.data?.message || "Failed to send regret emails.");
    } finally {
      setSendingRegrets(false);
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

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bybs-fellowship-screening-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const isRegretComposer = composerMode === "regret";
  const composerSubject = isRegretComposer ? regretSubject : inviteSubject;
  const composerMessage = isRegretComposer ? regretMessage : inviteMessage;
  const composerTargets = isRegretComposer ? regretTargets : inviteTargets;
  const selectedComposerTargets = isRegretComposer
    ? selectedUnsuccessfulApplications.length
    : selectedAcceptedApplications.length;
  const composerTargetLabel = isRegretComposer
    ? "not-qualified applicants not yet emailed"
    : "accepted not invited";
  const composerHeading = isRegretComposer ? "Regret email" : "Invitation email";
  const composerButtonLabel = isRegretComposer ? "Send regret emails" : "Send invitations";
  const composerSending = isRegretComposer ? sendingRegrets : sendingInvites;
  const composerSendAction = isRegretComposer ? sendBulkRegrets : sendBulkInvites;
  const updateComposerSubject = isRegretComposer ? setRegretSubject : setInviteSubject;
  const updateComposerMessage = isRegretComposer ? setRegretMessage : setInviteMessage;

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
              onClick={() => toggleComposer("invite")}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                composerMode === "invite" && showInviteComposer
                  ? "border-[#00337C] bg-[#00337C] text-white"
                  : "border-[#00337C] text-[#00337C] hover:bg-[#F5F9FF]"
              }`}
            >
              <Mail className="h-4 w-4" />
              Invitation email
            </button>
            <button
              onClick={() => toggleComposer("regret")}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                composerMode === "regret" && showInviteComposer
                  ? "border-red-700 bg-red-700 text-white"
                  : "border-red-200 text-red-700 hover:bg-red-50"
              }`}
            >
              <XCircle className="h-4 w-4" />
              Regret email
            </button>
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
          <StatCard
            label="Total"
            value={counts.total || 0}
            icon={<Users className="h-5 w-5" />}
            tone="blue"
          />
          <StatCard
            label="Unscreened"
            value={counts.unscreened || 0}
            icon={<Clock className="h-5 w-5" />}
            tone="slate"
          />
          <StatCard
            label="Accepted group"
            value={counts.accepted || 0}
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="green"
          />
          <StatCard
            label="Not qualified"
            value={counts.not_qualified || 0}
            icon={<XCircle className="h-5 w-5" />}
            tone="red"
          />
        </div>

        <WorkflowPanel
          acceptedCount={acceptedReadyForInvite.length}
          regretCount={notQualifiedReadyForRegret.length}
          selectedAcceptedCount={selectedAcceptedApplications.length}
          selectedRegretCount={selectedUnsuccessfulApplications.length}
          onOpenInviteComposer={() => openComposer("invite")}
          onOpenRegretComposer={() => openComposer("regret")}
          onRunScreening={() => runAutomatedScreening(false)}
          screening={screening}
        />

        {screeningSummary && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
            Auto-screening completed: {screeningSummary.screened} screened,{" "}
            {screeningSummary.accepted} accepted, {screeningSummary.notQualified} not qualified.
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#10233F]">{composerHeading}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Target:{" "}
                {selectedComposerTargets
                  ? `${selectedComposerTargets} selected`
                  : `${composerTargets.length} ${composerTargetLabel}`}
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openComposer("invite")}
                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  composerMode === "invite"
                    ? "border-[#00337C] bg-[#F5F9FF] text-[#00337C]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Mail className="h-4 w-4" />
                Invite
              </button>
              <button
                type="button"
                onClick={() => openComposer("regret")}
                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  composerMode === "regret"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <XCircle className="h-4 w-4" />
                Regret
              </button>
              <button
                type="button"
                onClick={() => setShowInviteComposer((current) => !current)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                {showInviteComposer ? "Hide composer" : "Open composer"}
              </button>
            </div>
          </div>

          {showInviteComposer ? (
            <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Subject</span>
                <input
                  value={composerSubject}
                  onChange={(event) => updateComposerSubject(event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
                />
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <RichTextEditor
                  content={composerMessage}
                  onChange={updateComposerMessage}
                  onImageUpload={handleInviteImageUpload}
                  placeholder={
                    isRegretComposer
                      ? "Write the regret email here..."
                      : "Write the invitation email here..."
                  }
                />
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-500">
                  Use {"{{firstName}}"}, {"{{fullName}}"}, and {"{{cohort}}"} to personalize each
                  message.
                </p>
                <button
                  onClick={composerSendAction}
                  disabled={composerSending}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
                    isRegretComposer
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-[#00337C] hover:bg-[#1E4B9E]"
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {composerSending ? "Sending..." : composerButtonLabel}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Subject</p>
                <p className="mt-1 text-sm font-medium text-[#10233F]">{composerSubject}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Recipients</p>
                <p className="mt-1 text-sm font-medium text-[#10233F]">{composerTargets.length}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Email type</p>
                <p className="mt-1 text-sm font-medium text-[#10233F]">
                  {isRegretComposer ? "Regret / unsuccessful" : "Invitation / accepted"}
                </p>
              </div>
            </div>
          )}
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
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00337C] border-t-transparent" />
          </div>
        ) : visibleApplications.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h2 className="text-xl font-light text-gray-700">No applications found</h2>
            <p className="mt-2 text-gray-500">
              Applications will appear here when people submit a cohort form.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="hidden grid-cols-[auto_1fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
              <button onClick={toggleAllVisible} className="text-left">
                Select
              </button>
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
                  onRegret={() => sendOneRegret(application)}
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
          onSendRegret={() => sendOneRegret(selectedApplication)}
        />
      )}
    </AdminLayout>
  );
}

function WorkflowPanel({
  acceptedCount,
  regretCount,
  selectedAcceptedCount,
  selectedRegretCount,
  onOpenInviteComposer,
  onOpenRegretComposer,
  onRunScreening,
  screening,
}) {
  const steps = [
    {
      title: "Auto-screen",
      copy: "Group applicants into accepted and not qualified lists.",
      action: screening ? "Screening..." : "Run",
      onClick: onRunScreening,
      disabled: screening,
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      title: "Review answers",
      copy: "Open each application to confirm context and add notes.",
      action: "Use table",
      icon: <Eye className="h-4 w-4" />,
    },
    {
      title: "Invite",
      copy: selectedAcceptedCount
        ? `${selectedAcceptedCount} selected accepted applicants ready for invitation.`
        : `${acceptedCount} accepted applicants ready for invitations.`,
      action: "Compose",
      onClick: onOpenInviteComposer,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      title: "Regret",
      copy: selectedRegretCount
        ? `${selectedRegretCount} selected unsuccessful applicants ready for regret email.`
        : `${regretCount} not-qualified applicants ready for regret email.`,
      action: "Compose",
      onClick: onOpenRegretComposer,
      icon: <XCircle className="h-4 w-4" />,
      danger: true,
    },
  ];

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#00337C]">
          Screening workflow
        </p>
        <h2 className="text-xl font-semibold text-[#10233F]">Review applicants in clear stages</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white ${
                  step.danger ? "text-red-700" : "text-[#00337C]"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Step {index + 1}
              </span>
            </div>
            <h3 className="font-semibold text-[#10233F]">{step.title}</h3>
            <p className="mt-1 min-h-[40px] text-sm leading-5 text-gray-600">{step.copy}</p>
            {step.onClick ? (
              <button
                type="button"
                onClick={step.onClick}
                disabled={step.disabled}
                className={`mt-4 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-white disabled:opacity-60 ${
                  step.danger ? "border-red-200 text-red-700" : "border-[#00337C] text-[#00337C]"
                }`}
              >
                {step.icon}
                {step.action}
              </button>
            ) : (
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500">
                <CheckCircle2 className="h-4 w-4" />
                {step.action}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
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
  onRegret,
  onStatusChange,
  onGroupChange,
}) {
  const group = application.screeningGroup || "unscreened";
  const unsuccessful = isUnsuccessfulApplication(application);

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
        <p className="mt-1 text-xs text-gray-400">
          {application.country} {application.city ? `- ${application.city}` : ""}
        </p>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <select
          value={group}
          onChange={(event) => onGroupChange(event.target.value)}
          className={`w-full rounded-full border px-3 py-2 text-xs font-semibold outline-none ${groupStyles[group]}`}
        >
          {screeningGroups
            .filter((item) => item.value !== "all")
            .map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
        </select>
        <p className="text-xs text-gray-500">Score: {application.screeningScore ?? 0}/100</p>
        <p className="line-clamp-1 text-xs text-gray-400">
          {application.screeningReasons?.[0] || "Not screened yet"}
        </p>
      </div>
      <select
        value={application.status}
        onChange={(event) => onStatusChange(event.target.value)}
        className={`w-full rounded-full border px-3 py-2 text-xs font-semibold capitalize outline-none ${statusStyles[application.status]}`}
      >
        {statuses
          .filter((status) => status.value !== "all")
          .map((status) => (
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
        {unsuccessful ? (
          <IconButton
            onClick={onRegret}
            title={application.regretSentAt ? "Regret email already sent" : "Send regret email"}
            icon={<XCircle className="h-4 w-4" />}
            danger
            disabled={Boolean(application.regretSentAt)}
          />
        ) : (
          <IconButton
            onClick={onInvite}
            title={application.status === "invited" ? "Invitation already sent" : "Send invite"}
            icon={<Send className="h-4 w-4" />}
            disabled={application.status === "invited"}
          />
        )}
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

function IconButton({ onClick, title, icon, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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
  onSendRegret,
}) {
  const group = application.screeningGroup || "unscreened";
  const unsuccessful = isUnsuccessfulApplication(application);

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
                  {statuses
                    .filter((status) => status.value !== "all")
                    .map((status) => (
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
                  {screeningGroups
                    .filter((item) => item.value !== "all")
                    .map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            {unsuccessful ? (
              <button
                type="button"
                onClick={onSendRegret}
                disabled={Boolean(application.regretSentAt)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                {application.regretSentAt ? "Regret sent" : "Send regret email"}
              </button>
            ) : (
              <button
                type="button"
                onClick={onSendInvite}
                disabled={application.status === "invited"}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {application.status === "invited" ? "Invite sent" : "Send invite"}
              </button>
            )}
          </div>

          <AnswerGrid
            title="Screening Result"
            items={[
              ["Group", formatGroup(group)],
              ["Score", `${application.screeningScore ?? 0}/100`],
              [
                "Screened",
                application.screenedAt
                  ? new Date(application.screenedAt).toLocaleString()
                  : "Not screened",
              ],
              ["Mode", application.screeningMode || "manual"],
            ]}
          />

          {application.screeningReasons?.length > 0 && (
            <section className="rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#00337C]">
                Screening reasons
              </h3>
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
          <LongAnswer
            title="Contribution to the cohort community"
            value={application.contribution}
          />

          <AnswerGrid
            title="Schedule and Focus"
            items={[
              ["Cohort schedule", application.cohortSchedule || fixedCohortSchedule],
              ["Can commit to schedule", formatAvailability(application.availability)],
              ["Growth focus areas", application.focusAreas?.join(", ")],
              ["How they heard about this", application.heardFrom],
              [
                "Submitted",
                application.createdAt ? new Date(application.createdAt).toLocaleString() : "",
              ],
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

          {application.regretSentAt && (
            <AnswerGrid
              title="Regret Tracking"
              items={[
                ["Regret sent", new Date(application.regretSentAt).toLocaleString()],
                ["Regret subject", application.regretSubject],
                ["Regret message", application.regretMessage],
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
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-words text-sm font-medium text-[#00337C]"
              >
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
