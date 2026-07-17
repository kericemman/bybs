import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import CheckoutModal from "../../components/modal/CheckoutModal";
import SEO from "../../components/SEO";
import { absoluteUrl, breadcrumbSchema, truncate } from "../../lib/seo";
import {
  BookOpen,
  Package,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  X,
  Trash2,
  Plus,
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

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

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

  const addToCart = (productToAdd) => {
    if (productToAdd.type === "merch" && productToAdd.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === productToAdd._id);

      if (existing) {
        return prev.map((item) =>
          item._id === productToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...productToAdd, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <SEO
          title="Product not found | Build Your Best Self"
          description="This BYBS product could not be found."
          canonical={absoluteUrl(`/shop/${slug}`)}
          noindex
        />
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-light text-gray-900 mb-4">
            Product Not Found
          </h1>

          <p className="text-gray-600 mb-8">
            {error ||
              "The product you're looking for doesn't exist or has been removed."}
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

  const productUrl = absoluteUrl(`/shop/${product.slug || slug}`);
  const productDescription = truncate(product.description, 155);
  const productImage = product.coverImage?.url;
  const productSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: productDescription,
      image: productImage ? [productImage] : undefined,
      sku: product._id,
      category: product.type === "ebook" ? "Digital product" : "Merchandise",
      brand: {
        "@type": "Brand",
        name: "Build Your Best Self",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "USD",
        price: Number(product.price || 0).toFixed(2),
        availability:
          product.type === "merch" && product.stock <= 0
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
      },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: product.title, path: `/shop/${product.slug || slug}` },
    ]),
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${product.title} | BYBS Shop`}
        description={productDescription}
        canonical={productUrl}
        image={productImage}
        type="product"
        schema={productSchema}
      />
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

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      product.type === "ebook"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {product.type === "ebook"
                      ? "Digital Ebook"
                      : "Physical Merchandise"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
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

            <h1 className="text-4xl md:text-5xl font-light text-[#00337C] mb-6 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-light text-[#B76E79]">
                ${Number(product.price || 0).toFixed(2)}
              </span>

              {product.type === "ebook" && (
                <span className="text-sm text-gray-500">
                  One-time payment • Lifetime access
                </span>
              )}
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

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
                      <span>
                        Stock:{" "}
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of stock"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {product.type === "merch" &&
              product.stock <= 5 &&
              product.stock > 0 && (
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

            <div className="flex flex-col sm:flex-row gap-4">
              {product.type === "ebook" ? (
                <button
                  onClick={() => setOpenCheckout(true)}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Buy Now
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              )}

              {product.type === "merch" && product.stock > 0 && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-[#00337C] hover:text-[#00337C] transition-all duration-300"
                >
                  View Cart
                </button>
              )}
            </div>

            <div className="flex items-center justify-center mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Secure Checkout</span>
                </div>

                {product.type === "ebook" ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Instant Download</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Delivery Support</span>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Order Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Product Checkout Modal for ebooks */}
      {openCheckout && (
        <CheckoutModal
          product={product}
          onClose={() => setOpenCheckout(false)}
        />
      )}

      {/* Floating Cart Icon */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#00337C] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-[#1E4B9E] transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#B76E79] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setCartOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-full sm:w-[430px] bg-white shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <p className="text-sm text-[#B76E79] font-medium">
                  Merch cart
                </p>
                <h2 className="text-2xl font-light text-[#00337C]">
                  Your selection
                </h2>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="text-center">
                  <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-light text-[#00337C]">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Add merch items to start checkout.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 border border-gray-100 rounded-xl p-3"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.coverImage?.url ? (
                          <img
                            src={item.coverImage.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {item.type === "ebook" ? (
                              <BookOpen className="w-8 h-8 text-gray-300" />
                            ) : (
                              <Package className="w-8 h-8 text-gray-300" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#00337C] truncate">
                          {item.title}
                        </h3>

                        <p className="text-sm font-medium text-[#B76E79] mt-1">
                          ${Number(item.price || 0).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 border border-gray-200 rounded-lg text-gray-700 hover:border-[#00337C] hover:text-[#00337C]"
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            -
                          </button>

                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 border border-gray-200 rounded-lg text-gray-700 hover:border-[#00337C] hover:text-[#00337C]"
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-300 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                  <div className="flex justify-between text-lg font-semibold mb-2">
                    <span className="text-gray-700">Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Delivery details are collected on the next step.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/checkout", { state: { cart } })
                    }
                    className="block w-full text-center bg-[#00337C] text-white py-3.5 rounded-lg hover:bg-[#1E4B9E] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
