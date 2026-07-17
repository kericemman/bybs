const express = require("express");
const Article = require("../../models/Article");
const Product = require("../../models/Product");
const Cohort = require("../../models/Cohort");

const router = express.Router();

const SITE_URL = (process.env.FRONTEND_URL || process.env.SITE_URL || "https://buildyourbestself.org").replace(/\/$/, "");
const today = () => new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/founder", priority: "0.7", changefreq: "monthly" },
  { path: "/coaching", priority: "0.9", changefreq: "monthly" },
  { path: "/fellowship", priority: "0.9", changefreq: "weekly" },
  { path: "/fellowship/apply", priority: "0.6", changefreq: "monthly" },
  { path: "/fellowship/cohort-4/apply", priority: "0.7", changefreq: "monthly" },
  { path: "/cohorts", priority: "0.8", changefreq: "weekly" },
  { path: "/articles", priority: "0.9", changefreq: "weekly" },
  { path: "/shop", priority: "0.8", changefreq: "weekly" },
  { path: "/charity-merch", priority: "0.8", changefreq: "weekly" },
  { path: "/discovery", priority: "0.6", changefreq: "monthly" },
  { path: "/empowerher", priority: "0.6", changefreq: "monthly" },
  { path: "/outreach", priority: "0.6", changefreq: "monthly" },
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

const absoluteUrl = (path) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const toDate = (value) => {
  if (!value) return today();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? today() : date.toISOString().slice(0, 10);
};

const uniqueRoutes = (routes) => {
  const seen = new Map();
  routes.forEach((route) => {
    if (!route.path || seen.has(route.path)) return;
    seen.set(route.path, route);
  });
  return Array.from(seen.values());
};

const buildSitemap = (routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(absoluteUrl(route.path))}</loc>
    <lastmod>${escapeXml(toDate(route.lastmod))}</lastmod>
    <changefreq>${escapeXml(route.changefreq || "monthly")}</changefreq>
    <priority>${escapeXml(route.priority || "0.5")}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const [articles, products, cohorts] = await Promise.all([
      Article.find({ status: "published" }).select("slug updatedAt createdAt").lean(),
      Product.find().select("slug updatedAt createdAt").lean(),
      Cohort.find({ isPublished: true }).select("slug updatedAt createdAt applicationStatus").lean(),
    ]);

    const dynamicRoutes = [
      ...articles
        .filter((article) => article.slug)
        .map((article) => ({
          path: `/articles/${article.slug}`,
          lastmod: article.updatedAt || article.createdAt,
          priority: "0.8",
          changefreq: "monthly",
        })),
      ...products
        .filter((product) => product.slug)
        .map((product) => ({
          path: `/shop/${product.slug}`,
          lastmod: product.updatedAt || product.createdAt,
          priority: "0.7",
          changefreq: "weekly",
        })),
      ...cohorts
        .filter((cohort) => cohort.slug)
        .flatMap((cohort) => [
          {
            path: `/cohorts/${cohort.slug}`,
            lastmod: cohort.updatedAt || cohort.createdAt,
            priority: "0.7",
            changefreq: "monthly",
          },
          ...(cohort.applicationStatus === "open"
            ? [
                {
                  path: `/cohorts/${cohort.slug}/apply`,
                  lastmod: cohort.updatedAt || cohort.createdAt,
                  priority: "0.6",
                  changefreq: "monthly",
                },
              ]
            : []),
        ]),
    ];

    res.type("application/xml").send(buildSitemap(uniqueRoutes([...staticRoutes, ...dynamicRoutes])));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.type("application/xml").send(buildSitemap(staticRoutes));
  }
});

router.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout
Disallow: /payment/success

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/api/sitemap.xml
`);
});

module.exports = router;
