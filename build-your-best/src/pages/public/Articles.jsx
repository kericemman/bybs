import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Clock, Search } from "lucide-react";
import { fetchPublishedArticles } from "../../api/pubclicArticle.api";

const ArticlesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const { data } = await fetchPublishedArticles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.description?.toLowerCase().includes(term) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(term))
    );

    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadingTime = (content) => {
    if (!content) return "3 min read";
    const wordCount = content.split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section className="public-section bg-[#F7F9FC]">
        <div className="public-container max-w-4xl text-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="public-eyebrow mb-5">
              <BookOpen className="w-4 h-4" />
              Personal growth library
            </p>
            
            <p className="public-copy text-lg mb-8">
              Thoughtful perspectives on self-discovery, boundaries,
              empowerment, and growth from the inside out.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, topic, or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10 outline-none transition"
              />
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="public-section bg-white">
        <div className="public-container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-[#00337C]">
                Latest articles
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="public-button-secondary px-4 py-2 text-sm"
              >
                Clear search
              </button>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-[#F7F9FC] rounded-lg">
              <BookOpen className="w-14 h-14 text-gray-300 mx-auto mb-5" />
              <h3 className="text-xl font-light text-gray-700 mb-3">
                {searchTerm ? "No articles found" : "No articles published yet"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "Try searching with different keywords or browse all articles."
                  : "Check back soon for new insights and perspectives."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article, index) => (
                <Motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link
                    to={`/articles/${article.slug}`}
                    className="public-card group block overflow-hidden h-full"
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                      {article.coverImage?.url ? (
                        <img
                          src={article.coverImage.url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col min-h-72">
                      {article.tags?.length > 0 && (
                        <span className="inline-flex self-start px-3 py-1 bg-[#F5F9FF] text-[#00337C] text-xs rounded-full mb-4">
                          {article.tags[0]}
                        </span>
                      )}

                      <h3 className="text-xl font-light text-[#00337C] mb-3 leading-tight">
                        {article.title}
                      </h3>

                      {article.description && (
                        <p className="text-gray-600 text-sm leading-6 line-clamp-3 flex-1">
                          {article.description}
                        </p>
                      )}

                      <div className="pt-4 mt-5 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getReadingTime(article.content)}
                          </span>
                        </div>

                        <div className="flex items-center text-[#00337C] font-semibold text-sm">
                          Read article
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;
