import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../api/product.api";
import { X, Upload, Loader } from "lucide-react";
import { compressImageFile } from "../../utils/imageCompression";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const AdminProductForm = ({ product, onClose, onSaved }) => {
  const isEdit = Boolean(product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "ebook",
    price: "",
    stock: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [ebookFile, setEbookFile] = useState(null);
  const [ebookFileName, setEbookFileName] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        type: product.type || "ebook",
        price: product.price || "",
        stock: product.stock || "",
      });
      if (product.coverImage?.url) {
        setCoverPreview(product.coverImage.url);
      }
      if (product.fileUrl) {
        setEbookFileName("Existing PDF uploaded");
      }
    } else {
      setForm({
        title: "",
        description: "",
        type: "ebook",
        price: "",
        stock: "",
      });
      setCoverImage(null);
      setCoverPreview("");
      setEbookFile(null);
      setEbookFileName("");
    }
  }, [product]);

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image for the cover.");
      return;
    }

    setError("");

    try {
      const compressedFile = await compressImageFile(file);
      if (compressedFile.size > MAX_UPLOAD_SIZE) {
        setError("The cover image is too large. Please upload an image under 20MB.");
        return;
      }
      setCoverImage(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Cover image compression failed:", error);
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEbookFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file for the ebook.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setError("The ebook PDF is too large. Please upload a file under 20MB.");
      return;
    }

    setError("");
    setEbookFile(file);
    setEbookFileName(file.name);
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!form.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Price is required");
      return false;
    }
    if (form.type === "merch" && (form.stock === "" || Number(form.stock) < 0)) {
      setError("Stock is required for merchandise");
      return false;
    }
    if (!isEdit && !coverImage) {
      setError("Cover image is required");
      return false;
    }
    if (form.type === "ebook" && !isEdit && !ebookFile) {
      setError("Ebook file is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const formData = new FormData();

    // Append only non-empty values
    if (form.title) formData.append("title", form.title);
    if (form.description) formData.append("description", form.description);
    if (form.type) formData.append("type", form.type);
    if (form.price) formData.append("price", form.price);

    // Only append stock for merch
    if (form.type === "merch" && form.stock) {
      formData.append("stock", form.stock);
    }

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    if (form.type === "ebook" && ebookFile) {
      formData.append("ebookFile", ebookFile);
    }

    try {
      if (isEdit) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Full error:", error.response?.data || error);

      setError(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
            <h2 className="text-xl font-light text-white">
              {isEdit ? "Edit Product" : "Create New Product"}
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                placeholder="e.g., Boundaries and Balance"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                placeholder="Brief description of the product..."
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Type & Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                  value={form.type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setForm({ ...form, type: nextType, stock: "" });
                    if (nextType === "merch") {
                      setEbookFile(null);
                      setEbookFileName("");
                    }
                  }}
                >
                  <option value="ebook">Ebook</option>
                  <option value="merch">Merchandise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Stock (Merch only) */}
            {form.type === "merch" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
            )}

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image {!isEdit && "*"}
              </label>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="coverImage"
                  />
                  <label
                    htmlFor="coverImage"
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00337C] transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {coverImage ? coverImage.name : "Choose cover image"}
                    </span>
                  </label>
                </div>
                {coverPreview && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverPreview("");
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ebook File (Ebook only) */}
            {form.type === "ebook" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ebook File (PDF) {!isEdit && "*"}
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleEbookFileChange}
                      className="hidden"
                      id="ebookFile"
                    />
                    <label
                      htmlFor="ebookFile"
                      className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00337C] transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{ebookFileName || "Choose PDF file"}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Product"
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
