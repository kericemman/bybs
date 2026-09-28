import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../api/product.api";
import { X, Upload, Loader, Images } from "lucide-react";
import { compressImageFile } from "../../utils/imageCompression";

const MAX_FILE_UPLOAD_SIZE = 20 * 1024 * 1024;
const MAX_FORM_UPLOAD_SIZE = 60 * 1024 * 1024;

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
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [preparingImages, setPreparingImages] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        type: product.type || "ebook",
        price: product.price ?? "",
        stock: product.stock ?? "",
      });
      if (product.coverImage?.url) {
        setCoverPreview(product.coverImage.url);
      }
      if (product.fileUrl) {
        setEbookFileName("Existing PDF uploaded");
      }
      setExistingImages(product.images || []);
      setRemovedImageIds([]);
      setProductImages([]);
      setProductImagePreviews([]);
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
      setProductImages([]);
      setProductImagePreviews([]);
      setExistingImages([]);
      setRemovedImageIds([]);
    }
  }, [product]);

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      setError("Please choose a valid image for the cover.");
      return;
    }

    setError("");

    try {
      const compressedFile = await compressImageFile(file);
      if (compressedFile.size > MAX_FILE_UPLOAD_SIZE) {
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

    if (file.size > MAX_FILE_UPLOAD_SIZE) {
      setError("The ebook PDF is too large. Please upload a file under 20MB.");
      return;
    }

    setError("");
    setEbookFile(file);
    setEbookFileName(file.name);
  };

  const readPreview = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProductImagesChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const availableSlots = 6 - existingImages.length - productImages.length;
    if (availableSlots <= 0 || selectedFiles.length > availableSlots) {
      setError(`You can add ${Math.max(availableSlots, 0)} more product images.`);
      return;
    }

    setPreparingImages(true);
    setError("");
    try {
      const compressedFiles = await Promise.all(
        selectedFiles.map((file) =>
          compressImageFile(file, { maxWidth: 1800, maxHeight: 1800, quality: 0.82 })
        )
      );
      if (compressedFiles.some((file) => file.size > MAX_FILE_UPLOAD_SIZE)) {
        setError("One or more images are too large. Please keep each image under 20MB.");
        return;
      }

      const previews = await Promise.all(compressedFiles.map(readPreview));
      setProductImages((current) => [...current, ...compressedFiles]);
      setProductImagePreviews((current) => [...current, ...previews]);
    } catch (imageError) {
      console.error("Product image compression failed:", imageError);
      setError("One or more product images could not be prepared. Please use JPG, PNG, or WebP.");
    } finally {
      setPreparingImages(false);
    }
  };

  const removeExistingImage = (image) => {
    setExistingImages((current) => current.filter((item) => item.public_id !== image.public_id));
    setRemovedImageIds((current) => [...current, image.public_id]);
  };

  const removeNewImage = (index) => {
    setProductImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setProductImagePreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
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
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setError("Price must be 0 or more");
      return false;
    }
    if (
      form.type === "merch" &&
      (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
    ) {
      setError("Stock must be a whole number of 0 or more");
      return false;
    }
    if (!isEdit && !coverImage) {
      setError("Cover image is required");
      return false;
    }
    if (form.type === "ebook" && !ebookFile && !product?.fileUrl) {
      setError("Ebook file is required");
      return false;
    }

    const uploadSize = [coverImage, ebookFile, ...productImages]
      .filter(Boolean)
      .reduce((total, file) => total + file.size, 0);

    if (uploadSize > MAX_FORM_UPLOAD_SIZE) {
      setError("The cover, gallery images, and ebook file must total less than 60MB.");
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
    if (form.price !== "") formData.append("price", form.price);

    // Only append stock for merch
    if (form.type === "merch" && form.stock !== "") {
      formData.append("stock", form.stock);
    }

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    productImages.forEach((image) => formData.append("productImages", image));
    if (removedImageIds.length) {
      formData.append("removeImageIds", JSON.stringify(removedImageIds));
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

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-form-title"
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
            <h2 id="product-form-title" className="text-xl font-light text-white">
              {isEdit ? "Edit Product" : "Create New Product"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product form"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Display */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600"
              >
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="product-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                id="product-title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                placeholder="e.g., Boundaries and Balance"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="product-description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="product-description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                placeholder="Brief description of the product..."
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Type & Price Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type *
                </label>
                <select
                  id="product-type"
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
                <label
                  htmlFor="product-price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <p className="mt-2 text-xs text-gray-500">Enter 0 when the product is free.</p>
              </div>
            </div>

            {/* Stock (Merch only) */}
            {form.type === "merch" && (
              <div>
                <label
                  htmlFor="product-stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock Quantity *
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
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
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image {!isEdit && "*"}
              </p>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
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
                    <img
                      src={coverPreview}
                      alt="Primary product preview"
                      className="w-full h-full object-contain"
                    />
                    {coverImage && (
                      <button
                        type="button"
                        aria-label="Remove selected primary image"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview(product?.coverImage?.url || "");
                        }}
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-gray-700" htmlFor="productImages">
                  Additional product images
                </label>
                <span className="text-xs text-gray-500">
                  {existingImages.length + productImages.length}/6
                </span>
              </div>
              <input
                id="productImages"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleProductImagesChange}
                disabled={preparingImages || existingImages.length + productImages.length >= 6}
                className="sr-only"
              />
              <label
                htmlFor="productImages"
                className="flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-center transition-colors hover:border-[#00337C]"
              >
                {preparingImages ? (
                  <Loader className="h-5 w-5 animate-spin text-[#00337C]" />
                ) : (
                  <Images className="h-5 w-5 text-gray-400" />
                )}
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {preparingImages ? "Preparing images..." : "Choose up to 6 gallery images"}
                </span>
                <span className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP</span>
              </label>

              {(existingImages.length > 0 || productImagePreviews.length > 0) && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {existingImages.map((image) => (
                    <div
                      key={image.public_id || image.url}
                      className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={image.url}
                        alt="Existing product"
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image)}
                        aria-label="Remove existing product image"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {productImagePreviews.map((preview, index) => (
                    <div
                      key={`${preview.slice(0, 40)}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={preview}
                        alt={`New product ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        aria-label={`Remove new product image ${index + 1}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ebook File (Ebook only) */}
            {form.type === "ebook" && (
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Ebook File (PDF) {!isEdit && "*"}
                </p>
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
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading || preparingImages}
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
