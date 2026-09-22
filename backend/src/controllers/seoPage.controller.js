const fs = require("node:fs/promises");
const path = require("node:path");
const mongoose = require("mongoose");
const Article = require("../models/Article");
const Cohort = require("../models/Cohort");
const CommunityAction = require("../models/CommunityAction");
const Product = require("../models/Product");
const WeeklyReflectionPrompt = require("../models/WeeklyReflectionPrompt");
const renderSeoHtml = require("../utils/renderSeoHtml");

const SITE_NAME = "Build Your Best Self";
const SITE_URL = (
  process.env.FRONTEND_URL ||
  process.env.SITE_URL ||
  "https://buildyourbestself.org"
).replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/assets/Logo1.png`;
const DEFAULT_DESCRIPTION =
  "Build Your Best Self is a personal and professional growth community supporting young people and women through fellowship, mentorship, empowerment, insights, and community action.";
const INDEX_PATH =
  process.env.FRONTEND_INDEX_PATH ||
  path.resolve(__dirname, "../../../build-your-best/dist/index.html");

const absoluteUrl = (value = "/") => {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
};

const imageUrl = (image) => absoluteUrl(image?.url || image || DEFAULT_IMAGE);

const stripHtml = (value = "") =>
  String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const descriptionFrom = (...values) => {
  const description = values.map(stripHtml).find(Boolean) || DEFAULT_DESCRIPTION;
  return description.length <= 160 ? description : `${description.slice(0, 157).trim()}...`;
};

const isoDate = (value) => (value ? new Date(value).toISOString() : undefined);

const breadcrumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

const baseMetadata = (routePath, title, description, image, options = {}) => ({
  title,
  description,
  canonical: absoluteUrl(routePath),
  heading: options.heading || title.split("|")[0].trim(),
  image: imageUrl(image),
  imageAlt: options.imageAlt || options.heading || title.split("|")[0].trim(),
  siteName: SITE_NAME,
  type: options.type || "website",
  noindex: Boolean(options.noindex),
  schema: options.schema,
  extraMeta: options.extraMeta,
});

const articleMetadata = async (slug) => {
  const article = await Article.findOne({ slug, status: "published" })
    .select(
      "title slug excerpt description content authorName category coverImage socialImage seoTitle metaDescription publishedAt createdAt updatedAt"
    )
    .lean();
  if (!article) return null;

  const routePath = `/insights/${article.slug}`;
  const description = descriptionFrom(
    article.metaDescription,
    article.excerpt,
    article.description,
    article.content
  );
  const image = imageUrl(article.socialImage?.url || article.coverImage?.url);
  return baseMetadata(
    routePath,
    article.seoTitle || `${article.title} | BYBS Insights`,
    description,
    image,
    {
      heading: article.title,
      imageAlt: article.title,
      type: "article",
      extraMeta: [
        {
          key: "article:published_time",
          content: isoDate(article.publishedAt || article.createdAt),
        },
        { key: "article:modified_time", content: isoDate(article.updatedAt) },
        { key: "article:section", content: article.category },
      ],
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description,
          image: [image],
          datePublished: article.publishedAt || article.createdAt,
          dateModified: article.updatedAt,
          author: {
            "@type": article.authorName ? "Person" : "Organization",
            name: article.authorName || SITE_NAME,
          },
          publisher: { "@id": `${SITE_URL}/#organization` },
          mainEntityOfPage: absoluteUrl(routePath),
        },
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: routePath },
        ]),
      ],
    }
  );
};

const productMetadata = async (slug) => {
  const product = await Product.findOne({ slug })
    .select("title slug description type price stock coverImage updatedAt")
    .lean();
  if (!product) return null;

  const routePath = `/shop/${product.slug}`;
  const description = descriptionFrom(product.description);
  const image = imageUrl(product.coverImage);
  return baseMetadata(routePath, `${product.title} | BYBS Shop`, description, image, {
    heading: product.title,
    imageAlt: product.title,
    type: "product",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description,
        image: [image],
        sku: String(product._id),
        category: product.type === "ebook" ? "Digital product" : "Merchandise",
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(routePath),
          priceCurrency: "USD",
          price: Number(product.price || 0).toFixed(2),
          availability:
            product.type === "merch" && product.stock <= 0
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
        },
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: product.title, path: routePath },
      ]),
    ],
  });
};

const cohortMetadata = async (slug, isApplication) => {
  const cohort = await Cohort.findOne({ slug, isPublished: true })
    .select("title slug tagline overview description coverImage applicationStatus")
    .lean();
  if (!cohort) return null;

  const detailPath = `/programs/fellowship/cohorts/${cohort.slug}`;
  const routePath = isApplication ? `${detailPath}/apply` : detailPath;
  const title = isApplication
    ? `Apply for ${cohort.title} | BYBS Fellowship`
    : `${cohort.title} | BYBS Cohorts`;
  const description = descriptionFrom(cohort.tagline, cohort.overview, cohort.description);
  return baseMetadata(routePath, title, description, cohort.coverImage, {
    heading: isApplication ? `Apply for ${cohort.title}` : cohort.title,
    imageAlt: cohort.title,
    noindex: isApplication,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: absoluteUrl(routePath),
        image: imageUrl(cohort.coverImage),
        about: { "@type": "EducationalOrganization", name: SITE_NAME, url: SITE_URL },
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Cohorts", path: "/programs/fellowship/cohorts" },
        { name: cohort.title, path: detailPath },
      ]),
    ],
  });
};

const reflectionMetadata = async (slug) => {
  const reflection = await WeeklyReflectionPrompt.findOne({
    slug,
    status: mongoose.trusted({ $in: ["active", "closed"] }),
  })
    .select("title slug question description weekLabel featuredImage createdAt updatedAt")
    .lean();
  if (!reflection) return null;

  const routePath = `/community/reflections/${reflection.slug}`;
  return baseMetadata(
    routePath,
    `${reflection.title} | BYBS Weekly Reflection`,
    descriptionFrom(reflection.description, reflection.question),
    reflection.featuredImage,
    {
      heading: reflection.question || reflection.title,
      imageAlt: reflection.title,
      type: "article",
      schema: breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Weekly Reflections", path: "/community/reflections" },
        { name: reflection.title, path: routePath },
      ]),
    }
  );
};

const impactMetadata = async (slug) => {
  const story = await CommunityAction.findOne({ slug, status: "published" })
    .select(
      "title slug summary actionDate coverImage seoTitle metaDescription publishedAt createdAt updatedAt"
    )
    .lean();
  if (!story) return null;

  const routePath = `/impact/${story.slug}`;
  const description = descriptionFrom(story.metaDescription, story.summary);
  const image = imageUrl(story.coverImage);
  return baseMetadata(
    routePath,
    story.seoTitle || `${story.title} | BYBS Impact`,
    description,
    image,
    {
      heading: story.title,
      imageAlt: story.title,
      type: "article",
      extraMeta: [
        {
          key: "article:published_time",
          content: isoDate(story.publishedAt || story.actionDate),
        },
        { key: "article:modified_time", content: isoDate(story.updatedAt) },
      ],
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: story.title,
        description,
        image: [image],
        datePublished: story.publishedAt || story.actionDate,
        dateModified: story.updatedAt,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: absoluteUrl(routePath),
      },
    }
  );
};

const resolveMetadata = async (routePath) => {
  let match = routePath.match(/^\/(?:articles|insights)\/([^/]+)\/?$/);
  if (match) return articleMetadata(decodeURIComponent(match[1]));

  match = routePath.match(/^\/shop\/([^/]+)\/?$/);
  if (match) return productMetadata(decodeURIComponent(match[1]));

  match = routePath.match(/^\/impact\/([^/]+)\/?$/);
  if (match) return impactMetadata(decodeURIComponent(match[1]));

  match = routePath.match(/^\/community\/reflections\/([^/]+)\/?$/);
  if (match && match[1] !== "submit") return reflectionMetadata(decodeURIComponent(match[1]));

  match = routePath.match(/^\/programs\/fellowship\/cohorts\/([^/]+)(\/apply)?\/?$/);
  if (match) return cohortMetadata(decodeURIComponent(match[1]), Boolean(match[2]));

  match = routePath.match(/^\/cohorts\/([^/]+)(\/apply)?\/?$/);
  if (match) return cohortMetadata(decodeURIComponent(match[1]), Boolean(match[2]));

  match = routePath.match(/^\/fellowship\/([^/]+)\/apply\/?$/);
  if (match) return cohortMetadata(decodeURIComponent(match[1]), true);

  return null;
};

exports.renderPublicSeoPage = async (req, res) => {
  const requestedUrl = req.get("X-Original-URI") || req.query.path || "/";
  const routePath = new URL(String(requestedUrl), `${SITE_URL}/`).pathname;
  if (routePath.length > 500) return res.status(414).type("text/plain").send("URL is too long");

  const [template, metadata] = await Promise.all([
    fs.readFile(INDEX_PATH, "utf8"),
    resolveMetadata(routePath),
  ]);

  const responseMetadata =
    metadata ||
    baseMetadata(
      routePath,
      "Page not found | Build Your Best Self",
      "This Build Your Best Self page could not be found.",
      DEFAULT_IMAGE,
      { heading: "Page not found", noindex: true }
    );

  res
    .status(metadata ? 200 : 404)
    .type("html")
    .set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400")
    .send(renderSeoHtml(template, responseMetadata));
};

exports.resolveMetadata = resolveMetadata;
