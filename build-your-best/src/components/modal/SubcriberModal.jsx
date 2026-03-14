import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, CheckCircle } from "lucide-react";
import api from "../../utils/axios";

const SubscribeModal = ({ showOnArticles = false }) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("bybs_subscribed");
    const dontShowUntil = localStorage.getItem("bybs_dont_show_until");
    
    if (hasSubscribed || (dontShowUntil && new Date(dontShowUntil) > new Date())) {
      setMinimized(true);
      return;
    }

    // Show immediately if on articles page, otherwise use delay
    if (showOnArticles) {
      setOpen(true);
    } else {
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [showOnArticles]);

  const handleSubscribe = async () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/subscribers", formData);
      localStorage.setItem("bybs_subscribed", "true");
      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setOpen(false);
        setMinimized(true);
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      setError(error.response?.status === 409 
        ? "Email already subscribed" 
        : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open && minimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-[#00337C] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <Mail className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-[#00337C] mb-1">
                  You're Subscribed! 🎉
                </h3>
                <p className="text-sm text-gray-600">
                  Thanks {formData.name || "for joining"}! Check your inbox.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-light text-[#00337C] mb-2">
                  {showOnArticles ? "Read This Article?" : "Join Our Community"}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {showOnArticles 
                    ? "Subscribe to access this and other exclusive articles." 
                    : "Get updates on new content and offers."}
                </p>

                {error && (
                  <p className="text-xs text-red-600 mb-3">{error}</p>
                )}

                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#00337C] focus:ring-1 focus:ring-[#00337C] outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#00337C] focus:ring-1 focus:ring-[#00337C] outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full py-2 bg-[#00337C] text-white text-sm rounded-lg hover:bg-[#1E4B9E] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Subscribing..." : showOnArticles ? "Subscribe to Read" : "Subscribe"}
                  </button>

                  <button
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      localStorage.setItem("bybs_dont_show_until", tomorrow.toISOString());
                      setOpen(false);
                    }}
                    className="w-full text-xs text-gray-400 hover:text-gray-600"
                  >
                    {showOnArticles ? "Maybe later" : "Not now"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscribeModal;