import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Clock, Search, X } from "lucide-react";
import { fetchPublishedArticles } from "../../api/pubclicArticle.api";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getExcerpt = (article, maxLength = 170) => {
  const source = article?.excerpt || article?.description || article?.content || "";
  const plainText = stripHtml(source);

  if (!plainText) return "Read the full article for practical insights and reflection.";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const getReadingTime = (content) => {
  if (!content) return "3 min read";
  const wordCount = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const { data } = await fetchPublishedArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return articles;

    return articles.filter((article) => {
      const searchableText = [
        article.title,
        getExcerpt(article, 320),
        ...(article.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [articles, searchTerm]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = featuredArticle ? filteredArticles.slice(1) : [];

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
    <main className="bg-white text-slate-950">
      <section className="bg-[#F7F9FC] border-b border-slate-100">
        <div className="public-container py-5 md:py-10">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
          >
            <div>
              <p className="public-eyebrow mb-5">
                <BookOpen className="w-4 h-4" />
                Personal growth library
              </p>
              
              <p className="public-copy text-lg max-w-2xl">
                Clear, thoughtful writing on self-discovery, boundaries,
                healing, empowerment, and building a life from the inside out.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-4 pl-12 pr-12 outline-none transition focus:border-[#00337C] focus:ring-4 focus:ring-[#00337C]/10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-light text-[#00337C]">
                Latest articles
              </h2>
             
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-[#F7F9FC] px-6 py-16 text-center">
              <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-5" />
              <h3 className="text-xl font-light text-slate-700 mb-3">
                {searchTerm ? "No articles found" : "No articles published yet"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchTerm
                  ? "Try a different search term or clear the search."
                  : "Check back soon for new insights and perspectives."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {featuredArticle && (
                <Motion.article
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    to={`/articles/${featuredArticle.slug}`}
                    className="group grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.05fr_0.95fr]"
                  >
                    <div className="relative min-h-72 overflow-hidden bg-slate-100 lg:min-h-[28rem]">
                      {featuredArticle.coverImage?.url ? (
                        <img
                          src={featuredArticle.coverImage.url}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center p-6 md:p-10">
                      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#00337C]">
                        Featured article
                      </p>
                      <h3 className="mb-4 text-3xl font-light leading-tight text-[#00337C] md:text-4xl">
                        {featuredArticle.title}
                      </h3>
                      <p className="mb-8 text-base leading-7 text-slate-600 md:text-lg">
                        {getExcerpt(featuredArticle, 240)}
                      </p>

                      <div className="mb-7 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredArticle.createdAt)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {getReadingTime(featuredArticle.content)}
                        </span>
                      </div>

                      <span className="inline-flex items-center font-semibold text-[#00337C]">
                        Read article
                        <ArrowRight className="ml-2 w-4 h-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Motion.article>
              )}

              {remainingArticles.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {remainingArticles.map((article, index) => (
                    <Motion.article
                      key={article._id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.04 }}
                    >
                      <Link
                        to={`/articles/${article.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          {article.coverImage?.url ? (
                            <img
                              src={article.coverImage.url}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-slate-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="mb-3 text-xl font-light leading-tight text-[#00337C]">
                            {article.title}
                          </h3>
                          <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                            {getExcerpt(article)}
                          </p>

                          <div className="border-t border-slate-100 pt-4">
                            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(article.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {getReadingTime(article.content)}
                              </span>
                            </div>
                            <span className="inline-flex items-center text-sm font-semibold text-[#00337C]">
                              Read article
                              <ArrowRight className="ml-2 w-4 h-4 transition group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Motion.article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ArticlesPage;
