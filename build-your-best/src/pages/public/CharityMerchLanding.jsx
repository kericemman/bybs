import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Gift,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import api from "../../utils/axios";

const packages = [
  {
    id: "basic",
    title: "Basic Package",
    label: "Simple support our mission.",
    image: "/assets/1.png",
    description:
      "This Package is for supporters who want to contribute through practical BYBS for supportive efforts at Divine Mercy Home.",
    includes: ["T-shirt", "Cap", "Wristband"],
    price: "$20",
    color: "from-[#B76E79] to-[#D4A5A5]",
  },
  {
    id: "normal",
    title: "Normal Package",
    label: "More value. More impact.",
    image: "/assets/2.png",
    description:
      "The Normal Package gives you a stronger BYBS merch set while contributing more toward the charity visit.",
    includes: ["T-shirt", "Cap", "Wristband", "Notebook", "Pen", "Coffee Mug"],
    price: "$40",
    color: "from-[#00337C] to-[#1E4B9E]",
  },
  {
    id: "premium",
    title: "Premium Package",
    label: "A fuller support experience.",
    image: "/assets/3.png",
    description:
      "The Premium Package is for supporters who want a complete and practical BYBS merch set with greater campaign impact.",
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
    color: "from-[#FFD166] to-[#FFE8A5]",
  },
  {
    id: "bundle",
    title: "Bundle Package",
    label: "For those who want to give more intentionally.",
    image: "/assets/4.png",
    description:
      "The Bundle Package is the strongest support option for partners, groups, families, and anyone who wants to make a bigger contribution.",
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
    color: "from-[#111827] to-[#374151]",
  },
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

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white py-24 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#B76E79] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD166] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm mb-6">
              <Heart className="w-4 h-4 text-[#FFD166]" />
              BYBS Charity Merch Campaign
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
              Buy Merch. <br />
              <span className="font-bold bg-gradient-to-r from-[#FFD166] to-[#B76E79] bg-clip-text text-transparent">
                Build Hope.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              Support our charity visit to Divine Mercy Home in South Sudan
              through every BYBS merchandise purchase.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => scrollToForm("basic")}
                className="group bg-white text-[#00337C] px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Order Your Merch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#mission"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[#00337C] transition-all duration-300 inline-flex items-center justify-center"
              >
                Support the Mission
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-10 md:py-15 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#F5F9FF] rounded-full text-sm mb-6">
              <Heart className="w-4 h-4 mr-2 text-[#B76E79]" />
              <span className="text-[#00337C]">Our Mission</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-light text-[#00337C] mb-4">
              Merch With a Mission
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              This campaign is more than selling branded items. It is about
              turning everyday support into real impact.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Through the purchase of BYBS merchandise, we will raise resources
              to support Divine Mercy Home with essential needs and care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0] rounded-2xl p-8 border border-[#00337C]/10"
          >
            <h3 className="font-semibold text-xl mb-5 text-[#00337C] flex items-center">
              <Gift className="w-5 h-5 mr-2 text-[#B76E79]" />
              Where Your Support Goes
            </h3>

            <div className="space-y-3">
              {[
                "Essential food supplies",
                "Hygiene and sanitary items",
                "Clothing and personal care items",
                "Learning and recreational materials",
                "General support for the charity visit",
              ].map((item, index) => (
                <motion.p
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Package Selection Section */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#F5F9FF] rounded-full text-sm mb-4">
              <Star className="w-4 h-4 mr-2 text-[#FFD166]" />
              <span className="text-[#00337C]">Choose Your Impact Level</span>
            </div>

            <h2 className="text-xl md:text-4xl font-bold text-[#00337C] mb-3">
              Choose How You Want to Support
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">
              We created four merch categories so everyone can support according
              to their ability.
            </p>
          </motion.div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="relative bg-white flex items-center justify-center h-72 sm:h-80 overflow-hidden">
                    <img
                      src={pack.image}
                      alt={pack.title}
                      className="max-h-full max-w-full object-contain p-3"
                    />
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#00337C] text-white text-sm font-medium rounded-full">
                      {pack.price}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-[#B76E79] font-medium mb-2">
                    {pack.label}
                  </p>

                  <h3 className="text-xl font-semibold text-[#00337C] mb-3">
                    {pack.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {pack.description}
                  </p>

                  

                  <button
                    onClick={() => scrollToForm(pack.id)}
                    className="w-full bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white py-3 rounded-lg hover:opacity-90 transition-all duration-300 font-medium"
                  >
                    Order {pack.title}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Gift className="w-8 h-8" />,
                title: "Every Purchase Carries Purpose",
                description:
                  "Your support helps us show up, serve, and build hope.",
                color: "from-[#B76E79] to-[#D4A5A5]",
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Transparency",
                description:
                  "BYBS will share updates, photos, and a brief impact report after the visit.",
                color: "from-[#00337C] to-[#1E4B9E]",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Support",
                description:
                  "Buy merch, share the campaign, invite friends, or partner directly.",
                color: "from-[#FFD166] to-[#FFE8A5]",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section
        id="order-form"
        className="py-20 bg-gradient-to-br from-[#00337C] via-[#1E4B9E] to-[#2A5BC0] text-white"
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
              <Heart className="w-4 h-4 mr-2" />
              <span>Make a Difference Today</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-light mb-3">
              Wear the Message. Support the Mission.
            </h2>

            <p className="text-white/80 max-w-2xl mx-auto">
              Complete this form and our team will contact you to confirm your
              merch order.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onSubmit={submitOrder}
            className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl"
          >
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-6 flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Package <span className="text-red-500">*</span>
                </label>

                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                >
                  <option value="basic">Basic Package - $20</option>
                  <option value="normal">Normal Package - $40</option>
                  <option value="premium">Premium Package - $60</option>
                  <option value="bundle">Bundle Package - $100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full border p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />

                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full border p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />

                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>

                <input
                  required
                  placeholder="Your country"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className={`w-full border p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                />

                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.country}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone / WhatsApp
                </label>

                <input
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message or Delivery Notes
                </label>

                <textarea
                  placeholder="Any special requests or delivery notes..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all h-28"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white py-4 rounded-lg hover:opacity-90 transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Support Request"
              )}
            </button>
          </motion.form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#F5F9FF] rounded-full text-sm mb-4">
              <Star className="w-4 h-4 mr-2 text-[#FFD166]" />
              <span className="text-[#00337C]">Got Questions?</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-[#00337C]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
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
            ].map(([q, a], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-[#00337C] hover:text-[#1E4B9E] transition-colors">
                    <span>{q}</span>
                    <span className="ml-4 text-xl group-open:rotate-45 transition-transform duration-200">
                      +
                    </span>
                  </summary>

                  <p className="p-6 pt-0 text-gray-600 border-t border-gray-100 mt-2">
                    {a}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#00337C] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-light mb-4">
            Together, We Can Make a Difference
          </h3>

          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Every merch purchase brings us one step closer to supporting those
            who need it most.
          </p>

          <button
            onClick={() => scrollToForm("basic")}
            className="px-8 py-4 bg-white text-[#00337C] rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            <Heart className="w-5 h-5 mr-2" />
            Order Your Merch Now
          </button>
        </div>
      </section>
    </main>
  );
};

export default CharityMerchLanding;