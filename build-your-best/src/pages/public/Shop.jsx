import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import CheckoutModal from "../../components/modal/CheckoutModal";
import {
  BookOpen,
  Package,
  AlertCircle,
  Search,
  ShoppingBag,
  Filter,
  Menu,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("merch");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("merch");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading products:", error);
        setError(error.response?.data?.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    setFilter(activeTab);
  }, [activeTab]);

  const filteredProducts = products
    .filter((product) => filter === "all" || product.type === filter)
    .filter((product) => {
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();

      return (
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.type?.toLowerCase().includes(term)
      );
    });

  const stats = {
    total: products.length,
    ebooks: products.filter((p) => p.type === "ebook").length,
    merch: products.filter((p) => p.type === "merch").length,
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-[#00337C]" />
              <span className="text-[#00337C]">Personal Growth Library</span>
            </div>

            <h1 className="text-2xl md:text-5xl font-light text-[#00337C] mb-6">
              eBooks & Merch for Your Journey
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Support our mission with every purchase
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex space-x-1">
              {[
                {
                  id: "merch",
                  label: "Merchandise",
                  icon: Package,
                  count: stats.merch,
                },
                {
                  id: "ebook",
                  label: "eBooks",
                  icon: BookOpen,
                  count: stats.ebooks,
                },
                {
                  id: "all",
                  label: "All Products",
                  icon: ShoppingBag,
                  count: stats.total,
                },
              ].map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "text-[#00337C]"
                        : "text-gray-600 hover:text-[#00337C]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon
                        className={`w-4 h-4 ${
                          activeTab === tab.id
                            ? "text-[#00337C]"
                            : "text-gray-500"
                        }`}
                      />

                      <span>{tab.label}</span>

                      {tab.count > 0 && (
                        <span
                          className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                            activeTab === tab.id
                              ? "bg-[#00337C] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </div>

                    {activeTab === tab.id && (
                      <Motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00337C]"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-[#00337C] rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-[#00337C]"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {mobileMenuOpen && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2"
              >
                {[
                  {
                    id: "merch",
                    label: "Merchandise",
                    icon: Package,
                    count: stats.merch,
                  },
                  {
                    id: "ebook",
                    label: "eBooks",
                    icon: BookOpen,
                    count: stats.ebooks,
                  },
                  {
                    id: "all",
                    label: "All Products",
                    icon: ShoppingBag,
                    count: stats.total,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#00337C] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{tab.label}</span>
                      </div>

                      {tab.count > 0 && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            activeTab === tab.id
                              ? "bg-white text-[#00337C]"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </Motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Desktop */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredProducts.length}{" "}
            {filter === "all"
              ? "products"
              : filter === "ebook"
              ? "eBooks"
              : "merchandise items"}{" "}
            found
          </p>

          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setActiveTab(e.target.value);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all bg-white"
            >
              <option value="merch">Merchandise</option>
              <option value="ebook">eBooks</option>
              <option value="all">All Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl max-w-2xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h3 className="text-xl font-light text-gray-700 mb-2">
              No {filter === "all" ? "products" : filter} found
            </h3>

            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search term"
                : filter !== "all"
                ? `No ${filter} available at the moment`
                : "No products available at the moment"}
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative bg-gray-50 h-56 overflow-hidden">
                    {product.coverImage?.url ? (
                      <img
                        src={product.coverImage.url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        {product.type === "ebook" ? (
                          <BookOpen className="w-16 h-16 text-gray-300" />
                        ) : (
                          <Package className="w-16 h-16 text-gray-300" />
                        )}
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.type === "ebook"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {product.type === "ebook" ? "Ebook" : "Merch"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-light text-[#00337C] mb-2 group-hover:text-[#1E4B9E] transition-colors line-clamp-1">
                      {product.title}
                    </h2>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-light text-[#B76E79]">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>

                      {product.type === "merch" && (
                        <span
                          className={`text-xs ${
                            product.stock > 0 ? "text-gray-500" : "text-red-500"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} left`
                            : "Sold out"}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/shop/${product.slug || product._id}`}
                        className="flex-1 text-center border border-[#00337C] text-[#00337C] py-2 rounded-lg text-sm hover:bg-[#00337C] hover:text-white transition-colors"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          product.type === "ebook"
                            ? setCheckoutProduct(product)
                            : addToCart(product)
                        }
                        disabled={product.type === "merch" && product.stock <= 0}
                        className="flex-1 bg-[#00337C] text-white py-2 rounded-lg text-sm hover:bg-[#1E4B9E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        {product.type === "ebook" ? "Buy" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center mt-10">
              Showing {filteredProducts.length} of{" "}
              {
                products.filter(
                  (p) => filter === "all" || p.type === filter
                ).length
              }{" "}
              {filter === "all" ? "products" : filter}
            </p>
          </>
        )}
      </div>

      {/* Floating Cart Icon */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#00337C] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-[#1E4B9E] transition-colors"
        aria-label="Open cart"
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

                  <Link
                    to="/checkout"
                    state={{ cart }}
                    className="block w-full text-center bg-[#00337C] text-white py-3.5 rounded-lg hover:bg-[#1E4B9E] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}
    </div>
  );
};

export default Shop;
