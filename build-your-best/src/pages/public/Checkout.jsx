import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import api from "../../utils/axios";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [cart] = useState(state?.cart || []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    shippingAddress: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        alert("Payment is not configured yet. Please contact support.");
        return;
      }

      if (!window.PaystackPop) {
        alert("Payment service is still loading. Please refresh and try again.");
        return;
      }

      const { data } = await api.post("/payments/cart-order", {
        customer: form,
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      });

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: data.email,
        amount: data.amount * 100,
        currency: "USD",
        ref: data.reference,
        callback: function () {
          navigate(`/payment/success?reference=${data.reference}`);
        },
        onClose: function () {
          alert("Payment cancelled.");
        },
      });

      handler.openIframe();
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-11 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10";

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4">
        <div className="text-center bg-white border border-gray-100 shadow-sm p-8 max-w-md w-full">
          <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-[#00337C] mb-3">
            Your cart is empty
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Add merch from the shop before starting checkout.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-[#00337C] text-white px-6 py-3 rounded-lg hover:bg-[#1E4B9E] transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#00337C] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to shop
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#B76E79] mb-2">
                Secure merch checkout
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-[#00337C]">
                Complete your order
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4 text-green-600" />
              Payment handled securely by Paystack
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <form
            onSubmit={handleCheckout}
            className="bg-white border border-gray-100 shadow-sm p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#00337C]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#00337C]" />
              </div>
              <div>
                <h2 className="text-xl font-light text-[#00337C]">
                  Delivery details
                </h2>
                <p className="text-sm text-gray-500">
                  We will use these details to confirm your order.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </span>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </label>

              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Phone or WhatsApp
                </span>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="+254..."
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </label>

              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery address
                </span>
                <textarea
                  required
                  placeholder="Street, city, country, and delivery notes"
                  value={form.shippingAddress}
                  onChange={(e) =>
                    setForm({ ...form, shippingAddress: e.target.value })
                  }
                  className="w-full min-h-32 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10"
                />
              </label>
            </div>

            <div className="mt-6 rounded-xl bg-[#F5F9FF] border border-[#00337C]/10 p-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>
                  After payment, you will receive an order confirmation by email.
                  The BYBS team will follow up with delivery details.
                </p>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-6 bg-[#00337C] text-white py-4 rounded-lg hover:bg-[#1E4B9E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ${total.toFixed(2)}
                </>
              )}
            </button>
          </form>

          <aside className="bg-white border border-gray-100 shadow-sm lg:sticky lg:top-6">
            <div className="p-6 border-b border-gray-100">
              <p className="text-sm text-gray-500 mb-1">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
              <h2 className="text-xl font-light text-[#00337C]">
                Order summary
              </h2>
            </div>

            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.coverImage?.url ? (
                      <img
                        src={item.coverImage.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#00337C] truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between gap-3 mt-2">
                      <p className="text-sm text-gray-500">
                        Qty {item.quantity}
                      </p>
                      <p className="text-sm text-[#B76E79] font-medium">
                        ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Taxes or delivery adjustments can be confirmed by the BYBS team
                if needed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
