import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminProducts,
  deleteProduct,
} from "../../api/product.api";
import AdminProductForm from "./AdminProductForm";
import { Package } from "lucide-react"; // Add this

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAdminProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.response?.data?.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.type === filter);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl mt-10 font-light text-[#00337C] mb-2">
            Products
          </h1>
          <p className="text-gray-600">
            Manage your ebooks and merchandise
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setOpenForm(true);
          }}
          className="inline-flex text-sm items-center px-6 py-2 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none"
        >
          <option value="all">All Products</option>
          <option value="ebook">Ebooks</option>
          <option value="merch">Merchandise</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {!error && filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-light text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all" 
                  ? "Get started by adding your first product" 
                  : `No ${filter} products available`}
              </p>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setOpenForm(true);
                }}
                className="px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
              >
                Add Product
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!error && filteredProducts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {product.coverImage?.url ? (
                    <img
                      src={product.coverImage.url}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-medium text-gray-900">
                        {product.title}
                      </h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.type === 'ebook' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {product.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-light text-[#B76E79]">
                        ${product.price}
                      </span>
                      {product.type === "merch" && (
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock || 0}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setOpenForm(true);
                        }}
                        className="text-sm text-gray-600 hover:text-[#00337C] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {openForm && (
        <AdminProductForm
          product={editingProduct}
          onClose={() => setOpenForm(false)}
          onSaved={fetchProducts}
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;