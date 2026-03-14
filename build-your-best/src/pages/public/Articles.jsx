import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen, Search } from "lucide-react";
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
    if (searchTerm.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '3 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="py-10 bg-gradient-to-br from-[#F5F9FF] to-[#FFF0F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm mb-6">
              <BookOpen className="w-4 h-4 mr-2 text-[#00337C]" />
              <span className="text-[#00337C]">Personal Growth Library</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-[#00337C] mb-6">
              Articles & Insights
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Thoughtful perspectives on self-discovery, boundaries, empowerment, and living intentionally.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-light text-gray-700 mb-4">
                {searchTerm ? 'No articles found' : 'No articles published yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try searching with different keywords or browse all articles.'
                  : 'Check back soon for new insights and perspectives.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-2xl font-light text-[#00337C]">
                    Latest Articles
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-[#00337C] hover:text-[#1E4B9E] transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Link
                      to={`/articles/${article.slug}`}
                      className="group block bg-white border border-gray-100 hover:border-[#00337C]/30 transition-all duration-300 h-full flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
                        {article.coverImage?.url ? (
                          <img
                            src={article.coverImage.url}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <span className="text-sm text-gray-400">No image</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex-grow">
                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="mb-3">
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {article.tags[0]}
                              </span>
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="text-xl font-light text-[#00337C] mb-3 leading-tight group-hover:text-[#1E4B9E] transition-colors">
                            {article.title}
                          </h3>

                          {/* Description */}
                          {article.description && (
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                              {article.description}
                            </p>
                          )}
                        </div>

                        {/* Metadata & CTA */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(article.createdAt)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {getReadingTime(article.content)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-[#00337C] font-medium group-hover:text-[#1E4B9E] transition-colors">
                            Read article
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Show search results info */}
              {searchTerm && filteredArticles.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                  <p className="text-gray-600">
                    Showing results for "<span className="font-medium text-[#00337C]">{searchTerm}</span>"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      
      {/* CTA */}
      {articles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-light text-[#00337C] mb-6">
              Want to stay updated?
            </h3>
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
              Subscribe to get notified when new articles are published about personal growth and self-discovery.
            </p>
            <Link
              to="/subscribe"
              className="inline-flex items-center px-8 py-3 bg-[#00337C] text-white font-medium rounded-lg hover:bg-[#1E4B9E] transition-colors"
            >
              Subscribe for Updates
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticlesPage;