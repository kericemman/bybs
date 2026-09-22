import { useState, useRef, useEffect } from "react";
import {
  createArticle,
  updateArticle,
  uploadArticleContentImage,
  fetchArticleReflectionOptions,
} from "../../api/articles.api";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Globe, Eye, Save, Link2, UserRound } from "lucide-react";
import RichTextEditor from "../../layouts/RichEditor";
import { compressImageFile } from "../../utils/imageCompression";

const cleanArticleContent = (html = "") => {
  const container = document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("p").forEach((paragraph) => {
    const hasEmbeddedContent = paragraph.querySelector("img, iframe, video, audio, embed");
    const text = paragraph.textContent.replace(/\u00a0/g, "").trim();

    if (!hasEmbeddedContent && !text) {
      paragraph.remove();
    }
  });

  container.querySelectorAll("hr").forEach((rule) => rule.remove());

  return container.innerHTML;
};

const categories = [
  "Personal Growth",
  "Career",
  "Leadership",
  "Community",
  "Wellbeing",
  "Professional Development",
  "Stories",
];

const ArticleForm = ({ article, onClose, onSaved }) => {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [status, setStatus] = useState(article?.status || "draft");
  const [slug, setSlug] = useState(article?.slug || "");
  const [authorName, setAuthorName] = useState(article?.authorName || "");
  const [authorRole, setAuthorRole] = useState(article?.authorRole || "");
  const [authorBio, setAuthorBio] = useState(article?.authorBio || "");
  const [authorImage, setAuthorImage] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(article?.authorImage?.url || "");
  const [category, setCategory] = useState(article?.category || "Personal Growth");
  const [tags, setTags] = useState((article?.tags || []).join(", "));
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(article?.metaDescription || "");
  const [linkedReflection, setLinkedReflection] = useState(
    article?.linkedReflection?._id || article?.linkedReflection || ""
  );
  const [reflectionOptions, setReflectionOptions] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(article?.coverImage?.url || "");
  const [socialImage, setSocialImage] = useState(null);
  const [socialImagePreview, setSocialImagePreview] = useState(article?.socialImage?.url || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const socialImageInputRef = useRef(null);
  const authorImageInputRef = useRef(null);

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
    setAuthorName(article?.authorName || "");
    setAuthorRole(article?.authorRole || "");
    setAuthorBio(article?.authorBio || "");
    setAuthorImage(null);
    setAuthorImagePreview(article?.authorImage?.url || "");
    setCategory(article?.category || "Personal Growth");
    setTags((article?.tags || []).join(", "));
    setSeoTitle(article?.seoTitle || "");
    setMetaDescription(article?.metaDescription || "");
    setLinkedReflection(article?.linkedReflection?._id || article?.linkedReflection || "");
    setImage(null);
    setImagePreview(article?.coverImage?.url || "");
    setSocialImage(null);
    setSocialImagePreview(article?.socialImage?.url || "");
    setError("");
  }, [article]);

  useEffect(() => {
    let mounted = true;
    fetchArticleReflectionOptions()
      .then(({ data }) => mounted && setReflectionOptions(data || []))
      .catch(() => mounted && setReflectionOptions([]));
    return () => {
      mounted = false;
    };
  }, []);

  const hasContent = (html) => {
    const text = html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();
    return text.length > 0 || /<(img|iframe|video)\s/i.test(html);
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

  const handleContentImageUpload = async (file) => {
    const compressedFile = await compressImageFile(file, {
      maxWidth: 1400,
      maxHeight: 1000,
      quality: 0.82,
    });
    const { data } = await uploadArticleContentImage(compressedFile);

    return data.url;
  };

  const handleSocialImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const compressedFile = await compressImageFile(file, {
        maxWidth: 1200,
        maxHeight: 630,
        quality: 0.82,
      });
      setSocialImage(compressedFile);
      setSocialImagePreview(URL.createObjectURL(compressedFile));
    } catch (imageError) {
      console.error("Social image compression failed:", imageError);
      setError("Could not process the social sharing image.");
    }
  };

  const handleAuthorImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const compressedFile = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.82,
      });
      setAuthorImage(compressedFile);
      setAuthorImagePreview(URL.createObjectURL(compressedFile));
    } catch (imageError) {
      console.error("Author image compression failed:", imageError);
      setError("Could not process the author image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanedContent = cleanArticleContent(content);

      if (!title.trim()) {
        throw new Error("Article title is required.");
      }

      if (!authorName.trim()) {
        throw new Error("Author name is required.");
      }

      if (!hasContent(cleanedContent)) {
        throw new Error("Article content is required.");
      }

      if (!article && !image) {
        throw new Error("Cover image is required.");
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", cleanedContent);
      formData.append("excerpt", excerpt.trim());
      formData.append("description", excerpt.trim());
      formData.append("status", status);
      formData.append("slug", slug.trim());
      formData.append("authorName", authorName.trim());
      formData.append("authorRole", authorRole.trim());
      formData.append("authorBio", authorBio.trim());
      formData.append("category", category);
      formData.append("tags", tags);
      formData.append("seoTitle", seoTitle.trim());
      formData.append("metaDescription", metaDescription.trim());
      formData.append("linkedReflection", linkedReflection);

      if (image) {
        formData.append("coverImage", image);
      }
      if (socialImage) formData.append("socialImage", socialImage);
      if (authorImage) formData.append("authorImage", authorImage);

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
        err.response?.data?.message || err.message || "Failed to save article. Please try again."
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
          className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white">
            <div>
              <h2 className="text-xl font-light">
                {article ? "Edit Insight" : "Create New Insight"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {article ? "Update this BYBS Insight" : "Write and publish a new BYBS Insight"}
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
                  Insight Title *
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
                  <label className="block text-sm font-medium text-gray-700">URL Slug</label>
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
                    /insights/
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

              <section className="space-y-5 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 text-[#00337C]" />
                  <div>
                    <p className="text-sm font-semibold text-[#00337C]">Author</p>
                    <p className="mt-1 text-sm text-gray-500">
                      This information appears on the published insight.
                    </p>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Author name *
                    </label>
                    <input
                      required
                      value={authorName}
                      onChange={(event) => setAuthorName(event.target.value)}
                      maxLength={120}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20"
                      placeholder="Full name or BYBS Team"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Role or title <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      value={authorRole}
                      onChange={(event) => setAuthorRole(event.target.value)}
                      maxLength={160}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20"
                      placeholder="Founder, mentor, contributor..."
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Author bio <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={authorBio}
                    onChange={(event) => setAuthorBio(event.target.value)}
                    maxLength={600}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 leading-7 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20"
                    placeholder="A short biography relevant to this insight."
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">{authorBio.length}/600</p>
                </div>
                <label className="block cursor-pointer text-sm font-medium text-gray-700">
                  Author photo <span className="font-normal text-gray-400">(optional)</span>
                  <span className="mt-2 flex items-center gap-4 rounded-lg border border-dashed border-gray-300 p-4">
                    {authorImagePreview ? (
                      <img
                        src={authorImagePreview}
                        alt="Author preview"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <UserRound className="h-7 w-7 text-gray-400" />
                      </span>
                    )}
                    <span className="text-sm font-normal text-gray-600">
                      Choose a clear square portrait
                    </span>
                  </span>
                  <input
                    ref={authorImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAuthorImageChange}
                    className="sr-only"
                  />
                </label>
              </section>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tags <span className="font-normal text-gray-400">(comma separated)</span>
                  </label>
                  <input
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20"
                    placeholder="confidence, habits, self-awareness"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="space-y-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="h-48 w-full rounded-lg border border-gray-200 bg-gray-50 object-contain"
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
                    <p className="text-gray-600 mb-2">Click to upload cover image</p>
                    <p className="text-sm text-gray-500">Recommended: 1200x630px • Max 5MB</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    onImageUpload={handleContentImageUpload}
                  />
                </div>
              </div>

              <section className="space-y-5 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-sm font-semibold text-[#00337C]">Search and sharing</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Optional fields override the article title, excerpt, and cover image on search
                    engines and social platforms.
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">SEO title</label>
                  <input
                    value={seoTitle}
                    onChange={(event) => setSeoTitle(event.target.value)}
                    maxLength={70}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00337C]"
                    placeholder={title || "Insight title"}
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">{seoTitle.length}/70</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Meta description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(event) => setMetaDescription(event.target.value)}
                    maxLength={180}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#00337C]"
                    placeholder={excerpt || "Concise description for search results"}
                  />
                  <p className="mt-1 text-right text-xs text-gray-400">
                    {metaDescription.length}/180
                  </p>
                </div>
                <label className="block cursor-pointer text-sm font-medium text-gray-700">
                  Social sharing image <span className="font-normal text-gray-400">(optional)</span>
                  <span className="mt-2 flex items-center gap-4 rounded-lg border border-dashed border-gray-300 p-4">
                    {socialImagePreview ? (
                      <img
                        src={socialImagePreview}
                        alt="Social sharing preview"
                        className="h-24 w-40 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-24 w-40 items-center justify-center rounded-lg bg-gray-100">
                        <ImageIcon className="h-7 w-7 text-gray-400" />
                      </span>
                    )}
                    <span className="text-sm font-normal text-gray-600">
                      Recommended 1200 x 630 pixels
                    </span>
                  </span>
                  <input
                    ref={socialImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleSocialImageChange}
                    className="sr-only"
                  />
                </label>
              </section>

              <section className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-start gap-3">
                  <Link2 className="mt-0.5 h-5 w-5 text-[#D67A00]" />
                  <div>
                    <p className="text-sm font-semibold text-[#00337C]">
                      Thursday Insight to Friday Reflection
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Link this insight to one weekly prompt. The prompt and participation button
                      will appear below the article automatically.
                    </p>
                  </div>
                </div>
                <select
                  value={linkedReflection}
                  onChange={(event) => setLinkedReflection(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#00337C]"
                >
                  <option value="">No linked weekly reflection</option>
                  {reflectionOptions.map((prompt) => (
                    <option key={prompt._id} value={prompt._id}>
                      {prompt.weekLabel} - {prompt.title} ({prompt.status})
                    </option>
                  ))}
                </select>
                {linkedReflection && (
                  <p className="rounded-lg bg-[#F5F9FF] p-4 text-sm leading-6 text-[#00337C]">
                    {reflectionOptions.find((prompt) => prompt._id === linkedReflection)?.question}
                  </p>
                )}
              </section>

              {/* Status Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          status === "published"
                            ? "bg-green-500"
                            : status === "draft"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="capitalize">{status}</span>
                      {status === "published" && (
                        <a
                          href={`/insights/${slug}`}
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
                      {article ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {article ? "Update Insight" : "Create Insight"}
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
