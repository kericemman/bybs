import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Gift,
  Heart,
  Loader,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import api from "../../utils/axios";

const packages = [
  {
    id: "basic",
    title: "Basic Package",
    shortTitle: "Basic",
    label: "Simple support",
    image: "/assets/1.png",
    description:
      "A practical starter merch set for supporters who want to stand with the mission.",
    includes: ["T-shirt", "Cap", "Wristband"],
    price: "$20",
    highlight: "Best entry point",
  },
  {
    id: "normal",
    title: "Normal Package",
    shortTitle: "Normal",
    label: "More value",
    image: "/assets/2.png",
    description:
      "A stronger set with daily-use BYBS pieces and a larger contribution to the visit.",
    includes: ["T-shirt", "Cap", "Wristband", "Notebook", "Pen", "Coffee Mug"],
    price: "$40",
    highlight: "Popular choice",
  },
  {
    id: "premium",
    title: "Premium Package",
    shortTitle: "Premium",
    label: "Fuller support",
    image: "/assets/3.png",
    description:
      "A complete merch package for supporters who want more items and more impact.",
    includes: [
      "T-shirt",
      "Cap",
      "Wristband",
      "Notebook",
      "Pen",
      "Coffee Mug",
      "Tote Bag",
    ],
    price: "$60",
    highlight: "Best value",
  },
  {
    id: "bundle",
    title: "Bundle Package",
    shortTitle: "Bundle",
    label: "Partner level",
    image: "/assets/4.png",
    description:
      "The strongest support option for groups, families, and intentional campaign partners.",
    includes: [
      "T-shirt",
      "Cap",
      "Wristband",
      "Notebook",
      "Pen",
      "Coffee Mug",
      "Tote Bag",
      "Full BYBS support bundle",
    ],
    price: "$100",
    highlight: "Maximum impact",
  },
];

const impactItems = [
  "Essential food supplies",
  "Hygiene and sanitary items",
  "Clothing and personal care items",
  "Learning and recreational materials",
  "General support for the charity visit",
];

const proofPoints = [
  { value: "4", label: "Merch packages" },
  { value: "19 Sep", label: "Charity visit" },
  { value: "South Sudan", label: "Divine Mercy Home" },
];

const steps = [
  {
    icon: ShoppingBag,
    title: "Choose a package",
    text: "Pick the merch set that fits how you want to support.",
  },
  {
    icon: PackageCheck,
    title: "Submit your request",
    text: "Share your details so the BYBS team can confirm the order.",
  },
  {
    icon: Heart,
    title: "Fund the visit",
    text: "Your purchase helps provide practical support for Divine Mercy Home.",
  },
];

const faqs = [
  [
    "What is this campaign about?",
    "It is a BYBS charity merch campaign created to raise resources for our visit to Divine Mercy Home in South Sudan.",
  ],
  [
    "Where will the funds go?",
    "The funds raised will support the charity visit and help provide practical resources based on the needs of the home.",
  ],
  [
    "What merch categories are available?",
    "There are four categories: Basic Package, Normal Package, Premium Package, and Bundle Package.",
  ],
  [
    "Can I support without buying merch?",
    "Yes. You can partner with BYBS or contribute resources directly toward the charity visit.",
  ],
  [
    "Will BYBS share updates after the visit?",
    "Yes. BYBS will share updates and impact highlights after the visit.",
  ],
];

const CharityMerchLanding = () => {
  const [selectedPackage, setSelectedPackage] = useState("normal");
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedPackageDetails = useMemo(
    () => packages.find((pack) => pack.id === selectedPackage) || packages[0],
    [selectedPackage]
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!form.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccess("");

    try {
      const { data } = await api.post("/charity-merch", {
        ...form,
        packageType: selectedPackage,
      });

      setSuccess(data.message || "Your support request has been submitted.");
      setForm({
        name: "",
        email: "",
        country: "",
        phone: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = (packageId) => {
    setSelectedPackage(packageId);
    document
      .getElementById("order-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPackages = () => {
    document
      .getElementById("packages")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10";

  return (
    <main className="bg-[#F8FAFC] text-slate-950">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#00337C] via-[#0B5FC1] to-[#F28C00]" />

        <div className="public-container py-10 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 xl:gap-14 items-center">
            <Motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <p className="public-eyebrow mb-5 bg-[#F5F9FF]">
                <Heart className="w-4 h-4 text-[#F28C00]" />
                Merch for Mercy
              </p>

              <h1 className="public-heading text-3xl md:text-6xl xl:text-7xl mb-6 max-w-3xl">
                Buy merch. Build hope.
              </h1>

              <p className="public-copy text-l md:text-xl max-w-2xl mb-8">
                Support BYBS as we raise resources for Divine Mercy Home in
                South Sudan through premium, purpose-led merchandise. Help us spread the joy of giving and make a real impact with every purchase and make a difference in the lives of those we aim to support. <br />
                As BYBS we are dedicate to helping people show up for causes they care about in ways that are simple, meaningful, and even fun. This merch campaign is a step toward that vision, and we can’t wait to have you join us on this journey of impact and hope.
                <br />
                Move with us, and let’s build a better world together, one merch purchase at a time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => scrollToForm(selectedPackage)}
                  className="public-button-primary px-6 py-4"
                >
                  Order a package
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={scrollToPackages}
                  className="public-button-secondary px-6 py-4 bg-white"
                >
                  View packages
                </button>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
                {proofPoints.map((point) => (
                  <div key={point.label} className="py-4 pr-4 first:pl-0 pl-4">
                    <p className="text-xl md:text-2xl font-semibold text-[#00337C]">
                      {point.value}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                      {point.label}
                    </p>
                  </div>
                ))}
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="relative"
            >
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3 md:p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
                <div className="relative overflow-hidden rounded-lg bg-white">
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#00337C] shadow-sm">
                    {selectedPackageDetails.price} USD
                  </div>
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-[#00337C] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                    {selectedPackageDetails.highlight}
                  </div>

                  <div className="aspect-[1122/1402] w-full bg-white">
                    <img
                      src={selectedPackageDetails.image}
                      alt={selectedPackageDetails.title}
                      className="h-full w-full object-contain"
                      fetchPriority="high"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-3">
                  {packages.map((pack) => {
                    const active = pack.id === selectedPackage;

                    return (
                      <button
                        key={pack.id}
                        onClick={() => setSelectedPackage(pack.id)}
                        className={`min-h-12 rounded-lg border px-2 text-xs font-semibold transition ${
                          active
                            ? "border-[#00337C] bg-[#00337C] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#00337C]/40"
                        }`}
                      >
                        {pack.shortTitle}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#00337C] text-white">
        <div className="public-container grid gap-4 py-5 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-[#F28C00]" />
            <span className="text-sm font-medium">Visit date: 19 September 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#F28C00]" />
            <span className="text-sm font-medium">
              Supporting Divine Mercy Home, South Sudan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F28C00]" />
            <span className="text-sm font-medium">
              Updates and impact highlights after the visit
            </span>
          </div>
        </div>
      </section>

      <section id="packages" className="public-section">
        <div className="public-container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="public-eyebrow mb-5">
                <Star className="w-4 h-4 text-[#F28C00]" />
                Choose your impact level
              </p>
              <h2 className="public-heading text-2xl md:text-5xl mb-4">
                  A merch package for every one.
              </h2>
              <p className="public-copy text-l">
                Choose your preferred merch package and support level to help BYBS raise resources for Divine Mercy Home. Each package is designed to offer great value while maximizing the impact of your support for the charity visit.
              </p>
            </div>

            <button
              onClick={() => scrollToForm(selectedPackage)}
              className="public-button-primary px-5 py-3 md:self-auto self-start"
            >
              Start order
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {packages.map((pack, index) => (
              <Motion.article
                key={pack.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  selectedPackage === pack.id
                    ? "border-[#00337C] ring-4 ring-[#00337C]/10"
                    : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => setSelectedPackage(pack.id)}
                  className="relative block w-full bg-white text-left"
                  aria-label={`Preview ${pack.title}`}
                >
                  
                  {/* <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#00337C] shadow-sm">
                    {pack.highlight}
                  </span> */}
                  <span className="absolute bottom-4 right-4 rounded-full bg-[#F28C00] px-4 py-2 text-sm font-bold text-white shadow-sm">
                    {pack.price}
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 text-sm font-semibold text-[#F28C00]">
                    {pack.label}
                  </p>
                  <h3 className="mb-3 text-xl font-semibold text-[#00337C]">
                    {pack.title}
                  </h3>
                  <p className="mb-5 text-sm leading-6 text-slate-600">
                    {pack.description}
                  </p>

                  <div className="mb-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Included
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pack.includes.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[#F5F9FF] px-2.5 py-1 text-xs font-medium text-[#00337C]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToForm(pack.id)}
                    className="public-button-primary mt-auto w-full px-4 py-3"
                  >
                    Order Now
                  </button>
                </div>
              </Motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="public-section bg-white">
        <div className="public-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <p className="public-eyebrow mb-5">
              <Gift className="w-4 h-4 text-[#F28C00]" />
              What your purchase supports
            </p>
            <h2 className="public-heading text-2xl md:text-5xl mb-5">
              Support one, support many. See the impact of your purchase.
            </h2>
            <p className="public-copy text-l mb-7">
              Don't be left behind by the impact of your purchase. This merch campaign is about more than just cool gear, it's about showing up with practical support for Divine Mercy Home in South Sudan. Your purchase is a direct contribution to the charity visit and the well-being of those we aim to support.
            </p>
            <button
              onClick={() => scrollToForm(selectedPackage)}
              className="public-button-secondary bg-white px-5 py-3"
            >
              Support the mission
              <Heart className="w-5 h-5" />
            </button>
          </Motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {impactItems.map((item, index) => (
              <Motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-5"
              >
                <CheckCircle className="mb-4 h-4 w-4 text-emerald-600" />
                <p className="font-semibold text-l md:text-lg text-slate-900">{item}</p>
              </Motion.div>
            ))}
            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              viewport={{ once: true }}
              className="rounded-lg border border-[#00337C] bg-[#00337C] p-5 text-white sm:col-span-2"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">
                The promise
              </p>
              <p className="mt-3 text-xl font-light leading-snug">
                BYBS will share campaign updates and impact highlights after the
                visit so supporters can see what their purchase helped make
                possible.
              </p>
            </Motion.div>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00337C]/10 text-[#00337C]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-[#00337C]">
                    {step.title}
                  </h3>
                  <p className="public-copy">{step.text}</p>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="order-form" className="public-section bg-white">
        <div className="public-container grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-start">
          <Motion.aside
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-[#F8FAFC] shadow-sm">
              <div className="aspect-[1122/1402] bg-white">
                <img
                  src={selectedPackageDetails.image}
                  alt={selectedPackageDetails.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="border-t border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-500">
                  Selected package
                </p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#00337C]">
                      {selectedPackageDetails.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedPackageDetails.highlight}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F28C00] px-4 py-2 text-sm font-bold text-white">
                    {selectedPackageDetails.price}
                  </span>
                </div>
              </div>
            </div>
          </Motion.aside>

          <Motion.form
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            onSubmit={submitOrder}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8"
          >
            <div className="mb-7">
              <p className="public-eyebrow mb-5">
                <Users className="w-4 h-4 text-[#F28C00]" />
                Reserve your merch
              </p>
              <h2 className="public-heading text-2xl md:text-5xl mb-4">
                Complete your order and support the visit.
              </h2>
              <p className="public-copy text-l">
                Submit your details and the BYBS team will contact you to
                confirm payment and delivery arrangements.
              </p>
            </div>

            <AnimatePresence>
              {success && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span>{success}</span>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Select package
                </span>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className={inputClass}
                >
                  {packages.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title} - {pack.price}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </span>
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${inputClass} ${
                    errors.name ? "border-red-400" : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${inputClass} ${
                    errors.email ? "border-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Country
                </span>
                <input
                  required
                  placeholder="Your country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className={`${inputClass} ${
                    errors.country ? "border-red-400" : ""
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.country}
                  </p>
                )}
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Phone or WhatsApp
                </span>
                <input
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Message or delivery notes
                </span>
                <textarea
                  placeholder="Any special requests or delivery notes"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputClass} min-h-28 resize-none`}
                />
              </label>
            </div>

            <button
              disabled={loading}
              className="public-button-primary mt-6 w-full px-5 py-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Submit Your Order
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </Motion.form>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container max-w-4xl">
          <div className="mb-5 text-center">
            <p className="public-eyebrow mb-5">
              <Star className="w-4 h-4 text-[#F28C00]" />
              Got questions?
            </p>
            <h2 className="public-heading text-2xl md:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <div
                key={question}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-[#00337C]">
                    <span>{question}</span>
                    <span className="ml-4 text-xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="border-t border-slate-100 px-5 pb-5 pt-5 leading-7 text-slate-600">
                    {answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#00337C] py-16 text-white">
        <div className="public-container max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Merch for Mercy
          </p>
          <h3 className="mb-4 text-3xl font-light md:text-5xl">
            Wear the message. Support the mission.
          </h3>

          <p className="mx-auto mb-8 max-w-2xl text-white/80">
            Every merch purchase brings BYBS one step closer to showing up with
            practical support for Divine Mercy Home.
          </p>

          <button
            onClick={() => scrollToForm("normal")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-[#00337C] transition-colors hover:bg-slate-100"
          >
            <Heart className="h-5 w-5" />
            Order your merch now
          </button>
        </div>
      </section>
    </main>
  );
};

export default CharityMerchLanding;
