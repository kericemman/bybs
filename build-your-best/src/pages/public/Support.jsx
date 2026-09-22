import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { submitParticipation } from "../../api/participation.api";
import { CountrySelectField, PhoneNumberField } from "../../components/forms/ContactFields";
import { isValidInternationalPhone } from "../../utils/phone";

const supportAreas = [
  {
    title: "Support a Fellow",
    text: "Help remove a practical barrier to participating in a BYBS learning opportunity.",
  },
  {
    title: "Sponsor a Cohort",
    text: "Discuss support for learning delivery, materials, facilitators, or participant access.",
  },
  {
    title: "Support Community Outreach",
    text: "Contribute to a defined outreach activity, resource need, or community collaboration.",
  },
  {
    title: "Donate Resources",
    text: "Offer useful equipment, services, space, learning materials, or professional expertise.",
  },
  {
    title: "Support Where Needed Most",
    text: "Let BYBS match your proposed support to a current, verified organizational need.",
  },
  {
    title: "Corporate Sponsorship",
    text: "Explore a structured company partnership with clear outcomes and accountability.",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  organizationName: "",
  roleTitle: "",
  supportArea: "",
  contributionDetails: "",
  consent: false,
};
const inputClass =
  "mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 font-normal text-gray-900 outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/10";

export default function Support() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!isValidInternationalPhone(form.phone)) {
      setError("Enter a valid international phone number.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitParticipation({ ...form, type: "support" });
      setSubmitted(true);
      setForm(initialForm);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Your enquiry could not be sent right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F7F9FC] py-5 md:py-10 lg:py-15">
      <div className="public-container max-w-4xl">
        <Link
          to="/get-involved"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#00337C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Get Involved
        </Link>
        <header className="mb-8 mt-6">
          <p className="public-eyebrow">Support BYBS</p>
          <h1 className="mt-4 text-2xl font-light leading-tight text-[#00337C] md:text-3xl lg:text-4xl">
            Support enquiry
          </h1>
          <p className="public-copy mt-4 max-w-2xl">
            Tell us what you would like to contribute. The team will confirm whether it matches a
            current need and contact you about the next step.
          </p>
        </header>
        {submitted ? (
          <div
            className="rounded-lg border border-green-200 bg-green-50 p-8 text-center"
            role="status"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-700" />
            <h2 className="mt-5 text-2xl font-semibold text-[#00337C]">
              Your support enquiry has been received
            </h2>
            <p className="public-copy mx-auto mt-4 max-w-xl">
              Thank you. The BYBS team will assess the proposed support and contact you using the
              details provided.
            </p>
            <Link to="/get-involved" className="public-button-secondary mt-7 px-6 py-3">
              Return to Get Involved
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="border-b border-gray-200 pb-6">
              <p className="text-sm font-semibold uppercase text-[#B96500]">Enquiry form</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#00337C]">
                Start a transparent support conversation
              </h2>
            </div>
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-800">
                Full name
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-semibold text-gray-800">
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={inputClass}
                />
              </label>
              <PhoneNumberField
                required
                value={form.phone}
                onChange={(value) => update("phone", value)}
              />
              <CountrySelectField
                required
                value={form.country}
                onChange={(value) => update("country", value)}
              />
              <label className="text-sm font-semibold text-gray-800">
                City <span className="font-normal text-gray-400">(optional)</span>
                <input
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-semibold text-gray-800">
                Organization <span className="font-normal text-gray-400">(optional)</span>
                <input
                  value={form.organizationName}
                  onChange={(event) => update("organizationName", event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-semibold text-gray-800">
                Your role <span className="font-normal text-gray-400">(optional)</span>
                <input
                  value={form.roleTitle}
                  onChange={(event) => update("roleTitle", event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-semibold text-gray-800">
                Support area
                <select
                  required
                  value={form.supportArea}
                  onChange={(event) => update("supportArea", event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select one</option>
                  {supportAreas.map((area) => (
                    <option key={area.title}>{area.title}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-7 block text-sm font-semibold text-gray-800">
              How would you like to help?
              <textarea
                required
                minLength={20}
                rows={7}
                value={form.contributionDetails}
                onChange={(event) => update("contributionDetails", event.target.value)}
                placeholder="Describe the resource, sponsorship, expertise, or other contribution you would like to discuss."
                className={`${inputClass} py-3 leading-7`}
              />
            </label>
            <label className="mt-7 flex gap-3 rounded-lg bg-[#F7F9FC] p-5 text-sm leading-6 text-gray-700">
              <input
                required
                type="checkbox"
                checked={form.consent}
                onChange={(event) => update("consent", event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0"
              />
              <span>
                I consent to BYBS storing and using this information to assess my enquiry and
                contact me about it.
              </span>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="public-button-primary mt-6 w-full px-6 py-3.5 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit support enquiry"
              )}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              No payment information is requested or stored here.
            </p>
          </form>
        )}
        <p className="mt-6 text-sm leading-6 text-gray-600">
          <strong className="text-gray-900">No payment is collected on this website.</strong> BYBS
          first confirms the current need and contribution method. For a general question, use the{" "}
          <Link to="/contact" className="font-semibold text-[#00337C] underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
