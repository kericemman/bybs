import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, BookOpen, ArrowRight, ShoppingBag } from "lucide-react";
import api from "../../utils/axios";

const FeaturedProducts = () => {
  const [featuredMerch, setFeaturedMerch] = useState([]);
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data } = await api.get("/products");
        
        // Get 4 most recent merch
        const recentMerch = data
          .filter(product => product.type === "merch")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        // Get 4 most recent ebooks
        const recentEbooks = data
          .filter(product => product.type === "ebook")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        setFeaturedMerch(recentMerch);
        setFeaturedEbooks(recentEbooks);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  if (featuredMerch.length === 0 && featuredEbooks.length === 0) return null;

  return (
    <section className="py-5 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#F5F9FF] rounded-full text-sm mb-4">
            <ShoppingBag className="w-4 h-4 mr-2 text-[#00337C]" />
            <span className="text-[#00337C]"> Featured Products</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-[#00337C] mb-4">
           
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-[#00337C] to-[#B76E79] mx-auto mb-6"></div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support our mission by purchasing our latest merchandise and eBooks.
          </p>
        </motion.div>

        {/* Featured Merchandise */}
        {featuredMerch.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-light text-[#00337C] flex items-center">
                <Package className="w-6 h-6 mr-2" />
                New Merchandise
              </h3>
              <Link
                to="/shop?filter=merch"
                className="text-sm text-[#00337C] hover:text-[#1E4B9E] transition-colors flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMerch.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}

        
        {/* Shop All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 group"
          >
            Shop All Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
  >
    <Link
      to={`/shop/${product.slug || product._id}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
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
        
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-[#00337C] text-white text-xs font-medium rounded-full">
            New
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-light text-[#00337C] mb-2 group-hover:text-[#1E4B9E] transition-colors line-clamp-1">
          {product.title}
        </h3>
        
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
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
            </span>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

export default FeaturedProducts;