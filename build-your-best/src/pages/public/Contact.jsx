import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  CheckCircle,
  Facebook,
  Instagram,
  InstagramIcon,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { BsTiktok } from "react-icons/bs";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        formData
      );

      if (res.data.success) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus({
          success: false,
          message: "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        success: false,
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10";

  const contactCards = [
    {
      title: "Book a session",
      description:
        "Schedule a discovery call or coaching session when you are ready for support.",
      href: "https://calendly.com/buildyourbestselfblog-info",
      label: "View availability",
      icon: CalendarDays,
    },
    {
      title: "Email directly",
      description: "Prefer a direct note? Send us a message by email.",
      href: "mailto:info@buildyourbestself.org",
      label: "info@buildyourbestself.org",
      icon: Mail,
    },
    {
      title: "WhatsApp",
      description: "Reach the team for quick support and order questions.",
      href: "https://wa.me/211921650576",
      label: "Message on WhatsApp",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="bg-white">
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container text-center max-w-3xl">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="public-eyebrow mb-5">Contact</p>
            
            <p className="public-copy text-lg">
              Have a question, partnership idea, product issue, or coaching
              inquiry? Send a message and the BYBS team will respond.
            </p>
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container grid lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-14 items-start">
          <Motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="public-card p-6 md:p-8"
          >
            <h2 className="text-2xl font-light text-[#00337C] mb-2">
              Send a message
            </h2>
            <p className="text-gray-500 mb-6">
              We usually respond within 24 hours.
            </p>

            {submitStatus.message && (
              <div
                className={`mb-5 p-4 rounded-xl border flex items-start gap-3 ${
                  submitStatus.success
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{submitStatus.message}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <label>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                  className={inputClass}
                />
              </label>

              <label>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className={inputClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </span>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a topic</option>
                  <option value="coaching">Coaching inquiry</option>
                  <option value="workshop">Workshop question</option>
                  <option value="product">Product support</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help?"
                  rows="5"
                  required
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="public-button-primary w-full px-6 py-3.5 mt-6 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending" : "Send message"}
            </button>
          </Motion.form>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;

              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="public-card p-5 flex gap-4 hover:border-[#00337C]/25 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#00337C]/10 text-[#00337C] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#00337C] mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-6 mb-2">
                      {card.description}
                    </p>
                    <p className="text-sm font-semibold text-[#B76E79]">
                      {card.label}
                    </p>
                  </div>
                </a>
              );
            })}

            <div className="public-card p-5">
              <h3 className="font-semibold text-[#00337C] mb-4">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00337C] hover:border-[#00337C]/30"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/176ZP54B6X/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00337C] hover:border-[#00337C]/30"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>

                <a
                  href="https://www.tiktok.com/@buildyourbestselfblog?_t=ZM-8yf0LRoJoT2&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00337C] hover:border-[#00337C]/30"
                  aria-label="TikTok"
                >
                  <BsTiktok className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00337C] hover:border-[#00337C]/30"
                  aria-label="instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>

                <a
                  href="https://www.linkedin.com/company/109732355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#00337C] hover:border-[#00337C]/30"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>
    </div>
  );
}
