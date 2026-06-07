import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Gift,
  Heart,
  Loader,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import api from "../../utils/axios";

const packages = [
  {
    id: "basic",
    title: "Basic Package",
    label: "Simple support our mission.",
    image: "/assets/1.png",
    description:
      "For supporters who want to contribute through practical BYBS merch and support Divine Mercy Home.",
    includes: ["T-shirt", "Cap", "Wristband"],
    price: "$20",
  },
  {
    id: "normal",
    title: "Normal Package",
    label: "More value. More impact.",
    image: "/assets/2.png",
    description:
      "A stronger BYBS merch set while contributing more toward the charity visit.",
    includes: ["T-shirt", "Cap", "Wristband", "Notebook", "Pen", "Coffee Mug"],
    price: "$40",
  },
  {
    id: "premium",
    title: "Premium Package",
    label: "A fuller support experience.",
    image: "/assets/3.png",
    description:
      "A complete practical merch set with greater campaign impact.",
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
  },
  {
    id: "bundle",
    title: "Bundle Package",
    label: "For intentional partners and groups.",
    image: "/assets/4.png",
    description:
      "The strongest support option for partners, groups, families, and anyone giving more intentionally.",
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
  },
];

const impactItems = [
  "Essential food supplies",
  "Hygiene and sanitary items",
  "Clothing and personal care items",
  "Learning and recreational materials",
  "General support for the charity visit",
];

const features = [
  {
    icon: Gift,
    title: "Every Purchase Carries Purpose",
    description: "Your support helps us show up, serve, and build hope.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "BYBS will share updates, photos, and a brief impact report after the visit.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Buy merch, share the campaign, invite friends, or partner directly.",
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
  const [selectedPackage, setSelectedPackage] = useState("basic");
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

  const selectedPackageDetails =
    packages.find((pack) => pack.id === selectedPackage) || packages[0];

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

      setTimeout(() => {
        document
          .getElementById("order-form")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10";

  return (
    <main className="bg-white text-gray-900">
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="public-eyebrow mb-5">
              <Heart className="w-4 h-4 text-[#B76E79]" />
              BYBS Charity Merch Campaign
            </p>

            <h1 className="public-heading text-4xl md:text-6xl mb-6">
              Buy merch. Build hope.
            </h1>

            <p className="public-copy text-lg mb-8 max-w-xl">
              Support our charity visit to Divine Mercy Home in South Sudan
              through every BYBS merchandise purchase.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollToForm("basic")}
                className="public-button-primary px-6 py-3.5"
              >
                Order your merch
                <ArrowRight className="w-5 h-5" />
              </button>

              <a href="#mission" className="public-button-secondary px-6 py-3.5">
                Support the mission
              </a>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {packages.map((pack) => (
              <div
                key={pack.id}
                className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
              >
                <div className="aspect-[4/5] bg-[#F7F9FC] rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </Motion.div>
        </div>
      </section>

      <section id="mission" className="public-section bg-white">
        <div className="public-container grid md:grid-cols-[0.9fr_1fr] gap-10 items-start">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="public-eyebrow mb-5">Our mission</p>
            <h2 className="public-heading text-3xl md:text-5xl mb-5">
              Merch with a mission.
            </h2>
            <div className="public-copy text-lg space-y-4">
              <p>
                This campaign is more than selling branded items. It is about
                turning everyday support into real impact.
              </p>
              <p>
                Through the purchase of BYBS merchandise, we will raise
                resources to support Divine Mercy Home with essential needs and
                care.
              </p>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="public-card p-6 md:p-8"
          >
            <h3 className="font-semibold text-xl mb-5 text-[#00337C] flex items-center">
              <Gift className="w-5 h-5 mr-2 text-[#B76E79]" />
              Where your support goes
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              {impactItems.map((item) => (
                <p key={item} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl text-center mx-auto mb-12"
          >
            <p className="public-eyebrow mb-5">
              <Star className="w-4 h-4 text-[#B76E79]" />
              Choose your impact level
            </p>
            <h2 className="public-heading text-3xl md:text-5xl mb-5">
              Choose how you want to support.
            </h2>
            <p className="public-copy text-lg">
              Four merch categories make it easy for everyone to support
              according to their ability.
            </p>
          </Motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {packages.map((pack, index) => (
              <Motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="public-card overflow-hidden flex flex-col"
              >
                <div className="relative bg-[#F7F9FC] p-4">
                  <div className="aspect-[4/5] w-full rounded-lg bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={pack.image}
                      alt={pack.title}
                      className="w-full h-full object-contain p-3 sm:p-4"
                      loading="lazy"
                    />
                  </div>

                  <span className="absolute top-7 right-7 px-3 py-1 bg-[#00337C] text-white text-sm font-semibold rounded-full shadow-sm">
                    {pack.price}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-[#B76E79] font-semibold mb-2">
                    {pack.label}
                  </p>

                  <h3 className="text-xl font-semibold text-[#00337C] mb-3">
                    {pack.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-6 mb-5">
                    {pack.description}
                  </p>

                  <div className="mb-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Includes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pack.includes.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 bg-[#F5F9FF] text-[#00337C] rounded-full text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => scrollToForm(pack.id)}
                    className="public-button-primary w-full px-4 py-3 mt-auto"
                  >
                    Order {pack.title}
                  </button>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="public-card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-[#00337C]/10 text-[#00337C] flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#00337C] mb-3">
                  {feature.title}
                </h3>
                <p className="public-copy">{feature.description}</p>
              </Motion.div>
            );
          })}
        </div>
      </section>

      <section id="order-form" className="public-section bg-[#F7F9FC]">
        <div className="public-container grid lg:grid-cols-[0.85fr_1fr] gap-10 items-start">
          <div>
            <p className="public-eyebrow mb-5">
              <Heart className="w-4 h-4 text-[#B76E79]" />
              Make a difference today
            </p>
            <h2 className="public-heading text-3xl md:text-5xl mb-5">
              Wear the message. Support the mission.
            </h2>
            <p className="public-copy text-lg mb-6">
              Complete this form and our team will contact you to confirm your
              merch order.
            </p>

            <div className="public-card overflow-hidden">
              <div className="aspect-[4/5] bg-white flex items-center justify-center">
                <img
                  src={selectedPackageDetails.image}
                  alt={selectedPackageDetails.title}
                  className="w-full h-full object-contain p-5"
                />
              </div>
              <div className="p-5 border-t border-gray-100">
                <p className="text-sm text-gray-500">Selected package</p>
                <div className="flex items-center justify-between gap-4 mt-1">
                  <h3 className="font-semibold text-[#00337C]">
                    {selectedPackageDetails.title}
                  </h3>
                  <span className="font-semibold text-[#B76E79]">
                    {selectedPackageDetails.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={submitOrder}
            className="public-card p-6 md:p-8"
          >
            <AnimatePresence>
              {success && (
                <Motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-6 flex items-start gap-2"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-5">
              <label>
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </label>

              <label>
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </label>

              <label>
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
                  <p className="text-xs text-red-500 mt-1">
                    {errors.country}
                  </p>
                )}
              </label>

              <label className="md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
                <span className="block text-sm font-medium text-gray-700 mb-2">
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
              className="public-button-primary w-full px-5 py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit support request"
              )}
            </button>
          </Motion.form>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container max-w-4xl">
          <div className="text-center mb-10">
            <p className="public-eyebrow mb-5">
              <Star className="w-4 h-4 text-[#B76E79]" />
              Got questions?
            </p>
            <h2 className="public-heading text-3xl md:text-5xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <div key={question} className="public-card overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-[#00337C]">
                    <span>{question}</span>
                    <span className="ml-4 text-xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>

                  <p className="px-5 pb-5 text-gray-600 leading-7 border-t border-gray-100 pt-5">
                    {answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#00337C] text-white">
        <div className="public-container max-w-4xl text-center">
          <h3 className="text-3xl font-light mb-4">
            Together, we can make a difference.
          </h3>

          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Every merch purchase brings us one step closer to supporting those
            who need it most.
          </p>

          <button
            onClick={() => scrollToForm("basic")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#00337C] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Heart className="w-5 h-5" />
            Order your merch now
          </button>
        </div>
      </section>
    </main>
  );
};

export default CharityMerchLanding;
