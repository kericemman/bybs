import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          message: "Your message has been sent successfully!",
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-[#00337C] mb-4 tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions or ready to begin your journey? I'm here to help.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-light text-[#00337C] mb-2">Send a Message</h2>
              <p className="text-gray-600">I'll get back to you within 24 hours.</p>
            </div>

            {submitStatus.message && (
              <div
                className={`p-4 border-l-4 ${
                  submitStatus.success
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-[#00337C] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-[#00337C] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-[#00337C] focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select a topic</option>
                  <option value="coaching">Coaching Inquiry</option>
                  <option value="workshop">Workshop Question</option>
                  <option value="product">Product Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can I help you?"
                  rows="4"
                  required
                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-[#00337C] focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-[#00337C] text-white font-medium transition-colors hover:bg-[#1E4B9E] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Booking */}
            <div className="border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-[#00337C] mr-3" />
                <h3 className="text-lg font-medium text-[#00337C]">Book a Session</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Ready to take the next step? Schedule a free discovery call or coaching session.
              </p>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://calendly.com/buildyourbestselfblog-info"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-[#00337C] text-[#00337C] hover:bg-[#00337C] hover:text-white transition-colors text-sm"
              >
                <FaCalendarAlt className="mr-2" />
                View Availability
              </motion.a>
            </div>

            {/* Email */}
            <div className="border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-[#00337C] mr-3" />
                <h3 className="text-lg font-medium text-[#00337C]">Email Directly</h3>
              </div>
              <p className="text-gray-600 mb-2 text-sm">Prefer to email directly?</p>
              <a
                href="mailto:info@buildyourbestselfblog.com"
                className="text-[#00337C] hover:text-[#1E4B9E] transition-colors text-sm break-all"
              >
                info@buildyourbestselfblog.com
              </a>
            </div>

            {/* Social Media */}
            <div className="border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-[#00337C] mb-4">Connect</h3>
              <div className="flex space-x-3">
                <a
                  href="https://www.instagram.com/buildyourbestself_25?igsh=ZmFjcTlrMDdtc2Fk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#00337C] transition-colors"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a
                  href="https://www.facebook.com/share/15rD2aArYn/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#00337C] transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href="https://wa.me/211921650576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#00337C] transition-colors"
                >
                  <FaWhatsapp className="text-xl" />
                </a>
                <a
                  href="https://www.tiktok.com/@buildyourbestselfblog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-[#00337C] transition-colors"
                >
                  <FaTiktok className="text-xl" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}