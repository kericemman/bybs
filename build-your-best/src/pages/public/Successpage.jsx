import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Mail,
  MessageCircle,
  Package,
  BookOpen,
  ArrowLeft,
  Copy,
} from "lucide-react";
import api from "../../utils/axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const verifyStartedAt = useRef(Date.now());

  // =============================
  // VERIFY PAYMENT
  // =============================
  useEffect(() => {

    const verifyPayment = async () => {

      if (!reference) {
        setError("Invalid payment reference.");
        setLoading(false);
        return;
      }

      try {

        const res = await api.get(`/payments/verify/${reference}`);

        if (res.data.success) {
          setOrder(res.data.order);
          setLoading(false);
        }

      } catch (error) {

        if (
          error.response?.status === 400 &&
          Date.now() - verifyStartedAt.current < 300000
        ) {
          // Webhook may still be processing
          setTimeout(verifyPayment, 2000);
        } else {
          console.error("Error verifying payment:", error);
          setError("Unable to verify payment. Please contact support.");
          setLoading(false);
        }

      }
    };

    verifyPayment();

  }, [reference]);


  // =============================
  // COUNTDOWN TIMER
  // =============================
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);


  // =============================
  // COPY REFERENCE
  // =============================
  const handleCopyReference = () => {
    if (!reference) return;

    navigator.clipboard.writeText(reference);
  };


  // =============================
  // WHATSAPP SUPPORT
  // =============================
  const handleWhatsAppSupport = () => {

    const message =
      `Hello, I made a payment but haven't received my ${
        orderDetails?.product?.type === "ebook"
          ? "ebook download link"
          : "order confirmation"
      } yet.\n\n` +
      `*Name:* ${orderDetails?.name || "N/A"}\n` +
      `*Email:* ${orderDetails?.email || "N/A"}\n` +
      `*Reference:* ${reference || "N/A"}\n` +
      `*Product:* ${orderDetails?.product?.title || "N/A"}`;

    const whatsappUrl = `https://wa.me/254729353537?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };


  // =============================
  // LOADING STATE
  // =============================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">

          <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Verifying your payment...
          </p>

        </div>
      </div>
    );
  }


  // =============================
  // ERROR STATE
  // =============================
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">

        <div className="max-w-md w-full text-center">

          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Payment Verification Failed
          </h1>

          <p className="text-gray-600 mb-8">
            {error}
          </p>

          <button
            onClick={handleWhatsAppSupport}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Support on WhatsApp
          </button>

        </div>

      </div>
    );
  }


  // =============================
  // SUCCESS UI
  // =============================
  return (
    <div className="min-h-screen bg-white py-12">

      <div className="max-w-2xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
        >

          {/* HEADER */}
          <div className="px-8 py-6 bg-green-600 text-white text-center">

            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-light">
              Payment Successful 🎉
            </h1>

          </div>


          {/* ORDER SUMMARY */}
          <div className="p-8 border-b border-gray-100">

            <div className="space-y-4 mb-4">
              {(orderDetails?.items?.length
                ? orderDetails.items
                : [
                    {
                      product: orderDetails?.product,
                      title: orderDetails?.product?.title,
                      type: orderDetails?.product?.type,
                      quantity: 1,
                      price: orderDetails?.amount,
                    },
                  ]
              ).map((item, index) => (
                <div key={item.product?._id || item.product || index} className="flex items-center">
                  {item.type === "ebook" ? (
                    <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
                  ) : (
                    <Package className="w-8 h-8 text-purple-500 mr-3" />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.title || item.product?.title}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.type}
                      {item.quantity > 1 ? ` x ${item.quantity}` : ""}
                    </p>
                  </div>

                  <p className="text-lg font-medium text-[#B76E79]">
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-lg font-medium text-gray-900 border-t border-gray-100 pt-4 mb-4">
              <span>Total</span>
              <span>${orderDetails?.amount?.toFixed(2)}</span>
            </div>


            {/* REFERENCE */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">

              <span className="text-sm text-gray-600">
                Reference
              </span>

              <div className="flex items-center">

                <code className="text-sm bg-white px-3 py-1 rounded border">
                  {reference}
                </code>

                <button
                  onClick={handleCopyReference}
                  className="ml-2 text-gray-400 hover:text-[#00337C]"
                >
                  <Copy className="w-4 h-4"/>
                </button>

              </div>

            </div>

          </div>


          {/* EMAIL NOTICE */}
          <div className="p-8">

            <div className="flex items-start">

              <Mail className="w-6 h-6 text-blue-600 mr-3"/>

              <div>
                <p className="text-gray-700">
                  A confirmation email has been sent to:
                </p>

                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-2">
                  {orderDetails?.email}
                </p>
              </div>

            </div>

          </div>


          {/* FOOTER */}
          <div className="px-8 py-6 bg-gray-50 flex justify-between">

            <button
              onClick={() => navigate("/shop")}
              className="text-gray-600 hover:text-[#00337C] flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Continue Shopping
            </button>

            {orderDetails?.product?.type === "ebook" && !orderDetails?.items?.length && (
              <a
                href={orderDetails?.product?.fileUrl}
                className="text-[#00337C] font-medium"
              >
                Download Ebook →
              </a>
            )}

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default PaymentSuccess;
