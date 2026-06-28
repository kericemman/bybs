import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";
import {
  getFellowshipApplications,
  sendFellowshipInvite,
  updateFellowshipApplication,
} from "../../api/fellowshipApplication.api";
import { compressImageFile } from "../../utils/imageCompression";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Eye,
  Image as ImageIcon,
  Mail,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

const emptyForm = {
  title: "",
  tagline: "",
  description: "",
  overview: "",
  isPublished: false,
  status: "completed",
  applicationStatus: "closed",
  startDate: "",
  endDate: "",
  applicationDeadline: "",
  format: "online",
  location: "",
  schedule: "",
  capacity: "",
  price: "",
  currency: "USD",
  features: [],
  eligibility: [],
  curriculum: [],
  outcomes: [],
  whoIsItFor: [],
  whoCanApply: [],
  commitment: [],
  successStories: [],
  previousCohorts: [],
  achievements: [],
  impactHighlights: [],
  facilitators: [],
  inviteSubject: "Invitation: BYBS Fellowship",
  inviteMessage:
    "Congratulations! After reviewing your application, we would like to invite you to the next step for this BYBS Fellowship cohort. Please reply to confirm your availability and receive onboarding details.",
  coverImage: null,
};

const statusStyles = {
  upcoming: "bg-amber-50 text-amber-700",
  ongoing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
};

const applicationStatusStyles = {
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-gray-100 text-gray-600",
  "invite-only": "bg-purple-50 text-purple-700",
};

const applicationReviewStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-100",
  reviewing: "bg-amber-50 text-amber-700 border-amber-100",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  invited: "bg-teal-50 text-teal-700 border-teal-100",
  declined: "bg-red-50 text-red-700 border-red-100",
};

const reviewStatuses = ["new", "reviewing", "shortlisted", "accepted", "invited", "declined"];
const fixedCohortSchedule = "Saturday and Sunday every week, 2:00 PM - 4:00 PM CAT";
const formatAvailability = (value) => {
  if (value === "yes") return "Yes, can commit";
  if (value === "mostly") return "Mostly, with minor constraints";
  if (value === "not-sure") return "Not sure yet";
  return value || "Not provided";
};

const toInputDate = (value) => (value ? value.slice(0, 10) : "");
const toLines = (items = []) => items.join("\n");
const fromLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const matchesCohort = (application, cohort) =>
  application.cohortSlug === cohort.slug || application.cohort === cohort.title;

export default function AdminCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cohorts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCohortId, setSelectedCohortId] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cohortResponse, applicationResponse] = await Promise.all([
        api.get("/admin/cohorts"),
        getFellowshipApplications(),
      ]);
      setCohorts(cohortResponse.data || []);
      setApplications(applicationResponse.data || []);
    } catch (error) {
      console.error("Error loading cohort dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedCohort = useMemo(
    () => cohorts.find((cohort) => cohort._id === selectedCohortId) || null,
    [cohorts, selectedCohortId]
  );

  const filteredCohorts = useMemo(() => {
    if (!searchTerm.trim()) return cohorts;
    const term = searchTerm.toLowerCase();
    return cohorts.filter((cohort) =>
      [cohort.title, cohort.tagline, cohort.description, cohort.location, cohort.format]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [cohorts, searchTerm]);

  const visibleApplications = useMemo(() => {
    const scoped = selectedCohort
      ? applications.filter((application) => matchesCohort(application, selectedCohort))
      : applications;

    if (!searchTerm.trim()) return scoped;
    const term = searchTerm.toLowerCase();
    return scoped.filter((application) =>
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
  }, [applications, searchTerm, selectedCohort]);

  const stats = useMemo(() => {
    return [
      { label: "Reflections", value: cohorts.length, icon: <Users className="h-5 w-5" /> },
      { label: "Published", value: cohorts.filter((cohort) => cohort.isPublished).length, icon: <Eye className="h-5 w-5" /> },
      { label: "Open Applications", value: applications.filter((app) => app.status === "new").length, icon: <Clock className="h-5 w-5" /> },
      { label: "Invites Sent", value: applications.filter((app) => app.status === "invited").length, icon: <Send className="h-5 w-5" /> },
    ];
  }, [applications, cohorts]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCohort(null);
    setCoverPreview("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cohort) => {
    setEditingCohort(cohort);
    setForm({
      title: cohort.title || "",
      tagline: cohort.tagline || "",
      description: cohort.description || "",
      overview: cohort.overview || "",
      isPublished: Boolean(cohort.isPublished),
      status: cohort.status || "upcoming",
      applicationStatus: cohort.applicationStatus || "closed",
      startDate: toInputDate(cohort.startDate),
      endDate: toInputDate(cohort.endDate),
      applicationDeadline: toInputDate(cohort.applicationDeadline),
      format: cohort.format || "online",
      location: cohort.location || "",
      schedule: cohort.schedule || "",
      capacity: cohort.capacity || "",
      price: cohort.price || "",
      currency: cohort.currency || "USD",
      features: cohort.features || [],
      eligibility: cohort.eligibility || [],
      curriculum: cohort.curriculum || [],
      outcomes: cohort.outcomes || [],
      whoIsItFor: cohort.whoIsItFor || [],
      whoCanApply: cohort.whoCanApply || [],
      commitment: cohort.commitment || [],
      successStories: cohort.successStories || [],
      previousCohorts: cohort.previousCohorts || [],
      achievements: cohort.achievements || [],
      impactHighlights: cohort.impactHighlights || [],
      facilitators: cohort.facilitators || [],
      inviteSubject: cohort.inviteSubject || emptyForm.inviteSubject,
      inviteMessage: cohort.inviteMessage || emptyForm.inviteMessage,
      coverImage: null,
    });
    setCoverPreview(cohort.coverImage?.url || "");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setIsModalOpen(true);
  };

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const finalFile = await compressImageFile(file);
    setForm((current) => ({ ...current, coverImage: finalFile }));

    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(finalFile);
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    setGalleryFiles(files);

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    ).then(setGalleryPreviews);
  };

  const appendFormData = () => {
    const data = new FormData();
    const arrayFields = [
      "features",
      "eligibility",
      "curriculum",
      "outcomes",
      "whoIsItFor",
      "whoCanApply",
      "commitment",
      "successStories",
      "previousCohorts",
      "achievements",
      "impactHighlights",
      "facilitators",
    ];

    Object.entries(form).forEach(([key, value]) => {
      if (key === "coverImage") {
        if (value instanceof File) data.append("coverImage", value);
      } else if (arrayFields.includes(key)) {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value ?? "");
      }
    });

    galleryFiles.forEach((file) => {
      data.append("graduateGallery", file);
    });

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const data = appendFormData();
      if (editingCohort) {
        await api.put(`/admin/cohorts/${editingCohort._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/cohorts", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save cohort.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCohort = async (cohort) => {
    if (!window.confirm(`Delete ${cohort.title}? This cannot be undone.`)) return;

    try {
      await api.delete(`/admin/cohorts/${cohort._id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete cohort.");
    }
  };

  const deleteGalleryImage = async (cohort, image) => {
    if (!window.confirm("Remove this graduate image?")) return;

    try {
      await api.delete(`/admin/cohorts/${cohort._id}/gallery/${image._id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove image.");
    }
  };

  const getApplicationCount = (cohort) =>
    applications.filter((application) => matchesCohort(application, cohort)).length;

  const updateApplicationStatus = async (application, status) => {
    try {
      const { data } = await updateFellowshipApplication(application._id, { status });
      setApplications((current) =>
        current.map((item) => (item._id === data._id ? data : item))
      );
      setSelectedApplication((current) => (current?._id === data._id ? data : current));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update application.");
    }
  };

  const handleSendInvite = async (application) => {
    const cohort =
      cohorts.find((item) => matchesCohort(application, item)) ||
      cohorts.find((item) => item.slug === "bybs-fellowship-cohort-4");

    if (!window.confirm(`Send invite to ${application.firstName} ${application.lastName}?`)) return;

    try {
      const { data } = await sendFellowshipInvite(application._id, {
        subject: cohort?.inviteSubject || emptyForm.inviteSubject,
        message: cohort?.inviteMessage || emptyForm.inviteMessage,
      });
      setApplications((current) =>
        current.map((item) => (item._id === data.application._id ? data.application : item))
      );
      setSelectedApplication((current) =>
        current?._id === data.application._id ? data.application : current
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send invite.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#00337C]">Cohort Reflections</h1>
            <p className="mt-1 text-gray-600">
              Capture the journey of previous cohorts, achievements, impact moments, and graduate galleries.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E]"
          >
            <Plus className="h-4 w-4" />
            Add Reflection
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-light text-gray-900">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#00337C]">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["cohorts", "Reflections"],
                ["applications", "Applications"],
                ["gallery", "Graduate Gallery"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === value
                      ? "bg-[#00337C] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-[260px_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
                />
              </div>
              <select
                value={selectedCohortId}
                onChange={(event) => setSelectedCohortId(event.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              >
                <option value="all">All cohorts</option>
                {cohorts.map((cohort) => (
                  <option key={cohort._id} value={cohort._id}>
                    {cohort.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00337C] border-t-transparent" />
          </div>
        ) : (
          <>
            {activeTab === "cohorts" && (
              <CohortCards
                cohorts={filteredCohorts}
                applications={applications}
                onEdit={openEditModal}
                onDelete={deleteCohort}
                onViewApplications={(cohort) => {
                  setSelectedCohortId(cohort._id);
                  setActiveTab("applications");
                }}
                getApplicationCount={getApplicationCount}
              />
            )}

            {activeTab === "applications" && (
              <ApplicationsTable
                applications={visibleApplications}
                onStatusChange={updateApplicationStatus}
                onSendInvite={handleSendInvite}
                onViewApplication={setSelectedApplication}
              />
            )}

            {activeTab === "gallery" && (
              <GraduateGallery
                cohorts={selectedCohort ? [selectedCohort] : cohorts}
                onEdit={openEditModal}
                onDeleteImage={deleteGalleryImage}
              />
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <CohortModal
          form={form}
          updateForm={updateForm}
          coverPreview={coverPreview}
          galleryPreviews={galleryPreviews}
          editingCohort={editingCohort}
          saving={saving}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleSubmit}
          onCoverChange={handleCoverChange}
          onGalleryChange={handleGalleryChange}
        />
      )}

      {selectedApplication && (
        <ApplicationAnswersDrawer
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusChange={(status) => updateApplicationStatus(selectedApplication, status)}
          onSendInvite={() => handleSendInvite(selectedApplication)}
        />
      )}
    </AdminLayout>
  );
}

function CohortCards({ cohorts, applications, onEdit, onDelete, onViewApplications, getApplicationCount }) {
  if (!cohorts.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
        <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-xl font-light text-gray-700">No cohort reflections found</h2>
        <p className="mt-2 text-gray-500">Add a reflection from a previous cohort to begin documenting the journey.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {cohorts.map((cohort) => {
        const applicationCount = getApplicationCount(cohort);
        const invitedCount = applications.filter(
          (application) => matchesCohort(application, cohort) && application.status === "invited"
        ).length;

        return (
          <article key={cohort._id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="grid md:grid-cols-[190px_1fr]">
              <div className="h-52 bg-gray-100 md:h-full">
                {cohort.coverImage?.url ? (
                  <img src={cohort.coverImage.url} alt={cohort.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[cohort.status]}`}>
                    {cohort.status}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationStatusStyles[cohort.applicationStatus]}`}>
                    Applications {cohort.applicationStatus || "closed"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cohort.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    {cohort.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[#00337C]">{cohort.title}</h2>
                {cohort.tagline && <p className="mt-1 text-sm font-medium text-[#B76E79]">{cohort.tagline}</p>}
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                  {cohort.description || cohort.overview || "No description added yet."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <InfoChip icon={<Calendar className="h-4 w-4" />} text={cohort.startDate ? new Date(cohort.startDate).toLocaleDateString() : "No date"} />
                  <InfoChip icon={<Users className="h-4 w-4" />} text={`${cohort.capacity || 0} spots`} />
                  <InfoChip icon={<Mail className="h-4 w-4" />} text={`${applicationCount} applications`} />
                  <InfoChip icon={<Send className="h-4 w-4" />} text={`${invitedCount} invites`} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => onEdit(cohort)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button onClick={() => onViewApplications(cohort)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                    Applications
                  </button>
                  <button onClick={() => onDelete(cohort)} className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ApplicationsTable({ applications, onStatusChange, onSendInvite, onViewApplication }) {
  if (!applications.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
        <Mail className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-xl font-light text-gray-700">No applications here yet</h2>
        <p className="mt-2 text-gray-500">Submitted applications will appear in this review queue.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[1.05fr_1.2fr_0.75fr_0.7fr_0.9fr] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
        <span>Applicant</span>
        <span>Apply-cohort answers</span>
        <span>Status</span>
        <span>Submitted</span>
        <span className="text-right">Action</span>
      </div>
      <div className="divide-y divide-gray-100">
        {applications.map((application) => (
          <div key={application._id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.05fr_1.2fr_0.75fr_0.7fr_0.9fr] lg:items-center">
            <div>
              <p className="font-semibold text-[#10233F]">
                {application.firstName} {application.lastName}
              </p>
              <p className="mt-1 text-sm text-gray-500">{application.email}</p>
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
              onChange={(event) => onStatusChange(application, event.target.value)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold capitalize outline-none ${applicationReviewStyles[application.status]}`}
            >
              {reviewStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">{new Date(application.createdAt).toLocaleDateString()}</p>
            <div className="flex justify-start gap-2 lg:justify-end">
              <button onClick={() => onViewApplication(application)} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-[#00337C]">
                <Eye className="h-4 w-4" />
              </button>
              <a href={`mailto:${application.email}`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
                <Mail className="h-4 w-4" />
              </a>
              <button onClick={() => onSendInvite(application)} className="inline-flex items-center gap-2 rounded-lg bg-[#00337C] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1E4B9E]">
                <Send className="h-4 w-4" />
                Invite
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApplicationAnswersDrawer({ application, onClose, onStatusChange, onSendInvite }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45">
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
            <label className="text-sm font-medium text-gray-700">Application status</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                value={application.status}
                onChange={(event) => onStatusChange(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
              >
                {reviewStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={onSendInvite}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00337C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E4B9E]"
              >
                <Send className="h-4 w-4" />
                Invite
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

          <AnswerBlock title={`Why ${application.cohort}`} value={application.motivation} />
          <AnswerBlock title="Growth goals" value={application.growthGoals} />
          <AnswerBlock title="Current challenge" value={application.challenge} />
          <AnswerBlock title="Contribution to the cohort community" value={application.contribution} />

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

function AnswerBlock({ title, value }) {
  return (
    <section className="rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-[#10233F]">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
        {value || "Not provided"}
      </p>
    </section>
  );
}

function GraduateGallery({ cohorts, onEdit, onDeleteImage }) {
  const hasImages = cohorts.some((cohort) => cohort.gallery?.length);

  if (!cohorts.length || !hasImages) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-xl font-light text-gray-700">No graduate images yet</h2>
        <p className="mt-2 text-gray-500">Edit a completed cohort and upload previous graduate gallery images.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cohorts.map((cohort) => (
        <section key={cohort._id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#00337C]">{cohort.title}</h2>
              <p className="text-sm text-gray-500">{cohort.gallery?.length || 0} images</p>
            </div>
            <button onClick={() => onEdit(cohort)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              Add Images
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(cohort.gallery || []).map((image) => (
              <div key={image._id || image.url} className="group relative overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                <img src={image.url} alt={image.caption || cohort.title} className="aspect-[4/3] w-full object-cover" />
                <button
                  onClick={() => onDeleteImage(cohort, image)}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CohortModal({
  form,
  updateForm,
  coverPreview,
  galleryPreviews,
  editingCohort,
  saving,
  onClose,
  onSubmit,
  onCoverChange,
  onGalleryChange,
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 px-4 py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between bg-[#00337C] px-6 py-5 text-white">
          <div>
            <p className="text-sm text-white/70">Journey archive</p>
            <h2 className="text-2xl font-light">{editingCohort ? "Edit Reflection" : "Add Cohort Reflection"}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[78vh] overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <FormSection title="Reflection Basics">
                <Field label="Cohort name" required value={form.title} onChange={(value) => updateForm("title", value)} />
                <Field label="Short reflection tagline" value={form.tagline} onChange={(value) => updateForm("tagline", value)} />
                <TextArea
                  label="Journey summary"
                  value={form.description}
                  onChange={(value) => updateForm("description", value)}
                  rows={4}
                />
                <TextArea
                  label="Full reflection"
                  value={form.overview}
                  onChange={(value) => updateForm("overview", value)}
                  rows={7}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Public visibility" value={String(form.isPublished)} onChange={(value) => updateForm("isPublished", value === "true")} options={[["false", "Draft"], ["true", "Published"]]} />
                  <Field type="date" label="Cohort date or start" value={form.startDate} onChange={(value) => updateForm("startDate", value)} />
                  <Field type="date" label="Cohort end date" value={form.endDate} onChange={(value) => updateForm("endDate", value)} />
                  <Field label="Participants / graduates" type="number" value={form.capacity} onChange={(value) => updateForm("capacity", value)} />
                </div>
              </FormSection>

              <FormSection title="Cover and Graduate Gallery">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Cover image</span>
                  <input type="file" accept="image/*" onChange={onCoverChange} className="hidden" id="cohortCoverImage" />
                  <label htmlFor="cohortCoverImage" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-4 text-sm text-gray-600 hover:border-[#00337C]">
                    <Upload className="h-4 w-4" />
                    Choose cover image
                  </label>
                </label>
                {coverPreview && <img src={coverPreview} alt="Cover preview" className="h-40 w-full rounded-lg object-cover" />}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Gallery from this cohort</span>
                  <input type="file" accept="image/*" multiple onChange={onGalleryChange} className="hidden" id="cohortGalleryImages" />
                  <label htmlFor="cohortGalleryImages" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-4 text-sm text-gray-600 hover:border-[#00337C]">
                    <ImageIcon className="h-4 w-4" />
                    Add cohort images
                  </label>
                </label>
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {galleryPreviews.map((preview, index) => (
                      <img key={preview || index} src={preview} alt="Gallery preview" className="aspect-square rounded-lg object-cover" />
                    ))}
                  </div>
                )}
              </FormSection>
            </div>

            <div className="space-y-6">
              <FormSection title="Journey Reflections">
                <ArrayTextarea
                  label="Previous cohort reflections"
                  values={form.previousCohorts}
                  onChange={(items) => updateForm("previousCohorts", items)}
                  placeholder="Example: Cohort 1 helped young leaders define purpose, confidence, and discipline."
                />
                <ArrayTextarea
                  label="Journey achievements"
                  values={form.achievements}
                  onChange={(items) => updateForm("achievements", items)}
                  placeholder="Example: Graduates launched projects, joined leadership spaces, or built new habits."
                />
                <ArrayTextarea
                  label="Impact moments"
                  values={form.impactHighlights}
                  onChange={(items) => updateForm("impactHighlights", items)}
                  placeholder="Example: Alumni stories, community wins, testimonies, or visible growth from past cohorts."
                />
                <ArrayTextarea
                  label="Graduate stories or quotes"
                  values={form.successStories}
                  onChange={(items) => updateForm("successStories", items)}
                  placeholder="Example: A graduate found clarity, confidence, and a stronger sense of direction."
                />
              </FormSection>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#00337C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E4B9E] disabled:opacity-60">
              {saving ? "Saving..." : editingCohort ? "Update Reflection" : "Save Reflection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoChip({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-[#00337C]">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-100 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#00337C]">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, required = false, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
        required={required}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ArrayTextarea({ label, values, onChange, placeholder = "One item per line" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={toLines(values)}
        onChange={(event) => onChange(fromLines(event.target.value))}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
      />
    </label>
  );
}
