import { useCallback, useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, CheckCircle, AlertCircle, Loader } from "lucide-react";
import api from "../../utils/axios";

const WaitlistModal = ({ open, onClose }) => {
  const nameRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/waitlist", { name, email });
      setSuccess(true);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    // Reset form after modal closes
    setTimeout(() => {
      setName("");
      setEmail("");
      setSuccess(false);
      setError(null);
      setNameError("");
      setEmailError("");
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => nameRef.current?.focus());
    const closeOnEscape = (event) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus?.();
    };
  }, [handleClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="waitlist-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
                <h2 id="waitlist-title" className="text-xl font-light text-white">
                  {success ? "You are on the waitlist" : "Join the Waitlist"}
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close waitlist form"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {success ? (
                  <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h3 className="text-2xl font-light text-[#00337C] mb-3">You're on the list!</h3>

                    <p className="text-gray-600 mb-6">
                      We'll notify you as soon as applications open for the next cohort.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-blue-800 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Confirmation sent to:
                      </p>
                      <p className="text-sm font-medium text-gray-900 bg-white p-2 rounded border border-blue-100">
                        {email}
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="px-8 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
                    >
                      Done
                    </button>
                  </Motion.div>
                ) : (
                  <>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Be the first to know when the next BYBS fellowship opens. No spam, just
                      important updates.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Error Message */}
                      {error && (
                        <Motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
                        >
                          <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">{error}</p>
                        </Motion.div>
                      )}

                      {/* Name Input */}
                      <div>
                        <label
                          htmlFor="waitlist-name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="waitlist-name"
                            ref={nameRef}
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (nameError) setNameError("");
                            }}
                            required
                            aria-invalid={Boolean(nameError)}
                            aria-describedby={nameError ? "waitlist-name-error" : undefined}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                              nameError
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 focus:border-[#00337C]"
                            }`}
                          />
                        </div>
                        {nameError && (
                          <p id="waitlist-name-error" className="mt-1 text-xs text-red-600">
                            {nameError}
                          </p>
                        )}
                      </div>

                      {/* Email Input */}
                      <div>
                        <label
                          htmlFor="waitlist-email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="waitlist-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (emailError) setEmailError("");
                            }}
                            required
                            aria-invalid={Boolean(emailError)}
                            aria-describedby={emailError ? "waitlist-email-error" : undefined}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                              emailError
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300 focus:border-[#00337C]"
                            }`}
                          />
                        </div>
                        {emailError && (
                          <p id="waitlist-email-error" className="mt-1 text-xs text-red-600">
                            {emailError}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Join Waitlist"
                        )}
                      </button>

                      {/* Privacy Notice */}
                      <p className="text-xs text-center text-gray-400">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </Motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
