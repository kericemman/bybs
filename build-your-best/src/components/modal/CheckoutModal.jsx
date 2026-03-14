import { useState } from "react";
import { X, AlertCircle, Loader, ShoppingBag, Package } from "lucide-react";
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

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
            <div className="flex items-center">
              {product.type === "ebook" ? (
                <ShoppingBag className="w-5 h-5 text-white mr-2" />
              ) : (
                <Package className="w-5 h-5 text-white mr-2" />
              )}
              <h2 className="text-xl font-light text-white">
                Complete Your Purchase
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Product Summary */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">You're purchasing:</p>
                <p className="font-medium text-[#00337C]">{product.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-light text-[#B76E79]">
                  ${product.price?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckout} className="p-6">
            <div className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 focus:border-[#00337C]"
                  }`}
                  value={form.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 focus:border-[#00337C]"
                  }`}
                  value={form.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  We'll send your receipt and {product.type === "ebook" ? "download link" : "shipping confirmation"} to this email
                </p>
              </div>

              {/* Shipping Address (Merch only) */}
              {product.type === "merch" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="shippingAddress"
                    required
                    placeholder="Street address, City, State, Postal code, Country"
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all ${
                      errors.shippingAddress
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 focus:border-[#00337C]"
                    }`}
                    value={form.shippingAddress}
                    onChange={handleInputChange}
                  />
                  {errors.shippingAddress && (
                    <p className="mt-1 text-xs text-red-600">{errors.shippingAddress}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${product.price?.toFixed(2)}`
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Paystack Verified</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;