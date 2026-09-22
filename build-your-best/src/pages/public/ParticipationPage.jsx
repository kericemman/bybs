import { useState } from "react";
import { ArrowLeft, Check, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { submitParticipation } from "../../api/participation.api";
import { CountrySelectField, PhoneNumberField } from "../../components/forms/ContactFields";
import { isValidInternationalPhone } from "../../utils/phone";

const volunteerAreas = [
  "Mentor",
  "Facilitator",
  "Career support",
  "Programme volunteer",
  "Community outreach",
  "Event support",
  "Content creation",
  "Photography / videography",
  "Graphic design",
  "Social media",
  "Fundraising",
  "Technology support",
  "Administration",
  "Partnerships",
];

const mentorAreas = [
  "Career development",
  "Leadership",
  "Personal growth",
  "Entrepreneurship",
  "Communication",
  "Fellowship learning support",
];

const partnershipAreas = [
  "Fellowship sponsorship",
  "EmpowerHer initiatives",
  "Mentorship",
  "Community outreach",
  "Training",
  "Resources",
  "Events",
  "Employment and career access",
  "Technology support",
  "Venue support",
  "Strategic partnership",
];

const organizationTypes = [
  "Company",
  "NGO",
  "Foundation",
  "University or college",
  "Training organization",
  "Community group",
  "Government or public institution",
  "Other",
];

const pageContent = {
  volunteer: {
    eyebrow: "Volunteer with BYBS",
    title: "Put your time and skills where they can help people grow.",
    description:
      "Join practical work across programmes, outreach, events, communications, technology, and operations.",
    formTitle: "Volunteer application",
    next: "The team reviews your fit and current needs. Suitable applicants are contacted for a focused conversation; submitting does not guarantee placement.",
  },
  mentor: {
    eyebrow: "Become a BYBS mentor",
    title: "Help someone move forward with clarity and practical perspective.",
    description:
      "Share relevant professional or life experience through structured mentorship in the Fellowship or wider BYBS community.",
    formTitle: "Mentor application",
    next: "BYBS reviews your experience and mentorship interests, then contacts you when there is a suitable programme or participant match.",
  },
  partner: {
    eyebrow: "Partner with BYBS",
    title: "Build useful opportunities through shared purpose.",
    description:
      "Collaborate on learning, mentorship, outreach, employment access, resources, events, or long-term programme support.",
    formTitle: "Partnership enquiry",
    next: "The team reviews strategic fit and follows up to scope the opportunity. An enquiry is the start of a conversation, not a formal agreement.",
  },
};

const baseForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  consent: false,
  skills: "",
  interestAreas: [],
  availability: "",
  experience: "",
  motivation: "",
  profileUrl: "",
  volunteerType: "",
  professionalBackground: "",
  expertise: "",
  yearsExperience: "",
  mentorshipInterests: [],
  organizationName: "",
  organizationType: "",
  roleTitle: "",
  partnershipAreas: [],
  organizationWebsite: "",
  proposal: "",
};

const inputClass =
  "mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal text-gray-900 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/10";
const textareaClass = `${inputClass} min-h-32 py-3 leading-7`;

function Field({ label, optional = false, children, className = "" }) {
  return (
    <label className={`block text-sm font-semibold text-gray-800 ${className}`}>
      {label}
      {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
      {children}
    </label>
  );
}

function ChoiceGrid({ legend, options, selected, onToggle, columns = "sm:grid-cols-2" }) {
  return (
    <fieldset className="mt-7">
      <legend className="text-sm font-semibold text-gray-800">{legend}</legend>
      <div className={`mt-3 grid gap-2 ${columns}`}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${active ? "border-[#00337C] bg-[#F5F9FF] text-[#00337C]" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(option)}
                className="sr-only"
              />
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${active ? "border-[#00337C] bg-[#00337C] text-white" : "border-gray-300"}`}
              >
                {active && <Check className="h-3.5 w-3.5" />}
              </span>
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function CommonFields({ form, update }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name">
        <input
          required
          autoComplete="name"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Email address">
        <input
          required
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className={inputClass}
        />
      </Field>
      <PhoneNumberField required value={form.phone} onChange={(value) => update("phone", value)} />
      <CountrySelectField
        required
        value={form.country}
        onChange={(value) => update("country", value)}
      />
      <Field label="City" optional>
        <input
          autoComplete="address-level2"
          value={form.city}
          onChange={(event) => update("city", event.target.value)}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function VolunteerFields({ form, update, toggle }) {
  return (
    <>
      <Field label="Skills" className="mt-7">
        <input
          required
          value={form.skills}
          onChange={(event) => update("skills", event.target.value)}
          placeholder="For example: facilitation, design, bookkeeping"
          className={inputClass}
        />
      </Field>
      <ChoiceGrid
        legend="Areas of interest"
        options={volunteerAreas}
        selected={form.interestAreas}
        onToggle={(value) => toggle("interestAreas", value)}
      />
      <fieldset className="mt-7">
        <legend className="text-sm font-semibold text-gray-800">Preferred volunteer type</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            { value: "one-time", label: "One-time" },
            { value: "project-based", label: "Project-based" },
            { value: "ongoing", label: "Ongoing" },
          ].map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium ${form.volunteerType === option.value ? "border-[#00337C] bg-[#F5F9FF] text-[#00337C]" : "border-gray-200 text-gray-700"}`}
            >
              <input
                required
                type="radio"
                name="volunteerType"
                value={option.value}
                checked={form.volunteerType === option.value}
                onChange={(event) => update("volunteerType", event.target.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Availability" className="mt-7">
        <textarea
          required
          value={form.availability}
          onChange={(event) => update("availability", event.target.value)}
          placeholder="Tell us the days, times, and frequency you can realistically commit."
          className={textareaClass}
        />
      </Field>
      <Field label="Relevant experience" className="mt-7">
        <textarea
          required
          value={form.experience}
          onChange={(event) => update("experience", event.target.value)}
          placeholder="Share practical experience related to the areas you selected."
          className={textareaClass}
        />
      </Field>
      <Field label="Why do you want to volunteer with BYBS?" className="mt-7">
        <textarea
          required
          minLength={30}
          value={form.motivation}
          onChange={(event) => update("motivation", event.target.value)}
          className={textareaClass}
        />
      </Field>
      <Field label="LinkedIn or portfolio" optional className="mt-7">
        <input
          type="url"
          value={form.profileUrl}
          onChange={(event) => update("profileUrl", event.target.value)}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
    </>
  );
}

function MentorFields({ form, update, toggle }) {
  return (
    <>
      <Field label="Professional background" className="mt-7">
        <textarea
          required
          value={form.professionalBackground}
          onChange={(event) => update("professionalBackground", event.target.value)}
          placeholder="Tell us about your current work and professional journey."
          className={textareaClass}
        />
      </Field>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Areas of expertise">
          <input
            required
            value={form.expertise}
            onChange={(event) => update("expertise", event.target.value)}
            placeholder="Separate areas with commas"
            className={inputClass}
          />
        </Field>
        <Field label="Years of experience">
          <input
            required
            type="number"
            min="0"
            max="80"
            value={form.yearsExperience}
            onChange={(event) => update("yearsExperience", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <ChoiceGrid
        legend="Mentorship interests"
        options={mentorAreas}
        selected={form.mentorshipInterests}
        onToggle={(value) => toggle("mentorshipInterests", value)}
      />
      <Field label="Availability" className="mt-7">
        <textarea
          required
          value={form.availability}
          onChange={(event) => update("availability", event.target.value)}
          placeholder="Share your preferred frequency, days, and time zone."
          className={textareaClass}
        />
      </Field>
      <Field label="Why would you like to mentor with BYBS?" className="mt-7">
        <textarea
          required
          minLength={30}
          value={form.motivation}
          onChange={(event) => update("motivation", event.target.value)}
          className={textareaClass}
        />
      </Field>
      <Field label="LinkedIn or professional profile" optional className="mt-7">
        <input
          type="url"
          value={form.profileUrl}
          onChange={(event) => update("profileUrl", event.target.value)}
          placeholder="https://"
          className={inputClass}
        />
      </Field>
    </>
  );
}

function PartnerFields({ form, update, toggle }) {
  return (
    <>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Organization name">
          <input
            required
            value={form.organizationName}
            onChange={(event) => update("organizationName", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Your role or title">
          <input
            required
            value={form.roleTitle}
            onChange={(event) => update("roleTitle", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Organization type">
          <select
            required
            value={form.organizationType}
            onChange={(event) => update("organizationType", event.target.value)}
            className={inputClass}
          >
            <option value="">Select one</option>
            {organizationTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Organization website" optional>
          <input
            type="url"
            value={form.organizationWebsite}
            onChange={(event) => update("organizationWebsite", event.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
      </div>
      <ChoiceGrid
        legend="Partnership areas"
        options={partnershipAreas}
        selected={form.partnershipAreas}
        onToggle={(value) => toggle("partnershipAreas", value)}
      />
      <Field label="What collaboration do you have in mind?" className="mt-7">
        <textarea
          required
          minLength={30}
          value={form.proposal}
          onChange={(event) => update("proposal", event.target.value)}
          placeholder="Describe the opportunity, intended outcome, and any useful timing or resource context."
          className={`${textareaClass} min-h-40`}
        />
      </Field>
    </>
  );
}

function ApplicationForm({ type, initialPartnershipArea = "" }) {
  const submitLabel =
    type === "partner" ? "Submit partnership enquiry" : `Submit ${type} application`;
  const freshForm = () => ({
    ...baseForm,
    interestAreas: [],
    mentorshipInterests: [],
    partnershipAreas: initialPartnershipArea ? [initialPartnershipArea] : [],
  });
  const [form, setForm] = useState(freshForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggle = (field, value) =>
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidInternationalPhone(form.phone)) {
      setError("Enter a valid international phone number.");
      return;
    }
    const selected =
      type === "volunteer"
        ? form.interestAreas
        : type === "mentor"
          ? form.mentorshipInterests
          : form.partnershipAreas;
    if (!selected.length) {
      setError(
        `Select at least one ${type === "partner" ? "partnership area" : "area of interest"}.`
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitParticipation({
        ...form,
        type,
        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        expertise: form.expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setSubmitted(true);
      setForm(freshForm());
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Your submission could not be completed right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-7 text-center sm:p-10"
        role="status"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
        <h2 className="mt-5 text-2xl font-semibold text-[#00337C]">
          Your submission has been received
        </h2>
        <p className="public-copy mx-auto mt-4 max-w-xl">
          The BYBS team will review it against current needs and contact you if there is a suitable
          next step. Please keep an eye on the email address you provided.
        </p>
        <Link to="/get-involved" className="public-button-secondary mt-7 px-6 py-3">
          Return to Get Involved
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold uppercase text-[#B96500]">Your details</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#00337C]">Start your submission</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Required fields help the BYBS team review and respond to your enquiry.
        </p>
      </div>
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      <div className="mt-7">
        <CommonFields form={form} update={update} />
      </div>
      {type === "volunteer" && <VolunteerFields form={form} update={update} toggle={toggle} />}
      {type === "mentor" && <MentorFields form={form} update={update} toggle={toggle} />}
      {type === "partner" && <PartnerFields form={form} update={update} toggle={toggle} />}
      <label className="mt-7 flex gap-3 rounded-lg bg-[#F7F9FC] p-5 text-sm leading-6 text-gray-700">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          I consent to BYBS storing and using the information provided to assess this submission and
          contact me about this opportunity. I understand this submission does not guarantee
          placement or partnership.
        </span>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="public-button-primary mt-6 w-full px-6 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
        <ShieldCheck className="h-4 w-4" />
        Your information is reviewed privately by authorized BYBS administrators.
      </p>
    </form>
  );
}

export default function ParticipationPage({ type }) {
  const page = pageContent[type] || pageContent.volunteer;
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");
  const sourceDetails = {
    empowerher: {
      area: "EmpowerHer initiatives",
      label: "EmpowerHer partnership",
      backTo: "/programs/empowerher",
      backLabel: "Back to EmpowerHer",
    },
    outreach: {
      area: "Community outreach",
      label: "Outreach partnership",
      backTo: "/programs/outreach",
      backLabel: "Back to Community Outreach",
    },
  }[source];

  return (
    <main className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
      <div className="public-container max-w-4xl">
        <Link
          to={sourceDetails?.backTo || "/get-involved"}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]"
        >
          <ArrowLeft className="h-4 w-4" />
          {sourceDetails?.backLabel || "Back to Get Involved"}
        </Link>
        <header className="mb-8 mt-6">
          <p className="public-eyebrow">{sourceDetails?.label || page.eyebrow}</p>
          <h1 className="mt-4 text-2xl font-light leading-tight text-[#00337C] md:text-3xl lg:text-4xl">
            {page.formTitle}
          </h1>
          <p className="public-copy mt-4 max-w-2xl">{page.description}</p>
        </header>
        <ApplicationForm
          type={type}
          initialPartnershipArea={type === "partner" ? sourceDetails?.area : ""}
        />
        <div className="mt-6 text-sm leading-6 text-gray-600">
          <strong className="text-gray-900">What happens next:</strong> {page.next} For a general
          question, use the{" "}
          <Link to="/contact" className="font-semibold text-[#00337C] underline underline-offset-4">
            contact page
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
