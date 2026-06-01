import { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  CreditCard,
  Loader,
  Mail,
  Package,
  User,
  X,
} from "lucide-react";
import api from "../../utils/axios";

const CheckoutModal = ({ product, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    shippingAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (product.type === "merch" && !form.shippingAddress.trim()) {
      newErrors.shippingAddress = "Shipping address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create order
      const { data } = await api.post("/payments/orders", {
        productId: product._id,
        name: form.name,
        email: form.email,
        ...(product.type === "merch" && { 
          shippingAddress: form.shippingAddress 
        }),
      });

      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        setError("Payment is not configured yet. Please contact support.");
        setLoading(false);
        return;
      }

      if (!window.PaystackPop) {
        setError("Payment service is still loading. Please refresh and try again.");
        setLoading(false);
        return;
      }

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: data.email,
        amount: data.amount * 100, // Convert to kobo/cents
        currency: "USD", // Add currency
        ref: data.reference,
        metadata: {
          productId: product._id,
          productName: product.title,
          productType: product.type,
          customerName: form.name,
          ...(product.type === "merch" && {
            shippingAddress: form.shippingAddress
          })
        },
        callback: function(response) {
          // Redirect to success page
          window.location.href = `/payment/success?reference=${response.reference}`;
        },
        onClose: function() {
          // Payment cancelled
          alert("Payment cancelled. You can try again when you're ready.");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to initialize payment. Please try again."
      );
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-11 py-3.5 text-sm outline-none transition focus:ring-4 focus:ring-[#00337C]/10 ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:border-red-400"
        : "border-gray-200 focus:border-[#00337C]"
    }`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6">
      <div className="min-h-full flex items-center justify-center">
        <div className="bg-white text-left shadow-2xl w-full max-w-lg">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00337C]/10 flex items-center justify-center flex-shrink-0">
                {product.type === "ebook" ? (
                  <BookOpen className="w-5 h-5 text-[#00337C]" />
                ) : (
                  <Package className="w-5 h-5 text-[#00337C]" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#B76E79]">
                  {product.type === "ebook" ? "Digital checkout" : "Merch checkout"}
                </p>
                <h2 className="text-2xl font-light text-[#00337C]">
                  Complete purchase
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-5 bg-[#F7F9FC] border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  You are purchasing
                </p>
                <p className="font-medium text-[#00337C] truncate">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {product.type === "ebook"
                    ? "Download link sent after payment"
                    : "Delivery details required"}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Total
                </p>
                <p className="text-2xl font-light text-[#B76E79]">
                  ${Number(product.price || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="p-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start mb-5">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className={inputClass("name")}
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputClass("email")}
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Receipt and {product.type === "ebook" ? "download link" : "shipping confirmation"} will be sent here.
                </p>
              </label>

              {product.type === "ebook" ? (
                <div className="rounded-xl bg-green-50 border border-green-100 p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">
                    Your ebook access is delivered by email after payment is confirmed.
                  </p>
                </div>
              ) : (
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping address
                  </span>
                  <textarea
                    name="shippingAddress"
                    required
                    placeholder="Street address, city, country"
                    rows="3"
                    className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition focus:ring-4 focus:ring-[#00337C]/10 ${
                      errors.shippingAddress
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 focus:border-[#00337C]"
                    }`}
                    value={form.shippingAddress}
                    onChange={handleInputChange}
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.shippingAddress}
                    </p>
                  )}
                </label>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#00337C] text-white font-medium rounded-lg hover:bg-[#1E4B9E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ${Number(product.price || 0).toFixed(2)}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep shopping
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <span>Secure payment</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Paystack verified</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Email confirmation</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
