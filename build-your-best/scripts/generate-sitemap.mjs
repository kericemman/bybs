import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://buildyourbestself.org").replace(/\/$/, "");
const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || `${siteUrl}/api`).replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

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

const absoluteUrl = (routePath) => `${siteUrl}${routePath.startsWith("/") ? routePath : `/${routePath}`}`;

const fetchJson = async (endpoint) => {
  try {
    const response = await fetch(`${apiUrl}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Sitemap: skipped ${endpoint} (${error.message}).`);
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

const articles = await fetchJson("/articles");
const products = await fetchJson("/products");
const cohorts = await fetchJson("/cohorts");

const dynamicRoutes = [
  ...articles
    .filter((article) => article.slug)
    .map((article) => ({
      path: `/articles/${article.slug}`,
      lastmod: article.updatedAt || article.createdAt || today,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ...products
    .filter((product) => product.slug)
    .map((product) => ({
      path: `/shop/${product.slug}`,
      lastmod: product.updatedAt || product.createdAt || today,
      priority: "0.7",
      changefreq: "weekly",
    })),
  ...cohorts
    .filter((cohort) => cohort.slug)
    .flatMap((cohort) => [
      {
        path: `/cohorts/${cohort.slug}`,
        lastmod: cohort.updatedAt || cohort.createdAt || today,
        priority: "0.7",
        changefreq: "monthly",
      },
      ...(cohort.applicationStatus === "open"
        ? [
            {
              path: `/cohorts/${cohort.slug}/apply`,
              lastmod: cohort.updatedAt || cohort.createdAt || today,
              priority: "0.6",
              changefreq: "monthly",
            },
          ]
        : []),
    ]),
];

const routes = uniqueRoutes([...staticRoutes, ...dynamicRoutes]);
const sitemap = buildSitemap(routes);
const targets = [
  path.resolve("public/sitemap.xml"),
  path.resolve("dist/sitemap.xml"),
];

for (const target of targets) {
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, sitemap, "utf8");
  } catch (error) {
    console.warn(`Sitemap: could not write ${target} (${error.message}).`);
  }
}

console.log(`Sitemap generated with ${routes.length} URLs.`);
