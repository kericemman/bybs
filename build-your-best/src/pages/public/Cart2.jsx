import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function CartPage({ selectedProduct }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // ✅ Call backend to initialize Paystack payment
      const res = await api.post("/coaching/initiate", {
        fullName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        productId: selectedProduct._id || selectedProduct.id,
        productName: selectedProduct.name,
        description: selectedProduct.description,
        amount: selectedProduct.price,
      });

      // Redirect user to Paystack hosted payment page
      window.location.href = res.data.data.authorization_url;
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      setError("Could not start payment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00337C] to-[#1E4B9E] p-6 text-white">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <p className="opacity-90">Secure checkout powered by Paystack</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 p-6">
          {/* Left Column - Customer Info */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Your Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00337C] focus:border-[#00337C]"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00337C] focus:border-[#00337C]"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number*
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#00337C] focus:border-[#00337C]"
                placeholder="+254 700 000 000"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${selectedProduct.price}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>

                <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#B76E79]">${selectedProduct.price}</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full px-6 py-3 rounded-lg font-light text-sm text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00337C] hover:bg-[#1E4B9E]"
                  }`}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
