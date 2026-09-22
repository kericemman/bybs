import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, CheckCircle } from "lucide-react";
import api from "../../utils/axios";

const SubscribeModal = ({ showOnArticles = false }) => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("bybs_subscribed");
    const dontShowUntil = localStorage.getItem("bybs_dont_show_until");

    if (hasSubscribed || (dontShowUntil && new Date(dontShowUntil) > new Date())) {
      setHidden(true);
      return;
    }

    setHidden(false);
    setOpen(false);
    setMinimized(false);

    const timer = setTimeout(
      () => {
        if (showOnArticles) {
          setMinimized(true);
          return;
        }

        setOpen(true);
      },
      showOnArticles ? 5000 : 2500
    );

    return () => clearTimeout(timer);
  }, [showOnArticles]);

  const handleSubscribe = async (event) => {
    event?.preventDefault();
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
        setMinimized(false);
        setHidden(true);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.response?.status === 409 ? "Email already subscribed" : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    window.requestAnimationFrame(() => closeRef.current?.focus());
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (hidden) return null;

  if (!open && minimized) {
    return (
      <Motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-12 items-center justify-center rounded-full bg-[#00337C] text-white shadow-lg transition hover:bg-[#1E4B9E] ${
          showOnArticles
            ? "w-auto gap-2 px-4 text-sm font-semibold lg:left-6 lg:right-auto lg:w-12 lg:px-0"
            : "w-12"
        }`}
        aria-label="Open subscribe form"
      >
        <Mail className="w-5 h-5" />
        {showOnArticles && <span className="lg:hidden">Subscribe</span>}
      </Motion.button>
    );
  }

  const panel = (
    <Motion.div
      role="dialog"
      aria-modal={showOnArticles ? undefined : "true"}
      aria-labelledby="subscribe-title"
      initial={showOnArticles ? { y: 24, opacity: 0 } : { scale: 0.9, opacity: 0 }}
      animate={showOnArticles ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
      exit={showOnArticles ? { y: 24, opacity: 0 } : { scale: 0.9, opacity: 0 }}
      className={`relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl ${
        showOnArticles ? "border border-slate-200" : ""
      }`}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={() => setOpen(false)}
        className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-600"
        aria-label="Close subscribe form"
      >
        <X className="w-5 h-5" />
      </button>

      {success ? (
        <div className="py-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 id="subscribe-title" className="mb-1 text-lg font-medium text-[#00337C]">
            You are subscribed
          </h3>
          <p className="text-sm text-gray-600">
            Thanks {formData.name || "for joining"}. Check your inbox.
          </p>
        </div>
      ) : (
        <>
          <h3 id="subscribe-title" className="mb-2 text-xl font-light text-[#00337C]">
            {showOnArticles ? "Enjoying this read?" : "Join Our Community"}
          </h3>

          <p className="mb-4 text-sm leading-6 text-gray-600">
            {showOnArticles
              ? "Get thoughtful articles, BYBS updates, and new learning opportunities in your inbox."
              : "Get updates on new content and offers."}
          </p>

          {error && (
            <p className="mb-3 text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <label htmlFor="subscribe-name" className="sr-only">
                Name
              </label>
              <input
                id="subscribe-name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#00337C] focus:ring-1 focus:ring-[#00337C]"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <label htmlFor="subscribe-email" className="sr-only">
                Email address
              </label>
              <input
                id="subscribe-email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#00337C] focus:ring-1 focus:ring-[#00337C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00337C] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E] disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>

            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                localStorage.setItem("bybs_dont_show_until", tomorrow.toISOString());
                setOpen(false);
                setMinimized(false);
                setHidden(true);
              }}
              className="w-full text-xs text-gray-400 transition hover:text-gray-600"
            >
              Not now
            </button>
          </form>
        </>
      )}
    </Motion.div>
  );

  return (
    <AnimatePresence>
      {open &&
        (showOnArticles ? (
          <div className="fixed bottom-5 left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-6 sm:justify-end lg:left-6 lg:right-auto lg:justify-start">
            {panel}
          </div>
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40"
              onClick={() => {
                setOpen(false);
                setMinimized(true);
              }}
            />

            {panel}
          </div>
        ))}
    </AnimatePresence>
  );
};

export default SubscribeModal;
