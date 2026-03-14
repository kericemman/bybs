import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  BookOpen, 
  Share2, 
  Bookmark,
  User,
  Tag,
  Menu,
  ChevronRight,
  Hash
} from "lucide-react";
import { fetchArticleBySlug } from "../../api/pubclicArticle.api";

const ArticleDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const { data } = await fetchArticleBySlug(slug);
        setArticle(data);
        
        // Extract headings from content for table of contents
        if (data.content) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = data.content;
          const h2s = Array.from(tempDiv.querySelectorAll('h2, h3'));
          const headingData = h2s.map((h, i) => ({
            id: `heading-${i}`,
            text: h.textContent,
            level: h.tagName.toLowerCase(),
            element: h
          }));
          setHeadings(headingData);
        }
      } catch (error) {
        console.error("Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  // Intersection Observer for active heading highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Adjust for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-light text-gray-700 mb-4">Article not found</h1>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-[#00337C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </button>
        </div>
      </div>

      {/* Hero Section - Image left, content right */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {article.coverImage?.url ? (
                <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={article.coverImage.url}
                    alt={article.title}
                    className="w-full h-[250px] lg:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-[400px] lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </motion.div>

            {/* Right Column - Title and Description */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col justify-between h-full"
            >
              <div>
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl lg:text-4xl font-light text-[#00337C] mb-6 leading-tight tracking-tight">
                  {article.title}
                </h1>

                {/* Description */}
                {article.description && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {article.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(article.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {getReadingTime(article.content)}
                    </div>
                    {article.author && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {article.author}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'bg-[#FFD166] text-gray-900' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save for later'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content with Table of Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article Content - 70% width */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Article Content with headings */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(
                    /<(h2|h3)([^>]*)>/g, 
                    (match, tag, attrs) => {
                      const index = (article.content.match(new RegExp(`<${tag}`, 'g')) || []).length - 1;
                      return `<${tag} id="heading-${index}"${attrs}>`;
                    }
                  )
                }}
              />
              
              {/* Custom styling for the article content */}
              <style>{`
                .article-content h2 {
                  font-size: 1.5rem;
                  font-weight: 300;
                  color: #00337C;
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                  line-height: 1.3;
                  padding-top: 0.2rem;
                  
                }
                
                .article-content h2:first-of-type {
                  border-top: none;
                  margin-top: 0;
                  padding-top: 0;
                }
                
                .article-content h3 {
                  font-size: 1rem;
                  font-weight: 400;
                  color: #1E4B9E;
                  margin-top: 2.5rem;
                  margin-bottom: 1rem;
                }
                
                .article-content p {
                  font-size: 1.125rem;
                  line-height: 1.5;
                  color: #374151;
                  margin-bottom: 1.5rem;
                }
                
                .article-content ul, 
                .article-content ol {
                  margin-bottom: 1.5rem;
                  padding-left: 1.5rem;
                }
                
                .article-content li {
                  margin-bottom: 0.5rem;
                  line-height: 1.7;
                }
                
                .article-content blockquote {
                  border-left: 4px solid #B76E79;
                  padding-left: 1.5rem;
                  margin: 2rem 0;
                  font-style: italic;
                  color: #6B7280;
                  font-size: 1.25rem;
                  line-height: 1.6;
                }
                
                .article-content a {
                  color: #00337C;
                  text-decoration: underline;
                  text-underline-offset: 2px;
                }
                
                .article-content a:hover {
                  color: #1E4B9E;
                }
                
                .article-content img {
                  border-radius: 0.75rem;
                  margin: 2rem 0;
                  max-width: 100%;
                  height: auto;
                }
                
                .article-content code {
                  background-color: #F3F4F6;
                  padding: 0.2rem 0.4rem;
                  border-radius: 0.25rem;
                  font-size: 0.875rem;
                }
                
                .article-content pre {
                  background-color: #1F2937;
                  color: #F9FAFB;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 2rem 0;
                }
              `}</style>
            </motion.div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-[#FFD166] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save Article'}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {article.views ? `${article.views} views` : 'Thanks for reading!'}
                </div>
              </div>

              {/* Back to Articles */}
              <div className="mt-8">
                <Link
                  to="/articles"
                  className="inline-flex items-center text-[#00337C] hover:text-[#1E4B9E] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to all articles
                </Link>
              </div>
            </div>
          </article>

          {/* Table of Contents Sidebar - 30% width */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <Menu className="w-5 h-5 text-[#00337C] mr-3" />
                  <h3 className="text-lg font-light text-[#00337C]">Table of Contents</h3>
                </div>

                {headings.length > 0 ? (
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start ${
                          activeHeading === heading.id
                            ? 'bg-[#00337C] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Hash className={`w-3 h-3 mt-1 mr-2 flex-shrink-0 ${
                          activeHeading === heading.id ? 'text-white' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${heading.level === 'h3' ? 'ml-4' : ''}`}>
                          {heading.text}
                        </span>
                      </button>
                    ))}
                  </nav>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No headings available for this article.
                  </p>
                )}

                {/* Reading Progress */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Reading progress</span>
                    <span className="text-[#00337C] font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#00337C] to-[#1E4B9E] h-2 rounded-full transition-all duration-300"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-light text-[#00337C] mb-1">
                        {getReadingTime(article.content).split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-500">Read time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-light text-[#00337C] mb-1">
                        {headings.length}
                      </div>
                      <div className="text-xs text-gray-500">Sections</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Article Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/articles?tag=${tag}`}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;