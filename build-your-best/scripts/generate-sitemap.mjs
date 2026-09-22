import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";
import { renderSeoHtml } from "./render-seo-html.mjs";

const loadedEnv = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");
const env = { ...loadedEnv, ...process.env };
const siteUrl = (env.VITE_SITE_URL || env.SITE_URL || "https://buildyourbestself.org").replace(
  /\/$/,
  ""
);
const configuredApiUrl = env.SITEMAP_API_URL || env.API_URL || env.VITE_API_URL || `${siteUrl}/api`;
const apiUrl = new URL(configuredApiUrl, `${siteUrl}/`).toString().replace(/\/$/, "");
const strictMode = env.SITEMAP_STRICT === "true";
const writeSource = process.argv.includes("--source");
const today = new Date().toISOString().slice(0, 10);
const fetchFailures = [];

process.env.VITE_SITE_URL ||= siteUrl;

const {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  SITE_NAME,
  breadcrumbSchema,
  organizationSchema,
  publicRouteSeo,
  stripHtml,
  truncate,
  websiteSchema,
} = await import("../src/lib/seo.js");

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/programs", priority: "0.9", changefreq: "monthly" },
  { path: "/programs/fellowship", priority: "0.9", changefreq: "weekly" },
  { path: "/programs/fellowship/cohorts", priority: "0.8", changefreq: "weekly" },
  { path: "/programs/mentorship", priority: "0.7", changefreq: "monthly" },
  { path: "/programs/empowerher", priority: "0.7", changefreq: "monthly" },
  { path: "/programs/outreach", priority: "0.8", changefreq: "monthly" },
  { path: "/community", priority: "0.9", changefreq: "weekly" },
  { path: "/community/reflections", priority: "0.8", changefreq: "weekly" },
  { path: "/community/stories", priority: "0.7", changefreq: "monthly" },
  { path: "/impact", priority: "0.9", changefreq: "weekly" },
  { path: "/insights", priority: "0.9", changefreq: "weekly" },
  { path: "/get-involved", priority: "0.9", changefreq: "monthly" },
  { path: "/get-involved/volunteer", priority: "0.7", changefreq: "monthly" },
  { path: "/get-involved/mentor", priority: "0.7", changefreq: "monthly" },
  { path: "/get-involved/partner", priority: "0.7", changefreq: "monthly" },
  { path: "/support", priority: "0.8", changefreq: "monthly" },
  { path: "/shop", priority: "0.8", changefreq: "weekly" },
  { path: "/discovery", priority: "0.6", changefreq: "monthly" },
  { path: "/faqs", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const absoluteUrl = (routePath = "/") => {
  if (/^https?:\/\//i.test(routePath)) return routePath;
  return `${siteUrl}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;
};

const imageUrl = (image) => {
  if (Array.isArray(image)) return imageUrl(image[0]);
  const value = typeof image === "string" ? image : image?.url;
  return absoluteUrl(value || DEFAULT_IMAGE);
};

const descriptionFrom = (...values) => {
  const value = values.find((candidate) => stripHtml(candidate || ""));
  return truncate(value || DEFAULT_DESCRIPTION, 160);
};

const fetchJson = async (endpoint) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Sitemap: skipped ${endpoint} (${error.message}).`);
    fetchFailures.push(endpoint);
    return [];
  }
};

const uniqueRoutes = (routes) => {
  const seen = new Map();

  routes.forEach((route) => {
    const key = route.path;
    if (!key || seen.has(key)) return;
    seen.set(key, route);
  });

  return Array.from(seen.values());
};

const buildSitemap = (routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <lastmod>${escapeXml(route.lastmod || today)}</lastmod>
    <changefreq>${escapeXml(route.changefreq || "monthly")}</changefreq>
    <priority>${escapeXml(route.priority || "0.5")}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const staticSchema = (routePath, title, description) => [
  organizationSchema,
  websiteSchema,
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(routePath),
    isPartOf: { "@id": `${siteUrl}/#website` },
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    ...(routePath === "/" ? [] : [{ name: title.split("|")[0].trim(), path: routePath }]),
  ]),
];

const staticSeoRoutes = Object.entries(publicRouteSeo).map(([routePath, seo]) => ({
  path: routePath,
  seo: {
    ...seo,
    canonical: absoluteUrl(routePath),
    description: descriptionFrom(seo.description),
    heading: seo.title.split("|")[0].trim(),
    image: imageUrl(seo.image),
    imageAlt: seo.title.split("|")[0].trim(),
    siteName: SITE_NAME,
    schema: staticSchema(routePath, seo.title, descriptionFrom(seo.description)),
  },
}));

const [articles, products, cohorts, reflections, impactStories] = await Promise.all([
  fetchJson("/articles"),
  fetchJson("/products"),
  fetchJson("/cohorts"),
  fetchJson("/reflections/prompts"),
  fetchJson("/community-actions?limit=50"),
]);

if (strictMode && fetchFailures.length > 0) {
  throw new Error(`Sitemap API requests failed: ${fetchFailures.join(", ")}`);
}

const dynamicRoutes = [
  ...articles
    .filter((article) => article.slug)
    .map((article) => {
      const routePath = `/insights/${article.slug}`;
      const title = article.seoTitle || `${article.title} | BYBS Insights`;
      const description = descriptionFrom(
        article.metaDescription,
        article.excerpt,
        article.description,
        article.content
      );
      const image = imageUrl(article.socialImage?.url || article.coverImage?.url);
      return {
        path: routePath,
        lastmod: article.updatedAt || article.createdAt || today,
        priority: "0.8",
        changefreq: "monthly",
        seo: {
          title,
          description,
          canonical: absoluteUrl(routePath),
          heading: article.title,
          image,
          imageAlt: article.title,
          siteName: SITE_NAME,
          type: "article",
          extraMeta: [
            { key: "article:published_time", content: article.publishedAt || article.createdAt },
            { key: "article:modified_time", content: article.updatedAt },
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
              publisher: { "@id": `${siteUrl}/#organization` },
              mainEntityOfPage: absoluteUrl(routePath),
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Insights", path: "/insights" },
              { name: article.title, path: routePath },
            ]),
          ],
        },
      };
    }),
  ...products
    .filter((product) => product.slug)
    .map((product) => {
      const routePath = `/shop/${product.slug}`;
      const title = `${product.title} | BYBS Shop`;
      const description = descriptionFrom(product.description);
      const image = imageUrl(product.coverImage);
      return {
        path: routePath,
        lastmod: product.updatedAt || product.createdAt || today,
        priority: "0.7",
        changefreq: "weekly",
        seo: {
          title,
          description,
          canonical: absoluteUrl(routePath),
          heading: product.title,
          image,
          imageAlt: product.title,
          siteName: SITE_NAME,
          type: "product",
          schema: [
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              description,
              image: [image],
              sku: product._id,
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
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: product.title, path: routePath },
            ]),
          ],
        },
      };
    }),
  ...cohorts
    .filter((cohort) => cohort.slug)
    .flatMap((cohort) => {
      const detailPath = `/programs/fellowship/cohorts/${cohort.slug}`;
      const description = descriptionFrom(cohort.tagline, cohort.overview, cohort.description);
      const image = imageUrl(cohort.coverImage);
      const detailTitle = `${cohort.title} | BYBS Cohorts`;
      const detail = {
        path: detailPath,
        lastmod: cohort.updatedAt || cohort.createdAt || today,
        priority: "0.7",
        changefreq: "monthly",
        seo: {
          title: detailTitle,
          description,
          canonical: absoluteUrl(detailPath),
          heading: cohort.title,
          image,
          imageAlt: cohort.title,
          siteName: SITE_NAME,
          schema: [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: cohort.title,
              description,
              url: absoluteUrl(detailPath),
              image,
              about: { "@type": "EducationalOrganization", name: SITE_NAME, url: siteUrl },
            },
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Cohorts", path: "/programs/fellowship/cohorts" },
              { name: cohort.title, path: detailPath },
            ]),
          ],
        },
      };
      if (cohort.applicationStatus !== "open") return [detail];

      const applyPath = `${detailPath}/apply`;
      return [
        detail,
        {
          path: applyPath,
          lastmod: cohort.updatedAt || cohort.createdAt || today,
          priority: "0.6",
          changefreq: "monthly",
          seo: {
            ...detail.seo,
            title: `Apply for ${cohort.title} | BYBS Fellowship`,
            canonical: absoluteUrl(applyPath),
            heading: `Apply for ${cohort.title}`,
            noindex: true,
          },
        },
      ];
    }),
  ...reflections
    .filter((reflection) => reflection.slug)
    .map((reflection) => {
      const routePath = `/community/reflections/${reflection.slug}`;
      const description = descriptionFrom(reflection.description, reflection.question);
      return {
        path: routePath,
        lastmod: reflection.updatedAt || reflection.createdAt || today,
        priority: "0.7",
        changefreq: "weekly",
        seo: {
          title: `${reflection.title} | BYBS Weekly Reflection`,
          description,
          canonical: absoluteUrl(routePath),
          heading: reflection.question || reflection.title,
          image: imageUrl(reflection.featuredImage),
          imageAlt: reflection.title,
          siteName: SITE_NAME,
          type: "article",
          schema: breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Weekly Reflections", path: "/community/reflections" },
            { name: reflection.title, path: routePath },
          ]),
        },
      };
    }),
  ...impactStories
    .filter((story) => story.slug)
    .map((story) => {
      const routePath = `/impact/${story.slug}`;
      const description = descriptionFrom(story.metaDescription, story.summary);
      const image = imageUrl(story.coverImage);
      return {
        path: routePath,
        lastmod: story.updatedAt || story.createdAt || today,
        priority: "0.8",
        changefreq: "monthly",
        seo: {
          title: story.seoTitle || `${story.title} | BYBS Impact`,
          description,
          canonical: absoluteUrl(routePath),
          heading: story.title,
          image,
          imageAlt: story.title,
          siteName: SITE_NAME,
          type: "article",
          extraMeta: [
            { key: "article:published_time", content: story.publishedAt || story.actionDate },
            { key: "article:modified_time", content: story.updatedAt },
          ],
          schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description,
            image: [image],
            datePublished: story.publishedAt || story.actionDate,
            dateModified: story.updatedAt,
            author: { "@id": `${siteUrl}/#organization` },
            publisher: { "@id": `${siteUrl}/#organization` },
            mainEntityOfPage: absoluteUrl(routePath),
          },
        },
      };
    }),
];

const sitemapRoutes = uniqueRoutes([...staticRoutes, ...dynamicRoutes]);
const sitemap = buildSitemap(sitemapRoutes);
const targets = [path.resolve("dist/sitemap.xml")];
if (writeSource) targets.push(path.resolve("public/sitemap.xml"));

for (const target of targets) {
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, sitemap, "utf8");
  } catch (error) {
    console.warn(`Sitemap: could not write ${target} (${error.message}).`);
  }
}

const template = await fs.readFile(path.resolve("dist/index.html"), "utf8");
const seoRoutes = uniqueRoutes([...dynamicRoutes, ...staticSeoRoutes]).filter((route) => route.seo);

for (const route of seoRoutes) {
  const relativePath = route.path === "/" ? "" : route.path.replace(/^\/+|\/+$/g, "");
  const target = path.resolve("dist", relativePath, "index.html");
  const renderedHtml = renderSeoHtml(template, route.seo);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, renderedHtml, "utf8");
}

console.log(`Sitemap generated with ${sitemapRoutes.length} URLs.`);
console.log(`Route-specific SEO HTML generated for ${seoRoutes.length} public pages.`);
