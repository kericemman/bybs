import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import SEO from "../../components/SEO";
import BrandLoader from "../../components/public/BrandLoader";
import { absoluteUrl, breadcrumbSchema, truncate } from "../../lib/seo";
import {
  BookOpen,
  Package,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  HeartHandshake,
  MessageCircle,
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

  if (loading) {
    return <BrandLoader label="Loading product details" size="lg" fullPage className="bg-white" />;
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

          <h1 className="mb-4 text-2xl font-light text-gray-900 md:text-3xl lg:text-4xl">
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
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-10 lg:px-8 lg:py-15">
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
                    {product.type === "ebook" ? "Digital Ebook" : "Physical Merchandise"}
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

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#00337C] mb-6 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-light text-[#B76E79]">
                ${Number(product.price || 0).toFixed(2)}
              </span>

              {product.type === "ebook" && (
                <span className="text-sm text-gray-500">Digital access confirmed by BYBS</span>
              )}
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="mb-8 flex items-start gap-4 border-y border-gray-200 py-5">
              <HeartHandshake
                className="mt-0.5 h-6 w-6 shrink-0 text-[#B96500]"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold text-[#00337C]">Your purchase helps power BYBS</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Shop revenue helps BYBS run its work and reach more women and young people through
                  Fellowship, EmpowerHer, mentorship, and community outreach.
                </p>
              </div>
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
                        Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

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

            <button
              type="button"
              onClick={() =>
                navigate("/order-request", {
                  state: { cart: [{ ...product, quantity: 1 }] },
                })
              }
              disabled={product.type === "merch" && product.stock <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00337C] px-8 py-4 font-medium text-white transition-colors hover:bg-[#1E4B9E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-5 w-5" />
              Request through WhatsApp
            </button>

            <div className="flex items-center justify-center mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>No online payment</span>
                </div>

                {product.type === "ebook" ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Access confirmed by BYBS</span>
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
    </div>
  );
};

export default ProductDetails;
