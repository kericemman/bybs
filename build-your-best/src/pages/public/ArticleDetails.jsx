import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  Hash,
  Menu,
  Share2,
  Tag,
  Users,
} from "lucide-react";
import {
  fetchArticleBySlug,
  trackArticleReader,
} from "../../api/pubclicArticle.api";

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

const getExcerpt = (article, maxLength = 190) => {
  const source = article?.excerpt || article?.description || article?.content || "";
  const plainText = stripHtml(source);

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}...`;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const { data } = await fetchArticleBySlug(slug);

        if (data.content) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = data.content;
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
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-2 text-[#00337C]">
          <Menu className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-wide">
            On this page
          </p>
        </div>
        <h2 className="text-lg font-light text-slate-900">
          Article sections
        </h2>
      </div>

      {headings.length > 0 ? (
        <nav className="space-y-1.5">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`flex w-full items-start border-l-2 px-3 py-2 text-left transition ${
                activeHeading === heading.id
                  ? "border-[#00337C] bg-[#F5F9FF] text-[#00337C]"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Hash
                className={`mt-1 h-3 w-3 flex-shrink-0 ${
                  activeHeading === heading.id ? "text-[#00337C]" : "text-slate-300"
                }`}
              />
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

  return (
    <main className="min-h-screen bg-[#FBFCFE] text-slate-950">
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
        <div className="public-container py-7 md:py-10">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center"
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              {article.coverImage?.url ? (
                <img
                  src={article.coverImage.url}
                  alt={article.title}
                  className="aspect-[16/10] w-full object-cover lg:aspect-[4/3] lg:min-h-[420px]"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center lg:aspect-[4/3] lg:min-h-[420px]">
                  <BookOpen className="w-20 h-20 text-slate-300" />
                </div>
              )}
            </div>

            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {article.tags?.length > 0 && (
                  <>
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-[#00337C]/10 bg-[#F5F9FF] px-3 py-1 text-sm text-[#00337C]"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  {activeReaders || 1} reading now
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-light leading-tight text-[#00337C] sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {excerpt && (
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                  {excerpt}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-5 text-sm text-slate-500">
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
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      <div className="public-container py-6 lg:hidden">
        <details className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer text-base font-semibold text-[#00337C]">
            Table of contents
          </summary>
          <div className="mt-5">{tocContent}</div>
        </details>
      </div>

      <section className="public-container py-8 md:py-12">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,43rem)_17rem] lg:items-start lg:justify-center">
          <article className="min-w-0">
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

                .article-content h2 {
                  font-size: 1.65rem;
                  font-weight: 400;
                  color: #00337C;
                  margin-top: 3rem;
                  margin-bottom: 1.25rem;
                  line-height: 1.2;
                }

                .article-content h2:first-of-type {
                  margin-top: 0;
                }

                .article-content h3 {
                  font-size: 1.175rem;
                  font-weight: 600;
                  color: #1E4B9E;
                  margin-top: 2.5rem;
                  margin-bottom: 1rem;
                }

                .article-content p {
                  font-size: 1.075rem;
                  line-height: 1.9;
                  color: #334155;
                  margin-bottom: 1.45rem;
                }

                .article-content ul,
                .article-content ol {
                  margin: 1.5rem 0 1.75rem;
                  padding-left: 1.5rem;
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
                  margin-bottom: 0.6rem;
                  line-height: 1.8;
                  padding-left: 0.25rem;
                  font-size: 1.075rem;
                }

                .article-content li p {
                  margin-bottom: 0;
                }

                .article-content blockquote {
                  border-left: 4px solid #B76E79;
                  background: #F7F9FC;
                  border-radius: 0 0.5rem 0.5rem 0;
                  padding: 1.25rem 1.5rem;
                  margin: 2.25rem 0;
                  color: #334155;
                  font-size: 1.15rem;
                  line-height: 1.75;
                }

                .article-content a {
                  color: #00337C;
                  text-decoration: underline;
                  text-underline-offset: 3px;
                }

                .article-content img {
                  border-radius: 0.5rem;
                  margin: 2.25rem 0;
                  max-width: 100%;
                  height: auto;
                  border: 1px solid #E5E7EB;
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

                @media (max-width: 767px) {
                  .article-content h2 {
                    font-size: 1.55rem;
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
            className="hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:self-start"
            aria-label="Article table of contents"
          >
            <div className="border-l border-slate-200 pl-5">
              {tocContent}

              <div className="mt-7 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                <p className="flex items-center justify-between gap-4">
                  <span>Read time</span>
                  <span className="font-medium text-slate-800">
                    {getReadingTime(article.content)}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span>Sections</span>
                  <span className="font-medium text-slate-800">
                    {headings.length}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-4">
                  <span>Reading now</span>
                  <span className="font-medium text-slate-800">
                    {activeReaders || 1}
                  </span>
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-[#00337C]">
                  Reading progress
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#00337C] transition-all duration-200"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {readingProgress}% complete
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsBookmarked((value) => !value)}
                  className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isBookmarked
                      ? "bg-[#FFD166] text-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Bookmark
                    className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-[#00337C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1E4B9E]"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </button>
              </div>

              {article.tags?.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-sm font-semibold text-[#00337C]">
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F5F9FF] px-3 py-1 text-xs text-[#00337C]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ArticleDetails;
