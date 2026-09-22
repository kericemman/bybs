import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, BookOpen, Package, ShoppingBag } from "lucide-react";
import api from "../../utils/axios";
import BrandLoader from "../public/BrandLoader";

const FeaturedProducts = () => {
  const [featuredMerch, setFeaturedMerch] = useState([]);
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data } = await api.get("/products");

        const recentMerch = data
          .filter((product) => product.type === "merch")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        const recentEbooks = data
          .filter((product) => product.type === "ebook")
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

  const products = [...featuredMerch, ...featuredEbooks].slice(0, 4);

  if (loading) {
    return (
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container">
          <BrandLoader label="Loading featured products" size="sm" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="public-section bg-[#F7F9FC]">
      <div className="public-container">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <p className="public-eyebrow mb-5">
              <ShoppingBag className="w-4 h-4" />
              Featured products
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl public-heading mb-5">
              Resources and merchandise from BYBS.
            </h2>
            <p className="public-copy text-lg">
              Buy practical growth resources and BYBS merchandise while helping sustain Fellowship,
              EmpowerHer, youth development, and community outreach.
            </p>
          </div>

          <Link to="/shop" className="public-button-secondary px-5 py-3">
            Shop all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, index }) => (
  <Motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
  >
    <Link
      to={`/shop/${product.slug || product._id}`}
      className="public-card group block overflow-hidden h-full"
    >
      <div className="relative bg-gray-100 h-56 overflow-hidden">
        {product.coverImage?.url ? (
          <img
            src={product.coverImage.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {product.type === "ebook" ? (
              <BookOpen className="w-14 h-14 text-gray-300" />
            ) : (
              <Package className="w-14 h-14 text-gray-300" />
            )}
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white text-[#00337C] text-xs font-semibold rounded-full shadow-sm">
            {product.type === "ebook" ? "Ebook" : "Merch"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-[#00337C] mb-2 line-clamp-1">{product.title}</h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-light text-[#B76E79]">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          {product.type === "merch" && (
            <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `${product.stock} left` : "Sold out"}
            </span>
          )}
        </div>
      </div>
    </Link>
  </Motion.div>
);

export default FeaturedProducts;
