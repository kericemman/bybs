import { useState, useRef, useEffect } from "react";
import {
    createArticle,
    updateArticle,
  } from "../../api/articles.api";  
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Globe, Eye, Save } from "lucide-react";
import RichTextEditor from "../../layouts/RichEditor";
import { compressImageFile } from "../../utils/imageCompression";

const ArticleForm = ({ article, onClose, onSaved }) => {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [status, setStatus] = useState(article?.status || "draft");
  const [slug, setSlug] = useState(article?.slug || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(article?.coverImage?.url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    if (!slug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slug]);

  useEffect(() => {
    setTitle(article?.title || "");
    setContent(article?.content || "");
    setExcerpt(article?.excerpt || article?.description || "");
    setStatus(article?.status || "draft");
    setSlug(article?.slug || "");
    setImage(null);
    setImagePreview(article?.coverImage?.url || "");
    setError("");
  }, [article]);

  const hasContent = (html) => {
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    return text.length > 0 || /<img\s/i.test(html);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setError("");
        const compressedFile = await compressImageFile(file);
        setImage(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression failed:", error);
        setError("Could not process this image. Please try another image.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error("Article title is required.");
      }

      if (!hasContent(content)) {
        throw new Error("Article content is required.");
      }

      if (!article && !image) {
        throw new Error("Cover image is required.");
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("excerpt", excerpt.trim());
      formData.append("description", excerpt.trim());
      formData.append("status", status);
      formData.append("slug", slug.trim());
      
      if (image) {
        formData.append("coverImage", image);
      }

      if (article) {
        await updateArticle(article._id, formData);
      } else {
        await createArticle(formData);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Error saving article:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save article. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlug = () => {
    if (title) {
      setSlug(generateSlug(title));
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white">
            <div>
              <h2 className="text-xl font-light">
                {article ? "Edit Article" : "Create New Article"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {article ? "Update your article content" : "Write and publish a new article"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all"
                  required
                />
              </div>

              {/* Slug Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="text-sm text-[#00337C] hover:text-[#1E4B9E] flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Generate from title
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                    /blog/
                  </span>
                  <input
                    type="text"
                    placeholder="article-url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                  <span className="text-gray-400 ml-2">(Optional summary for previews)</span>
                </label>
                <textarea
                  placeholder="Brief summary of the article (displayed in listings)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all h-24 resize-none"
                  maxLength={160}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {excerpt.length}/160 characters
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#00337C] transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload cover image
                    </p>
                    <p className="text-sm text-gray-500">
                      Recommended: 1200x630px • Max 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                  />
                </div>
              </div>

              {/* Status Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all appearance-none bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        status === 'published' ? 'bg-green-500' :
                        status === 'draft' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="capitalize">{status}</span>
                      {status === 'published' && (
                        <a
                          href={`/articles/${slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-3 text-[#00337C] hover:text-[#1E4B9E] flex items-center text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !hasContent(content)}
                  className="px-6 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {article ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {article ? 'Update Article' : 'Create Article'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ArticleForm;
