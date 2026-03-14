import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { BookOpen, Package, AlertCircle, Search, ShoppingBag, Filter, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

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

  // Update filter when active tab changes
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
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
          </motion.div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/* Category Tabs */}
            <div className="flex space-x-1">
              {[
                { id: "merch", label: "Merchandise", icon: Package, count: stats.merch },
                { id: "ebook", label: "eBooks", icon: BookOpen, count: stats.ebooks },
                { id: "all", label: "All Products", icon: ShoppingBag, count: stats.total }
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
                      <Icon className={`w-4 h-4 ${
                        activeTab === tab.id ? "text-[#00337C]" : "text-gray-500"
                      }`} />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-[#00337C] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00337C]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Search */}
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
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

              <div className="text-sm font-medium text-gray-600">
                {filteredProducts.length}
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2"
              >
                {[
                  { id: "merch", label: "Merchandise", icon: Package, count: stats.merch },
                  { id: "ebook", label: "eBooks", icon: BookOpen, count: stats.ebooks },
                  { id: "all", label: "All Products", icon: ShoppingBag, count: stats.total }
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activeTab === tab.id
                            ? "bg-white text-[#00337C]"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Filters (Desktop) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {filter === "all" ? "products" : filter === "ebook" ? "eBooks" : "merchandise items"} found
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
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Empty State */}
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

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/shop/${product.slug || product._id}`}
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
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.type === "ebook"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
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
                        ${product.price?.toFixed(2) || "0.00"}
                      </span>
                      {product.type === "merch" && (
                        <span className={`text-xs ${
                          product.stock > 0 ? "text-gray-500" : "text-red-500"
                        }`}>
                          {product.stock > 0 ? `${product.stock} left` : "Sold out"}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center mt-10">
              Showing {filteredProducts.length} of {products.filter(p => filter === "all" || p.type === filter).length} {filter === "all" ? "products" : filter}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;