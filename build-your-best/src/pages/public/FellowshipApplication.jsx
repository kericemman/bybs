import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { submitFellowshipApplication } from "../../api/fellowshipApplication.api";
import api from "../../utils/axios";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  linkedinUrl: "",
  ageRange: "",
  occupation: "",
  currentStage: "",
  motivation: "",
  growthGoals: "",
  challenge: "",
  contribution: "",
  availability: "",
  focusAreas: [],
  heardFrom: "",
  consent: false,
};

const steps = [
  {
    title: "Personal Details",
    description: "Basic information the BYBS team needs to identify and contact you.",
  },
  {
    title: "Your Story",
    description: "Share what is bringing you into this fellowship season.",
  },
  {
    title: "Preferences",
    description: "Confirm the cohort schedule and your growth focus.",
  },
  {
    title: "Review",
    description: "Confirm your application before submission.",
  },
];

const requiredByStep = {
  0: ["firstName", "lastName", "email", "phone", "country"],
  1: ["motivation", "growthGoals", "challenge"],
  2: ["availability"],
};

const focusAreaOptions = [
  "Self-awareness",
  "Confidence",
  "Emotional intelligence",
  "Purpose clarity",
  "Leadership",
  "Career direction",
  "Discipline and consistency",
];

const cohortSchedule = "Saturday and Sunday every week, 2:00 PM - 4:00 PM CAT";
const cohortSlugAliases = {
  "cohort-4": "bybs-fellowship-cohort-4",
};

export default function FellowshipApplication() {
  const { cohortSlug } = useParams();
  const [form, setForm] = useState(initialForm);
  const [cohort, setCohort] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cohortLoading, setCohortLoading] = useState(Boolean(cohortSlug));
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const requestedCohortSlug = cohortSlug || "bybs-fellowship-cohort-4";
  const activeCohortSlug = cohortSlugAliases[requestedCohortSlug] || requestedCohortSlug;
  const activeCohortTitle = cohort?.title || "BYBS Fellowship Cohort 4";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCohortSlug]);

  useEffect(() => {
    let mounted = true;

    const fetchCohort = async () => {
      try {
        setCohortLoading(true);
        const { data } = await api.get(`/cohorts/${activeCohortSlug}`);
        if (mounted) setCohort(data);
      } catch (fetchError) {
        console.warn("Could not fetch selected cohort:", fetchError);
        if (mounted) setCohort(null);
      } finally {
        if (mounted) setCohortLoading(false);
      }
    };

    fetchCohort();

    return () => {
      mounted = false;
    };
  }, [activeCohortSlug]);

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const toggleArrayValue = (field, value) => {
    setForm((current) => {
      const currentValues = current[field] || [];
      return {
        ...current,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
    if (error) setError("");
  };

  const validateStep = (targetStep = step) => {
    const missing = (requiredByStep[targetStep] || []).find(
      (field) => !String(form[field] || "").trim()
    );

    if (missing) {
      setError("Please complete the required fields in this step.");
      return false;
    }

    if (targetStep === 0 && !form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (targetStep === 3 && !form.consent) {
      setError("Please confirm consent before submitting.");
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
      await submitFellowshipApplication({
        ...form,
        cohort: activeCohortTitle,
        cohortSlug: activeCohortSlug,
        cohortSchedule,
        source: "website",
      });
      setSubmitted(true);
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(
        submissionError.response?.data?.message ||
          "We could not submit your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">
        <section className="public-section">
          <div className="public-container">
            <div className="mx-auto max-w-3xl rounded-xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-light text-[#00337C]">Application received</h1>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                Thank you for applying to {activeCohortTitle}. The team will review your
                application and follow up with next steps.
              </p>
              <Link to="/cohorts" className="public-button-primary mt-7 inline-flex px-6 py-3">
                Back to Cohorts
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <section className="bg-[#061C3D] text-white">
        <div className="public-container py-12 md:py-16">
          <Link to="/cohorts" className="mb-8 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Cohorts
          </Link>
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85">
              <Sparkles className="h-4 w-4 text-[#FFD166]" />
              {cohortLoading ? "Loading cohort..." : `${activeCohortTitle} Application`}
            </div>
            <h1 className="text-4xl font-light leading-tight md:text-5xl">
              Complete your application steps
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Each step helps the BYBS team understand your readiness, goals, and preferred
              fellowship experience.
            </p>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#00337C]">Step {step + 1} of {steps.length}</p>
                  <p className="text-sm text-gray-500">{progress}%</p>
                </div>
                <div className="mb-6 h-2 rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#00337C] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="space-y-3">
                  {steps.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => index <= step && setStep(index)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        index === step
                          ? "border-[#00337C] bg-[#F0F5FF]"
                          : index < step
                            ? "border-emerald-100 bg-emerald-50"
                            : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                          index < step ? "bg-emerald-600 text-white" : "bg-[#00337C] text-white"
                        }`}>
                          {index < step ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#10233F]">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-[#F7FAFC] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#10233F]">
                    <ShieldCheck className="h-4 w-4 text-[#00337C]" />
                    Private review
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Your application is reviewed only by BYBS Teams.
                  </p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
              <div className="mb-6 border-b border-gray-100 pb-5">
                <p className="public-eyebrow mb-3">{steps[step].title}</p>
                <h2 className="text-3xl font-light text-[#00337C]">{steps[step].description}</h2>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First name" required value={form.firstName} onChange={(value) => updateField("firstName", value)} />
                  <Field label="Last name" required value={form.lastName} onChange={(value) => updateField("lastName", value)} />
                  <Field label="Email" required type="email" value={form.email} onChange={(value) => updateField("email", value)} />
                  <Field label="Phone / WhatsApp" required value={form.phone} onChange={(value) => updateField("phone", value)} />
                  <Field label="Country" required value={form.country} onChange={(value) => updateField("country", value)} />
                  <Field label="City" value={form.city} onChange={(value) => updateField("city", value)} />
                  <Field label="Professional profile link" value={form.linkedinUrl} onChange={(value) => updateField("linkedinUrl", value)} placeholder="Optional" />
                  <SelectField
                    label="Age range"
                    value={form.ageRange}
                    onChange={(value) => updateField("ageRange", value)}
                    options={[
                      ["", "Select age range"],
                      ["16-20", "16-20"],
                      ["21-25", "21-25"],
                      ["26-30", "26-30"],
                      ["31-40", "31-40"],
                      ["41+", "41+"],
                    ]}
                  />
                  <Field label="Occupation / current role" value={form.occupation} onChange={(value) => updateField("occupation", value)} />
                  <Field label="Current stage of life" value={form.currentStage} onChange={(value) => updateField("currentStage", value)} />
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <TextArea label={`Why do you want to join ${activeCohortTitle}?`} required value={form.motivation} onChange={(value) => updateField("motivation", value)} />
                  <TextArea label="What growth goals are you working toward?" required value={form.growthGoals} onChange={(value) => updateField("growthGoals", value)} />
                  <TextArea label="What challenge do you want support with right now?" required value={form.challenge} onChange={(value) => updateField("challenge", value)} />
                  <TextArea label="What would you bring to the cohort community?" value={form.contribution} onChange={(value) => updateField("contribution", value)} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-[#E4ECFA] bg-[#F7FAFC] p-5">
                    <p className="public-eyebrow mb-3">Cohort Schedule</p>
                    <h3 className="text-2xl font-light text-[#00337C]">
                      Saturday and Sunday every week
                    </h3>
                    <p className="mt-3 text-lg font-semibold text-[#B76E79]">
                      2:00 PM - 4:00 PM CAT
                    </p>
                    <p className="mt-3 leading-7 text-gray-600">
                      This is the fixed weekly schedule for the cohort. Please apply only if
                      you can consistently attend both weekend sessions.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <SelectField
                      label="Can you commit to this Saturday and Sunday schedule?"
                      required
                      value={form.availability}
                      onChange={(value) => updateField("availability", value)}
                      options={[
                        ["", "Select availability"],
                        ["yes", "Yes, I can commit"],
                        ["mostly", "Mostly, with minor constraints"],
                        ["not-sure", "Not sure yet"],
                      ]}
                    />
                    <Field label="How did you hear about this?" value={form.heardFrom} onChange={(value) => updateField("heardFrom", value)} />
                  </div>

                  <CheckboxGroup
                    label="Growth focus areas"
                    options={focusAreaOptions}
                    values={form.focusAreas}
                    onToggle={(value) => toggleArrayValue("focusAreas", value)}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <ReviewBlock title="Cohort" items={[
                    ["Applying for", activeCohortTitle],
                  ]} />
                  <ReviewBlock title="Applicant" items={[
                    ["Name", `${form.firstName} ${form.lastName}`],
                    ["Email", form.email],
                    ["Phone", form.phone],
                    ["Country", form.country],
                    ["City", form.city],
                    ["Professional profile link", form.linkedinUrl],
                    ["Age range", form.ageRange],
                    ["Occupation / current role", form.occupation],
                    ["Current stage of life", form.currentStage],
                  ]} />
                  <ReviewBlock title="Story" items={[
                    [`Why ${activeCohortTitle}`, form.motivation],
                    ["Growth goals", form.growthGoals],
                    ["Current challenge", form.challenge],
                    ["Contribution to the cohort community", form.contribution],
                  ]} />
                  <ReviewBlock title="Schedule and Focus" items={[
                    ["Cohort schedule", cohortSchedule],
                    ["Can commit to the schedule", form.availability],
                    ["Growth focus areas", form.focusAreas.join(", ")],
                    ["How did you hear about this?", form.heardFrom],
                  ]} />

                  <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => updateField("consent", event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#00337C] focus:ring-[#00337C]"
                    />
                    <span>
                      I confirm that the information provided is accurate and consent to BYBS
                      contacting me about {activeCohortTitle}.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0 || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < steps.length - 1 ? (
                  <button type="button" onClick={goNext} className="public-button-primary justify-center px-6 py-3">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="public-button-primary justify-center px-6 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      <>
                        Submit application
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, required = false, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-[#B76E79]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
        required={required}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-[#B76E79]">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
        required={required}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-[#B76E79]">*</span>}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
        required={required}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue || optionLabel} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({ label, options, values, onToggle }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-gray-300 text-[#00337C] focus:ring-[#00337C]"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function ReviewBlock({ title, items }) {
  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[#00337C]">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
              {value || "Not provided"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
