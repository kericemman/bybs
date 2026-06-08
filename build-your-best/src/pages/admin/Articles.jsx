import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { fetchArticles as fetchArticlesAPI, deleteArticle } from "../../api/articles.api";
import ArticleForm from "../admin/ArticleForm";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  Download,
  MoreVertical,
  BarChart3,
  Users,
  Tag,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Archive,
} from "lucide-react";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const itemsPerPage = 8;

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data } = await fetchArticlesAPI();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // 🔹 Apply filters
  useEffect(() => {
    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (article) => article.status === statusFilter
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, articles]);

  // 🔹 Delete article
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`))
      return;

    try {
      await deleteArticle(id);
      loadArticles();
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  // 🔹 Status badge
  const getStatusBadge = (status) => {
    const map = {
      published: {
        color: "bg-green-50 text-green-700 border border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Published"
      },
      draft: {
        color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
        label: "Draft"
      },
      archived: {
        color: "bg-gray-100 text-gray-700 border border-gray-200",
        icon: <Archive className="w-4 h-4" />,
        label: "Archived"
      },
    };

    const config = map[status] || map.draft;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        <span className="ml-1.5">{config.label}</span>
      </span>
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getArticlePreview = (article, maxLength = 150) => {
    const source = article.excerpt || article.description || article.content || "";
    const plainText = source.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    if (plainText.length <= maxLength) return plainText;
    return `${plainText.slice(0, maxLength).trim()}...`;
  };

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // 🔹 Stats
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {/* HEADER */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl mt-10 sm:text-3xl font-light text-gray-900">Articles</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Manage and publish your content
                </p>
              </div>

              <button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>New Article</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Articles</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#00337C]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.published}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.drafts}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles by title or content..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1 md:flex-none">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <span className="hidden sm:inline ml-2 text-gray-700">Tags</span>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== "all") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("all")} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* MODAL */}
          <AnimatePresence>
            {open && (
              <ArticleForm
                article={editing}
                onClose={() => setOpen(false)}
                onSaved={() => {
                  loadArticles();
                  setOpen(false);
                }}
              />
            )}
          </AnimatePresence>

          {/* ARTICLES LIST */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#00337C] mx-auto" />
                <p className="mt-4 text-gray-500">Loading articles…</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first article"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <button
                    onClick={() => {
                      setEditing(null);
                      setOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-lg hover:opacity-90"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Article
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Article</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentArticles.map((article) => (
                        <tr key={article._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <h3 className="font-medium text-gray-900 group-hover:text-[#00337C] transition-colors">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {getArticlePreview(article)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(article.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>{formatDate(article.updatedAt || article.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {article.status === "published" && (
                                <a
                                  href={`/articles/${article.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                                  title="View article"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setEditing(article);
                                  setOpen(true);
                                }}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-gray-600 hover:text-gray-700"
                                title="Edit article"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(article._id, article.title)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                                title="Delete article"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                  <div className="p-4 space-y-4">
                    {currentArticles.map((article) => (
                      <div key={article._id} className="bg-gray-50/50 border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                            <div className="flex items-center mt-2">
                              {getStatusBadge(article.status)}
                              <span className="flex items-center text-sm text-gray-500 ml-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(article.updatedAt || article.createdAt)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setMobileMenuOpen(mobileMenuOpen === article._id ? null : article._id)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-2"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {getArticlePreview(article, 200)}
                        </p>

                        {mobileMenuOpen === article._id && (
                          <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200 pt-4 mt-4"
                          >
                            <div className="flex gap-2">
                              {article.status === "published" && (
                                <a
                                  href={`/articles/${article.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setEditing(article);
                                  setOpen(true);
                                  setMobileMenuOpen(null);
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(article._id, article.title);
                                  setMobileMenuOpen(null);
                                }}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </Motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-[#00337C] text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          {!loading && articles.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{filteredArticles.length}</span> articles found
                {searchTerm && (
                  <span className="ml-2">for "{searchTerm}"</span>
                )}
              </div>
              <button className="flex items-center text-[#00337C] hover:text-[#1E4B9E] transition-colors">
                <Download className="w-4 h-4 mr-2" />
                <span>Export Data</span>
              </button>
            </div>
          )}
        </Motion.div>
      </div>
    </AdminLayout>
  );
};

export default Articles;
