import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  Menu,
  Share2,
  Tag,
  Users,
} from "lucide-react";
import {
  fetchArticleBySlug,
  fetchPublishedArticles,
  trackArticleReader,
} from "../../api/pubclicArticle.api";
import SEO from "../../components/SEO";
import {
  absoluteUrl,
  breadcrumbSchema,
  organizationSchema,
  truncate,
} from "../../lib/seo";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getReadingTime = (content) => {
  if (!content) return "3 min read";
  const wordCount = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const removeEmptyParagraphs = (root) => {
  root.querySelectorAll("p").forEach((paragraph) => {
    const hasEmbeddedContent = paragraph.querySelector("img, iframe, video, audio, embed");
    const text = paragraph.textContent.replace(/\u00a0/g, "").trim();

    if (!hasEmbeddedContent && !text) {
      paragraph.remove();
    }
  });
};

const getExcerpt = (article, maxLength = 190) => {
  const source = article?.excerpt || article?.description || article?.content || "";
  const plainText = stripHtml(source);

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
};

const normalizeTags = (tags = []) =>
  Array.isArray(tags)
    ? tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)
    : [];

const getRelatedArticles = (currentArticle, articles = []) => {
  const currentTags = new Set(normalizeTags(currentArticle?.tags));
  const currentSlug = currentArticle?.slug;
  const currentId = currentArticle?._id;

  return articles
    .filter((candidate) => {
      if (!candidate) return false;
      return candidate.slug !== currentSlug && candidate._id !== currentId;
    })
    .map((candidate) => {
      const sharedTagCount = normalizeTags(candidate.tags).filter((tag) =>
        currentTags.has(tag)
      ).length;

      return { ...candidate, sharedTagCount };
    })
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    })
    .slice(0, 3);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const ArticleDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [activeReaders, setActiveReaders] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setArticle(null);
        setRelatedArticles([]);
        const { data } = await fetchArticleBySlug(slug);

        if (data.content) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = data.content;
          removeEmptyParagraphs(tempDiv);
          const headingNodes = Array.from(tempDiv.querySelectorAll("h2, h3"));
          const headingData = headingNodes.map((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;

            return {
              id,
              text: heading.textContent,
              level: heading.tagName.toLowerCase(),
            };
          });

          data.content = tempDiv.innerHTML;
          setHeadings(headingData);
        } else {
          setHeadings([]);
        }

        setArticle(data);
        setActiveReaders(data.activeReaders || 0);

        try {
          const { data: publishedArticles } = await fetchPublishedArticles();
          setRelatedArticles(getRelatedArticles(data, publishedArticles));
        } catch (relatedError) {
          console.error("Error loading related articles:", relatedError);
          setRelatedArticles([]);
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const availableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (availableHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      setReadingProgress(
        Math.min(100, Math.max(0, Math.round((scrollTop / availableHeight) * 100)))
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!slug || !article) return;

    const storageKey = "bybs_article_reader_session";
    const sessionId =
      localStorage.getItem(storageKey) || crypto.randomUUID?.() || `${Date.now()}`;

    localStorage.setItem(storageKey, sessionId);

    const sendHeartbeat = async () => {
      try {
        const { data } = await trackArticleReader(slug, sessionId);
        setActiveReaders(data.activeReaders || 0);
      } catch (error) {
        console.error("Reader heartbeat failed:", error);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);

    return () => clearInterval(interval);
  }, [slug, article]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 96;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleShare = async () => {
    if (!article) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled:", error);
      }
      return;
    }

    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const tocContent = (
    <>
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="mb-2 flex items-center gap-2 text-[#00337C]">
          <Menu className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-wide">
            Table of contents
          </p>
        </div>
        <h2 className="text-lg font-light leading-tight text-slate-950">
          Follow the article
        </h2>
      </div>

      {headings.length > 0 ? (
        <nav className="space-y-1">
          {headings.map((heading, index) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`group flex w-full items-start rounded-md px-2 py-2.5 text-left transition ${
                activeHeading === heading.id
                  ? "bg-[#F5F9FF] text-[#00337C]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] ${
                  activeHeading === heading.id
                    ? "bg-[#00337C] text-white"
                    : "bg-slate-100 text-slate-400 group-hover:text-slate-600"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`ml-2 text-sm leading-5 ${
                  heading.level === "h3" ? "pl-3" : ""
                }`}
              >
                {heading.text}
              </span>
            </button>
          ))}
        </nav>
      ) : (
        <p className="text-sm text-slate-500">
          This article does not have section headings yet.
        </p>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="public-container text-center">
          <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white py-20">
        <SEO
          title="Article not found | Build Your Best Self"
          description="This BYBS article could not be found."
          canonical={absoluteUrl(`/articles/${slug}`)}
          noindex
        />
        <div className="public-container text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-light text-slate-700 mb-4">
            Article not found
          </h1>
          <p className="text-slate-500 mb-8">
            The article you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="public-button-primary px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const excerpt = getExcerpt(article);
  const articleUrl = absoluteUrl(`/articles/${article.slug || slug}`);
  const articleDescription = excerpt || truncate(article.content, 155);
  const articleImage = article.coverImage?.url;
  const articleSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: articleDescription,
      image: articleImage ? [articleImage] : undefined,
      datePublished: article.createdAt,
      dateModified: article.updatedAt || article.createdAt,
      author: {
        "@type": "Organization",
        name: "Build Your Best Self",
        url: absoluteUrl("/"),
      },
      publisher: organizationSchema,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles" },
      { name: article.title, path: `/articles/${article.slug || slug}` },
    ]),
  ];

  return (
    <main className="min-h-screen bg-[#FBFCFE] text-slate-950">
      <SEO
        title={`${article.title} | BYBS Articles`}
        description={articleDescription}
        canonical={articleUrl}
        image={articleImage}
        type="article"
        keywords={article.tags?.join(", ")}
        schema={articleSchema}
      />
      <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-transparent">
        <div
          className="h-full bg-[#00337C] transition-all duration-200"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="border-b border-slate-100 bg-white">
        <div className="public-container py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-[#00337C]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </button>
        </div>
      </div>

      <section className="border-b border-slate-100 bg-white">
        <div className="public-container py-7 md:py-12">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.95fr)] lg:items-center"
          >
            <div className="order-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 lg:order-1">
              {article.coverImage?.url ? (
                <img
                  src={article.coverImage.url}
                  alt={article.title}
                  className="aspect-[16/10] w-full object-cover lg:aspect-[5/4] lg:min-h-[440px]"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center lg:aspect-[5/4] lg:min-h-[440px]">
                  <BookOpen className="w-20 h-20 text-slate-300" />
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F9FF] px-3 py-1 text-sm font-semibold text-[#00337C]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Article
                </span>
                {article.tags?.length > 0 && (
                  <>
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </div>

              <h1 className="max-w-3xl text-3xl font-light leading-tight text-[#00337C] sm:text-4xl lg:text-6xl">
                {article.title}
              </h1>

              {excerpt && (
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                  {excerpt}
                </p>
              )}

              <div className="mt-7 grid gap-3 border-t border-slate-100 pt-5 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.createdAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {getReadingTime(article.content)}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {headings.length} sections
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {activeReaders || 1} reading now
                </span>
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      <section className="bg-white py-9 md:py-16">
        <div className="public-container">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,46rem)_18rem] lg:items-start lg:justify-center">
            <article className="min-w-0 border-t border-slate-200 pt-8 md:pt-12">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <style>{`
                .article-content {
                  max-width: 100%;
                  color: #1f2937;
                }

                .article-content > p:first-of-type {
                  color: #10233F;
                  font-size: 1.16rem;
                  line-height: 1.9;
                  margin-bottom: 1.8rem;
                }

                .article-content h2 {
                  border-top: 1px solid #E5EAF2;
                  font-size: 1.82rem;
                  font-weight: 400;
                  color: #00337C;
                  margin-top: 3.75rem;
                  margin-bottom: 0.75rem;
                  padding-top: 2.25rem;
                  line-height: 1.2;
                  scroll-margin-top: 7rem;
                }

                .article-content h2:first-of-type {
                  margin-top: 0;
                  border-top: 0;
                  padding-top: 0;
                }

                .article-content h3 {
                  font-size: 1.3rem;
                  font-weight: 600;
                  color: #1E4B9E;
                  margin-top: 2.75rem;
                  margin-bottom: 0.65rem;
                  scroll-margin-top: 7rem;
                }

                .article-content p {
                  font-size: 1.075rem;
                  line-height: 1.92;
                  color: #334155;
                  margin-top: 0;
                  margin-bottom: 1.55rem;
                }

                .article-content ul,
                .article-content ol {
                  margin: 1.65rem 0 1.9rem;
                  padding-left: 1.65rem;
                  color: #334155;
                }

                .article-content ul {
                  list-style-type: disc;
                }

                .article-content ol {
                  list-style-type: decimal;
                }

                .article-content li {
                  display: list-item;
                  margin-bottom: 0.7rem;
                  line-height: 1.85;
                  padding-left: 0.25rem;
                  font-size: 1.05rem;
                }

                .article-content li p {
                  margin-bottom: 0;
                }

                .article-content blockquote {
                  border-left: 4px solid #B76E79;
                  background: #F5F9FF;
                  border-radius: 0 0.75rem 0.75rem 0;
                  padding: 1.5rem 1.65rem;
                  margin: 2.5rem 0;
                  color: #10233F;
                  font-size: 1.18rem;
                  line-height: 1.8;
                }

                .article-content hr {
                  border: 0;
                  border-top: 1px solid #E5EAF2;
                  margin: 3rem 0;
                }

                .article-content a {
                  color: #00337C;
                  text-decoration: underline;
                  text-underline-offset: 3px;
                }

                .article-content img {
                  border-radius: 0.75rem;
                  margin: 2.5rem 0;
                  max-width: 100%;
                  height: auto;
                  border: 1px solid #E5E7EB;
                  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
                }

                .article-content strong {
                  font-weight: 700;
                  color: #111827;
                }

                .article-content u {
                  text-decoration-thickness: 1px;
                  text-underline-offset: 3px;
                }

                .article-content code {
                  background-color: #F3F4F6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-size: 0.9rem;
                }

                .article-content pre {
                  background-color: #1F2937;
                  color: #F9FAFB;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 2rem 0;
                }

                .article-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 2rem 0;
                  font-size: 0.95rem;
                }

                .article-content th,
                .article-content td {
                  border: 1px solid #E5EAF2;
                  padding: 0.85rem;
                  text-align: left;
                }

                .article-content th {
                  background: #F5F9FF;
                  color: #00337C;
                  font-weight: 600;
                }

                @media (max-width: 767px) {
                  .article-content h2 {
                    font-size: 1.55rem;
                    margin-top: 2.5rem;
                    padding-top: 1.75rem;
                  }

                  .article-content > p:first-of-type {
                    font-size: 1.05rem;
                    line-height: 1.82;
                  }

                  .article-content p {
                    font-size: 1rem;
                    line-height: 1.8;
                  }

                  .article-content li {
                    font-size: 1rem;
                  }
                }

              `}</style>
              </Motion.div>

              <div className="mt-14 border-t border-slate-100 pt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsBookmarked((value) => !value)}
                      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition ${
                        isBookmarked
                          ? "bg-[#FFD166] text-slate-900"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${
                          isBookmarked ? "fill-current" : ""
                        }`}
                      />
                      {isBookmarked ? "Saved" : "Save"}
                    </button>

                    <button
                      onClick={handleShare}
                      className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>

                  <Link
                    to="/articles"
                    className="inline-flex items-center text-sm font-semibold text-[#00337C] hover:text-[#1E4B9E]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all articles
                  </Link>
                </div>
              </div>
            </article>

            <aside
              className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
              aria-label="Article table of contents"
            >
              <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-slate-200 pl-5">
                {tocContent}

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="mb-3 flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{readingProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#00337C] transition-all duration-200"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {getReadingTime(article.content)} - {headings.length} sections
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="border-t border-slate-100 bg-[#F7F9FC] py-10 md:py-16">
          <div className="public-container">
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#00337C]">
                    Keep reading
                  </p>
                  <h2 className="text-2xl font-light text-[#00337C] md:text-3xl">
                    More articles for your season
                  </h2>
                </div>

                <Link
                  to="/articles"
                  className="inline-flex items-center text-sm font-semibold text-[#00337C] hover:text-[#1E4B9E]"
                >
                  View all articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {relatedArticles.map((relatedArticle, index) => (
                  <Motion.article
                    key={relatedArticle._id || relatedArticle.slug}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/articles/${relatedArticle.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {relatedArticle.coverImage?.url ? (
                          <img
                            src={relatedArticle.coverImage.url}
                            alt={relatedArticle.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-3 text-xl font-light leading-tight text-[#00337C]">
                          {relatedArticle.title}
                        </h3>
                        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                          {getExcerpt(relatedArticle, 150)}
                        </p>

                        <div className="mt-auto border-t border-slate-100 pt-4">
                          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {formatDate(relatedArticle.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {getReadingTime(relatedArticle.content)}
                            </span>
                          </div>
                          <span className="inline-flex items-center text-sm font-semibold text-[#00337C]">
                            Read article
                            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ArticleDetails;
