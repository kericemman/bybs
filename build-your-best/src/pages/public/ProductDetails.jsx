import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import CheckoutModal from "../../components/modal/CheckoutModal";
import { 
  BookOpen, 
  Package, 
  ShoppingBag, 
  ArrowLeft, 
  AlertCircle,
  Loader,
  ChevronRight 
} from "lucide-react";

const ProductDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, []);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCheckout, setOpenCheckout] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
        setError(error.response?.data?.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center text-gray-600 hover:text-[#00337C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
                {product.coverImage?.url ? (
                  <img
                    src={product.coverImage.url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    {product.type === "ebook" ? (
                      <BookOpen className="w-24 h-24 text-gray-300" />
                    ) : (
                      <Package className="w-24 h-24 text-gray-300" />
                    )}
                  </div>
                )}

                {/* Product Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    product.type === "ebook"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {product.type === "ebook" ? "Digital Ebook" : "Physical Merchandise"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span 
                onClick={() => navigate("/shop")}
                className="hover:text-[#00337C] cursor-pointer transition-colors"
              >
                Shop
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900 capitalize">{product.type}</span>
            </div>

            {/* Title & Price */}
            <h1 className="text-4xl md:text-5xl font-light text-[#00337C] mb-6 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-light text-[#B76E79]">
                ${product.price?.toFixed(2) || "0.00"}
              </span>
              {product.type === "ebook" && (
                <span className="text-sm text-gray-500">
                  One-time payment • Lifetime access
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {/* Product Features/Specs */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 mb-8 border border-gray-100">
              <h3 className="text-lg font-light text-[#00337C] mb-4">
                {product.type === "ebook" ? "What You'll Get" : "Product Details"}
              </h3>
              
              <div className="space-y-3">
                {product.type === "ebook" ? (
                  <>
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-5 h-5 text-[#00337C] mr-3" />
                      <span>PDF Format • Instant Download</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <ShoppingBag className="w-5 h-5 text-[#00337C] mr-3" />
                      <span>Lifetime Access • Free Updates</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-gray-700">
                      <Package className="w-5 h-5 text-[#00337C] mr-3" />
                      <span>Physical Product • Ships within 3-5 days</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-5 h-5 text-[#00337C] mr-3 flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <span>Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stock Warning (for merch) */}
            {product.type === "merch" && product.stock <= 5 && product.stock > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Only {product.stock} left in stock — order soon
                </p>
              </div>
            )}

            {product.type === "merch" && product.stock === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Out of stock — check back later
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setOpenCheckout(true)}
                disabled={product.type === "merch" && product.stock === 0}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {product.type === "ebook" ? "Buy Now" : "Add to Cart"}
              </button>
              
              {product.type === "merch" && product.stock > 0 && (
                <button
                  onClick={() => {/* Add to wishlist functionality */}}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-[#00337C] hover:text-[#00337C] transition-all duration-300"
                >
                  Add to Wishlist
                </button>
              )}
            </div>

            {/* Secure Checkout Badge */}
            <div className="flex items-center justify-center mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section - You can add this later */}
        {/* <RelatedProducts productId={product._id} category={product.type} /> */}
      </div>

      {/* Checkout Modal */}
      {openCheckout && (
        <CheckoutModal
          product={product}
          onClose={() => setOpenCheckout(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;
